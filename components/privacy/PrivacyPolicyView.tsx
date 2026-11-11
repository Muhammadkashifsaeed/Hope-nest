import { LegalDocumentView } from "@/components/legal/LegalDocumentView";
import { PRIVACY_POLICY_DOCUMENT } from "@/components/privacy/privacy-sections";

export function PrivacyPolicyView() {
  return <LegalDocumentView document={PRIVACY_POLICY_DOCUMENT} />;
}
