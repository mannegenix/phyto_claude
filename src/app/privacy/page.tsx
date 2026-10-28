import type { Metadata } from "next";
import { PageHead } from "@/components/ui/PageHead";
import { ReviewNote } from "@/components/ui/ReviewNote";

export const metadata: Metadata = { title: "Privacy notice" };

export default function PrivacyPage() {
  return (
    <>
      <PageHead title="Privacy notice" crumbs={[{ label: "Privacy notice" }]} />
      <section className="section">
        <div className="wrap grid max-w-[66ch] gap-4">
          <p>
            Phyto Elements collects the details you submit through enquiry and sample-request forms (name, company,
            business email, phone, country, product and order requirements, and any file you attach) to respond to your
            enquiry, prepare samples, quotations and documents, and manage any resulting order.
          </p>
          <p>
            Enquiry data is stored securely in our website administration system or CRM and is accessible only to staff
            handling your enquiry. We do not sell your information.
          </p>
          <p>
            To access, correct or delete your information, write to <span className="mono">info@phytoelements.in</span>.
          </p>
          <ReviewNote>
            Draft text. Have this reviewed for India&apos;s DPDP Act 2023 and GDPR where EU buyers are targeted; add
            cookie controls when analytics are enabled.
          </ReviewNote>
        </div>
      </section>
    </>
  );
}
