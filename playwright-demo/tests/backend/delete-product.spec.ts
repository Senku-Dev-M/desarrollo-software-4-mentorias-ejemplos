import { test, expect } from "../fixtures/test";

test.describe("Deleting products", () => {
  test("deletes an existing product and removes it from future queries", async ({ productsApi }) => {
    const seeded = await productsApi.seedProduct();

    const deleteResponse = await productsApi.deleteProduct(seeded.id);

    expect(deleteResponse.status()).toBe(204);
    expect(await deleteResponse.text()).toBe("");

    const getResponse = await productsApi.getProduct(seeded.id);
    expect(getResponse.status()).toBe(404);
  });

  test("returns 404 when deleting a product that does not exist", async ({ productsApi }) => {
    const response = await productsApi.deleteProduct(999999);

    expect(response.status()).toBe(404);
  });
});
