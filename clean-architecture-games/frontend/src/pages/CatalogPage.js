import { GameCard } from "../components/GameCard.js";
import { Modal } from "../components/Modal.js";
import { Toast } from "../components/Toast.js";

/**
 * SPA Page: Catalog of Games (route: #/ or #/games)
 */
export class CatalogPage {
    /**
     * @param {import('../viewmodels/GameListViewModel.js').GameListViewModel} viewModel
     * @param {import('../router/Router.js').Router} router
     */
    constructor(viewModel, router) {
        this.viewModel = viewModel;
        this.router = router;
        this.modalView = new Modal();
        this.container = document.createElement("div");
        this.container.className = "page-catalog";
    }

    async render() {
        this.#updateDOM();
        const unsubscribe = this.viewModel.subscribe(() => this.#updateDOM());

        // Initial fetch or reload if games list is empty
        if (this.viewModel.games.length === 0 && !this.viewModel.isLoading) {
            this.viewModel.loadGames();
        }

        return () => {
            unsubscribe();
            this.modalView.close();
        };
    }

    #updateDOM() {
        this.container.innerHTML = `
            <section class="catalog-section">
                <!-- Page Header -->
                <div class="page-header-row">
                    <div>
                        <h1 class="page-title">Games Catalog</h1>
                        <p class="page-description">Explore, manage, and inspect games in the vault.</p>
                    </div>
                    <a href="#/games/new" class="btn btn-primary">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        New Game
                    </a>
                </div>

                <!-- Filters Bar -->
                <div class="filters-bar">
                    <div class="search-box">
                        <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input
                            type="search"
                            id="search-input"
                            class="search-input"
                            placeholder="Search by title, developer, or genre..."
                            value="${escapeHtml(this.viewModel.searchTerm)}"
                        />
                    </div>
                    <div class="filter-controls">
                        <select id="genre-filter" class="genre-select">
                            <option value="ALL" ${this.viewModel.selectedGenre === "ALL" ? "selected" : ""}>All Genres</option>
                            ${this.viewModel.genres.map(genre => `
                                <option value="${escapeHtml(genre)}" ${this.viewModel.selectedGenre.toLowerCase() === genre.toLowerCase() ? "selected" : ""}>
                                    ${escapeHtml(genre)}
                                </option>
                            `).join("")}
                        </select>
                        <button type="button" class="btn btn-secondary btn-icon" id="btn-refresh" title="Reload Catalog">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="23 4 23 10 17 10"></polyline>
                                <polyline points="1 20 1 14 7 14"></polyline>
                                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Content Grid / States -->
                <div class="catalog-content">
                    ${this.#renderContent()}
                </div>
            </section>
        `;

        this.#bindEvents();
    }

    #renderContent() {
        if (this.viewModel.isLoading) {
            return `
                <div class="state-container loading-state">
                    <div class="spinner"></div>
                    <p class="state-title">Loading games...</p>
                    <p class="state-desc">Fetching catalog from Clean Architecture API</p>
                </div>
            `;
        }

        if (this.viewModel.errorMessage) {
            return `
                <div class="state-container error-state">
                    <div class="state-icon error-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                    </div>
                    <p class="state-title">Connection Error</p>
                    <p class="state-desc">${escapeHtml(this.viewModel.errorMessage)}</p>
                    <button type="button" class="btn btn-primary" id="btn-retry">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="23 4 23 10 17 10"></polyline>
                            <polyline points="1 20 1 14 7 14"></polyline>
                            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                        </svg>
                        Retry Connection
                    </button>
                </div>
            `;
        }

        const filtered = this.viewModel.filteredGames;

        if (filtered.length === 0) {
            const isSearching = Boolean(this.viewModel.searchTerm || this.viewModel.selectedGenre !== "ALL");
            return `
                <div class="state-container empty-state">
                    <div class="state-icon empty-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                            <line x1="6" y1="12" x2="10" y2="12"></line>
                            <line x1="8" y1="10" x2="8" y2="14"></line>
                            <circle cx="15" cy="11" r="1"></circle>
                            <circle cx="17" cy="13" r="1"></circle>
                        </svg>
                    </div>
                    <p class="state-title">${isSearching ? "No matching games found" : "No games in catalog yet"}</p>
                    <p class="state-desc">${isSearching ? "Try adjusting your search terms or genre filter." : "Start building your collection by adding your first game."}</p>
                    ${!isSearching ? `
                        <a href="#/games/new" class="btn btn-primary">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Add Your First Game
                        </a>
                    ` : ""}
                </div>
            `;
        }

        return `<div class="games-grid" id="games-grid-container"></div>`;
    }

    #bindEvents() {
        const searchInput = this.container.querySelector("#search-input");
        searchInput?.addEventListener("input", (e) => {
            this.viewModel.setSearchTerm(e.target.value);
        });

        const genreSelect = this.container.querySelector("#genre-filter");
        genreSelect?.addEventListener("change", (e) => {
            this.viewModel.setSelectedGenre(e.target.value);
        });

        this.container.querySelector("#btn-refresh")?.addEventListener("click", () => {
            this.viewModel.loadGames();
        });

        this.container.querySelector("#btn-retry")?.addEventListener("click", () => {
            this.viewModel.loadGames();
        });

        const gridContainer = this.container.querySelector("#games-grid-container");
        if (gridContainer) {
            const filtered = this.viewModel.filteredGames;
            filtered.forEach(game => {
                const card = GameCard.render(game, {
                    onDelete: (g) => this.#confirmDelete(g)
                });
                gridContainer.appendChild(card);
            });
        }
    }

    #confirmDelete(game) {
        this.modalView.setTitle("Confirm Deletion");

        const box = document.createElement("div");
        box.innerHTML = `
            <p style="margin-bottom: 1.25rem; font-size: 1rem; color: var(--color-text-primary);">
                Are you sure you want to delete <strong>"${escapeHtml(game.name)}"</strong>?
            </p>
            <p style="margin-bottom: 1.5rem; font-size: 0.875rem; color: var(--color-text-secondary);">
                This will permanently remove the record from the database.
            </p>
            <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
                <button type="button" class="btn btn-outline" id="btn-cancel-del">Cancel</button>
                <button type="button" class="btn btn-primary" id="btn-confirm-del" style="background-color: var(--color-danger); border-color: var(--color-danger);">
                    Delete Game
                </button>
            </div>
        `;

        box.querySelector("#btn-cancel-del")?.addEventListener("click", () => {
            this.modalView.close();
        });

        box.querySelector("#btn-confirm-del")?.addEventListener("click", async () => {
            this.modalView.close();
            const res = await this.viewModel.deleteGame(game.id);
            if (res.success) {
                Toast.success(`Game "${game.name}" was deleted.`);
            } else {
                Toast.error(res.error || "Failed to delete game.");
            }
        });

        this.modalView.setContent(box);
        this.modalView.open();
    }

    getElement() {
        return this.container;
    }
}

function escapeHtml(str) {
    if (!str) return "";
    return String(str).replace(/[&<>"']/g, m => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    })[m]);
}
