import Image from "next/image";
import { cn } from "@/utils/cn";

interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  caption: string;
  positionClass?: string;
}

const galleryItems: readonly GalleryItem[] = [
  {
    id: "food-relief-distribution",
    src: "/images/photo-1593113598332-cd288d649433.webp",
    alt: "Community volunteers in masks and gloves unloading fresh produce boxes from a relief truck",
    caption: "Fresh Produce Relief Drive",
    positionClass: "object-[50%_25%]",
  },
  {
    id: "community-packing-team",
    src: "/images/photo-1593113646773-028c64a8f1b8.webp",
    alt: "Volunteers working side by side indoors packing food bags and supply crates for local families",
    caption: "Neighborhood Care Packing",
    positionClass: "object-[50%_28%]",
  },
  {
    id: "on-ground-volunteers",
    src: "/images/photo-1559027615-cd4628902d4a.webp",
    alt: "Volunteer wearing a volunteer jersey capturing moments at an outdoor community event",
    caption: "Volunteer Coordination",
    positionClass: "object-[50%_22%]",
  },
  {
    id: "youth-outreach-smiles",
    src: "/images/photo-1509099836639-18ba1795216d.webp",
    alt: "Smiling children gathered together during a community youth outreach program",
    caption: "Youth Community Outreach",
    positionClass: "object-[50%_25%]",
  },
];

export function CommunityGallerySection() {
  return (
    <section
      id="community-gallery"
      aria-labelledby="community-gallery-heading"
      className="scroll-mt-20 relative overflow-x-clip bg-[#F8FAFC] py-14 sm:py-16 lg:py-20 dark:bg-[#041711]"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Left-Aligned Section Heading & Horizontal Divider */}
        <div className="space-y-4">
          <h2
            id="community-gallery-heading"
            className="text-left text-2xl font-bold tracking-tight text-[#072B20] sm:text-3xl dark:text-white"
          >
            Community Gallery
          </h2>

          <div
            aria-hidden="true"
            className="relative h-px w-full bg-slate-200/90 dark:bg-white/10"
          >
            <span className="absolute top-0 left-0 h-0.5 w-16 -translate-y-1/2 rounded-full bg-[#059669] dark:bg-emerald-400" />
          </div>
        </div>

        {/* 4-Column Responsive Gallery Grid (4 Desktop -> 2x2 Tablet -> 1 Mobile) */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-9 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {galleryItems.map((item) => (
            <figure
              key={item.id}
              className="group relative h-64 w-full overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-200 shadow-[0_6px_22px_-8px_rgba(15,23,42,0.12)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_16px_32px_-12px_rgba(0,61,43,0.22)] sm:h-60 xl:h-64 dark:border-white/10 dark:bg-[#062C20]"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                className={cn(
                  "object-cover transition-transform duration-500 ease-out group-hover:scale-105",
                  item.positionClass ?? "object-center",
                )}
              />

              {/* Subtle Overlay Deepening on Hover */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/45 via-slate-950/5 to-transparent opacity-60 transition-opacity duration-300 group-hover:from-slate-950/70 group-hover:via-slate-950/20 group-hover:opacity-100"
              />

              {/* Subtle Caption Revealed Cleanly on Hover */}
              <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-4 py-3.5 text-sm font-semibold text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 translate-y-1">
                {item.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
