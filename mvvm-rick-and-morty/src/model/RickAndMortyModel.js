import { Character } from "./Character.js";

const DEFAULT_BASE_URL = "https://rickandmortyapi.com/api";

export class RickAndMortyApiError extends Error {
  constructor(message) {
    super(message);
    this.name = "RickAndMortyApiError";
  }
}

export class RickAndMortyModel {
  constructor({ fetchImpl = globalThis.fetch, baseUrl = DEFAULT_BASE_URL } = {}) {
    this.fetch = (...args) => fetchImpl(...args);
    this.baseUrl = baseUrl;
  }

  async getCharacters({ page = 1, name = "", status = "", signal } = {}) {
    const url = new URL(`${this.baseUrl}/character`);
    url.searchParams.set("page", String(page));

    if (name.trim()) {
      url.searchParams.set("name", name.trim());
    }

    if (status) {
      url.searchParams.set("status", status);
    }

    const response = await this.fetch(url, { signal });

    if (response.status === 404) {
      return {
        characters: [],
        pagination: { count: 0, pages: 0, next: null, prev: null },
      };
    }

    if (!response.ok) {
      throw new RickAndMortyApiError(
        `La API respondió con el estado ${response.status}.`,
      );
    }

    const data = await response.json();

    return {
      characters: data.results.map(Character.fromApi),
      pagination: {
        count: data.info.count,
        pages: data.info.pages,
        next: data.info.next,
        prev: data.info.prev,
      },
    };
  }
}
