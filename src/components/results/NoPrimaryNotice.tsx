interface NoPrimaryNoticeProps {
  studentName: string;
  studentAge: number;
  synthesis: string;
}

/**
 * Estado exibido quando nenhum curso principal está disponível para a idade
 * informada — hoje só acontece quando a pessoa já passou da idade máxima de
 * todos os cursos principais (o formulário não tem mais idade máxima própria,
 * apenas cada curso mantém a sua). Não é um erro: o diagnóstico segue válido,
 * e Informática Moderna (sem idade máxima) pode continuar sendo indicada
 * separadamente — ver ComplementaryCard, renderizado logo depois deste aviso.
 */
export function NoPrimaryNotice({ studentName, studentAge, synthesis }: NoPrimaryNoticeProps) {
  const firstName = studentName.trim().split(/\s+/)[0] || "Você";

  return (
    <div className="rounded-3xl bg-paper p-6 sm:p-8 shadow-[0_1px_2px_rgba(20,17,28,0.04)] border border-line">
      <p className="font-mono text-xs tracking-widest uppercase text-slate mb-3">🎯 Perfil TECHERS de {firstName}</p>
      <p className="text-ink/75 text-sm leading-relaxed mb-5">{synthesis}</p>
      <div className="border-t border-line pt-5">
        <p className="text-ink/80 text-sm leading-relaxed">
          Os cursos principais da TECHERS são voltados a crianças e adolescentes de 5 a 17 anos. Para a idade
          informada ({studentAge} anos), nenhum desses cursos está disponível no momento.
        </p>
      </div>
    </div>
  );
}
