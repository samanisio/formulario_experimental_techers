import { courses } from "../../config/courses";
import type { CourseAffinity } from "../../types";

interface ResultHeroProps {
  studentName: string;
  primary: CourseAffinity;
  hybridCourses: CourseAffinity[];
  synthesis: string;
}

export function ResultHero({ studentName, primary, hybridCourses, synthesis }: ResultHeroProps) {
  const course = courses[primary.courseId];
  const firstName = studentName.trim().split(/\s+/)[0] || "Você";
  const isHybrid = hybridCourses.length > 0;

  return (
    <div
      className="rounded-3xl bg-paper p-6 sm:p-8 relative overflow-hidden shadow-[0_1px_2px_rgba(20,17,28,0.04)]"
      style={{ border: `1.5px solid ${course.accent}33` }}
    >
      <div
        className="absolute -top-28 -right-28 w-80 h-80 rounded-full opacity-[0.14] blur-3xl pointer-events-none"
        style={{ background: course.accent }}
        aria-hidden="true"
      />

      <div className="relative">
        <p className="font-mono text-xs tracking-widest uppercase text-slate mb-3">🎯 Perfil TECHERS de {firstName}</p>
        <p className="text-ink/75 text-sm leading-relaxed mb-6 max-w-lg">{synthesis}</p>

        <span className="font-mono text-xs uppercase tracking-widest text-slate">
          {isHybrid ? "Cursos principais para você" : "Curso principal para você"}
        </span>

        <div className="flex items-center gap-4 mt-3">
          <div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shrink-0"
            style={{ background: `${course.accent}1f` }}
          >
            {course.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl leading-none">🥇</span>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink leading-tight">{course.name}</h1>
            </div>
            <p className="text-xs font-medium mt-1" style={{ color: course.accent }}>
              1º lugar no seu ranking de afinidade
            </p>
          </div>
        </div>

        {isHybrid && (
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="text-xs text-slate self-center mr-1">também com alta afinidade:</span>
            {hybridCourses.map((c) => {
              const cc = courses[c.courseId];
              return (
                <span
                  key={c.courseId}
                  className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium text-ink"
                  style={{ borderColor: `${cc.accent}55`, background: `${cc.accent}0f` }}
                >
                  {cc.icon} {cc.name}
                </span>
              );
            })}
          </div>
        )}

        <p className="text-ink/70 text-sm leading-relaxed mt-6 border-t border-line pt-5">{course.description}</p>
      </div>
    </div>
  );
}
