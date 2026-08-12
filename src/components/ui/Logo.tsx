import { useState } from "react";

/**
 * Marca da TECHERS no cabeçalho: o badge oficial (public/logo-techers.png)
 * em tamanho de ícone + wordmark tipografado, para permanecer legível em
 * qualquer tamanho de tela. Se o arquivo do badge não existir, cai para um
 * fallback totalmente tipográfico (ver README > "Logo").
 */
export function Logo() {
  const [failed, setFailed] = useState(false);

  return (
    <div className="flex items-center gap-2.5">
      {!failed && (
        <img
          src="/logo-techers.png"
          alt=""
          className="h-9 w-9 rounded-[10px] shrink-0"
          onError={() => setFailed(true)}
        />
      )}
      <span className="font-display font-bold text-lg tracking-tight text-ink leading-none">
        TECH<span className="text-violet">ERS</span>
      </span>
    </div>
  );
}
