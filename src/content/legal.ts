/**
 * Privacy Policy, Terms of Use and Cookie Notice. Details from the client's answers
 * ("Queries: Terms, Privacy, Legal and others", 24 Nov 2026). Drafted for the client's
 * review; their lawyer should sign them off. Email addresses in the text become links.
 *
 * Block types: a string is a paragraph; { list: [...] } is a bullet list.
 */
export type LegalBlock = string | { list: string[] };
export type LegalSection = { heading: string; blocks: LegalBlock[] };
export type LegalDoc = { title: string; summary: string; intro: string[]; sections: LegalSection[] };

export const legalEntity = {
  name: "Phyto Elements",
  type: "a partnership firm",
  address: "H No 7-1-644/3/1/1, 1st floor, Sunder Nagar, Hyderabad 500038, Telangana, India",
  email: "info@phytoelements.in",
  grievanceOfficer: {
    name: "Ashwin Jangalapalli",
    role: "Managing Partner",
    // The one published exception to "info@ only": required by Indian rules (Nov 24, client).
    email: "ashwin.j@phytoelements.in",
  },
  effective: "24 November 2026",
};

const e = legalEntity;

export const privacyPolicy: LegalDoc = {
  title: "Privacy Policy",
  summary: "How Phyto Elements collects, uses, shares and protects the information you give us through this website.",
  intro: [
    `This policy explains how ${e.name} ("we", "us"), ${e.type} with its registered office at ${e.address}, handles personal data collected through phytoelements.in. It is written to meet India's Digital Personal Data Protection Act, 2023 and the Information Technology Act, 2000 and its rules.`,
    `Effective date: ${e.effective}.`,
  ],
  sections: [
    {
      heading: "What we collect",
      blocks: [
        "When you send an enquiry or request a sample, we collect what you enter in the form:",
        {
          list: [
            "your name, company, business email, phone number and country;",
            "the product, grade or specification, quantity, application, timeline and whether you need a sample;",
            "your message and any specification file you attach.",
          ],
        },
        "We also receive basic technical data when you visit, such as your IP address, browser type and the pages requested. Our hosting and security provider uses it to deliver the site and protect it from abuse, and our website analytics count visits without cookies and without identifying you.",
      ],
    },
    {
      heading: "Why we use it",
      blocks: [
        {
          list: [
            "to reply to your enquiry and send specifications, documents, samples and quotations;",
            "to manage any order or business relationship that follows, including delivery;",
            "to contact you about your current or future requirements for our products;",
            "to keep the website secure and working, and to understand how it is used.",
          ],
        },
        "We use your data on the basis of the consent you give when you submit the form, and as needed to respond to your request and perform any contract with you. We do not sell your personal data. We do not send newsletters or promotional offers; if we start, we will ask for your separate consent first.",
      ],
    },
    {
      heading: "Who sees it and who we share it with",
      blocks: [
        "Enquiries are seen only by our partners and authorised management who handle them.",
        "We use service providers that process data on our behalf:",
        {
          list: [
            "Zoho, for our email inbox and records;",
            "Resend, which delivers the emails our website forms send to us;",
            "Cloudflare, which hosts the website, protects the forms from spam (Turnstile) and provides cookie-free visit statistics.",
          ],
        },
        "We share your name, address and contact details with logistics partners to deliver products you order. Any other disclosure is made only on a need-to-know basis to fulfil your request, or where the law requires it.",
      ],
    },
    {
      heading: "International transfers",
      blocks: [
        "Some of our service providers store or process data outside India. Where that happens, we rely on their contractual and security commitments to protect it. If you write to us from the European Union or the United Kingdom, we process your data to respond to you and to take steps at your request before entering a contract, and you have the rights described below.",
      ],
    },
    {
      heading: "How long we keep it",
      blocks: [
        "We keep enquiry details and attachments for as long as our business relationship with you continues. If an enquiry does not lead to a business relationship, we keep it for 2 years from our last contact and then delete it, unless the law requires us to keep it longer.",
      ],
    },
    {
      heading: "Your rights",
      blocks: [
        "You can ask us to:",
        {
          list: [
            "tell you what personal data we hold about you and how we use it;",
            "correct, complete or update it;",
            "delete it, where we no longer need it for the purposes above or the law does not require us to keep it;",
            "withdraw your consent, which stops further use but does not affect what was done before;",
            "nominate another person to exercise these rights for you.",
          ],
        },
        `Write to ${e.email}. We will reply within a reasonable time and in any case within the period the law sets.`,
      ],
    },
    {
      heading: "Grievance Officer",
      blocks: [
        `If you have a concern or complaint about how we handle your data, contact our Grievance Officer: ${e.grievanceOfficer.name}, ${e.grievanceOfficer.role}, ${e.grievanceOfficer.email}. If you are not satisfied with our response, you may complain to the Data Protection Board of India, or to your local data protection authority.`,
      ],
    },
    {
      heading: "Security",
      blocks: [
        "The website is served only over HTTPS, the forms are protected against automated spam, and enquiry data is held in access-controlled business systems. No method of transmission or storage is completely secure, but we take reasonable steps to protect your data.",
      ],
    },
    {
      heading: "Cookies",
      blocks: ["How the website uses cookies and similar technologies is explained in our Cookie Notice."],
    },
    {
      heading: "Changes to this policy",
      blocks: [
        "We may update this policy, for example when we add analytics or new services. The effective date above shows when it last changed. Material changes will be shown on this page.",
      ],
    },
  ],
};

