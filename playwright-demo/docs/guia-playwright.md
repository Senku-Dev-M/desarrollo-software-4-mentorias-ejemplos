# Guía de Playwright en este proyecto

Esta guía explica los conceptos clave de **Playwright Test** y los métodos utilizados dentro de la suite de pruebas del proyecto, desde navegación y localizadores hasta interceptación de red, pruebas de API, Page Objects y fixtures.

## 1. Arquitectura de las pruebas

La suite está organizada por responsabilidades para evitar duplicación de código y mantener las pruebas fáciles de leer:

- `tests/backend/`: pruebas directas contra la API REST sin abrir navegador.
- `tests/frontend/`: pruebas de interfaz en Chromium aislando la API mediante respuestas simuladas.
- `tests/integration/`: pruebas de extremo a extremo que conectan el navegador real con el backend real.
- `tests/pages/`: clases **Page Object Model (POM)** que encapsulan selectores y acciones de la interfaz.
- `tests/fixtures/`: extensiones de `test` para inyectar páginas, clientes de API y limpieza automática.
- `tests/support/`: utilidades compartidas como cliente HTTP tipado, simuladores de red, tipos y generadores de datos.

## 2. Estructura básica de un archivo de pruebas

Cada archivo `.spec.ts` agrupa escenarios relacionados con `test.describe()` y define casos individuales con `test()`:

```ts
import { test, expect } from "../fixtures/test";

test.describe("Product catalog page", () => {
  test("shows an empty state message when the catalog has no items", async ({
    page,
    productsPage
  }) => {
    await productsPage.goto();

    await expect(productsPage.emptyState).toBeVisible();
  });
});
```

- `test.describe()`: agrupa escenarios de una misma funcionalidad para organizar los reportes.
- `test()`: recibe un objeto con los **fixtures** necesarios (`page`, `request`, `productsPage`, `productsApi`).
- `expect()`: evalúa aserciones sobre elementos del DOM o sobre valores y respuestas HTTP.

## 3. Navegación y sincronización de página (`page`)

El fixture `page` representa una pestaña aislada del navegador para cada prueba.

### `page.goto(url)`

Navega hacia una URL. Como `baseURL` está configurado en `playwright.config.ts` (`http://127.0.0.1:5173`), basta con indicar la ruta relativa:

```ts
await page.goto("/");
```

`goto()` espera automáticamente a que el documento cargue antes de continuar con la siguiente línea.

### `page.reload()`

Recarga la página actual. Resulta muy útil en pruebas de integración para confirmar que los datos creados realmente quedaron guardados en el backend y vuelven a mostrarse tras refrescar el navegador:

```ts
await page.reload();
await expect(productsPage.productItem(candidate.name)).toBeVisible();
```

### `page.waitForResponse(predicate)`

Espera a que ocurra una respuesta HTTP específica desencadenada por una acción de la interfaz. Se crea la promesa **antes** de hacer clic o enviar el formulario para no perder la respuesta por condiciones de carrera:

```ts
const createResponsePromise = page.waitForResponse(
  (response) =>
    response.url().includes("/api/products") &&
    response.request().method() === "POST"
);

await productsPage.createProduct(candidate.name, candidate.price);

const createResponse = await createResponsePromise;
expect(createResponse.status()).toBe(201);
```

## 4. Localizadores recomendados

Playwright recomienda localizar elementos de la misma forma en que los identifica una persona usuaria (por rol accesible, etiqueta o texto visible), en lugar de depender de clases CSS frágiles.

| Método | Cuándo usarlo | Ejemplo |
|---|---|---|
| `page.getByRole()` | Botones, encabezados, listas, mensajes de estado | `page.getByRole("button", { name: "Guardar producto" })` |
| `page.getByLabel()` | Campos de formulario asociados a un `<label>` | `page.getByLabel("Nombre del producto")` |
| `page.getByText()` | Textos o estados visibles en pantalla | `page.getByText("No hay productos registrados.")` |
| `locator.filter()` | Reducir una lista de elementos a un ítem concreto | `items.filter({ has: deleteButton })` |
| `page.locator()` | Selectores CSS específicos cuando no existe rol accesible | `page.locator("#product-form")` |

Los localizadores son **perezosos**: no buscan el elemento en el momento en que se declaran, sino cuando se ejecuta una acción (`.click()`) o una aserción (`toBeVisible()`).

## 5. Interacciones con elementos

Playwright realiza comprobaciones automáticas antes de interactuar con un elemento (verifica que exista, sea visible, esté habilitado y no esté cubierto por otro elemento).

### `locator.fill(value)`

Limpia el campo y escribe el texto indicado:

```ts
await page.getByLabel("Nombre del producto").fill("Studio Headphones");
await page.getByLabel("Precio (Bs)").fill("420.5");
```

### `locator.click()`

Simula un clic real sobre botones o enlaces:

```ts
await page.getByRole("button", { name: "Guardar producto" }).click();
```

### `locator.evaluate(fn)`

Ejecuta una función dentro del navegador sobre el nodo DOM seleccionado. En el proyecto se utiliza para comprobar la validación nativa HTML5 (`checkValidity()`):

