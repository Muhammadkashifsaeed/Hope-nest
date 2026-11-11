import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Home } from "lucide-react";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  description:
    "Looks like this page couldn't be found. Return to HopeNest Home or explore upcoming community events.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <section
      aria-labelledby="not-found-heading"
      className="relative flex flex-1 items-center overflow-x-clip bg-gradient-to-b from-white via-[#F8FAFC] to-white py-14 sm:py-16 lg:py-20 dark:from-[#03120D] dark:via-[#041711] dark:to-[#03120D]"
    >
      {/* Subtle Blue & Green Ambient Accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(16,185,129,0.08),transparent_52%),radial-gradient(ellipse_at_bottom_right,rgba(21,79,150,0.08),transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top_left,rgba(16,185,129,0.16),transparent_52%),radial-gradient(ellipse_at_bottom_right,rgba(37,99,235,0.12),transparent_55%)]"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[1.08fr_0.92fr] md:gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14">
          {/* LEFT SIDE — Large 404 Display, Heading & Two Action Buttons */}
          <div className="max-w-xl text-left">
            <div className="flex flex-wrap items-center gap-3.5 sm:gap-4">
              <p className="bg-gradient-to-r from-[#059669] via-[#0F766E] to-[#154F96] bg-clip-text pr-1 text-7xl leading-none font-black tracking-tight text-transparent select-none sm:text-8xl lg:text-[6.75rem] dark:from-emerald-400 dark:via-teal-300 dark:to-sky-400">
                404
              </p>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/85 bg-emerald-50/90 px-3 py-1 text-[11px] font-bold tracking-[0.14em] text-[#059669] uppercase dark:border-emerald-400/25 dark:bg-emerald-500/15 dark:text-emerald-300">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-[#059669] dark:bg-emerald-400"
                />
                <span>PAGE NOT FOUND</span>
              </span>
            </div>

            <h1
              id="not-found-heading"
              className="mt-4 text-4xl leading-[1.08] font-extrabold tracking-tight text-[#0F172A] sm:mt-5 sm:text-5xl lg:text-[3.2rem] dark:text-white"
            >
              Oops! This page{" "}
              <span className="block">wandered off.</span>
            </h1>

            <p className="mt-4 max-w-lg text-base leading-[1.7] text-slate-600 sm:mt-5 sm:text-lg dark:text-emerald-100/80">
              Looks like this page couldn&apos;t be found.
              <span className="mt-1 block">
                Let&apos;s get you back to making a difference.
              </span>
            </p>

            {/* Action Buttons */}
            <div className="mt-7 flex flex-col gap-3.5 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href="/"
                className="btn-leaf inline-flex h-12 items-center justify-center gap-2 bg-[#0F172A] px-6 text-sm font-semibold whitespace-nowrap text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-black hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F172A] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:text-[15px] dark:border dark:border-white/20 dark:bg-[#090D16] dark:hover:bg-black dark:focus-visible:outline-white"
              >
                <Home className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Back to Home</span>
              </Link>

              <Link
                href="/events"
                className="btn-leaf inline-flex h-12 items-center justify-center gap-2 bg-[#059669] px-6 text-sm font-semibold whitespace-nowrap text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#047857] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#059669] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:text-[15px] dark:hover:bg-[#10B981]"
              >
                <Calendar className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Explore Events</span>
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE — Existing 404 Illustration */}
          <div className="relative mx-auto w-full max-w-[540px]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-emerald-200/35 via-sky-100/35 to-amber-100/40 blur-2xl dark:from-emerald-500/15 dark:via-blue-500/15 dark:to-amber-400/10"
            />
            <div className="overflow-hidden rounded-3xl border border-slate-200/85 bg-[#FFFAD6] shadow-[0_24px_60px_-18px_rgba(15,23,42,0.16)] ring-1 ring-black/[0.03] dark:border-white/15 dark:shadow-[0_24px_60px_-18px_rgba(0,0,0,0.6)]">
              <Image
                src="/images/not-found.webp"
                alt="Lost traveler looking at a map beside a signpost pointing toward Home and Events"
                width={900}
                height={730}
                preload
                sizes="(max-width: 767px) 92vw, (max-width: 1023px) 44vw, 540px"
                className="block h-auto w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


