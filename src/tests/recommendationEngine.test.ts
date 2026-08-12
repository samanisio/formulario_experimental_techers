import { describe, expect, it } from "vitest";
import { runRecommendationTest } from "./simulator";
import { sampleProfiles } from "./sampleProfiles";
import { isEligible } from "../config/ageRules";
import { courseList } from "../config/courses";

describe("Motor de recomendação — perfis fictícios", () => {
  for (const profile of sampleProfiles) {
    it(profile.label, () => {
      const result = runRecommendationTest(profile.answers, profile.age);

      if (profile.expectedPrimary) {
        expect(result.primaryCourse?.courseId).toBe(profile.expectedPrimary);
      }

      // Nenhuma recomendação "disponível agora" pode violar a faixa etária.
      for (const c of result.eligibleRanking) {
        expect(isEligible(c.courseId, profile.age)).toBe(true);
      }
    });
  }

  it("Perfil 7 — Informática Moderna é indicada como complemento relevante", () => {
    const p7 = sampleProfiles.find((p) => p.label.startsWith("Perfil 7"))!;
    const result = runRecommendationTest(p7.answers, p7.age);
    expect(result.complementary.tier).not.toBe("baixa");
  });

  it("Perfil 8 — reconhece perfil híbrido Programação + Robótica", () => {
    const p8 = sampleProfiles.find((p) => p.label.startsWith("Perfil 8"))!;
    const result = runRecommendationTest(p8.answers, p8.age);
    const top2 = result.eligibleRanking.slice(0, 2).map((c) => c.courseId);
    expect(top2).toEqual(expect.arrayContaining(["programacao", "robotica"]));
    expect(result.hybridCourses.length).toBeGreaterThan(0);
  });
});

describe("Regras de idade — nenhuma violação para nenhuma idade testada", () => {
  const ages = [5, 7, 8, 10, 11, 12, 15, 17];

  for (const age of ages) {
    it(`aos ${age} anos, apenas cursos com faixa etária compatível aparecem como disponíveis`, () => {
      // Perfil neutro (sem respostas) apenas para checar elegibilidade estrutural.
      const result = runRecommendationTest({}, age);
      for (const c of result.eligibleRanking) {
        const course = courseList.find((cc) => cc.id === c.courseId)!;
        expect(age).toBeGreaterThanOrEqual(course.ageRange.min);
        if (course.ageRange.max !== null) {
          expect(age).toBeLessThanOrEqual(course.ageRange.max);
        }
      }
    });
  }
});
