export function AppHeader({ currentPage, wishlistCount }) {
  const storeIsActive = currentPage === "store" || currentPage === "details";

  return `
    <header class="app-header">
      <button class="brand" type="button" data-page="store" aria-label="Ir a la tienda">
        <span class="brand__icon" aria-hidden="true">G</span>
        <strong>GAME SHELF</strong>
      </button>

      <nav aria-label="Navegación principal">
        <button
          type="button"
          data-page="store"
          class="${storeIsActive ? "is-active" : ""}"
          ${storeIsActive ? 'aria-current="page"' : ""}
        >
          Tienda
        </button>
        <button
          type="button"
          data-page="wishlist"
          class="${currentPage === "wishlist" ? "is-active" : ""}"
          ${currentPage === "wishlist" ? 'aria-current="page"' : ""}
        >
          Lista de deseos <span>${wishlistCount}</span>
        </button>
      </nav>
    </header>
  `;
}
