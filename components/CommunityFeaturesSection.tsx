import { CalendarPlus, HandHeart, Sparkles, Users } from "lucide-react";

const communityFeatures = [
  {
    id: "create-events",
    title: "Create Events",
    description: "Organize your own social-impact activities.",
    icon: CalendarPlus,
  },
  {
    id: "join-volunteer",
    title: "Join a Volunteer",
    description: "Be a part of meaningful initiatives.",
    icon: HandHeart,
  },
  {
    id: "build-community",
    title: "Build Community",
    description: "Meet like-minded people in your area.",
    icon: Users,
  },
  {
    id: "create-change",
    title: "Create Change",
    description: "Small actions lead to big impacts.",
    icon: Sparkles,
  },
] as const;

export function CommunityFeaturesSection() {
  return (
    <section
      aria-labelledby="community-features-heading"
      className="relative overflow-x-clip border-b border-slate-200/80 bg-gradient-to-b from-white via-[#F6FBF9] to-white py-12 sm:py-16 dark:border-white/10 dark:from-[#03120D] dark:via-[#051B14] dark:to-[#03120D]"
    >
      <h2 id="community-features-heading" className="sr-only">
        Create Events, Join a Volunteer, Build Community, and Create Change
      </h2>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid auto-rows-fr grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {communityFeatures.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.id}
                className="group relative flex h-full flex-col items-center rounded-2xl border border-slate-200/90 bg-white px-6 py-7 text-center shadow-[0_4px_20px_-6px_rgba(15,23,42,0.06)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-[#059669]/35 hover:shadow-[0_18px_36px_-12px_rgba(0,61,43,0.14)] dark:border-white/10 dark:bg-[#062C20] dark:hover:border-emerald-400/35 dark:hover:shadow-[0_18px_36px_-12px_rgba(0,0,0,0.45)]"
              >
                {/* Soft Circular Icon Badge */}
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-[#059669] ring-1 ring-emerald-200/70 transition-all duration-300 ease-out group-hover:bg-emerald-100/90 group-hover:ring-emerald-300/85 dark:bg-emerald-500/15 dark:text-emerald-400 dark:ring-emerald-400/25 dark:group-hover:bg-emerald-500/25 dark:group-hover:ring-emerald-400/45">
                  <Icon
                    className="h-7 w-7 transition-transform duration-300 ease-out group-hover:scale-105"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </div>

                {/* Bold Navy/Dark Heading */}
                <h3 className="text-lg font-bold tracking-tight text-[#0F172A] dark:text-white">
                  {feature.title}
                </h3>

                {/* Muted Blue-Gray Description */}
                <p className="mt-2 max-w-[26ch] text-sm leading-relaxed text-slate-600 dark:text-emerald-100/75">
                  {feature.description}
                </p>

                {/* Subtle Bottom Accent Hairline */}
                <span
                  aria-hidden="true"
                  className="mt-auto pt-5 inline-flex w-full justify-center"
                >
                  <span className="h-0.5 w-8 rounded-full bg-emerald-500/25 transition-all duration-300 ease-out group-hover:w-14 group-hover:bg-[#059669] dark:bg-emerald-400/25 dark:group-hover:bg-emerald-400" />
                </span>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
