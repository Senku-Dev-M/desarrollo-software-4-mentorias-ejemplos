import { renderCharacterDetails } from "../components/CharacterDetails.js";
import { renderCharacterFilters } from "../components/CharacterFilters.js";
import { renderCharactersContent } from "../components/CharactersContent.js";
import { renderPagination } from "../components/Pagination.js";

export function renderCharactersPage(state) {
  const resultLabel = state.isLoading
    ? "Buscando señales..."
    : `${state.totalCharacters} coincidencias registradas`;

  return `
    <div class="site-shell">
      <section class="catalog" aria-labelledby="catalog-title">
        <div class="catalog-heading">
          <div>
            <p class="eyebrow"><span>●</span> Rick and Morty API</p>
            <h1 id="catalog-title">Personajes del multiverso</h1>
            <p class="catalog-intro">Busca, filtra y explora expedientes sin recargar la página.</p>
          </div>
          <p class="result-count" role="status"><span></span>${resultLabel}</p>
        </div>

        ${renderCharacterFilters(state)}
        ${renderCharactersContent(state)}
        ${renderPagination(state)}
      </section>

      <footer class="footer">
        <p>Datos provistos por <a href="https://rickandmortyapi.com" target="_blank" rel="noreferrer">The Rick and Morty API ↗</a></p>
        <p>Vanilla JS · Vite · MVVM</p>
      </footer>
    </div>
    ${renderCharacterDetails(state.selectedCharacter)}
  `;
}
