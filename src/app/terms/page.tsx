import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "@/components/legal/LegalPage";
import { siteConfig } from "@/config/site";
import { getLegal } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { termsOfUse: doc } = await getLegal();
  return pageMetadata({ title: doc.title, description: doc.summary, path: "/terms" });
}

/** Copy in content/legal.ts. 404 while siteConfig.legalPagesLive is false. */
export default async function TermsPage() {
  if (!siteConfig.legalPagesLive) notFound();
  const { termsOfUse: doc } = await getLegal();
  return <LegalPage doc={doc} />;
}
