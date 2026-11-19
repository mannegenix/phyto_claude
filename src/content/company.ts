import type { Doc, Mailbox, OperatingFunction, ProcessStage, TestPillar, ValuePoint, DockStage } from "./types";

export const positioning =
  "Phyto Elements supplies bulk plant extracts held to very high standards. We source from qualified producers, test every lot rigorously to recognised global quality standards and beyond, and put our name only on extracts that meet them.";

export const introduction =
  "Sourcing is flexible; the standard is not. We buy from producers we have qualified, test what arrives, and supply ingredient distributors, nutraceutical companies, formulators and contract manufacturers only with lots that pass.";

/** The promise, in one line, used by the hero and the testing section. */
export const promise = "Sourced widely. Tested rigorously. Only the best carries our name.";

export const values: ValuePoint[] = [
  {
    title: "Tested before it carries our name",
    body: "Every lot is rigorously tested to recognised global quality standards before it is labelled and offered for sale.",
  },
  {
    title: "Only the best passes",
    body: "We hold every lot to global benchmarks, and often go beyond them. Lots that fall short are not sold under our label; what reaches you is what passed.",
  },
  {
    title: "Sourced widely, chosen carefully",
    body: "We work with several qualified producers, so supply stays steady while the standard stays fixed.",
  },
  {
    title: "Garcinia first, one standard",
    body: "A focused portfolio led by Garcinia Cambogia Extract, with every other extract held to the same standard.",
  },
  {
    title: "Documents tied to your lot",
    body: "Specifications, Certificates of Analysis, quotations and shipment documents matched to the lot you receive.",
  },
];

export const customers = [
  "Nutraceutical and dietary supplement manufacturers",
  "Ingredient distributors and importers",
  "Contract manufacturers and private-label formulators",
  "Functional food and beverage companies",
  "Cosmetic and personal-care manufacturers",
  "Ayurvedic and traditional product manufacturers",
];

/** From source to seal: the five gates every lot goes through. */
export const stages: ProcessStage[] = [
  {
    title: "Source",
    body: "We request material from qualified producers against our product specification, so every lot starts with a defined target.",
  },
  {
    title: "Screen",
    body: "Incoming lots are checked against their documentation and globally recognised acceptance criteria before they go on to testing.",
  },
  {
    title: "Test",
    body: "Each lot is rigorously tested to recognised global quality standards for the product and grade.",
  },
  {
    title: "Pass or reject",
    body: "Only lots that meet the specification go forward. Lots that fall short are not sold under our label.",
  },
  {
    title: "Label and supply",
    body: "Passed lots are packed under the Phyto Elements label and supplied with lot-linked documentation.",
  },
];

/**
 * What every lot is checked for. Framed as the standard Phyto Elements holds lots to;
 * the exact tests and methods per product are confirmed with the client (see qualityChecklist).
 */
export const testPillars: TestPillar[] = [
  { code: "ID", art: "magnifier", title: "Identity", body: "The right botanical and the right plant part, confirmed before anything else." },
  { code: "PU", art: "filter", title: "Purity", body: "Checked for foreign matter and contaminants against internationally accepted limits." },
  { code: "PO", art: "chromatogram", title: "Potency", body: "Marker-compound content measured against the grade on the specification." },
  { code: "SA", art: "petri", title: "Safety", body: "Screened against the safety limits that apply to the product and its market." },
  { code: "ST", art: "hourglass", title: "Stability", body: "Packed and stored so the lot holds its specification through its shelf life." },
];

/** How we work: the functions behind the promise. */
export const operatingFunctions: OperatingFunction[] = [
  {
    title: "Specification development",
    icon: "spec",
    art: "coa",
    body: "Define the botanical source, plant part, marker compound and acceptance limits for each extract and grade we offer.",
  },
  {
    title: "Producer qualification",
    icon: "producers",
    art: "sourcing",
    body: "Evaluate and approve producers against identity, quality, traceability and commercial requirements before we buy from them.",
  },
  {
    title: "Incoming screening",
    icon: "screening",
    art: "microscope",
    body: "Check each arriving lot against its documentation and globally recognised acceptance criteria before it is accepted for testing.",
  },
  {
    title: "Testing against specification",
    icon: "testing",
    art: "vials",
    body: "Test each lot to recognised global quality standards for the product and grade.",
  },
  {
    title: "Release decision",
    icon: "release",
    art: "seal",
    body: "Release only lots that meet the specification. Lots that fall short are rejected or returned, never relabelled.",
  },
  {
    title: "Packing and labelling",
    icon: "packing",
    art: "drums",
    body: "Pack released lots in the agreed bulk format under the Phyto Elements label, with lot-linked quality documentation.",
  },
  {
    title: "Indian & Global fulfilment",
    icon: "fulfilment",
    art: "shipping",
    body: "Coordinate quotations, purchase orders, dispatch, export documentation, logistics and post-delivery support.",
  },
];

