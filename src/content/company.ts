import type { Doc, Mailbox, OperatingFunction, ProcessStage, TestPillar, ValuePoint } from "./types";

export const positioning =
  "Phyto Elements supplies bulk plant extracts that have passed our testing. We source from qualified producers, test every lot against our specification, and put our name only on extracts that meet it.";

export const introduction =
  "Sourcing is flexible; our standard is not. We buy from producers we have qualified, test what arrives, and supply ingredient distributors, nutraceutical companies, formulators and contract manufacturers only with lots that pass.";

/** The promise, in one line, used by the hero and the testing section. */
export const promise = "Sourced widely. Tested rigorously. Only the best carries our name.";

export const values: ValuePoint[] = [
  {
    title: "Tested before it carries our name",
    body: "Every lot is tested against the Phyto Elements specification before it is labelled and offered for sale.",
  },
  {
    title: "Only the best passes",
    body: "Lots that fall short of specification are not sold under our label. What reaches you is what passed.",
  },
  {
    title: "Sourced widely, chosen carefully",
    body: "We work with several qualified producers, so supply stays steady while the standard stays fixed.",
  },
  {
    title: "Six extracts, Garcinia first",
    body: "A focused portfolio led by Garcinia Cambogia Extract, with five more extracts held to the same standard.",
  },
  {
    title: "Documents tied to your lot",
    body: "Specifications, Certificates of Analysis, quotations and shipment documents matched to the lot you receive.",
  },
];

export const customers = [
  "Nutraceutical and dietary-supplement manufacturers",
  "Ingredient distributors and importers",
  "Contract manufacturers and private-label formulators",
  "Functional food and beverage companies",
  "Cosmetic and personal-care manufacturers",
  "Ayurvedic and traditional-product manufacturers",
];

/** From source to seal: the five gates every lot goes through. */
export const stages: ProcessStage[] = [
  {
    title: "Source",
    body: "We request material from qualified producers against our product specification, so every lot starts with a defined target.",
  },
  {
    title: "Screen",
    body: "Incoming lots are checked against their documentation and our acceptance criteria before they go on to testing.",
  },
  {
    title: "Test",
    body: "Each lot is tested against the Phyto Elements specification for the product and grade.",
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
  { code: "ID", title: "Identity", body: "The right botanical and the right plant part, confirmed before anything else." },
  { code: "PU", title: "Purity", body: "Checked for foreign matter and contaminants against our acceptance limits." },
  { code: "PO", title: "Potency", body: "Marker-compound content measured against the grade on the specification." },
  { code: "SA", title: "Safety", body: "Screened against the safety limits that apply to the product and its market." },
  { code: "ST", title: "Stability", body: "Packed and stored so the lot holds its specification through its shelf life." },
];

/** How we work: the functions behind the promise. */
export const operatingFunctions: OperatingFunction[] = [
  {
    title: "Specification development",
    body: "Define the botanical source, plant part, marker compound and acceptance limits for each extract and grade we offer.",
  },
  {
    title: "Producer qualification",
    body: "Evaluate and approve producers against identity, quality, traceability and commercial requirements before we buy from them.",
  },
  {
    title: "Incoming screening",
    body: "Check each arriving lot against its documentation and our acceptance criteria before it is accepted for testing.",
  },
  {
    title: "Testing against specification",
    body: "Test each lot against the Phyto Elements specification for the product and grade.",
  },
  {
    title: "Release decision",
    body: "Release only lots that meet the specification. Lots that fall short are rejected or returned, never relabelled.",
  },
  {
    title: "Packing and labelling",
    body: "Pack released lots in the agreed bulk format under the Phyto Elements label, with lot-linked quality documentation.",
  },
  {
    title: "Domestic and export fulfilment",
    body: "Coordinate quotations, purchase orders, dispatch, export documentation, logistics and post-delivery support.",
  },
];

/** Brief §9: five role-based mailboxes. */
export const mailboxes: Mailbox[] = [
  { address: "info@phytoelements.in", label: "General", use: "Company enquiries and non-product questions." },
  {
    address: "sales@phytoelements.in",
    label: "Sales",
    use: "New buyers, quotations, pricing, MOQ, lead time and follow-up.",
  },
  {
    address: "samples@phytoelements.in",
    label: "Samples",
    use: "Sample requests, dispatch details and sample follow-up.",
  },
  {
    address: "quality@phytoelements.in",
    label: "Quality & documents",
    use: "Specifications, representative or lot COAs, SDS and technical questions.",
  },
  {
    address: "orders@phytoelements.in",
    label: "Orders & commercial",
    use: "Purchase orders, proforma invoices, acknowledgements, dispatch and shipment.",
  },
];

/** Brief §7: documents available by download or email on request. */
export const documents: Doc[] = [
  {
    name: "Company profile",
    tag: "PDF",
    body: "Overview of Phyto Elements, portfolio, sourcing and testing approach.",
    access: "Email on request · info@",
  },
  {
    name: "Product specification sheet",
    tag: "SPEC",
    body: "The grade, marker compound, parameters and acceptance limits each lot is tested against.",
    access: "Email on request · quality@",
  },
  {
    name: "Representative COA",
    tag: "COA",
    body: "Clearly labelled as representative. Indicates the test panel and typical results.",
    access: "Email on request · quality@",
  },
  {
    name: "Lot-specific COA",
    tag: "COA",
    body: "Issued for the identified lot and matched to its lot reference.",
    access: "With quotation or order · quality@",
  },
  {
    name: "Safety Data Sheet",
    tag: "SDS",
    body: "Provided where applicable to the product and transaction.",
    access: "Email on request · quality@",
  },
  {
    name: "Packing and storage information",
    tag: "INFO",
    body: "Packing configuration, storage conditions and shelf-life guidance.",
    access: "Email on request · sales@",
  },
  {
    name: "Quotation and proforma invoice",
    tag: "QUO",
    body: "Commercial terms for the confirmed specification and quantity.",
    access: "On enquiry · sales@",
  },
  {
    name: "PO acknowledgement and shipment documents",
    tag: "SHIP",
    body: "Order confirmation, dispatch and export documentation.",
    access: "On order · orders@",
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
