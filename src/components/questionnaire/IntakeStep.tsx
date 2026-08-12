import type { IntakeData } from "../../types";

interface IntakeStepProps {
  data: IntakeData;
  onChange: (data: IntakeData) => void;
  errors: Partial<Record<keyof IntakeData, string>>;
}

export function IntakeStep({ data, onChange, errors }: IntakeStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-ink">Vamos conhecer você</h2>
        <p className="text-slate mt-1">Só o essencial para começar.</p>
      </div>

      <div className="space-y-4">
        <Field label="Nome completo do aluno" error={errors.studentName}>
          <input
            type="text"
            value={data.studentName}
            onChange={(e) => onChange({ ...data, studentName: e.target.value })}
            placeholder="Nome e sobrenome"
            className={inputClass(!!errors.studentName)}
          />
        </Field>

        <Field label="Idade" error={errors.age}>
          <input
            type="number"
            inputMode="numeric"
            min={5}
            max={17}
            value={data.age ?? ""}
            onChange={(e) => onChange({ ...data, age: e.target.value === "" ? null : Number(e.target.value) })}
            placeholder="Ex: 10"
            className={inputClass(!!errors.age)}
          />
        </Field>

        <div className="pt-4 border-t border-line">
          <Field label="Nome completo do responsável">
            <input
              type="text"
              value={data.guardianName}
              onChange={(e) => onChange({ ...data, guardianName: e.target.value })}
              placeholder="Nome e sobrenome"
              className={inputClass(false)}
            />
          </Field>

          <div className="h-4" />

          <Field label="Telefone do responsável">
            <input
              type="tel"
              value={data.guardianPhone}
              onChange={(e) => onChange({ ...data, guardianPhone: e.target.value })}
              placeholder="(00) 00000-0000"
              className={inputClass(false)}
            />
          </Field>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-ink mb-1.5">{label}</span>
      {children}
      {error && <span className="block text-xs text-rose mt-1">{error}</span>}
    </label>
  );
}

function inputClass(hasError: boolean) {
  return `w-full rounded-xl border px-4 py-3 text-ink bg-paper placeholder:text-slate/60 outline-none transition-all focus:border-violet focus:shadow-[0_0_0_4px_rgba(109,40,217,0.1)] ${
    hasError ? "border-rose" : "border-line"
  }`;
}
