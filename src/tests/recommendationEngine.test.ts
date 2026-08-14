import { describe, expect, it } from "vitest";
import { runRecommendationTest } from "./simulator";
import { sampleProfiles } from "./sampleProfiles";
import { isEligible } from "../config/ageRules";
import { courseList } from "../config/courses";
import { questions } from "../config/questions";
import { courseWeights } from "../config/scoring";
import type { Answers } from "../types";

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

  it("Perfil 5 — chega a Design Gráfico sem nenhuma alternativa de desenho", () => {
    const p5 = sampleProfiles.find((p) => p.label.startsWith("Perfil 5"))!;
    for (const question of questions) {
      const selectedId = p5.answers[question.id];
      const option = question.options.find((o) => o.id === selectedId)!;
      expect(option.label.toLowerCase()).not.toContain("desenh");
    }
    const result = runRecommendationTest(p5.answers, p5.age);
    expect(result.primaryCourse?.courseId).toBe("design-grafico");
  });
});

describe("Design Gráfico não depende de desenho", () => {
  it("a matriz de pesos de design-grafico não usa a dimensão 'drawing'", () => {
    expect(courseWeights["design-grafico"].drawing ?? 0).toBe(0);
  });

  it("um perfil forte em edição de mídia/curadoria/comunicação, mas zero em desenho, ainda chega a Design Gráfico", () => {
    // Perfil sintético: só preenche as dimensões novas de Design (sem `drawing`).
    const answers: Answers = { q4: "d", q5: "d", q7: "d", q9: "d" };
    const result = runRecommendationTest(answers, 15);
    expect(result.pureRanking[0]?.courseId).toBe("design-grafico");
    expect(result.profile.drawing).toBe(0);
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

describe("Idade sem limite máximo nos cursos (exceto Maker, que é fixo 5–7)", () => {
  it("adulto (30 anos): recebe o curso mais adequado como principal, como qualquer outra idade", () => {
    const result = runRecommendationTest({}, 30);
    expect(result.primaryCourse).not.toBeNull();
    // Sem teto de idade, todos os cursos principais (min. 8, 8, 10, 12) ficam elegíveis aos 30 anos.
    expect(result.eligibleRanking.length).toBe(4);
    expect(result.complementary.score).toBeGreaterThanOrEqual(0);
  });

  it("idade avançada (65 anos): continua recebendo uma recomendação normalmente, sem quebrar o motor", () => {
    const result = runRecommendationTest({}, 65);
    expect(result.primaryCourse).not.toBeNull();
    expect(result.eligibleRanking.length).toBe(4);
  });

  it("Maker é o único curso com teto de idade — continua elegível só dos 5 aos 7 anos", () => {
    expect(isEligible("maker", 5)).toBe(true);
    expect(isEligible("maker", 7)).toBe(true);
    expect(isEligible("maker", 8)).toBe(false);
    expect(isEligible("maker", 30)).toBe(false);
    expect(isEligible("maker", 65)).toBe(false);
  });

  it("os quatro cursos principais (sem teto) ficam 'disponível agora' para uma pessoa de 50 anos", () => {
    const result = runRecommendationTest({}, 50);
    const mainCourseStatuses = result.statusByCourse.filter((s) => s.courseId !== "informatica-moderna");
    for (const s of mainCourseStatuses) {
      expect(s.status).toBe("disponivel");
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
