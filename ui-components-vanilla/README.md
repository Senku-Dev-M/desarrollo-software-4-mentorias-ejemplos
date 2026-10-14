# Componentes UI con Vanilla JavaScript

Ejemplo educativo y pequeño para aprender a organizar una interfaz en
**componentes** y **páginas** sin usar React, Vue ni otro framework.

La aplicación imita un catálogo sencillo de videojuegos: permite ver la
tienda, abrir el detalle de cada juego y agregarlo a una lista de deseos. Los
juegos son ficticios y viven en un archivo local.

## Qué enseña

- crear un componente como una función;
- pasarle datos mediante un objeto de propiedades o `props`;
- componer un componente usando otros componentes;
- reutilizar `GameCard` en la tienda y en la lista de deseos;
- abrir una página de detalle con el juego seleccionado;
- actualizar la UI cuando cambia un estado pequeño.

## Estructura

```text
src/
├── components/
│   ├── AppHeader.js
│   ├── EmptyState.js
│   ├── GameCard.js
│   ├── GameCover.js
│   └── GameList.js
├── pages/
│   ├── GameDetailsPage.js
│   ├── StorePage.js
│   └── WishlistPage.js
├── data/games.js
├── utils/escapeHtml.js
├── main.js
└── styles.css
```

## 1. Componente con datos

`GameCard` recibe un juego y un booleano. Esos datos cambian lo que muestra el
componente:

```js
GameCard({
  game,
  isWishlisted: wishlistIds.has(game.id),
});
```

## 2. Componente dentro de otro componente

`GameList` recorre los datos y crea una tarjeta por cada juego. `GameCard`, a su
vez, utiliza `GameCover`.

```text
GameList → GameCard → GameCover
```

## 3. Reutilización en páginas

Tanto `StorePage` como `WishlistPage` utilizan `GameList`. La página de deseos
solo filtra los datos antes de pasarlos al mismo componente.

```text
main.js
   ├── StorePage ─────┐
   ├── WishlistPage ──┴── GameList ── GameCard
   └── GameDetailsPage ─────────────── GameCover
```

## 4. Estado y eventos

`main.js` conserva tres datos: página actual, juego seleccionado e
identificadores de la lista de deseos. Cada clic modifica ese estado y vuelve a
ejecutar `render()`.

No hay router ni almacenamiento. Al recargar la página, la lista vuelve a estar
vacía. Esto es intencional para mantener el ejemplo fácil de leer.

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

Las pruebas llaman directamente a los componentes y las páginas porque son
funciones puras: reciben datos y devuelven HTML.
