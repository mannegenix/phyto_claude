import Link from "next/link";
import type { ReactNode } from "react";

/** Page titles end on a word marked in the logo's sun yellow (see .page-head .hl). */
function withHighlight(title: ReactNode) {
  if (typeof title !== "string") return title;
  const i = title.lastIndexOf(" ");
  if (i < 0) return <span className="hl">{title}</span>;
  return (
    <>
      {title.slice(0, i + 1)}
      <span className="hl">{title.slice(i + 1)}</span>
    </>
  );
}

export function PageHead({
  title,
  lede,
  crumbs = [],
  children,
}: {
  title: ReactNode;
  lede?: ReactNode;
  crumbs?: { href?: string; label: string }[];
  children?: ReactNode;
}) {
  return (
    <div className="page-head">
      <div className="wrap">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          {crumbs.map((c) => (
            <span key={c.label} className="flex gap-2">
              <span aria-hidden="true">/</span>
              {c.href ? <Link href={c.href}>{c.label}</Link> : <span>{c.label}</span>}
            </span>
          ))}
        </nav>
        <h1>{withHighlight(title)}</h1>
        {lede && <p className="lede">{lede}</p>}
        {children}
      </div>
    </div>
  );
}
