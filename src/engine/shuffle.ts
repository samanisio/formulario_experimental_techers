import type { ProfileQuestion } from "../types";

/**
 * Embaralha a ORDEM DE EXIBIÇÃO das alternativas de cada pergunta — não a
 * lógica de pontuação. Cada alternativa mantém seu `id` (e portanto seu
 * significado interno: qual dimensão de perfil ela reforça) intacto; só a
 * posição na tela muda. Isso evita que alguém respondendo no automático
 * (sempre a primeira opção) sempre caia no mesmo curso, já que a mesma
 * direção não fica sempre na mesma letra/posição.
 *
 * O motor de recomendação (profileEngine.ts) nunca vê essa ordem — ele lê
 * sempre a lista original de `src/config/questions.ts` e busca a opção
 * escolhida pelo `id`, então o embaralhamento não afeta a pontuação.
 */
function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function shuffleQuestionOptions(questions: ProfileQuestion[]): ProfileQuestion[] {
  return questions.map((q) => ({ ...q, options: shuffleArray(q.options) }));
}
