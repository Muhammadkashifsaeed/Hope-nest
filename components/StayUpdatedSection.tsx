"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Loader2, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { apiClient, extractApiErrorMessage } from "@/lib/api-client";
import { publicEnv } from "@/lib/env";
import {
  newsletterSchema,
  type NewsletterFormValues,
} from "@/lib/validations";
import type { ApiSuccessResponse, NewsletterSubscriptionResult } from "@/types";
import { cn } from "@/utils/cn";

interface NewsletterFeedback {
  type: "success" | "error";
  message: string;
}

export function StayUpdatedSection() {
  const [feedback, setFeedback] = useState<NewsletterFeedback | null>(null);

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
          "Subscribed successfully. Upcoming events and community stories are on their way.",
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
    <section
      id="stay-updated"
      aria-labelledby="stay-updated-heading"
      className="scroll-mt-20 relative overflow-x-clip border-b border-slate-200/80 bg-[#F8FAFC] pt-2 pb-14 sm:pt-4 sm:pb-16 lg:pb-20 dark:border-white/10 dark:bg-[#041711]"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-emerald-950/10 bg-gradient-to-br from-[#F1FAF6] via-white to-[#EBF7F2] p-6 shadow-[0_12px_34px_-14px_rgba(0,61,43,0.12)] sm:p-9 lg:px-12 lg:py-11 dark:border-emerald-400/20 dark:from-[#062B1F] dark:via-[#06261B] dark:to-[#041D15] dark:shadow-[0_16px_38px_-14px_rgba(0,0,0,0.45)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            {/* Left Side: Icon + Heading + Supporting Description */}
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100/90 text-[#059669] ring-1 ring-emerald-200/80 dark:bg-emerald-500/15 dark:text-emerald-400 dark:ring-emerald-400/25">
                <Mail className="h-6 w-6" aria-hidden="true" />
              </div>

              <div className="space-y-1.5">
                <h2
                  id="stay-updated-heading"
                  className="text-2xl font-bold tracking-tight text-[#072B20] sm:text-3xl dark:text-white"
                >
                  Stay Updated
                </h2>
                <p className="max-w-lg text-sm leading-relaxed text-slate-600 sm:text-base dark:text-emerald-100/75">
                  Get the latest events, stories, and opportunities delivered to
                  your inbox.
                </p>
              </div>
            </div>

            {/* Right Side: Horizontal Subscription Form */}
            <div className="w-full shrink-0 lg:max-w-md xl:max-w-lg">
              <form
                onSubmit={handleSubmit(onSubscribe)}
                noValidate
                aria-label="Newsletter subscription"
                className="space-y-2.5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
                  <div className="flex-1 min-w-0">
                    <input
                      type="email"
                      autoComplete="email"
                      aria-label="Email address"
                      placeholder="Enter your email address"
                      aria-invalid={errors.email ? true : undefined}
                      aria-describedby={
                        errors.email ? "stay-updated-email-error" : undefined
                      }
                      className={cn(
                        "h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 shadow-xs transition-colors focus-visible:border-[#059669] focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#059669]/25 dark:border-white/15 dark:bg-[#041B13] dark:text-white dark:placeholder:text-emerald-200/45 dark:focus-visible:border-emerald-400",
                        errors.email &&
                          "border-red-500 focus-visible:border-red-500 focus-visible:outline-red-500/25 dark:border-red-400",
                      )}
                      {...register("email")}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-leaf inline-flex h-12 w-full shrink-0 cursor-pointer items-center justify-center gap-2 bg-[#059669] px-6 text-sm font-semibold whitespace-nowrap text-white shadow-xs transition-colors hover:bg-[#047857] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#059669] disabled:cursor-not-allowed disabled:opacity-65 sm:w-auto dark:hover:bg-[#10B981]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2
                          className="h-4 w-4 animate-spin"
                          aria-hidden="true"
                        />
                        <span>Subscribing...</span>
                      </>
                    ) : (
                      <span>Subscribe</span>
                    )}
                  </button>
                </div>

                {errors.email ? (
                  <p
                    id="stay-updated-email-error"
                    role="alert"
                    className="flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400"
                  >
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>{errors.email.message}</span>
                  </p>
                ) : null}

                {feedback ? (
                  <p
                    role={feedback.type === "error" ? "alert" : "status"}
                    className={cn(
                      "flex items-start gap-1.5 text-xs font-medium leading-relaxed",
                      feedback.type === "success"
                        ? "text-[#047857] dark:text-emerald-300"
                        : "text-red-600 dark:text-red-400",
                    )}
                  >
                    {feedback.type === "success" ? (
                      <CheckCircle2
                        className="mt-0.5 h-3.5 w-3.5 shrink-0"
                        aria-hidden="true"
                      />
                    ) : (
                      <AlertCircle
                        className="mt-0.5 h-3.5 w-3.5 shrink-0"
                        aria-hidden="true"
                      />
                    )}
                    <span>{feedback.message}</span>
                  </p>
                ) : null}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
