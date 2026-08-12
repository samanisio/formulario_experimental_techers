import type { ProfileDimension, StudentProfile } from "../types";

/**
 * Gera uma síntese curta e determinística do perfil, a partir das dimensões
 * de maior pontuação. Nunca usa IA generativa — apenas texto pré-escrito
 * combinado conforme os traços mais fortes do aluno (ver README).
 */
const traitPhrases: Partial<Record<ProfileDimension, string>> = {
  logicalReasoning: "resolver desafios de lógica",
  programming: "programar e criar tecnologia",
  technology: "tecnologia",
  robotics: "robótica",
  construction: "construir e montar coisas",
  electronics: "eletrônica",
  creativity: "criar coisas novas",
  visualCreativity: "criação visual",
  drawing: "desenhar",
  art: "arte",
  animation: "animação",
  storytelling: "inventar histórias",
  design: "design",
  aestheticSense: "estética e comunicação visual",
  digitalAutonomy: "usar a tecnologia com autonomia",
  digitalProductivity: "produtividade digital",
  digitalTools: "ferramentas digitais",
  artificialIntelligence: "Inteligência Artificial",
  games: "jogos",
  projects: "criação de projetos",
  problemSolving: "resolução de problemas",
  teamwork: "trabalho em equipe",
  practicalActivities: "atividades práticas",
  challenges: "desafios",
  attentionToDetail: "atenção aos detalhes",
  imagination: "imaginação",
  fineMotorSkills: "coordenação e montagem",
};

export function buildSynthesis(profile: StudentProfile): string {
  const ranked = (Object.entries(profile) as [ProfileDimension, number][])
    .filter(([, value]) => value > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([dim]) => traitPhrases[dim])
    .filter((label): label is string => Boolean(label));

  if (ranked.length === 0) {
    return "Pelas suas respostas, ainda estamos conhecendo melhor o seu perfil.";
  }

  const traits = joinWithE(ranked);
  return `Pelas suas respostas, você demonstra bastante interesse por ${traits}.`;
}

function joinWithE(items: string[]): string {
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(", ")} e ${items[items.length - 1]}`;
}
