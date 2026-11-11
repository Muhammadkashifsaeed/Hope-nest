import type { Metadata } from "next";
import { ContactDetailsCard } from "@/components/contact/ContactDetailsCard";
import { ContactFormCard } from "@/components/contact/ContactFormCard";
import { ContactHeroSection } from "@/components/contact/ContactHeroSection";
import { ContactQuickLinksSection } from "@/components/contact/ContactQuickLinksSection";
import { buildPageMetadata } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description:
    "Have questions or need support? Reach out to the HopeNest team using the contact form or connect with us directly.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <ContactHeroSection />

      <section
        aria-label="Contact form and details"
        className="flex-1 bg-[#F8FAFC] py-12 sm:py-16 lg:py-20 dark:bg-[#041711]"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-7 md:grid-cols-[1.2fr_0.95fr] md:gap-6 lg:grid-cols-[1.35fr_0.85fr] lg:gap-10">
            <ContactFormCard />
            <ContactDetailsCard />
          </div>
        </div>
      </section>

      <ContactQuickLinksSection />
    </>
  );
}

