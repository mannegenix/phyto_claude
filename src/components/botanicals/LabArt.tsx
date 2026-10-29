/**
 * Line drawings that hint at the work behind the copy: testing, quality control,
 * documentation and logistics. Drawn in the current text colour; the one detail that
 * marks "tested" (a peak, a seal, a check) takes the blue splash.
 *
 * Used two ways: as small icons beside a step (`<LabArt kind="vials" />`) and as a
 * faint drawing behind a section (`<LabArt kind="coa" backdrop pos="br" />`, the
 * section needs `labart-host`). Purely decorative, always aria-hidden.
 */
import type { ArtKind } from "@/content/types";

export type LabArtKind = ArtKind;

type P = { d: string; a?: boolean; dash?: boolean };

const pin = (x: number, y: number) =>
  `M${x} ${y + 12} C${x - 6} ${y + 4} ${x - 8} ${y} ${x - 8} ${y - 4} a8 8 0 1 1 16 0 C${x + 8} ${y} ${x + 6} ${y + 4} ${x} ${y + 12} Z`;
const ring = (cx: number, cy: number, r: number, ry = r) =>
  `M${cx - r} ${cy} a${r} ${ry} 0 1 0 ${r * 2} 0 a${r} ${ry} 0 1 0 ${-r * 2} 0`;
const tube = (x: number) => `M${x} 30 V88 a6 6 0 0 0 12 0 V30 M${x - 2} 30 H${x + 14}`;
const drum = (x: number) =>
  `M${x} 32 V86 a18 5 0 0 0 36 0 V32 M${x} 46 a18 5 0 0 0 36 0 M${x} 74 a18 5 0 0 0 36 0`;

