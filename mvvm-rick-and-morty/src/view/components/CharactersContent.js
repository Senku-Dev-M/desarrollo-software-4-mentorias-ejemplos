import { renderCharacterCard } from "./CharacterCard.js";
import { escapeHtml } from "../utils/escapeHtml.js";

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

export function renderCharactersContent(state) {
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
