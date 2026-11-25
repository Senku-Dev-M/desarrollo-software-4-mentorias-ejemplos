import { test, expect } from "../fixtures/test";
import { stubProductsApi } from "../support/mock-api";

test.describe("Deleting a product from the catalog", () => {
  test("removes the selected product and keeps other items visible", async ({
    page,
    productsPage
  }) => {
    const mockedApi = await stubProductsApi(page, {
      initialProducts: [
        { id: 101, name: "Laptop Pro", price: 2500 },
        { id: 102, name: "Wireless Mouse", price: 150 }
      ]
    });

    await productsPage.goto();
    await productsPage.deleteProduct("Wireless Mouse");

    await expect(productsPage.statusBanner).toHaveAttribute("data-state", "success");
    await expect(productsPage.statusBanner).toHaveText("Producto eliminado correctamente.");
    await expect(productsPage.productItem("Wireless Mouse")).toBeHidden();
    await expect(productsPage.productItem("Laptop Pro")).toBeVisible();

    expect(mockedApi.deletedIds).toEqual([102]);
  });

  test("displays the empty state after removing the only product", async ({
    page,
    productsPage
  }) => {
    await stubProductsApi(page, {
      initialProducts: [{ id: 101, name: "USB-C Dock", price: 480 }]
    });

    await productsPage.goto();
    await productsPage.deleteProduct("USB-C Dock");

    await expect(productsPage.emptyState).toBeVisible();
    await expect(productsPage.productItem("USB-C Dock")).toBeHidden();
  });

  test("shows an error message and preserves the item when deletion fails", async ({
    page,
    productsPage
  }) => {
    await stubProductsApi(page, {
      initialProducts: [{ id: 101, name: "USB-C Dock", price: 480 }],
      deleteErrorStatus: 500
    });

    await productsPage.goto();
    await productsPage.deleteProduct("USB-C Dock");

    await expect(productsPage.statusBanner).toHaveAttribute("data-state", "error");
    await expect(productsPage.statusBanner).toHaveText(
      "No se pudo eliminar el producto. HTTP 500"
    );
    await expect(productsPage.productItem("USB-C Dock")).toBeVisible();
  });
});
