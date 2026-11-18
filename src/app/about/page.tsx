import type { Metadata } from "next";
import Image from "next/image";
import { getAbout, getCompany, getProducts } from "@/lib/content";
import { PageHead } from "@/components/ui/PageHead";

export const metadata: Metadata = {
  title: "About",
  description:
    "The team behind Phyto Elements has spent 15 years in nutraceutical ingredient extraction, from field-level sourcing to quality control, quality assurance and process technology.",
};

export default async function AboutPage() {
  const [c, about, products] = await Promise.all([getCompany(), getAbout(), getProducts()]);
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  return (
    <>
      <PageHead
        title="About Phyto Elements"
        crumbs={[{ label: "About" }]}
        lede="15 years in nutraceutical ingredient extraction, from the field to the finished, tested extract."
      />

      {/* Our story: the client's text beside a quality-control photograph */}
      <section className="section about-story">
        <div className="wrap grid items-center gap-[clamp(28px,5vw,64px)] min-[861px]:grid-cols-[1.1fr_0.9fr]">
          <div className="grid max-w-[64ch] gap-4">
            <span className="eyebrow">Our story</span>
            {about.aboutStory.map((para) => (
              <p key={para.slice(0, 24)} className="about-lead">
                {para}
              </p>
            ))}
          </div>
          <figure className="about-photo">
            <Image
              src="/images/bg/quality-sample.webp"
              alt="Gloved hands holding an extract sample vial"
              width={1600}
              height={900}
              sizes="(max-width: 860px) 92vw, 520px"
              unoptimized
            />
          </figure>
        </div>
      </section>

      {/* What the team brings: photo cards */}
      <section className="section sunk">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">What we bring</span>
            <h2>Experience across the herbal extract value chain</h2>
          </div>
          <ul className="about-strengths">
            {about.aboutStrengths.map((s) => (
              <li key={s.title}>
                <div className="about-strength-img">
                  <Image src={s.image} alt="" width={800} height={450} sizes="(max-width: 860px) 92vw, 280px" unoptimized />
                </div>
                <div className="about-strength-body">
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* What we make: the client's specialism statement with product photos */}
      <section className="section">
        <div className="wrap grid gap-8">
          <div className="sec-head">
            <span className="eyebrow">What we make</span>
            <h2>Garcinia first, and a growing range</h2>
            <p className="lede max-w-[70ch]">{about.aboutSpecialism}</p>
          </div>
          <ul className="about-grades">
            {about.aboutGrades.map((g) => {
              const p = bySlug.get(g.slug);
              return (
                <li key={g.slug}>
                  {p?.image && (
                    <Image
                      src={p.image.replace(".webp", "-wide.webp")}
                      alt={p.short}
                      width={1600}
                      height={940}
                      sizes="(max-width: 860px) 46vw, 280px"
                      unoptimized
                    />
                  )}
                  <div className="about-grade-cap">
                    <b>{g.label}</b>
                    <span>{g.grades}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="section sunk">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Who we serve</span>
            <h2>Core customer groups</h2>
          </div>
          <div className="grid gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
            {c.customers.map((cu) => (
              <div key={cu} className="card cursor-default grid-rows-none">
                <h3 className="text-[1.15rem]">{cu}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
