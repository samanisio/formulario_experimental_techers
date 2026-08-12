import { courses } from "../../config/courses";
import { AffinityMeter } from "../ui/AffinityMeter";
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
    <div className="rounded-3xl border border-line bg-ink text-paper p-6 sm:p-8 relative overflow-hidden">
      <div
        className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-20 blur-3xl"
        style={{ background: course.accent }}
        aria-hidden="true"
      />
      <p className="font-mono text-xs tracking-widest uppercase text-paper/60 mb-4">🎯 Perfil TECHERS de {firstName}</p>

      <p className="text-paper/70 text-sm leading-relaxed mb-6 max-w-lg">{synthesis}</p>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-paper/50">
            {isHybrid ? "Melhores cursos para começar" : "Melhor curso para começar"}
          </span>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-4xl">{course.icon}</span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold">{course.name}</h1>
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-3xl font-semibold" style={{ color: course.accent }}>
            {primary.score}%
          </div>
          <div className="text-xs text-paper/50 -mt-1">de afinidade</div>
        </div>
      </div>

      <div className="mt-4">
        <AffinityMeter score={primary.score} accent={course.accent} />
      </div>

      {isHybrid && (
        <div className="mt-5 flex flex-wrap gap-2">
          {hybridCourses.map((c) => {
            const cc = courses[c.courseId];
            return (
              <span
                key={c.courseId}
                className="inline-flex items-center gap-1.5 rounded-full border border-paper/20 px-3 py-1 text-xs font-medium"
              >
                {cc.icon} {cc.name} · {c.score}%
              </span>
            );
          })}
        </div>
      )}

      <p className="text-paper/80 text-sm leading-relaxed mt-6 border-t border-paper/10 pt-5">{course.description}</p>
    </div>
  );
}
