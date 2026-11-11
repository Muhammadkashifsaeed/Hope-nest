export interface LegalSubSection {
  heading: string;
  body: string;
}

export interface LegalSectionItem {
  id: string;
  number: string;
  tocTitle: string;
  heading: string;
  subsections?: readonly LegalSubSection[];
  ctaTitle?: string;
  ctaText?: string;
}

export interface LegalCrossLinkCard {
  prompt: string;
  linkLabel: string;
  href: string;
}

export interface LegalDocumentConfig {
  idPrefix: string;
  eyebrow: string;
  title: string;
  description: string;
  lastUpdated: string;
  backHref?: string;
  backLabel?: string;
  documentAriaLabel: string;
  tocAriaLabel: string;
  sections: readonly LegalSectionItem[];
  crossLinkCard?: LegalCrossLinkCard;
}

