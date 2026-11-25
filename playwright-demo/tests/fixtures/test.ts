import { test as base, expect } from "@playwright/test";
import { ProductsPage } from "../pages/products.page";
import { ProductsApiClient } from "../support/api-client";

interface AppFixtures {
  productsPage: ProductsPage;
  productsApi: ProductsApiClient;
}

export const test = base.extend<AppFixtures>({
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  productsApi: async ({ request }, use) => {
    const client = new ProductsApiClient(request);
    await use(client);
    await client.cleanup();
  }
});

export { expect };
