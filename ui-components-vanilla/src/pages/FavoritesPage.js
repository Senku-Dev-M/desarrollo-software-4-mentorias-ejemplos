import { CourseGrid } from "../components/CourseGrid.js";
import { PageIntro } from "../components/PageIntro.js";

export function FavoritesPage({ courses, favoriteIds }) {
  const favoriteCourses = courses.filter((course) => favoriteIds.has(course.id));

  return `
    <main class="page">
      ${PageIntro({
        eyebrow: "La misma pieza, otra página",
        title: "Tus temas guardados",
        description:
          "Esta página filtra los datos, pero reutiliza CourseGrid y CourseCard para mostrarlos.",
      })}

      ${CourseGrid({
        courses: favoriteCourses,
        favoriteIds,
        emptyState: {
          title: "Todavía no hay favoritos",
          message: "Guarda una tarjeta y aparecerá aquí usando el mismo componente.",
          action: { label: "Explorar temas", page: "home" },
        },
      })}
    </main>
  `;
}
