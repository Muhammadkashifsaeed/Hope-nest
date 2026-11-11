"use client";

import {
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type TouchEvent,
} from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { EventCard } from "@/components/events/EventCard";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { upcomingEvents } from "@/lib/events";
import { cn } from "@/utils/cn";

const SWIPE_THRESHOLD_PX = 40;
const AUTO_ADVANCE_MS = 4500;

export function UpcomingEventsSection() {
  const isTablet = useMediaQuery("(min-width: 640px)");
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const prefersReducedMotion = useMediaQuery(
    "(prefers-reduced-motion: reduce)",
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const cardsPerView = isDesktop ? 3 : isTablet ? 2 : 1;
  const maxIndex = Math.max(0, upcomingEvents.length - cardsPerView);
  const totalSteps = maxIndex + 1;
  const safeIndex = Math.min(activeIndex, maxIndex);

  const firstVisibleIndex = safeIndex;
  const lastVisibleIndex = Math.min(
    upcomingEvents.length - 1,
    safeIndex + cardsPerView - 1,
  );
  const visibleStartNumber = firstVisibleIndex + 1;
  const visibleEndNumber = lastVisibleIndex + 1;

  useEffect(() => {
    if (isPaused || prefersReducedMotion || totalSteps <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => {
        const current = Math.min(prev, maxIndex);
        return current >= maxIndex ? 0 : current + 1;
      });
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(timer);
  }, [isPaused, prefersReducedMotion, totalSteps, maxIndex]);

  function goToPrev() {
    setActiveIndex((prev) => {
      const current = Math.min(prev, maxIndex);
      return current <= 0 ? maxIndex : current - 1;
    });
  }

  function goToNext() {
    setActiveIndex((prev) => {
      const current = Math.min(prev, maxIndex);
      return current >= maxIndex ? 0 : current + 1;
    });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToPrev();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goToNext();
    }
  }

  function handleBlurCapture(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsPaused(false);
    }
  }

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    setIsPaused(true);
    const touch = event.touches[0];
    if (!touch) return;
    touchStartXRef.current = touch.clientX;
    touchStartYRef.current = touch.clientY;
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    setIsPaused(false);
    const startX = touchStartXRef.current;
    const startY = touchStartYRef.current;
    touchStartXRef.current = null;
    touchStartYRef.current = null;

    if (startX === null || startY === null) return;
    const touch = event.changedTouches[0];
    if (!touch) return;

    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;

    // Only treat horizontal gestures stronger than vertical scrolling as a swipe.
    if (
      Math.abs(deltaX) >= SWIPE_THRESHOLD_PX &&
      Math.abs(deltaX) > Math.abs(deltaY)
    ) {
      if (deltaX < 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
  }

  const translateX =
    safeIndex === 0 ? "0%" : `-${(safeIndex * 100) / cardsPerView}%`;

  return (
    <section
      aria-labelledby="upcoming-events-heading"
      className="relative overflow-x-clip border-b border-slate-200/80 bg-[#F8FAFC] py-14 sm:py-16 lg:py-20 dark:border-white/10 dark:bg-[#041711]"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1.5">
            <h2
              id="upcoming-events-heading"
              className="text-2xl font-bold tracking-tight text-[#072B20] sm:text-3xl dark:text-white"
            >
              Upcoming Events
            </h2>
            <p className="text-sm text-slate-600 sm:text-base dark:text-emerald-100/75">
              Join hands near you — here&apos;s what&apos;s happening next.
            </p>
          </div>

          <Link
            href="/events"
            className="group inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-[#059669] transition-colors hover:text-[#047857] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#059669] dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            <span>View All</span>
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>

        {/* One-by-One Responsive Carousel */}
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Upcoming community events"
          onKeyDown={handleKeyDown}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={handleBlurCapture}
          className="relative mt-8 sm:mt-10"
        >
          {/* Floating Left Arrow (Tablet & Desktop, slightly overlapping card border margin) */}
          <button
            type="button"
            onClick={goToPrev}
            aria-label="Previous event"
            className="btn-leaf hidden sm:inline-flex absolute top-1/2 -left-5 z-20 h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center border border-slate-200/95 bg-white text-slate-700 shadow-[0_8px_22px_-6px_rgba(15,23,42,0.18)] transition-all hover:scale-105 hover:border-[#059669] hover:text-[#059669] hover:shadow-[0_10px_24px_-6px_rgba(5,150,105,0.25)] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#059669] lg:h-11 lg:w-11 lg:-left-6 dark:border-white/15 dark:bg-[#083526] dark:text-emerald-100 dark:hover:border-emerald-400 dark:hover:text-white"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>

          {/* Floating Right Arrow (Tablet & Desktop, slightly overlapping card border margin) */}
          <button
            type="button"
            onClick={goToNext}
            aria-label="Next event"
            className="btn-leaf hidden sm:inline-flex absolute top-1/2 -right-5 z-20 h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center border border-slate-200/95 bg-white text-slate-700 shadow-[0_8px_22px_-6px_rgba(15,23,42,0.18)] transition-all hover:scale-105 hover:border-[#059669] hover:text-[#059669] hover:shadow-[0_10px_24px_-6px_rgba(5,150,105,0.25)] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#059669] lg:h-11 lg:w-11 lg:-right-6 dark:border-white/15 dark:bg-[#083526] dark:text-emerald-100 dark:hover:border-emerald-400 dark:hover:text-white"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>

          {/* Overflow-safe Slide Track Viewport */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="-mx-2 -my-3 overflow-hidden py-3 sm:-mx-3"
          >
            <div
              className="flex items-stretch transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
              style={{ transform: `translate3d(${translateX}, 0, 0)` }}
            >
              {upcomingEvents.map((event, index) => {
                const isVisible =
                  index >= firstVisibleIndex && index <= lastVisibleIndex;

                return (
                  <div
                    key={event.id}
                    aria-hidden={!isVisible}
                    className="w-full shrink-0 px-2 sm:w-1/2 sm:px-3 lg:w-1/3"
                  >
                    <EventCard
                      event={event}
                      variant="compact"
                      badgeLabel={event.homeBadgeLabel ?? event.category}
                      linkTabIndex={isVisible ? undefined : -1}
                      eagerImage
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Arrow Controls, Step Indicators & Accessible Live Counter */}
          <div className="mt-6 flex items-center justify-between gap-4 sm:justify-center">
            <button
              type="button"
              onClick={goToPrev}
              aria-label="Previous event"
              className="btn-leaf-sm inline-flex h-10 w-10 cursor-pointer items-center justify-center border border-slate-200 bg-white text-slate-700 shadow-xs transition-all hover:border-[#059669] hover:text-[#059669] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#059669] sm:hidden dark:border-white/15 dark:bg-[#083526] dark:text-emerald-100"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>

            <div className="flex items-center gap-3">
              <div
                className="flex items-center gap-2"
                role="group"
                aria-label="Event carousel slides"
              >
                {Array.from({ length: totalSteps }, (_, index) => {
                  const active = index === safeIndex;
                  return (
                    <button
                      key={index}
                      type="button"
                      aria-pressed={active}
                      aria-label={`Slide to event ${index + 1}`}
                      onClick={() => setActiveIndex(index)}
                      className={cn(
                        "h-2 cursor-pointer rounded-full transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#059669]",
                        active
                          ? "w-6 bg-[#059669] dark:bg-emerald-400"
                          : "w-2 bg-slate-300 hover:bg-slate-400 dark:bg-white/25 dark:hover:bg-white/40",
                      )}
                    />
                  );
                })}
              </div>

              <span
                aria-live="polite"
                className="text-xs font-medium tabular-nums text-slate-500 dark:text-emerald-100/70"
              >
                {cardsPerView === 1
                  ? `${visibleStartNumber} / ${upcomingEvents.length}`
                  : `${visibleStartNumber}–${visibleEndNumber} of ${upcomingEvents.length}`}
              </span>
            </div>

            <button
              type="button"
              onClick={goToNext}
              aria-label="Next event"
              className="btn-leaf-sm inline-flex h-10 w-10 cursor-pointer items-center justify-center border border-slate-200 bg-white text-slate-700 shadow-xs transition-all hover:border-[#059669] hover:text-[#059669] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#059669] sm:hidden dark:border-white/15 dark:bg-[#083526] dark:text-emerald-100"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
