import { escapeHtml } from "../utils/escapeHtml.js";

export function GameCover({ game, size = "card" }) {
  return `
    <div class="game-cover game-cover--${escapeHtml(game.color)} game-cover--${escapeHtml(size)}">
      <span>${escapeHtml(game.symbol)}</span>
      <small>${escapeHtml(game.genre)}</small>
    </div>
  `;
}
