import type { Metadata } from "next";
import { PrivacyPolicyView } from "@/components/privacy/PrivacyPolicyView";
import { buildPageMetadata } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description:
    "Read HopeNest's Privacy Policy covering contact submissions, local theme preferences, data security safeguards, and your privacy rights.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return <PrivacyPolicyView />;
}

