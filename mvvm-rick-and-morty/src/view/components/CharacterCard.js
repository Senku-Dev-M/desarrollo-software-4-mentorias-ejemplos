import { getStatusKey, getStatusLabel } from "../utils/characterStatus.js";
import { escapeHtml } from "../utils/escapeHtml.js";

export function renderCharacterCard(character, index) {
  const statusKey = getStatusKey(character.status);

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
            <i aria-hidden="true"></i>${escapeHtml(getStatusLabel(character.status))}
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
