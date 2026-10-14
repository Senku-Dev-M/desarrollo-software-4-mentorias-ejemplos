import { GameCover } from "./GameCover.js";
import { escapeHtml } from "../utils/escapeHtml.js";

export function GameCard({ game, isWishlisted }) {
  return `
    <article class="game-card">
      <button
        class="game-card__cover-button"
        type="button"
        data-action="view-details"
        data-game-id="${game.id}"
        aria-label="Ver detalles de ${escapeHtml(game.title)}"
      >
        ${GameCover({ game })}
      </button>

      <div class="game-card__content">
        <button
          class="game-card__title"
          type="button"
          data-action="view-details"
          data-game-id="${game.id}"
        >
          ${escapeHtml(game.title)}
        </button>
        <p>${escapeHtml(game.genre)}</p>
        <div class="game-card__footer">
          <strong>${escapeHtml(game.price)}</strong>
          <button
            class="wishlist-button ${isWishlisted ? "is-added" : ""}"
            type="button"
            data-action="toggle-wishlist"
            data-game-id="${game.id}"
            aria-pressed="${isWishlisted}"
          >
            ${isWishlisted ? "✓ En tu lista" : "+ Lista de deseos"}
          </button>
        </div>
      </div>
    </article>
  `;
}
