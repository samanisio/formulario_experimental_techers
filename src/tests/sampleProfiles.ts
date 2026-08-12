import type { Answers } from "../types";

/**
 * Perfis fictícios usados para validar o motor de recomendação
 * (ver README > "Como funciona o algoritmo" e seção de testes).
 * Cada perfil escolhe, para cada pergunta, a alternativa que mais reforça
 * as dimensões associadas ao curso esperado.
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
    answers: { q1: "b", q2: "e", q3: "b", q4: "a", q5: "a", q6: "b", q7: "d", q8: "d", q9: "d", q10: "d", q11: "a", q12: "b" },
    expectedPrimary: "maker",
    note: "Único curso elegível aos 6 anos é o Maker.",
  },
  {
    label: "Perfil 2 — 9 anos, jogos, programação e lógica",
    age: 9,
    answers: { q1: "a", q2: "a", q3: "a", q4: "c", q5: "d", q6: "d", q7: "c", q8: "b", q9: "a", q10: "a", q11: "c", q12: "a" },
    expectedPrimary: "programacao",
    note: "Perfil fortemente orientado a jogos, lógica e código.",
  },
  {
    label: "Perfil 3 — 10 anos, robôs, construção e eletrônica",
    age: 10,
    answers: { q1: "b", q2: "e", q3: "b", q4: "b", q5: "a", q6: "d", q7: "d", q8: "d", q9: "d", q10: "d", q11: "a", q12: "b" },
    expectedPrimary: "robotica",
    note: "Perfil fortemente orientado a construção, robôs e eletrônica.",
  },
  {
    label: "Perfil 4 — 13 anos, desenho, histórias e personagens",
    age: 13,
    answers: { q1: "c", q2: "c", q3: "c", q4: "d", q5: "a", q6: "a", q7: "a", q8: "a", q9: "d", q10: "d", q11: "b", q12: "c" },
    expectedPrimary: "animacao-digital",
    note: "Perfil fortemente orientado a desenho, narrativa e personagens.",
  },
  {
    label: "Perfil 5 — 15 anos, design, estética e redes sociais",
    age: 15,
    answers: { q1: "d", q2: "c", q3: "d", q4: "d", q5: "b", q6: "d", q7: "b", q8: "c", q9: "d", q10: "b", q11: "b", q12: "d" },
    expectedPrimary: "design-grafico",
    note: "Perfil fortemente orientado a estética, artes visuais e comunicação.",
  },
  {
    label: "Perfil 6 — 16 anos, código, lógica e IA",
    age: 16,
    answers: { q1: "a", q2: "d", q3: "a", q4: "c", q5: "d", q6: "d", q7: "c", q8: "b", q9: "a", q10: "a", q11: "c", q12: "a" },
    expectedPrimary: "programacao",
    note: "Perfil fortemente orientado a código, lógica e Inteligência Artificial.",
  },
  {
    label: "Perfil 7 — 12 anos, baixa autonomia digital e interesse em produtividade",
    age: 12,
    answers: { q1: "e", q2: "c", q3: "e", q4: "d", q5: "d", q6: "d", q7: "a", q8: "a", q9: "d", q10: "c", q11: "d", q12: "e" },
    note: "Espera-se indicação relevante (moderada ou alta) de Informática Moderna como complemento.",
  },
  {
    label: "Perfil 8 — híbrido Programação + Robótica",
    age: 14,
    answers: { q1: "a", q2: "d", q3: "a", q4: "b", q5: "d", q6: "d", q7: "a", q8: "d", q9: "a", q10: "d", q11: "a", q12: "b" },
    note: "Espera-se Programação e Robótica com alta afinidade, próximas entre si.",
  },
];
