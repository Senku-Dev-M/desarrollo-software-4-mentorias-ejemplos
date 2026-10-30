/**
 * ViewModel for inspecting detailed information of a selected game.
 */
export class GameDetailsViewModel {
    constructor(apiService) {
        this.apiService = apiService;
        this.game = null;
        this.isLoading = false;
        this.errorMessage = null;
        this.listeners = new Set();
    }

    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    notify() {
        for (const listener of this.listeners) {
            try {
                listener(this);
            } catch (err) {
                console.error("Error in GameDetailsViewModel subscriber:", err);
            }
        }
    }

    setGame(game) {
        this.game = game;
        this.errorMessage = null;
        this.isLoading = false;
        this.notify();
    }

    async loadGame(id) {
        this.isLoading = true;
        this.errorMessage = null;
        this.notify();

        try {
            this.game = await this.apiService.getById(id);
        } catch (err) {
            this.errorMessage = err.message || "Failed to load game details.";
        } finally {
            this.isLoading = false;
            this.notify();
        }
    }

    clear() {
        this.game = null;
        this.errorMessage = null;
        this.isLoading = false;
        this.notify();
    }
}
