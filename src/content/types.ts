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
  /** Decorative product colour (orb tint, page colour wash); not a specification claim. */
  swatch: string;
  /** Optional product photo in /public (e.g. "/images/products/garcinia.webp"). Without it the illustration is shown. */
  image?: string;
  /** Internal QA note (not shown on the site). */
  reviewNote?: string;
  /**
   * Representative specification (client-supplied; lot values are confirmed in the lot COA).
   * Fields left undefined render as "Shared on request".
   */
  spec?: Partial<{
    extractType: string;
    gradeAssay: string;
    appearance: string;
    solvent: string;
    particleSize: string;
    lossOnDrying: string;
    heavyMetals: string;
    microbial: string;
    solubility: string;
    storage: string;
    shelfLife: string;
    cas: string;
    moq: string;
  }>;
};

export type ProcessStage = { title: string; body: string };
/** Line drawing shown beside a step (see components/botanicals/LabArt). */
export type ArtKind =
  | "chromatogram" | "vials" | "coa" | "drums" | "shipping" | "microscope"
  | "petri" | "magnifier" | "filter" | "sourcing" | "seal" | "hourglass";
export type OperatingFunction = { title: string; body: string; art?: ArtKind };
export type TestPillar = { code: string; title: string; body: string; art?: ArtKind };
export type ValuePoint = { title: string; body: string };
export type Mailbox = { address: string; label: string; use: string };
export type Doc = { name: string; tag: string; body: string; access: string };
