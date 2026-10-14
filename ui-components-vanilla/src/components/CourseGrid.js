import { CourseCard } from "./CourseCard.js";
import { EmptyState } from "./EmptyState.js";

export function CourseGrid({ courses, favoriteIds, emptyState }) {
  if (courses.length === 0) {
    return EmptyState(emptyState);
  }

  return `
    <div class="course-grid">
      ${courses
        .map((course) =>
          CourseCard({
            course,
            isFavorite: favoriteIds.has(course.id),
          }),
        )
        .join("")}
    </div>
  `;
}
