import { courseWeights, IM_TIER_THRESHOLDS } from "../config/scoring";
import { questions } from "../config/questions";
import type { ComplementaryResult, CourseAffinity, CourseId, IndicationTier, ProfileDimension, StudentProfile } from "../types";

function dot(weights: Partial<Record<ProfileDimension, number>>, values: Partial<Record<ProfileDimension, number>>): number {
  let total = 0;
  for (const [dim, w] of Object.entries(weights)) {
    total += (w ?? 0) * (values[dim as ProfileDimension] ?? 0);
  }
  return total;
}

/**
 * Máximo teórico e efetivamente alcançável para um curso: em cada pergunta,
 * a alternativa que mais favorece o curso é escolhida. Diferente de um
 * máximo por dimensão isolada (inatingível, pois só é possível escolher uma
 * alternativa por pergunta), este valor é sempre alcançável por algum
 * conjunto real de respostas — por isso é usado para normalizar a afinidade.
 */
function maxAchievableScore(courseId: CourseId): number {
  const weights = courseWeights[courseId];
  let total = 0;
  for (const question of questions) {
    let best = 0;
    for (const option of question.options) {
      best = Math.max(best, dot(weights, option.weights));
    }
    total += best;
  }
  return total;
}

const maxScoreCache = new Map<CourseId, number>();
function getMaxScore(courseId: CourseId): number {
  if (!maxScoreCache.has(courseId)) {
    maxScoreCache.set(courseId, maxAchievableScore(courseId));
  }
  return maxScoreCache.get(courseId)!;
}

function computeCourseAffinity(courseId: CourseId, profile: StudentProfile): CourseAffinity {
  const weights = courseWeights[courseId];
  const raw = dot(weights, profile);
  const max = getMaxScore(courseId);
  const score = max > 0 ? Math.round(Math.min(100, (raw / max) * 100)) : 0;
  return { courseId, score, rawScore: raw, maxScore: max };
}

/** Calcula a afinidade pura (0-100) para um conjunto de cursos, ignorando idade. */
export function computeAffinities(profile: StudentProfile, courseIds: CourseId[]): CourseAffinity[] {
  return courseIds
    .map((id) => computeCourseAffinity(id, profile))
    .sort((a, b) => b.score - a.score);
}

function tierFor(score: number): IndicationTier {
  if (score >= IM_TIER_THRESHOLDS.alta) return "alta";
  if (score >= IM_TIER_THRESHOLDS.moderada) return "moderada";
  return "baixa";
}

/** Informática Moderna é sempre avaliada em separado, como complemento. */
export function computeComplementary(profile: StudentProfile): ComplementaryResult {
  const affinity = computeCourseAffinity("informatica-moderna", profile);
  return { courseId: "informatica-moderna", score: affinity.score, tier: tierFor(affinity.score) };
}
