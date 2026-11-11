export function ContactHeroSection() {
  return (
    <section
      aria-labelledby="contact-hero-heading"
      className="relative overflow-x-clip border-b border-slate-200/80 bg-white pt-10 pb-12 sm:pt-12 sm:pb-14 lg:pt-14 lg:pb-16 dark:border-white/10 dark:bg-[#03120D]"
    >
      {/* Subtle Ambient Blue & Green Brand Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top_left,rgba(16,185,129,0.09),transparent_55%),radial-gradient(ellipse_at_top_right,rgba(21,79,150,0.06),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top_left,rgba(16,185,129,0.16),transparent_55%),radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.12),transparent_50%)]"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl text-left">
          <div className="inline-flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="h-0.5 w-6 rounded-full bg-[#059669] dark:bg-emerald-400"
            />
            <span className="text-xs font-bold tracking-[0.14em] text-[#059669] uppercase sm:text-sm dark:text-emerald-400">
              Contact HopeNest
            </span>
          </div>

          <h1
            id="contact-hero-heading"
            className="mt-3.5 text-4xl leading-[1.08] font-extrabold tracking-tight text-[#0F172A] sm:text-5xl lg:text-[3.25rem] dark:text-white"
          >
            Get In Touch.
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-[1.7] text-slate-600 sm:mt-5 sm:text-lg dark:text-emerald-100/80">
            Have questions or need support? Reach out to our team using the form
            below or find us at our physical location. We&apos;re here to help
            build the community.
          </p>
        </div>
      </div>
    </section>
  );
}

