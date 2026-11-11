"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  MapPin,
  PlayCircle,
  Search,
  Tag,
} from "lucide-react";
import { getEventLocations } from "@/lib/events";

const locationOptions = ["All Locations", ...getEventLocations()];

const eventTypeOptions = [
  "All Event Types",
  "Cleanup & Recycling",
  "Community Outreach",
  "Environmental Action",
  "Food & Relief Drive",
  "Youth & Education",
  "Health & Wellness",
];

const quickTags = [
  "Community Outreach",
  "Environmental Action",
  "Food & Relief Drive",
];

export function HeroSection() {
  const router = useRouter();
  const [location, setLocation] = useState("All Locations");
  const [eventType, setEventType] = useState("All Event Types");

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (location !== "All Locations") {
      params.set("location", location);
    }
    if (eventType !== "All Event Types") {
      params.set("type", eventType);
    }
    const query = params.toString();
    router.push(query ? `/events?${query}` : "/events");
  }

  return (
    <section
      aria-labelledby="hero-heading"
      className="hero-gradient-bg relative overflow-x-clip border-b border-emerald-950/10 dark:border-white/10"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-10 xl:gap-14">
          {/* Left Side: Heading, Supporting Copy, Search/Filter Card & Quick Filters */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="space-y-6"
          >
            <h1
              id="hero-heading"
              className="text-4xl font-extrabold tracking-tight text-[#072B20] sm:text-5xl lg:text-[3.15rem] xl:text-[3.45rem] leading-[1.08] dark:text-white"
            >
              Discover Events That{" "}
              <span className="relative inline-block text-[#059669] dark:text-emerald-400">
                <span>Empower</span>
                <span
                  aria-hidden="true"
                  className="absolute right-0 -bottom-1 left-0 h-1.5 rounded-full bg-emerald-400/35 dark:bg-emerald-400/25"
                />
              </span>{" "}
              Your Community
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-zinc-600 sm:text-lg dark:text-emerald-100/80">
              Join meaningful volunteer drives, sustainability workshops, and
              neighborhood initiatives designed to connect people and create
              lasting social impact.
            </p>

            {/* Search / Filter Card */}
            <form
              onSubmit={handleSearch}
              aria-label="Search community events"
              className="rounded-2xl border border-emerald-950/10 bg-white/95 p-2 shadow-[0_20px_50px_-15px_rgba(0,61,43,0.18)] ring-1 ring-emerald-950/[0.03] backdrop-blur-md dark:border-white/10 dark:bg-[#062C20]/95 dark:ring-white/5"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-1.5">
                {/* Location Dropdown */}
                <div className="relative flex-1 min-w-0">
                  <MapPin
                    className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-[#059669] dark:text-emerald-400"
                    aria-hidden="true"
                  />
                  <select
                    aria-label="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="h-11 w-full cursor-pointer appearance-none truncate rounded-xl bg-zinc-50 pr-7 pl-8 text-[13px] font-medium text-zinc-800 transition-colors hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#059669] sm:bg-transparent xl:text-sm dark:bg-[#093829] dark:text-emerald-50 dark:hover:bg-[#0C4432] sm:dark:bg-transparent"
                  >
                    {locationOptions.map((item) => (
                      <option
                        key={item}
                        value={item}
                        className="bg-white text-zinc-900 dark:bg-[#05291E] dark:text-white"
                      >
                        {item}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-zinc-400"
                    aria-hidden="true"
                  />
                </div>

                <span
                  aria-hidden="true"
                  className="hidden h-7 w-px shrink-0 bg-zinc-200 sm:block dark:bg-white/15"
                />

                {/* Event Type Dropdown */}
                <div className="relative flex-1 min-w-0">
                  <Tag
                    className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-[#059669] dark:text-emerald-400"
                    aria-hidden="true"
                  />
                  <select
                    aria-label="Event Type"
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="h-11 w-full cursor-pointer appearance-none truncate rounded-xl bg-zinc-50 pr-7 pl-8 text-[13px] font-medium text-zinc-800 transition-colors hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#059669] sm:bg-transparent xl:text-sm dark:bg-[#093829] dark:text-emerald-50 dark:hover:bg-[#0C4432] sm:dark:bg-transparent"
                  >
                    {eventTypeOptions.map((item) => (
                      <option
                        key={item}
                        value={item}
                        className="bg-white text-zinc-900 dark:bg-[#05291E] dark:text-white"
                      >
                        {item}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-zinc-400"
                    aria-hidden="true"
                  />
                </div>

                {/* Green Action Button */}
                <button
                  type="submit"
                  className="btn-leaf inline-flex h-11 w-full shrink-0 cursor-pointer items-center justify-center gap-2 bg-[#059669] px-4 text-sm font-semibold whitespace-nowrap text-white shadow-xs transition-all hover:bg-[#047857] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#059669] sm:w-auto"
                >
                  <Search className="h-4 w-4" aria-hidden="true" />
                  <span>Find Events</span>
                </button>
              </div>
            </form>

            {/* Quick Category Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="font-medium text-zinc-500 dark:text-emerald-200/70">
                Popular:
              </span>
              {quickTags.map((tag) => (
                <Link
                  key={tag}
                  href={`/events?type=${encodeURIComponent(tag)}`}
                  className="btn-leaf-sm border border-emerald-900/10 bg-white/80 px-3 py-1 font-medium text-zinc-700 transition-colors hover:border-[#059669]/40 hover:bg-emerald-50 hover:text-[#003D2B] dark:border-white/10 dark:bg-[#062C20]/70 dark:text-emerald-100/85 dark:hover:border-emerald-400/40 dark:hover:bg-[#0A3D2C]"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Right Side: Online Badge, Compact Layered Overlapping Photos, Decorative Shapes & How It Works CTA */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: "easeOut" }}
            className="mx-auto w-full max-w-[520px] lg:max-w-none"
          >
            {/* Online Badge Above Image Composition */}
            <div className="mb-3 flex items-center justify-start sm:mb-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/90 bg-white/95 px-3.5 py-1.5 text-xs font-semibold text-[#003D2B] shadow-sm backdrop-blur-sm dark:border-emerald-500/35 dark:bg-[#062C20]/95 dark:text-emerald-100">
                <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#10B981]" />
                </span>
                <span className="font-bold text-[#059669] dark:text-emerald-400">
                  Online
                </span>
                <span aria-hidden="true" className="text-zinc-300 dark:text-white/25">
                  &bull;
                </span>
                <span>Live Community Events</span>
              </span>
            </div>

            {/* Compact Layered Photo Composition (all 3 images clearly visible) */}
            <div className="relative h-[265px] w-full sm:h-[360px] lg:h-[405px]">
              {/* Subtle Decorative Dotted Frame Accent */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-3 left-8 z-0 h-32 w-32 rounded-3xl border border-dashed border-emerald-500/25 sm:top-4 sm:left-12 sm:h-44 sm:w-44"
              />

              {/* Enhanced Light Blue Decorative Box Below First Image */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-4 left-2 z-10 flex h-14 w-14 -rotate-12 items-center justify-center rounded-2xl border border-sky-300/70 bg-gradient-to-br from-sky-100/95 via-blue-100/85 to-cyan-100/90 shadow-[0_14px_30px_-8px_rgba(56,189,248,0.38)] ring-1 ring-white/75 backdrop-blur-sm sm:bottom-5 sm:left-5 sm:h-20 sm:w-20 dark:border-sky-400/35 dark:from-sky-500/30 dark:via-blue-500/20 dark:to-cyan-400/25 dark:ring-white/10"
              >
                <span className="h-6 w-6 rounded-xl border border-sky-400/40 bg-white/55 shadow-inner sm:h-9 sm:w-9 dark:border-sky-300/30 dark:bg-sky-400/15" />
              </div>

              {/* Small Decorative Pill & Dot Accent Below First Image */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-8 left-18 z-10 flex items-center gap-2 sm:bottom-10 sm:left-28"
              >
                <span className="h-3 w-9 rotate-6 rounded-full bg-gradient-to-r from-sky-300/60 to-emerald-400/50 ring-1 ring-sky-400/40 sm:h-3.5 sm:w-12" />
                <span className="h-2.5 w-2.5 rounded-full bg-sky-400 shadow-xs ring-2 ring-sky-200/70 dark:ring-sky-400/30" />
              </div>

              {/* Main Larger Photo (Center-Left, scaled cleanly so all subjects show clearly) */}
              <div className="absolute top-5 left-0 z-20 aspect-[3/2] w-[62%] -rotate-2 overflow-hidden rounded-2xl border-[4px] border-white bg-white shadow-[0_22px_45px_-14px_rgba(0,41,31,0.26)] ring-1 ring-black/5 transition-transform duration-300 hover:z-40 hover:scale-[1.03] sm:top-6 sm:left-3 sm:w-[58%] sm:border-[5px] dark:border-[#0B3B2B] dark:bg-[#0B3B2B] dark:ring-white/10">
                <Image
                  src="/images/photo1.webp"
                  alt="Community volunteers loading food packages at a local outreach drive"
                  fill
                  preload
                  sizes="(max-width: 640px) 62vw, (max-width: 1024px) 42vw, 32vw"
                  className="object-cover"
                />
              </div>

              {/* Second Smaller Photo (Upper-Right, minimal overlap so both photos read cleanly) */}
              <div className="absolute top-0 right-1 z-30 aspect-[7/4] w-[39%] rotate-3 overflow-hidden rounded-2xl border-[4px] border-white bg-white shadow-[0_18px_36px_-10px_rgba(0,41,31,0.24)] ring-1 ring-black/5 transition-transform duration-300 hover:z-40 hover:scale-[1.03] sm:top-1 sm:right-3 sm:w-[37%] sm:border-[5px] dark:border-[#0B3B2B] dark:bg-[#0B3B2B] dark:ring-white/10">
                <Image
                  src="/images/photo2.webp"
                  alt="Hands holding a green plant sprout during a sustainability workshop"
                  fill
                  sizes="(max-width: 640px) 39vw, (max-width: 1024px) 26vw, 19vw"
                  className="object-cover"
                />
              </div>

              {/* Third Smaller Photo (Lower-Right, clearly separated below photo2) */}
              <div className="absolute right-2 bottom-12 z-30 aspect-[3/2] w-[41%] -rotate-3 overflow-hidden rounded-2xl border-[4px] border-white bg-white shadow-[0_18px_36px_-10px_rgba(0,41,31,0.24)] ring-1 ring-black/5 transition-transform duration-300 hover:z-40 hover:scale-[1.03] sm:right-5 sm:bottom-13 sm:w-[39%] sm:border-[5px] dark:border-[#0B3B2B] dark:bg-[#0B3B2B] dark:ring-white/10">
                <Image
                  src="/images/photo3.webp"
                  alt="Gardening tools and soil ready for a neighborhood greening initiative"
                  fill
                  sizes="(max-width: 640px) 41vw, (max-width: 1024px) 27vw, 20vw"
                  className="object-cover"
                />
              </div>

              {/* Orange CTA Button ("How It Works" on Lower-Right) */}
              <Link
                href="/about"
                className="btn-leaf absolute right-1 bottom-0 z-40 inline-flex items-center gap-2 bg-gradient-to-r from-[#F97316] to-[#FB923C] px-4 py-2.5 text-xs font-semibold text-white shadow-[0_12px_28px_-6px_rgba(249,115,22,0.5)] transition-all hover:-translate-y-0.5 hover:from-[#EA580C] hover:to-[#F97316] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F97316] sm:right-3 sm:px-6 sm:py-3 sm:text-sm"
              >
                <PlayCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>How It Works</span>
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
