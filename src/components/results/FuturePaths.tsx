import { courses } from "../../config/courses";
import type { CourseAffinity } from "../../types";

interface FuturePathsProps {
  courses: CourseAffinity[];
  studentAge: number;
}

export function FuturePaths({ courses: futureCourses, studentAge }: FuturePathsProps) {
  if (futureCourses.length === 0) return null;
  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <span className="font-mono text-xs uppercase tracking-widest text-slate">🚀 Próxima etapa</span>
      <div className="mt-3 space-y-3">
        {futureCourses.map((c) => {
          const course = courses[c.courseId];
          return (
            <div key={c.courseId} className="flex items-start gap-3">
              <span className="text-xl shrink-0">{course.icon}</span>
              <p className="text-sm text-ink/80 leading-relaxed">
                Seu perfil também demonstra afinidade com <strong className="text-ink">{course.name}</strong> ({c.score}%).
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
