"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LogOut,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/components/providers/AuthProvider";
import { apiClient, extractApiErrorMessage } from "@/lib/api-client";
import {
  signInSchema,
  signUpSchema,
  type SignInFormValues,
  type SignUpFormValues,
} from "@/lib/validations";
import type { ApiErrorResponse, ApiSuccessResponse, AuthUser } from "@/types";
import { cn } from "@/utils/cn";

export interface AuthFormCardProps {
  mode: "sign-in" | "sign-up";
}

function sanitizeClientNextPath(raw: string | null): string {
  if (!raw) return "/";
  const trimmed = raw.trim();
  if (
    trimmed.startsWith("/") &&
    !trimmed.startsWith("//") &&
    !trimmed.startsWith("/\\")
  ) {
    return trimmed;
  }
  return "/";
}

function getOAuthErrorMessage(errorCode: string | null): string | null {
  switch (errorCode) {
    case "google_not_configured":
      return "Google OAuth 2.0 is ready on /api/auth/google, but GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are not set in .env.local yet. Configure those keys to enable Google login, or continue with Email & Password below.";
    case "oauth_cancelled":
      return "Google sign-in was cancelled. You can try again or use your email and password.";
    case "oauth_state_expired":
    case "oauth_state_invalid":
      return "Your Google sign-in session expired or could not be verified. Please try again.";
    case "google_email_unverified":
      return "Your Google account email address must be verified before signing in.";
    case "google_exchange_failed":
    case "google_profile_failed":
    case "oauth_failed":
      return "Unable to complete Google authentication right now. Please try again shortly.";
    default:
      return null;
  }
}

function getUserInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "HN";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function GoogleLogoIcon() {
  return (
    <svg
      className="h-4.5 w-4.5 shrink-0"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
      />
    </svg>
  );
}

const VALID_SIGN_IN_FIELDS = new Set<keyof SignInFormValues>([
  "email",
  "password",
]);

