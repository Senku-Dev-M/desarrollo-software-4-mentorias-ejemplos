import { GameApiService } from "./services/GameApiService.js";
import { GameListViewModel } from "./viewmodels/GameListViewModel.js";
import { GameFormViewModel } from "./viewmodels/GameFormViewModel.js";
import { GameDetailsViewModel } from "./viewmodels/GameDetailsViewModel.js";
import { CatalogPage } from "./pages/CatalogPage.js";
import { GameFormPage } from "./pages/GameFormPage.js";
import { GameDetailPage } from "./pages/GameDetailPage.js";
import { Navbar } from "./components/Navbar.js";
import { Router } from "./router/Router.js";
import { config } from "./config/config.js";

/**
 * SPA Application Entry Point
 * Orchestrates Router, MVVM ViewModels, Pages, and Components.
 */
document.addEventListener("DOMContentLoaded", () => {
    // 1. Core Services & ViewModels
    const apiService = new GameApiService();
    const listViewModel = new GameListViewModel(apiService);
    const formViewModel = new GameFormViewModel(apiService);
    const detailsViewModel = new GameDetailsViewModel(apiService);

    // 2. Navigation Component
    const navbarMount = document.getElementById("navbar-mount");
    const navbar = new Navbar(navbarMount);

    // Synchronize navbar total games counter
    listViewModel.subscribe((vm) => {
        navbar.updateCount(vm.totalCount);
    });

    // 3. Mount Point for SPA Pages
    const appRoot = document.getElementById("app-root");

    // 4. Client-side Router
    const router = new Router();

    // Instantiate Pages
    const catalogPage = new CatalogPage(listViewModel, router);
    const formPage = new GameFormPage(formViewModel, apiService, router);
    const detailPage = new GameDetailPage(detailsViewModel, listViewModel, router);

    // Helper to swap mounted page element into DOM
    function mountPage(element) {
        appRoot.innerHTML = "";
        appRoot.appendChild(element);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // 5. Register SPA Routes
    router.addRoute("#/", async () => {
        mountPage(catalogPage.getElement());
        return await catalogPage.render();
    });

    router.addRoute("#/games", async () => {
        mountPage(catalogPage.getElement());
        return await catalogPage.render();
    });

    router.addRoute("#/games/new", async () => {
        mountPage(formPage.getElement());
        return await formPage.render({});
    });

    router.addRoute("#/games/:id", async (params) => {
        mountPage(detailPage.getElement());
        return await detailPage.render(params);
    });

    router.addRoute("#/games/:id/edit", async (params) => {
        mountPage(formPage.getElement());
        return await formPage.render(params);
    });

    // Synchronize active navigation link
    router.onRouteChange((hash) => {
        navbar.setActiveRoute(hash);
    });

    // 6. Update footer API endpoint display
    const footerApiUrl = document.getElementById("footer-api-url");
    if (footerApiUrl) {
        footerApiUrl.textContent = config.apiBaseUrl;
    }

    // 7. Start SPA Router
    router.init();
});
