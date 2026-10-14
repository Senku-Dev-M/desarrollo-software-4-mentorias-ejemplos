import { GameList } from "../components/GameList.js";

export function StorePage({ games, wishlistIds }) {
  return `
    <main class="page">
      <header class="page-heading">
        <div>
          <p>CATÁLOGO</p>
          <h1>Juegos destacados</h1>
        </div>
        <span>${games.length} juegos</span>
      </header>

      ${GameList({
        games,
        wishlistIds,
        emptyState: {
          title: "No hay juegos",
          message: "Agrega juegos al archivo de datos para mostrarlos aquí.",
        },
      })}
    </main>
  `;
}
