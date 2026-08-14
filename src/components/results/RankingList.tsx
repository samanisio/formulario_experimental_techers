import { courses } from "../../config/courses";
import type { CourseId, CourseStatus } from "../../types";

const statusLabel: Record<CourseStatus["status"], string> = {
  disponivel: "Disponível agora",
  "proxima-etapa": "Próxima etapa",
  "fora-da-faixa": "Fora da faixa etária",
};

const statusTone: Record<CourseStatus["status"], string> = {
  disponivel: "text-mint",
  "proxima-etapa": "text-amber",
  "fora-da-faixa": "text-slate",
};

const medals = ["🥇", "🥈", "🥉"];

interface RankingListProps {
  statuses: CourseStatus[];
  /** Curso já em destaque no card principal — não é repetido aqui embaixo. */
  excludeCourseId?: CourseId | null;
}

export function RankingList({ statuses, excludeCourseId }: RankingListProps) {
  const fullSorted = [...statuses].sort((a, b) => b.affinity - a.affinity);
  const rankById = new Map(fullSorted.map((s, i) => [s.courseId, i]));
  const sorted = fullSorted.filter((s) => s.courseId !== excludeCourseId);
  if (sorted.length === 0) return null;
  const heading = excludeCourseId ? "📋 Demais cursos recomendados" : "📊 Ordem de afinidade";

  return (
    <div>
      <h3 className="font-display text-lg font-semibold text-ink mb-3">{heading}</h3>
      <div className="space-y-2.5">
        {sorted.map((s) => {
          const course = courses[s.courseId];
          const overallIndex = rankById.get(s.courseId)!;
          const rankMark = medals[overallIndex] ?? `${overallIndex + 1}º`;
          return (
            <div
              key={s.courseId}
              className="flex items-center gap-4 rounded-2xl bg-paper px-4 py-3.5 shadow-[0_1px_2px_rgba(20,17,28,0.04)]"
              style={{ borderLeft: `4px solid ${course.accent}`, borderTop: "1px solid var(--color-line)", borderRight: "1px solid var(--color-line)", borderBottom: "1px solid var(--color-line)" }}
            >
              <span className="font-mono text-base w-8 text-center shrink-0 text-ink/70">{rankMark}</span>
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ background: `${course.accent}1f` }}
              >
                {course.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-medium text-ink text-sm truncate">{course.name}</span>
                  <span className={`font-mono text-[11px] uppercase tracking-wide shrink-0 ${statusTone[s.status]}`}>
                    {statusLabel[s.status]}
                  </span>
                </div>
                <p className="text-xs text-slate leading-relaxed mt-1 line-clamp-3">{course.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
