import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarCheck,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { CreateEventForm } from "@/components/events/CreateEventForm";
import { buildPageMetadata } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Create Event",
  description:
    "Submit a new volunteer drive, cleanup, tree plantation, or neighborhood relief initiative to connect with the HopeNest community.",
  path: "/events/create",
});

const organizerGuidelines = [
  {
    icon: CheckCircle2,
    title: "Clear Location & Check-In",
    body: "Specify a recognizable landmark, gate number, or street corner so volunteers can arrive smoothly.",
  },
  {
    icon: ShieldCheck,
    title: "Safety & Supplies Plan",
    body: "Mention gloves, tools, hydration stations, or age requirements so participants come prepared.",
  },
  {
    icon: Users,
    title: "Coordinator Verification",
    body: "Provide an active coordinator email for quick community verification and volunteer updates.",
  },
] as const;

export default function CreateEventPage() {
  return (
    <div className="flex-1 bg-[#F8FAFC] dark:bg-[#041711]">
      {/* Intro Band */}
      <section
        aria-labelledby="create-event-heading"
        className="border-b border-slate-200/85 bg-white py-10 sm:py-12 lg:py-14 dark:border-white/10 dark:bg-[#03120D]"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div>
            <Link
              href="/events"
              className="btn-leaf-sm inline-flex items-center gap-2 border border-slate-200/90 bg-white px-3.5 py-2 text-sm font-semibold text-[#0F172A] transition-colors hover:border-[#059669]/45 hover:text-[#059669] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#059669] dark:border-white/15 dark:bg-[#062C20] dark:text-emerald-100 dark:hover:border-emerald-400/45 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Back to Upcoming Events</span>
            </Link>
          </div>

          <div className="mt-6 max-w-3xl">
            <div className="inline-flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="h-0.5 w-6 rounded-full bg-[#059669] dark:bg-emerald-400"
              />
              <span className="text-xs font-bold tracking-[0.14em] text-[#059669] uppercase sm:text-sm dark:text-emerald-400">
                Host With HopeNest
              </span>
            </div>

            <h1
              id="create-event-heading"
              className="mt-3 text-3xl leading-[1.08] font-extrabold tracking-tight text-[#0F172A] sm:text-4xl lg:text-5xl dark:text-white"
            >
              Create a Community Event
            </h1>

            <p className="mt-3.5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-emerald-100/80">
              Launch a neighborhood cleanup, tree plantation, food drive, or
              community workshop and rally local volunteers in minutes.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section
        aria-label="Create community event form"
        className="py-10 sm:py-14 lg:py-16"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.45fr_0.85fr] lg:gap-10">
            <CreateEventForm />

            <aside className="space-y-6 lg:sticky lg:top-24">
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs sm:p-7 dark:border-white/10 dark:bg-[#062C20]">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-[#059669] dark:bg-emerald-500/15 dark:text-emerald-300">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Organizer Checklist</span>
                </div>

                <h2 className="mt-4 text-lg font-bold text-[#0F172A] dark:text-white">
                  Before You Submit
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-emerald-100/75">
                  Well-detailed event listings help local volunteers prepare
                  with confidence and maximize attendance.
                </p>

                <ul className="mt-5 space-y-4">
                  {organizerGuidelines.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.title} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-[#059669] dark:bg-emerald-500/15 dark:text-emerald-400">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <div>
                          <h3 className="text-sm font-semibold text-[#0F172A] dark:text-white">
                            {item.title}
                          </h3>
                          <p className="mt-0.5 text-xs leading-relaxed text-slate-600 dark:text-emerald-100/75">
                            {item.body}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="rounded-2xl border border-emerald-950/10 bg-gradient-to-br from-[#003D2B] to-[#05583F] p-6 text-white shadow-sm sm:p-7">
                <div className="flex items-center gap-2 text-emerald-200">
                  <CalendarCheck className="h-5 w-5" aria-hidden="true" />
                  <span className="text-xs font-bold tracking-wider uppercase">
                    Organizer Support
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-emerald-50/90">
                  Planning a large municipal partnership or multi-site drive? Our
                  coordination team is happy to help structure group signups.
                </p>
                <Link
                  href="/contact"
                  className="btn-leaf-sm mt-5 inline-flex h-10 items-center justify-center bg-[#10B981] px-4 text-xs font-bold text-[#00291F] transition-colors hover:bg-emerald-300"
                >
                  Contact Support Team
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

