/**
 * Lightweight SPA Hash Router
 * Handles client-side navigation without full page reloads or server rewrite rules.
 */
export class Router {
    constructor() {
        this.routes = [];
        this.currentCleanup = null;
        this.onRouteChangedCallbacks = new Set();
    }

    /**
     * Registers a route pattern and its corresponding page handler.
     * @param {string} pattern - e.g. '#/', '#/games', '#/games/new', '#/games/:id', '#/games/:id/edit'
     * @param {(params: Record<string, string>) => Promise<HTMLElement|void> | HTMLElement | void} handler
     */
    addRoute(pattern, handler) {
        // Convert pattern like '#/games/:id' to RegExp
        const paramNames = [];
        const regexPattern = pattern.replace(/:([a-zA-Z0-9_]+)/g, (_, paramName) => {
            paramNames.push(paramName);
            return "([^/]+)";
        });

        const regex = new RegExp(`^${regexPattern}$`);
        this.routes.push({ pattern, regex, paramNames, handler });
        return this;
    }

    onRouteChange(callback) {
        this.onRouteChangedCallbacks.add(callback);
        return () => this.onRouteChangedCallbacks.delete(callback);
    }

    navigate(hash) {
        window.location.hash = hash.startsWith("#") ? hash : `#${hash}`;
    }

    async resolve() {
        const hash = window.location.hash || "#/";

        // Run previous route cleanup if any
        if (typeof this.currentCleanup === "function") {
            try {
                this.currentCleanup();
            } catch (err) {
                console.error("Error in route cleanup:", err);
            }
            this.currentCleanup = null;
        }

        for (const route of this.routes) {
            const match = hash.match(route.regex);
            if (match) {
                const params = {};
                route.paramNames.forEach((name, index) => {
                    params[name] = decodeURIComponent(match[index + 1]);
                });

                for (const cb of this.onRouteChangedCallbacks) {
                    cb(hash, params);
                }

                const cleanup = await route.handler(params);
                if (typeof cleanup === "function") {
                    this.currentCleanup = cleanup;
                }
                return;
            }
        }

        // Fallback: if route is not found, redirect to default
        if (hash !== "#/") {
            this.navigate("#/");
        }
    }

    init() {
        window.addEventListener("hashchange", () => this.resolve());
        // Handle initial load
        if (!window.location.hash) {
            window.location.hash = "#/";
        } else {
            this.resolve();
        }
    }
}
