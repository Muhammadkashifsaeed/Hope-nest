import type { Metadata } from "next";
import { PrivacyPolicyView } from "@/components/privacy/PrivacyPolicyView";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read HopeNest's Privacy Policy covering contact submissions, local theme preferences, data security safeguards, and your privacy rights.",
  alternates: {
    canonical: "/privacy",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyView />;
}

