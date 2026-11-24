import type { ReactNode } from "react";

/**
 * Formerly faded content in on scroll. Since Nov 24 the site has no scroll animations
 * (client: standard scrolling everywhere), so this is a plain wrapper; `delay` is ignored.
 */
export function Reveal({ children, className }: { children: ReactNode; delay?: number; className?: string }) {
  return <div className={className}>{children}</div>;
}
