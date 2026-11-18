/** About page copy, as supplied by the client (Nov 2026). */
export const aboutStory = [
  "The team behind Phyto Elements has spent the past 15 years in nutraceutical ingredient extraction. Our core team brings hands-on experience across the herbal extract value chain, from procuring, processing, and trading a wide range of extracts to identifying and sourcing herbs at the field level.",
  "We have a strong command of quality control and quality assurance, and have successfully faced numerous audits by regulatory agencies and customers. We have also been closely involved in developing process technologies for high-value products, and in optimizing and standardizing processes, along with the other competencies the industry demands.",
];

export const aboutSpecialism =
  "We specialize in manufacturing Garcinia in 50% and 60% standard grades, as well as in granular form, and have expanded into contract manufacturing of Turmeric extract (Curcumin 95%), Coleus extract in 10%, 20%, and 95% grades, Bacopa (Bacosides 50%), and Ashwagandha (Withania somnifera) extract.";

/** Strengths drawn from the client's story, each shown with a photograph. */
export const aboutStrengths = [
  {
    title: "15 years in extraction",
    body: "A team that has spent the past 15 years in nutraceutical ingredient extraction.",
    image: "/images/bg/dropper-bottle.webp",
  },
  {
    title: "Field to finished extract",
    body: "Hands-on across the value chain: identifying and sourcing herbs at field level, procuring, processing and trading.",
    image: "/images/bg/leaf-dew.webp",
  },
  {
    title: "QC and QA, audit-tested",
    body: "A strong command of quality control and quality assurance, proven through numerous regulatory and customer audits.",
    image: "/images/bg/quality-sample.webp",
  },
  {
    title: "Process technology",
    body: "Developing process technologies for high-value products, and optimizing and standardizing processes.",
    image: "/images/bg/lab-instrument.webp",
  },
];

/** Grades named in the client's specialism statement, shown on the product photos. */
export const aboutGrades: { slug: string; label: string; grades: string }[] = [
  { slug: "garcinia", label: "Garcinia", grades: "HCA 50% · 60% · granular" },
  { slug: "curcumin", label: "Turmeric extract", grades: "Curcumin 95%" },
  { slug: "bacopa", label: "Bacopa", grades: "Bacosides 50%" },
  { slug: "ashwagandha", label: "Ashwagandha", grades: "Withania somnifera" },
];
