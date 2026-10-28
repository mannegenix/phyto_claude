import { botanicalPaths } from "./shapes";

/**
 * Line drawing of a botanical. With `draw`, the strokes draw themselves as the
 * drawing scrolls into view (CSS scroll-driven animation, see polish.css);
 * browsers without support simply show the finished drawing.
 */
export function BotanicalArt({
  slug,
  className = "",
  draw = false,
  strokeWidth = 1.3,
  label,
}: {
  slug: string;
  className?: string;
  draw?: boolean;
  strokeWidth?: number;
  label?: string;
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={`botanical ${draw ? "botanical-draw" : ""} ${className}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {botanicalPaths(slug).map((d, i) => (
        <path
          key={i}
          d={d}
          pathLength={1}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          style={{ ["--i" as string]: i }}
        />
      ))}
    </svg>
  );
}
