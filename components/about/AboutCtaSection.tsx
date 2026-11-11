import Link from "next/link";
import { ArrowRight, CalendarCheck, HeartHandshake, Plus, Users } from "lucide-react";

export function AboutCtaSection() {
  return (
    <section
      aria-labelledby="about-cta-heading"
      className="relative flex-1 overflow-x-clip bg-white py-14 sm:py-16 lg:py-20 dark:bg-[#03120D]"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          data-about-cta-container
          className="about-cta-mist-bg relative grid grid-cols-1 items-center overflow-hidden rounded-3xl border border-slate-200/90 shadow-[0_24px_60px_-18px_rgba(15,23,42,0.18)] md:grid-cols-[1.35fr_0.85fr] dark:border-white/20 dark:shadow-[0_24px_60px_-18px_rgba(0,0,0,0.55)]"
        >
          {/* Ambient Blurred Atmospheric Clouds Bridging Blue Into Soft White */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -left-16 h-64 w-64 rounded-full bg-white/8 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-[48%] h-72 w-72 -translate-y-1/2 rounded-full bg-sky-200/35 blur-3xl max-md:top-[58%] max-md:left-1/2 max-md:-translate-x-1/2"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 bottom-0 h-80 w-80 rounded-full bg-white/85 blur-3xl max-md:inset-x-0 max-md:h-48 max-md:w-full"
          />

          {/* LEFT SIDE: Unified Blue Zone Content with Yellow "Difference?" & CTAs */}
          <div
            data-about-cta-left
            className="relative z-10 flex flex-col justify-center p-8 text-left sm:p-10 lg:p-14"
          >
            <div className="max-w-xl">
              <h2
                id="about-cta-heading"
                className="text-3xl leading-[1.12] font-extrabold tracking-tight text-white sm:text-4xl lg:text-[2.65rem]"
              >
                Ready to Make a{" "}
                <span className="text-[#FACC15]">Difference?</span>
              </h2>

              <p className="mt-4 text-base leading-relaxed text-blue-100/95 sm:mt-5 sm:text-lg">
                Whether you want to create an event, volunteer your time, or
                donate to a cause, HopeNest makes it simple. Join our growing
                community today.
              </p>

              {/* CTA Buttons: Browse Events (/events) + Create Event (/events/create) */}
              <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:flex-wrap sm:items-center">
                <Link
                  href="/events"
                  className="btn-leaf inline-flex h-12 items-center justify-center gap-2 bg-white px-6 text-sm font-semibold whitespace-nowrap text-[#124A8C] shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:text-[15px]"
                >
                  <span>Browse Events</span>
                  <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </Link>

                <Link
                  href="/events/create"
                  className="btn-leaf inline-flex h-12 items-center justify-center gap-2 bg-[#FACC15] px-6 text-sm font-semibold whitespace-nowrap text-[#0F2D59] shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#FDE047] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FACC15] sm:text-[15px]"
                >
                  <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Create Event</span>
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Soft-Faded White Mist End with Decorative Community Emblem */}
          <div
            data-about-cta-right
            aria-hidden="true"
            className="relative z-10 flex min-h-[210px] items-center justify-center p-8 md:min-h-full sm:p-10 lg:p-12"
          >
            {/* Soft Concentric Rings */}
            <div className="relative flex h-44 w-44 items-center justify-center sm:h-52 sm:w-52 lg:h-56 lg:w-56">
              <div className="absolute inset-0 rounded-full border border-dashed border-blue-200/90 bg-white/45 backdrop-blur-xs" />
              <div className="absolute inset-5 rounded-full border border-emerald-200/80 bg-gradient-to-br from-blue-50/70 via-white/90 to-emerald-50/65 shadow-inner" />

              {/* Decorative Geometric Dots */}
              <span className="absolute top-3 left-6 h-3.5 w-3.5 rounded-full bg-[#1D63B8]/85 ring-4 ring-white/80" />
              <span className="absolute right-4 bottom-6 h-3 w-3 rounded-full bg-[#059669]/85 ring-4 ring-white/80" />
              <span className="absolute top-8 right-3 h-2.5 w-2.5 rounded-full bg-[#FACC15] ring-4 ring-white/85" />

              {/* Subtle Floating Supporting Mini Badges */}
              <span className="absolute -bottom-1 left-6 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/90 bg-white text-[#154F96] shadow-sm">
                <Users className="h-4 w-4" strokeWidth={2} />
              </span>
              <span className="absolute -top-1 right-7 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/90 bg-white text-[#059669] shadow-sm">
                <CalendarCheck className="h-4 w-4" strokeWidth={2} />
              </span>

              {/* Clean Central Community Emblem */}
              <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-emerald-50 text-[#154F96] shadow-[0_14px_30px_-10px_rgba(21,79,150,0.2)] sm:h-22 sm:w-22">
                <HeartHandshake className="h-9 w-9" strokeWidth={1.85} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
