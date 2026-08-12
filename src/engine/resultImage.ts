import { courses } from "../config/courses";
import type { RecommendationResult } from "../types";

/**
 * Gera, inteiramente no navegador (Canvas 2D, sem serviço externo), uma
 * imagem PNG com o resultado do diagnóstico — pensada para o aluno/
 * responsável salvar ou compartilhar. Nenhum dado sai do dispositivo do
 * usuário: a imagem é composta localmente e baixada diretamente.
 */

interface GenerateResultImageParams {
  studentName: string;
  studentAge: number;
  synthesis: string;
  result: RecommendationResult;
}

const WIDTH = 1080;
const HERO_H = 660;
const TOP_MARGIN = 48;
const SIDE_MARGIN = 48;
const ROW_H = 112;
const ROW_GAP = 16;

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

  const rankingHeaderH = 96;
  const rankingH = sortedStatus.length * (ROW_H + ROW_GAP);
  const complementaryH = hasComplementary ? 176 : 0;
  const footerH = 90;
  const height = TOP_MARGIN + HERO_H + 64 + rankingHeaderH + rankingH + complementaryH + footerH;

  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  // fundo
  ctx.fillStyle = "#faf9f7";
  ctx.fillRect(0, 0, WIDTH, height);

  const primary = result.primaryCourse;
  const accent = primary ? courses[primary.courseId].accent : "#6d28d9";
  const heroX = SIDE_MARGIN;
  const heroY = TOP_MARGIN;
  const heroW = WIDTH - SIDE_MARGIN * 2;

  // painel escuro (hero)
  drawRoundedRect(ctx, heroX, heroY, heroW, HERO_H, 32);
  ctx.fillStyle = "#14111c";
  ctx.fill();

  ctx.save();
  drawRoundedRect(ctx, heroX, heroY, heroW, HERO_H, 32);
  ctx.clip();
  const glow = ctx.createRadialGradient(heroX + heroW - 80, heroY + 80, 10, heroX + heroW - 80, heroY + 80, 420);
  glow.addColorStop(0, hexToRgba(accent, 0.35));
  glow.addColorStop(1, hexToRgba(accent, 0));
  ctx.fillStyle = glow;
  ctx.fillRect(heroX, heroY, heroW, HERO_H);
  ctx.restore();

  const logo = await loadImage("/logo-techers.png");
  if (logo) {
    ctx.drawImage(logo, heroX + 40, heroY + 34, 56, 56);
  }
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 32px 'Space Grotesk', sans-serif";
  ctx.fillText("TECH", heroX + 108, heroY + 70);
  const techW = ctx.measureText("TECH").width;
  ctx.fillStyle = "#8b5cf6";
  ctx.fillText("ERS", heroX + 108 + techW, heroY + 70);

  const firstName = studentName.trim().split(/\s+/)[0] || "Você";
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = "600 19px 'JetBrains Mono', monospace";
  ctx.fillText(`PERFIL TECHERS DE ${firstName.toUpperCase()}`, heroX + 40, heroY + 140);

  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.font = "500 18px 'Inter', sans-serif";
  ctx.fillText(`${studentName.trim()} · ${studentAge} anos`, heroX + 40, heroY + 168);

  ctx.fillStyle = "rgba(255,255,255,0.78)";
  ctx.font = "400 25px 'Inter', sans-serif";
  wrapText(ctx, synthesis, heroX + 40, heroY + 210, heroW - 80, 34, 3);

  if (primary) {
    const course = courses[primary.courseId];

    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.font = "600 17px 'JetBrains Mono', monospace";
    ctx.fillText(result.hybridCourses.length > 0 ? "MELHORES CURSOS PARA COMEÇAR" : "MELHOR CURSO PARA COMEÇAR", heroX + 40, heroY + 328);

    ctx.font = "56px sans-serif";
    ctx.fillText(course.icon, heroX + 40, heroY + 386);
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 46px 'Space Grotesk', sans-serif";
    ctx.fillText(course.name, heroX + 130, heroY + 376);

    ctx.textAlign = "right";
    ctx.fillStyle = accent;
    ctx.font = "700 58px 'JetBrains Mono', monospace";
    ctx.fillText(`${primary.score}%`, heroX + heroW - 40, heroY + 363);
    ctx.font = "500 18px 'Inter', sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fillText("de afinidade", heroX + heroW - 40, heroY + 390);
    ctx.textAlign = "left";

    const barCount = 10;
    const barW = 18;
    const gap = 8;
    const barsX = heroX + 40;
    const barsBaseY = heroY + 428;
    const lit = Math.round((primary.score / 100) * barCount);
    for (let i = 0; i < barCount; i++) {
      const bh = 18 + i * 7;
      ctx.fillStyle = i < lit ? accent : "rgba(255,255,255,0.15)";
      drawRoundedRect(ctx, barsX + i * (barW + gap), barsBaseY - bh, barW, bh, 4);
      ctx.fill();
    }

    let pillY = heroY + 468;
    if (result.hybridCourses.length > 0) {
      let pillX = heroX + 40;
      ctx.font = "600 18px 'Inter', sans-serif";
      for (const hc of result.hybridCourses) {
        const hcCourse = courses[hc.courseId];
        const label = `${hcCourse.icon} ${hcCourse.name} · ${hc.score}%`;
        const w = ctx.measureText(label).width + 32;
        ctx.strokeStyle = "rgba(255,255,255,0.25)";
        ctx.lineWidth = 1.5;
        drawRoundedRect(ctx, pillX, pillY, w, 40, 20);
        ctx.stroke();
        ctx.fillStyle = "#ffffff";
        ctx.fillText(label, pillX + 16, pillY + 26);
        pillX += w + 12;
      }
    }

    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.beginPath();
    ctx.moveTo(heroX + 40, heroY + 528);
    ctx.lineTo(heroX + heroW - 40, heroY + 528);
    ctx.stroke();

    ctx.fillStyle = "rgba(255,255,255,0.72)";
    ctx.font = "400 21px 'Inter', sans-serif";
    wrapText(ctx, course.description, heroX + 40, heroY + 568, heroW - 80, 28, 3);
  }

  // ranking
  let y = heroY + HERO_H + 64;
  ctx.fillStyle = "#14111c";
  ctx.font = "700 34px 'Space Grotesk', sans-serif";
  ctx.fillText("Ranking de afinidade", SIDE_MARGIN, y);
  y += 56;

  for (let i = 0; i < sortedStatus.length; i++) {
    const s = sortedStatus[i];
    const course = courses[s.courseId];
    drawRoundedRect(ctx, SIDE_MARGIN, y, WIDTH - SIDE_MARGIN * 2, ROW_H, 20);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.strokeStyle = "#e4dfe6";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = "#6b6674";
    ctx.font = "600 20px 'JetBrains Mono', monospace";
    ctx.fillText(`${i + 1}º`, SIDE_MARGIN + 24, y + 46);

    ctx.font = "36px sans-serif";
    ctx.fillText(course.icon, SIDE_MARGIN + 68, y + 52);

    ctx.fillStyle = "#14111c";
    ctx.font = "600 24px 'Inter', sans-serif";
    ctx.fillText(course.name, SIDE_MARGIN + 128, y + 40);

    ctx.textAlign = "right";
    ctx.font = "700 26px 'JetBrains Mono', monospace";
    ctx.fillText(`${s.affinity}%`, WIDTH - SIDE_MARGIN - 24, y + 40);
    ctx.textAlign = "left";

    const barX = SIDE_MARGIN + 128;
    const barY = y + 58;
    const barW = WIDTH - SIDE_MARGIN * 2 - 128 - 230;
    drawRoundedRect(ctx, barX, barY, barW, 10, 5);
    ctx.fillStyle = "#f1eef2";
    ctx.fill();
    drawRoundedRect(ctx, barX, barY, barW * (s.affinity / 100), 10, 5);
    ctx.fillStyle = course.accent;
    ctx.fill();

    ctx.fillStyle = statusColor[s.status];
    ctx.font = "600 15px 'JetBrains Mono', monospace";
    ctx.fillText(statusLabel[s.status].toUpperCase(), barX + barW + 20, y + 66);

    y += ROW_H + ROW_GAP;
  }

  if (hasComplementary) {
    const imCourse = courses[result.complementary.courseId];
    drawRoundedRect(ctx, SIDE_MARGIN, y, WIDTH - SIDE_MARGIN * 2, 140, 24);
    ctx.fillStyle = "#f1eef2";
    ctx.fill();

    ctx.font = "40px sans-serif";
    ctx.fillText(imCourse.icon, SIDE_MARGIN + 32, y + 60);

    ctx.fillStyle = "#14111c";
    ctx.font = "700 26px 'Space Grotesk', sans-serif";
    ctx.fillText(`Curso complementar: ${imCourse.name}`, SIDE_MARGIN + 96, y + 52);

    ctx.fillStyle = imCourse.accent;
    ctx.font = "600 20px 'Inter', sans-serif";
    const tierText = result.complementary.tier === "alta" ? "Alta indicação" : "Indicação moderada";
    ctx.fillText(`${tierText} · ${result.complementary.score}%`, SIDE_MARGIN + 96, y + 86);

    ctx.fillStyle = "#4a4552";
    ctx.font = "400 19px 'Inter', sans-serif";
    ctx.fillText("Pode complementar bem o desenvolvimento do aluno.", SIDE_MARGIN + 96, y + 116);

    y += 140 + 36;
  }

  ctx.textAlign = "center";
  ctx.fillStyle = "#6b6674";
  ctx.font = "500 19px 'Inter', sans-serif";
  ctx.fillText("TECHERS · Tecnologia para todos", WIDTH / 2, height - 40);
  ctx.textAlign = "left";

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Não foi possível gerar a imagem."))), "image/png");
  });
}
