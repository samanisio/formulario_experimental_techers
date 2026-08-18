import type { Answers } from "../types";

/**
 * Perfis fictícios usados para validar o motor de recomendação
 * (ver README > "Como funciona o algoritmo" e scripts/balance-check.ts).
 * Cada perfil escolhe, para cada pergunta, a alternativa que mais reforça
 * as dimensões associadas ao curso esperado. As letras seguem a MESMA
 * direção em todas as 10 perguntas: a=Programação, b=Robótica,
 * c=Animação Digital, d=Design Gráfico, e=Informática Moderna.
 * (Isso descreve apenas a identidade interna de cada alternativa — a
 * ordem em que elas aparecem na tela é embaralhada, ver
 * src/engine/shuffle.ts.)
 */
export interface SampleProfile {
  label: string;
  age: number;
  answers: Answers;
  expectedPrimary?: string;
  note: string;
}

export const sampleProfiles: SampleProfile[] = [
  {
    label: "Perfil 1 — 6 anos, construção e criatividade",
    age: 6,
    answers: { q1: "b", q2: "b", q3: "b", q4: "b", q5: "b", q6: "b", q7: "b", q8: "b", q9: "b", q10: "b" },
    expectedPrimary: "maker",
    note: "Único curso elegível aos 6 anos é o Maker.",
  },
  {
    label: "Perfil 2 — 9 anos, jogos, programação e lógica",
    age: 9,
    answers: { q1: "a", q2: "a", q3: "a", q4: "a", q5: "a", q6: "a", q7: "a", q8: "a", q9: "a", q10: "a" },
    expectedPrimary: "programacao",
    note: "Perfil fortemente orientado a jogos, lógica e código.",
  },
  {
    label: "Perfil 3 — 10 anos, robôs, construção e eletrônica",
    age: 10,
    answers: { q1: "b", q2: "b", q3: "b", q4: "b", q5: "b", q6: "b", q7: "b", q8: "b", q9: "b", q10: "b" },
    expectedPrimary: "robotica",
    note: "Perfil fortemente orientado a construção, robôs e eletrônica.",
  },
  {
    label: "Perfil 4 — 13 anos, movimento, expressão e personagens",
    age: 13,
    answers: { q1: "c", q2: "c", q3: "c", q4: "c", q5: "c", q6: "c", q7: "c", q8: "c", q9: "c", q10: "c" },
    expectedPrimary: "animacao-digital",
    note: "Perfil fortemente orientado a animação, expressão de personagens e movimento.",
  },
  {
    label: "Perfil 5 — 15 anos, curadoria visual, edição de mídia e comunicação (sem desenho)",
    age: 15,
    answers: { q1: "d", q2: "d", q3: "d", q4: "d", q5: "d", q6: "d", q7: "d", q8: "d", q9: "d", q10: "d" },
    expectedPrimary: "design-grafico",
    note: "Perfil orientado a Design Gráfico via edição de fotos/colagem, curadoria visual e comunicação — nenhuma alternativa escolhida envolve desenhar.",
  },
  {
    label: "Perfil 6 — 16 anos, código, lógica e Inteligência Artificial",
    age: 16,
    answers: { q1: "a", q2: "a", q3: "a", q4: "a", q5: "a", q6: "a", q7: "a", q8: "a", q9: "a", q10: "a" },
    expectedPrimary: "programacao",
    note: "Perfil fortemente orientado a código, lógica e Inteligência Artificial.",
  },
  {
    label: "Perfil 7 — 12 anos, interesse em produtividade e ferramentas digitais",
    age: 12,
    answers: { q1: "e", q2: "e", q3: "e", q4: "e", q5: "e", q6: "e", q7: "e", q8: "e", q9: "e", q10: "e" },
    note: "Espera-se indicação relevante (moderada ou alta) de Informática Moderna como complemento.",
  },
  {
    label: "Perfil 8 — híbrido Programação + Robótica",
    age: 14,
    answers: { q1: "a", q2: "b", q3: "b", q4: "b", q5: "a", q6: "a", q7: "b", q8: "a", q9: "a", q10: "b" },
    note: "Espera-se Programação e Robótica com alta afinidade, próximas entre si.",
  },
];
