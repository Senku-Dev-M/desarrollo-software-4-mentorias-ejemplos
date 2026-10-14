import { escapeHtml } from "../utils/escapeHtml.js";

export function PageIntro({ eyebrow, title, description }) {
  return `
    <header class="page-intro">
      <p class="page-intro__eyebrow">${escapeHtml(eyebrow)}</p>
      <h1>${escapeHtml(title)}</h1>
      <p class="page-intro__description">${escapeHtml(description)}</p>
    </header>
  `;
}
