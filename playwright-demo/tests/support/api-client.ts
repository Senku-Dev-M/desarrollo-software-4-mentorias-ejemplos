import type { APIRequestContext, APIResponse } from "@playwright/test";
import process from "node:process";
import { buildUniqueProduct } from "./test-data";
import type { Product, ProductPayload } from "./types";

const DEFAULT_API_BASE_URL = "http://127.0.0.1:5080";

export class ProductsApiClient {
  private readonly baseUrl: string;
  private readonly createdIds = new Set<number>();

  constructor(
    private readonly request: APIRequestContext,
    baseUrl = process.env.API_URL ?? DEFAULT_API_BASE_URL
  ) {
    this.baseUrl = baseUrl;
  }

  track(productId: number): number {
    this.createdIds.add(productId);
    return productId;
  }

  async getServiceInfo(): Promise<APIResponse> {
    return this.request.get(`${this.baseUrl}/`);
  }

  async getHealth(): Promise<APIResponse> {
    return this.request.get(`${this.baseUrl}/api/health`);
  }

  async listProducts(): Promise<APIResponse> {
    return this.request.get(`${this.baseUrl}/api/products`);
  }

  async getProduct(id: number | string): Promise<APIResponse> {
    return this.request.get(`${this.baseUrl}/api/products/${id}`);
  }

  async createProduct(payload: Partial<ProductPayload>): Promise<APIResponse> {
    const response = await this.request.post(`${this.baseUrl}/api/products`, {
      data: payload
    });

    if (response.status() === 201) {
      const created = (await response.json()) as Product;
      this.createdIds.add(created.id);
    }

    return response;
  }

  async seedProduct(overrides: Partial<ProductPayload> = {}): Promise<Product> {
    const payload = buildUniqueProduct(overrides);
    const response = await this.createProduct(payload);

    if (response.status() !== 201) {
      throw new Error(
        `Failed to seed product "${payload.name}". Expected 201, received ${response.status()}.`
      );
    }

    return (await response.json()) as Product;
  }

  async updateProduct(
    id: number,
    payload: Partial<ProductPayload>
  ): Promise<APIResponse> {
    return this.request.put(`${this.baseUrl}/api/products/${id}`, {
      data: payload
    });
  }

  async deleteProduct(id: number): Promise<APIResponse> {
    return this.request.delete(`${this.baseUrl}/api/products/${id}`);
  }

  async cleanup(): Promise<void> {
    const idsToDelete = [...this.createdIds].reverse();
    this.createdIds.clear();

    for (const id of idsToDelete) {
      await this.deleteProduct(id);
    }
  }
}
