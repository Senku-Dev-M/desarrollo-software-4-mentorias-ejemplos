/**
 * ViewModel for managing games list state, filtering, loading, and deletion.
 * Coordinates View <-> State <-> ApiService.
 */
export class GameListViewModel {
    constructor(apiService) {
        this.apiService = apiService;
        this.games = [];
        this.isLoading = false;
        this.errorMessage = null;
        this.searchTerm = "";
        this.selectedGenre = "ALL";
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
                console.error("Error in ViewModel subscriber:", err);
            }
        }
    }

    async loadGames() {
        this.isLoading = true;
        this.errorMessage = null;
        this.notify();

        try {
            this.games = await this.apiService.getAll();
        } catch (err) {
            this.errorMessage = err.message || "Failed to load games.";
        } finally {
            this.isLoading = false;
            this.notify();
        }
    }

    setSearchTerm(term) {
        this.searchTerm = term.toLowerCase().trim();
        this.notify();
    }

    setSelectedGenre(genre) {
        this.selectedGenre = genre;
        this.notify();
    }

    async deleteGame(id) {
        this.isLoading = true;
        this.errorMessage = null;
        this.notify();

        try {
            await this.apiService.delete(id);
            this.games = this.games.filter(g => g.id !== id);
            return { success: true };
        } catch (err) {
            this.errorMessage = err.message || "Failed to delete game.";
            return { success: false, error: this.errorMessage };
        } finally {
            this.isLoading = false;
            this.notify();
        }
    }

    get filteredGames() {
        return this.games.filter(game => {
            const matchesSearch = !this.searchTerm ||
                game.name.toLowerCase().includes(this.searchTerm) ||
                game.developer.toLowerCase().includes(this.searchTerm) ||
                game.genre.toLowerCase().includes(this.searchTerm);

            const matchesGenre = this.selectedGenre === "ALL" ||
                game.genre.toLowerCase() === this.selectedGenre.toLowerCase();

            return matchesSearch && matchesGenre;
        });
    }

    get genres() {
        const unique = new Set(this.games.map(g => g.genre).filter(Boolean));
        return Array.from(unique).sort();
    }

    get totalCount() {
        return this.games.length;
    }
}
