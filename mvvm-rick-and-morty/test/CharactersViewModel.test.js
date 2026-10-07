import assert from "node:assert/strict";
import test from "node:test";
import { CharactersViewModel } from "../src/viewmodel/CharactersViewModel.js";

function createCharacter(id, name) {
  return { id, name, status: "Alive" };
}

test("ViewModel exposes loading and loaded states without knowing the DOM", async () => {
  const calls = [];
  const model = {
    async getCharacters(options) {
      calls.push(options);
      return {
        characters: [createCharacter(1, "Rick Sanchez")],
        pagination: { count: 1, pages: 3 },
      };
    },
  };
  const viewModel = new CharactersViewModel(model);
  const states = [];
  viewModel.subscribe((state) => states.push(state));

  await viewModel.initialize();

  assert.equal(states.some((state) => state.isLoading), true);
  assert.equal(viewModel.getState().characters[0].name, "Rick Sanchez");
  assert.equal(viewModel.getState().totalPages, 3);
  assert.equal(calls[0].page, 1);
});

test("ViewModel coordinates filters, pages and selected character", async () => {
  const calls = [];
  const model = {
    async getCharacters(options) {
      calls.push(options);
      return {
        characters: [createCharacter(2, "Morty Smith")],
        pagination: { count: 40, pages: 2 },
      };
    },
  };
  const viewModel = new CharactersViewModel(model);

  await viewModel.search({ name: " Morty ", status: "alive" });
  await viewModel.nextPage();
  viewModel.selectCharacter(2);

  assert.deepEqual(viewModel.getState().filters, {
    name: "Morty",
    status: "alive",
  });
  assert.equal(calls[0].page, 1);
  assert.equal(calls[1].page, 2);
  assert.equal(viewModel.getState().selectedCharacter.name, "Morty Smith");

  viewModel.closeDetails();
  assert.equal(viewModel.getState().selectedCharacter, null);
});

test("ViewModel converts model failures into a user-facing state", async () => {
  const viewModel = new CharactersViewModel({
    async getCharacters() {
      throw new Error("Network unavailable");
    },
  });

  await viewModel.initialize();

  assert.equal(viewModel.getState().isLoading, false);
  assert.match(viewModel.getState().error, /No pudimos abrir el portal/);
});
