import test from "node:test";
import assert from "node:assert/strict";
import { CourseCard } from "../src/components/CourseCard.js";
import { courses } from "../src/data/courses.js";
import { FavoritesPage } from "../src/pages/FavoritesPage.js";
import { HomePage } from "../src/pages/HomePage.js";

test("CourseCard recibe datos y refleja si un curso es favorito", () => {
  const html = CourseCard({ course: courses[0], isFavorite: true });

  assert.match(html, /HTML semántico/);
  assert.match(html, /aria-pressed="true"/);
  assert.match(html, /Guardado/);
});

test("HomePage reutiliza CourseCard para todos los cursos", () => {
  const html = HomePage({ courses, favoriteIds: new Set() });

  courses.forEach((course) => assert.match(html, new RegExp(course.title)));
});

test("FavoritesPage muestra solo los cursos seleccionados", () => {
  const html = FavoritesPage({ courses, favoriteIds: new Set([2]) });

  assert.match(html, /Layouts con Grid/);
  assert.doesNotMatch(html, /HTML semántico/);
});

test("FavoritesPage reutiliza EmptyState cuando no hay selección", () => {
  const html = FavoritesPage({ courses, favoriteIds: new Set() });

  assert.match(html, /Todavía no hay favoritos/);
  assert.match(html, /data-page="home"/);
});
