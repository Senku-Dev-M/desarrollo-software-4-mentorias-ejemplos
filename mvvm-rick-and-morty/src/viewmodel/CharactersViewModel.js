const INITIAL_STATE = Object.freeze({
  characters: [],
  filters: { name: "", status: "" },
  page: 1,
  totalPages: 0,
  totalCharacters: 0,
  isLoading: false,
  error: null,
  selectedCharacter: null,
});

export class CharactersViewModel {
  constructor(model) {
    this.model = model;
    this.listeners = new Set();
    this.controller = null;
    this.requestId = 0;
    this.state = { ...INITIAL_STATE, filters: { ...INITIAL_STATE.filters } };
  }

  subscribe(listener) {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  getState() {
    return {
      ...this.state,
      characters: [...this.state.characters],
      filters: { ...this.state.filters },
    };
  }

  async initialize() {
    await this.loadPage(1);
  }

  async search({ name = "", status = "" }) {
    this.setState({
      filters: { name: name.trim(), status },
      selectedCharacter: null,
    });
    await this.loadPage(1);
  }

  async resetFilters() {
    this.setState({
      filters: { name: "", status: "" },
      selectedCharacter: null,
    });
    await this.loadPage(1);
  }

  async nextPage() {
    if (this.state.page < this.state.totalPages && !this.state.isLoading) {
      await this.loadPage(this.state.page + 1);
    }
  }

  async previousPage() {
    if (this.state.page > 1 && !this.state.isLoading) {
      await this.loadPage(this.state.page - 1);
    }
  }

  async retry() {
    await this.loadPage(this.state.page);
  }

  selectCharacter(id) {
    const selectedCharacter =
      this.state.characters.find((character) => character.id === id) ?? null;
    this.setState({ selectedCharacter });
  }

  closeDetails() {
    this.setState({ selectedCharacter: null });
  }

  async loadPage(page) {
    this.controller?.abort();
    this.controller = new AbortController();
    const currentRequest = ++this.requestId;

    this.setState({ isLoading: true, error: null, page });

    try {
      const result = await this.model.getCharacters({
        page,
        name: this.state.filters.name,
        status: this.state.filters.status,
        signal: this.controller.signal,
      });

      if (currentRequest !== this.requestId) return;

      this.setState({
        characters: result.characters,
        totalPages: result.pagination.pages,
        totalCharacters: result.pagination.count,
        isLoading: false,
      });
    } catch (error) {
      if (error.name === "AbortError" || currentRequest !== this.requestId) return;

      this.setState({
        characters: [],
        totalPages: 0,
        totalCharacters: 0,
        isLoading: false,
        error: "No pudimos abrir el portal. Revisa tu conexión e inténtalo otra vez.",
      });
    }
  }

  setState(patch) {
    this.state = { ...this.state, ...patch };
    const snapshot = this.getState();
    this.listeners.forEach((listener) => listener(snapshot));
  }
}
