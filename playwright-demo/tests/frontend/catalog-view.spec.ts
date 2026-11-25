import { test, expect } from "../fixtures/test";
import { stubProductsApi } from "../support/mock-api";

test.describe("Product catalog page", () => {
  test("displays the form controls and loaded catalog products", async ({
    page,
    productsPage
  }) => {
    await stubProductsApi(page, {
      initialProducts: [
        { id: 101, name: "Laptop Pro", price: 2500 },
        { id: 102, name: "Wireless Mouse", price: 150 }
      ]
    });

    await productsPage.goto();

    await expect(productsPage.heading).toBeVisible();
    await expect(productsPage.formHeading).toBeVisible();
    await expect(productsPage.catalogHeading).toBeVisible();
    await expect(productsPage.nameInput).toBeVisible();
    await expect(productsPage.priceInput).toBeVisible();
    await expect(productsPage.saveButton).toBeEnabled();

    await expect(productsPage.productItems).toHaveCount(2);
    await expect(productsPage.productItem("Laptop Pro")).toBeVisible();
    await expect(productsPage.productItem("Wireless Mouse")).toBeVisible();
    await expect(productsPage.productItem("Laptop Pro")).toContainText(/2[.,]500/);
    await expect(productsPage.productItem("Wireless Mouse")).toContainText("150");
  });

  test("shows an empty state message when the catalog has no items", async ({
    page,
    productsPage
  }) => {
    await stubProductsApi(page, { initialProducts: [] });

    await productsPage.goto();

    await expect(productsPage.emptyState).toBeVisible();
    await expect(productsPage.productItems).toHaveCount(1);
  });

  test("displays an error banner when loading the catalog fails", async ({
    page,
    productsPage
  }) => {
    await stubProductsApi(page, { getErrorStatus: 500 });

    await productsPage.goto();

    await expect(productsPage.statusBanner).toHaveAttribute("data-state", "error");
    await expect(productsPage.statusBanner).toContainText(
      "No se pudieron cargar los productos: La API respondió con HTTP 500"
    );
  });
});
