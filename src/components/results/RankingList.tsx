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

export function RankingList({ statuses }: { statuses: CourseStatus[] }) {
  const sorted = [...statuses].sort((a, b) => b.affinity - a.affinity);
  return (
    <div>
      <h3 className="font-display text-lg font-semibold text-ink mb-3">📊 Ranking de afinidade</h3>
      <div className="space-y-2">
        {sorted.map((s, i) => {
          const course = courses[s.courseId];
          return (
            <div key={s.courseId} className="flex items-center gap-4 rounded-2xl border border-line bg-paper px-4 py-3.5">
              <span className="font-mono text-xs text-slate w-5 shrink-0">{i + 1}º</span>
              <span className="text-xl shrink-0">{course.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-medium text-ink text-sm truncate">{course.name}</span>
                  <span className="font-mono text-sm text-ink shrink-0">{s.affinity}%</span>
                </div>
                <div className="flex items-center justify-between gap-2 mt-1">
                  <div className="h-1.5 flex-1 rounded-full bg-paper-dim overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${s.affinity}%`, background: course.accent }}
                    />
                  </div>
                  <span className={`font-mono text-[11px] uppercase tracking-wide shrink-0 ${statusTone[s.status]}`}>
                    {statusLabel[s.status]}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
