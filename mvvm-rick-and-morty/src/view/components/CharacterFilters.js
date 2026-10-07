import { escapeHtml } from "../utils/escapeHtml.js";

export function renderCharacterFilters({ filters, isLoading }) {
  const hasFilters = Boolean(filters.name || filters.status);

  return `
    <form class="search-console" data-search-form>
      <label class="search-field">
        <span>Nombre del sujeto</span>
        <span class="input-wrap">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            name="name"
            value="${escapeHtml(filters.name)}"
            placeholder="Ej. Rick, Morty, Summer..."
            autocomplete="off"
          />
        </span>
      </label>
      <label class="status-field">
        <span>Estado vital</span>
        <select name="status">
          <option value="" ${filters.status === "" ? "selected" : ""}>Todos los estados</option>
          <option value="alive" ${filters.status === "alive" ? "selected" : ""}>Vivo</option>
          <option value="dead" ${filters.status === "dead" ? "selected" : ""}>Muerto</option>
          <option value="unknown" ${filters.status === "unknown" ? "selected" : ""}>Desconocido</option>
        </select>
      </label>
      <button class="button button--primary search-button" type="submit" ${isLoading ? "disabled" : ""}>
        Rastrear <span aria-hidden="true">↗</span>
      </button>
      ${hasFilters ? '<button class="button button--ghost" type="button" data-action="reset">Limpiar</button>' : ""}
    </form>
  `;
}
