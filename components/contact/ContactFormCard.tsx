"use client";

import { useRef, useState, type FormEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Loader2,
  Send,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { apiClient, extractApiErrorMessage } from "@/lib/api-client";
import {
  CONTACT_SUBJECT_OPTIONS,
  contactSchema,
  type ContactFormInput,
  type ContactFormValues,
} from "@/lib/validations";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  ContactSubmissionResult,
} from "@/types";
import { cn } from "@/utils/cn";
import axios from "axios";

interface FormSubmissionState {
  status: "success" | "error";
  message: string;
  referenceId?: string;
}

const VALID_FIELD_NAMES = new Set<keyof ContactFormInput>([
  "name",
  "email",
  "subject",
  "message",
]);

export function ContactFormCard() {
  const submittingRef = useRef(false);
  const [hasSelectedSubject, setHasSelectedSubject] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] =
    useState<FormSubmissionState | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInput, unknown, ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function submitContact(values: ContactFormValues) {
    setSubmissionFeedback(null);

    try {
      const response = await apiClient.post<
        ApiSuccessResponse<ContactSubmissionResult>
      >("/contact", values);

      if (!response.data?.success) {
        throw new Error("Unexpected response while submitting your message.");
      }

      setSubmissionFeedback({
        status: "success",
        message:
          response.data.message ||
          "Thank you for reaching out! Your message has been received.",
        referenceId: response.data.data?.id,
      });

      reset({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setHasSelectedSubject(false);
    } catch (error) {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        const details = error.response?.data?.error?.details;
        if (details) {
          for (const [field, messages] of Object.entries(details)) {
            if (
              VALID_FIELD_NAMES.has(field as keyof ContactFormInput) &&
              Array.isArray(messages) &&
              messages[0]
            ) {
              setError(field as keyof ContactFormInput, {
                type: "server",
                message: messages[0],
              });
            }
          }
        }
      }

      setSubmissionFeedback({
        status: "error",
        message: extractApiErrorMessage(
          error,
          "Unable to send your message right now. Please try again shortly.",
        ),
      });
    }
  }

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    if (submittingRef.current) {
      event.preventDefault();
      return;
    }

    submittingRef.current = true;
    void handleSubmit(
      async (values) => {
        try {
          await submitContact(values);
        } finally {
          submittingRef.current = false;
        }
      },
      () => {
        submittingRef.current = false;
      },
    )(event);
  }

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_14px_38px_-14px_rgba(15,23,42,0.09)] sm:p-8 lg:p-9 dark:border-white/10 dark:bg-[#062C20] dark:shadow-[0_14px_38px_-14px_rgba(0,0,0,0.45)]">
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-[#0F172A] sm:text-2xl dark:text-white">
          Send Us a Message
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-emerald-100/75">
          Share your inquiry below and a member of our community support team
          will follow up with you.
        </p>
      </div>

      {submissionFeedback ? (
        <div
          role={submissionFeedback.status === "error" ? "alert" : "status"}
          aria-live="polite"
          className={cn(
            "mb-6 flex items-start gap-3 rounded-xl border p-4 text-sm leading-relaxed",
            submissionFeedback.status === "success"
              ? "border-emerald-200 bg-emerald-50/90 text-[#065F46] dark:border-emerald-400/30 dark:bg-emerald-500/15 dark:text-emerald-100"
              : "border-red-200 bg-red-50/90 text-red-800 dark:border-red-400/35 dark:bg-red-500/15 dark:text-red-200",
          )}
        >
          {submissionFeedback.status === "success" ? (
            <CheckCircle2
              className="mt-0.5 h-5 w-5 shrink-0 text-[#059669] dark:text-emerald-400"
              aria-hidden="true"
            />
          ) : (
            <AlertCircle
              className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400"
              aria-hidden="true"
            />
          )}
          <div className="min-w-0 flex-1 space-y-1">
            <p className="font-medium">{submissionFeedback.message}</p>
            {submissionFeedback.status === "success" &&
            submissionFeedback.referenceId ? (
              <p className="font-mono text-xs opacity-80">
                Reference ID: {submissionFeedback.referenceId}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      <form
        onSubmit={handleFormSubmit}
        noValidate
        className="space-y-5"
        aria-busy={isSubmitting}
      >
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Name Field */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="contact-name"
              className="text-sm font-semibold text-[#0F172A] dark:text-emerald-50"
            >
              Name
              <span
                aria-hidden="true"
                className="ml-0.5 text-[#059669] dark:text-emerald-400"
              >
                *
              </span>
            </label>
            <input
              id="contact-name"
              type="text"
              autoComplete="name"
              required
              placeholder="Enter your full name"
              disabled={isSubmitting}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? "contact-name-error" : undefined}
              className={cn(
                "h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 text-sm text-[#0F172A] placeholder:text-slate-400 transition-colors hover:border-slate-300 focus:bg-white focus-visible:border-[#154F96] focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#154F96]/25 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/15 dark:bg-[#041D15] dark:text-white dark:placeholder:text-emerald-200/45 dark:hover:border-emerald-400/35 dark:focus:bg-[#031710] dark:focus-visible:border-emerald-400 dark:focus-visible:outline-emerald-400/25",
                errors.name &&
                  "border-red-500 bg-red-50/30 focus-visible:border-red-500 focus-visible:outline-red-500/20 dark:border-red-400 dark:bg-red-950/20",
              )}
              {...register("name")}
            />
            {errors.name ? (
              <p
                id="contact-name-error"
                role="alert"
                className="text-xs font-medium text-red-600 dark:text-red-300"
              >
                {errors.name.message}
              </p>
            ) : null}
          </div>

          {/* Email Field */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="contact-email"
              className="text-sm font-semibold text-[#0F172A] dark:text-emerald-50"
            >
              Email
              <span
                aria-hidden="true"
                className="ml-0.5 text-[#059669] dark:text-emerald-400"
              >
                *
              </span>
            </label>
            <input
              id="contact-email"
              type="email"
              autoComplete="email"
              required
              placeholder="Enter your email address"
              disabled={isSubmitting}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "contact-email-error" : undefined}
              className={cn(
                "h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 text-sm text-[#0F172A] placeholder:text-slate-400 transition-colors hover:border-slate-300 focus:bg-white focus-visible:border-[#154F96] focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#154F96]/25 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/15 dark:bg-[#041D15] dark:text-white dark:placeholder:text-emerald-200/45 dark:hover:border-emerald-400/35 dark:focus:bg-[#031710] dark:focus-visible:border-emerald-400 dark:focus-visible:outline-emerald-400/25",
                errors.email &&
                  "border-red-500 bg-red-50/30 focus-visible:border-red-500 focus-visible:outline-red-500/20 dark:border-red-400 dark:bg-red-950/20",
              )}
              {...register("email")}
            />
            {errors.email ? (
              <p
                id="contact-email-error"
                role="alert"
                className="text-xs font-medium text-red-600 dark:text-red-300"
              >
                {errors.email.message}
              </p>
            ) : null}
          </div>
        </div>

        {/* Subject Dropdown */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="contact-subject"
            className="text-sm font-semibold text-[#0F172A] dark:text-emerald-50"
          >
            Subject
            <span
              aria-hidden="true"
              className="ml-0.5 text-[#059669] dark:text-emerald-400"
            >
              *
            </span>
          </label>
          <div className="relative">
            <select
              id="contact-subject"
              required
              disabled={isSubmitting}
              aria-invalid={errors.subject ? true : undefined}
              aria-describedby={
                errors.subject ? "contact-subject-error" : undefined
              }
              className={cn(
                "h-11 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50/70 pr-10 pl-3.5 text-sm transition-colors hover:border-slate-300 focus:bg-white focus-visible:border-[#154F96] focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#154F96]/25 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/15 dark:bg-[#041D15] dark:hover:border-emerald-400/35 dark:focus:bg-[#031710] dark:focus-visible:border-emerald-400 dark:focus-visible:outline-emerald-400/25",
                hasSelectedSubject
                  ? "text-[#0F172A] dark:text-white"
                  : "text-slate-400 dark:text-emerald-200/45",
                errors.subject &&
                  "border-red-500 bg-red-50/30 focus-visible:border-red-500 focus-visible:outline-red-500/20 dark:border-red-400 dark:bg-red-950/20",
              )}
              {...register("subject", {
                onChange: (event) =>
                  setHasSelectedSubject(Boolean(event.target.value)),
              })}
            >
              <option value="" className="text-slate-500">
                Select a subject
              </option>
              {CONTACT_SUBJECT_OPTIONS.map((option) => (
                <option
                  key={option}
                  value={option}
                  className="bg-white text-[#0F172A] dark:bg-[#05291E] dark:text-white"
                >
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-emerald-200/60"
              aria-hidden="true"
            />
          </div>
          {errors.subject ? (
            <p
              id="contact-subject-error"
              role="alert"
              className="text-xs font-medium text-red-600 dark:text-red-300"
            >
              {errors.subject.message}
            </p>
          ) : null}
        </div>

        {/* Message Textarea */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="contact-message"
            className="text-sm font-semibold text-[#0F172A] dark:text-emerald-50"
          >
            Message
            <span
              aria-hidden="true"
              className="ml-0.5 text-[#059669] dark:text-emerald-400"
            >
              *
            </span>
          </label>
          <textarea
            id="contact-message"
            rows={5}
            required
            placeholder="Write your message here..."
            disabled={isSubmitting}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={
              errors.message ? "contact-message-error" : undefined
            }
            className={cn(
              "min-h-[140px] w-full resize-y rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-3 text-sm leading-relaxed text-[#0F172A] placeholder:text-slate-400 transition-colors hover:border-slate-300 focus:bg-white focus-visible:border-[#154F96] focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#154F96]/25 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/15 dark:bg-[#041D15] dark:text-white dark:placeholder:text-emerald-200/45 dark:hover:border-emerald-400/35 dark:focus:bg-[#031710] dark:focus-visible:border-emerald-400 dark:focus-visible:outline-emerald-400/25",
              errors.message &&
                "border-red-500 bg-red-50/30 focus-visible:border-red-500 focus-visible:outline-red-500/20 dark:border-red-400 dark:bg-red-950/20",
            )}
            {...register("message")}
          />
          {errors.message ? (
            <p
              id="contact-message-error"
              role="alert"
              className="text-xs font-medium text-red-600 dark:text-red-300"
            >
              {errors.message.message}
            </p>
          ) : null}
        </div>

        {/* Full-Width Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-leaf inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 bg-[#059669] px-6 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#047857] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#059669] active:translate-y-0 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-65 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:text-[15px] dark:hover:bg-[#10B981]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>Sending Message...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" aria-hidden="true" />
              <span>Send Message</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
