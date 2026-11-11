interface HowItWorksStep {
  number: string;
  title: string;
  description: string;
}

const howItWorksSteps: readonly HowItWorksStep[] = [
  {
    number: "1",
    title: "Create or Discover",
    description:
      "Organizers can create events, or browse upcoming events in your area.",
  },
  {
    number: "2",
    title: "Register",
    description:
      "Sign up to volunteer, donate, or support the event that fits your passion.",
  },
  {
    number: "3",
    title: "Participate",
    description:
      "Show up, engage directly, and make a difference in your community.",
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="scroll-mt-20 relative overflow-x-clip border-b border-slate-200/80 bg-[#F8FAFC] py-14 sm:py-16 lg:py-20 dark:border-white/10 dark:bg-[#041711]"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Left-Aligned Section Heading */}
        <h2
          id="how-it-works-heading"
          className="text-left text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl lg:text-[2rem] dark:text-white"
        >
          How It Works
        </h2>

        {/* 3 Equal-Height Step Cards (3 Desktop -> 2+1 Tablet -> 1 Mobile) */}
        <div className="mt-8 grid auto-rows-fr grid-cols-1 gap-6 sm:mt-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {howItWorksSteps.map((step) => (
            <article
              key={step.number}
              data-how-step={step.number}
              className="group relative flex h-full flex-col rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_6px_22px_-8px_rgba(15,23,42,0.07)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-blue-300/85 hover:shadow-[0_18px_36px_-12px_rgba(29,78,216,0.16)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-7 lg:p-8 dark:border-white/10 dark:bg-[#062C20] dark:shadow-[0_10px_28px_-12px_rgba(0,0,0,0.45)] dark:hover:border-blue-400/40"
            >
              {/* Blue Numbered Icon-Style Badge */}
              <div className="mb-5 flex items-center justify-between">
                <span className="inline-flex h-13 w-13 items-center justify-center rounded-2xl bg-blue-50 text-2xl font-extrabold tracking-tight text-[#1D4ED8] ring-1 ring-blue-200/90 transition-all duration-300 ease-out group-hover:scale-105 group-hover:bg-[#1D4ED8] group-hover:text-white group-hover:ring-[#1D4ED8] motion-reduce:transition-none motion-reduce:group-hover:scale-100 dark:bg-blue-500/15 dark:text-blue-300 dark:ring-blue-400/30 dark:group-hover:bg-[#2563EB] dark:group-hover:text-white">
                  {step.number}
                </span>

                <span
                  aria-hidden="true"
                  className="h-1 w-8 rounded-full bg-emerald-500/30 transition-all duration-300 ease-out group-hover:w-12 group-hover:bg-[#059669] dark:bg-emerald-400/25 dark:group-hover:bg-emerald-400"
                />
              </div>

              {/* Dark Navy Heading */}
              <h3 className="text-xl font-bold tracking-tight text-[#0F172A] dark:text-white">
                {step.title}
              </h3>

              {/* Muted Blue-Gray Description */}
              <p className="mt-2.5 text-sm leading-relaxed text-slate-600 sm:text-[15px] dark:text-emerald-100/75">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

