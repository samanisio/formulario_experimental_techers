import type { IntakeData } from "../types";

export function validateIntake(data: IntakeData): Partial<Record<keyof IntakeData, string>> {
  const errors: Partial<Record<keyof IntakeData, string>> = {};

  const nameParts = data.studentName.trim().split(/\s+/).filter(Boolean);
  if (nameParts.length < 2) {
    errors.studentName = "Digite o nome completo (nome e sobrenome).";
  }

  if (data.age === null || Number.isNaN(data.age)) {
    errors.age = "Informe a idade.";
  } else if (!Number.isInteger(data.age) || data.age < 5) {
    errors.age = "A idade mínima para preencher o formulário é 5 anos.";
  }

  return errors;
}
