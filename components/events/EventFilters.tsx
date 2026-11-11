"use client";

import { ArrowUpDown, ChevronDown, MapPin, RotateCcw, Search, X } from "lucide-react";
import { DEFAULT_SORT_ORDER } from "@/lib/events";
import type {
  EventCategoryOption,
  EventFilterCategory,
  EventSortOrder,
} from "@/types";
import { cn } from "@/utils/cn";

export interface EventFiltersProps {
  categories: readonly EventCategoryOption[];
  selectedCategory: EventFilterCategory;
  searchQuery: string;
  locationQuery: string;
  sortOrder: EventSortOrder;
  onSelectCategory: (category: EventFilterCategory) => void;
  onSearchChange: (query: string) => void;
  onClearLocation: () => void;
  onSortChange: (sortOrder: EventSortOrder) => void;
  onResetFilters: () => void;
}

export function EventFilters({
  categories,
  selectedCategory,
  searchQuery,
  locationQuery,
  sortOrder,
  onSelectCategory,
  onSearchChange,
  onClearLocation,
  onSortChange,
  onResetFilters,
}: EventFiltersProps) {
  const hasActiveLocation = locationQuery.trim() !== "";
  const hasActiveFilter =
    selectedCategory !== "All" ||
    searchQuery.trim() !== "" ||
    hasActiveLocation ||
    sortOrder !== DEFAULT_SORT_ORDER;

  return (
    <div
      role="region"
      aria-label="Filter upcoming events"
      className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-[0_8px_28px_-12px_rgba(15,23,42,0.1)] sm:p-6 dark:border-white/10 dark:bg-[#062C20] dark:shadow-[0_14px_32px_-14px_rgba(0,0,0,0.45)]"
    >
      {/* Top Row: Category Filter Tabs & Optional Reset */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="group"
          aria-label="Event categories"
          className="flex flex-wrap items-center gap-2 sm:gap-2.5"
        >
          {categories.map((option) => {
            const isActive = selectedCategory === option.category;
            const displayLabel = `${option.label} (${option.count})`;

            return (
              <button
                key={option.category}
                type="button"
                aria-pressed={isActive}
                onClick={() => onSelectCategory(option.category)}
                className={cn(
                  "btn-leaf-sm inline-flex cursor-pointer items-center px-4 py-2 text-sm font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#059669]",
                  isActive
                    ? "bg-[#059669] text-white shadow-xs hover:bg-[#047857]"
                    : "bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-[#003D2B] dark:bg-[#083526] dark:text-emerald-100/85 dark:hover:bg-[#0B4532] dark:hover:text-white",
                )}
              >
                {displayLabel}
              </button>
            );
          })}
        </div>

        {hasActiveFilter ? (
          <button
            type="button"
            onClick={onResetFilters}
            className="btn-leaf-sm inline-flex cursor-pointer items-center gap-1.5 border border-emerald-600/25 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-[#047857] transition-colors hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#059669] dark:border-emerald-400/30 dark:bg-emerald-500/15 dark:text-emerald-300 dark:hover:bg-emerald-500/25"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Reset Filters</span>
          </button>
        ) : null}
      </div>

      {/* Bottom Row: Compact Search (Left) & Sort By Select Dropdown (Right) */}
      <div className="mt-4 flex flex-col gap-3 border-t border-slate-200/80 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
        {/* Compact Working Search Input */}
        <div className="relative w-full sm:max-w-[300px]">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#059669] dark:text-emerald-400"
            aria-hidden="true"
          />
          <input
            id="events-search-input"
            type="text"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            aria-label="Search events"
            placeholder="Search events..."
            className={cn(
              "h-10 w-full rounded-xl border border-slate-200 bg-slate-50/90 pl-9 text-sm font-medium text-slate-800 placeholder:font-normal placeholder:text-slate-400 transition-colors hover:border-slate-300 hover:bg-slate-100/75 focus-visible:border-[#059669] focus-visible:bg-white focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#059669]/25 dark:border-white/15 dark:bg-[#083526] dark:text-emerald-50 dark:placeholder:text-emerald-200/50 dark:hover:border-emerald-400/40 dark:hover:bg-[#0A412F] dark:focus-visible:bg-[#083526]",
              searchQuery ? "pr-9" : "pr-3.5",
            )}
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
              className="btn-leaf-sm absolute top-1/2 right-2.5 flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center text-slate-400 transition-colors hover:bg-slate-200/80 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#059669] dark:text-emerald-200/70 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        {/* Right: Sort By Select Dropdown (Latest / Oldest) */}
        <div className="relative w-full sm:w-[195px]">
          <ArrowUpDown
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#059669] dark:text-emerald-400"
            aria-hidden="true"
          />
          <select
            id="events-sort-select"
            aria-label="Sort events"
            value={sortOrder}
            onChange={(event) =>
              onSortChange(event.target.value as EventSortOrder)
            }
            className="h-10 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50/90 pr-9 pl-9 text-sm font-medium text-slate-800 transition-colors hover:border-slate-300 hover:bg-slate-100/80 focus-visible:border-[#059669] focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#059669]/25 dark:border-white/15 dark:bg-[#083526] dark:text-emerald-50 dark:hover:border-emerald-400/40 dark:hover:bg-[#0A412F]"
          >
            <option
              value="latest"
              className="bg-white text-slate-900 dark:bg-[#062C20] dark:text-white"
            >
              Sort by: Latest
            </option>
            <option
              value="oldest"
              className="bg-white text-slate-900 dark:bg-[#062C20] dark:text-white"
            >
              Sort by: Oldest
            </option>
          </select>
          <ChevronDown
            className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-emerald-200/60"
            aria-hidden="true"
          />
        </div>
      </div>

      {hasActiveLocation ? (
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 dark:border-white/10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/25 bg-emerald-50 py-1 pr-2 pl-3 text-xs font-semibold text-[#047857] dark:border-emerald-400/30 dark:bg-emerald-500/15 dark:text-emerald-200">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>Location: {locationQuery}</span>
            <button
              type="button"
              onClick={onClearLocation}
              aria-label="Clear location filter"
              className="ml-1 inline-flex h-4 w-4 cursor-pointer items-center justify-center rounded-full hover:bg-emerald-200/70 dark:hover:bg-white/15"
            >
              <X className="h-3 w-3" aria-hidden="true" />
            </button>
          </span>
        </div>
      ) : null}
    </div>
  );
}
