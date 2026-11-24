import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { PageHead } from "@/components/ui/PageHead";
import type { LegalBlock, LegalDoc } from "@/content/legal";

const DOC_LINKS: Record<string, string> = {
  "Privacy Policy": "/privacy",
  "Terms of Use": "/terms",
  "Cookie Notice": "/cookies",
};

/** Turns email addresses and mentions of the other legal pages into links. */
function withLinks(text: string): ReactNode {
  const parts = text.split(/([\w.+-]+@[\w-]+(?:\.[\w-]+)+|Privacy Policy|Terms of Use|Cookie Notice)/g);
  return parts.map((p, i) => {
    if (i % 2 === 0) return <Fragment key={i}>{p}</Fragment>;
    if (DOC_LINKS[p])
      return (
        <Link key={i} href={DOC_LINKS[p]}>
          {p}
        </Link>
      );
    return (
      <a key={i} href={`mailto:${p}`} className="mono">
        {p}
      </a>
    );
  });
}

function Block({ block }: { block: LegalBlock }) {
  if (typeof block === "string") return <p>{withLinks(block)}</p>;
  return (
    <ul>
      {block.list.map((item) => (
        <li key={item}>{withLinks(item)}</li>
      ))}
    </ul>
  );
}

/** Privacy Policy, Terms of Use and Cookie Notice share this layout. */
export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <PageHead title={doc.title} lede={doc.summary} crumbs={[{ label: doc.title }]} />
      <section className="section">
        <div className="wrap">
          <article className="legal-doc">
            {doc.intro.map((t) => (
              <p key={t} className="legal-intro">
                {withLinks(t)}
              </p>
            ))}
            {doc.sections.map((s) => (
              <section key={s.heading}>
                <h2>{s.heading}</h2>
                {s.blocks.map((b, i) => (
                  <Block key={i} block={b} />
                ))}
              </section>
            ))}
          </article>
        </div>
      </section>
    </>
  );
}
