import type { ProfileQuestion } from "../../types";

interface QuestionStepProps {
  question: ProfileQuestion;
  selected?: string;
  onSelect: (optionId: string) => void;
}

export function QuestionStep({ question, selected, onSelect }: QuestionStepProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl sm:text-2xl font-semibold text-ink leading-snug">{question.title}</h2>
        {question.helper && <p className="text-slate mt-1 text-sm">{question.helper}</p>}
      </div>

      <div className="grid gap-3">
        {question.options.map((option, i) => {
          const isSelected = selected === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              className={`group flex items-center gap-4 text-left rounded-2xl border px-4 py-4 transition-all duration-150 ${
                isSelected
                  ? "border-violet bg-violet-soft shadow-[0_2px_10px_rgba(109,40,217,0.12)]"
                  : "border-line bg-paper hover:border-ink/25 hover:bg-paper-dim hover:shadow-[0_2px_8px_rgba(20,17,28,0.05)] hover:-translate-y-0.5"
              }`}
            >
              <span
                className={`font-mono text-xs shrink-0 w-7 h-7 rounded-full flex items-center justify-center border transition-colors ${
                  isSelected ? "bg-violet text-paper border-violet" : "border-line text-slate group-hover:border-ink/40"
                }`}
              >
                {String.fromCharCode(65 + i)}
              </span>
              <span className={`text-[15px] leading-snug ${isSelected ? "text-ink font-medium" : "text-ink/85"}`}>
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
