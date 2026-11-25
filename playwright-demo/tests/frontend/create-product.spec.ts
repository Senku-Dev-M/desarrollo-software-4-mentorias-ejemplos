import { test, expect } from "../fixtures/test";
import { stubProductsApi } from "../support/mock-api";

test.describe("Creating a product from the form", () => {
  test("submits valid details, resets the form, and adds the product to the list", async ({
    page,
    productsPage
  }) => {
    const mockedApi = await stubProductsApi(page, { initialProducts: [] });

    await productsPage.goto();
    await productsPage.createProduct("Studio Headphones", 420.5);

    await expect(productsPage.statusBanner).toHaveAttribute("data-state", "success");
    await expect(productsPage.statusBanner).toHaveText("Producto creado correctamente.");
    await expect(productsPage.nameInput).toHaveValue("");
    await expect(productsPage.priceInput).toHaveValue("");
    await expect(productsPage.productItem("Studio Headphones")).toBeVisible();
    await expect(productsPage.emptyState).toBeHidden();

    expect(mockedApi.createdPayloads).toEqual([
      { name: "Studio Headphones", price: 420.5 }
    ]);
  });

  test("trims surrounding whitespace from the product name before sending", async ({
    page,
    productsPage
  }) => {
    const mockedApi = await stubProductsApi(page, { initialProducts: [] });

    await productsPage.goto();
    await productsPage.createProduct("  USB-C Hub  ", 180);

    await expect(productsPage.productItem("USB-C Hub")).toBeVisible();
    expect(mockedApi.createdPayloads).toEqual([{ name: "USB-C Hub", price: 180 }]);
  });

  test("displays the validation message returned by the API", async ({
    page,
    productsPage
  }) => {
    await stubProductsApi(page, {
      initialProducts: [],
      postError: {
        status: 400,
        message: "El nombre del producto es obligatorio."
      }
    });

    await productsPage.goto();
    await productsPage.createProduct("   ", 100);

    await expect(productsPage.statusBanner).toHaveAttribute("data-state", "error");
    await expect(productsPage.statusBanner).toHaveText(
      "El nombre del producto es obligatorio."
    );
    await expect(productsPage.nameInput).toHaveValue("   ");
    await expect(productsPage.priceInput).toHaveValue("100");
  });

  test("prevents submitting when required fields are missing", async ({
    page,
    productsPage
  }) => {
    const mockedApi = await stubProductsApi(page, { initialProducts: [] });

    await productsPage.goto();
    await productsPage.submitForm();

    const isFormValid = await productsPage.nameInput.evaluate((input) =>
      (input as HTMLInputElement).checkValidity()
    );
    expect(isFormValid).toBe(false);
    expect(mockedApi.postRequestCount()).toBe(0);
  });
});