const ART: Record<LabArtKind, P[]> = {
  chromatogram: [
    { d: "M14 16 V102 H108" },
    { d: "M14 102 v4 M38 102 v4 M62 102 v4 M86 102 v4" },
    {
      d: "M16 98 C24 98 26 96 30 92 C32 88 33 80 35 80 C37 80 38 92 41 96 C46 99 48 98 52 97 C55 95 56 30 60 26 C64 30 65 95 68 97 C72 99 76 98 80 94 C83 88 84 70 86 70 C88 70 89 90 92 95 C96 98 100 98 106 98",
    },
    { d: "M60 20 V10 M54 10 H66", a: true },
    { d: "M14 44 H108", dash: true },
  ],
  vials: [
    { d: "M10 58 H110 M10 66 H110 M16 66 V104 M104 66 V104 M10 104 H110" },
    { d: `${tube(24)} ${tube(44)} ${tube(84)}` },
    { d: tube(64) },
    { d: "M24 70 H36 M44 62 H56 M84 66 H96" },
    { d: "M64 76 H76", a: true },
    { d: "M62 18 l5 5 l10 -10", a: true },
  ],
  coa: [
    { d: "M26 10 H80 L96 26 V110 H26 Z M80 10 V26 H96" },
    { d: "M36 32 H70 M36 42 H62" },
    { d: "M36 54 H86 M36 64 H86 M36 74 H86 M36 84 H86 M60 54 V84" },
    { d: "M36 96 v10 M39 96 v10 M43 96 v10 M45 96 v10 M49 96 v10 M52 96 v10" },
    { d: `${ring(80, 96, 11)} M75 96 l4 4 l7 -7`, a: true },
  ],
  drums: [
    { d: `${ring(32, 32, 18, 5)} ${drum(14)}` },
    { d: `${ring(80, 32, 18, 5)} ${drum(62)}` },
    { d: "M22 52 h20 v14 h-20 z M26 58 h12", a: true },
    { d: "M70 52 h20 v14 h-20 z M74 58 h12" },
    { d: "M8 92 H106 M8 100 H106 M8 108 H106 M12 92 V108 M57 92 V108 M102 92 V108" },
  ],
  shipping: [
    { d: "M10 70 H74 V104 H10 Z" },
    { d: "M18 70 V104 M26 70 V104 M34 70 V104 M42 70 V104 M50 70 V104 M58 70 V104 M66 70 V104" },
    { d: "M44 62 C52 22 88 14 102 36", a: true, dash: true },
    { d: pin(104, 34), a: true },
    { d: "M6 110 H114" },
  ],
  microscope: [
    { d: "M24 106 H92 M32 106 C32 99 37 96 44 96 H78" },
    { d: "M70 96 C88 84 88 50 68 38" },
    { d: "M46 20 L58 10 L82 40 L70 50 Z M40 14 L52 4" },
    { d: "M68 50 L62 60" },
    { d: "M40 66 H86" },
    { d: "M50 63 H70", a: true },
    { d: ring(78, 76, 5) },
  ],
  petri: [
    { d: `${ring(60, 72, 46, 16)} M14 72 v10 a46 16 0 0 0 92 0 v-10` },
    { d: ring(60, 70, 36, 11) },
    { d: `${ring(44, 68, 3, 2)} ${ring(64, 74, 2.5, 1.6)} ${ring(76, 66, 2, 1.4)} ${ring(54, 63, 1.6, 1.1)}` },
    { d: "M60 10 L80 18 V32 C80 42 70 48 60 52 C50 48 40 42 40 32 V18 Z M52 31 l5 5 l10 -10", a: true },
  ],
  magnifier: [
    { d: "M16 100 C16 64 40 32 80 24 C78 62 54 94 16 100 Z" },
    { d: "M16 100 C36 80 54 58 80 24 M34 82 L32 68 M46 70 L60 66 M50 62 L46 48" },
    { d: `${ring(72, 72, 20)} M86 86 L106 106`, a: true },
  ],
  filter: [
    { d: "M18 22 H102 L68 64 V96 L52 104 V64 Z" },
    { d: "M28 32 H92" },
    { d: "M40 26 h0.1 M52 27 h0.1 M66 25 h0.1 M80 27 h0.1 M46 31 h0.1 M74 31 h0.1" },
    { d: "M60 104 c-3 4 -4 8 0 9 c4 -1 3 -5 0 -9", a: true },
  ],
  sourcing: [
    { d: `${pin(24, 26)} ${pin(96, 22)} ${pin(22, 84)}` },
    { d: "M30 40 L54 60 M90 36 L74 56 M30 92 L52 80", dash: true },
    { d: `${ring(64, 70, 14)} M57 70 l5 5 l9 -9`, a: true },
  ],
  seal: [
    { d: `${ring(60, 52, 30)}` },
    { d: `${ring(60, 52, 22)} M49 52 l7 7 l15 -15`, a: true },
    { d: "M44 77 L36 108 L48 102 L54 112 L58 82 M76 77 L84 108 L72 102 L66 112 L62 82" },
  ],
  hourglass: [
    { d: "M36 12 H84 M36 108 H84" },
    {
      d: "M42 12 C42 44 56 52 56 60 C56 68 42 76 42 108 M78 12 C78 44 64 52 64 60 C64 68 78 76 78 108",
    },
    { d: "M50 102 C54 92 66 92 70 102 Z M58 40 H62", a: true },
  ],
};

export function LabArt({
  kind,
  className = "",
  backdrop = false,
  pos = "br",
  draw = backdrop,
}: {
  kind: LabArtKind;
  className?: string;
  backdrop?: boolean;
  /** Backdrop placement: bottom-right, top-right, bottom-left, top-left, middle-right. */
  pos?: "br" | "tr" | "bl" | "tl" | "r";
  draw?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={`labart ${backdrop ? `labart-bg labart-${pos}` : ""} ${draw ? "labart-draw" : ""} ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      {ART[kind].map((p, i) => (
        <path
          key={i}
          d={p.d}
          pathLength={p.dash ? undefined : 1}
          className={`${p.a ? "la-a" : ""} ${p.dash ? "la-dash" : ""}`}
        />
      ))}
    </svg>
  );
}
