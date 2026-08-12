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

/** Cursos com boa afinidade que ainda não estão disponíveis para a idade atual. */
export function findFuturePaths(pureRanking: CourseAffinity[], eligibleIds: Set<CourseId>): CourseAffinity[] {
  return pureRanking.filter((c) => !eligibleIds.has(c.courseId) && c.score >= FUTURE_PATH_THRESHOLD);
}

export function buildStatusByCourse(pureRanking: CourseAffinity[], eligibleIds: Set<CourseId>): CourseStatus[] {
  return pureRanking.map((c) => ({
    courseId: c.courseId,
    affinity: c.score,
    status: eligibleIds.has(c.courseId)
      ? "disponivel"
      : c.score >= FUTURE_PATH_THRESHOLD
        ? "proxima-etapa"
        : "fora-da-faixa",
  }));
}
