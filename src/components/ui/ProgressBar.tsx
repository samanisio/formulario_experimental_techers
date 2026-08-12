interface ProgressBarProps {
  /** Posição atual no fluxo, 1-indexado (1 = primeira tela). */
  current: number;
  /** Total de telas do fluxo (identificação + perguntas). */
  total: number;
  label: string;
}

/**
 * Avança um passo por tela, de forma linear e previsível — sem "prender"
 * a barra num mesmo percentual por várias telas seguidas.
 */
export function ProgressBar({ current, total, label }: ProgressBarProps) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-2">
        <span className="font-mono text-xs tracking-widest text-slate uppercase">{label}</span>
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
