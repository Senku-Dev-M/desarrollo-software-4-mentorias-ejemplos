const STATUS_LABELS = {
  Alive: "Vivo",
  Dead: "Muerto",
  unknown: "Desconocido",
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderSkeletons() {
  return Array.from(
    { length: 8 },
    (_, index) => `
      <div class="character-card skeleton-card" aria-hidden="true" style="--delay: ${index * 45}ms">
        <div class="skeleton skeleton-image"></div>
        <div class="skeleton-copy">
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-line"></div>
          <div class="skeleton skeleton-line skeleton-line--short"></div>
        </div>
      </div>
    `,
  ).join("");
}

function renderCharacterCard(character, index) {
  const statusKey = character.status.toLowerCase();

  return `
    <button
      class="character-card"
      type="button"
      data-action="select"
      data-id="${character.id}"
      style="--delay: ${index * 45}ms"
      aria-label="Ver expediente de ${escapeHtml(character.name)}"
    >
      <span class="card-image-wrap">
        <img
          class="card-image"
          src="${escapeHtml(character.image)}"
          alt="Retrato de ${escapeHtml(character.name)}"
          loading="lazy"
          width="300"
          height="300"
        />
        <span class="specimen-id">#${String(character.id).padStart(3, "0")}</span>
      </span>
      <span class="card-copy">
        <span class="card-heading">
          <strong>${escapeHtml(character.name)}</strong>
          <span class="status status--${escapeHtml(statusKey)}">
            <i aria-hidden="true"></i>${escapeHtml(STATUS_LABELS[character.status] ?? character.status)}
          </span>
        </span>
        <span class="card-meta">
          <span><small>Especie</small>${escapeHtml(character.species)}</span>
          <span><small>Última señal</small>${escapeHtml(character.location)}</span>
        </span>
        <span class="open-file">Abrir expediente <b aria-hidden="true">↗</b></span>
      </span>
    </button>
  `;
}

function renderContent(state) {
  if (state.isLoading) {
    return `<div class="characters-grid" aria-label="Cargando personajes">${renderSkeletons()}</div>`;
  }

  if (state.error) {
    return `
      <section class="message-panel message-panel--error" role="alert">
        <span class="message-symbol" aria-hidden="true">!</span>
        <div>
          <p class="message-kicker">Interferencia dimensional</p>
          <h2>No hay respuesta al otro lado</h2>
          <p>${escapeHtml(state.error)}</p>
          <button class="button button--primary" type="button" data-action="retry">Reconectar portal</button>
        </div>
      </section>
    `;
  }

  if (state.characters.length === 0) {
    return `
      <section class="message-panel" role="status">
        <span class="message-symbol" aria-hidden="true">∅</span>
        <div>
          <p class="message-kicker">Sector sin coincidencias</p>
          <h2>Nadie responde a esa descripción</h2>
          <p>Prueba con otro nombre o vuelve a consultar todos los estados.</p>
          <button class="button button--primary" type="button" data-action="reset">Limpiar filtros</button>
        </div>
      </section>
    `;
  }

  return `
    <div class="characters-grid">
      ${state.characters.map(renderCharacterCard).join("")}
    </div>
  `;
}

function renderDetails(character) {
  if (!character) return "";

  const statusKey = character.status.toLowerCase();

  return `
    <div class="drawer-backdrop" data-action="close" aria-hidden="true"></div>
    <aside class="character-drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
      <button class="drawer-close" type="button" data-action="close" aria-label="Cerrar expediente">×</button>
      <div class="drawer-portrait">
        <img src="${escapeHtml(character.image)}" alt="Retrato de ${escapeHtml(character.name)}" />
        <span class="drawer-index">SUJETO / ${String(character.id).padStart(3, "0")}</span>
      </div>
      <div class="drawer-content">
        <p class="eyebrow">Expediente interdimensional</p>
        <h2 id="drawer-title">${escapeHtml(character.name)}</h2>
        <span class="status status--${escapeHtml(statusKey)}">
          <i aria-hidden="true"></i>${escapeHtml(STATUS_LABELS[character.status] ?? character.status)}
        </span>
        <dl class="fact-list">
          <div><dt>Especie</dt><dd>${escapeHtml(character.species)}</dd></div>
          <div><dt>Género</dt><dd>${escapeHtml(character.gender)}</dd></div>
          <div><dt>Subtipo</dt><dd>${escapeHtml(character.type)}</dd></div>
          <div><dt>Origen</dt><dd>${escapeHtml(character.origin)}</dd></div>
          <div><dt>Última ubicación</dt><dd>${escapeHtml(character.location)}</dd></div>
          <div><dt>Apariciones</dt><dd>${character.episodeCount} episodios</dd></div>
        </dl>
      </div>
    </aside>
  `;
}

export class CharactersView {
  constructor(root) {
    this.root = root;
    this.actions = {};
    this.root.addEventListener("submit", (event) => this.handleSubmit(event));
    this.root.addEventListener("click", (event) => this.handleClick(event));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") this.actions.onClose?.();
    });
  }

  connect(actions) {
    this.actions = actions;
  }

  handleSubmit(event) {
    if (!event.target.matches("[data-search-form]")) return;
    event.preventDefault();
    const formData = new FormData(event.target);
    this.actions.onSearch?.({
      name: formData.get("name"),
      status: formData.get("status"),
    });
  }

  handleClick(event) {
    const trigger = event.target.closest("[data-action]");
    if (!trigger) return;

    const action = trigger.dataset.action;
    const handlers = {
      previous: () => this.actions.onPrevious?.(),
      next: () => this.actions.onNext?.(),
      retry: () => this.actions.onRetry?.(),
      reset: () => this.actions.onReset?.(),
      close: () => this.actions.onClose?.(),
      select: () => this.actions.onSelect?.(Number(trigger.dataset.id)),
    };

    handlers[action]?.();
  }

  render(state) {
    const hasFilters = Boolean(state.filters.name || state.filters.status);
    const resultLabel = state.isLoading
      ? "Buscando señales..."
      : `${state.totalCharacters} coincidencias registradas`;

    this.root.innerHTML = `
      <div class="site-shell">
        <header class="app-header">
          <nav class="topbar" aria-label="Información del ejemplo">
            <a class="brand" href="/" aria-label="Portal Index, inicio">
              <span class="brand-mark" aria-hidden="true"><i></i></span>
              <span>PORTAL INDEX</span>
            </a>
            <span class="course-tag">MVVM · VANILLA JS · VITE</span>
          </nav>
        </header>

        <section class="catalog" aria-labelledby="catalog-title">
          <div class="catalog-heading">
            <div>
              <p class="eyebrow"><span>●</span> Rick and Morty API</p>
              <h1 id="catalog-title">Personajes del multiverso</h1>
              <p class="catalog-intro">Busca, filtra y explora expedientes sin recargar la página.</p>
            </div>
            <p class="result-count" role="status"><span></span>${resultLabel}</p>
          </div>

          <form class="search-console" data-search-form>
            <label class="search-field">
              <span>Nombre del sujeto</span>
              <span class="input-wrap">
                <span aria-hidden="true">⌕</span>
                <input
                  type="search"
                  name="name"
                  value="${escapeHtml(state.filters.name)}"
                  placeholder="Ej. Rick, Morty, Summer..."
                  autocomplete="off"
                />
              </span>
            </label>
            <label class="status-field">
              <span>Estado vital</span>
              <select name="status">
                <option value="" ${state.filters.status === "" ? "selected" : ""}>Todos los estados</option>
                <option value="alive" ${state.filters.status === "alive" ? "selected" : ""}>Vivo</option>
                <option value="dead" ${state.filters.status === "dead" ? "selected" : ""}>Muerto</option>
                <option value="unknown" ${state.filters.status === "unknown" ? "selected" : ""}>Desconocido</option>
              </select>
            </label>
            <button class="button button--primary search-button" type="submit" ${state.isLoading ? "disabled" : ""}>
              Rastrear <span aria-hidden="true">↗</span>
            </button>
            ${hasFilters ? '<button class="button button--ghost" type="button" data-action="reset">Limpiar</button>' : ""}
          </form>

          ${renderContent(state)}

          <nav class="pagination" aria-label="Paginación de personajes">
            <button class="pagination-button" type="button" data-action="previous" ${state.page <= 1 || state.isLoading ? "disabled" : ""}>
              <span aria-hidden="true">←</span> Anterior
            </button>
            <p><small>PÁGINA</small><strong>${state.totalPages ? state.page : 0}</strong><span>/</span>${state.totalPages}</p>
            <button class="pagination-button" type="button" data-action="next" ${state.page >= state.totalPages || state.isLoading ? "disabled" : ""}>
              Siguiente <span aria-hidden="true">→</span>
            </button>
          </nav>
        </section>

        <footer class="footer">
          <p>Datos provistos por <a href="https://rickandmortyapi.com" target="_blank" rel="noreferrer">The Rick and Morty API ↗</a></p>
          <p>Vanilla JS · Vite · MVVM</p>
        </footer>
      </div>
      ${renderDetails(state.selectedCharacter)}
    `;

    document.body.classList.toggle("drawer-open", Boolean(state.selectedCharacter));
    if (state.selectedCharacter) {
      this.root.querySelector(".drawer-close")?.focus();
    }
  }
}
