import { el } from '../components/dom.js';
import { icon } from '../components/icon.js';
import { heading } from '../components/layout.js';
import { deleteDialog, productDialog } from '../components/product-dialog.js';
import { money, units } from '../components/product-list.js';
import { products } from '../services/products.js';

export async function sellerPage({ token, signal, mutationError }) {
  let items = await products.seller(token, signal);
  const list = el('div', { class: 'data-panel' });
  const feedback = el('p', { class: 'notice', role: 'status', hidden: true });
  const sort = () => items.sort((a, b) => a.name.localeCompare(b.name, 'es'));

  function update(message) {
    feedback.textContent = message;
    feedback.hidden = false;
    renderTable();
    // Si el botón que abrió el diálogo ya no está en la tabla, devuelve el foco al título.
    list.closest('section')?.querySelector('h1')?.focus();
  }

  async function run(action) {
    try { return await action(); }
    catch (error) {
      mutationError(error);
      throw error;
    }
  }

  function edit(item) {
    productDialog(item, input => run(async () => {
      const saved = item ? await products.update(token, item.id, input) : await products.create(token, input);
      items = [...items.filter(row => row.id !== saved.id), saved];
      update(item ? 'Producto actualizado.' : 'Producto creado.');
    }));
  }

  function remove(item) {
    deleteDialog(item, () => run(async () => {
      await products.remove(token, item.id);
      items = items.filter(row => row.id !== item.id);
      update('Producto eliminado.');
    }));
  }

  function renderTable() {
    list.replaceChildren(
      el('div', { class: 'data-heading' }, el('p', { class: 'eyebrow' }, 'Inventario propio'),
        el('h2', {}, `${items.length} ${items.length === 1 ? 'producto' : 'productos'}`)),
      items.length ? el('div', { class: 'table-scroll' }, el('table', { 'aria-label': 'Tus productos' },
        el('thead', {}, el('tr', {}, ['Producto', 'Precio', 'Stock', 'Acciones'].map(title => el('th', { scope: 'col' }, title)))),
        el('tbody', {}, sort().map(item => el('tr', {},
          el('th', { scope: 'row' }, item.name),
          el('td', {}, money(item.price)),
          el('td', {}, el('span', { class: item.stock ? 'pill' : 'pill pill-empty' }, units(item.stock))),
          el('td', { class: 'row-actions' },
            el('button', { class: 'button button-small', type: 'button', 'aria-label': `Editar ${item.name}`, onclick: () => edit(item) }, 'Editar'),
            el('button', { class: 'button button-small button-danger', type: 'button', 'aria-label': `Eliminar ${item.name}`, onclick: () => remove(item) }, 'Eliminar')))))))
        : el('p', { class: 'muted' }, 'Todavía no publicaste productos.'));
  }

  renderTable();
  return el('section', { class: 'page-content' },
    heading('02 / Espacio vendedor', 'Mis productos', 'Administra tu inventario. Solo puedes modificar los productos de tu cuenta.',
      el('button', { class: 'button button-primary', type: 'button', onclick: () => edit(null) }, icon('plus', 18), 'Nuevo producto')),
    feedback,
    list);
}
