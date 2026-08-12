import { buildProfile } from "./profileEngine";
import { computeAffinities, computeComplementary } from "./scoringEngine";
import { buildStatusByCourse, findFuturePaths, findHybridCourses, pickPrimaryCourse } from "./rankingEngine";
import { coursesToCalculate, eligibleMainCourses, shouldCalculateInformatica } from "../config/ageRules";
import type { Answers, RecommendationResult } from "../types";

/**
 * Ponto único de entrada do motor de recomendação.
 * Resposta -> perfil -> pontuação por curso -> normalização -> afinidade %
 * -> verificação de idade -> ranking (ver README, seção "Como funciona o algoritmo").
 */
export function recommend(answers: Answers, age: number): RecommendationResult {
  const profile = buildProfile(answers);

  const calcIds = coursesToCalculate(age);
  const pureRanking = computeAffinities(profile, calcIds);

  const eligibleIds = new Set(eligibleMainCourses(age));
  const eligibleRanking = pureRanking.filter((c) => eligibleIds.has(c.courseId)).sort((a, b) => b.score - a.score);

  const primaryCourse = pickPrimaryCourse(eligibleRanking);
  const hybridCourses = findHybridCourses(eligibleRanking);
  const futurePaths = findFuturePaths(pureRanking, eligibleIds);
  const statusByCourse = buildStatusByCourse(pureRanking, eligibleIds);

  const complementary = shouldCalculateInformatica(age)
    ? computeComplementary(profile)
    : { courseId: "informatica-moderna" as const, score: 0, tier: "baixa" as const };

  return {
    profile,
    pureRanking,
    eligibleRanking,
    primaryCourse,
    hybridCourses,
    futurePaths,
    complementary,
    statusByCourse,
  };
}
