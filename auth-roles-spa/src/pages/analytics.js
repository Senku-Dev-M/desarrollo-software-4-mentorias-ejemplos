import { el } from '../components/dom.js';
import { heading } from '../components/layout.js';
import { money, units } from '../components/product-list.js';
import { products } from '../services/products.js';

export async function analyticsPage({ token, signal }) {
  const data = await products.analytics(token, signal);
  const max = Math.max(1, ...data.stockLeaders.map(item => item.stock));
  const metrics = [
    ['Productos totales', units(data.productCount)], ['Productos con stock', units(data.availableCount)],
    ['Unidades en inventario', units(data.totalUnits)], ['Valor del inventario', money(data.inventoryValue)],
  ];

  return el('section', { class: 'page-content' },
    heading('01 / Espacio administrador', 'Analytics', 'Una lectura del inventario de todos los vendedores.'),
    el('dl', { class: 'metrics' }, metrics.map(([label, value]) =>
      el('div', { class: 'metric' }, el('dt', {}, label), el('dd', {}, value)))),
    el('section', { class: 'data-panel' },
      el('div', { class: 'data-heading' }, el('p', { class: 'eyebrow' }, 'Inventario / Top 5'),
        el('h2', {}, 'Stock por producto')),
      data.stockLeaders.length ? el('ul', { class: 'stock-chart' }, data.stockLeaders.map(item =>
        el('li', {},
          el('span', {}, item.name),
          el('span', { class: 'bar-track', 'aria-hidden': 'true' },
            el('span', { class: 'bar-fill', style: `width:${100 * item.stock / max}%` })),
          el('strong', {}, units(item.stock))))) : el('p', { class: 'muted' }, 'Aún no hay productos para comparar.')));
}
