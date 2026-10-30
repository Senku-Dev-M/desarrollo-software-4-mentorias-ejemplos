/**
 * SPA Navigation Bar Component
 */
export class Navbar {
    /**
     * @param {HTMLElement} rootElement
     */
    constructor(rootElement) {
        this.rootElement = rootElement;
        this.currentHash = window.location.hash || "#/";
        this.render();
    }

    render() {
        this.rootElement.innerHTML = `
            <div class="navbar-container">
                <a href="#/" class="brand" title="Go to Catalog">
                    <div class="brand-logo">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                            <line x1="6" y1="12" x2="10" y2="12"></line>
                            <line x1="8" y1="10" x2="8" y2="14"></line>
                            <circle cx="15" cy="11" r="1"></circle>
                            <circle cx="17" cy="13" r="1"></circle>
                        </svg>
                    </div>
                    <div class="brand-text">
                        <span class="brand-title">Games Vault</span>
                        <span class="brand-subtitle">SPA &bull; Clean Architecture</span>
                    </div>
                </a>

                <nav class="navbar-links">
                    <a href="#/" class="nav-link ${this.#isActive('#/') ? 'active' : ''}" id="nav-link-catalog">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="3" width="7" height="7"></rect>
                            <rect x="14" y="3" width="7" height="7"></rect>
                            <rect x="14" y="14" width="7" height="7"></rect>
                            <rect x="3" y="14" width="7" height="7"></rect>
                        </svg>
                        Catalog
                    </a>
                </nav>

                <div class="navbar-actions">
                    <div class="stats-badge" title="Total games in catalog">
                        <span class="counter-number" id="nav-counter">0</span>
                        <span class="counter-label">Games</span>
                    </div>
                    <a href="#/games/new" class="btn btn-primary" id="btn-nav-new">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Add Game
                    </a>
                </div>
            </div>
        `;
    }

    #isActive(targetHash) {
        if (targetHash === "#/") {
            return this.currentHash === "#/" || this.currentHash === "" || this.currentHash === "#/games";
        }
        return this.currentHash.startsWith(targetHash);
    }

    setActiveRoute(hash) {
        this.currentHash = hash;
        const catalogLink = this.rootElement.querySelector("#nav-link-catalog");
        if (catalogLink) {
            catalogLink.classList.toggle("active", this.#isActive("#/"));
        }
    }

    updateCount(count) {
        const counterEl = this.rootElement.querySelector("#nav-counter");
        if (counterEl) {
            counterEl.textContent = String(count);
        }
    }
}
