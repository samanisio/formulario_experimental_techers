import { useMemo, useState } from "react";
import { questions } from "./config/questions";
import { shuffleQuestionOptions } from "./engine/shuffle";
import { validateIntake } from "./engine/validation";
import { recommend } from "./engine/recommendationEngine";
import { ProgressBar } from "./components/ui/ProgressBar";
import { Button } from "./components/ui/Button";
import { Logo } from "./components/ui/Logo";
import { IntakeStep } from "./components/questionnaire/IntakeStep";
import { QuestionStep } from "./components/questionnaire/QuestionStep";
import { ResultsPage } from "./pages/ResultsPage";
import type { Answers, IntakeData } from "./types";

type Phase = "intake" | "question" | "results";

function App() {
  const [phase, setPhase] = useState<Phase>("intake");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  // Ordem de exibição das alternativas, embaralhada por sessão (ver
  // src/engine/shuffle.ts). O motor de recomendação nunca usa este array —
  // ele sempre lê `questions` (a ordem original) por `id`, então embaralhar
  // aqui só afeta o que aparece na tela, nunca a pontuação.
  const [displayQuestions, setDisplayQuestions] = useState(() => shuffleQuestionOptions(questions));
  const [intake, setIntake] = useState<IntakeData>({
    studentName: "",
    age: null,
    guardianName: "",
    guardianPhone: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof IntakeData, string>>>({});
  const [questionError, setQuestionError] = useState<string | null>(null);

  const currentQuestion = displayQuestions[questionIndex];

  const result = useMemo(() => {
    if (phase !== "results" || intake.age === null) return null;
    return recommend(answers, intake.age);
  }, [phase, answers, intake.age]);

  function handleIntakeContinue() {
    const validation = validateIntake(intake);
    setErrors(validation);
    if (Object.keys(validation).length === 0) {
      setPhase("question");
      setQuestionIndex(0);
    }
  }

  function handleSelectOption(optionId: string) {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
    setQuestionError(null);
  }

  function handleNext() {
    // Pergunta obrigatória: não avança sem resposta válida, e explica o motivo
    // em vez de apenas desabilitar o botão silenciosamente.
    const answer = answers[currentQuestion.id];
    if (answer === undefined || answer === null || answer === "") {
      setQuestionError("Escolha uma opção para continuar.");
      return;
    }
    setQuestionError(null);
    if (questionIndex < displayQuestions.length - 1) {
      setQuestionIndex((i) => i + 1);
    } else {
      setPhase("results");
    }
  }

  function handleBack() {
    setQuestionError(null);
    if (phase === "question" && questionIndex === 0) {
      setPhase("intake");
    } else {
      setQuestionIndex((i) => i - 1);
    }
  }

  function handleRestart() {
    setPhase("intake");
    setQuestionIndex(0);
    setAnswers({});
    setIntake({ studentName: "", age: null, guardianName: "", guardianPhone: "" });
    setErrors({});
    setQuestionError(null);
    // Novo embaralhamento a cada tentativa.
    setDisplayQuestions(shuffleQuestionOptions(questions));
  }

  // Fluxo linear: 1 tela de identificação + N perguntas. A barra avança um
  // passo por tela, sem ficar parada no mesmo percentual por várias telas.
  const totalScreens = displayQuestions.length + 1;
  const currentScreen = phase === "intake" ? 1 : 1 + questionIndex + 1;
  const progressLabel = phase === "intake" ? "Sobre você" : `Pergunta ${questionIndex + 1} de ${displayQuestions.length}`;

  return (
    <div className="min-h-screen bg-paper relative">
      <div
        className="pointer-events-none fixed inset-x-0 top-0 h-[420px] opacity-[0.07]"
        style={{ background: "radial-gradient(ellipse 640px 320px at 50% -80px, var(--color-violet-light), transparent 70%)" }}
        aria-hidden="true"
      />
      <header className="border-b border-line relative">
        <div className="mx-auto max-w-xl px-5 py-4 flex items-center justify-between">
          <Logo />
          {phase !== "results" && <span className="font-mono text-[11px] text-slate uppercase tracking-widest">Diagnóstico de perfil</span>}
        </div>
      </header>

      <main className="mx-auto max-w-xl px-5 py-8 sm:py-12 relative">
        {phase !== "results" && (
          <div className="mb-8">
            <ProgressBar current={currentScreen} total={totalScreens} label={progressLabel} />
          </div>
        )}

        {phase === "intake" && <IntakeStep data={intake} onChange={setIntake} errors={errors} />}

        {phase === "question" && (
          <>
            <QuestionStep question={currentQuestion} selected={answers[currentQuestion.id]} onSelect={handleSelectOption} />
            {questionError && <p className="text-xs text-rose mt-4">{questionError}</p>}
          </>
        )}

        {phase === "results" && result && intake.age !== null && (
          <ResultsPage
            studentName={intake.studentName}
            studentAge={intake.age}
            guardianName={intake.guardianName}
            guardianPhone={intake.guardianPhone}
            answers={answers}
            result={result}
            onRestart={handleRestart}
          />
        )}

        {phase !== "results" && (
          <div className="mt-8 flex items-center justify-between gap-3">
            <Button variant="ghost" onClick={handleBack}>
              Voltar
            </Button>
            <Button onClick={phase === "intake" ? handleIntakeContinue : handleNext}>
              {phase === "question" && questionIndex === displayQuestions.length - 1 ? "Ver meu resultado" : "Continuar"}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
