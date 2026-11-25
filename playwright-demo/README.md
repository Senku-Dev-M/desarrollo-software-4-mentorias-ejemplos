# Pruebas automatizadas con Playwright: Frontend, Backend e Integración

Aplicación de gestión de productos pensada para demostrar y practicar pruebas automatizadas con **Playwright Test** y **TypeScript**, separando pruebas de API, pruebas aisladas de interfaz y flujos de integración de extremo a extremo.

## Tecnologías utilizadas

- **Frontend:** HTML5, CSS3 y JavaScript puro, servido con Vite.
- **Backend:** C# con ASP.NET Core Web API sobre .NET 10 y almacenamiento en memoria.
- **Pruebas:** Playwright Test y TypeScript con Page Object Model, fixtures personalizados y simulación de red.
- **Navegador:** Chromium.

## Estructura del proyecto

```text
playwright-demo/
├── backend/
│   └── ProductApi/
│       ├── ProductApi.csproj
│       ├── Program.cs
│       ├── Product.cs
│       └── ProductStore.cs
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── tests/
│   ├── backend/
│   │   ├── health.spec.ts
│   │   ├── get-products.spec.ts
│   │   ├── create-product.spec.ts
│   │   ├── update-product.spec.ts
│   │   └── delete-product.spec.ts
│   ├── frontend/
│   │   ├── catalog-view.spec.ts
│   │   ├── create-product.spec.ts
│   │   └── delete-product.spec.ts
│   ├── integration/
│   │   ├── create-product.spec.ts
│   │   └── delete-product.spec.ts
│   ├── fixtures/
│   │   └── test.ts
│   ├── pages/
│   │   └── products.page.ts
│   └── support/
│       ├── api-client.ts
│       ├── mock-api.ts
│       ├── test-data.ts
│       └── types.ts
├── docs/
│   └── guia-playwright.md
├── package.json
├── playwright.config.ts
└── tsconfig.json
```

## Requisitos previos

Antes de ejecutar el proyecto, asegúrate de contar con:

1. **.NET 10 SDK**
2. **Node.js 20.19 o superior** (o **22.12 o superior**) y npm
3. **Chromium de Playwright**

Puedes comprobar tus versiones instaladas con:

```bash
dotnet --version
node --version
npm --version
```

## Instalación inicial

Desde la carpeta raíz del proyecto, instala las dependencias de Node.js y descarga el navegador Chromium administrado por Playwright:

```bash
npm install
npx playwright install chromium
```

## Cómo ejecutar las pruebas

La configuración en `playwright.config.ts` inicia automáticamente tanto la API de .NET (`http://127.0.0.1:5080`) como el servidor de Vite (`http://127.0.0.1:5173`) si no están corriendo, y reutiliza los procesos existentes si ya los iniciaste manualmente.

### Ejecutar toda la suite

```bash
npm test
```

### Ejecutar por nivel de prueba

| Comando | Proyecto | Qué valida | Navegador | Backend real |
|---|---|---|---|---|
| `npm run test:backend` | `backend` | Endpoints HTTP, validaciones y códigos de estado | No | Sí |
| `npm run test:frontend` | `frontend` | Renderizado, formulario y manejo de errores en UI | Sí | No (usa mocks) |
| `npm run test:integration` | `integration` | Flujo completo entre navegador y API real | Sí | Sí |

### Modos adicionales y depuración

Ejecutar un archivo específico:

```bash
npx playwright test tests/backend/create-product.spec.ts
```

Ejecutar mostrando el navegador en pantalla:

```bash
npm run test:headed
```

Abrir la interfaz visual interactiva de Playwright:

```bash
npm run test:ui
```

Verificar tipos de TypeScript en las pruebas y configuración:

```bash
npm run typecheck
```

Abrir el último reporte HTML generado:

```bash
npm run report
```

## Cómo ejecutar la aplicación manualmente

Si deseas explorar la interfaz y la API de forma manual en paralelo, abre dos terminales en la raíz del proyecto.

### Terminal 1: Backend (.NET 10)

```bash
dotnet run --no-launch-profile --project backend/ProductApi/ProductApi.csproj --urls http://127.0.0.1:5080
```

Endpoints disponibles:

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/` | Metadatos del servicio |
| `GET` | `/api/health` | Estado de salud de la API |
| `GET` | `/api/products` | Listar todos los productos |
| `GET` | `/api/products/{id}` | Obtener un producto por ID |
| `POST` | `/api/products` | Crear un producto nuevo |
| `PUT` | `/api/products/{id}` | Actualizar un producto existente |
| `DELETE` | `/api/products/{id}` | Eliminar un producto |

### Terminal 2: Frontend (Vite)

```bash
npm run dev
```

La aplicación web quedará disponible en `http://127.0.0.1:5173`.

## Persistencia de datos

El backend almacena los productos en memoria mediante `ProductStore` e inicia con dos registros por defecto (`Laptop` y `Mouse`). Las pruebas de backend e integración generan nombres únicos por ejecución y eliminan automáticamente los productos creados durante su limpieza (`cleanup`), evitando interferencias entre pruebas en paralelo.

## Documentación adicional

Consulta [docs/guia-playwright.md](docs/guia-playwright.md) para revisar cómo funcionan los principales métodos de Playwright (`goto`, localizadores, aserciones, mocks de red, pruebas de API, Page Objects y fixtures) aplicados en este proyecto.

## Solución rápida de problemas

- **Playwright indica que falta Chromium:** ejecuta `npx playwright install chromium`.
- **Puertos ocupados (`5080` o `5173`):** detén los procesos que estén usando esos puertos antes de iniciar los servidores manualmente o ejecutar las pruebas.
- **Error de certificado TLS al descargar Chromium en redes corporativas:** ejecuta `npx playwright install chromium` definiendo `NODE_OPTIONS=--use-system-ca` en tu terminal para utilizar los certificados raíz del sistema operativo.
