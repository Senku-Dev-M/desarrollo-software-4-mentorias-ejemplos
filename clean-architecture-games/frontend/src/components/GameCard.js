/**
 * Component representing a single Game Card in the catalog grid.
 */
export class GameCard {
    /**
     * @param {import('../models/Game.js').Game} game
     * @param {{ onDelete: (game: any) => void }} callbacks
     * @returns {HTMLElement}
     */
    static render(game, { onDelete }) {
        const card = document.createElement("article");
        card.className = "game-card";
        card.dataset.id = game.id;

        card.innerHTML = `
            <div class="card-header">
                <span class="genre-badge">${escapeHtml(game.genre)}</span>
                <span class="price-tag">${escapeHtml(game.formattedPrice)}</span>
            </div>
            <div class="card-body">
                <h3 class="game-title">
                    <a href="#/games/${game.id}" class="title-link" title="View details of ${escapeHtml(game.name)}">
                        ${escapeHtml(game.name)}
                    </a>
                </h3>
                <div class="game-meta">
                    <span class="meta-item developer">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        ${escapeHtml(game.developer)}
                    </span>
                    <span class="meta-item year">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        ${game.releaseYear}
                    </span>
                </div>
            </div>
            <div class="card-actions">
                <a href="#/games/${game.id}" class="btn btn-secondary btn-sm" title="View Details">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    Details
                </a>
                <div class="action-buttons-group">
                    <a href="#/games/${game.id}/edit" class="btn btn-outline btn-sm" title="Edit Game">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        Edit
                    </a>
                    <button type="button" class="btn btn-danger-outline btn-sm btn-delete" title="Delete Game">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        Delete
                    </button>
                </div>
            </div>
        `;

        card.querySelector(".btn-delete")?.addEventListener("click", () => onDelete(game));

        return card;
    }
}

function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
