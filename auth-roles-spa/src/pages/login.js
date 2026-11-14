import { el } from '../components/dom.js';
import { brand } from '../components/layout.js';

export function loginPage(onSignIn, notice = '') {
  const error = el('p', { class: 'message', role: 'alert', hidden: true });
  const submit = el('button', { type: 'submit', class: 'button button-primary' }, 'Entrar');
  const form = el('form', {
    class: 'login-form',
    onsubmit: async event => {
      event.preventDefault();
      const fields = new FormData(form);
      error.hidden = true;
      submit.disabled = true;
      try {
        await onSignIn({ email: fields.get('email'), password: fields.get('password') });
      } catch (failure) {
        error.textContent = failure.message;
        error.hidden = false;
      } finally {
        submit.disabled = false;
      }
    },
  },
  el('label', {}, 'Correo electrónico',
    el('input', { name: 'email', type: 'email', autocomplete: 'username', required: true })),
  el('label', {}, 'Contraseña',
    el('input', { name: 'password', type: 'password', autocomplete: 'current-password', required: true })),
  error, submit);

  return el('main', { class: 'login' },
    el('section', { class: 'login-cover', 'aria-label': 'Umbral' },
      brand(),
      el('div', { class: 'cover-copy' }, el('p', { class: 'eyebrow' }, 'Catálogo e inventario'),
        el('p', { class: 'cover-title' }, 'Un catálogo.', el('br'), el('em', {}, 'Tres accesos.')),
        el('p', { class: 'cover-description' }, 'Consulta el catálogo, gestiona tus productos o revisa las métricas según tu perfil.')),
      el('div', { class: 'door-art', 'aria-hidden': 'true' },
        el('span', { class: 'door door-one' }, '01'), el('span', { class: 'door door-two' }, '02'), el('span', { class: 'door door-three' }, '03')),
      el('p', { class: 'cover-footer eyebrow' }, 'Desarrollo de Software 4')),
    el('section', { class: 'login-panel', 'aria-labelledby': 'login-title' },
      el('div', { class: 'login-copy' },
        el('p', { class: 'eyebrow' }, '01 / Inicio de sesión'),
        el('h1', { id: 'login-title', tabindex: '-1' }, 'Inicia sesión'),
        el('p', { class: 'muted' }, 'Accede con tu correo y contraseña.')),
      notice ? el('p', { class: 'notice', role: 'status' }, notice) : null,
      form));
}
