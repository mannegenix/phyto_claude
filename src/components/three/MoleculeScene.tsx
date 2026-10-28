"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line, OrbitControls } from "@react-three/drei";
import { useMemo, useRef, useState, useEffect } from "react";
import type { Group } from "three";

/**
 * Abstract "active compound" molecule: placeholder 3D content for the flagship
 * section. Replace with a real model later (e.g. useGLTF("/models/garcinia.glb")).
 * Colours are read from the active theme's tokens.
 */
function useThemeColors() {
  const [c, setC] = useState({ a: "#2b8530", b: "#9bd866", line: "#a9c0b2" });
  useEffect(() => {
    const read = () => {
      const s = getComputedStyle(document.documentElement);
      setC({
        a: s.getPropertyValue("--accent").trim() || "#2b8530",
        b: s.getPropertyValue("--pop").trim() || "#9bd866",
        line: s.getPropertyValue("--on-band-muted").trim() || "#a9c0b2",
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

function Molecule() {
  const group = useRef<Group>(null);
  const colors = useThemeColors();

  const { atoms, bonds } = useMemo(() => {
    // Deterministic pseudo-random structure: a ring with branches.
    const atoms: [number, number, number][] = [];
    const ring = 6;
    for (let i = 0; i < ring; i += 1) {
      const a = (i / ring) * Math.PI * 2;
      atoms.push([Math.cos(a) * 1.2, Math.sin(a) * 1.2, Math.sin(a * 2) * 0.25]);
    }
    const branches: [number, number, number][] = [
      [2.3, 0.4, 0.5],
      [-2.3, -0.3, -0.4],
      [0.5, 2.3, -0.6],
      [-0.4, -2.4, 0.4],
      [3.1, 1.2, 0.2],
      [-3.0, -1.1, 0.6],
    ];
    atoms.push(...branches);
    const bonds: [number, number][] = [];
    for (let i = 0; i < ring; i += 1) bonds.push([i, (i + 1) % ring]);
    bonds.push([0, 6], [3, 7], [1, 8], [4, 9], [6, 10], [7, 11]);
    return { atoms, bonds };
  }, []);

  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.25;
  });

  return (
    <group ref={group}>
      {bonds.map(([i, j]) => (
        <Line
          key={`${i}-${j}`}
          points={[atoms[i], atoms[j]]}
          color={colors.line}
          lineWidth={2}
          transparent
          opacity={0.7}
        />
      ))}
      {atoms.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[i < 6 ? 0.32 : 0.22, 64, 64]} />
          <meshStandardMaterial color={i < 6 ? colors.a : colors.b} roughness={0.35} metalness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

export default function MoleculeScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 45 }}
      dpr={[1, 3]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 5]} intensity={1.4} />
      <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.6}>
        <Molecule />
      </Float>
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}
