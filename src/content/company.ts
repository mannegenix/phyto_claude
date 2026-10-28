import type { Doc, Mailbox, OperatingFunction, ProcessStage, ValuePoint } from "./types";

export const positioning =
  "Phyto Elements manufactures bulk plant extracts for Indian and global B2B customers through controlled processing, defined specifications, batch quality documentation and commercially reliable fulfilment.";

export const introduction =
  "We develop and manufacture standardized extracts for ingredient distributors, nutraceutical companies, formulators and contract manufacturers, supported by product specifications, samples, quality documentation and commercial fulfilment.";

export const values: ValuePoint[] = [
  {
    title: "Focused manufacturing",
    body: "Production capability centred on six extracts, led by Garcinia Cambogia Extract.",
  },
  {
    title: "Specification-driven batches",
    body: "Every batch is planned against an approved product specification and your requirements.",
  },
  {
    title: "One point of contact",
    body: "Discuss specification, quantity, sample, price, packing, lead time and documents with one team.",
  },
  {
    title: "Batch documentation",
    body: "Specifications, Certificates of Analysis, quotations, POs and shipment documents exchanged by email.",
  },
  {
    title: "Indian and global reach",
    body: "Supplying buyers in India and export markets, subject to product and destination requirements.",
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

/** Brief §6: five-stage "from botanicals to batch". Contract farming deliberately excluded. */
export const stages: ProcessStage[] = [
  {
    title: "Raw-material sourcing",
    body: "Botanical raw materials are selected against product identity, quality and process requirements.",
  },
  {
    title: "Extraction",
    body: "Approved botanical material is processed using the extraction system and controlled parameters appropriate to the product and required grade.",
  },
  {
    title: "Standardization",
    body: "The manufactured extract is adjusted or blended to meet the specified active-marker range and other approved product parameters.",
  },
  {
    title: "Quality testing",
    body: "The batch is assessed against the approved specification, with results reported in the batch Certificate of Analysis.",
  },
  {
    title: "Packaging and dispatch",
    body: "Product is packed to the agreed configuration and dispatched with the approved commercial and quality documentation.",
  },
];

/** Brief §5: nine operating functions. */
export const operatingFunctions: OperatingFunction[] = [
  {
    title: "Product and process development",
    body: "Define the botanical source, plant part, extraction route, target marker compounds, process parameters and finished-product specification for each focus extract.",
  },
  {
    title: "Raw-material procurement and qualification",
    body: "Source identified botanical raw materials and approve vendors against identity, quality, contaminant, traceability and commercial requirements.",
  },
  {
    title: "Incoming quality control",
    body: "Inspect and test incoming botanical materials against approved acceptance criteria before release to production.",
  },
  {
    title: "Extraction and processing",
    body: "Carry out extraction under controlled solvent, temperature, time and equipment conditions appropriate to the product and target grade.",
  },
  {
    title: "Concentration, drying and milling",
    body: "Concentrate the extract, apply the appropriate drying process, mill or sieve where required, and produce a stable, free-flowing bulk ingredient.",
  },
  {
    title: "Standardization and blending",
    body: "Adjust or blend the extract to the approved active-marker range and other product parameters to achieve batch consistency.",
  },
  {
    title: "Quality control and batch release",
    body: "Test identity, assay, physical parameters, contaminants and microbiological limits as applicable; release only batches meeting the approved specification.",
  },
  {
    title: "Packing and documentation",
    body: "Pack released product in the approved bulk format and issue batch-linked quality and commercial documentation, including the Certificate of Analysis.",
  },
  {
    title: "Domestic and export fulfilment",
    body: "Coordinate quotations, purchase orders, dispatch, export documentation, logistics and post-delivery customer support for Indian and global buyers.",
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
    use: "Specifications, representative or batch COAs, SDS and technical questions.",
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
    body: "Overview of Phyto Elements, portfolio and operating model.",
    access: "Email on request · info@",
  },
  {
    name: "Product specification sheet",
    tag: "SPEC",
    body: "Grade, marker compound, physical parameters and limits per product.",
    access: "Email on request · quality@",
  },
  {
    name: "Representative COA",
    tag: "COA",
    body: "Clearly labelled as representative. Indicates the test panel and typical results.",
    access: "Email on request · quality@",
  },
  {
    name: "Batch-specific COA",
    tag: "COA",
    body: "Issued after batch identification and matched to the batch reference.",
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

export const manufacturingChecklist = [
  "Manufacturing-site legal identity and operating authority",
  "Location and legal name of the manufacturing entity",
  "Production capacity and equipment claims",
  "GMP, ISO, FSSAI, organic, Halal, Kosher or other certifications",
  "In-house vs third-party testing capability",
  "Extraction solvents and process technologies",
  "Batch traceability, test panels and release procedures",
  "Historical volumes, customers, countries, years in operation",
];
