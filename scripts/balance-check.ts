// Script de diagnóstico (não faz parte do app nem dos testes) — mede, por
// simulação Monte Carlo, a frequência com que cada curso vence como
// "principal" e como "complementar", pra detectar viés estrutural nos pesos
// ou nas perguntas antes de fazer ajustes.
import { questions } from "../src/config/questions";
import { recommend } from "../src/engine/recommendationEngine";
import type { Answers } from "../src/types";

const N = 30000;
const AGE = 14; // todos os 4 cursos principais elegíveis, sem Maker

function randomAnswers(): Answers {
  const answers: Answers = {};
  for (const q of questions) {
    const opt = q.options[Math.floor(Math.random() * q.options.length)];
    answers[q.id] = opt.id;
  }
  return answers;
}

const primaryCounts: Record<string, number> = {};
const complementaryCounts: Record<string, number> = { alta: 0, moderada: 0, baixa: 0 };
const scoreSums: Record<string, number> = {};
const scoreCounts: Record<string, number> = {};

for (let i = 0; i < N; i++) {
  const answers = randomAnswers();
  const result = recommend(answers, AGE);
  const primary = result.primaryCourse?.courseId ?? "nenhum";
  primaryCounts[primary] = (primaryCounts[primary] ?? 0) + 1;
  complementaryCounts[result.complementary.tier] += 1;
  for (const c of result.pureRanking) {
    scoreSums[c.courseId] = (scoreSums[c.courseId] ?? 0) + c.score;
    scoreCounts[c.courseId] = (scoreCounts[c.courseId] ?? 0) + 1;
  }
}

console.log(`\n=== Frequência de curso PRINCIPAL (${N} perfis aleatórios, idade ${AGE}) ===`);
for (const [course, count] of Object.entries(primaryCounts).sort((a, b) => b[1] - a[1])) {
  console.log(`${course.padEnd(20)} ${((count / N) * 100).toFixed(1)}%  (${count})`);
}

console.log(`\n=== Pontuação média de cada curso (0-100, mesma amostra) ===`);
for (const [course, sum] of Object.entries(scoreSums).sort((a, b) => b[1] / scoreCounts[b[0]] - a[1] / scoreCounts[a[0]])) {
  console.log(`${course.padEnd(20)} média=${(sum / scoreCounts[course]).toFixed(1)}`);
}

console.log(`\n=== Informática Moderna (tier) ===`);
for (const [tier, count] of Object.entries(complementaryCounts)) {
  console.log(`${tier.padEnd(10)} ${((count / N) * 100).toFixed(1)}%`);
}

// Diagnóstico extra: para cada curso, mostra o máximo teórico alcançável
// (fixo, calculado uma vez) e a média do score BRUTO (antes de normalizar)
// nesta amostra aleatória — ajuda a ver se o desequilíbrio vem do máximo
// (denominador) ou da média bruta (numerador).
import { courseWeights } from "../src/config/scoring";
import { questions as qs } from "../src/config/questions";

function dot(weights: Record<string, number | undefined>, values: Record<string, number>): number {
  let total = 0;
  for (const [dim, w] of Object.entries(weights)) total += (w ?? 0) * (values[dim] ?? 0);
  return total;
}

console.log("\n=== Máximo alcançável (fixo) por curso ===");
for (const courseId of Object.keys(courseWeights)) {
  const weights = courseWeights[courseId as keyof typeof courseWeights];
  let max = 0;
  for (const q of qs) {
    let best = 0;
    for (const opt of q.options) best = Math.max(best, dot(weights, opt.weights as Record<string, number>));
    max += best;
  }
  console.log(courseId.padEnd(20), "max =", max.toFixed(1));
}

// Perfil "perfeito" por curso: sempre escolhe, em cada pergunta, a opção
// que mais favorece aquele curso especificamente — mostra o teto real de
// pontuação alcançável na prática (deve ficar perto de 100%).
console.log("\n=== Perfil 'perfeito' por curso (sempre escolhe a opção mais alinhada) ===");
for (const courseId of Object.keys(courseWeights)) {
  const weights = courseWeights[courseId as keyof typeof courseWeights];
  const answers: Answers = {};
  for (const q of qs) {
    let bestOpt = q.options[0];
    let bestScore = -1;
    for (const opt of q.options) {
      const score = dot(weights, opt.weights as Record<string, number>);
      if (score > bestScore) {
        bestScore = score;
        bestOpt = opt;
      }
    }
    answers[q.id] = bestOpt.id;
  }
  const result = recommend(answers, 14);
  const own = result.pureRanking.find((c) => c.courseId === courseId);
  console.log(courseId.padEnd(20), "score =", own?.score, "| primary =", result.primaryCourse?.courseId, "| IM tier =", result.complementary.tier, result.complementary.score);
}
