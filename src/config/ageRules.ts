import { courses } from "./courses";
import type { CourseId } from "../types";

/**
 * Regras de idade — absolutas, conforme especificação da TECHERS.
 * | Curso                | Idade |
 * |-----------------------|-------|
 * | Maker                 | 5–7   |
 * | Programação            | 8–17  |
 * | Robótica               | 8–17  |
 * | Informática Moderna    | 8+    |
 * | Animação Digital       | 12–17 |
 * | Design Gráfico         | 12–17 |
 *
 * Afinidade (o quanto o perfil combina com o curso) e elegibilidade (se o
 * aluno pode começar agora) são sempre calculadas separadamente.
 */

export function isEligible(courseId: CourseId, age: number): boolean {
  const range = courses[courseId].ageRange;
  if (age < range.min) return false;
  if (range.max !== null && age > range.max) return false;
  return true;
}

/** Cursos "principais" (fora Informática Moderna) cuja afinidade deve ser
 * calculada para uma determinada idade — inclui trajetórias futuras. */
export function coursesToCalculate(age: number): CourseId[] {
  if (age <= 7) {
    return ["maker", "programacao", "robotica", "animacao-digital", "design-grafico"];
  }
  if (age <= 11) {
    return ["programacao", "robotica", "animacao-digital", "design-grafico"];
  }
  return ["programacao", "robotica", "animacao-digital", "design-grafico"];
}

/** Se Informática Moderna deve ser calculada para essa idade (8+). */
export function shouldCalculateInformatica(age: number): boolean {
  return age >= 8;
}

export function eligibleMainCourses(age: number): CourseId[] {
  return coursesToCalculate(age).filter((id) => isEligible(id, age));
}