/** The one public mailbox (client: show only info@). */
export const mailboxes: Mailbox[] = [
  {
    address: "info@phytoelements.in",
    label: "Enquiries",
    use: "Quotations, samples, specifications, Certificates of Analysis, documents and orders.",
  },
];

/** Brief §7: documents available by download or email on request. */
export const documents: Doc[] = [
  {
    name: "Company profile",
    tag: "PDF",
    body: "Overview of Phyto Elements, portfolio, sourcing and testing approach.",
    access: "Email on request · info@phytoelements.in",
  },
  {
    name: "Product specification sheet",
    tag: "SPEC",
    body: "The grade, marker compound, parameters and acceptance limits each lot is tested against.",
    access: "Email on request · info@phytoelements.in",
  },
  {
    name: "Representative COA",
    tag: "COA",
    body: "Clearly labelled as representative. Indicates the test panel and typical results.",
    access: "Email on request · info@phytoelements.in",
  },
  {
    name: "Lot-specific COA",
    tag: "COA",
    body: "Issued for the identified lot and matched to its lot reference.",
    access: "With quotation or order · info@phytoelements.in",
  },
  {
    name: "Safety Data Sheet",
    tag: "SDS",
    body: "Provided where applicable to the product and transaction.",
    access: "Email on request · info@phytoelements.in",
  },
  {
    name: "Packing and storage information",
    tag: "INFO",
    body: "Packing configuration, storage conditions and shelf-life guidance.",
    access: "Email on request · info@phytoelements.in",
  },
  {
    name: "Quotation and proforma invoice",
    tag: "QUO",
    body: "Commercial terms for the confirmed specification and quantity.",
    access: "On enquiry · info@phytoelements.in",
  },
  {
    name: "PO acknowledgement and shipment documents",
    tag: "SHIP",
    body: "Order confirmation, dispatch and export documentation.",
    access: "On order · info@phytoelements.in",
  },
];

/** Verify with the client before replacing the generic testing wording. */
export const qualityChecklist = [
  "Where testing happens: in-house laboratory, third-party laboratories, or both",
  "Test panel per product (identity, marker assay, contaminants, microbiology) and the methods used",
  "Acceptance limits per grade and how rejected lots are handled",
  "Producer qualification steps and how often producers are re-evaluated",
  "GMP, ISO, FSSAI, organic, Halal, Kosher or other certifications, with documents",
  "Garcinia manufacturing facility: legal entity, location, and whether to mention it at all",
  "Historical volumes, customers, countries, years in operation",
];

/**
 * Homepage "From source to seal" photo carousel: the five source-to-seal steps carried by
 * the editorial carousel and photos from the client's earlier site ("From sourcing to your
 * dock"). The animated source-to-seal views (SealPipeline / SealStepper) still use `stages`.
 */
export const dock = {
  eyebrow: "From source to seal",
  title: "Many lots come in.",
  titleEm: "Only the ones that pass go out under our name.",
  intro:
    "We source from several qualified producers so supply stays steady. What keeps the standard fixed is the test every lot has to pass.",
};
export const dockStages: DockStage[] = [
  {
    label: "Source",
    eyebrow: "01 · Source",
    title: "A considered beginning.",
    body: "We request material from qualified producers against our product specification, so every lot starts with a defined target.",
    detail: "Selection begins with the product requirements.",
    cta: { label: "Our operating approach", href: "/operations" },
    image: "/images/dev1/quality-sourcing.webp",
    alt: "Gloved hands selecting from incoming botanical extract samples",
  },
  {
    label: "Screen",
    eyebrow: "02 · Screen",
    title: "Look closer. Ask more.",
    body: "Incoming lots are checked against their documentation and globally recognised acceptance criteria before they go on to testing.",
    cta: { label: "Manufacturing & Quality", href: "/manufacturing" },
    image: "/images/dev1/quality-evaluation.webp",
    alt: "Botanical extract sample inspected with a magnifying lens",
  },
  {
    label: "Test",
    eyebrow: "03 · Test",
    title: "Standards come first.",
    body: "Each lot is rigorously tested to recognised global quality standards for the product and grade.",
    cta: { label: "Explore our quality approach", href: "/manufacturing" },
    image: "/images/dev1/quality-testing.webp",
    alt: "Botanical extract vial loaded into analytical testing equipment",
  },
  {
    label: "Pass or reject",
    eyebrow: "04 · Pass or reject",
    title: "Quality earns our name.",
    body: "Only lots that meet the specification go forward. Lots that fall short are not sold under our label.",
    cta: { label: "How release works", href: "/manufacturing" },
    image: "/images/dev1/quality-approval.webp",
    alt: "Approved botanical extract sample receiving a tamper-evident seal",
  },
  {
    label: "Label and supply",
    eyebrow: "05 · Label and supply",
    title: "Ready for your requirements.",
    body: "Passed lots are packed under the Phyto Elements label and supplied with lot-linked documentation. Specification and quantity are discussed with our team.",
    cta: { label: "Talk to our team", href: "/contact" },
    image: "/images/dev1/quality-dispatch.webp",
    alt: "Approved botanical extracts and dispatch documents prepared for shipment",
  },
];
