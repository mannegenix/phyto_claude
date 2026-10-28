#!/usr/bin/env node
/**
 * Turns a video into a scroll-scrubbable image sequence for <ScrollVideo>.
 *
 * Usage:
 *   npm run frames -- path/to/video.mp4 process [--fps 24] [--width 1920] [--quality 72]
 *
 * Output: public/sequences/<name>/frame_0001.webp … + manifest.json
 * Requires ffmpeg on your PATH (macOS: `brew install ffmpeg`).
 *
 * Guidance: keep clips 5–15 s. Default 1920 px wide (sharp on Retina laptops).
 * For 4K displays use --width 2560 (≈2× the file size). At 24 fps and 1920 px,
 * WebP frames are typically 80–160 KB each, so a 10 s clip is roughly 20–40 MB.
 * Lower --fps (e.g. 15) for lighter pages.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const args = process.argv.slice(2);
const [input, name] = args;
const opt = (flag, fallback) => {
  const i = args.indexOf(flag);
  return i > -1 ? args[i + 1] : fallback;
};

if (!input || !name) {
  console.error("Usage: npm run frames -- <video.mp4> <sequence-name> [--fps 24] [--width 1920] [--quality 72]");
  process.exit(1);
}

const fps = Number(opt("--fps", 24));
const width = Number(opt("--width", 1920));
const quality = Number(opt("--quality", 72));
const outDir = resolve("public/sequences", name);

try {
  execFileSync("ffmpeg", ["-version"], { stdio: "ignore" });
} catch {
  console.error("ffmpeg not found. Install it first (macOS: brew install ffmpeg).");
  process.exit(1);
}

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

console.log(`Extracting ${input} → ${outDir} at ${fps} fps, ${width}px, WebP q${quality}…`);
execFileSync(
  "ffmpeg",
  [
    "-loglevel",
    "error",
    "-i",
    input,
    "-vf",
    `fps=${fps},scale=${width}:-2:flags=lanczos`,
    "-c:v",
    "libwebp",
    "-quality",
    String(quality),
    join(outDir, "frame_%04d.webp"),
  ],
  { stdio: "inherit" },
);

const frames = readdirSync(outDir).filter((f) => f.endsWith(".webp")).length;
const probe = execFileSync("ffprobe", [
  "-v",
  "error",
  "-select_streams",
  "v:0",
  "-show_entries",
  "stream=width,height",
  "-of",
  "csv=p=0",
  join(outDir, "frame_0001.webp"),
])
  .toString()
  .trim();
const [w, h] = probe.split(",").map(Number);

writeFileSync(
  join(outDir, "manifest.json"),
  JSON.stringify({ frames, width: w, height: h, pattern: "frame_%04d.webp", fps }, null, 2),
);
console.log(`Done: ${frames} frames (${w}×${h}). <ScrollVideo sequence="${name}" /> will pick them up automatically.`);
