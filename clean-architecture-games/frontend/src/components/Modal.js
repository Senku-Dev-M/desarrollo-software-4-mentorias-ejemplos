/**
 * Reusable Dialog / Modal Component
 */
export class Modal {
    constructor() {
        this.overlay = null;
        this.dialog = null;
        this.titleEl = null;
        this.bodyEl = null;
        this.closeBtn = null;
        this.onCloseCallback = null;
        this.#init();
    }

    #init() {
        this.overlay = document.createElement("div");
        this.overlay.className = "modal-overlay hidden";
        this.overlay.setAttribute("role", "dialog");
        this.overlay.setAttribute("aria-modal", "true");

        this.overlay.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-header">
                    <h2 class="modal-title"></h2>
                    <button type="button" class="modal-close" aria-label="Close dialog">&times;</button>
                </div>
                <div class="modal-body"></div>
            </div>
        `;

        this.dialog = this.overlay.querySelector(".modal-dialog");
        this.titleEl = this.overlay.querySelector(".modal-title");
        this.bodyEl = this.overlay.querySelector(".modal-body");
        this.closeBtn = this.overlay.querySelector(".modal-close");

        this.closeBtn.addEventListener("click", () => this.close());
        this.overlay.addEventListener("click", (e) => {
            if (e.target === this.overlay) {
                this.close();
            }
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && this.isOpen()) {
                this.close();
            }
        });

        document.body.appendChild(this.overlay);
    }

    setTitle(title) {
        if (this.titleEl) {
            this.titleEl.textContent = title;
        }
    }

    setContent(elementOrHtml) {
        if (!this.bodyEl) return;
        this.bodyEl.innerHTML = "";
        if (typeof elementOrHtml === "string") {
            this.bodyEl.innerHTML = elementOrHtml;
        } else if (elementOrHtml instanceof HTMLElement) {
            this.bodyEl.appendChild(elementOrHtml);
        }
    }

    open(onClose = null) {
        this.onCloseCallback = onClose;
        this.overlay.classList.remove("hidden");
        document.body.classList.add("modal-open");
    }

    close() {
        this.overlay.classList.add("hidden");
        document.body.classList.remove("modal-open");
        if (typeof this.onCloseCallback === "function") {
            this.onCloseCallback();
            this.onCloseCallback = null;
        }
    }

    isOpen() {
        return !this.overlay.classList.contains("hidden");
    }
}
