/**
 * Content types. These mirror the schemas the CMS will use (Sanity or Payload),
 * so swapping the local content files for CMS queries only changes src/lib/content.ts.
 */
export type Product = {
  slug: string;
  code: string;
  name: string;
  short: string;
  role: "Flagship product" | "Core product" | "Specialty product";
  flagship?: boolean;
  botanicalSource: string;
  plantPart: string;
  marker: string;
  applicationArea: string;
  applications: string[];
  intro: string;
  /** Decorative swatch colour for cards; not a specification claim. */
  swatch: string;
  /** Internal QA note, shown only when review notes are enabled. */
  reviewNote: string;
  /** Verified spec values. Leave undefined until approved; the UI shows "Shared on request". */
  spec?: Partial<{
    extractType: string;
    gradeAssay: string;
    appearance: string;
    packing: string;
    moq: string;
    leadTime: string;
  }>;
};

export type ProcessStage = { title: string; body: string };
export type OperatingFunction = { title: string; body: string };
export type TestPillar = { code: string; title: string; body: string };
export type ValuePoint = { title: string; body: string };
export type Mailbox = { address: string; label: string; use: string };
export type Doc = { name: string; tag: string; body: string; access: string };