export const termsOfUse: LegalDoc = {
  title: "Terms of Use",
  summary: "The terms that apply to using the Phyto Elements website and the information on it.",
  intro: [
    `These terms apply to your use of phytoelements.in, operated by ${e.name}, ${e.type} with its registered office at ${e.address}. By using the website you accept them.`,
    `Effective date: ${e.effective}.`,
  ],
  sections: [
    {
      heading: "Product information",
      blocks: [
        "Specifications on this website are representative. The values for a particular lot are those stated in the Certificate of Analysis (COA) supplied with that lot. Product information is provided for business buyers and may change without notice.",
      ],
    },
    {
      heading: "Images",
      blocks: [
        "Product and process images on this website are illustrative and were created with AI image tools. They are not photographs of our actual products, facilities or lots, and actual products may look different.",
      ],
    },
    {
      heading: "Quotations and orders",
      blocks: [
        "Prices and quotations given through the website or by email are indicative and not binding. They remain open to negotiation until a purchase order is issued. The terms of each sale, such as price, payment, delivery and Incoterms, are agreed in writing before the sale is finalised.",
      ],
    },
    {
      heading: "Import and regulatory compliance",
      blocks: [
        "The buyer is responsible for complying with the import, registration and other regulatory requirements of its own country for any product it buys from us.",
      ],
    },
    {
      heading: "Use of the website",
      blocks: [
        "You may use this website to learn about our products and to contact us. You must not misuse it, for example by attempting to gain unauthorised access, interfering with its operation, or submitting false or automated enquiries.",
      ],
    },
    {
      heading: "Intellectual property",
      blocks: [
        `The ${e.name} name and logo, and the text and design of this website, belong to ${e.name}. You may not copy or reuse them without our written permission, except to share links to our pages.`,
      ],
    },
    {
      heading: "Limitation of liability",
      blocks: [
        "We take care to keep the website accurate and available, but it is provided as it is, without warranties of any kind. To the extent the law allows, we are not liable for any loss arising from use of, or reliance on, the website or its content. Nothing in these terms limits any liability that cannot be limited by law.",
      ],
    },
    {
      heading: "Links to other websites",
      blocks: ["Links to other websites are provided for convenience. We are not responsible for their content."],
    },
    {
      heading: "Governing law and courts",
      blocks: [
        "These terms are governed by the laws of India and the State of Telangana. The courts at Hyderabad, Telangana have exclusive jurisdiction over any dispute arising from them.",
      ],
    },
    {
      heading: "Changes and contact",
      blocks: [
        `We may update these terms; the effective date above shows when they last changed. Questions and legal notices: ${e.email}.`,
      ],
    },
  ],
};

export const cookieNotice: LegalDoc = {
  title: "Cookie Notice",
  summary: "Which cookies and similar technologies the Phyto Elements website uses.",
  intro: [
    "Cookies are small files a website stores in your browser. This notice explains what this website uses today.",
    `Effective date: ${e.effective}.`,
  ],
  sections: [
    {
      heading: "What we use today",
      blocks: [
        {
          list: [
            "Strictly necessary security cookies: our hosting and security provider, Cloudflare, may set short-lived cookies to protect the site and its forms from bots and abuse. Turnstile, the spam check on our forms, works the same way.",
            "Cookie-free statistics: Cloudflare Web Analytics counts page views without cookies and without identifying you.",
          ],
        },
        "We do not use advertising or tracking cookies, and we do not store your preferences in your browser.",
      ],
    },
    {
      heading: "Your choices",
      blocks: [
        "Strictly necessary cookies are needed for the site to work securely and do not need consent. You can block or delete cookies in your browser settings, but the forms may not work without them.",
      ],
    },
    {
      heading: "Analytics in future",
      blocks: [
        "We plan to add Google Analytics and LinkedIn analytics. Before they are switched on, this notice will be updated and the website will ask for your consent; they will not run unless you accept.",
      ],
    },
    {
      heading: "Contact",
      blocks: [`Questions about cookies: ${e.email}.`],
    },
  ],
};
