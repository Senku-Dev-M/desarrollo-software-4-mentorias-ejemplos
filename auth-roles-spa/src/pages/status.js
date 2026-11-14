import { el } from '../components/dom.js';
import { icon } from '../components/icon.js';

export function statusPage(code, title, description, nextLabel, nextPath) {
  return el('section', { class: 'status-page' },
    el('span', { class: 'status-icon' }, icon('lock', 26)),
    el('p', { class: 'eyebrow' }, code),
    el('h1', { tabindex: '-1' }, title),
    el('p', { class: 'muted' }, description),
    nextLabel ? el('a', { class: 'button button-primary', href: `#${nextPath}` }, nextLabel, icon('arrow', 17)) : null);
}
