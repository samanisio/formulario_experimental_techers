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
    <div className="rounded-2xl border border-line bg-paper-dim p-5">
      <span className="font-mono text-xs uppercase tracking-widest text-slate">💻 Curso complementar</span>
      <div className="flex items-center gap-3 mt-2">
        <span className="text-2xl">{course.icon}</span>
        <div>
          <h4 className="font-display font-semibold text-ink">{course.name}</h4>
          <span className="text-xs font-medium" style={{ color: course.accent }}>
            {copy.label} · {result.score}%
          </span>
        </div>
      </div>
      <p className="text-sm text-ink/80 mt-3 leading-relaxed">{copy.text}</p>
    </div>
  );
}
