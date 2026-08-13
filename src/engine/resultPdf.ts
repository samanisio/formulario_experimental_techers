import { jsPDF } from "jspdf";
import { questions } from "../config/questions";
import { courses } from "../config/courses";
import type { Answers, RecommendationResult } from "../types";

/**
 * Gera, inteiramente no navegador (jsPDF, sem backend), um relatório em PDF
 * com os dados do aluno, todas as perguntas e respostas do formulário (na
 * ordem em que foram feitas) e a ordem de cursos recomendados — a MESMA
 * ordem usada em src/engine/resultImage.ts, sem recalcular nada.
 */

interface GenerateResultPdfParams {
  studentName: string;
  studentAge: number;
  guardianName: string;
  guardianPhone: string;
  answers: Answers;
  result: RecommendationResult;
}

const INK: [number, number, number] = [20, 17, 28];
const SLATE: [number, number, number] = [107, 102, 116];
const LINE: [number, number, number] = [228, 223, 230];

const statusLabel: Record<string, string> = {
  disponivel: "Disponível agora",
  "proxima-etapa": "Próxima etapa",
  "fora-da-faixa": "Fora da faixa etária",
};

export async function generateResultPdf({
  studentName,
  studentAge,
  guardianName,
  guardianPhone,
  answers,
  result,
}: GenerateResultPdfParams): Promise<Blob> {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 56;
  const contentW = pageW - margin * 2;
  const footerReserve = 40;
  let y = margin;

  function ensureSpace(height: number) {
    if (y + height > pageH - footerReserve) {
      doc.addPage();
      y = margin;
    }
  }

  function heading(text: string, size = 15) {
    ensureSpace(size + 10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(size);
    doc.setTextColor(...INK);
    doc.text(text, margin, y);
    y += size + 10;
  }

  function divider() {
    ensureSpace(18);
    doc.setDrawColor(...LINE);
    doc.setLineWidth(1);
    doc.line(margin, y, pageW - margin, y);
    y += 18;
  }

  function keyValueLine(label: string, value: string) {
    ensureSpace(20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...INK);
    doc.text(label, margin, y);
    const labelW = doc.getTextWidth(label);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...INK);
    doc.text(value, margin + labelW + 6, y);
    y += 20;
  }

  function paragraphLines(text: string, size: number, maxWidth: number): string[] {
    doc.setFontSize(size);
    return doc.splitTextToSize(text, maxWidth) as string[];
  }

  function writeLines(lines: string[], size: number, lineHeight: number, opts: { bold?: boolean; color?: [number, number, number] } = {}) {
    doc.setFont("helvetica", opts.bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(...(opts.color ?? INK));
    for (const line of lines) {
      ensureSpace(lineHeight);
      doc.text(line, margin, y);
      y += lineHeight;
    }
  }

  // ---- Cabeçalho -----------------------------------------------------
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(...INK);
  doc.text("TECHERS", margin, y);
  y += 26;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.setTextColor(...SLATE);
  doc.text("Relatório de Perfil do Aluno", margin, y);
  y += 20;
  divider();

  // ---- Dados do aluno --------------------------------------------------
  heading("Dados do aluno");
  keyValueLine("Nome:", studentName.trim());
  keyValueLine("Idade:", `${studentAge} anos`);
  if (guardianName.trim()) keyValueLine("Responsável:", guardianName.trim());
  if (guardianPhone.trim()) keyValueLine("Telefone:", guardianPhone.trim());
  y += 8;
  divider();

  // ---- Respostas do formulário ------------------------------------------
  heading("Respostas do formulário");
  const questionLabelSize = 11.5;
  const answerLabelSize = 11;
  const lineHeight = 15;

  questions.forEach((question, index) => {
    const selectedId = answers[question.id];
    const option = question.options.find((o) => o.id === selectedId);
    if (!option) return; // pergunta não respondida (não deveria ocorrer — formulário exige resposta)

    const qTitle = `Pergunta ${index + 1}`;
    const qLines = paragraphLines(question.title, questionLabelSize, contentW);
    const aLines = paragraphLines(option.label, answerLabelSize, contentW);

    // Reserva o bloco inteiro (pergunta + resposta) de uma vez, para não
    // cortar a pergunta de um lado da página e a resposta do outro.
    const blockHeight = lineHeight + qLines.length * lineHeight + 4 + lineHeight + aLines.length * lineHeight + 16;
    ensureSpace(Math.min(blockHeight, pageH - margin - footerReserve));

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...SLATE);
    doc.text(qTitle, margin, y);
    y += lineHeight;

    writeLines(qLines, questionLabelSize, lineHeight, { bold: true, color: INK });
    y += 4;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(answerLabelSize);
    doc.setTextColor(...SLATE);
    ensureSpace(lineHeight);
    doc.text("Resposta:", margin, y);
    y += lineHeight;

    writeLines(aLines, answerLabelSize, lineHeight, { bold: false, color: INK });
    y += 16;
  });

  divider();

  // ---- Cursos recomendados ---------------------------------------------
  heading("Cursos recomendados");
  const medalText = ["1º", "2º", "3º"];
  const sortedStatus = [...result.statusByCourse].sort((a, b) => b.affinity - a.affinity);

  sortedStatus.forEach((s, i) => {
    const course = courses[s.courseId];
    const rank = medalText[i] ?? `${i + 1}º`;
    const title = `${rank} — ${course.name}`;
    const statusText = statusLabel[s.status] ?? "";
    const taglineLines = paragraphLines(course.tagline, 10.5, contentW);

    const blockHeight = 18 + 14 + taglineLines.length * 13 + 14;
    ensureSpace(Math.min(blockHeight, pageH - margin - footerReserve));

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12.5);
    doc.setTextColor(...INK);
    doc.text(title, margin, y);
    const titleW = doc.getTextWidth(title);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...SLATE);
    doc.text(statusText, margin + titleW + 12, y);
    y += 16;

    writeLines(taglineLines, 10.5, 13, { color: SLATE });
    y += 12;
  });

  if (result.complementary.tier !== "baixa") {
    const imCourse = courses[result.complementary.courseId];
    const tierText = result.complementary.tier === "alta" ? "Alta indicação" : "Indicação moderada";
    ensureSpace(40);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...INK);
    doc.text(`Curso complementar: ${imCourse.name}`, margin, y);
    y += 16;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(...SLATE);
    doc.text(tierText, margin, y);
    y += 16;
  }

  // ---- Rodapé em todas as páginas ---------------------------------------
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...SLATE);
    doc.text("TECHERS · Tecnologia para todos", margin, pageH - 22);
    doc.text(`Página ${p} de ${pageCount}`, pageW - margin, pageH - 22, { align: "right" });
  }

  return doc.output("blob");
}
