import type {
  LegalDocumentConfig,
  LegalSectionItem,
} from "@/components/legal/types";

export const PRIVACY_SECTIONS: readonly LegalSectionItem[] = [
  {
    id: "information-we-collect",
    number: "1",
    tocTitle: "Information We Collect",
    heading: "Information We Collect",
    subsections: [
      {
        heading: "Contact Inquiries & Newsletter Subscriptions",
        body: "When you submit an inquiry through the HopeNest Contact page, we collect your name, email address, selected inquiry subject, and message content so our team can respond. While navigation previews include links for Sign In and Sign Up, user accounts, password logins, and third-party OAuth providers (such as Google or GitHub) are not currently enabled, so no OAuth profile data, avatars, or authentication tokens are collected. If an administrator configures an optional newsletter service URL, submitting the footer signup form sends only the email address you enter.",
      },
      {
        heading: "Event Listings & Local Preview Interactions",
        body: "HopeNest currently provides public community event listings for discovery. Interactive RSVP toggles on event detail pages operate strictly as local browser UI previews and do not transmit attendee registration records, digital ticket orders, or guest lists to a server. Event creation workflows are not active in the current build.",
      },
      {
        heading: "Technical & Request Data",
        body: "When your browser loads pages or sends requests to application APIs (such as the contact or health check routes), standard web transport metadata—such as request headers and hosting network logs managed by infrastructure—may be processed to deliver pages reliably. Stored contact inquiries contain only your submitted form fields, a generated reference ID, and a submission timestamp; HopeNest does not run advertising trackers or behavioral analytics profiles.",
      },
    ],
  },
  {
    id: "how-we-use-your-information",
    number: "2",
    tocTitle: "How We Use Your Information",
    heading: "How We Use Your Information",
    subsections: [
      {
        heading: "Responding to Inquiries & Site Operations",
        body: "We use the information you submit on the Contact page solely to validate, log, and respond to your questions, partnership requests, volunteer inquiries, or press messages. Because online event ticketing and registered member accounts are not active yet, we do not process attendee check-ins, issue digital tickets, or generate organizer guest lists.",
      },
      {
        heading: "Optional Operational Notifications",
        body: "If the site operator enables server-side email delivery (Resend) or webhook forwarding in deployment environment settings, submitted contact inquiries are routed to our support inbox so we can reply to you directly. Automated booking confirmations, event reminder emails, and account security alerts are not sent in the current version.",
      },
      {
        heading: "Reliability & Validation",
        body: "We validate incoming contact submissions against strict field rules to prevent malformed requests, maintain API uptime via health checks, and diagnose server errors.",
      },
    ],
  },
  {
    id: "information-sharing-and-disclosure",
    number: "3",
    tocTitle: "Information Sharing & Disclosure",
    heading: "Information Sharing & Disclosure",
    subsections: [
      {
        heading: "Event Organizers",
        body: "Because online event registration and attendee dashboards are not active in the current release, HopeNest does not collect participant sign-ups or share your name, email address, or RSVP status with third-party event hosts.",
      },
      {
        heading: "Infrastructure & Service Providers",
        body: "Contact inquiries are recorded on the application server and, only when explicitly configured by the site operator in server environment variables, transmitted to designated hosting, webhook, newsletter, or transactional email delivery providers (such as Resend) solely to handle your request. HopeNest never sells or rents your personal information to advertisers or data brokers.",
      },
    ],
  },
  {
    id: "cookies-and-session-management",
    number: "4",
    tocTitle: "Cookies & Session Management",
    heading: "Cookies & Session Management",
    subsections: [
      {
        heading: "Authentication & Session Cookies",
        body: "HopeNest does not currently use HTTP-only authentication cookies, JSON Web Tokens (JWT), or login session tokens because user sign-in and account sessions are not active in this version of the platform.",
      },
      {
        heading: "Local Preference Storage & Filter State",
        body: "We use browser local storage (specifically the hopenest-theme key) to remember whether you selected Light or Dark mode across visits. When filtering upcoming events by category, month, search query, or sort order, HopeNest reflects those filters directly in shareable URL query parameters rather than setting tracking cookies.",
      },
    ],
  },
  {
    id: "data-security",
    number: "5",
    tocTitle: "Data Security",
    heading: "Data Security",
    subsections: [
      {
        heading: "Safeguards Implemented Today",
        body: "We validate all contact form submissions on both client and server using Zod schemas, HTML-escape user input before composing optional server-side notification emails, keep all optional API keys strictly in server-only environment variables (never exposed to browser bundles), and rely on HTTPS/TLS encryption when deployed in production environments. Features associated with future account systems—such as credential hashing, JWT session signing, or database role-based authorization—are not active yet because user authentication is not implemented in the current build.",
      },
    ],
  },
  {
    id: "your-rights-and-choices",
    number: "6",
    tocTitle: "Your Rights & Choices",
    heading: "Your Rights & Choices",
    subsections: [
      {
        heading: "Access, Correction & Removal Requests",
        body: "Because user accounts and self-service member dashboards are not yet implemented, there is currently no online profile editor or in-app account deletion control. You can clear your saved Light/Dark theme preference at any time by switching themes in the header or clearing your browser's site storage. To request access to, updates for, or removal of any contact inquiry you previously sent to HopeNest, please contact our support team by email.",
      },
    ],
  },
  {
    id: "contact-us",
    number: "7",
    tocTitle: "Contact Us",
    heading: "Questions or Data Requests?",
    ctaText:
      "If you have any questions about this Privacy Policy, want to exercise your data rights, or need to report a security concern on HopeNest, reach out to our team.",
  },
];


export const PRIVACY_POLICY_DOCUMENT: LegalDocumentConfig = {
  idPrefix: "privacy-policy",
  eyebrow: "Trust & Transparency",
  title: "Privacy Policy",
  description:
    "At HopeNest, we respect your privacy and are committed to protecting the personal data you share when discovering, creating, and managing events.",
  lastUpdated: "November 2, 2026",
  backHref: "/",
  backLabel: "Back to HopeNest",
  documentAriaLabel: "Privacy Policy Document",
  tocAriaLabel: "Privacy policy sections",
  sections: PRIVACY_SECTIONS,
};
