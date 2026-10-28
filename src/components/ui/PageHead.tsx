import Link from "next/link";
import type { ReactNode } from "react";

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
        <h1>{title}</h1>
        {lede && <p className="lede">{lede}</p>}
        {children}
      </div>
    </div>
  );
}
