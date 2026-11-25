import type { Page } from "@playwright/test";
import type { Product, ProductPayload } from "./types";

export interface MockApiOptions {
  initialProducts?: readonly Product[];
  getErrorStatus?: number;
  postError?: {
    status: number;
    message: string;
  };
  deleteErrorStatus?: number;
}

export interface MockedCatalogApi {
  readonly createdPayloads: ProductPayload[];
  readonly deletedIds: number[];
  readonly getRequestCount: () => number;
  readonly postRequestCount: () => number;
}

export async function stubProductsApi(
  page: Page,
  options: MockApiOptions = {}
): Promise<MockedCatalogApi> {
  const catalog: Product[] = options.initialProducts
    ? options.initialProducts.map((item) => ({ ...item }))
    : [];

  let nextId = Math.max(100, ...catalog.map((item) => item.id));
  let getCalls = 0;
  let postCalls = 0;
  const createdPayloads: ProductPayload[] = [];
  const deletedIds: number[] = [];

  await page.route(/\/api\/products(?:\/(\d+))?$/, async (route) => {
    const request = route.request();
    const method = request.method();
    const match = request.url().match(/\/api\/products(?:\/(\d+))?$/);
    const itemId = match?.[1] ? Number(match[1]) : undefined;

    if (method === "GET" && itemId === undefined) {
      getCalls += 1;

      if (options.getErrorStatus) {
        await route.fulfill({
          status: options.getErrorStatus,
          contentType: "application/json",
          body: JSON.stringify({ message: "Unable to load catalog." })
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(catalog)
      });
      return;
    }

    if (method === "POST" && itemId === undefined) {
      postCalls += 1;
      const payload = request.postDataJSON() as ProductPayload;
      createdPayloads.push(payload);

      if (options.postError) {
        await route.fulfill({
          status: options.postError.status,
          contentType: "application/json",
          body: JSON.stringify({ message: options.postError.message })
        });
        return;
      }

      nextId += 1;
      const created: Product = {
        id: nextId,
        name: payload.name,
        price: payload.price
      };
      catalog.push(created);

      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify(created)
      });
      return;
    }

    if (method === "DELETE" && itemId !== undefined) {
      deletedIds.push(itemId);

      if (options.deleteErrorStatus) {
        await route.fulfill({
          status: options.deleteErrorStatus,
          contentType: "application/json",
          body: JSON.stringify({ message: "Unable to delete product." })
        });
        return;
      }

      const index = catalog.findIndex((item) => item.id === itemId);
      if (index >= 0) {
        catalog.splice(index, 1);
      }

      await route.fulfill({ status: 204 });
      return;
    }

    await route.continue();
  });

  return {
    createdPayloads,
    deletedIds,
    getRequestCount: () => getCalls,
    postRequestCount: () => postCalls
  };
}
