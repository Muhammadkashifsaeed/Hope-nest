import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  Users,
} from "lucide-react";
import { EventActionPanel } from "@/components/events/EventActionPanel";
import {
  categoryBadgeStyles,
  EventCard,
} from "@/components/events/EventCard";
import type { CommunityEvent } from "@/types";
import { cn } from "@/utils/cn";

export interface EventDetailProps {
  event: CommunityEvent;
  relatedEvents: readonly CommunityEvent[];
}

export function EventDetail({ event, relatedEvents }: EventDetailProps) {
  const displayCategory = event.homeBadgeLabel ?? event.category;
  const categoryFilterHref = `/events?category=${event.category.toLowerCase()}`;

  return (
    <div className="flex-1 bg-[#F8FAFC] dark:bg-[#041711]">
      {/* Breadcrumb & Hero Media Header */}
      <div className="mx-auto w-full max-w-7xl px-4 pt-8 pb-10 sm:px-6 sm:pt-10 lg:px-8 lg:pb-14">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/events"
            className="btn-leaf-sm inline-flex items-center gap-2 border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-xs transition-colors hover:border-[#059669]/40 hover:text-[#059669] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#059669] dark:border-white/15 dark:bg-[#062C20] dark:text-emerald-100 dark:hover:border-emerald-400/40 dark:hover:text-emerald-300"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Back to Upcoming Events</span>
          </Link>

          <Link
            href={categoryFilterHref}
            className="text-xs font-semibold tracking-wide text-[#059669] uppercase transition-colors hover:text-[#047857] dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            Browse all {event.category} events &rarr;
          </Link>
        </div>

        {/* Large Feature Image + Category + Title Overlay Banner */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_12px_36px_-16px_rgba(0,41,31,0.18)] dark:border-white/10 dark:bg-[#062C20]">
          <div className="relative h-[260px] w-full overflow-hidden bg-slate-200 sm:h-[380px] lg:h-[440px] dark:bg-[#041D15]">
            <Image
              src={event.image}
              alt={event.imageAlt}
              fill
              preload
              sizes="(max-width: 1280px) 100vw, 1216px"
              className={cn(
                "object-cover",
                event.imagePosition ?? "object-center",
              )}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-slate-950/15"
            />

            <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-8 lg:p-10">
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-3.5 py-1 text-xs font-semibold tracking-wide shadow-sm backdrop-blur-xs",
                  categoryBadgeStyles[displayCategory],
                )}
              >
                {displayCategory}
              </span>

              <h1 className="mt-3 max-w-4xl text-2xl leading-tight font-extrabold tracking-tight text-white sm:text-4xl lg:text-[2.65rem]">
                {event.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Two-Column Main Content & Event Logistics Card */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:mt-10 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          {/* Left Column: Detailed Description, Highlights & Preparation */}
          <div className="space-y-8">
            <section
              aria-labelledby="event-overview-heading"
              className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs sm:p-8 dark:border-white/10 dark:bg-[#062C20]"
            >
              <h2
                id="event-overview-heading"
                className="text-xl font-bold tracking-tight text-[#072B20] sm:text-2xl dark:text-white"
              >
                About This Event
              </h2>

              <p className="mt-3 text-base leading-relaxed font-medium text-slate-700 dark:text-emerald-50/90">
                {event.description}
              </p>

              <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base dark:text-emerald-100/75">
                {event.fullDescription}
              </p>
            </section>

            <section
              aria-labelledby="event-highlights-heading"
              className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs sm:p-8 dark:border-white/10 dark:bg-[#062C20]"
            >
              <h2
                id="event-highlights-heading"
                className="text-xl font-bold tracking-tight text-[#072B20] dark:text-white"
              >
                Event Highlights &amp; Impact
              </h2>

              <ul className="mt-4 space-y-3">
                {event.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-3 text-sm leading-relaxed text-slate-600 sm:text-base dark:text-emerald-100/80"
                  >
                    <CheckCircle2
                      className="mt-0.5 h-5 w-5 shrink-0 text-[#059669] dark:text-emerald-400"
                      aria-hidden="true"
                    />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section
              aria-labelledby="event-preparation-heading"
              className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs sm:p-8 dark:border-white/10 dark:bg-[#062C20]"
            >
              <h2
                id="event-preparation-heading"
                className="text-xl font-bold tracking-tight text-[#072B20] dark:text-white"
              >
                What to Bring
              </h2>

              <ul className="mt-4 flex flex-wrap gap-2.5">
                {event.whatToBring.map((item) => (
                  <li
                    key={item}
                    className="rounded-xl border border-emerald-950/10 bg-[#F1FAF6] px-4 py-2 text-sm font-medium text-[#072B20] dark:border-emerald-400/20 dark:bg-[#083526] dark:text-emerald-100"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Right Column: Sticky Schedule, Location & Registration Card */}
          <aside className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_12px_30px_-14px_rgba(0,61,43,0.14)] sm:p-7 lg:sticky lg:top-24 dark:border-white/10 dark:bg-[#062C20]">
            <h2 className="text-lg font-bold text-[#072B20] dark:text-white">
              Event Information
            </h2>

            <dl className="mt-5 space-y-4 divide-y divide-slate-100 dark:divide-white/10">
              <div className="flex items-start gap-3 pt-1">
                <Calendar
                  className="mt-0.5 h-5 w-5 shrink-0 text-[#059669] dark:text-emerald-400"
                  aria-hidden="true"
                />
                <div>
                  <dt className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-emerald-200/65">
                    Date
                  </dt>
                  <dd className="mt-0.5 text-sm font-semibold text-[#0F172A] dark:text-white">
                    {event.date}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-4">
                <Clock
                  className="mt-0.5 h-5 w-5 shrink-0 text-[#059669] dark:text-emerald-400"
                  aria-hidden="true"
                />
                <div>
                  <dt className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-emerald-200/65">
                    Time &amp; Duration
                  </dt>
                  <dd className="mt-0.5 text-sm font-semibold text-[#0F172A] dark:text-white">
                    {event.time} &middot; {event.duration}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-4">
                <MapPin
                  className="mt-0.5 h-5 w-5 shrink-0 text-[#059669] dark:text-emerald-400"
                  aria-hidden="true"
                />
                <div>
                  <dt className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-emerald-200/65">
                    Location
                  </dt>
                  <dd className="mt-0.5 text-sm font-semibold text-[#0F172A] dark:text-white">
                    {event.location}
                  </dd>
                  <dd className="text-xs text-slate-500 dark:text-emerald-100/65">
                    {event.addressDetails}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-4">
                <Users
                  className="mt-0.5 h-5 w-5 shrink-0 text-[#059669] dark:text-emerald-400"
                  aria-hidden="true"
                />
                <div>
                  <dt className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-emerald-200/65">
                    Organizer
                  </dt>
                  <dd className="mt-0.5 text-sm font-semibold text-[#0F172A] dark:text-white">
                    {event.organizer}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-4">
                <Sparkles
                  className="mt-0.5 h-5 w-5 shrink-0 text-[#059669] dark:text-emerald-400"
                  aria-hidden="true"
                />
                <div>
                  <dt className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-emerald-200/65">
                    Availability
                  </dt>
                  <dd className="mt-0.5 text-sm font-semibold text-[#059669] dark:text-emerald-400">
                    {event.spotsRemaining} volunteer spots open
                  </dd>
                </div>
              </div>
            </dl>

            <div className="mt-6 border-t border-slate-100 pt-5 dark:border-white/10">
              <EventActionPanel eventId={event.id} eventTitle={event.title} />
            </div>
          </aside>
        </div>

        {/* Related Community Events */}
        {relatedEvents.length > 0 ? (
          <section
            aria-labelledby="related-events-heading"
            className="mt-14 border-t border-slate-200/80 pt-12 dark:border-white/10"
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2
                  id="related-events-heading"
                  className="text-2xl font-bold tracking-tight text-[#072B20] dark:text-white"
                >
                  More Upcoming Events
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-emerald-100/75">
                  Explore other volunteer drives and activities across HopeNest.
                </p>
              </div>

              <Link
                href="/events"
                className="text-sm font-semibold text-[#059669] transition-colors hover:text-[#047857] dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                View All Events &rarr;
              </Link>
            </div>

            <div className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedEvents.map((related) => (
                <EventCard
                  key={related.id}
                  event={related}
                  variant="detailed"
                />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}