function SignInEmailForm({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const { setSessionUser } = useAuth();
  const submittingRef = useRef(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formFeedback, setFormFeedback] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    mode: "onTouched",
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: SignInFormValues) {
    setFormFeedback(null);

    try {
      const response = await apiClient.post<
        ApiSuccessResponse<{ user: AuthUser }>
      >("/auth/sign-in", values);

      const authenticatedUser = response.data?.data?.user;
      if (!response.data?.success || !authenticatedUser) {
        throw new Error("Unable to sign in right now.");
      }

      setSessionUser(authenticatedUser);
      setFormFeedback({
        type: "success",
        message: `Welcome back, ${authenticatedUser.name}! Redirecting...`,
      });
      router.push(nextPath);
      router.refresh();
    } catch (error) {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        const details = error.response?.data?.error?.details;
        if (details) {
          for (const [field, messages] of Object.entries(details)) {
            if (
              VALID_SIGN_IN_FIELDS.has(field as keyof SignInFormValues) &&
              Array.isArray(messages) &&
              messages[0]
            ) {
              setError(field as keyof SignInFormValues, {
                type: "server",
                message: messages[0],
              });
            }
          }
        }
      }

      setFormFeedback({
        type: "error",
        message: extractApiErrorMessage(
          error,
          "Invalid email or password. Please try again.",
        ),
      });
    }
  }

  function handleProtectedSubmit(event: FormEvent<HTMLFormElement>) {
    if (submittingRef.current) {
      event.preventDefault();
      return;
    }
    submittingRef.current = true;
    void handleSubmit(
      async (values) => {
        try {
          await onSubmit(values);
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
    <form
      onSubmit={handleProtectedSubmit}
      noValidate
      aria-busy={isSubmitting}
      className="space-y-4"
    >
      {formFeedback ? (
        <div
          role={formFeedback.type === "error" ? "alert" : "status"}
          aria-live="polite"
          className={cn(
            "flex items-start gap-2.5 rounded-xl border p-3.5 text-sm leading-relaxed",
            formFeedback.type === "success"
              ? "border-emerald-200 bg-emerald-50/90 text-[#065F46] dark:border-emerald-400/30 dark:bg-emerald-500/15 dark:text-emerald-100"
              : "border-red-200 bg-red-50/90 text-red-800 dark:border-red-400/35 dark:bg-red-500/15 dark:text-red-200",
          )}
        >
          {formFeedback.type === "success" ? (
            <CheckCircle2
              className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#059669] dark:text-emerald-400"
              aria-hidden="true"
            />
          ) : (
            <AlertCircle
              className="mt-0.5 h-4.5 w-4.5 shrink-0 text-red-600 dark:text-red-400"
              aria-hidden="true"
            />
          )}
          <span className="font-medium">{formFeedback.message}</span>
        </div>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="signin-email"
          className="text-sm font-semibold text-[#0F172A] dark:text-emerald-50"
        >
          Email address
        </label>
        <input
          id="signin-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          disabled={isSubmitting}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "signin-email-error" : undefined}
          className={cn(
            "h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 text-sm text-[#0F172A] placeholder:text-slate-400 transition-colors hover:border-slate-300 focus:bg-white focus-visible:border-[#059669] focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#059669]/25 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/15 dark:bg-[#041D15] dark:text-white dark:placeholder:text-emerald-200/45 dark:hover:border-emerald-400/35 dark:focus:bg-[#031710] dark:focus-visible:border-emerald-400",
            errors.email &&
              "border-red-500 bg-red-50/30 focus-visible:border-red-500 focus-visible:outline-red-500/20 dark:border-red-400 dark:bg-red-950/20",
          )}
          {...register("email")}
        />
        {errors.email ? (
          <p
            id="signin-email-error"
            role="alert"
            className="text-xs font-medium text-red-600 dark:text-red-300"
          >
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="signin-password"
          className="text-sm font-semibold text-[#0F172A] dark:text-emerald-50"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="signin-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            disabled={isSubmitting}
            aria-invalid={errors.password ? true : undefined}
            aria-describedby={
              errors.password ? "signin-password-error" : undefined
            }
            className={cn(
              "h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pr-11 pl-3.5 text-sm text-[#0F172A] placeholder:text-slate-400 transition-colors hover:border-slate-300 focus:bg-white focus-visible:border-[#059669] focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#059669]/25 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/15 dark:bg-[#041D15] dark:text-white dark:placeholder:text-emerald-200/45 dark:hover:border-emerald-400/35 dark:focus:bg-[#031710] dark:focus-visible:border-emerald-400",
              errors.password &&
                "border-red-500 bg-red-50/30 focus-visible:border-red-500 focus-visible:outline-red-500/20 dark:border-red-400 dark:bg-red-950/20",
            )}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="btn-leaf-sm absolute top-1/2 right-2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center text-slate-500 transition-colors hover:bg-slate-200/80 hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#059669] dark:text-emerald-200/70 dark:hover:bg-white/10 dark:hover:text-white"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
        {errors.password ? (
          <p
            id="signin-password-error"
            role="alert"
            className="text-xs font-medium text-red-600 dark:text-red-300"
          >
            {errors.password.message}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-leaf inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 bg-[#059669] px-6 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#047857] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#059669] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-65 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:text-[15px] dark:hover:bg-[#10B981]"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            <span>Signing In...</span>
          </>
        ) : (
          <>
            <span>Sign In</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
}

const VALID_SIGN_UP_FIELDS = new Set<keyof SignUpFormValues>([
  "name",
  "email",
  "password",
  "confirmPassword",
]);

function SignUpEmailForm({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const { setSessionUser } = useAuth();
  const submittingRef = useRef(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formFeedback, setFormFeedback] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: SignUpFormValues) {
    setFormFeedback(null);

    try {
      const response = await apiClient.post<
        ApiSuccessResponse<{ user: AuthUser }>
      >("/auth/sign-up", values);

      const createdUser = response.data?.data?.user;
      if (!response.data?.success || !createdUser) {
        throw new Error("Unable to create account right now.");
      }

      setSessionUser(createdUser);
      setFormFeedback({
        type: "success",
        message: `Account created! Welcome to HopeNest, ${createdUser.name}.`,
      });
      router.push(nextPath);
      router.refresh();
    } catch (error) {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        const details = error.response?.data?.error?.details;
        if (details) {
          for (const [field, messages] of Object.entries(details)) {
            if (
              VALID_SIGN_UP_FIELDS.has(field as keyof SignUpFormValues) &&
              Array.isArray(messages) &&
              messages[0]
            ) {
              setError(field as keyof SignUpFormValues, {
                type: "server",
                message: messages[0],
              });
            }
          }
        }
      }

      setFormFeedback({
        type: "error",
        message: extractApiErrorMessage(
          error,
          "Unable to create your account right now. Please try again.",
        ),
      });
    }
  }

  function handleProtectedSubmit(event: FormEvent<HTMLFormElement>) {
    if (submittingRef.current) {
      event.preventDefault();
      return;
    }
    submittingRef.current = true;
    void handleSubmit(
      async (values) => {
        try {
          await onSubmit(values);
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
    <form
      onSubmit={handleProtectedSubmit}
      noValidate
      aria-busy={isSubmitting}
      className="space-y-4"
    >
      {formFeedback ? (
        <div
          role={formFeedback.type === "error" ? "alert" : "status"}
          aria-live="polite"
          className={cn(
            "flex items-start gap-2.5 rounded-xl border p-3.5 text-sm leading-relaxed",
            formFeedback.type === "success"
              ? "border-emerald-200 bg-emerald-50/90 text-[#065F46] dark:border-emerald-400/30 dark:bg-emerald-500/15 dark:text-emerald-100"
              : "border-red-200 bg-red-50/90 text-red-800 dark:border-red-400/35 dark:bg-red-500/15 dark:text-red-200",
          )}
        >
          {formFeedback.type === "success" ? (
            <CheckCircle2
              className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#059669] dark:text-emerald-400"
              aria-hidden="true"
            />
          ) : (
            <AlertCircle
              className="mt-0.5 h-4.5 w-4.5 shrink-0 text-red-600 dark:text-red-400"
              aria-hidden="true"
            />
          )}
          <span className="font-medium">{formFeedback.message}</span>
        </div>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="signup-name"
          className="text-sm font-semibold text-[#0F172A] dark:text-emerald-50"
        >
          Full name
        </label>
        <input
          id="signup-name"
          type="text"
          autoComplete="name"
          placeholder="Enter your full name"
          disabled={isSubmitting}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "signup-name-error" : undefined}
          className={cn(
            "h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 text-sm text-[#0F172A] placeholder:text-slate-400 transition-colors hover:border-slate-300 focus:bg-white focus-visible:border-[#059669] focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#059669]/25 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/15 dark:bg-[#041D15] dark:text-white dark:placeholder:text-emerald-200/45 dark:hover:border-emerald-400/35 dark:focus:bg-[#031710] dark:focus-visible:border-emerald-400",
            errors.name &&
              "border-red-500 bg-red-50/30 focus-visible:border-red-500 focus-visible:outline-red-500/20 dark:border-red-400 dark:bg-red-950/20",
          )}
          {...register("name")}
        />
        {errors.name ? (
          <p
            id="signup-name-error"
            role="alert"
            className="text-xs font-medium text-red-600 dark:text-red-300"
          >
            {errors.name.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="signup-email"
          className="text-sm font-semibold text-[#0F172A] dark:text-emerald-50"
        >
          Email address
        </label>
        <input
          id="signup-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          disabled={isSubmitting}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "signup-email-error" : undefined}
          className={cn(
            "h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 text-sm text-[#0F172A] placeholder:text-slate-400 transition-colors hover:border-slate-300 focus:bg-white focus-visible:border-[#059669] focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#059669]/25 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/15 dark:bg-[#041D15] dark:text-white dark:placeholder:text-emerald-200/45 dark:hover:border-emerald-400/35 dark:focus:bg-[#031710] dark:focus-visible:border-emerald-400",
            errors.email &&
              "border-red-500 bg-red-50/30 focus-visible:border-red-500 focus-visible:outline-red-500/20 dark:border-red-400 dark:bg-red-950/20",
          )}
          {...register("email")}
        />
        {errors.email ? (
          <p
            id="signup-email-error"
            role="alert"
            className="text-xs font-medium text-red-600 dark:text-red-300"
          >
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="signup-password"
            className="text-sm font-semibold text-[#0F172A] dark:text-emerald-50"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="8+ chars & number"
              disabled={isSubmitting}
              aria-invalid={errors.password ? true : undefined}
              aria-describedby={
                errors.password ? "signup-password-error" : undefined
              }
              className={cn(
                "h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pr-10 pl-3.5 text-sm text-[#0F172A] placeholder:text-slate-400 transition-colors hover:border-slate-300 focus:bg-white focus-visible:border-[#059669] focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#059669]/25 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/15 dark:bg-[#041D15] dark:text-white dark:placeholder:text-emerald-200/45 dark:hover:border-emerald-400/35 dark:focus:bg-[#031710] dark:focus-visible:border-emerald-400",
                errors.password &&
                  "border-red-500 bg-red-50/30 focus-visible:border-red-500 focus-visible:outline-red-500/20 dark:border-red-400 dark:bg-red-950/20",
              )}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="btn-leaf-sm absolute top-1/2 right-1.5 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center text-slate-500 transition-colors hover:bg-slate-200/80 hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#059669] dark:text-emerald-200/70 dark:hover:bg-white/10 dark:hover:text-white"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
          {errors.password ? (
            <p
              id="signup-password-error"
              role="alert"
              className="text-xs font-medium text-red-600 dark:text-red-300"
            >
              {errors.password.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="signup-confirm-password"
            className="text-sm font-semibold text-[#0F172A] dark:text-emerald-50"
          >
            Confirm password
          </label>
          <div className="relative">
            <input
              id="signup-confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Re-enter password"
              disabled={isSubmitting}
              aria-invalid={errors.confirmPassword ? true : undefined}
              aria-describedby={
                errors.confirmPassword ? "signup-confirm-error" : undefined
              }
              className={cn(
                "h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pr-10 pl-3.5 text-sm text-[#0F172A] placeholder:text-slate-400 transition-colors hover:border-slate-300 focus:bg-white focus-visible:border-[#059669] focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#059669]/25 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/15 dark:bg-[#041D15] dark:text-white dark:placeholder:text-emerald-200/45 dark:hover:border-emerald-400/35 dark:focus:bg-[#031710] dark:focus-visible:border-emerald-400",
                errors.confirmPassword &&
                  "border-red-500 bg-red-50/30 focus-visible:border-red-500 focus-visible:outline-red-500/20 dark:border-red-400 dark:bg-red-950/20",
              )}
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={
                showConfirmPassword ? "Hide confirm password" : "Show confirm password"
              }
              aria-pressed={showConfirmPassword}
              className="btn-leaf-sm absolute top-1/2 right-1.5 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center text-slate-500 transition-colors hover:bg-slate-200/80 hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#059669] dark:text-emerald-200/70 dark:hover:bg-white/10 dark:hover:text-white"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
          {errors.confirmPassword ? (
            <p
              id="signup-confirm-error"
              role="alert"
              className="text-xs font-medium text-red-600 dark:text-red-300"
            >
              {errors.confirmPassword.message}
            </p>
          ) : null}
        </div>
      </div>

      <p className="text-xs leading-relaxed text-slate-500 dark:text-emerald-100/70">
        By creating an account, you agree to our{" "}
        <Link
          href="/terms-of-service"
          className="font-semibold text-[#059669] underline-offset-2 hover:underline dark:text-emerald-400"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy-policy"
          className="font-semibold text-[#059669] underline-offset-2 hover:underline dark:text-emerald-400"
        >
          Privacy Policy
        </Link>
        .
      </p>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-leaf inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 bg-[#059669] px-6 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#047857] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#059669] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-65 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:text-[15px] dark:hover:bg-[#10B981]"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            <span>Creating Account...</span>
          </>
        ) : (
          <>
            <span>Create Account</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
}

export function AuthFormCard({ mode }: AuthFormCardProps) {
  const searchParams = useSearchParams();
  const { user, isLoading, isSigningOut, googleConfigured, signOut } =
    useAuth();

  const nextPath = sanitizeClientNextPath(searchParams.get("next"));
  const oauthErrorMessage = getOAuthErrorMessage(searchParams.get("error"));
  const isSignUp = mode === "sign-up";

  const googleStartHref = `/api/auth/google?intent=${mode}&next=${encodeURIComponent(nextPath)}`;

  return (
    <section
      aria-labelledby="auth-page-heading"
      className="relative flex flex-1 flex-col items-center justify-center overflow-x-clip bg-gradient-to-b from-[#F8FAFC] via-white to-[#F8FAFC] py-10 sm:py-14 lg:py-16 dark:from-[#03120D] dark:via-[#041711] dark:to-[#03120D]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.10),transparent_58%),radial-gradient(ellipse_at_bottom,rgba(21,79,150,0.07),transparent_58%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.18),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(37,99,235,0.12),transparent_60%)]"
      />

      <div className="relative mx-auto w-full max-w-[490px] px-4 sm:px-6">
        <div className="mb-5">
          <Link
            href="/"
            className="btn-leaf-sm inline-flex items-center gap-2 border border-slate-200/90 bg-white px-3.5 py-2 text-sm font-semibold text-[#0F172A] shadow-2xs transition-colors hover:border-[#059669]/45 hover:text-[#059669] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#059669] dark:border-white/15 dark:bg-[#062C20] dark:text-emerald-100 dark:hover:border-emerald-400/45 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Back to HopeNest</span>
          </Link>
        </div>

        {/* Centered Auth Card */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_22px_54px_-18px_rgba(15,23,42,0.13)] sm:p-8 dark:border-white/10 dark:bg-[#062C20] dark:shadow-[0_22px_54px_-18px_rgba(0,0,0,0.55)]">
          {user && !isLoading ? (
            <div className="space-y-5">
              <div className="flex items-center gap-4 rounded-xl border border-emerald-200/85 bg-emerald-50/75 p-4 dark:border-emerald-400/25 dark:bg-emerald-500/10">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#059669] text-base font-bold text-white">
                  {getUserInitials(user.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1
                      id="auth-page-heading"
                      className="truncate text-lg font-bold text-[#0F172A] dark:text-white"
                    >
                      {user.name}
                    </h1>
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/80 bg-white px-2.5 py-0.5 text-[11px] font-semibold text-[#047857] uppercase dark:border-emerald-400/30 dark:bg-[#041D15] dark:text-emerald-300">
                      <UserCheck className="h-3 w-3" aria-hidden="true" />
                      <span>
                        {user.provider === "google" ? "Google" : "Email"}
                      </span>
                    </span>
                  </div>
                  <p className="truncate text-sm text-slate-600 dark:text-emerald-100/75">
                    {user.email}
                  </p>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-slate-600 dark:text-emerald-100/80">
                You are currently signed in to HopeNest. Explore community
                drives or sign out to switch accounts.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/events"
                  className="btn-leaf inline-flex h-11 flex-1 items-center justify-center gap-2 bg-[#059669] px-5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#047857] dark:hover:bg-[#10B981]"
                >
                  <Calendar className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Explore Events</span>
                </Link>
                <button
                  type="button"
                  onClick={() => void signOut()}
                  disabled={isSigningOut}
                  className="btn-leaf inline-flex h-11 cursor-pointer items-center justify-center gap-2 border border-slate-200 bg-white px-5 text-sm font-semibold text-[#0F172A] transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:opacity-60 dark:border-white/15 dark:bg-[#041D15] dark:text-emerald-100 dark:hover:border-red-400/40 dark:hover:bg-red-950/30 dark:hover:text-red-200"
                >
                  {isSigningOut ? (
                    <Loader2
                      className="h-4 w-4 animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
                  )}
                  <span>{isSigningOut ? "Signing Out..." : "Sign Out"}</span>
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-6 text-center">
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50/85 px-3 py-1 text-[11px] font-bold tracking-[0.12em] text-[#059669] uppercase dark:border-emerald-400/25 dark:bg-emerald-500/15 dark:text-emerald-300">
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{isSignUp ? "Join HopeNest" : "Member Portal"}</span>
                </div>
                <h1
                  id="auth-page-heading"
                  className="text-2xl font-extrabold tracking-tight text-[#0F172A] sm:text-[1.75rem] dark:text-white"
                >
                  {isSignUp
                    ? "Create your account"
                    : "Sign in to HopeNest"}
                </h1>
                <p className="mt-1.5 text-sm text-slate-600 dark:text-emerald-100/75">
                  {isSignUp
                    ? "Choose Google or fill out your details below."
                    : "Continue with Google or enter your credentials."}
                </p>
              </div>

              {oauthErrorMessage ? (
                <div
                  role="alert"
                  className="mb-5 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/90 p-3.5 text-xs leading-relaxed font-medium text-amber-900 sm:text-sm dark:border-amber-400/35 dark:bg-amber-500/15 dark:text-amber-100"
                >
                  <AlertCircle
                    className="mt-0.5 h-4.5 w-4.5 shrink-0 text-amber-600 dark:text-amber-300"
                    aria-hidden="true"
                  />
                  <span>{oauthErrorMessage}</span>
                </div>
              ) : null}

              {/* Google OAuth Button */}
              <a
                href={googleStartHref}
                className="btn-leaf inline-flex h-12 w-full items-center justify-center gap-2.5 border border-slate-200 bg-white px-5 text-sm font-semibold text-[#0F172A] shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#154F96] motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:border-white/15 dark:bg-[#041D15] dark:text-white dark:hover:border-emerald-400/45 dark:hover:bg-[#083526]"
              >
                <GoogleLogoIcon />
                <span>
                  {isSignUp ? "Sign up with Google" : "Continue with Google"}
                </span>
              </a>

              {!googleConfigured && !oauthErrorMessage ? (
                <p className="mt-2 text-center text-[11px] leading-relaxed text-slate-500 dark:text-emerald-200/60">
                  Requires{" "}
                  <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[10px] text-slate-700 dark:bg-white/10 dark:text-emerald-200">
                    GOOGLE_CLIENT_ID
                  </code>{" "}
                  &amp;{" "}
                  <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[10px] text-slate-700 dark:bg-white/10 dark:text-emerald-200">
                    GOOGLE_CLIENT_SECRET
                  </code>{" "}
                  in{" "}
                  <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[10px] text-slate-700 dark:bg-white/10 dark:text-emerald-200">
                    .env.local
                  </code>
                  . Email auth works below.
                </p>
              ) : null}

              {/* Divider */}
              <div className="my-5 flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-px flex-1 bg-slate-200/90 dark:bg-white/10"
                />
                <span className="text-xs font-semibold tracking-wide text-slate-400 uppercase dark:text-emerald-200/55">
                  Or with email
                </span>
                <span
                  aria-hidden="true"
                  className="h-px flex-1 bg-slate-200/90 dark:bg-white/10"
                />
              </div>

              {isSignUp ? (
                <SignUpEmailForm nextPath={nextPath} />
              ) : (
                <SignInEmailForm nextPath={nextPath} />
              )}

              <p className="mt-6 border-t border-slate-100 pt-5 text-center text-sm text-slate-600 dark:border-white/10 dark:text-emerald-100/75">
                {isSignUp ? (
                  <>
                    Already have a HopeNest account?{" "}
                    <Link
                      href={
                        nextPath !== "/"
                          ? `/sign-in?next=${encodeURIComponent(nextPath)}`
                          : "/sign-in"
                      }
                      className="font-semibold text-[#059669] transition-colors hover:text-[#047857] dark:text-emerald-400 dark:hover:text-emerald-300"
                    >
                      Sign in
                    </Link>
                  </>
                ) : (
                  <>
                    New to HopeNest?{" "}
                    <Link
                      href={
                        nextPath !== "/"
                          ? `/sign-up?next=${encodeURIComponent(nextPath)}`
                          : "/sign-up"
                      }
                      className="font-semibold text-[#059669] transition-colors hover:text-[#047857] dark:text-emerald-400 dark:hover:text-emerald-300"
                    >
                      Create an account
                    </Link>
                  </>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

