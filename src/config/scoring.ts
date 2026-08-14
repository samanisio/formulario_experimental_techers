import type { CourseId, ProfileDimension } from "../types";

/**
 * Matriz de pesos por curso (dimensão do perfil -> peso 0 a 5).
 *
 * Princípio de design: cada curso só recebe peso nas dimensões que
 * realmente são dele (assinatura, peso 4-5) mais um punhado de traços
 * genuinamente compartilhados como apoio (peso 1-2) — problemSolving,
 * creativity, projects, technology, challenges. Cada curso NÃO recebe peso
 * nenhum nas dimensões "assinatura" dos outros cursos (ex.: Programação não
 * tem `robotics`/`construction`/`design`; Robótica não tem `programming`/
 * `drawing`).
 *
 * Essa separação estrita foi a correção de um desequilíbrio real, medido por
 * simulação (scripts/balance-check.ts): com pesos residuais (mesmo que só 1)
 * espalhados nas dimensões de TODOS os outros cursos, cada curso acumulava
 * "crédito de sobra" toda vez que uma alternativa de OUTRA direção era
 * escolhida — e como isso se soma ao longo de 10 perguntas, o curso com a
 * tabela mais "larga" (mais dimensões tocadas) vencia desproporcionalmente
 * mesmo em perfis de resposta aleatórios (Programação chegava a 42% dos
 * "principal" em 30 mil perfis aleatórios, deveria ficar perto de 25%).
 * Depois da separação estrita, a simulação ficou em ~28/25/24/23% entre
 * Programação/Animação/Robótica/Design — bem mais equilibrado.
 *
 * O equilíbrio é verificado por simulação (scripts/balance-check.ts, não faz
 * parte do app) — perfis de resposta aleatórios devem produzir uma
 * distribuição parecida de curso "principal" entre Programação, Robótica,
 * Animação Digital e Design Gráfico. Depois de qualquer alteração nesta
 * tabela ou em src/config/questions.ts, rode o script de novo:
 * `npx tsx scripts/balance-check.ts`. Use também
 * `npx tsx scripts/dimension-coverage.ts` para checar se alguma dimensão
 * ficou sub-representada no formulário.
 *
 * Decisões de consolidação em relação à especificação original:
 * - Dimensões redundantes do documento original (ex.: "organizacao",
 *   "apresentacoes", "estudos" e "comunicacao_digital") foram unificadas em
 *   `digitalProductivity` / `digitalTools` para evitar dupla contagem do
 *   mesmo traço em um mesmo curso.
 * - "personagens" e "comunicacao_visual" foram absorvidas por
 *   `storytelling`/`drawing` e `design`/`aestheticSense`, respectivamente.
 *
 * Design Gráfico NÃO depende de `drawing` (desenho à mão livre) — esse é um
 * mito comum que afasta alunos que não sabem/gostam de desenhar mas têm
 * exatamente o perfil ideal para o curso. O curso de verdade (ver
 * `courses.ts` > design-grafico > whatYouLearn/skills) é sobre composição,
 * tipografia, cor, edição de fotos e comunicação visual — por isso o peso
 * de `drawing` aqui é 0 (ausente), e o curso usa três dimensões próprias
 * (`visualCuration`, `mediaEditing`, `communication`, ver types.ts) que não
 * aparecem em nenhum outro curso, para representar isso com fidelidade.
 */
export const courseWeights: Record<CourseId, Partial<Record<ProfileDimension, number>>> = {
  programacao: {
    programming: 5,
    logicalReasoning: 4,
    technology: 3,
    games: 2,
    problemSolving: 2,
    artificialIntelligence: 2,
    projects: 1,
    challenges: 1,
    creativity: 1,
  },
  robotica: {
    robotics: 5,
    construction: 5,
    electronics: 5,
    practicalActivities: 3,
    problemSolving: 2,
    challenges: 2,
    technology: 1,
    projects: 1,
  },
  maker: {
    construction: 4,
    fineMotorSkills: 5,
    imagination: 4,
    practicalActivities: 4,
    creativity: 2,
    robotics: 2,
    problemSolving: 1,
  },
  "animacao-digital": {
    animation: 5,
    drawing: 5,
    storytelling: 5,
    art: 3,
    imagination: 2,
    visualCreativity: 2,
    attentionToDetail: 1,
  },
  "design-grafico": {
    design: 5,
    aestheticSense: 5,
    mediaEditing: 5,
    visualCuration: 4,
    communication: 3,
    visualCreativity: 2,
    digitalTools: 2,
    artificialIntelligence: 2,
    art: 1,
    creativity: 2,
  },
  "informatica-moderna": {
    digitalAutonomy: 5,
    digitalProductivity: 5,
    digitalTools: 5,
    artificialIntelligence: 2,
    attentionToDetail: 1,
  },
};

export const IM_TIER_THRESHOLDS = { alta: 80, moderada: 60 };
