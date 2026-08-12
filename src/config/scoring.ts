import type { CourseId, ProfileDimension } from "../types";

/**
 * Matriz de pesos por curso (dimensão do perfil -> peso 0 a 5).
 * Ponto de partida definido na especificação do projeto, revisado após as
 * simulações de src/tests/sampleProfiles.ts (ver seção "Ajustes de pesos" no README).
 *
 * Decisões de consolidação em relação à especificação original:
 * - Dimensões redundantes do documento original (ex.: "organizacao",
 *   "apresentacoes", "estudos" e "comunicacao_digital") foram unificadas em
 *   `digitalProductivity` / `digitalTools` para evitar dupla contagem do
 *   mesmo traço em um mesmo curso.
 * - "personagens" e "comunicacao_visual" foram absorvidas por
 *   `storytelling`/`drawing` e `design`/`aestheticSense`, respectivamente.
 * - Quando duas linhas da tabela original mapeavam para a mesma dimensão,
 *   foi mantido o maior peso entre elas (nunca somado), preservando a escala 0-5.
 */
export const courseWeights: Record<CourseId, Partial<Record<ProfileDimension, number>>> = {
  programacao: {
    logicalReasoning: 5,
    programming: 5,
    technology: 5,
    games: 5,
    problemSolving: 5,
    artificialIntelligence: 4,
    projects: 4,
    creativity: 4,
    challenges: 4,
    practicalActivities: 3,
    teamwork: 3,
    digitalAutonomy: 2,
    design: 2,
    drawing: 1,
    construction: 3,
    robotics: 3,
    electronics: 2,
    animation: 2,
  },
  robotica: {
    robotics: 5,
    construction: 5,
    electronics: 5,
    technology: 5,
    practicalActivities: 5,
    logicalReasoning: 5,
    problemSolving: 5,
    projects: 5,
    challenges: 5,
    programming: 4,
    teamwork: 4,
    creativity: 4,
    games: 2,
    drawing: 1,
    animation: 1,
    design: 1,
  },
  maker: {
    construction: 5,
    creativity: 5,
    practicalActivities: 5,
    fineMotorSkills: 5,
    imagination: 5,
    robotics: 4,
    technology: 4,
    logicalReasoning: 4,
    problemSolving: 4,
    teamwork: 4,
    digitalAutonomy: 4,
    programming: 3,
    electronics: 2,
  },
  "animacao-digital": {
    drawing: 5,
    animation: 5,
    art: 5,
    storytelling: 5,
    creativity: 5,
    visualCreativity: 5,
    imagination: 5,
    design: 4,
    projects: 4,
    attentionToDetail: 4,
    technology: 3,
    games: 3,
    programming: 1,
    logicalReasoning: 2,
  },
  "design-grafico": {
    design: 5,
    visualCreativity: 5,
    aestheticSense: 5,
    creativity: 5,
    digitalTools: 5,
    art: 4,
    technology: 4,
    artificialIntelligence: 4,
    projects: 4,
    digitalProductivity: 4,
    drawing: 3,
    storytelling: 3,
    programming: 1,
    logicalReasoning: 2,
  },
  "informatica-moderna": {
    digitalAutonomy: 5,
    digitalProductivity: 5,
    digitalTools: 5,
    creativity: 3,
    artificialIntelligence: 4,
    technology: 4,
    programming: 1,
    robotics: 1,
    drawing: 2,
    design: 3,
  },
};

export const IM_TIER_THRESHOLDS = { alta: 80, moderada: 60 };
