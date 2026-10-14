import { GameCover } from "../components/GameCover.js";
import { escapeHtml } from "../utils/escapeHtml.js";

export function GameDetailsPage({ game, isWishlisted }) {
  if (!game) return "";

  return `
    <main class="page details-page">
      <button class="back-button" type="button" data-page="store">← Volver a la tienda</button>

      <section class="game-details">
        ${GameCover({ game, size: "details" })}

        <div class="game-details__content">
          <p class="game-details__genre">${escapeHtml(game.genre)}</p>
          <h1>${escapeHtml(game.title)}</h1>
          <p class="game-details__description">${escapeHtml(game.description)}</p>

          <dl>
            <div><dt>Desarrollador</dt><dd>${escapeHtml(game.developer)}</dd></div>
            <div><dt>Lanzamiento</dt><dd>${escapeHtml(game.releaseDate)}</dd></div>
          </dl>

          <div class="purchase-panel">
            <strong>${escapeHtml(game.price)}</strong>
            <button
              type="button"
              data-action="toggle-wishlist"
              data-game-id="${game.id}"
              aria-pressed="${isWishlisted}"
            >
              ${isWishlisted ? "✓ Quitar de mi lista" : "+ Agregar a mi lista"}
            </button>
          </div>
        </div>
      </section>
    </main>
  `;
}
