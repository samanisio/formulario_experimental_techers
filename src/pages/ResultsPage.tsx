import { buildSynthesis } from "../engine/synthesis";
import { ResultHero } from "../components/results/ResultHero";
import { RankingList } from "../components/results/RankingList";
import { ComplementaryCard } from "../components/results/ComplementaryCard";
import { FuturePaths } from "../components/results/FuturePaths";
import { DownloadResultButton } from "../components/results/DownloadResultButton";
import { Button } from "../components/ui/Button";
import type { RecommendationResult } from "../types";

interface ResultsPageProps {
  studentName: string;
  studentAge: number;
  result: RecommendationResult;
  onRestart: () => void;
}

export function ResultsPage({ studentName, studentAge, result, onRestart }: ResultsPageProps) {
  const synthesis = buildSynthesis(result.profile);

  if (!result.primaryCourse) {
    return (
      <div className="text-center py-16">
        <p className="text-slate">Não foi possível calcular uma recomendação. Tente novamente.</p>
        <Button onClick={onRestart} className="mt-4">
          Recomeçar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ResultHero
        studentName={studentName}
        primary={result.primaryCourse}
        hybridCourses={result.hybridCourses}
        synthesis={synthesis}
      />

      <DownloadResultButton studentName={studentName} studentAge={studentAge} synthesis={synthesis} result={result} />

      <RankingList statuses={result.statusByCourse} />

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
