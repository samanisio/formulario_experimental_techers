import { questions } from "../config/questions";
import type { Answers, ProfileDimension, StudentProfile } from "../types";

const emptyProfile = (): StudentProfile => {
  const dims: ProfileDimension[] = [
    "logicalReasoning", "programming", "technology", "robotics", "construction",
    "electronics", "creativity", "visualCreativity", "drawing", "art", "animation",
    "storytelling", "design", "aestheticSense", "digitalAutonomy", "digitalProductivity",
    "digitalTools", "artificialIntelligence", "games", "projects", "problemSolving",
    "teamwork", "practicalActivities", "challenges", "attentionToDetail", "imagination",
    "fineMotorSkills", "visualCuration", "mediaEditing", "communication",
  ];
  return Object.fromEntries(dims.map((d) => [d, 0])) as StudentProfile;
};

/** Converte as respostas do formulário em um perfil multidimensional. */
export function buildProfile(answers: Answers): StudentProfile {
  const profile = emptyProfile();
  for (const question of questions) {
    const selectedOptionId = answers[question.id];
    if (!selectedOptionId) continue;
    const option = question.options.find((o) => o.id === selectedOptionId);
    if (!option) continue;
    for (const [dim, weight] of Object.entries(option.weights)) {
      profile[dim as ProfileDimension] += weight ?? 0;
    }
  }
  return profile;
}

/** Maior valor teoricamente atingível por dimensão, considerando que apenas
 * uma alternativa pode ser escolhida por pergunta. Usado para normalizar a
 * pontuação dos cursos sem favorecer cursos com mais dimensões associadas. */
export function maxProfileByDimension(): StudentProfile {
  const max = emptyProfile();
  for (const question of questions) {
    const perDimMax: Partial<Record<ProfileDimension, number>> = {};
    for (const option of question.options) {
      for (const [dim, weight] of Object.entries(option.weights)) {
        const d = dim as ProfileDimension;
        perDimMax[d] = Math.max(perDimMax[d] ?? 0, weight ?? 0);
      }
    }
    for (const [dim, weight] of Object.entries(perDimMax)) {
      max[dim as ProfileDimension] += weight ?? 0;
    }
  }
  return max;
}
