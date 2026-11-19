/**
 * Line icons for the "How we work" steps (from dev1.phytoelements.in/operations): stroked
 * in the label colour, with one accent stroke ("op-accent") in the pop colour.
 */
export type OpIconKind = "spec" | "producers" | "screening" | "testing" | "release" | "packing" | "fulfilment";

type P = [d: string, cls?: string];
const ICONS: Record<OpIconKind, P[]> = {
  spec: [
    ["M26 10 H80 L96 26 V110 H26 Z M80 10 V26 H96"],
    ["M36 32 H70 M36 42 H62"],
    ["M36 54 H86 M36 64 H86 M36 74 H86 M36 84 H86 M60 54 V84"],
    ["M36 96 v10 M39 96 v10 M43 96 v10 M45 96 v10 M49 96 v10 M52 96 v10"],
    ["M69 96 a11 11 0 1 0 22 0 a11 11 0 1 0 -22 0 M75 96 l4 4 l7 -7", "op-accent"],
  ],
  producers: [
    ["M24 38 C18 30 16 26 16 22 a8 8 0 1 1 16 0 C32 26 30 30 24 38 Z M96 34 C90 26 88 22 88 18 a8 8 0 1 1 16 0 C104 22 102 26 96 34 Z M22 96 C16 88 14 84 14 80 a8 8 0 1 1 16 0 C30 84 28 88 22 96 Z"],
    ["M30 40 L54 60 M90 36 L74 56 M30 92 L52 80", "op-dash"],
    ["M50 70 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0 M57 70 l5 5 l9 -9", "op-accent"],
  ],
  screening: [
    ["M24 106 H92 M32 106 C32 99 37 96 44 96 H78"],
    ["M70 96 C88 84 88 50 68 38"],
    ["M46 20 L58 10 L82 40 L70 50 Z M40 14 L52 4"],
    ["M68 50 L62 60"],
    ["M40 66 H86"],
    ["M50 63 H70", "op-accent"],
    ["M73 76 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0"],
  ],
  testing: [
    ["M10 58 H110 M10 66 H110 M16 66 V104 M104 66 V104 M10 104 H110"],
    ["M24 30 V88 a6 6 0 0 0 12 0 V30 M22 30 H38 M44 30 V88 a6 6 0 0 0 12 0 V30 M42 30 H58 M84 30 V88 a6 6 0 0 0 12 0 V30 M82 30 H98"],
    ["M64 30 V88 a6 6 0 0 0 12 0 V30 M62 30 H78"],
    ["M24 70 H36 M44 62 H56 M84 66 H96"],
    ["M64 76 H76", "op-accent"],
    ["M62 18 l5 5 l10 -10", "op-accent"],
  ],
  release: [
    ["M30 52 a30 30 0 1 0 60 0 a30 30 0 1 0 -60 0"],
    ["M38 52 a22 22 0 1 0 44 0 a22 22 0 1 0 -44 0 M49 52 l7 7 l15 -15", "op-accent"],
    ["M44 77 L36 108 L48 102 L54 112 L58 82 M76 77 L84 108 L72 102 L66 112 L62 82"],
  ],
  packing: [
    ["M14 32 a18 5 0 1 0 36 0 a18 5 0 1 0 -36 0 M14 32 V86 a18 5 0 0 0 36 0 V32 M14 46 a18 5 0 0 0 36 0 M14 74 a18 5 0 0 0 36 0"],
    ["M62 32 a18 5 0 1 0 36 0 a18 5 0 1 0 -36 0 M62 32 V86 a18 5 0 0 0 36 0 V32 M62 46 a18 5 0 0 0 36 0 M62 74 a18 5 0 0 0 36 0"],
    ["M22 52 h20 v14 h-20 z M26 58 h12", "op-accent"],
    ["M70 52 h20 v14 h-20 z M74 58 h12"],
    ["M8 92 H106 M8 100 H106 M8 108 H106 M12 92 V108 M57 92 V108 M102 92 V108"],
  ],
  fulfilment: [
    ["M10 70 H74 V104 H10 Z"],
    ["M18 70 V104 M26 70 V104 M34 70 V104 M42 70 V104 M50 70 V104 M58 70 V104 M66 70 V104"],
    ["M44 62 C52 22 88 14 102 36", "op-accent op-dash"],
    ["M104 46 C98 38 96 34 96 30 a8 8 0 1 1 16 0 C112 34 110 38 104 46 Z", "op-accent"],
    ["M6 110 H114"],
  ],
};

export function OpIcon({ kind, className = "op-icon" }: { kind: OpIconKind; className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true" focusable="false">
      {ICONS[kind].map(([d, cls], i) => (
        <path key={i} d={d} className={cls} />
      ))}
    </svg>
  );
}
