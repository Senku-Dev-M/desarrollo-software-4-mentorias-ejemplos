import { Toast } from "../components/Toast.js";

/**
 * SPA Page: Game Creation and Edition (routes: #/games/new, #/games/:id/edit)
 */
export class GameFormPage {
    /**
     * @param {import('../viewmodels/GameFormViewModel.js').GameFormViewModel} viewModel
     * @param {import('../services/GameApiService.js').GameApiService} apiService
     * @param {import('../router/Router.js').Router} router
     */
    constructor(viewModel, apiService, router) {
        this.viewModel = viewModel;
        this.apiService = apiService;
        this.router = router;
        this.container = document.createElement("div");
        this.container.className = "page-form-container";
    }

    /**
     * @param {{ id?: string }} params
     */
    async render(params = {}) {
        const isEditing = Boolean(params.id);

        if (isEditing) {
            try {
                const game = await this.apiService.getById(params.id);
                this.viewModel.setForEdit(game);
            } catch (err) {
                Toast.error(`Could not load game for editing: ${err.message}`);
                this.router.navigate("#/");
                return;
            }
        } else {
            this.viewModel.setForCreate();
        }

        this.#buildForm();
        const unsubscribe = this.viewModel.subscribe(() => this.#updateFormState());

        return () => {
            unsubscribe();
        };
    }

    #buildForm() {
        const title = this.viewModel.isEditing ? `Edit Game: ${this.viewModel.formData.name || ''}` : "Add New Game";
        const subtitle = this.viewModel.isEditing
            ? "Update the attributes for this game in the Clean Architecture API."
            : "Fill in the details below to add a new game to the database.";

        this.container.innerHTML = `
            <div class="form-page-card">
                <!-- Breadcrumb -->
                <nav class="breadcrumb-nav">
                    <a href="#/" class="breadcrumb-link">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        Back to Catalog
                    </a>
                    <span class="breadcrumb-separator">/</span>
                    <span class="breadcrumb-current">${this.viewModel.isEditing ? "Edit Game" : "New Game"}</span>
                </nav>

                <div class="form-header">
                    <h1 class="form-page-title">${escapeHtml(title)}</h1>
                    <p class="form-page-desc">${escapeHtml(subtitle)}</p>
                </div>

                <form class="game-form" id="spa-game-form" novalidate>
                    <div class="form-alert hidden" id="page-form-error-alert"></div>

                    <div class="form-group">
                        <label for="form-game-name">Name <span class="required">*</span></label>
                        <input
                            type="text"
                            id="form-game-name"
                            name="name"
                            class="form-control"
                            placeholder="e.g. Cyberpunk 2077"
                            value="${escapeHtml(this.viewModel.formData.name)}"
                        />
                        <span class="field-error" data-error-for="name"></span>
                    </div>

                    <div class="form-row">
                        <div class="form-group col-half">
                            <label for="form-game-genre">Genre <span class="required">*</span></label>
                            <input
                                type="text"
                                id="form-game-genre"
                                name="genre"
                                class="form-control"
                                placeholder="e.g. RPG, Action, Indie"
                                value="${escapeHtml(this.viewModel.formData.genre)}"
                            />
                            <span class="field-error" data-error-for="genre"></span>
                        </div>

                        <div class="form-group col-half">
                            <label for="form-game-developer">Developer <span class="required">*</span></label>
                            <input
                                type="text"
                                id="form-game-developer"
                                name="developer"
                                class="form-control"
                                placeholder="e.g. CD Projekt Red"
                                value="${escapeHtml(this.viewModel.formData.developer)}"
                            />
                            <span class="field-error" data-error-for="developer"></span>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group col-half">
                            <label for="form-game-year">Release Year <span class="required">*</span></label>
                            <input
                                type="number"
                                id="form-game-year"
                                name="releaseYear"
                                class="form-control"
                                min="1950"
                                max="2035"
                                value="${this.viewModel.formData.releaseYear}"
                            />
                            <span class="field-error" data-error-for="releaseYear"></span>
                        </div>

                        <div class="form-group col-half">
                            <label for="form-game-price">Price (USD) <span class="required">*</span></label>
                            <input
                                type="number"
                                id="form-game-price"
                                name="price"
                                class="form-control"
                                step="0.01"
                                min="0"
                                placeholder="59.99"
                                value="${this.viewModel.formData.price ?? ''}"
                            />
                            <span class="field-error" data-error-for="price"></span>
                        </div>
                    </div>

                    <div class="form-actions">
                        <a href="#/" class="btn btn-outline">Cancel</a>
                        <button type="submit" class="btn btn-primary" id="btn-submit-game">
                            <span class="submit-text">${this.viewModel.isEditing ? "Save Changes" : "Create Game"}</span>
                            <span class="submit-spinner hidden">
                                <svg class="spin-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
                                    <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
                                </svg>
                                Saving...
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        `;

        this.#bindFormEvents();
    }

    #bindFormEvents() {
        const form = this.container.querySelector("#spa-game-form");
        if (!form) return;

        const inputs = form.querySelectorAll("input");
        inputs.forEach(input => {
            input.addEventListener("input", (e) => {
                this.viewModel.updateField(e.target.name, e.target.value);
            });
        });

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const result = await this.viewModel.submit();
            if (result.success) {
                Toast.success(`Game "${result.game.name}" was ${result.isEditing ? 'updated' : 'created'} successfully!`);
                this.router.navigate("#/");
            }
        });
    }

    #updateFormState() {
        // Field validation error display
        const errorSpans = this.container.querySelectorAll(".field-error");
        errorSpans.forEach(span => {
            const field = span.dataset.errorFor;
            const errorMsg = this.viewModel.errors[field];
            span.textContent = errorMsg || "";
            span.classList.toggle("visible", Boolean(errorMsg));

            const input = this.container.querySelector(`[name="${field}"]`);
            if (input) {
                input.classList.toggle("is-invalid", Boolean(errorMsg));
            }
        });

        // Submit error alert
        const alertEl = this.container.querySelector("#page-form-error-alert");
        if (alertEl) {
            if (this.viewModel.submitError) {
                alertEl.textContent = this.viewModel.submitError;
                alertEl.classList.remove("hidden");
            } else {
                alertEl.classList.add("hidden");
            }
        }

        // Submitting spinner & state
        const submitBtn = this.container.querySelector("#btn-submit-game");
        const submitText = this.container.querySelector(".submit-text");
        const submitSpinner = this.container.querySelector(".submit-spinner");

        if (submitBtn) {
            submitBtn.disabled = this.viewModel.isSubmitting;
            submitText?.classList.toggle("hidden", this.viewModel.isSubmitting);
            submitSpinner?.classList.toggle("hidden", !this.viewModel.isSubmitting);
        }
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
