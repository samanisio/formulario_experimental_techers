import { useMemo, useState } from "react";
import { questions } from "./config/questions";
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
  const [intake, setIntake] = useState<IntakeData>({
    studentName: "",
    age: null,
    guardianName: "",
    guardianPhone: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof IntakeData, string>>>({});

  const currentQuestion = questions[questionIndex];

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
  }

  function handleNext() {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((i) => i + 1);
    } else {
      setPhase("results");
    }
  }

  function handleBack() {
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
  }

  const canContinue = phase === "question" ? Boolean(answers[currentQuestion.id]) : true;

  // Fluxo linear: 1 tela de identificação + N perguntas. A barra avança um
  // passo por tela, sem ficar parada no mesmo percentual por várias telas.
  const totalScreens = questions.length + 1;
  const currentScreen = phase === "intake" ? 1 : 1 + questionIndex + 1;
  const progressLabel = phase === "intake" ? "Sobre você" : `Pergunta ${questionIndex + 1} de ${questions.length}`;

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line">
        <div className="mx-auto max-w-xl px-5 py-4 flex items-center justify-between">
          <Logo />
          {phase !== "results" && <span className="font-mono text-[11px] text-slate uppercase tracking-widest">Diagnóstico de perfil</span>}
        </div>
      </header>

      <main className="mx-auto max-w-xl px-5 py-8 sm:py-12">
        {phase !== "results" && (
          <div className="mb-8">
            <ProgressBar current={currentScreen} total={totalScreens} label={progressLabel} />
          </div>
        )}

        {phase === "intake" && <IntakeStep data={intake} onChange={setIntake} errors={errors} />}

        {phase === "question" && (
          <QuestionStep question={currentQuestion} selected={answers[currentQuestion.id]} onSelect={handleSelectOption} />
        )}

        {phase === "results" && result && intake.age !== null && (
          <ResultsPage studentName={intake.studentName} studentAge={intake.age} result={result} onRestart={handleRestart} />
        )}

        {phase !== "results" && (
          <div className="mt-8 flex items-center justify-between gap-3">
            <Button variant="ghost" onClick={handleBack}>
              Voltar
            </Button>
            <Button onClick={phase === "intake" ? handleIntakeContinue : handleNext} disabled={!canContinue}>
              {phase === "question" && questionIndex === questions.length - 1 ? "Ver meu resultado" : "Continuar"}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
