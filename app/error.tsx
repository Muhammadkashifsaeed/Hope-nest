"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Application error boundary caught:", error);
  }, [error]);

  return (
    <section className="flex flex-1 items-center justify-center bg-[#F8FAFC] px-4 py-20 sm:px-6 dark:bg-[#041711]">
      <div className="flex w-full max-w-md flex-col items-center rounded-2xl border border-slate-200/90 bg-white p-8 text-center shadow-[0_14px_38px_-14px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-[#062C20]">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 ring-1 ring-red-200/80 dark:bg-red-500/15 dark:text-red-300 dark:ring-red-400/25">
          <AlertTriangle className="h-7 w-7" aria-hidden="true" />
        </div>

        <h1 className="mt-5 text-2xl font-bold tracking-tight text-[#0F172A] dark:text-white">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-emerald-100/75">
          An unexpected error occurred while rendering this page. You can retry
          below or return to HopeNest Home.
        </p>

        <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={reset}
            className="btn-leaf inline-flex h-11 cursor-pointer items-center justify-center gap-2 bg-[#059669] px-5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#047857] dark:hover:bg-[#10B981]"
          >
            <RotateCcw className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="btn-leaf inline-flex h-11 items-center justify-center gap-2 border border-slate-200 bg-white px-5 text-sm font-semibold text-[#0F172A] transition-colors hover:border-[#059669]/40 hover:text-[#059669] dark:border-white/15 dark:bg-[#041D15] dark:text-emerald-100"
          >
            <Home className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
