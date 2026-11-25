import { test, expect } from "../fixtures/test";
import { buildUniqueProduct } from "../support/test-data";
import type { Product } from "../support/types";

test.describe("End-to-end product creation", () => {
  test("creates a product in the UI and persists it in the backend", async ({
    page,
    productsPage,
    productsApi
  }) => {
    const candidate = buildUniqueProduct({ price: 199.9 });

    await productsPage.goto();

    const createResponsePromise = page.waitForResponse(
      (response) =>
        response.url().includes("/api/products") &&
        response.request().method() === "POST"
    );

    await productsPage.createProduct(candidate.name, candidate.price);

    const createResponse = await createResponsePromise;
    expect(createResponse.status()).toBe(201);

    const created = (await createResponse.json()) as Product;
    productsApi.track(created.id);

    expect(created.name).toBe(candidate.name);
    expect(created.price).toBe(199.9);

    await expect(productsPage.statusBanner).toHaveText("Producto creado correctamente.");
    await expect(productsPage.productItem(candidate.name)).toBeVisible();

    const apiResponse = await productsApi.getProduct(created.id);
    expect(apiResponse.status()).toBe(200);
    expect((await apiResponse.json()) as Product).toEqual(created);
  });

  test("keeps a newly created product visible after a full page reload", async ({
    page,
    productsPage,
    productsApi
  }) => {
    const candidate = buildUniqueProduct({ price: 325 });

    await productsPage.goto();

    const createResponsePromise = page.waitForResponse(
      (response) =>
        response.url().includes("/api/products") &&
        response.request().method() === "POST"
    );

    await productsPage.createProduct(candidate.name, candidate.price);

    const createResponse = await createResponsePromise;
    const created = (await createResponse.json()) as Product;
    productsApi.track(created.id);

    await expect(productsPage.productItem(candidate.name)).toBeVisible();

    await page.reload();

    await expect(productsPage.productItem(candidate.name)).toBeVisible();
  });

  test("shows the real backend validation error when submitting only spaces", async ({
    page,
    productsPage
  }) => {
    await productsPage.goto();

    const createResponsePromise = page.waitForResponse(
      (response) =>
        response.url().includes("/api/products") &&
        response.request().method() === "POST"
    );

    await productsPage.createProduct("   ", 150);

    const createResponse = await createResponsePromise;
    expect(createResponse.status()).toBe(400);

    await expect(productsPage.statusBanner).toHaveAttribute("data-state", "error");
    await expect(productsPage.statusBanner).toHaveText(
      "El nombre del producto es obligatorio."
    );
  });
});
