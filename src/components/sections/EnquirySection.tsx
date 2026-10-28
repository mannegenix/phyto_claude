import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { ReviewNote } from "@/components/ui/ReviewNote";
import { getCompany, getProducts } from "@/lib/content";

export async function EnquirySection({
  preselect = "",
  defaultType = "Quote",
  eyebrow = "Enquiry",
  title = "Tell us what you need",
}: {
  preselect?: string;
  defaultType?: "Specifications" | "Sample" | "Quote";
  eyebrow?: string;
  title?: string;
}) {
  const [products, { customers }] = await Promise.all([getProducts(), getCompany()]);
  return (
    <section id="enquire" className="section sunk">
      <div className="wrap grid items-start gap-[clamp(28px,5vw,64px)] min-[901px]:grid-cols-[.8fr_1.2fr]">
        <div className="grid gap-[22px]">
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="text-[clamp(1.8rem,3.4vw,2.6rem)]">{title}</h2>
          <p className="muted">
            State the product, grade and quantity you need. We reply with the specification, sample availability and a
            quotation from one point of contact.
          </p>
          <ol className="grid gap-3.5">
            {[
              "We confirm the specification and grade against your requirement.",
              "Where requested, a sample is dispatched with its supporting documents.",
              "You receive a quotation with packing, MOQ and lead time.",
            ].map((t, i) => (
              <li key={t} className="grid grid-cols-[30px_1fr] items-start gap-3">
                <span className="mono grid size-7 place-items-center rounded-full border-[1.5px] border-current text-[0.8rem] opacity-80">
                  {i + 1}
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ol>
          <ReviewNote>
            Configure RESEND_API_KEY, Turnstile keys and CRM_WEBHOOK_URL in the environment before launch (see README).
          </ReviewNote>
        </div>
        <EnquiryForm
          products={products.map(({ slug, name }) => ({ slug, name }))}
          customers={customers}
          preselect={preselect}
          defaultType={defaultType}
        />
      </div>
    </section>
  );
}
