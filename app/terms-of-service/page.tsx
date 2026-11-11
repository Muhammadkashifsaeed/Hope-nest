import type { Metadata } from "next";
import { LegalDocumentView } from "@/components/legal/LegalDocumentView";
import { TERMS_OF_SERVICE_DOCUMENT } from "@/components/terms/terms-sections";
import { buildPageMetadata } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms of Service",
  description:
    "Read HopeNest's Terms of Service covering platform rules, organizer responsibilities, registrations, acceptable use, and support contact.",
  path: "/terms-of-service",
});

export default function TermsOfServicePage() {
  return <LegalDocumentView document={TERMS_OF_SERVICE_DOCUMENT} />;
}

