import { GameList } from "../components/GameList.js";

export function WishlistPage({ games, wishlistIds }) {
  const wishlistedGames = games.filter((game) => wishlistIds.has(game.id));

  return `
    <main class="page">
      <header class="page-heading">
        <div>
          <p>TU COLECCIÓN</p>
          <h1>Lista de deseos</h1>
        </div>
        <span>${wishlistedGames.length} guardados</span>
      </header>

      ${GameList({
        games: wishlistedGames,
        wishlistIds,
        emptyState: {
          title: "Tu lista está vacía",
          message: "Agrega un juego desde la tienda y aparecerá aquí.",
        },
      })}
    </main>
  `;
}
