// Tipos centrais do motor de recomendação da TECHERS.
// Mantidos separados da interface para facilitar manutenção (ver README).

/** Dimensões internas de perfil. Nunca são mostradas diretamente ao usuário. */
export type ProfileDimension =
  | "logicalReasoning"
  | "programming"
  | "technology"
  | "robotics"
  | "construction"
  | "electronics"
  | "creativity"
  | "visualCreativity"
  | "drawing"
  | "art"
  | "animation"
  | "storytelling"
  | "design"
  | "aestheticSense"
  | "digitalAutonomy"
  | "digitalProductivity"
  | "digitalTools"
  | "artificialIntelligence"
  | "games"
  | "projects"
  | "problemSolving"
  | "teamwork"
  | "practicalActivities"
  | "challenges"
  | "attentionToDetail"
  | "imagination"
  | "fineMotorSkills";

export type StudentProfile = Record<ProfileDimension, number>;

export type CourseId =
  | "programacao"
  | "robotica"
  | "maker"
  | "informatica-moderna"
  | "animacao-digital"
  | "design-grafico";

export interface AgeRange {
  min: number;
  max: number | null; // null = sem limite superior dentro da faixa 5-17
}

export type CourseCategory = "principal" | "complementar";

export interface Course {
  id: CourseId;
  name: string;
  shortLabel: string;
  icon: string;
  tagline: string;
  description: string;
  whatYouBuild: string[];
  whatYouLearn: string[];
  skills: string[];
  ageRange: AgeRange;
  schedule: string;
  duration: string;
  category: CourseCategory;
  /** Cor de destaque exclusiva do curso, usada com moderação. */
  accent: string;
}

export interface AnswerOption {
  id: string;
  label: string;
  weights: Partial<StudentProfile>;
}

export interface ProfileQuestion {
  id: string;
  step: number; // etapa do formulário (1-5), perguntas de perfil ficam em 2-5
  title: string;
  helper?: string;
  options: AnswerOption[];
}

export interface IntakeData {
  studentName: string;
  age: number | null;
  guardianName: string;
  guardianPhone: string;
}

export type Answers = Record<string, string>; // questionId -> optionId

export interface CourseAffinity {
  courseId: CourseId;
  score: number; // 0-100
  rawScore: number;
  maxScore: number;
}

export type IndicationTier = "alta" | "moderada" | "baixa";

export interface ComplementaryResult {
  courseId: CourseId;
  score: number;
  tier: IndicationTier;
}

export interface CourseStatus {
  courseId: CourseId;
  affinity: number;
  status: "disponivel" | "proxima-etapa" | "fora-da-faixa";
}

export interface RecommendationResult {
  profile: StudentProfile;
  pureRanking: CourseAffinity[]; // todos os cursos, ignorando idade
  eligibleRanking: CourseAffinity[]; // apenas cursos disponíveis para a idade atual
  primaryCourse: CourseAffinity | null;
  hybridCourses: CourseAffinity[]; // cursos empatados em alta afinidade com o principal
  futurePaths: CourseAffinity[]; // cursos com alta afinidade, fora da faixa etária
  complementary: ComplementaryResult;
  statusByCourse: CourseStatus[];
}
