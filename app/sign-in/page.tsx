import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthFormCard } from "@/components/auth/AuthFormCard";
import { buildPageMetadata } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Sign In",
  description:
    "Sign in to HopeNest with Google or email and password to manage your community sessions.",
  path: "/sign-in",
  noIndex: true,
});

function AuthFallbackCard() {
  return (
    <section className="flex flex-1 items-center bg-[#F8FAFC] py-14 dark:bg-[#03120D]">
      <div className="mx-auto w-full max-w-[490px] px-4 sm:px-6">
        <div className="h-[460px] animate-pulse rounded-2xl border border-slate-200/80 bg-white dark:border-white/10 dark:bg-[#062C20]" />
      </div>
    </section>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<AuthFallbackCard />}>
      <AuthFormCard mode="sign-in" />
    </Suspense>
  );
}

