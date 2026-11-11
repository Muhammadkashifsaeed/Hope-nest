import Link from "next/link";
import {
  Calendar,
  CalendarPlus,
  Home,
  Mail,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/utils/cn";

interface QuickLinkItem {
  label: string;
  href: string;
  icon: LucideIcon;
  isCurrent?: boolean;
}

const quickLinkItems: readonly QuickLinkItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Upcoming Events", href: "/events", icon: Calendar },
  { label: "About", href: "/about", icon: Users },
  { label: "Contact", href: "/contact", icon: Mail, isCurrent: true },
  { label: "Create Event", href: "/events/create", icon: CalendarPlus },
  { label: "Privacy Policy", href: "/privacy", icon: ShieldCheck },
];

export function ContactQuickLinksSection() {
  return (
    <section
      aria-labelledby="contact-quick-links-heading"
      className="border-t border-slate-200/80 bg-white py-12 sm:py-14 lg:py-16 dark:border-white/10 dark:bg-[#03120D]"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="contact-quick-links-heading"
              className="text-xl font-bold tracking-tight text-[#0F172A] sm:text-2xl dark:text-white"
            >
              Quick Links
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-emerald-100/75">
              Navigate directly to HopeNest events, organization information,
              and resources.
            </p>
          </div>
        </div>

        <nav aria-label="Contact page quick links" className="mt-6">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:flex lg:flex-wrap lg:items-center lg:gap-3.5">
            {quickLinkItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={item.isCurrent ? "page" : undefined}
                    className={cn(
                      "btn-leaf group inline-flex min-h-[46px] w-full items-center justify-center gap-2 border px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 lg:w-auto lg:px-5",
                      item.isCurrent
                        ? "border-[#154F96] bg-[#154F96] text-white shadow-[0_8px_20px_-8px_rgba(21,79,150,0.45)] focus-visible:outline-[#154F96] dark:border-emerald-400/50 dark:bg-[#059669] dark:text-white dark:focus-visible:outline-[#10B981]"
                        : "border-slate-200/90 bg-slate-50/75 text-[#0F172A] hover:-translate-y-0.5 hover:border-[#059669]/45 hover:bg-emerald-50/60 hover:text-[#047857] hover:shadow-xs focus-visible:outline-[#059669] motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:border-white/15 dark:bg-[#062C20] dark:text-emerald-100/90 dark:hover:border-emerald-400/45 dark:hover:bg-[#083829] dark:hover:text-white",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        item.isCurrent
                          ? "text-white"
                          : "text-[#154F96] group-hover:text-[#059669] dark:text-emerald-400 dark:group-hover:text-emerald-300",
                      )}
                      aria-hidden="true"
                    />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </section>
  );
}

