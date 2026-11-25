import { test, expect } from "../fixtures/test";
import type { HealthResponse, ServiceInfoResponse } from "../support/types";

test.describe("API health and service metadata", () => {
  test("returns service metadata from the root endpoint", async ({ productsApi }) => {
    const response = await productsApi.getServiceInfo();

    expect(response.status()).toBe(200);

    const payload = (await response.json()) as ServiceInfoResponse;
    expect(payload).toEqual({
      name: "Demo Products API",
      status: "running"
    });
  });

  test("reports healthy status from the health check endpoint", async ({ productsApi }) => {
    const response = await productsApi.getHealth();

    expect(response.status()).toBe(200);

    const payload = (await response.json()) as HealthResponse;
    expect(payload).toEqual({ status: "ok" });
  });
});
