import { escapeHtml } from "../utils/escapeHtml.js";

export function CategoryBadge({ label }) {
  return `<span class="category-badge">${escapeHtml(label)}</span>`;
}
