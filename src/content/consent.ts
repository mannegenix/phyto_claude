/** Cookie banner and settings copy (client chose the bottom bar, Nov 2026). */
export const consentCopy = {
  title: "Cookies for analytics",
  body: "We'd like to use Google Analytics and LinkedIn cookies to see how buyers use this site and to improve it. They run only if you accept; you can change your choice any time under Cookie settings in the footer.",
  settingsTitle: "Cookie settings",
  settingsIntro: "Choose which cookies we may use. You can change this any time from the footer.",
  groups: {
    necessary: {
      name: "Strictly necessary",
      text: "Security and spam protection for the site and its forms (Cloudflare, Turnstile), and remembering this choice. Always on.",
    },
    analytics: {
      name: "Analytics",
      text: "Google Analytics: pages viewed, how visitors arrive, country and device, and when an enquiry is sent. No names, emails or phone numbers.",
    },
    marketing: {
      name: "Marketing",
      text: "LinkedIn Insight Tag: which industries and job functions visit, and measuring LinkedIn campaigns.",
    },
  },
};
export type ConsentCopy = typeof consentCopy;
