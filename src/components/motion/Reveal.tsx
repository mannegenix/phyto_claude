"use client";

import { motion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { calmMotion } from "@/lib/motion-pref";

/**
 * Fades content up as it enters the viewport. Content is always visible at rest
 * (initial opacity is never 0), so screenshots, crawlers and no-JS readers see it.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  // Follows the site motion preference (footer "Reduce motion"), not the OS setting.
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    if (calmMotion()) requestAnimationFrame(() => setReduce(true));
  }, []);
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0.35, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
