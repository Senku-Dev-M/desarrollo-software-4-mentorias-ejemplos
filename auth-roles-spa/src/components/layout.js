import { el } from './dom.js';
import { icon } from './icon.js';
import { roles } from './roles.js';

export function brand() {
  return el('div', { class: 'brand' }, icon('logo', 26), el('span', {}, 'umbral', el('span', { class: 'brand-period' }, '.')));
}

export function heading(kicker, title, description, action) {
  return el('header', { class: 'page-heading' },
    el('div', {}, el('p', { class: 'eyebrow' }, kicker), el('h1', { tabindex: '-1' }, title), el('p', { class: 'muted' }, description)),
    action);
}

export function workspace(profile, activePath, pages, content, onSignOut) {
  return el('div', { class: 'workspace' },
    el('aside', { class: 'sidebar' },
      brand(),
      el('p', { class: 'side-caption eyebrow' }, 'Espacio de trabajo'),
      el('nav', { 'aria-label': 'Navegación principal' }, pages.map(page =>
        el('a', { href: `#${page.path}`, 'aria-current': activePath === page.path ? 'page' : null },
          icon(page.icon, 18), page.label))),
      el('div', { class: 'sidebar-foot' },
        el('div', { class: 'identity' },
          el('span', { class: 'avatar', 'aria-hidden': 'true' }, profile.displayName.split(' ').slice(0, 2).map(word => word[0]).join('')),
          el('div', {}, el('strong', {}, profile.displayName), el('small', {}, roles[profile.role].label))),
        el('button', { class: 'signout', type: 'button', onclick: onSignOut }, icon('exit', 17), 'Cerrar sesión'))),
    el('main', { id: 'main-content', class: 'workspace-main' },
      el('div', { class: 'topline' }, el('span', { class: 'eyebrow' }, 'Umbral / Catálogo')),
      content));
}
