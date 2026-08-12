interface ProgressBarProps {
  step: number;
  totalSteps: number;
}

export function ProgressBar({ step, totalSteps }: ProgressBarProps) {
  const pct = Math.round((step / totalSteps) * 100);
  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-2">
        <span className="font-mono text-xs tracking-widest text-slate uppercase">
          Etapa {step} de {totalSteps}
        </span>
        <span className="font-mono text-xs text-violet">{pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-paper-dim overflow-hidden">
        <div
          className="h-full rounded-full bg-violet transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
