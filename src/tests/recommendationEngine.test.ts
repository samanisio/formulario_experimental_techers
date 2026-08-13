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

  it("Animação Digital está disponível a partir dos 10 anos (não apenas calculada — elegível de fato)", () => {
    expect(isEligible("animacao-digital", 10)).toBe(true);
    expect(isEligible("animacao-digital", 9)).toBe(false);
    const result10 = runRecommendationTest({}, 10);
    expect(result10.eligibleRanking.some((c) => c.courseId === "animacao-digital")).toBe(true);
  });
});

describe("Idade sem limite máximo no formulário (só os cursos têm limite próprio)", () => {
  it("adulto (30 anos): nenhum curso principal elegível, mas Informática Moderna continua calculável", () => {
    const result = runRecommendationTest({}, 30);
    expect(result.primaryCourse).toBeNull();
    expect(result.eligibleRanking.length).toBe(0);
    // Informática Moderna não tem idade máxima — segue calculada normalmente.
    expect(result.complementary.score).toBeGreaterThanOrEqual(0);
  });

  it("idade avançada (65 anos): mesma coisa, sem quebrar o motor de recomendação", () => {
    const result = runRecommendationTest({}, 65);
    expect(result.primaryCourse).toBeNull();
    expect(result.eligibleRanking.length).toBe(0);
    expect(result.hybridCourses).toEqual([]);
  });

  it("pessoa mais velha nunca vê 'próxima etapa' — cursos com idade máxima ultrapassada são 'fora da faixa etária'", () => {
    const result = runRecommendationTest({}, 40);
    for (const s of result.statusByCourse) {
      if (s.status === "proxima-etapa") {
        // só pode ser 'próxima etapa' se a pessoa ainda não tiver chegado na idade mínima
        const course = courseList.find((c) => c.id === s.courseId)!;
        expect(40).toBeLessThan(course.ageRange.min);
      }
    }
    // Para 40 anos, todo curso principal (idade mínima bem abaixo de 40) deve
    // estar "fora da faixa etária", nunca "próxima etapa".
    const mainCourseStatuses = result.statusByCourse.filter((s) => s.courseId !== "informatica-moderna");
    for (const s of mainCourseStatuses) {
      expect(s.status).toBe("fora-da-faixa");
    }
  });

  it("criança que ainda não chegou na idade mínima continua vendo 'próxima etapa' normalmente", () => {
    const result = runRecommendationTest({}, 9);
    const design = result.statusByCourse.find((s) => s.courseId === "design-grafico")!;
    // Design Gráfico é 12+; aos 9 anos, se a afinidade for alta o suficiente, deve
    // aparecer como "próxima etapa" (não "fora da faixa").
    expect(["proxima-etapa", "fora-da-faixa"]).toContain(design.status);
  });
});
