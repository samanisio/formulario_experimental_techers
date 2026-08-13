import { useState } from "react";
import { generateResultImage } from "../../engine/resultImage";
import { generateResultPdf } from "../../engine/resultPdf";
import { Button } from "../ui/Button";
import type { Answers, RecommendationResult } from "../../types";

interface DownloadResultButtonProps {
  studentName: string;
  studentAge: number;
  guardianName: string;
  guardianPhone: string;
  answers: Answers;
  synthesis: string;
  result: RecommendationResult;
}

function slugify(name: string): string {
  const cleaned = name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
  return cleaned || "aluno";
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function DownloadResultButton({
  studentName,
  studentAge,
  guardianName,
  guardianPhone,
  answers,
  synthesis,
  result,
}: DownloadResultButtonProps) {
  const [status, setStatus] = useState<"idle" | "generating" | "error">("idle");

  async function handleDownload() {
    setStatus("generating");
    try {
      const slug = slugify(studentName);
      const [imageBlob, pdfBlob] = await Promise.all([
        generateResultImage({ studentName, studentAge, synthesis, result }),
        generateResultPdf({ studentName, studentAge, guardianName, guardianPhone, answers, result }),
      ]);

      // Dois downloads a partir de um único clique: um pequeno intervalo entre
      // eles evita que o navegador bloqueie o segundo como pop-up indesejado.
      triggerDownload(imageBlob, `cursos-recomendados-${slug}.png`);
      setTimeout(() => triggerDownload(pdfBlob, `relatorio-${slug}.pdf`), 350);

      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Button onClick={handleDownload} disabled={status === "generating"} className="w-full sm:w-auto">
        {status === "generating" ? "Gerando arquivos…" : "⬇ Baixar resultado"}
      </Button>
      {status === "error" && (
        <p className="text-xs text-rose">Não foi possível gerar os arquivos agora. Tente novamente.</p>
      )}
    </div>
  );
}
