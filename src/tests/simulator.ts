import { recommend } from "../engine/recommendationEngine";
import type { Answers, RecommendationResult } from "../types";

/**
 * Simulador manual: permite testar qualquer combinação de respostas e idade
 * fora da interface, útil para ajustar pesos (README > "Como alterar pesos").
 */
export function runRecommendationTest(answers: Answers, age: number): RecommendationResult {
  return recommend(answers, age);
}
