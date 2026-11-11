import Link from "next/link";
import { ArrowLeft, Calendar, Mail } from "lucide-react";
import { LegalTableOfContents } from "@/components/legal/LegalTableOfContents";
import type { LegalDocumentConfig } from "@/components/legal/types";

export interface LegalDocumentViewProps {
  document: LegalDocumentConfig;
}

export function LegalDocumentView({ document }: LegalDocumentViewProps) {
  const titleId = `${document.idPrefix}-title`;
  const tocNavId = `${document.idPrefix}-toc-nav`;
  const backHref = document.backHref ?? "/";
  const backLabel = document.backLabel ?? "Back to HopeNest";

  return (
    <div className="flex-1 bg-white dark:bg-[#03120D]">
      {/* Page Introduction Band */}
      <section
        aria-labelledby={titleId}
        className="border-b border-slate-200/85 bg-[#F8FAFC] pt-8 pb-11 sm:pt-10 sm:pb-14 lg:pt-12 lg:pb-16 dark:border-white/10 dark:bg-[#041711]"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Top Navigation: Back to HopeNest */}
          <div>
            <Link
              href={backHref}
              className="btn-leaf-sm inline-flex items-center gap-2 border border-slate-200/90 bg-white px-3.5 py-2 text-sm font-semibold text-[#0F172A] transition-colors hover:border-[#059669]/45 hover:text-[#059669] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#059669] dark:border-white/15 dark:bg-[#062C20] dark:text-emerald-100 dark:hover:border-emerald-400/45 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{backLabel}</span>
            </Link>
          </div>

          {/* Intro Heading & Description */}
          <div className="mt-7 max-w-3xl sm:mt-8">
            <div className="inline-flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="h-0.5 w-6 rounded-full bg-[#059669] dark:bg-emerald-400"
              />
              <span className="text-xs font-bold tracking-[0.14em] text-[#059669] uppercase sm:text-sm dark:text-emerald-400">
                {document.eyebrow}
              </span>
            </div>

            <h1
              id={titleId}
              className="mt-3.5 text-4xl leading-[1.08] font-extrabold tracking-tight text-[#0F172A] sm:text-5xl lg:text-[3.15rem] dark:text-white"
            >
              {document.title}
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-[1.7] text-slate-600 sm:mt-5 sm:text-lg dark:text-emerald-100/80">
              {document.description}
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-slate-200/80 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600 sm:text-sm dark:border-white/10 dark:bg-[#062C20] dark:text-emerald-100/80">
              <Calendar
                className="h-4 w-4 shrink-0 text-[#154F96] dark:text-blue-300"
                aria-hidden="true"
              />
              <span>Last updated: {document.lastUpdated}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Two-Column Legal Document Layout */}
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-[230px_1fr] md:gap-8 lg:grid-cols-[270px_1fr] lg:gap-12 xl:grid-cols-[290px_1fr]">
          {/* Left Side — Sticky Table of Contents (Collapsible on Mobile) */}
          <LegalTableOfContents
            sections={document.sections}
            tocNavId={tocNavId}
            tocAriaLabel={document.tocAriaLabel}
            crossLinkCard={document.crossLinkCard}
          />

          {/* Right Side — Legal Document Content */}
          <article
            aria-label={document.documentAriaLabel}
            className="max-w-3xl divide-y divide-slate-200/85 dark:divide-white/10"
          >
            {document.sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                aria-labelledby={`${section.id}-heading`}
                className="scroll-mt-24 py-8 first:pt-0 last:pb-0 sm:py-9"
              >
                <div className="flex items-baseline gap-3">
                  <span className="inline-flex h-7 min-w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 px-2 font-mono text-xs font-bold text-[#154F96] ring-1 ring-blue-200/75 dark:bg-blue-500/15 dark:text-blue-300 dark:ring-blue-400/25">
                    {section.number}
                  </span>
                  <h2
                    id={`${section.id}-heading`}
                    className="text-xl font-bold tracking-tight text-[#0F172A] sm:text-2xl dark:text-white"
                  >
                    {section.number}. {section.heading}
                  </h2>
                </div>

                {section.subsections ? (
                  <div className="mt-5 space-y-6">
                    {section.subsections.map((sub) => (
                      <div key={sub.heading} className="space-y-2">
                        <h3 className="text-base font-semibold text-[#1E293B] sm:text-[1.0625rem] dark:text-emerald-100">
                          {sub.heading}
                        </h3>
                        <p className="text-[15px] leading-[1.75] text-slate-600 sm:text-base dark:text-emerald-100/80">
                          {sub.body}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}

                {section.ctaText ? (
                  <div className="mt-5 rounded-2xl border border-slate-200/90 bg-[#F8FAFC] p-6 sm:p-7 dark:border-white/10 dark:bg-[#062C20]">
                    {section.ctaTitle ? (
                      <h3 className="mb-2 text-base font-semibold text-[#1E293B] sm:text-[1.0625rem] dark:text-emerald-100">
                        {section.ctaTitle}
                      </h3>
                    ) : null}

                    <p className="text-[15px] leading-[1.75] text-slate-600 sm:text-base dark:text-emerald-100/85">
                      {section.ctaText}
                    </p>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                      <a
                        href="mailto:support@hopenest.com"
                        className="btn-leaf inline-flex h-11 items-center justify-center gap-2 bg-[#059669] px-6 text-sm font-semibold whitespace-nowrap text-white transition-colors hover:bg-[#047857] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#059669] dark:hover:bg-[#10B981]"
                      >
                        <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span>Contact Support</span>
                      </a>

                      <Link
                        href="/contact"
                        className="btn-leaf inline-flex h-11 items-center justify-center border border-slate-200 bg-white px-5 text-sm font-semibold whitespace-nowrap text-[#0F172A] transition-colors hover:border-[#154F96]/40 hover:text-[#154F96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#154F96] dark:border-white/15 dark:bg-[#041D15] dark:text-emerald-100 dark:hover:border-emerald-400/40 dark:hover:text-white"
                      >
                        Visit Contact Page
                      </Link>
                    </div>
                  </div>
                ) : null}
              </section>
            ))}
          </article>
        </div>
      </div>
    </div>
  );
}

