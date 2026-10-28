import type { Metadata } from "next";
import { PageHead } from "@/components/ui/PageHead";
import { EnquirySection } from "@/components/sections/EnquirySection";

export const metadata: Metadata = {
  title: "Request a Sample",
  description: "Request a sample of any Phyto Elements extract with its supporting documents.",
};

export default function SamplePage() {
  return (
    <>
      <PageHead
        title="Request a Sample"
        crumbs={[{ label: "Request a Sample" }]}
        lede="Tell us the product, grade and application. We confirm the specification, then dispatch a sample with its supporting documents."
      />
      <EnquirySection defaultType="Sample" eyebrow="Sample request" title="Sample request form" />
    </>
  );
}
