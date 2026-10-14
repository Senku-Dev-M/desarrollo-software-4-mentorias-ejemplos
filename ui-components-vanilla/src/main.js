import "./styles.css";
import { AppHeader } from "./components/AppHeader.js";
import { games } from "./data/games.js";
import { GameDetailsPage } from "./pages/GameDetailsPage.js";
import { StorePage } from "./pages/StorePage.js";
import { WishlistPage } from "./pages/WishlistPage.js";

const app = document.querySelector("#app");

const state = {
  currentPage: "store",
  selectedGameId: null,
  wishlistIds: new Set(),
};

function render() {
  const selectedGame = games.find((game) => game.id === state.selectedGameId);
  const sharedProps = { games, wishlistIds: state.wishlistIds };

  const pages = {
    store: () => StorePage(sharedProps),
    wishlist: () => WishlistPage(sharedProps),
    details: () =>
      GameDetailsPage({
        game: selectedGame,
        isWishlisted: state.wishlistIds.has(state.selectedGameId),
      }),
  };

  app.innerHTML = `
    ${AppHeader({
      currentPage: state.currentPage,
      wishlistCount: state.wishlistIds.size,
    })}
    ${pages[state.currentPage]()}
  `;
}

app.addEventListener("click", (event) => {
  const pageButton = event.target.closest("[data-page]");
  const actionButton = event.target.closest("[data-action]");

  if (pageButton) {
    state.currentPage = pageButton.dataset.page;
    render();
    return;
  }

  if (!actionButton) return;

  const gameId = Number(actionButton.dataset.gameId);

  if (actionButton.dataset.action === "view-details") {
    state.selectedGameId = gameId;
    state.currentPage = "details";
  }

  if (actionButton.dataset.action === "toggle-wishlist") {
    if (state.wishlistIds.has(gameId)) {
      state.wishlistIds.delete(gameId);
    } else {
      state.wishlistIds.add(gameId);
    }
  }

  render();
});

render();
