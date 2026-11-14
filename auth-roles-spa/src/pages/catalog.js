import { el } from '../components/dom.js';
import { heading } from '../components/layout.js';
import { productList } from '../components/product-list.js';
import { products } from '../services/products.js';

export async function catalogPage({ token, signal }) {
  const inventory = await products.inventory(token, signal);
  return el('section', { class: 'page-content' },
    heading('01 / Inventario general', 'Catálogo', 'Inventario compartido por todos los perfiles con una sesión activa.'),
    productList(inventory, 'Todavía no hay productos en el catálogo.'));
}
