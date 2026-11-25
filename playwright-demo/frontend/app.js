const API_BASE_URL = "http://127.0.0.1:5080";

const productForm = document.querySelector("#product-form");
const productNameInput = document.querySelector("#product-name");
const productPriceInput = document.querySelector("#product-price");
const productsList = document.querySelector("#products-list");
const formStatus = document.querySelector("#form-status");

function setStatus(message, state = "") {
  formStatus.textContent = message;
  formStatus.dataset.state = state;
}

function formatPrice(price) {
  return new Intl.NumberFormat("es-BO", {
    style: "currency",
    currency: "BOB"
  }).format(price);
}

function renderProducts(products) {
  productsList.replaceChildren();

  if (products.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "empty-state";
    emptyItem.textContent = "No hay productos registrados.";
    productsList.append(emptyItem);
    return;
  }

  for (const product of products) {
    const item = document.createElement("li");
    item.className = "product-card";
    item.dataset.productId = String(product.id);

    const details = document.createElement("div");

    const name = document.createElement("strong");
    name.className = "product-card__name";
    name.textContent = product.name;

    const price = document.createElement("span");
    price.className = "product-card__price";
    price.textContent = formatPrice(product.price);

    details.append(name, price);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "button button--delete";
    deleteButton.dataset.productId = String(product.id);
    deleteButton.setAttribute("aria-label", `Eliminar ${product.name}`);
    deleteButton.textContent = "Eliminar";

    item.append(details, deleteButton);
    productsList.append(item);
  }
}

async function loadProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products`);

    if (!response.ok) {
      throw new Error(`La API respondió con HTTP ${response.status}`);
    }

    const products = await response.json();
    renderProducts(products);
  } catch (error) {
    setStatus(`No se pudieron cargar los productos: ${error.message}`, "error");
  }
}

productForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const product = {
    name: productNameInput.value.trim(),
    price: Number(productPriceInput.value)
  };

  setStatus("Guardando producto...");

  try {
    const response = await fetch(`${API_BASE_URL}/api/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(product)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `Error HTTP ${response.status}`);
    }

    productForm.reset();
    setStatus("Producto creado correctamente.", "success");
    await loadProducts();
  } catch (error) {
    setStatus(error.message, "error");
  }
});

productsList.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-product-id]");

  if (!button) {
    return;
  }

  const productId = button.dataset.productId;

  try {
    const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      throw new Error(`No se pudo eliminar el producto. HTTP ${response.status}`);
    }

    setStatus("Producto eliminado correctamente.", "success");
    await loadProducts();
  } catch (error) {
    setStatus(error.message, "error");
  }
});

loadProducts();
