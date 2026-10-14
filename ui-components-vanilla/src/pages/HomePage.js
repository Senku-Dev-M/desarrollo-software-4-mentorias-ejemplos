import { CourseGrid } from "../components/CourseGrid.js";
import { PageIntro } from "../components/PageIntro.js";

export function HomePage({ courses, favoriteIds }) {
  return `
    <main class="page">
      ${PageIntro({
        eyebrow: "Ejemplo 04 · Composición de UI",
        title: "Aprender en piezas",
        description:
          "Cada tarjeta es el mismo componente recibiendo datos diferentes. Guarda algunas para verlo reutilizado en otra página.",
      })}

      ${CourseGrid({
        courses,
        favoriteIds,
        emptyState: {
          title: "No hay temas disponibles",
          message: "Agrega algunos temas al archivo de datos para mostrarlos aquí.",
        },
      })}
    </main>
  `;
}
