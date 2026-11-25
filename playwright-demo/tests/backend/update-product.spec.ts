import { test, expect } from "../fixtures/test";
import { buildUniqueProduct } from "../support/test-data";
import type { ApiErrorResponse, Product } from "../support/types";

test.describe("Updating products", () => {
  test("updates an existing product name and price", async ({ productsApi }) => {
    const existing = await productsApi.seedProduct({ price: 150 });
    const replacement = buildUniqueProduct({
      name: "Studio Microphone",
      price: 410.5
    });

    const updateResponse = await productsApi.updateProduct(existing.id, replacement);

    expect(updateResponse.status()).toBe(200);

    const updated = (await updateResponse.json()) as Product;
    expect(updated).toEqual({
      id: existing.id,
      name: replacement.name,
      price: replacement.price
    });

    const getResponse = await productsApi.getProduct(existing.id);
    expect((await getResponse.json()) as Product).toEqual(updated);
  });

  test("trims surrounding whitespace when updating a product name", async ({ productsApi }) => {
    const existing = await productsApi.seedProduct();
    const updatedName = buildUniqueProduct().name;

    const response = await productsApi.updateProduct(existing.id, {
      name: `  ${updatedName}  `,
      price: 275
    });

    expect(response.status()).toBe(200);

    const updated = (await response.json()) as Product;
    expect(updated.name).toBe(updatedName);
  });

  test("returns 404 when updating a product that does not exist", async ({ productsApi }) => {
    const payload = buildUniqueProduct();

    const response = await productsApi.updateProduct(999999, payload);

    expect(response.status()).toBe(404);

    const error = (await response.json()) as ApiErrorResponse;
    expect(error.message).toBe("Producto no encontrado.");
  });

  test("preserves original values when an update fails validation", async ({ productsApi }) => {
    const existing = await productsApi.seedProduct({ price: 320 });

    const blankNameResponse = await productsApi.updateProduct(existing.id, {
      name: "   ",
      price: 500
    });
    expect(blankNameResponse.status()).toBe(400);

    const invalidPriceResponse = await productsApi.updateProduct(existing.id, {
      name: "Updated Monitor",
      price: 0
    });
    expect(invalidPriceResponse.status()).toBe(400);

    const getResponse = await productsApi.getProduct(existing.id);
    expect((await getResponse.json()) as Product).toEqual(existing);
  });
});
