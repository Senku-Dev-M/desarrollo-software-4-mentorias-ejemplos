# Componentes UI con Vanilla JavaScript

Ejemplo educativo y pequeño para entender cómo organizar una interfaz en
**componentes** y **páginas** sin usar React, Vue ni otro framework.

La aplicación muestra temas de aprendizaje. Una tarjeta puede guardarse como
favorita y el mismo componente vuelve a utilizarse en la página de favoritos.
Los datos viven localmente para mantener la atención en la composición de UI.

## Qué enseña

- crear un componente como una función;
- pasar datos mediante un objeto de propiedades o `props`;
- componer un componente usando otros componentes;
- construir páginas a partir de componentes reutilizables;
- actualizar la interfaz cuando cambia un estado pequeño.

## Estructura

```text
src/
├── components/          # Piezas reutilizables de la interfaz
│   ├── AppHeader.js
│   ├── CategoryBadge.js
│   ├── CourseCard.js
│   ├── CourseGrid.js
│   ├── EmptyState.js
│   └── PageIntro.js
├── pages/               # Pantallas que combinan componentes
│   ├── FavoritesPage.js
│   └── HomePage.js
├── data/courses.js      # Datos del ejemplo
├── utils/escapeHtml.js  # Utilidad compartida
├── main.js              # Estado, eventos y renderizado
└── styles.css
```

## 1. Crear un componente

Un componente es una función que recibe datos y devuelve una parte de la UI:

```js
export function CategoryBadge({ label }) {
  return `<span class="category-badge">${label}</span>`;
}
```

## 2. Pasarle datos

`CourseCard` recibe un curso y un valor que indica si está guardado:

```js
CourseCard({
  course,
  isFavorite: favoriteIds.has(course.id),
});
```

El mismo código produce tarjetas distintas porque los datos cambian.

## 3. Reutilizarlo en páginas

`HomePage` y `FavoritesPage` utilizan `CourseGrid`. A su vez, `CourseGrid`
utiliza `CourseCard` por cada elemento. La página de favoritos solo filtra los
datos antes de pasarlos al componente.

```text
main.js
   ├── HomePage ───────┐
   └── FavoritesPage ──┴── CourseGrid ── CourseCard ── CategoryBadge
```

Las páginas no duplican el HTML de las tarjetas.

## 4. Actualizar la interfaz

`main.js` conserva dos datos de estado: la página actual y los identificadores
favoritos. Al hacer clic, modifica el estado y llama otra vez a `render()`.
Este enfoque es intencionalmente básico para mostrar el ciclo completo sin
ocultarlo detrás de un framework.

## Ejecutar

Requiere Node.js `20.19+` o `22.12+`.

```bash
npm install
npm run dev
```

Vite mostrará la dirección local, normalmente `http://localhost:5173`.

## Verificar

```bash
npm test
npm run build
```

Las pruebas llaman directamente a componentes y páginas porque son funciones
puras: reciben datos y devuelven HTML.

## Límites intencionales

No incluye API, base de datos, router, autenticación ni persistencia. Al
recargar el navegador se limpian los favoritos. Son decisiones conscientes
para que el ejemplo se pueda leer y explicar rápidamente.
