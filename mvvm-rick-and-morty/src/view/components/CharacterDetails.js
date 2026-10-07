import { getStatusKey, getStatusLabel } from "../utils/characterStatus.js";
import { escapeHtml } from "../utils/escapeHtml.js";

export function renderCharacterDetails(character) {
  if (!character) return "";

  const statusKey = getStatusKey(character.status);

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
          <i aria-hidden="true"></i>${escapeHtml(getStatusLabel(character.status))}
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
