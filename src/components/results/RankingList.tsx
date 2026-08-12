import { courses } from "../../config/courses";
import type { CourseStatus } from "../../types";

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

export function RankingList({ statuses }: { statuses: CourseStatus[] }) {
  const sorted = [...statuses].sort((a, b) => b.affinity - a.affinity);
  return (
    <div>
      <h3 className="font-display text-lg font-semibold text-ink mb-3">📊 Ordem de afinidade</h3>
      <div className="space-y-2.5">
        {sorted.map((s, i) => {
          const course = courses[s.courseId];
          const rankMark = medals[i] ?? `${i + 1}º`;
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
                <span className="font-medium text-ink text-sm block truncate">{course.name}</span>
                <span className={`font-mono text-[11px] uppercase tracking-wide ${statusTone[s.status]}`}>
                  {statusLabel[s.status]}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
