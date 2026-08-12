import { courses } from "../../config/courses";
import type { CourseAffinity } from "../../types";

interface FuturePathsProps {
  courses: CourseAffinity[];
  studentAge: number;
}

export function FuturePaths({ courses: futureCourses, studentAge }: FuturePathsProps) {
  if (futureCourses.length === 0) return null;
  return (
    <div className="rounded-2xl bg-paper p-5 shadow-[0_1px_2px_rgba(20,17,28,0.04)]" style={{ border: "1px solid var(--color-line)" }}>
      <span className="font-mono text-xs uppercase tracking-widest text-slate">🚀 Próxima etapa</span>
      <div className="mt-3 space-y-3">
        {futureCourses.map((c) => {
          const course = courses[c.courseId];
          return (
            <div key={c.courseId} className="flex items-start gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0"
                style={{ background: `${course.accent}1f` }}
              >
                {course.icon}
              </div>
              <p className="text-sm text-ink/80 leading-relaxed">
                Seu perfil também demonstra afinidade com <strong className="text-ink">{course.name}</strong>.
                Esse curso ainda não está disponível para a idade de {studentAge} anos — ele estará disponível a partir dos{" "}
                {course.ageRange.min} anos e pode ser uma excelente opção para uma próxima etapa.
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
