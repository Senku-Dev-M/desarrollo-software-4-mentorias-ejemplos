import { test, expect } from "../fixtures/test";
import type { ApiErrorResponse, Product } from "../support/types";

test.describe("Reading products", () => {
  test("lists the seeded catalog items", async ({ productsApi }) => {
    const response = await productsApi.listProducts();

    expect(response.status()).toBe(200);

    const products = (await response.json()) as Product[];
    expect(Array.isArray(products)).toBe(true);
    expect(products).toEqual(
      expect.arrayContaining([
        { id: 1, name: "Laptop", price: 2500 },
        { id: 2, name: "Mouse", price: 150 }
      ])
    );
  });

  test("retrieves a specific product by its ID", async ({ productsApi }) => {
    const seeded = await productsApi.seedProduct({
      name: "Ergonomic Keyboard",
      price: 390
    });

    const response = await productsApi.getProduct(seeded.id);

    expect(response.status()).toBe(200);

    const product = (await response.json()) as Product;
    expect(product).toEqual(seeded);
  });

  test("returns 404 when the requested product does not exist", async ({ productsApi }) => {
    const response = await productsApi.getProduct(999999);

    expect(response.status()).toBe(404);

    const error = (await response.json()) as ApiErrorResponse;
    expect(error.message).toBe("Producto no encontrado.");
  });

  test("returns 404 when the product ID is not an integer", async ({ productsApi }) => {
    const response = await productsApi.getProduct("invalid-id");

    expect(response.status()).toBe(404);
  });
});
