"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Calendar,
  FileText,
  Heart,
  Home,
  Loader2,
  Mail,
  Shield,
  Users,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { apiClient, extractApiErrorMessage } from "@/lib/api-client";
import { publicEnv } from "@/lib/env";
import {
  newsletterSchema,
  type NewsletterFormValues,
} from "@/lib/validations";
import type { ApiSuccessResponse, NewsletterSubscriptionResult } from "@/types";
import { cn } from "@/utils/cn";

const quickLinks = [
  { label: "Home", href: "/", icon: Home },
  { label: "Upcoming Events", href: "/events", icon: Calendar },
  { label: "About Us", href: "/about", icon: Users },
  { label: "Contact", href: "/contact", icon: Mail },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy", icon: Shield },
  { label: "Terms of Service", href: "/terms-of-service", icon: FileText },
];

interface SubscriptionFeedback {
  type: "success" | "error";
  message: string;
}

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [feedback, setFeedback] = useState<SubscriptionFeedback | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" },
  });

  async function onSubscribe(values: NewsletterFormValues) {
    setFeedback(null);

    const configuredEndpoint = publicEnv.NEXT_PUBLIC_NEWSLETTER_ENDPOINT;

    try {
      const response = configuredEndpoint
        ? await apiClient.post<
            ApiSuccessResponse<NewsletterSubscriptionResult>
          >(
            configuredEndpoint,
            { email: values.email },
            configuredEndpoint.startsWith("/") ? { baseURL: "" } : undefined,
          )
        : await apiClient.post<
            ApiSuccessResponse<NewsletterSubscriptionResult>
          >("/newsletter", { email: values.email });

      setFeedback({
        type: "success",
        message:
          response.data?.message ||
          "Subscribed successfully. Thank you for joining HopeNest.",
      });
      reset();
    } catch (error) {
      setFeedback({
        type: "error",
        message: extractApiErrorMessage(
          error,
          "Unable to complete subscription right now. Please try again later.",
        ),
      });
    }
  }

  return (
    <footer className="w-full border-t border-white/10 bg-[#00291F] text-emerald-50">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main 4-Column Footer Grid */}
        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_0.95fr_1.35fr] lg:gap-8 lg:py-14">
          {/* Column 1 - Brand */}
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-block rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10B981]"
              aria-label="HopeNest Home"
            >
              <Image
                src="/images/logo.webp"
                alt="HopeNest - Social Development Events Platform"
                width={640}
                height={147}
                style={{ width: "auto" }}
                className="h-11"
              />
            </Link>

            <p className="max-w-sm text-sm leading-relaxed text-emerald-100/75">
              Connecting people and empowering communities through shared events,
              meaningful interactions, and positive change.
            </p>

            <div className="flex items-center gap-2 text-xs font-medium text-emerald-200/90">
              <Heart
                className="h-4 w-4 shrink-0 text-[#10B981]"
                aria-hidden="true"
              />
              <span>Making communities stronger together.</span>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold tracking-wide text-white">
              Quick Links
            </h2>
            <ul className="space-y-3">
              {quickLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group inline-flex items-center gap-2.5 text-sm text-emerald-100/75 transition-colors hover:text-white focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10B981]"
                    >
                      <Icon
                        className="h-4 w-4 shrink-0 text-[#10B981] transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 3 - Legal & Support */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold tracking-wide text-white">
              Legal &amp; Support
            </h2>
            <ul className="space-y-3">
              {legalLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group inline-flex items-center gap-2.5 text-sm text-emerald-100/75 transition-colors hover:text-white focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10B981]"
                    >
                      <Icon
                        className="h-4 w-4 shrink-0 text-[#10B981] transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 4 - Stay Connected */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold tracking-wide text-white">
              Stay Connected
            </h2>
            <p className="text-sm leading-relaxed text-emerald-100/75">
              Get updates about upcoming events, community activities, and
              opportunities to make a difference.
            </p>

            <form
              onSubmit={handleSubmit(onSubscribe)}
              noValidate
              className="space-y-2"
            >
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Mail
                    className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-emerald-300/70"
                    aria-hidden="true"
                  />
                  <input
                    type="email"
                    aria-label="Email address"
                    placeholder="Enter your email"
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={
                      errors.email ? "footer-newsletter-error" : undefined
                    }
                    className={cn(
                      "h-10 w-full rounded-lg border border-emerald-700/60 bg-[#00382B] pr-3 pl-9 text-sm text-white placeholder:text-emerald-200/50 transition-colors focus-visible:border-[#10B981] focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#10B981]/30",
                      errors.email &&
                        "border-red-400 focus-visible:border-red-400 focus-visible:outline-red-400/30",
                    )}
                    {...register("email")}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  aria-label="Subscribe to newsletter"
                  className="btn-leaf-sm inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center bg-[#059669] text-white shadow-xs transition-colors hover:bg-[#10B981] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10B981] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <Loader2
                      className="h-4 w-4 animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>

              {errors.email ? (
                <p
                  id="footer-newsletter-error"
                  role="alert"
                  className="text-xs text-red-300"
                >
                  {errors.email.message}
                </p>
              ) : null}

              {feedback ? (
                <p
                  role={feedback.type === "error" ? "alert" : "status"}
                  className={cn(
                    "text-xs leading-relaxed",
                    feedback.type === "success"
                      ? "text-emerald-300"
                      : "text-amber-300",
                  )}
                >
                  {feedback.message}
                </p>
              ) : null}
            </form>

            <p className="text-xs text-emerald-200/65">
              No spam. Just meaningful updates.
            </p>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="border-t border-white/10 py-6">
          <div className="flex flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left">
            <p className="text-xs text-emerald-100/75">
              &copy; {currentYear} HopeNest. All rights reserved.
            </p>
            <p className="text-xs text-emerald-200/65">
              Empowering communities through shared local action.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
