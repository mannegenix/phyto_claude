import { getCompany, getProducts } from "@/lib/content";
import {
  Hero,
  SourceToSeal,
  TestPillars,
  ValuesSection,
  WhyUs,
} from "@/components/sections/home";
import { ProductCarousel } from "@/components/products/ProductCarousel";
import { EnquirySection } from "@/components/sections/EnquirySection";
import { MailList } from "@/components/ui/MailList";
import { Reveal } from "@/components/motion/Reveal";

export default async function HomePage() {
  const [products, c] = await Promise.all([getProducts(), getCompany()]);
  const flagship = products.find((p) => p.flagship) ?? products[0];

  return (
    <>
      <Hero products={products} positioning={c.positioning} />
      {/* The products carousel (same as /products), in place of the ProductShowcase cards
          (kept in sections/ProductShowcase.tsx, not shown for now). */}
      <section id="products" className="products-stage home-products">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Portfolio</span>
            <h2>Every extract, one standard</h2>
          </div>
          <ProductCarousel
            items={[flagship, ...products.filter((p) => p.slug !== flagship.slug)].map((p) => ({
              slug: p.slug,
              code: p.code,
              name: p.name,
              short: p.short,
              role: p.role,
              botanicalSource: p.botanicalSource,
              plantPart: p.plantPart,
              marker: p.marker,
              applications: p.applications,
              swatch: p.swatch,
              image: p.image,
              intro: p.intro,
            }))}
          />
        </div>
      </section>
      <ValuesSection intro={c.introduction} values={c.values} />
      <TestPillars pillars={c.testPillars} />
      <SourceToSeal stages={c.stages} />
      <WhyUs functions={c.operatingFunctions} />
      <EnquirySection />
      <section className="section">
        <div className="wrap grid items-start gap-[clamp(28px,5vw,64px)] min-[861px]:grid-cols-2">
          <Reveal className="grid gap-[18px]">
            <span className="eyebrow">Contact</span>
            <h2 className="text-[clamp(1.9rem,3.6vw,2.75rem)]">Write to us</h2>
            <p className="muted">One inbox for quotations, samples, specifications, documents and orders. Phyto Elements, Hyderabad, India.</p>
          </Reveal>
          <MailList mailboxes={c.mailboxes} />
        </div>
      </section>
    </>
  );
}
