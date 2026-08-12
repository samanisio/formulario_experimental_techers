import { courses } from "../config/courses";
import type { RecommendationResult } from "../types";

/**
 * Gera, inteiramente no navegador (Canvas 2D, sem serviço externo), uma
 * imagem PNG com o resultado do diagnóstico — pensada para o aluno/
 * responsável salvar ou compartilhar. Nenhum dado sai do dispositivo do
 * usuário: a imagem é composta localmente e baixada diretamente.
 *
 * O layout espelha a versão web (ver src/components/results): cartão claro
 * com destaque na cor do curso, medalha para o 1º lugar e nenhuma
 * porcentagem — apenas a ORDEM de afinidade entre os cursos.
 */

interface GenerateResultImageParams {
  studentName: string;
  studentAge: number;
  synthesis: string;
  result: RecommendationResult;
}

const WIDTH = 1080;
const SIDE_MARGIN = 48;
const ROW_H = 96;
const ROW_GAP = 16;
const INK = "#14111c";
const SLATE = "#6b6674";
const LINE = "#e4dfe6";
const PAPER = "#faf9f7";

const medals = ["🥇", "🥈", "🥉"];

const statusLabel: Record<string, string> = {
  disponivel: "Disponível agora",
  "proxima-etapa": "Próxima etapa",
  "fora-da-faixa": "Fora da faixa etária",
};

const statusColor: Record<string, string> = {
  disponivel: "#0f9d78",
  "proxima-etapa": "#c2790a",
  "fora-da-faixa": "#6b6674",
};

