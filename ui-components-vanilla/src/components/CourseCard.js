import { CategoryBadge } from "./CategoryBadge.js";
import { escapeHtml } from "../utils/escapeHtml.js";

export function CourseCard({ course, isFavorite }) {
  return `
    <article class="course-card course-card--${escapeHtml(course.color)}">
      <div class="course-card__top">
        <span class="course-card__number" aria-hidden="true">${escapeHtml(course.code)}</span>
        ${CategoryBadge({ label: course.category })}
      </div>

      <div class="course-card__body">
        <p class="course-card__duration">${escapeHtml(course.duration)} de práctica</p>
        <h2>${escapeHtml(course.title)}</h2>
        <p>${escapeHtml(course.description)}</p>
      </div>

      <button
        class="favorite-button"
        type="button"
        data-action="toggle-favorite"
        data-course-id="${course.id}"
        aria-pressed="${isFavorite}"
        aria-label="${isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}: ${escapeHtml(course.title)}"
      >
        <span aria-hidden="true">${isFavorite ? "★" : "☆"}</span>
        ${isFavorite ? "Guardado" : "Guardar"}
      </button>
    </article>
  `;
}
