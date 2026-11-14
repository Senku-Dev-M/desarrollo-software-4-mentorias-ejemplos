import { el } from '../components/dom.js';
import { heading } from '../components/layout.js';
import { productList } from '../components/product-list.js';
import { products } from '../services/products.js';

export async function buyerPage({ token, signal }) {
  const available = await products.available(token, signal);
  return el('section', { class: 'page-content' },
    heading('03 / Espacio comprador', 'Disponibles', 'Explora el catálogo filtrado: aquí verás únicamente productos con stock.'),
    productList(available, 'Por ahora no hay productos con stock.'));
}
