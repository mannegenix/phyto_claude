"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line, OrbitControls } from "@react-three/drei";
import { useMemo, useRef, useState, useEffect } from "react";
import type { Group } from "three";

/**
 * Stylised 3D model of each product's quality-marker family, coloured with the
 * product tint; oxygen-type atoms take the blue splash. Illustrative only.
 */
/**
 * Converts any CSS colour (lab(), oklch(), color(display-p3 …), hex …) to an sRGB hex
 * string three.js understands, by painting one pixel and reading it back.
 * The wide-gamut theme layer makes browsers report token colours as lab()/oklch().
 */
function toHex(css: string, fallback: string, ctx: CanvasRenderingContext2D | null) {
  if (!css || !ctx) return fallback;
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = fallback;
  ctx.fillStyle = css;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

function useThemeColors() {
  const [c, setC] = useState({ a: "#2b8530", b: "#9bd866", line: "#a9c0b2", splash: "#0b7cf2" });
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const read = () => {
      const s = getComputedStyle(document.documentElement);
      setC({
        a: toHex(s.getPropertyValue("--accent").trim(), "#2b8530", ctx),
        b: toHex(s.getPropertyValue("--pop").trim(), "#9bd866", ctx),
        line: toHex(s.getPropertyValue("--on-band-muted").trim(), "#a9c0b2", ctx),
        splash: toHex(s.getPropertyValue("--splash").trim(), "#0b7cf2", ctx),
      });
    };
    read();
    // Re-read when the review theme switcher changes data-theme.
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);
  return c;
}

type V3 = [number, number, number];
type Structure = { atoms: V3[]; hetero: boolean[]; bonds: [number, number][] };

/** Builds a stylised skeleton from rings (polygons) and chains, merging shared corners. */
function build(
  rings: { c: [number, number]; n: number; r?: number; rot?: number }[],
  chains: [number, number][][] = [],
  heteroAt: [number, number][] = [],
): Structure {
  const atoms: V3[] = [];
  const bonds: [number, number][] = [];
  const key = new Map<string, number>();
  const add = (x: number, y: number) => {
    const k = `${Math.round(x * 20)}:${Math.round(y * 20)}`;
    const found = key.get(k);
    if (found !== undefined) return found;
    const z = Math.sin(x * 1.7) * 0.18 + Math.cos(y * 1.3) * 0.12;
    atoms.push([x, y, z]);
    key.set(k, atoms.length - 1);
    return atoms.length - 1;
  };
  const link = (a: number, b: number) => {
    if (a !== b && !bonds.some(([x, y]) => (x === a && y === b) || (x === b && y === a))) bonds.push([a, b]);
  };
  for (const { c, n, r = 0.62, rot = Math.PI / 2 } of rings) {
    const ids = Array.from({ length: n }, (_, i) => {
      const a = rot + (i / n) * Math.PI * 2;
      return add(c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r);
    });
    ids.forEach((id, i) => link(id, ids[(i + 1) % n]));
  }
  for (const chain of chains) {
    const ids = chain.map(([x, y]) => add(x, y));
    ids.slice(1).forEach((id, i) => link(ids[i], id));
  }
  const hetero = atoms.map(([x, y]) => heteroAt.some(([hx, hy]) => Math.hypot(hx - x, hy - y) < 0.12));
  // centre the structure
  const cx = atoms.reduce((t, a) => t + a[0], 0) / atoms.length;
  const cy = atoms.reduce((t, a) => t + a[1], 0) / atoms.length;
  return { atoms: atoms.map(([x, y, z]) => [x - cx, y - cy, z] as V3), hetero, bonds };
}

const H = 0.62 * Math.sqrt(3); // distance between centres of fused hexagons
const DX = H * Math.cos(Math.PI / 6);
const DY = H * 0.5;
/** Centres of k fused hexagons in a zigzag row (flat-top hexagons share an edge). */
const fused = (k: number, x0 = 0, y0 = 0) =>
  Array.from({ length: k }, (_, i) => ({ c: [x0 + i * DX, y0 + (i % 2) * DY] as [number, number], n: 6, rot: 0 }));
/** Vertex of a flat-top hexagon at `deg` degrees (0, 60, 120 …). */
const vx = (c: [number, number], deg: number): [number, number] => [
  c[0] + Math.cos((deg * Math.PI) / 180) * 0.62,
  c[1] + Math.sin((deg * Math.PI) / 180) * 0.62,
];

/**
 * Stylised models of each product's quality-marker family (illustrative, not exact
 * chemistry): HCA, curcuminoid, withanolide, boswellic acid, bakuchiol, bacoside.
 */
