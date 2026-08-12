import { courseWeights, IM_TIER_THRESHOLDS } from "../config/scoring";
import { questions } from "../config/questions";
import type { ComplementaryResult, CourseAffinity, CourseId, IndicationTier, ProfileDimension, StudentProfile } from "../types";

const ALL_COURSE_IDS = Object.keys(courseWeights) as CourseId[];

function dot(weights: Partial<Record<ProfileDimension, number>>, values: Partial<Record<ProfileDimension, number>>): number {
  let total = 0;
  for (const [dim, w] of Object.entries(weights)) {
    total += (w ?? 0) * (values[dim as ProfileDimension] ?? 0);
  }
  return total;
}

/**
 * Distintividade de cada dimensão (peso IDF, "inverse-course-frequency"):
 * dimensões que aparecem em quase todos os cursos (ex.: "criatividade",
 * "tecnologia", "raciocínio lógico") diferenciam pouco um curso do outro,
 * enquanto dimensões raras (ex.: "eletrônica", quase exclusiva de Robótica)
 * são muito mais informativas para decidir ENTRE cursos parecidos.
 *
 * factor(dim) = 1 + 0.5 · log2(nº de cursos / nº de cursos que usam a dimensão)
 * — uma dimensão usada por todos os 6 cursos fica com fator 1 (neutro); uma
 * dimensão usada por 1 único curso chega a ~2.3x. Isso ataca diretamente o
 * problema de cursos parecidos ficarem com pontuações quase idênticas
 * (ver README > "Como funciona o algoritmo" e a seção de diferenciação de
 * Programação × Robótica / Animação × Design no README original do projeto).
 */
function computeDimensionDistinctiveness(): Partial<Record<ProfileDimension, number>> {
  const dims = new Set<ProfileDimension>();
  for (const weights of Object.values(courseWeights)) {
    for (const dim of Object.keys(weights)) dims.add(dim as ProfileDimension);
  }
  const factor: Partial<Record<ProfileDimension, number>> = {};
  const totalCourses = ALL_COURSE_IDS.length;
  for (const dim of dims) {
    const coursesUsingDim = ALL_COURSE_IDS.filter((id) => (courseWeights[id][dim] ?? 0) > 0).length;
    factor[dim] = 1 + 0.5 * Math.log2(totalCourses / Math.max(1, coursesUsingDim));
  }
  return factor;
}

const dimensionDistinctiveness = computeDimensionDistinctiveness();

/** Pesos "efetivos" de um curso: o peso editável em scoring.ts, multiplicado
 * pela distintividade de cada dimensão. Usado tanto para pontuar quanto para
 * calcular o máximo alcançável — os dois precisam usar a mesma escala. */
function effectiveWeights(courseId: CourseId): Partial<Record<ProfileDimension, number>> {
  const raw = courseWeights[courseId];
  const eff: Partial<Record<ProfileDimension, number>> = {};
  for (const [dim, w] of Object.entries(raw)) {
    const d = dim as ProfileDimension;
    eff[d] = (w ?? 0) * (dimensionDistinctiveness[d] ?? 1);
  }
  return eff;
}

const effectiveWeightsCache = new Map<CourseId, Partial<Record<ProfileDimension, number>>>();
function getEffectiveWeights(courseId: CourseId): Partial<Record<ProfileDimension, number>> {
  if (!effectiveWeightsCache.has(courseId)) {
    effectiveWeightsCache.set(courseId, effectiveWeights(courseId));
  }
  return effectiveWeightsCache.get(courseId)!;
}

/**
 * Máximo teórico e efetivamente alcançável para um curso: em cada pergunta,
 * a alternativa que mais favorece o curso é escolhida. Diferente de um
 * máximo por dimensão isolada (inatingível, pois só é possível escolher uma
 * alternativa por pergunta), este valor é sempre alcançável por algum
 * conjunto real de respostas — por isso é usado para normalizar a afinidade.
 */
function maxAchievableScore(courseId: CourseId): number {
  const weights = getEffectiveWeights(courseId);
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
  const weights = getEffectiveWeights(courseId);
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
