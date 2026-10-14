import test from "node:test";
import assert from "node:assert/strict";
import { GameCard } from "../src/components/GameCard.js";
import { games } from "../src/data/games.js";
import { GameDetailsPage } from "../src/pages/GameDetailsPage.js";
import { StorePage } from "../src/pages/StorePage.js";
import { WishlistPage } from "../src/pages/WishlistPage.js";

test("GameCard recibe un juego y su estado de lista de deseos", () => {
  const html = GameCard({ game: games[0], isWishlisted: true });

  assert.match(html, /Nebula Drift/);
  assert.match(html, /aria-pressed="true"/);
  assert.match(html, /En tu lista/);
});

test("StorePage reutiliza GameCard para todos los juegos", () => {
  const html = StorePage({ games, wishlistIds: new Set() });

  games.forEach((game) => assert.match(html, new RegExp(game.title)));
});

test("GameDetailsPage muestra los datos del juego seleccionado", () => {
  const html = GameDetailsPage({ game: games[1], isWishlisted: false });

  assert.match(html, /Hollow Signal/);
  assert.match(html, /Quiet North/);
  assert.match(html, /Agregar a mi lista/);
});

test("WishlistPage muestra solo los juegos agregados", () => {
  const html = WishlistPage({ games, wishlistIds: new Set([3]) });

  assert.match(html, /Pixel Forge/);
  assert.doesNotMatch(html, /Nebula Drift/);
});

test("WishlistPage muestra un estado vacío sin juegos guardados", () => {
  const html = WishlistPage({ games, wishlistIds: new Set() });

  assert.match(html, /Tu lista está vacía/);
  assert.match(html, /data-page="store"/);
});
