import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { PageHead } from "@/components/ui/PageHead";
import type { LegalBlock, LegalDoc } from "@/content/legal";
import { CookieSettingsLink } from "@/components/consent/ConsentBanner";

const DOC_LINKS: Record<string, string> = {
  "Privacy Policy": "/privacy",
  "Terms of Use": "/terms",
  "Cookie Notice": "/cookies",
};

/** Turns email addresses, mentions of the other legal pages and "Cookie settings" into links. */
function withLinks(text: string): ReactNode {
  const parts = text.split(/([\w.+-]+@[\w-]+(?:\.[\w-]+)+|Privacy Policy|Terms of Use|Cookie Notice|Cookie settings)/g);
  return parts.map((p, i) => {
    if (i % 2 === 0) return <Fragment key={i}>{p}</Fragment>;
    if (p === "Cookie settings") return <CookieSettingsLink key={i} className="cb-inline" />;
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
  if ("table" in block)
    return (
      <div className="legal-table">
        <table>
          <thead>
            <tr>
              {block.table.head.map((h) => (
                <th key={h} scope="col">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.table.rows.map((row) => (
              <tr key={row[0]}>
                {row.map((cell, i) => (
                  <td key={i} data-label={block.table.head[i]}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
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
