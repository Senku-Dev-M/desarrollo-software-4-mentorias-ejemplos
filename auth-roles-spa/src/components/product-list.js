import { el } from './dom.js';
import { icon } from './icon.js';

const currency = new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' });
export const money = value => currency.format(value);
export const units = value => new Intl.NumberFormat('es-BO').format(value);

export function productList(items, emptyMessage) {
  if (!items.length) return el('p', { class: 'empty-state' }, emptyMessage);
  return el('ul', { class: 'product-grid' }, items.map((item, index) =>
    el('li', { class: 'product-card' },
      el('div', { class: `product-art art-${index % 3}` }, icon('box', 42),
        el('span', { class: 'eyebrow' }, String(index + 1).padStart(2, '0'))),
      el('div', { class: 'product-info' }, el('h2', {}, item.name),
        el('div', { class: 'product-meta' }, el('strong', {}, money(item.price)),
          el('span', { class: item.stock ? 'pill' : 'pill pill-empty' },
            item.stock ? `${units(item.stock)} en stock` : 'Agotado'))))));
}
