import { escapeHtml } from "../utils/escapeHtml.js";

export function EmptyState({ title, message }) {
  return `
    <section class="empty-state">
      <span aria-hidden="true">♡</span>
      <h2>${escapeHtml(title)}</h2>
      <p>${escapeHtml(message)}</p>
      <button type="button" data-page="store">Explorar juegos</button>
    </section>
  `;
}
