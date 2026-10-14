export function AppHeader({ currentPage, favoriteCount }) {
  return `
    <header class="app-header">
      <a class="brand" href="#" data-page="home" aria-label="Ir al inicio">
        <span class="brand__mark" aria-hidden="true">UI</span>
        <span><strong>Taller de componentes</strong><small>Vanilla JavaScript</small></span>
      </a>

      <nav aria-label="Navegación principal">
        <button
          type="button"
          data-page="home"
          class="${currentPage === "home" ? "is-active" : ""}"
          ${currentPage === "home" ? 'aria-current="page"' : ""}
        >
          Todos
        </button>
        <button
          type="button"
          data-page="favorites"
          class="${currentPage === "favorites" ? "is-active" : ""}"
          ${currentPage === "favorites" ? 'aria-current="page"' : ""}
        >
          Favoritos <span class="nav-count">${favoriteCount}</span>
        </button>
      </nav>
    </header>
  `;
}
