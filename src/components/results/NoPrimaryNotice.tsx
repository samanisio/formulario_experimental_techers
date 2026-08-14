interface NoPrimaryNoticeProps {
  studentName: string;
  studentAge: number;
  synthesis: string;
}

/**
 * Estado exibido quando nenhum curso principal está disponível para a idade
 * informada. Com as regras atuais (só o Maker tem teto de idade — os demais
 * cursos têm apenas mínimo, sem limite superior) isso não deveria mais
 * acontecer para nenhuma idade a partir dos 5 anos — mas o componente fica
 * como salvaguarda, caso as faixas etárias de courses.ts mudem no futuro.
 * Não é tratado como erro: o diagnóstico segue válido, e Informática Moderna
 * (sem idade máxima) pode continuar sendo indicada separadamente — ver
 * ComplementaryCard, renderizado logo depois deste aviso.
 */
export function NoPrimaryNotice({ studentName, studentAge, synthesis }: NoPrimaryNoticeProps) {
  const firstName = studentName.trim().split(/\s+/)[0] || "Você";

  return (
    <div className="rounded-3xl bg-paper p-6 sm:p-8 shadow-[0_1px_2px_rgba(20,17,28,0.04)] border border-line">
      <p className="font-mono text-xs tracking-widest uppercase text-slate mb-3">🎯 Perfil TECHERS de {firstName}</p>
      <p className="text-ink/75 text-sm leading-relaxed mb-5">{synthesis}</p>
      <div className="border-t border-line pt-5">
        <p className="text-ink/80 text-sm leading-relaxed">
          Cada curso da TECHERS tem uma idade mínima própria. Para a idade
          informada ({studentAge} anos), nenhum desses cursos está disponível no momento.
        </p>
      </div>
    </div>
  );
}