const STRUCTURES: Record<string, () => Structure> = {
  // small hydroxy-acid: branched chain with carboxyl groups
  garcinia: () =>
    build(
      [],
      [
        [[-1.6, 0], [-0.8, 0.45], [0, 0], [0.8, 0.45], [1.6, 0]],
        [[-0.8, 0.45], [-0.8, 1.35]],
        [[0, 0], [0, -0.95]],
        [[0.8, 0.45], [0.8, 1.35]],
        [[-1.6, 0], [-2.35, 0.45]],
        [[-1.6, 0], [-1.6, -0.9]],
        [[1.6, 0], [2.35, 0.45]],
        [[1.6, 0], [1.6, -0.9]],
        [[0, -0.95], [0.75, -1.4]],
      ],
      [[-0.8, 1.35], [0, -0.95], [0.8, 1.35], [-2.35, 0.45], [2.35, 0.45], [-1.6, -0.9], [1.6, -0.9]],
    ),
  // two aromatic rings joined by a seven-atom bridge
  curcumin: () => {
    const L: [number, number] = [-2.6, 0];
    const R: [number, number] = [2.6, 0];
    return build(
      [
        { c: L, n: 6, rot: 0 },
        { c: R, n: 6, rot: 0 },
      ],
      [
        [vx(L, 0), [-1.4, 0.35], [-0.7, 0], [0, 0.35], [0.7, 0], [1.4, 0.35], vx(R, 180)],
        [[-0.7, 0], [-0.7, -0.85]],
        [[0.7, 0], [0.7, -0.85]],
        [vx(L, 240), [-3.3, -1.2]],
        [vx(R, 300), [3.3, -1.2]],
        [vx(L, 120), [-3.3, 1.2]],
        [vx(R, 60), [3.3, 1.2]],
      ],
      [[-0.7, -0.85], [0.7, -0.85], [-3.3, -1.2], [3.3, -1.2], [-3.3, 1.2], [3.3, 1.2]],
    );
  },
  // steroid core of fused rings with a lactone ring on a short chain
  ashwagandha: () => {
    const rings = fused(4);
    const last = rings[3].c;
    const lac: [number, number] = [last[0] + 1.9, last[1] + 0.9];
    return build(
      [...rings, { c: lac, n: 6, rot: 0 }],
      [
        [vx(last, 0), [last[0] + 1.05, last[1] + 0.3], vx(lac, 180)],
        [vx(rings[0].c, 180), [-1.4, -0.3]],
        [vx(lac, 60), [lac[0] + 0.6, lac[1] + 1.0]],
      ],
      [[-1.4, -0.3], vx(lac, 300), [lac[0] + 0.6, lac[1] + 1.0]],
    );
  },
  // five fused six-rings (pentacyclic triterpene)
  boswellia: () => {
    const rings = fused(5);
    const first = rings[0].c;
    const end = rings[4].c;
    return build(
      rings,
      [
        [vx(first, 240), [first[0] - 0.5, first[1] - 1.35]],
        [vx(first, 180), [first[0] - 1.35, first[1]]],
        [vx(end, 0), [end[0] + 0.9, end[1] + 0.2]],
      ],
      [[first[0] - 0.5, first[1] - 1.35], [first[0] - 1.35, first[1]], [end[0] + 0.9, end[1] + 0.2]],
    );
  },
  // phenol ring with a long branched terpene tail
  bakuchiol: () =>
    build(
      [{ c: [-2.4, 0], n: 6 }],
      [
        [[-1.86, 0.31], [-1.1, 0.0], [-0.35, 0.4], [0.4, 0], [1.15, 0.4], [1.9, 0], [2.65, 0.4], [3.4, 0]],
        [[0.4, 0], [0.4, -0.85]],
        [[0.4, 0], [0.9, -0.75]],
        [[2.65, 0.4], [2.65, 1.25]],
        [[3.4, 0], [3.9, -0.6]],
        [[-2.94, -0.31], [-3.65, -0.7]],
      ],
      [[-3.65, -0.7]],
    ),
  // steroid-like aglycone with two sugar rings
  bacopa: () => {
    const rings = fused(3);
    const s1: [number, number] = [-2.0, -1.0];
    const s2: [number, number] = [-3.7, -0.2];
    return build(
      [...rings, { c: s1, n: 6, rot: 0 }, { c: s2, n: 6, rot: 0 }],
      [
        [vx(rings[0].c, 180), [-1.05, -0.25], vx(s1, 60)],
        [vx(s1, 180), [-2.95, -0.75], vx(s2, 0)],
        [vx(rings[2].c, 0), [rings[2].c[0] + 1.0, rings[2].c[1] + 0.3]],
      ],
      [[-1.05, -0.25], [-2.95, -0.75], vx(s1, 300), vx(s2, 120), [rings[2].c[0] + 1.0, rings[2].c[1] + 0.3]],
    );
  },
};

function Molecule({ variant, tint }: { variant: string; tint?: string }) {
  const group = useRef<Group>(null);
  const colors = useThemeColors();
  const { atoms, hetero, bonds } = useMemo(() => (STRUCTURES[variant] ?? STRUCTURES.garcinia)(), [variant]);
  const span = Math.max(...atoms.map(([x, y]) => Math.max(Math.abs(x), Math.abs(y)))) || 1;
  const scale = 2.9 / span;

  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.25;
  });

  return (
    <group ref={group} scale={scale}>
      {bonds.map(([i, j]) => (
        <Line
          key={`${variant}-${i}-${j}`}
          points={[atoms[i], atoms[j]]}
          color={colors.line}
          lineWidth={2.2}
          transparent
          opacity={0.75}
        />
      ))}
      {atoms.map((p, i) => (
        <mesh key={`${variant}-${i}`} position={p}>
          <sphereGeometry args={[hetero[i] ? 0.2 : 0.17, 48, 48]} />
          <meshStandardMaterial
            color={hetero[i] ? colors.splash : (tint ?? colors.a)}
            roughness={0.32}
            metalness={0.08}
            emissive={hetero[i] ? colors.splash : "#000000"}
            emissiveIntensity={hetero[i] ? 0.25 : 0}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function MoleculeScene({ variant = "garcinia", tint }: { variant?: string; tint?: string }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 45 }}
      dpr={[1, 3]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 5]} intensity={1.4} />
      <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.6}>
        <Molecule variant={variant} tint={tint} />
      </Float>
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}
