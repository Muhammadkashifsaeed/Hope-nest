import type {
  LegalDocumentConfig,
  LegalSectionItem,
} from "@/components/legal/types";

export const TERMS_SECTIONS: readonly LegalSectionItem[] = [
  {
    id: "acceptance-of-terms",
    number: "1",
    tocTitle: "Acceptance of Terms",
    heading: "Acceptance of Terms",
    subsections: [
      {
        heading: "Binding Agreement",
        body: "By accessing, browsing, or registering an account on HopeNest, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use the platform.",
      },
      {
        heading: "Updates to Terms",
        body: "We may revise these terms periodically to reflect new features, legal requirements, or operational changes. Continued use of HopeNest after updates constitutes acceptance of the revised terms.",
      },
    ],
  },
  {
    id: "accounts-security",
    number: "2",
    tocTitle: "User Accounts & Authentication",
    heading: "User Accounts & Authentication",
    subsections: [
      {
        heading: "Account Accuracy",
        body: "You must provide accurate, complete, and current information when creating an account or signing in via OAuth providers (such as Google or GitHub).",
      },
      {
        heading: "Session & Credential Security",
        body: "You are responsible for safeguarding your account credentials and active sessions. Notify us immediately if you suspect any unauthorized access or security breach on your account.",
      },
    ],
  },
  {
    id: "event-organizers",
    number: "3",
    tocTitle: "Event Creation & Organizer Responsibilities",
    heading: "Event Creation & Organizer Responsibilities",
    subsections: [
      {
        heading: "Accurate Event Listings",
        body: "Organizers must provide truthful and complete event details, including date, time, venue/online link, ticket pricing, and capacity limits.",
      },
      {
        heading: "Event Fulfillment & Cancellations",
        body: "Organizers are solely responsible for hosting their listed events, communicating schedule changes to attendees, and honoring stated cancellation or refund policies.",
      },
    ],
  },
  {
    id: "tickets-bookings",
    number: "4",
    tocTitle: "Registrations, Tickets & Bookings",
    heading: "Registrations, Tickets & Bookings",
    subsections: [
      {
        heading: "Valid Reservations",
        body: "Ticket bookings and RSVPs made through HopeNest are issued for personal or authorized attendee use. Misuse, unauthorized resale, or fraudulent booking activity may result in ticket cancellation.",
      },
      {
        heading: "Organizer Rules",
        body: "Attendees must comply with all venue safety protocols, age restrictions, and specific guidelines established by the event organizer.",
      },
    ],
  },
  {
    id: "prohibited-conduct",
    number: "5",
    tocTitle: "Prohibited Activities",
    heading: "Prohibited Activities",
    subsections: [
      {
        heading: "Platform Integrity",
        body: "You agree not to post fraudulent or illegal events, spam attendees, scrape platform data, bypass authentication or route authorization checks, or interfere with HopeNest's servers and APIs.",
      },
      {
        heading: "Account Suspension",
        body: "We reserve the right to remove prohibited event listings and suspend or terminate accounts that violate these guidelines without prior notice.",
      },
    ],
  },
  {
    id: "intellectual-property",
    number: "6",
    tocTitle: "Content & Intellectual Property",
    heading: "Content & Intellectual Property",
    subsections: [
      {
        heading: "Platform Ownership",
        body: "HopeNest's branding, user interface design, code architecture, and original graphics are protected by copyright and intellectual property laws.",
      },
      {
        heading: "Organizer Content License",
        body: "You retain ownership of the text, banners, and media you upload for your events, but grant HopeNest a non-exclusive license to display and promote that content on the platform.",
      },
    ],
  },
  {
    id: "limitation-of-liability",
    number: "7",
    tocTitle: "Disclaimers & Limitation of Liability",
    heading: "Disclaimers & Limitation of Liability",
    subsections: [
      {
        heading: "Platform Role",
        body: "HopeNest provides the technical infrastructure for discovering and managing events. We are not the organizer or owner of third-party events listed on the platform and are not liable for event cancellations, venue incidents, or disputes between hosts and attendees.",
      },
    ],
  },
  {
    id: "contact-legal",
    number: "8",
    tocTitle: "Contact & Support",
    heading: "Contact & Support",
    ctaTitle: "Questions About These Terms?",
    ctaText:
      "If you need clarification on organizer responsibilities, ticketing rules, or account policies on HopeNest, get in touch with our team.",
  },
];

export const TERMS_OF_SERVICE_DOCUMENT: LegalDocumentConfig = {
  idPrefix: "terms-of-service",
  eyebrow: "Platform Rules & Guidelines",
  title: "Terms of Service",
  description:
    "Please read these terms carefully before creating events, booking tickets, or managing your account on HopeNest.",
  lastUpdated: "November 2, 2026",
  backHref: "/",
  backLabel: "Back to HopeNest",
  documentAriaLabel: "Terms of Service Document",
  tocAriaLabel: "Terms of service sections",
  sections: TERMS_SECTIONS,
  crossLinkCard: {
    prompt: "Looking for how we handle your data?",
    linkLabel: "Read our Privacy Policy",
    href: "/privacy-policy",
  },
};

