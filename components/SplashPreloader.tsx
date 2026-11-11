"use client";

import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";

type SplashPhase = "loading" | "exiting" | "done";

export function SplashPreloader() {
  const [phase, setPhase] = useState<SplashPhase>("loading");

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const exitDelay = prefersReducedMotion ? 180 : 1050;
    const unmountDelay = prefersReducedMotion ? 320 : 1450;

    const exitTimer = window.setTimeout(() => {
      setPhase("exiting");
    }, exitDelay);

    const unmountTimer = window.setTimeout(() => {
      setPhase("done");
    }, unmountDelay);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(unmountTimer);
    };
  }, []);

  if (phase === "done") {
    return null;
  }

  return (
    <div
      data-splash-preloader=""
      data-splash-phase={phase}
      role="status"
      aria-label="Loading HopeNest"
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-[#00291F] px-6 text-white transition-[opacity,transform] duration-400 ease-out motion-reduce:transition-none",
        phase === "exiting"
          ? "pointer-events-none scale-[1.015] opacity-0"
          : "scale-100 opacity-100",
      )}
    >
      {/* Subtle Ambient Brand Halo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(16,185,129,0.22),transparent_56%),radial-gradient(circle_at_50%_70%,rgba(251,191,36,0.08),transparent_52%)]"
      />

      {/* Centered HopeNest Wordmark + Animated Divider Loader */}
      <div className="relative flex w-full max-w-sm flex-col items-center text-center">
        <div className="flex items-baseline justify-center select-none">
          <span className="text-4xl font-extrabold tracking-tight text-[#10B981] sm:text-5xl">
            Hope
          </span>
          <span className="text-4xl font-extrabold tracking-tight text-[#FBBF24] sm:text-5xl">
            Nest
          </span>
        </div>

        <p className="mt-2.5 text-[11px] font-medium tracking-[0.24em] text-emerald-100/70 uppercase sm:text-xs">
          Social Development Events
        </p>

        {/* Centered Divider Progress Track */}
        <div
          aria-hidden="true"
          className="mt-6 h-[3px] w-52 overflow-hidden rounded-full bg-white/15 sm:w-64"
        >
          <div className="splash-progress-fill h-full w-full rounded-full bg-gradient-to-r from-[#10B981] via-[#34D399] to-[#FBBF24] shadow-[0_0_14px_rgba(16,185,129,0.75)]" />
        </div>

        {/* Minimal Loading Status */}
        <div className="mt-3.5 flex items-center justify-center gap-2 text-[11px] font-medium tracking-[0.22em] text-emerald-200/75 uppercase">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#10B981]"
          />
          <span>Loading</span>
        </div>
      </div>
    </div>
  );
}

