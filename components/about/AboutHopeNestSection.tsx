import { Eye, HeartHandshake, Target, type LucideIcon } from "lucide-react";

interface AboutPillarCard {
  id: string;
  title: string;
  description: string;
  image: string;
  backgroundPosition: string;
  icon: LucideIcon;
}

const aboutPillarCards: readonly AboutPillarCard[] = [
  {
    id: "our-mission",
    title: "Our Mission",
    description:
      "Empowering volunteers and organizers to create social impact through accessible, transparent, and community-driven event management.",
    image: "/images/photo-1466692476868-aef1dfb1e735.webp",
    backgroundPosition: "50% 35%",
    icon: Target,
  },
  {
    id: "our-vision",
    title: "Our Vision",
    description:
      "A world where anyone can easily find and participate in events that strengthen communities and create lasting positive change.",
    image: "/images/photo-1542601906990-b4d3fb778b09.webp",
    backgroundPosition: "50% 30%",
    icon: Eye,
  },
  {
    id: "impact",
    title: "Impact",
    description:
      "Over 500+ events organized, 10,000+ volunteers empowered, and growing every day. Join us in building stronger communities.",
    image: "/images/photo-1416879595882-3373a0480b5b.webp",
    backgroundPosition: "50% 35%",
    icon: HeartHandshake,
  },
];

export function AboutHopeNestSection() {
  return (
    <section
      aria-labelledby="about-hopenest-heading"
      className="relative overflow-x-clip border-b border-slate-200/80 bg-white pt-10 pb-14 sm:pt-12 sm:pb-16 lg:pt-14 lg:pb-20 dark:border-white/10 dark:bg-[#03120D]"
    >
      {/* Subtle Ambient Soft Green Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(ellipse_at_top_left,rgba(16,185,129,0.08),transparent_58%)] dark:bg-[radial-gradient(ellipse_at_top_left,rgba(16,185,129,0.14),transparent_58%)]"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Editorial About Content — Left-Aligned */}
        <div className="max-w-3xl text-left">
          <div className="inline-flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="h-0.5 w-6 rounded-full bg-[#059669] dark:bg-emerald-400"
            />
            <span className="text-xs font-bold tracking-[0.14em] text-[#059669] uppercase sm:text-sm dark:text-emerald-400">
              About HopeNest
            </span>
          </div>

          <h1
            id="about-hopenest-heading"
            className="mt-3.5 text-4xl leading-[1.08] font-extrabold tracking-tight text-[#0F172A] sm:text-5xl lg:text-[3.25rem] dark:text-white"
          >
            Building Communities
            <span className="block">Through Events.</span>
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-[1.7] text-slate-600 sm:mt-5 sm:text-lg dark:text-emerald-100/80">
            HopeNest is a community-driven platform designed to connect
            volunteers, organizers, and donors around meaningful social-impact
            events. From plant drives and donation collections to community
            cleanups, we make it easy to create, discover, and participate in
            events that matter.
          </p>
        </div>

        {/* Three Full-Background-Image Cards (3 Desktop -> 2+1 Tablet -> 1 Mobile) */}
        <div className="mt-9 grid auto-rows-fr grid-cols-1 gap-6 sm:mt-10 md:grid-cols-2 lg:mt-11 lg:grid-cols-3 lg:gap-7">
          {aboutPillarCards.map((card) => {
            const Icon = card.icon;

            return (
              <article
                key={card.id}
                className="group relative flex h-full min-h-[270px] flex-col justify-end overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_14px_34px_-14px_rgba(15,23,42,0.14)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-[#059669]/35 hover:shadow-[0_24px_48px_-14px_rgba(0,61,43,0.18)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:min-h-[285px] lg:min-h-[300px] dark:border-white/15 dark:bg-[#041D15] dark:shadow-[0_14px_34px_-14px_rgba(0,0,0,0.45)] dark:hover:border-emerald-400/40"
              >
                {/* Full-Bleed Card Background Image */}
                <div
                  aria-hidden="true"
                  data-about-card-bg={card.id}
                  className="absolute inset-0 bg-cover bg-no-repeat transition-transform duration-300 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  style={{
                    backgroundImage: `url("${card.image}")`,
                    backgroundPosition: card.backgroundPosition,
                  }}
                />

                {/* Bottom-to-Top Frosted White Blur Overlay (Keeps Upper Photo Clear) */}
                <div
                  aria-hidden="true"
                  data-about-card-blur={card.id}
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white via-white/92 via-44% to-white/0 backdrop-blur-md dark:from-[#031710] dark:via-[#041D15]/92 dark:via-44% dark:to-transparent"
                  style={{
                    maskImage:
                      "linear-gradient(to top, black 0%, black 46%, rgba(0, 0, 0, 0.72) 60%, transparent 75%)",
                    WebkitMaskImage:
                      "linear-gradient(to top, black 0%, black 46%, rgba(0, 0, 0, 0.72) 60%, transparent 75%)",
                  }}
                />

                {/* Subtle Hover Frosted Enhancement */}
                <div
                  aria-hidden="true"
                  data-about-card-hover-overlay={card.id}
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/55 via-white/30 via-45% to-transparent opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 motion-reduce:transition-none dark:from-[#02120D]/55 dark:via-[#031710]/30 dark:to-transparent"
                />

                {/* Icon Badge & Editorial Typography Over Bottom Frosted White Blur */}
                <div className="relative z-10 flex flex-col p-5 sm:p-6">
                  <div
                    data-about-card-icon={card.id}
                    className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#059669]/12 text-[#059669] ring-1 ring-[#059669]/25 backdrop-blur-xs transition-all duration-300 ease-out group-hover:scale-105 group-hover:bg-[#059669] group-hover:text-white motion-reduce:transition-none motion-reduce:group-hover:scale-100 dark:bg-emerald-400/15 dark:text-emerald-300 dark:ring-emerald-400/30 dark:group-hover:bg-emerald-500 dark:group-hover:text-white"
                  >
                    <Icon
                      className="h-[18px] w-[18px]"
                      strokeWidth={2.2}
                      aria-hidden="true"
                    />
                  </div>
                  <h2 className="text-xl font-bold tracking-tight text-[#0F172A] sm:text-[1.35rem] dark:text-white">
                    {card.title}
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-700 dark:text-emerald-100/85">
                    {card.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
