import Image from "next/image";

export function EventsHero() {
  return (
    <section
      aria-labelledby="events-hero-heading"
      className="relative flex min-h-[340px] w-full items-center overflow-hidden bg-[#022117] sm:min-h-[400px] lg:min-h-[440px]"
    >
      {/* Full-Width Atmospheric Landscape Background */}
      <Image
        src="/images/photo-1470071459604-3b5ec3a7fe05.avif"
        alt="Misty green valley at golden sunrise representing thriving HopeNest communities"
        fill
        preload
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Dark/Soft Gradient Overlays for Crisp Left-Aligned Typography */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#021C14]/90 via-[#03261B]/72 to-[#04281D]/35"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#021A12]/70 via-transparent to-[#021A12]/25"
      />

      {/* Left-Aligned Hero Copy */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/35 bg-[#022C1F]/75 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-emerald-200 backdrop-blur-sm sm:text-sm">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-[#10B981]"
            />
            <span>HopeNest Community</span>
          </div>

          <h1
            id="events-hero-heading"
            className="text-4xl leading-[1.08] font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Upcoming Events
          </h1>

          <p className="max-w-xl text-base leading-relaxed font-medium text-emerald-50/90 sm:text-lg lg:text-xl">
            Discover and join meaningful events in your community.
          </p>
        </div>
      </div>
    </section>
  );
}

