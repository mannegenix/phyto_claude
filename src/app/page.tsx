import { getCompany, getProducts } from "@/lib/content";
import {
  Hero,
  ProductGrid,
  SourceToSeal,
  TestPillars,
  ValuesSection,
  WhyUs,
} from "@/components/sections/home";
import { ProductSpotlight } from "@/components/sections/ProductSpotlight";
import { EnquirySection } from "@/components/sections/EnquirySection";
import { MailList } from "@/components/ui/MailList";
import { Reveal } from "@/components/motion/Reveal";

export default async function HomePage() {
  const [products, c] = await Promise.all([getProducts(), getCompany()]);
  const flagship = products.find((p) => p.flagship) ?? products[0];

  return (
    <>
      <Hero products={products} positioning={c.positioning} />
      <ValuesSection intro={c.introduction} values={c.values} />
      <TestPillars pillars={c.testPillars} />
      <SourceToSeal stages={c.stages} />
      <ProductSpotlight
        items={[flagship, ...products.filter((p) => p.slug !== flagship.slug)].map((p) => ({
          slug: p.slug,
          code: p.code,
          name: p.name,
          short: p.short,
          role: p.role,
          flagship: p.flagship,
          intro: p.intro,
          botanicalSource: p.botanicalSource,
          plantPart: p.plantPart,
          marker: p.marker,
          swatch: p.swatch,
          image: p.image,
        }))}
      />
      <ProductGrid products={products} />
      <WhyUs functions={c.operatingFunctions} />
      <EnquirySection />
      <section className="section">
        <div className="wrap grid items-start gap-[clamp(28px,5vw,64px)] min-[861px]:grid-cols-2">
          <Reveal className="grid gap-[18px]">
            <span className="eyebrow">Contact</span>
            <h2 className="text-[clamp(1.9rem,3.6vw,2.75rem)]">Write to the right desk</h2>
            <p className="muted">Five role-based inboxes keep quotations, samples, documents and orders organised.</p>
          </Reveal>
          <MailList mailboxes={c.mailboxes} />
        </div>
      </section>
    </>
  );
}
