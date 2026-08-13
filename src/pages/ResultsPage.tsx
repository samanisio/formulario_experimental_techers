import { buildSynthesis } from "../engine/synthesis";
import { ResultHero } from "../components/results/ResultHero";
import { NoPrimaryNotice } from "../components/results/NoPrimaryNotice";
import { RankingList } from "../components/results/RankingList";
import { ComplementaryCard } from "../components/results/ComplementaryCard";
import { FuturePaths } from "../components/results/FuturePaths";
import { DownloadResultButton } from "../components/results/DownloadResultButton";
import { Button } from "../components/ui/Button";
import type { Answers, RecommendationResult } from "../types";

interface ResultsPageProps {
  studentName: string;
  studentAge: number;
  guardianName: string;
  guardianPhone: string;
  answers: Answers;
  result: RecommendationResult;
  onRestart: () => void;
}

export function ResultsPage({ studentName, studentAge, guardianName, guardianPhone, answers, result, onRestart }: ResultsPageProps) {
  const synthesis = buildSynthesis(result.profile);

  return (
    <div className="space-y-6">
      {result.primaryCourse ? (
        <ResultHero
          studentName={studentName}
          primary={result.primaryCourse}
          hybridCourses={result.hybridCourses}
          synthesis={synthesis}
        />
      ) : (
        <NoPrimaryNotice studentName={studentName} studentAge={studentAge} synthesis={synthesis} />
      )}

      <DownloadResultButton
        studentName={studentName}
        studentAge={studentAge}
        guardianName={guardianName}
        guardianPhone={guardianPhone}
        answers={answers}
        synthesis={synthesis}
        result={result}
      />

      <RankingList statuses={result.statusByCourse} excludeCourseId={result.primaryCourse?.courseId} />

      <FuturePaths courses={result.futurePaths} studentAge={studentAge} />

      <ComplementaryCard result={result.complementary} />

      <p className="text-xs text-slate/80 leading-relaxed border-t border-line pt-5">
        As informações preenchidas são utilizadas para identificar quais cursos da TECHERS podem combinar melhor
        com o perfil do aluno. Nenhum dado é enviado a terceiros.
      </p>

      <div className="flex justify-center pt-2">
        <Button variant="ghost" onClick={onRestart}>
          Refazer o diagnóstico
        </Button>
      </div>
    </div>
  );
}
