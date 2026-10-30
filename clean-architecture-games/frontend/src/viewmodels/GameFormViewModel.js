import { Game } from "../models/Game.js";

/**
 * ViewModel for game creation and editing form.
 * Handles form state, validations, and API submission.
 */
export class GameFormViewModel {
    constructor(apiService) {
        this.apiService = apiService;
        this.isEditing = false;
        this.gameId = null;
        this.formData = this.#initialFormData();
        this.errors = {};
        this.isSubmitting = false;
        this.submitError = null;
        this.listeners = new Set();
    }

    #initialFormData() {
        return {
            name: "",
            genre: "",
            developer: "",
            releaseYear: new Date().getFullYear(),
            price: ""
        };
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
                console.error("Error in GameFormViewModel subscriber:", err);
            }
        }
    }

    setForCreate() {
        this.isEditing = false;
        this.gameId = null;
        this.formData = this.#initialFormData();
        this.errors = {};
        this.submitError = null;
        this.isSubmitting = false;
        this.notify();
    }

    setForEdit(game) {
        this.isEditing = true;
        this.gameId = game.id;
        this.formData = {
            name: game.name,
            genre: game.genre,
            developer: game.developer,
            releaseYear: game.releaseYear,
            price: game.price
        };
        this.errors = {};
        this.submitError = null;
        this.isSubmitting = false;
        this.notify();
    }

    updateField(fieldName, value) {
        this.formData[fieldName] = value;
        // Clear field error on edit
        if (this.errors[fieldName]) {
            delete this.errors[fieldName];
        }
        this.notify();
    }

    validate() {
        const dummyGame = new Game({
            id: this.gameId,
            name: this.formData.name,
            genre: this.formData.genre,
            developer: this.formData.developer,
            releaseYear: this.formData.releaseYear,
            price: this.formData.price === "" ? null : Number(this.formData.price)
        });

        const { isValid, errors } = dummyGame.validate();
        this.errors = errors;
        this.notify();
        return isValid;
    }

    async submit() {
        if (!this.validate()) {
            return { success: false, validationFailed: true };
        }

        this.isSubmitting = true;
        this.submitError = null;
        this.notify();

        try {
            const gameModel = new Game({
                id: this.gameId,
                name: this.formData.name,
                genre: this.formData.genre,
                developer: this.formData.developer,
                releaseYear: Number(this.formData.releaseYear),
                price: Number(this.formData.price)
            });

            let resultGame;
            if (this.isEditing) {
                await this.apiService.update(this.gameId, gameModel);
                resultGame = gameModel;
            } else {
                resultGame = await this.apiService.create(gameModel);
            }

            return { success: true, game: resultGame, isEditing: this.isEditing };
        } catch (err) {
            this.submitError = err.message || "Failed to save game.";
            return { success: false, error: this.submitError };
        } finally {
            this.isSubmitting = false;
            this.notify();
        }
    }
}
