import { Clock, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";

interface ContactDetailItem {
  id: string;
  label: string;
  icon: LucideIcon;
  tone: "green" | "blue";
  lines?: readonly string[];
  href?: string;
  linkText?: string;
}

const contactDetails: readonly ContactDetailItem[] = [
  {
    id: "address",
    label: "Address",
    icon: MapPin,
    tone: "green",
    lines: ["123 Community Street,", "City, Country"],
  },
  {
    id: "phone",
    label: "Phone",
    icon: Phone,
    tone: "blue",
    href: "tel:+15551234567",
    linkText: "+1 (555) 123-4567",
  },
  {
    id: "email",
    label: "Email",
    icon: Mail,
    tone: "green",
    href: "mailto:info@hopenest.io",
    linkText: "info@hopenest.io",
  },
  {
    id: "hours",
    label: "Hours",
    icon: Clock,
    tone: "blue",
    lines: ["Mon-Fri: 9am - 6pm", "Sat: 10am - 4pm"],
  },
];

export function ContactDetailsCard() {
  return (
    <aside
      aria-labelledby="contact-details-heading"
      className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_14px_38px_-14px_rgba(15,23,42,0.09)] sm:p-8 dark:border-white/10 dark:bg-[#062C20] dark:shadow-[0_14px_38px_-14px_rgba(0,0,0,0.45)]"
    >
      <div className="mb-6">
        <h2
          id="contact-details-heading"
          className="text-xl font-bold tracking-tight text-[#0F172A] sm:text-2xl dark:text-white"
        >
          Contact Details
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-emerald-100/75">
          Prefer direct communication? Connect with our community office using
          the details below.
        </p>
      </div>

      <div className="space-y-3.5">
        {contactDetails.map((item) => {
          const Icon = item.icon;
          const isBlue = item.tone === "blue";

          return (
            <div
              key={item.id}
              data-contact-detail={item.id}
              className="flex items-start gap-4 rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 shadow-[0_2px_10px_-6px_rgba(15,23,42,0.08)] transition-colors hover:border-slate-300/90 dark:border-white/10 dark:bg-[#041D15]/80 dark:hover:border-white/20"
            >
              <div
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1",
                  isBlue
                    ? "bg-blue-50 text-[#154F96] ring-blue-200/80 dark:bg-blue-500/15 dark:text-blue-300 dark:ring-blue-400/30"
                    : "bg-emerald-50 text-[#059669] ring-emerald-200/80 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-400/30",
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-[#0F172A] dark:text-white">
                  {item.label}
                </h3>

                {item.href && item.linkText ? (
                  <a
                    href={item.href}
                    className={cn(
                      "mt-1 inline-block break-words text-sm font-medium text-slate-600 transition-colors focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 dark:text-emerald-100/85",
                      isBlue
                        ? "hover:text-[#154F96] focus-visible:outline-[#154F96] dark:hover:text-blue-300"
                        : "hover:text-[#059669] focus-visible:outline-[#059669] dark:hover:text-emerald-300",
                    )}
                  >
                    {item.linkText}
                  </a>
                ) : (
                  <div className="mt-1 space-y-0.5 text-sm leading-relaxed text-slate-600 dark:text-emerald-100/80">
                    {item.lines?.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

