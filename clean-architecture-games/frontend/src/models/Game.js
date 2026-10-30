/**
 * Domain Model for Game in the Frontend layer.
 * Encapsulates entity state, formatting getters, and client-side validation rules.
 */
export class Game {
    constructor({
        id = null,
        name = "",
        genre = "",
        developer = "",
        releaseYear = new Date().getFullYear(),
        price = 0,
        createdAt = null,
        updatedAt = null
    } = {}) {
        this.id = id;
        this.name = String(name ?? "").trim();
        this.genre = String(genre ?? "").trim();
        this.developer = String(developer ?? "").trim();
        this.releaseYear = Number(releaseYear);
        this.price = Number(price);
        this.createdAt = createdAt ? new Date(createdAt) : null;
        this.updatedAt = updatedAt ? new Date(updatedAt) : null;
    }

    get formattedPrice() {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
        }).format(this.price);
    }

    get formattedCreatedDate() {
        if (!this.createdAt || isNaN(this.createdAt.getTime())) return "N/A";
        return new Intl.DateTimeFormat("en-US", {
            dateStyle: "medium",
            timeStyle: "short"
        }).format(this.createdAt);
    }

    get formattedUpdatedDate() {
        if (!this.updatedAt || isNaN(this.updatedAt.getTime())) return "Never";
        return new Intl.DateTimeFormat("en-US", {
            dateStyle: "medium",
            timeStyle: "short"
        }).format(this.updatedAt);
    }

    /**
     * Validates domain constraints matching backend rules.
     * @returns {{ isValid: boolean, errors: Record<string, string> }}
     */
    validate() {
        const errors = {};

        if (!this.name) {
            errors.name = "Game name is required.";
        } else if (this.name.length > 200) {
            errors.name = "Name cannot exceed 200 characters.";
        }

        if (!this.genre) {
            errors.genre = "Genre is required.";
        } else if (this.genre.length > 100) {
            errors.genre = "Genre cannot exceed 100 characters.";
        }

        if (!this.developer) {
            errors.developer = "Developer is required.";
        } else if (this.developer.length > 150) {
            errors.developer = "Developer cannot exceed 150 characters.";
        }

        const currentYear = new Date().getFullYear();
        const maxYear = currentYear + 5;
        if (!this.releaseYear || isNaN(this.releaseYear)) {
            errors.releaseYear = "Release year is required.";
        } else if (this.releaseYear < 1950 || this.releaseYear > maxYear) {
            errors.releaseYear = `Release year must be between 1950 and ${maxYear}.`;
        }

        if (this.price === null || this.price === undefined || isNaN(this.price)) {
            errors.price = "Price is required.";
        } else if (this.price < 0) {
            errors.price = "Price cannot be negative.";
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    /**
     * Returns a JSON-serializable DTO for API calls.
     */
    toJSON() {
        return {
            name: this.name,
            genre: this.genre,
            developer: this.developer,
            releaseYear: this.releaseYear,
            price: this.price
        };
    }
}
