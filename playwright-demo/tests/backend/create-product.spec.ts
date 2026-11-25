import { test, expect } from "../fixtures/test";
import { buildUniqueProduct } from "../support/test-data";
import type { ApiErrorResponse, Product } from "../support/types";

test.describe("Creating products", () => {
  test("creates a product and returns its resource location", async ({ productsApi }) => {
    const payload = buildUniqueProduct({ price: 89.9 });

    const createResponse = await productsApi.createProduct(payload);

    expect(createResponse.status()).toBe(201);

    const created = (await createResponse.json()) as Product;
    expect(created.id).toBeGreaterThan(0);
    expect(created.name).toBe(payload.name);
    expect(created.price).toBe(89.9);
    expect(createResponse.headers()["location"]).toBe(`/api/products/${created.id}`);

    const getResponse = await productsApi.getProduct(created.id);
    expect(getResponse.status()).toBe(200);
    expect((await getResponse.json()) as Product).toEqual(created);
  });

  test("trims surrounding whitespace from the product name", async ({ productsApi }) => {
    const baseProduct = buildUniqueProduct({ price: 145 });

    const response = await productsApi.createProduct({
      name: `   ${baseProduct.name}   `,
      price: baseProduct.price
    });

    expect(response.status()).toBe(201);

    const created = (await response.json()) as Product;
    expect(created.name).toBe(baseProduct.name);
  });

  for (const nameCase of [
    { label: "empty", value: "" },
    { label: "whitespace only", value: "   " }
  ]) {
    test(`rejects creation when the name is ${nameCase.label}`, async ({ productsApi }) => {
      const response = await productsApi.createProduct({
        name: nameCase.value,
        price: 120
      });

      expect(response.status()).toBe(400);

      const error = (await response.json()) as ApiErrorResponse;
      expect(error.message).toBe("El nombre del producto es obligatorio.");
    });
  }

  for (const invalidPrice of [0, -25]) {
    test(`rejects creation when price is ${invalidPrice}`, async ({ productsApi }) => {
      const payload = buildUniqueProduct({ price: invalidPrice });

      const response = await productsApi.createProduct(payload);

      expect(response.status()).toBe(400);

      const error = (await response.json()) as ApiErrorResponse;
      expect(error.message).toBe("El precio debe ser mayor que cero.");
    });
  }
});
