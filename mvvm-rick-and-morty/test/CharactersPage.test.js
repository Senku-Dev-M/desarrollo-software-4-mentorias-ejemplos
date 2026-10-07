import test from "node:test";
import assert from "node:assert/strict";
import { renderCharactersContent } from "../src/view/components/CharactersContent.js";
import { renderCharactersPage } from "../src/view/pages/CharactersPage.js";

const character = {
  id: 1,
  name: "Rick <script>alert(1)</script>",
  status: "Alive",
  species: "Human",
  gender: "Male",
  type: "",
  origin: "Earth (C-137)",
  location: "Citadel of Ricks",
  image: "https://example.com/rick.png",
  episodeCount: 51,
};

function createState(overrides = {}) {
  return {
    characters: [character],
    filters: { name: "Rick", status: "alive" },
    page: 1,
    totalPages: 42,
    totalCharacters: 826,
    isLoading: false,
    error: null,
    selectedCharacter: null,
    ...overrides,
  };
}

test("la página compone filtros, tarjetas y paginación", () => {
  const html = renderCharactersPage(createState());

  assert.match(html, /data-search-form/);
  assert.match(html, /value="alive" selected/);
  assert.match(html, /data-action="select"/);
  assert.match(html, /826 coincidencias registradas/);
  assert.match(html, /PÁGINA/);
});

test("los componentes escapan los datos externos antes de renderizarlos", () => {
  const html = renderCharactersPage(createState({ selectedCharacter: character }));

  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /Rick &lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.match(html, /role="dialog"/);
});

test("el contenido representa carga, error y resultado vacío", () => {
  assert.match(renderCharactersContent(createState({ isLoading: true })), /Cargando personajes/);
  assert.match(
    renderCharactersContent(createState({ characters: [], error: "Sin conexión" })),
    /Reconectar portal/,
  );
  assert.match(
    renderCharactersContent(createState({ characters: [], error: null })),
    /Nadie responde a esa descripción/,
  );
});