function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function hexToRgba(hex: string, alpha: number): string {
  const bigint = parseInt(hex.replace("#", ""), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

function withCardShadow(ctx: CanvasRenderingContext2D, draw: () => void) {
  ctx.save();
  ctx.shadowColor = "rgba(20,17,28,0.10)";
  ctx.shadowBlur = 22;
  ctx.shadowOffsetY = 6;
  draw();
  ctx.restore();
}

/** Quebra texto em várias linhas respeitando uma largura máxima; retorna o Y final. */
function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number, maxLines = 4): number {
  const words = text.split(" ");
  let line = "";
  let cursorY = y;
  let lines = 0;
  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, cursorY);
      line = word;
      cursorY += lineHeight;
      lines += 1;
      if (lines >= maxLines - 1) {
        line = words.slice(words.indexOf(word)).join(" ");
        break;
      }
    } else {
      line = testLine;
    }
  }
  if (line) {
    ctx.fillText(line, x, cursorY);
    cursorY += lineHeight;
  }
  return cursorY;
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/** Emblema circular colorido com o ícone do curso, do jeito usado em toda a interface. */
function drawIconBadge(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, iconFontSize: number, icon: string, accent: string) {
  drawRoundedRect(ctx, x, y, size, size, size * 0.28);
  ctx.fillStyle = hexToRgba(accent, 0.12);
  ctx.fill();
  ctx.font = `${iconFontSize}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(icon, x + size / 2, y + size / 2 + iconFontSize * 0.05);
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
}

export async function generateResultImage({ studentName, studentAge, synthesis, result }: GenerateResultImageParams): Promise<Blob> {
  if (typeof document !== "undefined" && "fonts" in document) {
    try {
      await document.fonts.ready;
    } catch {
      // segue com as fontes de sistema disponíveis
    }
  }

  const sortedStatus = [...result.statusByCourse].sort((a, b) => b.affinity - a.affinity);
  const hasComplementary = result.complementary.tier !== "baixa";
  const primary = result.primaryCourse;
  const accent = primary ? courses[primary.courseId].accent : "#6d28d9";

  const HERO_H = 600 + (result.hybridCourses.length > 0 ? 56 : 0);
  const rankingH = sortedStatus.length * (ROW_H + ROW_GAP);
  const complementaryH = hasComplementary ? 168 : 0;
  const footerH = 90;
  const height = SIDE_MARGIN + HERO_H + 64 + 90 + rankingH + complementaryH + footerH;

  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, WIDTH, height);

  const heroX = SIDE_MARGIN;
  const heroY = SIDE_MARGIN;
  const heroW = WIDTH - SIDE_MARGIN * 2;

  withCardShadow(ctx, () => {
    drawRoundedRect(ctx, heroX, heroY, heroW, HERO_H, 32);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
  });
  drawRoundedRect(ctx, heroX, heroY, heroW, HERO_H, 32);
  ctx.strokeStyle = hexToRgba(accent, 0.28);
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.save();
  drawRoundedRect(ctx, heroX, heroY, heroW, HERO_H, 32);
  ctx.clip();
  const glow = ctx.createRadialGradient(heroX + heroW - 60, heroY + 40, 10, heroX + heroW - 60, heroY + 40, 360);
  glow.addColorStop(0, hexToRgba(accent, 0.16));
  glow.addColorStop(1, hexToRgba(accent, 0));
  ctx.fillStyle = glow;
  ctx.fillRect(heroX, heroY, heroW, HERO_H);
  ctx.restore();

  const logo = await loadImage("/logo-techers.png");
  if (logo) {
    ctx.drawImage(logo, heroX + 40, heroY + 34, 44, 44);
  }
  ctx.fillStyle = INK;
  ctx.font = "700 28px 'Space Grotesk', sans-serif";
  ctx.fillText("TECHERS", heroX + 96, heroY + 64);

  const firstName = studentName.trim().split(/\s+/)[0] || "Você";
  ctx.fillStyle = SLATE;
  ctx.font = "600 18px 'JetBrains Mono', monospace";
  ctx.fillText(`🎯 PERFIL TECHERS DE ${firstName.toUpperCase()}`, heroX + 40, heroY + 128);

  ctx.fillStyle = "#8a8592";
  ctx.font = "500 17px 'Inter', sans-serif";
  ctx.fillText(`${studentName.trim()} · ${studentAge} anos`, heroX + 40, heroY + 154);

  ctx.fillStyle = "rgba(20,17,28,0.78)";
  ctx.font = "400 24px 'Inter', sans-serif";
  let cursorY = wrapText(ctx, synthesis, heroX + 40, heroY + 194, heroW - 80, 33, 3);

  if (primary) {
    const course = courses[primary.courseId];
    const labelY = Math.max(cursorY + 24, heroY + 260);

    ctx.fillStyle = SLATE;
    ctx.font = "600 16px 'JetBrains Mono', monospace";
    ctx.fillText(
      result.hybridCourses.length > 0 ? "CURSOS PRINCIPAIS PARA VOCÊ" : "CURSO PRINCIPAL PARA VOCÊ",
      heroX + 40,
      labelY
    );

    const badgeY = labelY + 26;
    const badgeSize = 84;
    drawIconBadge(ctx, heroX + 40, badgeY, badgeSize, 40, course.icon, course.accent);

    ctx.fillStyle = INK;
    ctx.font = "48px sans-serif";
    ctx.fillText("🥇", heroX + 40 + badgeSize + 20, badgeY + 38);
    const medalW = ctx.measureText("🥇").width;
    ctx.font = "700 40px 'Space Grotesk', sans-serif";
    ctx.fillText(course.name, heroX + 40 + badgeSize + 20 + medalW + 12, badgeY + 38);

    ctx.fillStyle = accent;
    ctx.font = "600 18px 'Inter', sans-serif";
    ctx.fillText("1º lugar no seu ranking de afinidade", heroX + 40 + badgeSize + 20, badgeY + 68);

    let pillsBottomY = badgeY + badgeSize;
    if (result.hybridCourses.length > 0) {
      const pillY = badgeY + badgeSize + 22;
      ctx.font = "500 17px 'Inter', sans-serif";
      ctx.fillStyle = SLATE;
      ctx.fillText("também com alta afinidade:", heroX + 40, pillY + 26);
      let pillX = heroX + 40 + ctx.measureText("também com alta afinidade:").width + 16;
      ctx.font = "600 17px 'Inter', sans-serif";
      for (const hc of result.hybridCourses) {
        const hcCourse = courses[hc.courseId];
        const label = `${hcCourse.icon} ${hcCourse.name}`;
        const w = ctx.measureText(label).width + 28;
        ctx.strokeStyle = hexToRgba(hcCourse.accent, 0.4);
        ctx.lineWidth = 1.5;
        drawRoundedRect(ctx, pillX, pillY, w, 38, 19);
        ctx.stroke();
        ctx.fillStyle = INK;
        ctx.fillText(label, pillX + 14, pillY + 25);
        pillX += w + 10;
      }
      pillsBottomY = pillY + 38;
    }

    const dividerY = pillsBottomY + 30;
    ctx.strokeStyle = LINE;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(heroX + 40, dividerY);
    ctx.lineTo(heroX + heroW - 40, dividerY);
    ctx.stroke();

    ctx.fillStyle = "rgba(20,17,28,0.68)";
    ctx.font = "400 20px 'Inter', sans-serif";
    wrapText(ctx, course.description, heroX + 40, dividerY + 38, heroW - 80, 27, 3);
  }

  // ranking
  let y = heroY + HERO_H + 64;
  ctx.fillStyle = INK;
  ctx.font = "700 32px 'Space Grotesk', sans-serif";
  ctx.fillText("Ordem de afinidade", SIDE_MARGIN, y);
  y += 54;

  for (let i = 0; i < sortedStatus.length; i++) {
    const s = sortedStatus[i];
    const course = courses[s.courseId];

    withCardShadow(ctx, () => {
      drawRoundedRect(ctx, SIDE_MARGIN, y, WIDTH - SIDE_MARGIN * 2, ROW_H, 20);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
    });

    ctx.save();
    drawRoundedRect(ctx, SIDE_MARGIN, y, WIDTH - SIDE_MARGIN * 2, ROW_H, 20);
    ctx.clip();
    ctx.fillStyle = course.accent;
    ctx.fillRect(SIDE_MARGIN, y, 6, ROW_H);
    ctx.restore();

    drawRoundedRect(ctx, SIDE_MARGIN, y, WIDTH - SIDE_MARGIN * 2, ROW_H, 20);
    ctx.strokeStyle = LINE;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    const rankMark = medals[i] ?? `${i + 1}º`;
    ctx.fillStyle = SLATE;
    ctx.font = medals[i] ? "30px sans-serif" : "600 24px 'JetBrains Mono', monospace";
    ctx.textBaseline = "middle";
    ctx.fillText(rankMark, SIDE_MARGIN + 34, y + ROW_H / 2, 56);
    ctx.textBaseline = "alphabetic";

    drawIconBadge(ctx, SIDE_MARGIN + 96, y + ROW_H / 2 - 26, 52, 26, course.icon, course.accent);

    ctx.fillStyle = INK;
    ctx.font = "600 26px 'Inter', sans-serif";
    ctx.fillText(course.name, SIDE_MARGIN + 168, y + ROW_H / 2 + 9);

    ctx.textAlign = "right";
    ctx.fillStyle = statusColor[s.status];
    ctx.font = "600 16px 'JetBrains Mono', monospace";
    ctx.fillText(statusLabel[s.status].toUpperCase(), WIDTH - SIDE_MARGIN - 28, y + ROW_H / 2 + 6);
    ctx.textAlign = "left";

    y += ROW_H + ROW_GAP;
  }

  if (hasComplementary) {
    const imCourse = courses[result.complementary.courseId];
    withCardShadow(ctx, () => {
      drawRoundedRect(ctx, SIDE_MARGIN, y, WIDTH - SIDE_MARGIN * 2, 140, 24);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
    });
    ctx.save();
    drawRoundedRect(ctx, SIDE_MARGIN, y, WIDTH - SIDE_MARGIN * 2, 140, 24);
    ctx.clip();
    ctx.fillStyle = imCourse.accent;
    ctx.fillRect(SIDE_MARGIN, y, 6, 140);
    ctx.restore();
    drawRoundedRect(ctx, SIDE_MARGIN, y, WIDTH - SIDE_MARGIN * 2, 140, 24);
    ctx.strokeStyle = LINE;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    drawIconBadge(ctx, SIDE_MARGIN + 32, y + 30, 56, 28, imCourse.icon, imCourse.accent);

    ctx.fillStyle = INK;
    ctx.font = "700 25px 'Space Grotesk', sans-serif";
    ctx.fillText(`Curso complementar: ${imCourse.name}`, SIDE_MARGIN + 108, y + 52);

    ctx.fillStyle = imCourse.accent;
    ctx.font = "600 19px 'Inter', sans-serif";
    const tierText = result.complementary.tier === "alta" ? "Alta indicação" : "Indicação moderada";
    ctx.fillText(tierText, SIDE_MARGIN + 108, y + 82);

    ctx.fillStyle = SLATE;
    ctx.font = "400 18px 'Inter', sans-serif";
    ctx.fillText("Pode complementar bem o desenvolvimento do aluno.", SIDE_MARGIN + 108, y + 112);

    y += 140 + 36;
  }

  ctx.textAlign = "center";
  ctx.fillStyle = SLATE;
  ctx.font = "500 18px 'Inter', sans-serif";
  ctx.fillText("TECHERS · Tecnologia para todos", WIDTH / 2, height - 40);
  ctx.textAlign = "left";

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Não foi possível gerar a imagem."))), "image/png");
  });
}
