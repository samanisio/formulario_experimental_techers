// Conta, para cada dimensão de perfil, em quantas (pergunta, alternativa)
// ela aparece e com que peso médio — revela se alguma dimensão está
// "sub-representada" no formulário (poucas alternativas a alimentam) em
// comparação com dimensões "genéricas" que quase toda alternativa toca.
import { questions } from "../src/config/questions";
import type { ProfileDimension } from "../src/types";

const coverage: Partial<Record<ProfileDimension, { count: number; sum: number }>> = {};

for (const q of questions) {
  for (const opt of q.options) {
    for (const [dim, weight] of Object.entries(opt.weights)) {
      const d = dim as ProfileDimension;
      if (!coverage[d]) coverage[d] = { count: 0, sum: 0 };
      coverage[d]!.count += 1;
      coverage[d]!.sum += weight ?? 0;
    }
  }
}

const rows = Object.entries(coverage)
  .map(([dim, { count, sum }]) => ({ dim, count, avg: sum / count, sum }))
  .sort((a, b) => b.count - a.count);

console.log("dimensão".padEnd(26), "nº alternativas".padEnd(18), "peso médio", "soma total");
for (const r of rows) {
  console.log(r.dim.padEnd(26), String(r.count).padEnd(18), r.avg.toFixed(1).padEnd(12), r.sum);
}
