/**
 * Elemento assinatura: um medidor de sinal (barras), inspirado em indicadores
 * de força de conexão — reforça a ideia de "afinidade" como um sinal que a
 * TECHERS está captando do perfil do aluno.
 */
export function AffinityMeter({ score, accent = "#6d28d9" }: { score: number; accent?: string }) {
  const bars = 10;
  const lit = Math.round((score / 100) * bars);
  return (
    <div className="flex items-end gap-[3px] h-6" aria-hidden="true">
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className="w-1.5 rounded-sm transition-colors duration-300"
          style={{
            height: `${20 + i * 8}%`,
            background: i < lit ? accent : "var(--color-line)",
          }}
        />
      ))}
    </div>
  );
}
