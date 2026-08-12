import { useState } from "react";
import { generateResultImage } from "../../engine/resultImage";
import { Button } from "../ui/Button";
import type { RecommendationResult } from "../../types";

interface DownloadResultButtonProps {
  studentName: string;
  studentAge: number;
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

export function DownloadResultButton({ studentName, studentAge, synthesis, result }: DownloadResultButtonProps) {
  const [status, setStatus] = useState<"idle" | "generating" | "error">("idle");

  async function handleDownload() {
    setStatus("generating");
    try {
      const blob = await generateResultImage({ studentName, studentAge, synthesis, result });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `techers-perfil-${slugify(studentName)}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Button onClick={handleDownload} disabled={status === "generating"} className="w-full sm:w-auto">
        {status === "generating" ? "Gerando imagem…" : "⬇ Baixar resultado em imagem"}
      </Button>
      {status === "error" && (
        <p className="text-xs text-rose">Não foi possível gerar a imagem agora. Tente novamente.</p>
      )}
    </div>
  );
}
