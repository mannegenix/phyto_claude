/**
 * Procedural stand-in for the scroll video until real footage is extracted.
 * Draws the five stages (botanical → extraction → standardization → testing → packed batch),
 * cross-fading between them as progress (0–1) advances. Colours come from theme tokens.
 */
function token(name: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

const ease = (t: number) => t * t * (3 - 2 * t);

export function drawPlaceholder(ctx: CanvasRenderingContext2D, W: number, H: number, p: number, stageCount: number) {
  const accent = token("--accent", "#2b8530");
  const pop = token("--pop", "#2e7d32");
  const fg = token("--on-band", "#eef4ea");
  const muted = token("--on-band-muted", "#a9c0b2");
  const bg = token("--band-2", "#0a2f24");

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Lab-sheet grid.
  ctx.save();
  ctx.globalAlpha = 0.1;
  ctx.strokeStyle = muted;
  ctx.lineWidth = 1;
  const step = Math.max(W, H) / 18;
  for (let x = 0; x < W; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y < H; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  ctx.restore();

  const s = Math.min(W, H);
  const cx = W / 2;
  const cy = H * 0.46;
  const pos = p * stageCount;
  const stage = Math.min(stageCount - 1, Math.floor(pos));
  const local = pos - stage;

  const scenes = [drawLeaf, drawFlask, drawGauge, drawCoa, drawDrum];
  const draw = (i: number, alpha: number, t: number) => {
    if (alpha <= 0 || !scenes[i]) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    scenes[i](ctx, cx, cy, s, t, { accent, pop, fg, muted });
    ctx.restore();
  };

  // Cross-fade in the last 25% of each stage.
  const fade = ease(Math.max(0, (local - 0.75) / 0.25));
  draw(stage, 1 - fade, local);
  if (stage + 1 < stageCount) draw(stage + 1, fade, 0);

  // Caption.
  ctx.fillStyle = muted;
  ctx.font = `${Math.round(s * 0.028)}px "JetBrains Mono Variable", monospace`;
  ctx.textAlign = "left";
  ctx.fillText(`STAGE ${String(stage + 1).padStart(2, "0")} · PLACEHOLDER ANIMATION`, s * 0.05, s * 0.07);
}

type Palette = { accent: string; pop: string; fg: string; muted: string };
type Scene = (ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number, t: number, c: Palette) => void;

const drawLeaf: Scene = (ctx, cx, cy, s, t, c) => {
  const grow = 0.6 + 0.4 * ease(Math.min(1, t * 1.5));
  const L = s * 0.32 * grow;
  ctx.translate(cx, cy + L * 0.4);
  ctx.rotate(-0.6);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(-L * 0.55, -L * 0.5, 0, -L);
  ctx.quadraticCurveTo(L * 0.55, -L * 0.5, 0, 0);
  ctx.fillStyle = c.accent;
  ctx.fill();
  ctx.strokeStyle = c.fg;
  ctx.globalAlpha *= 0.6;
  ctx.lineWidth = s * 0.006;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -L * 0.92);
  for (let i = 1; i <= 4; i += 1) {
    const y = (-L * i) / 5;
    ctx.moveTo(0, y);
    ctx.lineTo(-L * 0.18, y - L * 0.12);
    ctx.moveTo(0, y);
    ctx.lineTo(L * 0.18, y - L * 0.12);
  }
  ctx.stroke();
};

const drawFlask: Scene = (ctx, cx, cy, s, t, c) => {
  const w = s * 0.34;
  const h = s * 0.4;
  ctx.translate(cx, cy);
  ctx.beginPath();
  ctx.moveTo(-w * 0.12, -h * 0.5);
  ctx.lineTo(-w * 0.12, -h * 0.1);
  ctx.lineTo(-w * 0.5, h * 0.5);
  ctx.lineTo(w * 0.5, h * 0.5);
  ctx.lineTo(w * 0.12, -h * 0.1);
  ctx.lineTo(w * 0.12, -h * 0.5);
  ctx.strokeStyle = c.fg;
  ctx.lineWidth = s * 0.008;
  ctx.stroke();
  ctx.save();
  ctx.clip();
  const level = h * 0.5 - h * 0.75 * ease(Math.min(1, t * 1.4));
  ctx.fillStyle = c.pop;
  ctx.fillRect(-w, level, w * 2, h);
  ctx.restore();
  // Bubbles.
  ctx.fillStyle = c.fg;
  for (let i = 0; i < 6; i += 1) {
    const by = h * 0.45 - ((t * 1.8 + i / 6) % 1) * h * 0.6;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(Math.sin(i * 2.1) * w * 0.18, by, s * 0.008, 0, Math.PI * 2);
    ctx.fill();
  }
};

const drawGauge: Scene = (ctx, cx, cy, s, t, c) => {
  const n = 7;
  const bw = s * 0.045;
  const gap = s * 0.02;
  const total = n * bw + (n - 1) * gap;
  const target = s * 0.22;
  ctx.translate(cx - total / 2, cy + s * 0.15);
  for (let i = 0; i < n; i += 1) {
    const start = s * (0.08 + 0.18 * Math.abs(Math.sin(i * 1.7)));
    const hgt = start + (target - start) * ease(Math.min(1, t * 1.3));
    ctx.fillStyle = c.accent;
    ctx.fillRect(i * (bw + gap), -hgt, bw, hgt);
  }
  ctx.strokeStyle = c.pop;
  ctx.setLineDash([s * 0.015, s * 0.012]);
  ctx.lineWidth = s * 0.005;
  ctx.beginPath();
  ctx.moveTo(-s * 0.03, -target);
  ctx.lineTo(total + s * 0.03, -target);
  ctx.stroke();
};

const drawCoa: Scene = (ctx, cx, cy, s, t, c) => {
  const w = s * 0.34;
  const h = s * 0.44;
  ctx.translate(cx - w / 2, cy - h / 2);
  ctx.fillStyle = c.fg;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = c.muted;
  ctx.font = `600 ${Math.round(s * 0.03)}px "JetBrains Mono Variable", monospace`;
  ctx.fillText("CERTIFICATE OF ANALYSIS", w * 0.08, h * 0.12);
  const rows = 5;
  for (let i = 0; i < rows; i += 1) {
    const y = h * (0.26 + i * 0.14);
    ctx.fillStyle = c.muted;
    ctx.globalAlpha = 0.5;
    ctx.fillRect(w * 0.08, y - s * 0.006, w * 0.56, s * 0.012);
    ctx.globalAlpha = 1;
    if (t * rows * 1.3 > i) {
      ctx.strokeStyle = c.accent;
      ctx.lineWidth = s * 0.008;
      ctx.beginPath();
      ctx.moveTo(w * 0.76, y);
      ctx.lineTo(w * 0.81, y + s * 0.018);
      ctx.lineTo(w * 0.9, y - s * 0.02);
      ctx.stroke();
    }
  }
};

const drawDrum: Scene = (ctx, cx, cy, s, t, c) => {
  const w = s * 0.3;
  const h = s * 0.38;
  const lift = (1 - ease(Math.min(1, t * 1.5))) * s * 0.08;
  ctx.translate(cx, cy + lift);
  ctx.fillStyle = c.accent;
  ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.beginPath();
  ctx.ellipse(0, -h / 2, w / 2, w * 0.12, 0, 0, Math.PI * 2);
  ctx.fillStyle = c.pop;
  ctx.fill();
  ctx.strokeStyle = c.fg;
  ctx.globalAlpha *= 0.5;
  ctx.lineWidth = s * 0.006;
  [-0.18, 0.18].forEach((k) => {
    ctx.beginPath();
    ctx.moveTo(-w / 2, h * k);
    ctx.lineTo(w / 2, h * k);
    ctx.stroke();
  });
  ctx.globalAlpha = 1;
  ctx.fillStyle = c.fg;
  ctx.fillRect(-w * 0.32, -h * 0.1, w * 0.64, h * 0.2);
  ctx.fillStyle = c.muted;
  ctx.font = `${Math.round(s * 0.022)}px "JetBrains Mono Variable", monospace`;
  ctx.textAlign = "center";
  ctx.fillText("BATCH · COA", 0, h * 0.01 + s * 0.008);
};
