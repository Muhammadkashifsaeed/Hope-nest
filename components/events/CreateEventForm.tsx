"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  AlertCircle,
  CalendarPlus,
  CheckCircle2,
  ChevronDown,
  Loader2,
  Plus,
  Send,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { apiClient, extractApiErrorMessage } from "@/lib/api-client";
import {
  CREATE_EVENT_CATEGORY_OPTIONS,
  createEventSchema,
  type CreateEventFormInput,
  type CreateEventFormValues,
} from "@/lib/validations";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  CreateEventResult,
} from "@/types";
import { cn } from "@/utils/cn";

interface CreateEventFeedback {
  status: "success" | "error";
  message: string;
  event?: CreateEventResult;
}

const VALID_FIELD_NAMES = new Set<keyof CreateEventFormInput>([
  "title",
  "category",
  "date",
  "time",
  "duration",
  "location",
  "addressDetails",
  "organizer",
  "organizerEmail",
  "spotsAvailable",
  "description",
  "fullDescription",
]);

const inputBaseClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 text-sm text-[#0F172A] placeholder:text-slate-400 transition-colors hover:border-slate-300 focus:bg-white focus-visible:border-[#154F96] focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#154F96]/25 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/15 dark:bg-[#041D15] dark:text-white dark:placeholder:text-emerald-200/45 dark:hover:border-emerald-400/35 dark:focus:bg-[#031710] dark:focus-visible:border-emerald-400 dark:focus-visible:outline-emerald-400/25";

const errorFieldClass =
  "border-red-500 bg-red-50/30 focus-visible:border-red-500 focus-visible:outline-red-500/20 dark:border-red-400 dark:bg-red-950/20";

export function CreateEventForm() {
  const submittingRef = useRef(false);
  const [hasSelectedCategory, setHasSelectedCategory] = useState(false);
  const [feedback, setFeedback] = useState<CreateEventFeedback | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateEventFormInput, unknown, CreateEventFormValues>({
    resolver: zodResolver(createEventSchema),
    mode: "onTouched",
    defaultValues: {
      title: "",
      category: "",
      date: "",
      time: "09:00",
      duration: "3 hours",
      location: "",
      addressDetails: "",
      organizer: "",
      organizerEmail: "",
      spotsAvailable: 20,
      description: "",
      fullDescription: "",
    },
  });

  async function submitProposal(values: CreateEventFormValues) {
    setFeedback(null);

    try {
      const response = await apiClient.post<
        ApiSuccessResponse<CreateEventResult>
      >("/events", values);

      if (!response.data?.success) {
        throw new Error("Unexpected response while submitting event proposal.");
      }

      setFeedback({
        status: "success",
        message:
          response.data.message ||
          "Your community event proposal has been submitted!",
        event: response.data.data,
      });

      reset();
      setHasSelectedCategory(false);
    } catch (error) {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        const details = error.response?.data?.error?.details;
        if (details) {
          for (const [field, messages] of Object.entries(details)) {
            if (
              VALID_FIELD_NAMES.has(field as keyof CreateEventFormInput) &&
              Array.isArray(messages) &&
              messages[0]
            ) {
              setError(field as keyof CreateEventFormInput, {
                type: "server",
                message: messages[0],
              });
            }
          }
        }
      }

      setFeedback({
        status: "error",
        message: extractApiErrorMessage(
          error,
          "Unable to submit your event right now. Please check your entries and try again.",
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
          await submitProposal(values);
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
      <div className="mb-6 flex items-start gap-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#059669] ring-1 ring-emerald-200/80 dark:bg-emerald-500/15 dark:text-emerald-400 dark:ring-emerald-400/25">
          <CalendarPlus className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#0F172A] sm:text-2xl dark:text-white">
            Event Details &amp; Schedule
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-emerald-100/75">
            Complete the organizer form below to submit a new neighborhood
            initiative for review.
          </p>
        </div>
      </div>

      {feedback ? (
        <div
          role={feedback.status === "error" ? "alert" : "status"}
          aria-live="polite"
          className={cn(
            "mb-6 rounded-xl border p-4 text-sm leading-relaxed",
            feedback.status === "success"
              ? "border-emerald-200 bg-emerald-50/90 text-[#065F46] dark:border-emerald-400/30 dark:bg-emerald-500/15 dark:text-emerald-100"
              : "border-red-200 bg-red-50/90 text-red-800 dark:border-red-400/35 dark:bg-red-500/15 dark:text-red-200",
          )}
        >
          <div className="flex items-start gap-3">
            {feedback.status === "success" ? (
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
            <div className="min-w-0 flex-1 space-y-2">
              <p className="font-semibold">{feedback.message}</p>
              {feedback.status === "success" && feedback.event ? (
                <div className="space-y-1 rounded-lg bg-white/80 p-3 text-xs text-slate-700 dark:bg-[#041D15]/80 dark:text-emerald-100/90">
                  <p>
                    <span className="font-semibold">Event:</span>{" "}
                    {feedback.event.title} ({feedback.event.category})
                  </p>
                  <p>
                    <span className="font-semibold">When &amp; Where:</span>{" "}
                    {feedback.event.dateTime} &middot; {feedback.event.location}
                  </p>
                  <p className="font-mono text-[11px] opacity-80">
                    Submission ID: {feedback.event.id}
                  </p>
                  <div className="flex flex-wrap gap-2.5 pt-2">
                    <Link
                      href="/events"
                      className="btn-leaf-sm inline-flex h-8 items-center justify-center bg-[#059669] px-3.5 text-xs font-semibold text-white transition-colors hover:bg-[#047857]"
                    >
                      Browse Upcoming Events
                    </Link>
                    <button
                      type="button"
                      onClick={() => setFeedback(null)}
                      className="btn-leaf-sm inline-flex h-8 cursor-pointer items-center justify-center gap-1 border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/15 dark:bg-[#062C20] dark:text-emerald-100"
                    >
                      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Submit Another Event</span>
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      <form
        onSubmit={handleFormSubmit}
        noValidate
        className="space-y-5"
        aria-busy={isSubmitting}
      >
        {/* Title & Category */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="create-event-title"
              className="text-sm font-semibold text-[#0F172A] dark:text-emerald-50"
            >
              Event Title
              <span
                aria-hidden="true"
                className="ml-0.5 text-[#059669] dark:text-emerald-400"
              >
                *
              </span>
            </label>
            <input
              id="create-event-title"
              type="text"
              required
              placeholder="e.g. Riverside Park Clean & Plant Day"
              disabled={isSubmitting}
              aria-invalid={errors.title ? true : undefined}
              aria-describedby={
                errors.title ? "create-event-title-error" : undefined
              }
              className={cn(inputBaseClass, errors.title && errorFieldClass)}
              {...register("title")}
            />
            {errors.title ? (
              <p
                id="create-event-title-error"
                role="alert"
                className="text-xs font-medium text-red-600 dark:text-red-300"
              >
                {errors.title.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="create-event-category"
              className="text-sm font-semibold text-[#0F172A] dark:text-emerald-50"
            >
              Category
              <span
                aria-hidden="true"
                className="ml-0.5 text-[#059669] dark:text-emerald-400"
              >
                *
              </span>
            </label>
            <div className="relative">
              <select
                id="create-event-category"
                required
                disabled={isSubmitting}
                aria-invalid={errors.category ? true : undefined}
                aria-describedby={
                  errors.category ? "create-event-category-error" : undefined
                }
                className={cn(
                  inputBaseClass,
                  "cursor-pointer appearance-none pr-10",
                  hasSelectedCategory
                    ? "text-[#0F172A] dark:text-white"
                    : "text-slate-400 dark:text-emerald-200/45",
                  errors.category && errorFieldClass,
                )}
                {...register("category", {
                  onChange: (event) =>
                    setHasSelectedCategory(Boolean(event.target.value)),
                })}
              >
                <option value="">Select a category</option>
                {CREATE_EVENT_CATEGORY_OPTIONS.map((categoryOption) => (
                  <option
                    key={categoryOption}
                    value={categoryOption}
                    className="bg-white text-[#0F172A] dark:bg-[#05291E] dark:text-white"
                  >
                    {categoryOption}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-emerald-200/60"
                aria-hidden="true"
              />
            </div>
            {errors.category ? (
              <p
                id="create-event-category-error"
                role="alert"
                className="text-xs font-medium text-red-600 dark:text-red-300"
              >
                {errors.category.message}
              </p>
            ) : null}
          </div>
        </div>

        {/* Date, Start Time & Duration */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="create-event-date"
              className="text-sm font-semibold text-[#0F172A] dark:text-emerald-50"
            >
              Event Date
              <span
                aria-hidden="true"
                className="ml-0.5 text-[#059669] dark:text-emerald-400"
              >
                *
              </span>
            </label>
            <input
              id="create-event-date"
              type="date"
              required
              disabled={isSubmitting}
              aria-invalid={errors.date ? true : undefined}
              aria-describedby={
                errors.date ? "create-event-date-error" : undefined
              }
              className={cn(inputBaseClass, errors.date && errorFieldClass)}
              {...register("date")}
            />
            {errors.date ? (
              <p
                id="create-event-date-error"
                role="alert"
                className="text-xs font-medium text-red-600 dark:text-red-300"
              >
                {errors.date.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="create-event-time"
              className="text-sm font-semibold text-[#0F172A] dark:text-emerald-50"
            >
              Start Time
              <span
                aria-hidden="true"
                className="ml-0.5 text-[#059669] dark:text-emerald-400"
              >
                *
              </span>
            </label>
            <input
              id="create-event-time"
              type="time"
              required
              disabled={isSubmitting}
              aria-invalid={errors.time ? true : undefined}
              aria-describedby={
                errors.time ? "create-event-time-error" : undefined
              }
              className={cn(inputBaseClass, errors.time && errorFieldClass)}
              {...register("time")}
            />
            {errors.time ? (
              <p
                id="create-event-time-error"
                role="alert"
                className="text-xs font-medium text-red-600 dark:text-red-300"
              >
                {errors.time.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="create-event-duration"
              className="text-sm font-semibold text-[#0F172A] dark:text-emerald-50"
            >
              Duration
              <span
                aria-hidden="true"
                className="ml-0.5 text-[#059669] dark:text-emerald-400"
              >
                *
              </span>
            </label>
            <input
              id="create-event-duration"
              type="text"
              required
              placeholder="e.g. 3 hours"
              disabled={isSubmitting}
              aria-invalid={errors.duration ? true : undefined}
              aria-describedby={
                errors.duration ? "create-event-duration-error" : undefined
              }
              className={cn(inputBaseClass, errors.duration && errorFieldClass)}
              {...register("duration")}
            />
            {errors.duration ? (
              <p
                id="create-event-duration-error"
                role="alert"
                className="text-xs font-medium text-red-600 dark:text-red-300"
              >
                {errors.duration.message}
              </p>
            ) : null}
          </div>
        </div>

        {/* Venue & Address */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="create-event-location"
              className="text-sm font-semibold text-[#0F172A] dark:text-emerald-50"
            >
              Venue / Neighborhood
              <span
                aria-hidden="true"
                className="ml-0.5 text-[#059669] dark:text-emerald-400"
              >
                *
              </span>
            </label>
            <input
              id="create-event-location"
              type="text"
              required
              placeholder="e.g. Greenway Botanical Trail"
              disabled={isSubmitting}
              aria-invalid={errors.location ? true : undefined}
              aria-describedby={
                errors.location ? "create-event-location-error" : undefined
              }
              className={cn(inputBaseClass, errors.location && errorFieldClass)}
              {...register("location")}
            />
            {errors.location ? (
              <p
                id="create-event-location-error"
                role="alert"
                className="text-xs font-medium text-red-600 dark:text-red-300"
              >
                {errors.location.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="create-event-address"
              className="text-sm font-semibold text-[#0F172A] dark:text-emerald-50"
            >
              Meeting Point / Street Address
              <span
                aria-hidden="true"
                className="ml-0.5 text-[#059669] dark:text-emerald-400"
              >
                *
              </span>
            </label>
            <input
              id="create-event-address"
              type="text"
              required
              placeholder="e.g. Trailhead Gate B, Riverside Preserve"
              disabled={isSubmitting}
              aria-invalid={errors.addressDetails ? true : undefined}
              aria-describedby={
                errors.addressDetails ? "create-event-address-error" : undefined
              }
              className={cn(
                inputBaseClass,
                errors.addressDetails && errorFieldClass,
              )}
              {...register("addressDetails")}
            />
            {errors.addressDetails ? (
              <p
                id="create-event-address-error"
                role="alert"
                className="text-xs font-medium text-red-600 dark:text-red-300"
              >
                {errors.addressDetails.message}
              </p>
            ) : null}
          </div>
        </div>

        {/* Organizer Info & Spots */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="create-event-organizer"
              className="text-sm font-semibold text-[#0F172A] dark:text-emerald-50"
            >
              Organizer / Group
              <span
                aria-hidden="true"
                className="ml-0.5 text-[#059669] dark:text-emerald-400"
              >
                *
              </span>
            </label>
            <input
              id="create-event-organizer"
              type="text"
              required
              placeholder="e.g. HopeNest Park Stewards"
              disabled={isSubmitting}
              aria-invalid={errors.organizer ? true : undefined}
              aria-describedby={
                errors.organizer ? "create-event-organizer-error" : undefined
              }
              className={cn(inputBaseClass, errors.organizer && errorFieldClass)}
              {...register("organizer")}
            />
            {errors.organizer ? (
              <p
                id="create-event-organizer-error"
                role="alert"
                className="text-xs font-medium text-red-600 dark:text-red-300"
              >
                {errors.organizer.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="create-event-email"
              className="text-sm font-semibold text-[#0F172A] dark:text-emerald-50"
            >
              Coordinator Email
              <span
                aria-hidden="true"
                className="ml-0.5 text-[#059669] dark:text-emerald-400"
              >
                *
              </span>
            </label>
            <input
              id="create-event-email"
              type="email"
              autoComplete="email"
              required
              placeholder="coordinator@example.com"
              disabled={isSubmitting}
              aria-invalid={errors.organizerEmail ? true : undefined}
              aria-describedby={
                errors.organizerEmail ? "create-event-email-error" : undefined
              }
              className={cn(
                inputBaseClass,
                errors.organizerEmail && errorFieldClass,
              )}
              {...register("organizerEmail")}
            />
            {errors.organizerEmail ? (
              <p
                id="create-event-email-error"
                role="alert"
                className="text-xs font-medium text-red-600 dark:text-red-300"
              >
                {errors.organizerEmail.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="create-event-spots"
              className="text-sm font-semibold text-[#0F172A] dark:text-emerald-50"
            >
              Volunteer Spots
              <span
                aria-hidden="true"
                className="ml-0.5 text-[#059669] dark:text-emerald-400"
              >
                *
              </span>
            </label>
            <input
              id="create-event-spots"
              type="number"
              min={1}
              max={500}
              required
              disabled={isSubmitting}
              aria-invalid={errors.spotsAvailable ? true : undefined}
              aria-describedby={
                errors.spotsAvailable ? "create-event-spots-error" : undefined
              }
              className={cn(
                inputBaseClass,
                errors.spotsAvailable && errorFieldClass,
              )}
              {...register("spotsAvailable")}
            />
            {errors.spotsAvailable ? (
              <p
                id="create-event-spots-error"
                role="alert"
                className="text-xs font-medium text-red-600 dark:text-red-300"
              >
                {errors.spotsAvailable.message}
              </p>
            ) : null}
          </div>
        </div>

        {/* Short Summary */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="create-event-description"
            className="text-sm font-semibold text-[#0F172A] dark:text-emerald-50"
          >
            Short Event Summary
            <span
              aria-hidden="true"
              className="ml-0.5 text-[#059669] dark:text-emerald-400"
            >
              *
            </span>
          </label>
          <textarea
            id="create-event-description"
            rows={3}
            required
            placeholder="Summarize the goal, volunteer activities, and neighborhood impact in 1-2 sentences..."
            disabled={isSubmitting}
            aria-invalid={errors.description ? true : undefined}
            aria-describedby={
              errors.description ? "create-event-description-error" : undefined
            }
            className={cn(
              "min-h-[96px] w-full resize-y rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-3 text-sm leading-relaxed text-[#0F172A] placeholder:text-slate-400 transition-colors hover:border-slate-300 focus:bg-white focus-visible:border-[#154F96] focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#154F96]/25 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/15 dark:bg-[#041D15] dark:text-white dark:placeholder:text-emerald-200/45 dark:hover:border-emerald-400/35 dark:focus:bg-[#031710] dark:focus-visible:border-emerald-400 dark:focus-visible:outline-emerald-400/25",
              errors.description && errorFieldClass,
            )}
            {...register("description")}
          />
          {errors.description ? (
            <p
              id="create-event-description-error"
              role="alert"
              className="text-xs font-medium text-red-600 dark:text-red-300"
            >
              {errors.description.message}
            </p>
          ) : null}
        </div>

        {/* Full Overview (Optional) */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="create-event-full-description"
            className="text-sm font-semibold text-[#0F172A] dark:text-emerald-50"
          >
            Volunteer Preparation &amp; Full Overview{" "}
            <span className="font-normal text-slate-400 dark:text-emerald-200/55">
              (Optional)
            </span>
          </label>
          <textarea
            id="create-event-full-description"
            rows={4}
            placeholder="Include equipment supplied, what participants should bring, accessibility notes, or arrival instructions..."
            disabled={isSubmitting}
            aria-invalid={errors.fullDescription ? true : undefined}
            aria-describedby={
              errors.fullDescription
                ? "create-event-full-description-error"
                : undefined
            }
            className={cn(
              "min-h-[112px] w-full resize-y rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-3 text-sm leading-relaxed text-[#0F172A] placeholder:text-slate-400 transition-colors hover:border-slate-300 focus:bg-white focus-visible:border-[#154F96] focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#154F96]/25 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/15 dark:bg-[#041D15] dark:text-white dark:placeholder:text-emerald-200/45 dark:hover:border-emerald-400/35 dark:focus:bg-[#031710] dark:focus-visible:border-emerald-400 dark:focus-visible:outline-emerald-400/25",
              errors.fullDescription && errorFieldClass,
            )}
            {...register("fullDescription")}
          />
          {errors.fullDescription ? (
            <p
              id="create-event-full-description-error"
              role="alert"
              className="text-xs font-medium text-red-600 dark:text-red-300"
            >
              {errors.fullDescription.message}
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-leaf inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 bg-[#059669] px-6 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#047857] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#059669] active:translate-y-0 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-65 sm:text-[15px] dark:hover:bg-[#10B981]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>Submitting Event...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" aria-hidden="true" />
              <span>Submit Event Proposal</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

