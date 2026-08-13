import { courses } from "../config/courses";
import type { CourseAffinity, CourseId, CourseStatus } from "../types";

const HYBRID_THRESHOLD = 12; // pontos percentuais de diferença para considerar perfil híbrido
const FUTURE_PATH_THRESHOLD = 55; // afinidade mínima para sugerir como trajetória futura

export function pickPrimaryCourse(eligibleRanking: CourseAffinity[]): CourseAffinity | null {
  return eligibleRanking[0] ?? null;
}

/** Cursos elegíveis empatados em alta afinidade com o principal (perfil híbrido). */
export function findHybridCourses(eligibleRanking: CourseAffinity[]): CourseAffinity[] {
  if (eligibleRanking.length < 2) return [];
  const top = eligibleRanking[0].score;
  return eligibleRanking.filter((c, i) => i > 0 && top - c.score <= HYBRID_THRESHOLD && c.score >= 55);
}

/**
 * Um curso só é "trajetória futura" quando o aluno ainda NÃO chegou na idade
 * mínima dele — nunca quando já passou da idade máxima. Sem essa distinção,
 * uma pessoa mais velha (agora que o formulário não tem mais idade máxima de
 * entrada) veria cursos como "próxima etapa" quando, na verdade, eles já
 * ficaram para trás — o que não faz sentido nenhum.
 */
function isUpcoming(courseId: CourseId, age: number): boolean {
  return age < courses[courseId].ageRange.min;
}

/** Cursos com boa afinidade que o aluno ainda vai poder cursar ao completar a idade mínima. */
export function findFuturePaths(pureRanking: CourseAffinity[], eligibleIds: Set<CourseId>, age: number): CourseAffinity[] {
  return pureRanking.filter((c) => !eligibleIds.has(c.courseId) && isUpcoming(c.courseId, age) && c.score >= FUTURE_PATH_THRESHOLD);
}

export function buildStatusByCourse(pureRanking: CourseAffinity[], eligibleIds: Set<CourseId>, age: number): CourseStatus[] {
  return pureRanking.map((c) => {
    let status: CourseStatus["status"];
    if (eligibleIds.has(c.courseId)) {
      status = "disponivel";
    } else if (isUpcoming(c.courseId, age) && c.score >= FUTURE_PATH_THRESHOLD) {
      status = "proxima-etapa";
    } else {
      status = "fora-da-faixa";
    }
    return { courseId: c.courseId, affinity: c.score, status };
  });
}
