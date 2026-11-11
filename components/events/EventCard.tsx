import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, MapPin } from "lucide-react";
import type { CommunityEvent, EventBadgeTone } from "@/types";
import { cn } from "@/utils/cn";

export const categoryBadgeStyles: Record<EventBadgeTone, string> = {
  Cleanup: "bg-[#0369A1]/95 text-white ring-1 ring-white/25",
  Donation: "bg-[#059669]/95 text-white ring-1 ring-white/25",
  Plantation: "bg-[#4D7C0F]/95 text-white ring-1 ring-white/25",
  Other: "bg-[#6D28D9]/95 text-white ring-1 ring-white/25",
  Awareness: "bg-[#E11D48]/95 text-white ring-1 ring-white/25",
  Fundraising: "bg-[#B45309]/95 text-white ring-1 ring-white/25",
};

export interface EventCardProps {
  event: CommunityEvent;
  variant?: "detailed" | "compact";
  badgeLabel?: EventBadgeTone;
  linkTabIndex?: number;
  eagerImage?: boolean;
  sizes?: string;
}

export function EventCard({
  event,
  variant = "detailed",
  badgeLabel,
  linkTabIndex,
  eagerImage = false,
  sizes = "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw",
}: EventCardProps) {
  const activeBadge = badgeLabel ?? event.category;
  const href = `/events/${event.id}`;
  const isDetailed = variant === "detailed";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-[0_4px_18px_-6px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-slate-300/90 hover:shadow-[0_16px_30px_-10px_rgba(0,61,43,0.16)] dark:border-white/10 dark:bg-[#062C20] dark:hover:border-emerald-400/35">
      {/* Event Image + Subtle Contrast Scrim + Category Badge */}
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden="true"
        className="relative block h-52 w-full shrink-0 overflow-hidden border-b border-slate-100 bg-slate-100 dark:border-white/10 dark:bg-[#041D15]"
      >
        <Image
          src={event.image}
          alt={event.imageAlt}
          fill
          loading={eagerImage ? "eager" : undefined}
          sizes={sizes}
          className={cn(
            "object-cover brightness-[0.98] contrast-[1.03] transition-transform duration-500 ease-out group-hover:scale-[1.04]",
            event.imagePosition ?? "object-center",
          )}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-slate-950/15"
        />
        <span
          className={cn(
            "absolute top-3 left-3 z-10 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide shadow-sm backdrop-blur-xs",
            categoryBadgeStyles[activeBadge],
          )}
        >
          {activeBadge}
        </span>
      </Link>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-[17px] leading-snug font-bold text-[#0F172A] dark:text-white">
          <Link
            href={href}
            tabIndex={linkTabIndex}
            className="transition-colors hover:text-[#059669] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#059669] dark:hover:text-emerald-400"
          >
            {event.title}
          </Link>
        </h3>

        <div className="mt-3.5 space-y-2">
          <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-emerald-100/75">
            <MapPin
              className="mt-0.5 h-4 w-4 shrink-0 text-[#059669] dark:text-emerald-400"
              aria-hidden="true"
            />
            <span className="leading-snug">{event.location}</span>
          </div>

          {isDetailed ? (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-slate-600 dark:text-emerald-100/75">
              <div className="flex items-center gap-2">
                <Calendar
                  className="h-4 w-4 shrink-0 text-[#059669] dark:text-emerald-400"
                  aria-hidden="true"
                />
                <span className="leading-snug">{event.date}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Clock
                  className="h-4 w-4 shrink-0 text-[#059669] dark:text-emerald-400"
                  aria-hidden="true"
                />
                <span className="leading-snug">{event.time}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-emerald-100/75">
              <Calendar
                className="mt-0.5 h-4 w-4 shrink-0 text-[#059669] dark:text-emerald-400"
                aria-hidden="true"
              />
              <span className="leading-snug">{event.dateTime}</span>
            </div>
          )}
        </div>

        {isDetailed ? (
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-emerald-100/70">
            {event.description}
          </p>
        ) : null}

        <div className="mt-auto pt-5">
          <Link
            href={href}
            tabIndex={linkTabIndex}
            className="btn-leaf inline-flex h-11 w-full items-center justify-center bg-[#059669] px-4 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#047857] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#059669] dark:hover:bg-[#10B981]"
          >
            View Event
          </Link>
        </div>
      </div>
    </article>
  );
}

