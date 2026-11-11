"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, ShieldCheck } from "lucide-react";
import type {
  LegalCrossLinkCard,
  LegalSectionItem,
} from "@/components/legal/types";
import { cn } from "@/utils/cn";

export interface LegalTableOfContentsProps {
  sections: readonly LegalSectionItem[];
  tocNavId: string;
  tocAriaLabel: string;
  crossLinkCard?: LegalCrossLinkCard;
}

export function LegalTableOfContents({
  sections,
  tocNavId,
  tocAriaLabel,
  crossLinkCard,
}: LegalTableOfContentsProps) {
  const firstSectionId = sections[0]?.id ?? "";
  const lastSectionId = sections[sections.length - 1]?.id ?? firstSectionId;

  const validSectionIds = useMemo(
    () => new Set(sections.map((item) => item.id)),
    [sections],
  );

  const [activeId, setActiveId] = useState<string>(firstSectionId);
  const [mobileOpen, setMobileOpen] = useState(false);
  const manualScrollUntilRef = useRef<number>(0);

  const scrollToSection = useCallback(
    (id: string, behavior: ScrollBehavior = "smooth") => {
      const target = document.getElementById(id);
      if (!target) return;
      manualScrollUntilRef.current = Date.now() + 900;
      setActiveId(id);
      target.scrollIntoView({ behavior, block: "start" });
    },
    [],
  );

  // Sync initial URL hash + handle browser back/forward navigation
  useEffect(() => {
    const initialHash = window.location.hash.replace(/^#/, "");
    let frame = 0;

    if (initialHash && validSectionIds.has(initialHash)) {
      frame = window.requestAnimationFrame(() => {
        scrollToSection(initialHash, "instant");
      });
    }

    const handleHashOrPop = () => {
      const hashId = window.location.hash.replace(/^#/, "");
      if (hashId && validSectionIds.has(hashId)) {
        scrollToSection(hashId, "smooth");
      } else {
        manualScrollUntilRef.current = Date.now() + 600;
        setActiveId(firstSectionId);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    window.addEventListener("hashchange", handleHashOrPop);
    window.addEventListener("popstate", handleHashOrPop);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", handleHashOrPop);
      window.removeEventListener("popstate", handleHashOrPop);
    };
  }, [firstSectionId, scrollToSection, validSectionIds]);

  // Scroll-spy to highlight the currently active section while scrolling
  useEffect(() => {
    let rafId = 0;

    const updateActiveOnScroll = () => {
      rafId = 0;
      if (Date.now() < manualScrollUntilRef.current) {
        return;
      }

      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 40;
      if (nearBottom) {
        setActiveId(lastSectionId);
        return;
      }

      let currentId = firstSectionId;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 150) {
          currentId = section.id;
        } else {
          break;
        }
      }
      setActiveId(currentId);
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateActiveOnScroll);
      }
    };

    const cancelManualLock = () => {
      manualScrollUntilRef.current = 0;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", cancelManualLock, { passive: true });
    window.addEventListener("touchstart", cancelManualLock, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", cancelManualLock);
      window.removeEventListener("touchstart", cancelManualLock);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [firstSectionId, lastSectionId, sections]);

  function handleLinkClick(
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) {
    event.preventDefault();
    const nextHash = `#${id}`;
    if (window.location.hash !== nextHash) {
      window.history.pushState(null, "", nextHash);
    }
    scrollToSection(id, "smooth");
    setMobileOpen(false);
  }

  const activeSection =
    sections.find((item) => item.id === activeId) ?? sections[0];

  return (
    <aside
      className="space-y-4 md:sticky md:top-24"
      aria-label="Table of contents"
    >
      <div className="rounded-2xl border border-slate-200/90 bg-[#F8FAFC] p-4 sm:p-5 dark:border-white/10 dark:bg-[#062C20]">
        {/* Mobile Collapsible Header Button (< md) */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-expanded={mobileOpen}
          aria-controls={tocNavId}
          className="flex w-full cursor-pointer items-center justify-between gap-3 text-left focus-visible:rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#059669] md:hidden"
        >
          <div className="min-w-0">
            <span className="block text-xs font-bold tracking-[0.12em] text-[#059669] uppercase dark:text-emerald-400">
              On this page
            </span>
            {activeSection ? (
              <span className="mt-0.5 block truncate text-sm font-semibold text-[#0F172A] dark:text-white">
                {activeSection.number}. {activeSection.tocTitle}
              </span>
            ) : null}
          </div>
          <span className="btn-leaf-sm inline-flex h-8 w-8 shrink-0 items-center justify-center border border-slate-200 bg-white text-slate-600 dark:border-white/15 dark:bg-[#041D15] dark:text-emerald-200">
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                mobileOpen && "rotate-180",
              )}
              aria-hidden="true"
            />
          </span>
        </button>

        {/* Desktop & Tablet Permanent Heading */}
        <h2 className="hidden px-2.5 text-xs font-bold tracking-[0.12em] text-[#0F172A] uppercase md:block dark:text-emerald-100">
          On this page
        </h2>

        {/* Navigation Links List */}
        <nav
          id={tocNavId}
          aria-label={tocAriaLabel}
          className={cn(
            "mt-3.5 md:mt-3 md:block",
            mobileOpen
              ? "block border-t border-slate-200/80 pt-3 dark:border-white/10"
              : "hidden",
          )}
        >
          <ul className="space-y-1">
            {sections.map((item) => {
              const isActive = item.id === activeId;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => handleLinkClick(e, item.id)}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg border-l-2 px-3 py-2 text-sm leading-snug transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#059669]",
                      isActive
                        ? "border-[#059669] bg-emerald-50/90 font-semibold text-[#047857] dark:border-emerald-400 dark:bg-emerald-500/15 dark:text-emerald-200"
                        : "border-transparent text-slate-600 hover:border-slate-300 hover:bg-white/80 hover:text-[#0F172A] dark:text-emerald-100/75 dark:hover:border-white/25 dark:hover:bg-[#041D15]/70 dark:hover:text-white",
                    )}
                  >
                    <span
                      className={cn(
                        "w-4 shrink-0 font-mono text-xs",
                        isActive
                          ? "font-semibold text-[#059669] dark:text-emerald-300"
                          : "text-slate-400 dark:text-emerald-200/50",
                      )}
                    >
                      {item.number}.{" "}
                    </span>
                    <span>{item.tocTitle}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Optional Subtle Legal Cross-Link Card */}
      {crossLinkCard ? (
        <div className="rounded-2xl border border-slate-200/90 bg-[#F8FAFC] p-4 sm:p-5 dark:border-white/10 dark:bg-[#062C20]">
          <div className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#154F96] ring-1 ring-blue-200/75 dark:bg-blue-500/15 dark:text-blue-300 dark:ring-blue-400/25"
            >
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#0F172A] dark:text-emerald-50">
                {crossLinkCard.prompt}
              </p>
              <Link
                href={crossLinkCard.href}
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[#059669] transition-colors hover:text-[#047857] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#059669] dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                <span>{crossLinkCard.linkLabel}</span>
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </aside>
  );
}

