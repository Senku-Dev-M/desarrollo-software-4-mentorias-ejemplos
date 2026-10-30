/**
 * Lightweight Toast notification component.
 */
export class Toast {
    static container = null;

    static init() {
        if (!Toast.container) {
            Toast.container = document.createElement("div");
            Toast.container.className = "toast-container";
            document.body.appendChild(Toast.container);
        }
    }

    static show(message, type = "info", duration = 3500) {
        Toast.init();

        const toast = document.createElement("div");
        toast.className = `toast toast-${type}`;

        const iconSvg = Toast.#getIcon(type);

        toast.innerHTML = `
            <div class="toast-icon">${iconSvg}</div>
            <div class="toast-message">${escapeHtml(message)}</div>
            <button class="toast-close" type="button" aria-label="Close">&times;</button>
        `;

        const closeBtn = toast.querySelector(".toast-close");
        const removeToast = () => {
            toast.classList.add("toast-hiding");
            toast.addEventListener("animationend", () => {
                toast.remove();
            });
        };

        closeBtn?.addEventListener("click", removeToast);

        Toast.container.appendChild(toast);

        if (duration > 0) {
            setTimeout(removeToast, duration);
        }
    }

    static success(message) {
        Toast.show(message, "success");
    }

    static error(message) {
        Toast.show(message, "error", 5000);
    }

    static info(message) {
        Toast.show(message, "info");
    }

    static #getIcon(type) {
        if (type === "success") {
            return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
        }
        if (type === "error") {
            return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
        }
        return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }
}

function escapeHtml(str) {
    if (!str) return "";
    return String(str).replace(/[&<>"']/g, m => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    })[m]);
}
