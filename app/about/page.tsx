import type { Metadata } from "next";
import { AboutCtaSection } from "@/components/about/AboutCtaSection";
import { AboutHopeNestSection } from "@/components/about/AboutHopeNestSection";
import { HowItWorksSection } from "@/components/about/HowItWorksSection";
import { buildPageMetadata } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "About",
  description:
    "Learn how HopeNest connects volunteers, organizers, and donors through meaningful social-impact community events.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <AboutHopeNestSection />
      <HowItWorksSection />
      <AboutCtaSection />
    </>
  );
}
