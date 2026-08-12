import { courses } from "../../config/courses";
import type { ComplementaryResult } from "../../types";

const tierCopy: Record<ComplementaryResult["tier"], { label: string; text: string }> = {
  alta: {
    label: "Alta indicação",
    text: "Informática Moderna pode ser um excelente complemento para o aluno.",
  },
  moderada: {
    label: "Indicação moderada",
    text: "Informática Moderna pode complementar bem o desenvolvimento do aluno.",
  },
  baixa: {
    label: "Baixa indicação",
    text: "Informática Moderna não aparece como prioridade neste momento, mas pode ser revisitada futuramente.",
  },
};

export function ComplementaryCard({ result }: { result: ComplementaryResult }) {
  if (result.tier === "baixa") return null;
  const course = courses[result.courseId];
  const copy = tierCopy[result.tier];

  return (
    <div
      className="rounded-2xl bg-paper-dim p-5"
      style={{ borderLeft: `4px solid ${course.accent}` }}
    >
      <span className="font-mono text-xs uppercase tracking-widest text-slate">💻 Curso complementar</span>
      <div className="flex items-center gap-3 mt-2">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{ background: `${course.accent}1f` }}
        >
          {course.icon}
        </div>
        <div>
          <h4 className="font-display font-semibold text-ink">{course.name}</h4>
          <span className="text-xs font-medium" style={{ color: course.accent }}>
            {copy.label}
          </span>
        </div>
      </div>
      <p className="text-sm text-ink/80 mt-3 leading-relaxed">{copy.text}</p>
    </div>
  );
}
