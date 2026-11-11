import { Suspense } from "react";
import type { Metadata } from "next";
import { EventCard } from "@/components/events/EventCard";
import { EventsCatalog } from "@/components/events/EventsCatalog";
import { EventsHero } from "@/components/events/EventsHero";
import {
  ALL_MONTHS_VALUE,
  events,
  filterEvents,
  getCategoryCounts,
  normalizeCategoryParam,
  normalizeLocationParam,
  normalizeSearchParam,
  normalizeSortParam,
} from "@/lib/events";
import { buildPageMetadata } from "@/lib/site";
import type { EventFilterCategory, EventSortOrder } from "@/types";

export const metadata: Metadata = buildPageMetadata({
  title: "Upcoming Events",
  description:
    "Discover and join meaningful community events across cleanup, donation, plantation, and outreach initiatives.",
  path: "/events",
});

interface EventsPageProps {
  searchParams: Promise<{
    category?: string | string[];
    type?: string | string[];
    q?: string | string[];
    location?: string | string[];
    sort?: string | string[];
  }>;
}

function EventsCatalogFallback({
  initialCategory,
  initialSearch,
  initialLocation,
  initialSort,
}: {
  initialCategory: EventFilterCategory;
  initialSearch: string;
  initialLocation: string;
  initialSort: EventSortOrder;
}) {
  const initialEvents = filterEvents(
    initialCategory,
    ALL_MONTHS_VALUE,
    events,
    initialSearch,
    initialSort,
    initialLocation,
  );

  return (
    <section
      aria-label="Upcoming events catalog"
      className="flex-1 bg-[#F8FAFC] py-10 sm:py-12 lg:py-16 dark:bg-[#041711]"
    >
      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 sm:px-6 lg:space-y-10 lg:px-8">
        <div className="h-32 animate-pulse rounded-2xl border border-slate-200/90 bg-white dark:border-white/10 dark:bg-[#062C20]" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {initialEvents.map((event) => (
            <EventCard key={event.id} event={event} variant="detailed" />
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function UpcomingEventsPage({
  searchParams,
}: EventsPageProps) {
  const resolvedSearchParams = await searchParams;
  const categories = getCategoryCounts(events);

  const initialCategory = normalizeCategoryParam(
    resolvedSearchParams.category,
    resolvedSearchParams.type,
  );
  const initialSearch = normalizeSearchParam(resolvedSearchParams.q);
  const initialLocation = normalizeLocationParam(resolvedSearchParams.location);
  const initialSort = normalizeSortParam(resolvedSearchParams.sort);

  return (
    <>
      <EventsHero />
      <Suspense
        fallback={
          <EventsCatalogFallback
            initialCategory={initialCategory}
            initialSearch={initialSearch}
            initialLocation={initialLocation}
            initialSort={initialSort}
          />
        }
      >
        <EventsCatalog events={events} categories={categories} />
      </Suspense>
    </>
  );
}
