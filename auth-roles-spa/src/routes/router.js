import { el } from '../components/dom.js';
import { workspace } from '../components/layout.js';
import { roles } from '../components/roles.js';
import { loginPage } from '../pages/login.js';
import { statusPage } from '../pages/status.js';
import { auth } from '../services/auth.js';
import { canVisit, routes } from './routes.js';

export function startRouter(root) {
  let ongoing;
  let loginNotice = '';
  const loading = message => el('p', { class: 'route-loading', role: 'status' }, message);
  const locationPath = () => location.hash.slice(1) || '/';
  const findRoute = path => routes.find(route => route.path === path);

  function show(content) {
    root.replaceChildren(content);
    root.querySelector('h1')?.focus();
  }

  function replace(path) {
    history.replaceState(null, '', `#${path}`);
    void render();
  }

  async function signOut() {
    try {
      await auth.signOut();
      replace('/login');
    } catch (error) {
      show(statusPage('Sesión / Error', 'No pudimos cerrar la sesión',
        error.message, 'Volver al catálogo', '/catalogo'));
    }
  }

  function sendToLogin(path, message) {
    loginNotice = message;
    replace(findRoute(path) ? `/login?next=${encodeURIComponent(path)}` : '/login');
  }

  async function render() {
    ongoing?.abort();
    root.ownerDocument.querySelector('dialog[open]')?.close();
    const controller = new AbortController();
    ongoing = controller;
    const { signal } = controller;
    const [path, query] = locationPath().split('?');
    if (path === '/login') {
      const requestedPath = new URLSearchParams(query).get('next');
      const destination = findRoute(requestedPath)?.path;
      show(loginPage(async credentials => {
        const profile = await auth.signIn(credentials, signal);
        if (!signal.aborted) replace(destination ?? roles[profile.role].destination);
      }, loginNotice));
      loginNotice = '';
      return;
    }

    show(loading('Verificando la sesión…'));
    let profile;
    const dropSession = () => {
      sendToLogin(path, 'La sesión dejó de ser válida. Vuelve a iniciar sesión.');
    };
    const withWorkspace = content => workspace(profile, path,
      routes.filter(route => canVisit(route, profile)), content, signOut);
    const forbidden = () => statusPage('403 / Permisos', 'Acceso denegado',
      'Tu perfil no tiene permiso para abrir esta vista.', 'Volver al catálogo', '/catalogo');

    try {
      const token = await auth.token(signal);
      if (signal.aborted) return;
      if (!token) return sendToLogin(path, path === '/' ? '' : 'Inicia sesión para continuar.');

      // El backend confirma el perfil antes de aplicar el guard. El rol no se guarda en el navegador.
      profile = await auth.profile(token, signal);
      if (signal.aborted) return;
      if (path === '/') return replace(roles[profile.role].destination);
      const route = findRoute(path);
      if (!route) return show(withWorkspace(statusPage('404 / Ruta', 'Página no encontrada',
        'La dirección no corresponde a una página de Umbral.', 'Volver al catálogo', '/catalogo')));
      if (!canVisit(route, profile)) return show(withWorkspace(forbidden()));

      const page = await route.render({
        token, signal,
        mutationError(error) {
          if (signal.aborted) return;
          if (error.status === 401 || error.status === 403) {
            document.querySelector('dialog[open]')?.close();
            if (error.status === 401) dropSession();
            else show(withWorkspace(forbidden()));
          }
        },
      });
      if (!signal.aborted) show(withWorkspace(page));
    } catch (error) {
      if (signal.aborted) return;
      if (error.status === 401) return dropSession();
      if (error.status === 403 && profile) return show(withWorkspace(forbidden()));
      if (error.status === 403) return sendToLogin(path, error.message);
      const recovery = el('div', { class: 'recovery' },
        statusPage('Servicio / Error', 'No pudimos cargar la vista', error.message),
        el('button', { class: 'button button-primary', type: 'button', onclick: render }, 'Reintentar'),
        el('button', { class: 'button', type: 'button', onclick: signOut }, 'Volver al inicio de sesión'));
      show(profile ? withWorkspace(recovery) : recovery);
    }
  }

  window.addEventListener('hashchange', () => { void render(); });
  void render();
}