```ts
const isFormValid = await productsPage.nameInput.evaluate((input) =>
  (input as HTMLInputElement).checkValidity()
);
expect(isFormValid).toBe(false);
```

## 6. Aserciones con auto-espera (`expect`)

Las aserciones sobre `Locator` son asíncronas y reintentan automáticamente hasta que la condición se cumple o vence el tiempo límite.

- `await expect(locator).toBeVisible()`: el elemento está visible en pantalla.
- `await expect(locator).toBeHidden()`: el elemento desapareció o está oculto.
- `await expect(locator).toBeEnabled()`: el botón o campo permite interacción.
- `await expect(locator).toHaveText(text)`: el texto exacto coincide.
- `await expect(locator).toContainText(textOrRegex)`: contiene cierto texto o patrón.
- `await expect(locator).toHaveValue(value)`: verifica el valor actual de un `<input>`.
- `await expect(locator).toHaveAttribute(name, value)`: valida atributos HTML como `data-state="success"`.
- `await expect(locator).toHaveCount(n)`: confirma la cantidad exacta de elementos en una lista.

Para valores ya resueltos en memoria (códigos de estado HTTP, objetos JSON o conteos), se usan aserciones síncronas como `expect(status).toBe(201)` o `expect(payload).toEqual(...)`.

## 7. Interceptación de red y simulación (`page.route`)

Las pruebas de `tests/frontend/` no dependen del backend real. Usan `page.route()` para interceptar las peticiones que hace `frontend/app.js` y responder con datos controlados:

```ts
await page.route(/\/api\/products(?:\/(\d+))?$/, async (route) => {
  if (route.request().method() === "GET") {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([{ id: 101, name: "Laptop Pro", price: 2500 }])
    });
    return;
  }

  await route.continue();
});
```

Métodos principales dentro del manejador de ruta:

- `route.fulfill(...)`: responde inmediatamente con el código HTTP, encabezados y cuerpo definidos por la prueba.
- `route.continue()`: deja que la solicitud continúe hacia el servidor real.
- `route.abort()`: simula fallos de red o pérdida de conexión.
- `route.request().postDataJSON()`: lee el cuerpo JSON enviado por el navegador para validar lo que mandó el formulario.

En este repositorio, la función `stubProductsApi()` en `tests/support/mock-api.ts` centraliza esa lógica con un catálogo en memoria para simular escenarios de carga vacía, creación, eliminación y errores HTTP `400` o `500`.

## 8. Pruebas de API sin navegador (`request`)

Playwright incluye `APIRequestContext` mediante el fixture `request`. Permite probar endpoints HTTP directamente sin levantar Chromium, por lo que las pruebas de backend se ejecutan en milisegundos:

- `request.get(url)`: consulta recursos (`GET`).
- `request.post(url, { data })`: envía cuerpos JSON para crear recursos (`POST`).
- `request.put(url, { data })`: actualiza recursos (`PUT`).
- `request.delete(url)`: elimina recursos (`DELETE`).

Sobre el objeto `APIResponse` devuelto puedes inspeccionar:

- `response.status()`: código de estado HTTP (`200`, `201`, `204`, `400`, `404`).
- `response.headers()`: encabezados de respuesta (por ejemplo `location` al crear un producto).
- `response.json()`: parsea la respuesta JSON.
- `response.text()`: lee el cuerpo como texto plano (útil para comprobar respuestas vacías en `204 No Content`).

En `tests/support/api-client.ts`, la clase `ProductsApiClient` envuelve estas operaciones y registra los IDs creados para eliminarlos automáticamente al terminar cada prueba.

## 9. Page Object Model y Fixtures personalizados

Para evitar repetir selectores y limpieza manual en cada archivo, el proyecto combina dos patrones estándar de Playwright:

1. **Page Object Model (`tests/pages/products.page.ts`):** agrupa todos los localizadores y flujos frecuentes de la página en `ProductsPage` (`goto()`, `createProduct()`, `deleteProduct()`, `productItem()`). Si cambia un texto o estructura en `index.html`, solo se ajusta un archivo.
2. **Fixtures (`tests/fixtures/test.ts`):** amplían el `test` base con `test.extend()` para entregar `productsPage` y `productsApi` listos para usar, ejecutando `await client.cleanup()` automáticamente después de cada prueba.

```ts
export const test = base.extend<AppFixtures>({
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  productsApi: async ({ request }, use) => {
    const client = new ProductsApiClient(request);
    await use(client);
    await client.cleanup();
  }
});
```

## 10. Configuración de reportes y trazas

En `playwright.config.ts` están habilitadas herramientas clave para diagnosticar fallos:

- `trace: "retain-on-failure"`: guarda la traza interactiva paso a paso únicamente cuando una prueba falla.
- `screenshot: "only-on-failure"`: captura la pantalla en el punto exacto del error.
- `video: "retain-on-failure"`: conserva la grabación de video solo en ejecuciones fallidas.
- `reporter`: muestra el progreso en consola (`list`) y genera un reporte navegable en `playwright-report/` (`html`).
