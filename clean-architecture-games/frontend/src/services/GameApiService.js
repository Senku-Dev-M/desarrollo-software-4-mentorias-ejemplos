import { config } from "../config/config.js";
import { Game } from "../models/Game.js";

/**
 * Service dedicated exclusively to communicating with the Games REST API.
 * Keeps HTTP and network details decoupled from ViewModels and Views.
 */
export class GameApiService {
    constructor(baseUrl = config.apiBaseUrl) {
        this.baseUrl = baseUrl;
    }

    async #handleResponse(response) {
        if (response.status === 204) {
            return null;
        }


        const contentType = response.headers.get("content-type") || "";
        const isJson = contentType.includes("application/json") || contentType.includes("application/problem+json");

        if (!response.ok) {
            let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
            if (isJson) {
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.detail || errorData.title || errorData.message || errorMessage;
                } catch {
                    // fall back to default message
                }
            } else {
                try {
                    const text = await response.text();
                    if (text) errorMessage = text;
                } catch {
                    // fall back
                }
            }
            throw new Error(errorMessage);
        }

        return isJson ? await response.json() : null;
    }

    /**
     * Retrieves all games from the API.
     * @returns {Promise<Game[]>}
     */
    async getAll() {
        try {
            const response = await fetch(`${this.baseUrl}/games`, {
                method: "GET",
                headers: { "Accept": "application/json" }
            });

            const data = await this.#handleResponse(response);
            const items = Array.isArray(data) ? data : (data?.games || []);
            return items.map(item => new Game(item));
        } catch (error) {
            throw new Error(this.#formatNetworkError(error));
        }
    }

    /**
     * Retrieves a single game by its unique identifier.
     * @param {string} id
     * @returns {Promise<Game>}
     */
    async getById(id) {
        try {
            const response = await fetch(`${this.baseUrl}/games/${id}`, {
                method: "GET",
                headers: { "Accept": "application/json" }
            });

            const data = await this.#handleResponse(response);
            return new Game(data);
        } catch (error) {
            throw new Error(this.#formatNetworkError(error));
        }
    }

    /**
     * Creates a new game.
     * @param {Game|object} game
     * @returns {Promise<Game>}
     */
    async create(game) {
        try {
            const payload = game instanceof Game ? game.toJSON() : game;
            const response = await fetch(`${this.baseUrl}/games`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const data = await this.#handleResponse(response);
            return new Game(data);
        } catch (error) {
            throw new Error(this.#formatNetworkError(error));
        }
    }

    /**
     * Updates an existing game.
     * @param {string} id
     * @param {Game|object} game
     * @returns {Promise<void>}
     */
    async update(id, game) {
        try {
            const payload = game instanceof Game ? game.toJSON() : game;
            const response = await fetch(`${this.baseUrl}/games/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(payload)
            });

            await this.#handleResponse(response);
        } catch (error) {
            throw new Error(this.#formatNetworkError(error));
        }
    }

    /**
     * Deletes a game by ID.
     * @param {string} id
     * @returns {Promise<void>}
     */
    async delete(id) {
        try {
            const response = await fetch(`${this.baseUrl}/games/${id}`, {
                method: "DELETE",
                headers: { "Accept": "application/json" }
            });

            await this.#handleResponse(response);
        } catch (error) {
            throw new Error(this.#formatNetworkError(error));
        }
    }

    #formatNetworkError(error) {
        if (error.message.includes("Failed to fetch") || error.name === "TypeError") {
            return `Cannot connect to API at "${this.baseUrl}". Verify that backend is running and CORS allows this origin.`;
        }
        return error.message;
    }
}
