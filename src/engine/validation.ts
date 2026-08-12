import type { IntakeData } from "../types";

export function validateIntake(data: IntakeData): Partial<Record<keyof IntakeData, string>> {
  const errors: Partial<Record<keyof IntakeData, string>> = {};

  const nameParts = data.studentName.trim().split(/\s+/).filter(Boolean);
  if (nameParts.length < 2) {
    errors.studentName = "Digite o nome completo (nome e sobrenome).";
  }

  if (data.age === null || Number.isNaN(data.age)) {
    errors.age = "Informe a idade.";
  } else if (!Number.isInteger(data.age) || data.age < 5 || data.age > 17) {
    errors.age = "A idade deve estar entre 5 e 17 anos.";
  }

  return errors;
}
