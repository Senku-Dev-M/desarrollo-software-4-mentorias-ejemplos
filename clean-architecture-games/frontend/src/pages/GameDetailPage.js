import { Modal } from "../components/Modal.js";
import { Toast } from "../components/Toast.js";

/**
 * SPA Page: Game Detailed Specifications (route: #/games/:id)
 */
export class GameDetailPage {
    /**
     * @param {import('../viewmodels/GameDetailsViewModel.js').GameDetailsViewModel} viewModel
     * @param {import('../viewmodels/GameListViewModel.js').GameListViewModel} listViewModel
     * @param {import('../router/Router.js').Router} router
     */
    constructor(viewModel, listViewModel, router) {
        this.viewModel = viewModel;
        this.listViewModel = listViewModel;
        this.router = router;
        this.modalView = new Modal();
        this.container = document.createElement("div");
        this.container.className = "page-details-container";
    }

    /**
     * @param {{ id: string }} params
     */
    async render(params) {
        this.viewModel.loadGame(params.id);
        this.#updateDOM();

        const unsubscribe = this.viewModel.subscribe(() => this.#updateDOM());

        return () => {
            unsubscribe();
            this.modalView.close();
        };
    }

    #updateDOM() {
        if (this.viewModel.isLoading) {
            this.container.innerHTML = `
                <div class="state-container loading-state">
                    <div class="spinner"></div>
                    <p class="state-title">Loading game details...</p>
                </div>
            `;
            return;
        }

        if (this.viewModel.errorMessage || !this.viewModel.game) {
            this.container.innerHTML = `
                <div class="state-container error-state">
                    <p class="state-title">Game Not Found</p>
                    <p class="state-desc">${escapeHtml(this.viewModel.errorMessage || "The requested game does not exist.")}</p>
                    <a href="#/" class="btn btn-primary">Back to Catalog</a>
                </div>
            `;
            return;
        }

        const game = this.viewModel.game;

        this.container.innerHTML = `
            <div class="details-page-card">
                <!-- Breadcrumbs -->
                <nav class="breadcrumb-nav">
                    <a href="#/" class="breadcrumb-link">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        Back to Catalog
                    </a>
                    <span class="breadcrumb-separator">/</span>
                    <span class="breadcrumb-current">${escapeHtml(game.name)}</span>
                </nav>

                <div class="details-main-header">
                    <div class="title-and-price">
                        <h1 class="details-main-title">${escapeHtml(game.name)}</h1>
                        <span class="price-tag-lg">${escapeHtml(game.formattedPrice)}</span>
                    </div>
                    <div class="badges-row">
                        <span class="genre-badge">${escapeHtml(game.genre)}</span>
                        <span class="year-badge">${game.releaseYear}</span>
                    </div>
                </div>

                <div class="specs-grid">
                    <div class="spec-card">
                        <span class="spec-label">Developer</span>
                        <span class="spec-value">${escapeHtml(game.developer)}</span>
                    </div>
                    <div class="spec-card">
                        <span class="spec-label">Release Year</span>
                        <span class="spec-value">${game.releaseYear}</span>
                    </div>
                    <div class="spec-card">
                        <span class="spec-label">Created At</span>
                        <span class="spec-value">${escapeHtml(game.formattedCreatedDate)}</span>
                    </div>
                    <div class="spec-card">
                        <span class="spec-label">Last Updated</span>
                        <span class="spec-value">${escapeHtml(game.formattedUpdatedDate)}</span>
                    </div>
                    <div class="spec-card full-span">
                        <span class="spec-label">Internal Identifier (UUID)</span>
                        <code class="spec-code">${escapeHtml(game.id)}</code>
                    </div>
                </div>

                <div class="details-footer-actions">
                    <a href="#/" class="btn btn-outline">Back to Catalog</a>
                    <div class="action-buttons-group">
                        <a href="#/games/${game.id}/edit" class="btn btn-primary">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                            Edit Game
                        </a>
                        <button type="button" class="btn btn-danger-outline" id="btn-detail-delete">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.container.querySelector("#btn-detail-delete")?.addEventListener("click", () => {
            this.#confirmDelete(game);
        });
    }

    #confirmDelete(game) {
        this.modalView.setTitle("Confirm Deletion");

        const box = document.createElement("div");
        box.innerHTML = `
            <p style="margin-bottom: 1.25rem; font-size: 1rem; color: var(--color-text-primary);">
                Are you sure you want to delete <strong>"${escapeHtml(game.name)}"</strong>?
            </p>
            <p style="margin-bottom: 1.5rem; font-size: 0.875rem; color: var(--color-text-secondary);">
                This action cannot be undone and will permanently remove this record.
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
            const res = await this.listViewModel.deleteGame(game.id);
            if (res.success) {
                Toast.success(`Game "${game.name}" was deleted.`);
                this.router.navigate("#/");
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
