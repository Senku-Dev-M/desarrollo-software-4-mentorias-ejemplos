import { escapeHtml } from "../utils/escapeHtml.js";

export function EmptyState({ title, message, action }) {
  return `
    <section class="empty-state">
      <span aria-hidden="true">☆</span>
      <h2>${escapeHtml(title)}</h2>
      <p>${escapeHtml(message)}</p>
      ${
        action
          ? `<button type="button" data-page="${escapeHtml(action.page)}">${escapeHtml(action.label)}</button>`
          : ""
      }
    </section>
  `;
}
