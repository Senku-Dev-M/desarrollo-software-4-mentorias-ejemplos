import assert from "node:assert/strict";
import test from "node:test";
import { Character } from "../src/model/Character.js";
import { RickAndMortyModel } from "../src/model/RickAndMortyModel.js";

const API_CHARACTER = {
  id: 1,
  name: "Rick Sanchez",
  status: "Alive",
  species: "Human",
  type: "",
  gender: "Male",
  origin: { name: "Earth (C-137)" },
  location: { name: "Citadel of Ricks" },
  image: "https://example.com/rick.jpeg",
  episode: ["episode/1", "episode/2"],
};

test("Model builds the API query and maps results to Character", async () => {
  let requestedUrl;
  const model = new RickAndMortyModel({
    fetchImpl: async (url) => {
      requestedUrl = url;
      return {
        ok: true,
        status: 200,
        json: async () => ({
          info: { count: 1, pages: 1, next: null, prev: null },
          results: [API_CHARACTER],
        }),
      };
    },
  });

  const result = await model.getCharacters({
    page: 2,
    name: " Rick ",
    status: "alive",
  });

  assert.equal(requestedUrl.searchParams.get("page"), "2");
  assert.equal(requestedUrl.searchParams.get("name"), "Rick");
  assert.equal(requestedUrl.searchParams.get("status"), "alive");
  assert.ok(result.characters[0] instanceof Character);
  assert.equal(result.characters[0].episodeCount, 2);
});

test("Model translates a 404 search response into an empty result", async () => {
  const model = new RickAndMortyModel({
    fetchImpl: async () => ({ ok: false, status: 404 }),
  });

  const result = await model.getCharacters({ name: "Nobody" });

  assert.deepEqual(result.characters, []);
  assert.equal(result.pagination.count, 0);
});

test("Model invokes the injected fetch function without binding itself as this", async () => {
  let receivedThis = "not-called";

  async function fetchImpl() {
    receivedThis = this;
    return {
      ok: true,
      status: 200,
      json: async () => ({
        info: { count: 0, pages: 0, next: null, prev: null },
        results: [],
      }),
    };
  }

  const model = new RickAndMortyModel({ fetchImpl });
  await model.getCharacters();

  assert.equal(receivedThis, undefined);
});
