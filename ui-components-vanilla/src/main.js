import "./styles.css";
import { AppHeader } from "./components/AppHeader.js";
import { courses } from "./data/courses.js";
import { FavoritesPage } from "./pages/FavoritesPage.js";
import { HomePage } from "./pages/HomePage.js";

const app = document.querySelector("#app");

const state = {
  currentPage: "home",
  favoriteIds: new Set(),
};

function render() {
  const pageProps = {
    courses,
    favoriteIds: state.favoriteIds,
  };

  const pages = {
    home: () => HomePage(pageProps),
    favorites: () => FavoritesPage(pageProps),
  };

  app.innerHTML = `
    ${AppHeader({
      currentPage: state.currentPage,
      favoriteCount: state.favoriteIds.size,
    })}
    ${pages[state.currentPage]()}
    <footer class="app-footer">Componentes pequeños · Datos claros · Una sola responsabilidad</footer>
  `;
}

app.addEventListener("click", (event) => {
  const pageLink = event.target.closest("[data-page]");
  const favoriteButton = event.target.closest('[data-action="toggle-favorite"]');

  if (pageLink) {
    event.preventDefault();
    state.currentPage = pageLink.dataset.page;
    render();
  }

  if (favoriteButton) {
    const courseId = Number(favoriteButton.dataset.courseId);

    if (state.favoriteIds.has(courseId)) {
      state.favoriteIds.delete(courseId);
    } else {
      state.favoriteIds.add(courseId);
    }

    render();
  }
});

render();
