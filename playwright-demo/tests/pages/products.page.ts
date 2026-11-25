import type { Locator, Page } from "@playwright/test";

export class ProductsPage {
  readonly heading: Locator;
  readonly formHeading: Locator;
  readonly catalogHeading: Locator;
  readonly nameInput: Locator;
  readonly priceInput: Locator;
  readonly saveButton: Locator;
  readonly statusBanner: Locator;
  readonly productList: Locator;
  readonly productItems: Locator;
  readonly emptyState: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole("heading", { level: 1, name: "Productos" });
    this.formHeading = page.getByRole("heading", {
      level: 2,
      name: "Agregar un producto"
    });
    this.catalogHeading = page.getByRole("heading", {
      level: 2,
      name: "Productos registrados"
    });
    this.nameInput = page.getByLabel("Nombre del producto");
    this.priceInput = page.getByLabel("Precio (Bs)");
    this.saveButton = page.getByRole("button", { name: "Guardar producto" });
    this.statusBanner = page.getByRole("status");
    this.productList = page.getByRole("list", { name: "Lista de productos" });
    this.productItems = this.productList.getByRole("listitem");
    this.emptyState = this.productList.getByText("No hay productos registrados.");
  }

  async goto(): Promise<void> {
    await this.page.goto("/");
  }

  async fillForm(name: string, price: string | number): Promise<void> {
    await this.nameInput.fill(name);
    await this.priceInput.fill(String(price));
  }

  async submitForm(): Promise<void> {
    await this.saveButton.click();
  }

  async createProduct(name: string, price: string | number): Promise<void> {
    await this.fillForm(name, price);
    await this.submitForm();
  }

  deleteButtonFor(productName: string): Locator {
    return this.page.getByRole("button", {
      name: `Eliminar ${productName}`,
      exact: true
    });
  }

  productItem(productName: string): Locator {
    return this.productItems.filter({
      has: this.deleteButtonFor(productName)
    });
  }

  async deleteProduct(productName: string): Promise<void> {
    await this.deleteButtonFor(productName).click();
  }
}
