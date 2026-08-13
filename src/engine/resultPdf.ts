import { jsPDF } from "jspdf";
import { questions } from "../config/questions";
import { courses } from "../config/courses";
import type { Answers, RecommendationResult } from "../types";

/**
 * Gera, inteiramente no navegador (jsPDF, sem backend), um relatório em PDF
 * com os dados do aluno, todas as perguntas e respostas do formulário (na
 * ordem em que foram feitas) e a ordem de cursos recomendados — a MESMA
 * ordem usada em src/engine/resultImage.ts, sem recalcular nada.
 *
 * Identidade visual: logo oficial da TECHERS no cabeçalho, texto "TECHERS"
 * em preto (mesma decisão já aplicada no formulário e na imagem) e roxo
 * (--color-violet, #6d28d9) como cor de destaque — cartão de dados do aluno,
 * marcadores de seção, rótulos de pergunta/resposta e a linha de cada bloco.
 * Cada curso recomendado usa sua própria cor de destaque (courses.ts),
 * espelhando a mesma linguagem visual da imagem e da tela de resultado.
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
const VIOLET: [number, number, number] = [109, 40, 217];
const VIOLET_SOFT: [number, number, number] = [239, 233, 251];

const statusLabel: Record<string, string> = {
  disponivel: "Disponível agora",
  "proxima-etapa": "Próxima etapa",
  "fora-da-faixa": "Fora da faixa etária",
};

function hexToRgbTuple(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const value = parseInt(clean, 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

/** Carrega a logo e devolve um data URL PNG — mesma técnica usada em resultImage.ts. */
function loadImageAsDataUrl(src: string): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(null);
          return;
        }
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

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
  const indent = 12; // recuo do texto em relação às barrinhas roxas de marcação
  const footerReserve = 40;
  let y = margin;

  function ensureSpace(height: number) {
    if (y + height > pageH - footerReserve) {
      doc.addPage();
      y = margin;
    }
  }

  function heading(text: string, size = 15) {
    ensureSpace(size + 12);
    doc.setFillColor(...VIOLET);
    doc.rect(margin, y - size + 4, 3, size + 1, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(size);
    doc.setTextColor(...INK);
    doc.text(text, margin + indent, y);
    y += size + 12;
  }

  function divider() {
    ensureSpace(18);
    doc.setDrawColor(...VIOLET);
    doc.setLineWidth(1.2);
    doc.line(margin, y, pageW - margin, y);
    y += 18;
  }

  function paragraphLines(text: string, size: number, maxWidth: number): string[] {
    doc.setFontSize(size);
    return doc.splitTextToSize(text, maxWidth) as string[];
  }

  function writeLines(
    lines: string[],
    size: number,
    lineHeight: number,
    opts: { bold?: boolean; color?: [number, number, number]; x?: number } = {}
  ) {
    doc.setFont("helvetica", opts.bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(...(opts.color ?? INK));
    for (const line of lines) {
      ensureSpace(lineHeight);
      doc.text(line, opts.x ?? margin, y);
      y += lineHeight;
    }
  }

  // ---- Cabeçalho ---------------------------------------------------------
  const logoDataUrl = await loadImageAsDataUrl("/logo-techers.png");
  const logoSize = 42;
  const titleX = logoDataUrl ? margin + logoSize + 14 : margin;
  if (logoDataUrl) {
    try {
      doc.addImage(logoDataUrl, "PNG", margin, y - 6, logoSize, logoSize);
    } catch {
      // segue sem a logo caso o navegador rejeite a imagem por algum motivo
    }
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(...INK);
  doc.text("TECHERS", titleX, y + 22);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12.5);
  doc.setTextColor(...VIOLET);
  doc.text("Relatório de Perfil do Aluno", titleX, y + 42);
  y += logoSize + 18;
  divider();

  // ---- Dados do aluno (cartão com fundo roxo suave) -----------------------
  heading("Dados do aluno");

  const fields: [string, string][] = [
    ["Nome:", studentName.trim()],
    ["Idade:", `${studentAge} anos`],
  ];
  if (guardianName.trim()) fields.push(["Responsável:", guardianName.trim()]);
  if (guardianPhone.trim()) fields.push(["Telefone:", guardianPhone.trim()]);

  const cardPadding = 14;
  const fieldLineH = 19;
  const cardH = fields.length * fieldLineH + cardPadding * 1.6;
  ensureSpace(cardH + 12);
  doc.setFillColor(...VIOLET_SOFT);
  doc.roundedRect(margin, y, contentW, cardH, 8, 8, "F");
  let fieldY = y + cardPadding + 8;
  for (const [label, value] of fields) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...INK);
    doc.text(label, margin + cardPadding, fieldY);
    const labelW = doc.getTextWidth(label);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...INK);
    doc.text(value, margin + cardPadding + labelW + 6, fieldY);
    fieldY += fieldLineH;
  }
  y += cardH + 20;
  divider();

  // ---- Respostas do formulário --------------------------------------------
  heading("Respostas do formulário");
  const questionLabelSize = 11.5;
  const answerLabelSize = 11;
  const lineHeight = 15;
  const wrapW = contentW - indent;

  questions.forEach((question, index) => {
    const selectedId = answers[question.id];
    const option = question.options.find((o) => o.id === selectedId);
    if (!option) return; // pergunta não respondida (não deveria ocorrer — formulário exige resposta)

    const qTitle = `Pergunta ${index + 1}`;
    const qLines = paragraphLines(question.title, questionLabelSize, wrapW);
    const aLines = paragraphLines(option.label, answerLabelSize, wrapW);

    // Reserva o bloco inteiro (pergunta + resposta) de uma vez, para não
    // cortar a pergunta de um lado da página e a resposta do outro.
    const blockHeight = lineHeight + qLines.length * lineHeight + 4 + lineHeight + aLines.length * lineHeight + 16;
    ensureSpace(Math.min(blockHeight, pageH - margin - footerReserve));

    const blockStartY = y - 10;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...VIOLET);
    doc.text(qTitle, margin + indent, y);
    y += lineHeight;

    writeLines(qLines, questionLabelSize, lineHeight, { bold: true, color: INK, x: margin + indent });
    y += 4;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(answerLabelSize);
    doc.setTextColor(...VIOLET);
    ensureSpace(lineHeight);
    doc.text("Resposta:", margin + indent, y);
    y += lineHeight;

    writeLines(aLines, answerLabelSize, lineHeight, { color: INK, x: margin + indent });

    doc.setDrawColor(...VIOLET);
    doc.setLineWidth(2);
    doc.line(margin, blockStartY, margin, y - 6);

    y += 16;
  });

  divider();

  // ---- Cursos recomendados -------------------------------------------------
  heading("Cursos recomendados");
  const medalText = ["1º", "2º", "3º"];
  const sortedStatus = [...result.statusByCourse].sort((a, b) => b.affinity - a.affinity);

  sortedStatus.forEach((s, i) => {
    const course = courses[s.courseId];
    const accent = hexToRgbTuple(course.accent);
    const rank = medalText[i] ?? `${i + 1}º`;
    const title = `${rank} — ${course.name}`;
    const statusText = statusLabel[s.status] ?? "";
    const taglineLines = paragraphLines(course.tagline, 10.5, wrapW);

    const blockHeight = 18 + 14 + taglineLines.length * 13 + 14;
    ensureSpace(Math.min(blockHeight, pageH - margin - footerReserve));

    const blockStartY = y - 10;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12.5);
    doc.setTextColor(...accent);
    doc.text(title, margin + indent, y);
    const titleW = doc.getTextWidth(title);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...SLATE);
    doc.text(statusText, margin + indent + titleW + 12, y);
    y += 16;

    writeLines(taglineLines, 10.5, 13, { color: SLATE, x: margin + indent });

    doc.setDrawColor(...accent);
    doc.setLineWidth(2.5);
    doc.line(margin, blockStartY, margin, y - 8);

    y += 12;
  });

  if (result.complementary.tier !== "baixa") {
    const imCourse = courses[result.complementary.courseId];
    const accent = hexToRgbTuple(imCourse.accent);
    const tierText = result.complementary.tier === "alta" ? "Alta indicação" : "Indicação moderada";
    ensureSpace(40);
    const blockStartY = y - 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...INK);
    doc.text(`Curso complementar: ${imCourse.name}`, margin + indent, y);
    y += 16;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(...accent);
    doc.text(tierText, margin + indent, y);
    doc.setDrawColor(...accent);
    doc.setLineWidth(2.5);
    doc.line(margin, blockStartY, margin, y + 2);
    y += 16;
  }

  // ---- Rodapé em todas as páginas ------------------------------------------
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setDrawColor(...VIOLET);
    doc.setLineWidth(1);
    doc.line(margin, pageH - 34, pageW - margin, pageH - 34);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...SLATE);
    doc.text("TECHERS · Tecnologia para todos", margin, pageH - 20);
    doc.setTextColor(...VIOLET);
    doc.text(`Página ${p} de ${pageCount}`, pageW - margin, pageH - 20, { align: "right" });
  }

  return doc.output("blob");
}
