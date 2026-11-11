"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CalendarSearch } from "lucide-react";
import { EventCard } from "@/components/events/EventCard";
import { EventFilters } from "@/components/events/EventFilters";
import {
  ALL_MONTHS_VALUE,
  buildEventsQueryUrl,
  DEFAULT_SORT_ORDER,
  filterEvents,
  normalizeCategoryParam,
  normalizeLocationParam,
  normalizeSearchParam,
  normalizeSortParam,
} from "@/lib/events";
import type {
  CommunityEvent,
  EventCategoryOption,
  EventFilterCategory,
  EventSortOrder,
} from "@/types";

export interface EventsCatalogProps {
  events: readonly CommunityEvent[];
  categories: readonly EventCategoryOption[];
}

export function EventsCatalog({ events, categories }: EventsCatalogProps) {
  const searchParams = useSearchParams();
  const currentParamsKey = searchParams.toString();

  const [selectedCategory, setSelectedCategory] = useState<EventFilterCategory>(
    () =>
      normalizeCategoryParam(
        searchParams.get("category") ?? undefined,
        searchParams.get("type") ?? undefined,
      ),
  );
  const [sortOrder, setSortOrder] = useState<EventSortOrder>(() =>
    normalizeSortParam(searchParams.get("sort") ?? undefined),
  );
  const [searchInput, setSearchInput] = useState(() =>
    normalizeSearchParam(searchParams.get("q") ?? undefined),
  );
  const [locationFilter, setLocationFilter] = useState(() =>
    normalizeLocationParam(searchParams.get("location") ?? undefined),
  );
  const [prevParamsKey, setPrevParamsKey] = useState(currentParamsKey);
  const [ownParamsKeys, setOwnParamsKeys] = useState<string[]>([]);

  // Re-sync local state only on external URL navigations (Header links / Back-Forward),
  // never on our own replaceState updates or active typing.
  if (currentParamsKey !== prevParamsKey) {
    setPrevParamsKey(currentParamsKey);
    const ownIndex = ownParamsKeys.indexOf(currentParamsKey);
    if (ownIndex !== -1) {
      setOwnParamsKeys((prev) => prev.slice(ownIndex + 1));
    } else {
      setSelectedCategory(
        normalizeCategoryParam(
          searchParams.get("category") ?? undefined,
          searchParams.get("type") ?? undefined,
        ),
      );
      setSortOrder(normalizeSortParam(searchParams.get("sort") ?? undefined));
      setSearchInput(normalizeSearchParam(searchParams.get("q") ?? undefined));
      setLocationFilter(
        normalizeLocationParam(searchParams.get("location") ?? undefined),
      );
      if (ownParamsKeys.length > 0) {
        setOwnParamsKeys([]);
      }
    }
  }

  const filteredEvents = useMemo(
    () =>
      filterEvents(
        selectedCategory,
        ALL_MONTHS_VALUE,
        events,
        searchInput,
        sortOrder,
        locationFilter,
      ),
    [selectedCategory, events, searchInput, sortOrder, locationFilter],
  );

  function updateUrlParams(
    nextCategory: EventFilterCategory,
    nextSearch: string,
    nextSort: EventSortOrder,
    nextLocation: string,
  ) {
    const nextUrl = buildEventsQueryUrl(
      nextCategory,
      ALL_MONTHS_VALUE,
      nextSearch,
      nextSort,
      nextLocation,
    );
    const queryIndex = nextUrl.indexOf("?");
    const nextKey = queryIndex === -1 ? "" : nextUrl.slice(queryIndex + 1);
    const expectedCurrent =
      ownParamsKeys[ownParamsKeys.length - 1] ?? currentParamsKey;

    if (nextKey !== expectedCurrent) {
      setOwnParamsKeys((prev) => [...prev.slice(-15), nextKey]);
      window.history.replaceState(null, "", nextUrl);
    }
  }

  function handleSelectCategory(category: EventFilterCategory) {
    setSelectedCategory(category);
    updateUrlParams(category, searchInput, sortOrder, locationFilter);
  }

  function handleSearchChange(query: string) {
    setSearchInput(query);
    updateUrlParams(selectedCategory, query, sortOrder, locationFilter);
  }

  function handleClearLocation() {
    setLocationFilter("");
    updateUrlParams(selectedCategory, searchInput, sortOrder, "");
  }

  function handleSortChange(nextSort: EventSortOrder) {
    setSortOrder(nextSort);
    updateUrlParams(selectedCategory, searchInput, nextSort, locationFilter);
  }

  function handleResetFilters() {
    setSelectedCategory("All");
    setSearchInput("");
    setLocationFilter("");
    setSortOrder(DEFAULT_SORT_ORDER);
    updateUrlParams("All", "", DEFAULT_SORT_ORDER, "");
  }

  return (
    <section
      aria-label="Upcoming events catalog"
      className="flex-1 bg-[#F8FAFC] py-10 sm:py-12 lg:py-16 dark:bg-[#041711]"
    >
      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 sm:px-6 lg:space-y-10 lg:px-8">
        <EventFilters
          categories={categories}
          selectedCategory={selectedCategory}
          searchQuery={searchInput}
          locationQuery={locationFilter}
          sortOrder={sortOrder}
          onSelectCategory={handleSelectCategory}
          onSearchChange={handleSearchChange}
          onClearLocation={handleClearLocation}
          onSortChange={handleSortChange}
          onResetFilters={handleResetFilters}
        />

        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} variant="detailed" />
            ))}
          </div>
        ) : (
          <div
            role="status"
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-xs dark:border-white/15 dark:bg-[#062C20]"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-[#059669] ring-1 ring-emerald-200/80 dark:bg-emerald-500/15 dark:text-emerald-400 dark:ring-emerald-400/25">
              <CalendarSearch className="h-7 w-7" aria-hidden="true" />
            </div>

            <h2 className="text-xl font-bold text-[#072B20] dark:text-white">
              No events found
            </h2>
            <p className="mt-1.5 max-w-md text-sm text-slate-600 dark:text-emerald-100/75">
              Try another search term, location, or category.
            </p>

            <button
              type="button"
              onClick={handleResetFilters}
              className="btn-leaf mt-6 inline-flex h-11 cursor-pointer items-center justify-center bg-[#059669] px-6 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#047857] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#059669] dark:hover:bg-[#10B981]"
            >
              View All Events
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
