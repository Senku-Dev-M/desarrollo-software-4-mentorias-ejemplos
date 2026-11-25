import { test, expect } from "../fixtures/test";

test.describe("End-to-end product deletion", () => {
  test("deletes a seeded product from the UI and removes it from the backend", async ({
    page,
    productsPage,
    productsApi
  }) => {
    const seeded = await productsApi.seedProduct({
      name: "Temporary Monitor",
      price: 890
    });

    await productsPage.goto();
    await expect(productsPage.productItem(seeded.name)).toBeVisible();

    const deleteResponsePromise = page.waitForResponse(
      (response) =>
        response.url().endsWith(`/api/products/${seeded.id}`) &&
        response.request().method() === "DELETE"
    );

    await productsPage.deleteProduct(seeded.name);

    const deleteResponse = await deleteResponsePromise;
    expect(deleteResponse.status()).toBe(204);

    await expect(productsPage.statusBanner).toHaveText(
      "Producto eliminado correctamente."
    );
    await expect(productsPage.productItem(seeded.name)).toBeHidden();

    const verifyResponse = await productsApi.getProduct(seeded.id);
    expect(verifyResponse.status()).toBe(404);
  });
});
