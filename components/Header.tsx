"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Loader2,
  LogOut,
  Menu,
  Moon,
  Plus,
  Sun,
  UserCheck,
  X,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useMounted } from "@/hooks/useMounted";
import { cn } from "@/utils/cn";

interface HeaderNavItem {
  label: string;
  href: string;
}

const navItems: HeaderNavItem[] = [
  { label: "Home", href: "/" },
  { label: "Upcoming Events", href: "/events" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function isRouteActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  if (href === "/events") {
    return (
      pathname === "/events" ||
      (pathname.startsWith("/events/") && pathname !== "/events/create")
    );
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function getUserInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "HN";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function Header() {
  const pathname = usePathname();
  const mounted = useMounted();
  const { resolvedTheme, toggleTheme } = useTheme();
  const { user, isSigningOut, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);

  const isDark = mounted && resolvedTheme === "dark";

  useEffect(() => {
    let frameId = 0;

    const syncScroll = () => {
      const y = window.scrollY;
      setIsScrolled((prev) => {
        if (!prev && y > 36) return true;
        if (prev && y < 16) return false;
        return prev;
      });
    };

    const handleScroll = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(syncScroll);
    };

    frameId = window.requestAnimationFrame(syncScroll);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen && !accountMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        setAccountMenuOpen(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        accountMenuRef.current &&
        event.target instanceof Node &&
        !accountMenuRef.current.contains(event.target)
      ) {
        setAccountMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen, accountMenuOpen]);

  async function handleSignOut() {
    setAccountMenuOpen(false);
    setMobileMenuOpen(false);
    await signOut();
  }

  const displayName = user ? user.name.split(" ")[0] || user.name : "";

  return (
    <header className="pointer-events-none sticky top-0 z-50 h-16 w-full text-white sm:h-[72px]">
      <div
        className={cn(
          "mx-auto w-full transition-[padding,transform] duration-300 ease-out motion-reduce:transition-none",
          isScrolled
            ? "translate-y-2.5 px-3 sm:translate-y-3 sm:px-6 lg:px-8 xl:px-20 2xl:px-40"
            : "translate-y-0 px-0",
        )}
      >
        <div
          data-header-surface=""
          data-scrolled={isScrolled ? "true" : "false"}
          className={cn(
            "pointer-events-auto mx-auto w-full border transition-[max-width,border-radius,background-color,border-color,box-shadow] duration-300 ease-out motion-reduce:transition-none",
            isScrolled
              ? cn(
                  "max-w-[72rem] border-emerald-400/30 bg-[#003D2B]/96 shadow-[0_20px_46px_-12px_rgba(0,22,16,0.62)] ring-1 ring-white/15 backdrop-blur-xl",
                  mobileMenuOpen ? "rounded-2xl" : "rounded-[32px]",
                )
              : "max-w-[160rem] rounded-none border-x-transparent border-t-transparent border-b-white/10 bg-[#003D2B] shadow-xs",
          )}
        >
          <div
            className={cn(
              "mx-auto flex w-full max-w-7xl items-center justify-between gap-3 transition-[height,padding] duration-300 ease-out motion-reduce:transition-none",
              isScrolled
                ? "h-14 px-5 sm:h-[60px] sm:px-6 lg:px-7"
                : "h-16 px-4 sm:h-[72px] sm:px-6 lg:px-8",
            )}
          >
            {/* Left: HopeNest Logo */}
            <Link
              href="/"
              onClick={() => {
                setMobileMenuOpen(false);
                setAccountMenuOpen(false);
              }}
              className="flex shrink-0 items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10B981]"
              aria-label="HopeNest Home"
            >
              <Image
                src="/images/logo.webp"
                alt="HopeNest - Social Development Events Platform"
                width={640}
                height={147}
                loading="eager"
                style={{ width: "auto" }}
                className={cn(
                  "transition-[height] duration-300 ease-out motion-reduce:transition-none",
                  isScrolled ? "h-8 sm:h-9" : "h-9 sm:h-10",
                )}
              />
            </Link>

            {/* Center: Primary Navigation Links (Desktop) */}
            <nav
              aria-label="Primary navigation"
              className="hidden items-center gap-6 lg:flex xl:gap-8"
            >
              {navItems.map((item) => {
                const active = isRouteActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative py-1.5 text-sm font-medium whitespace-nowrap transition-colors duration-200 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-center after:rounded-full after:transition-transform after:duration-200 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#10B981]",
                      active
                        ? "text-white after:scale-x-100 after:bg-[#10B981]"
                        : "text-emerald-100/85 after:scale-x-0 after:bg-emerald-300/70 hover:text-white hover:after:scale-x-100",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Actions (Desktop) */}
            <div className="hidden shrink-0 items-center gap-2 xl:gap-3 lg:flex">
              <Link
                href="/events/create"
                className="btn-leaf-sm inline-flex h-9 items-center justify-center gap-1.5 bg-[#059669] px-3.5 text-sm font-medium whitespace-nowrap text-white shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#10B981] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10B981]"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                <span>Create Event</span>
              </Link>

              <span
                aria-hidden="true"
                className="mx-0.5 h-6 w-px bg-white/15"
              />

              <button
                type="button"
                onClick={toggleTheme}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                aria-pressed={isDark}
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
                className="btn-leaf-sm inline-flex h-9 w-9 cursor-pointer items-center justify-center border border-[#10B981]/45 bg-[#004C36] text-emerald-100 transition-colors hover:border-[#10B981] hover:bg-[#005B41] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10B981]"
              >
                {isDark ? (
                  <Sun className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Moon className="h-4 w-4" aria-hidden="true" />
                )}
              </button>

              {user ? (
                <div ref={accountMenuRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setAccountMenuOpen((prev) => !prev)}
                    aria-expanded={accountMenuOpen}
                    aria-haspopup="menu"
                    aria-label="Account menu"
                    className="btn-leaf-sm inline-flex h-9 cursor-pointer items-center gap-2 border border-emerald-400/40 bg-[#004A35] px-3 text-sm font-medium text-white transition-colors hover:border-emerald-300/65 hover:bg-[#005A40] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10B981]"
                  >
                    <span className="inline-flex h-5.5 w-5.5 items-center justify-center rounded-sm bg-[#10B981] text-[11px] font-bold text-[#00291F]">
                      {getUserInitials(user.name)}
                    </span>
                    <span className="max-w-[120px] truncate">{displayName}</span>
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 text-emerald-200 transition-transform duration-150",
                        accountMenuOpen && "rotate-180",
                      )}
                      aria-hidden="true"
                    />
                  </button>

                  {accountMenuOpen ? (
                    <div
                      role="menu"
                      aria-label="Signed in user options"
                      className="absolute right-0 mt-2.5 w-64 rounded-2xl border border-emerald-300/20 bg-[#003425]/95 p-3 shadow-[0_18px_40px_-10px_rgba(0,0,0,0.5)] backdrop-blur-xl"
                    >
                      <div className="border-b border-white/10 pb-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-semibold text-white">
                            {user.name}
                          </p>
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-200 uppercase">
                            <UserCheck className="h-3 w-3" aria-hidden="true" />
                            <span>
                              {user.provider === "google" ? "Google" : "Email"}
                            </span>
                          </span>
                        </div>
                        <p className="mt-0.5 truncate text-xs text-emerald-100/75">
                          {user.email}
                        </p>
                      </div>

                      <div className="mt-2.5 space-y-1.5">
                        <Link
                          href="/sign-in"
                          role="menuitem"
                          onClick={() => setAccountMenuOpen(false)}
                          className="btn-leaf-sm flex w-full items-center justify-between px-3 py-2 text-xs font-medium text-emerald-100 transition-colors hover:bg-[#004A35] hover:text-white"
                        >
                          <span>Account Overview</span>
                        </Link>
                        <button
                          type="button"
                          role="menuitem"
                          disabled={isSigningOut}
                          onClick={() => void handleSignOut()}
                          className="btn-leaf-sm flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-red-200 transition-colors hover:bg-red-500/20 hover:text-white disabled:opacity-60"
                        >
                          {isSigningOut ? (
                            <Loader2
                              className="h-3.5 w-3.5 animate-spin"
                              aria-hidden="true"
                            />
                          ) : (
                            <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                          )}
                          <span>
                            {isSigningOut ? "Signing Out..." : "Sign Out"}
                          </span>
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="btn-leaf-sm inline-flex h-9 items-center justify-center border border-transparent px-3 text-sm font-medium whitespace-nowrap text-emerald-100/95 transition-colors hover:border-white/20 hover:bg-[#004A35]/70 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10B981]"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/sign-up"
                    className="btn-leaf-sm inline-flex h-9 items-center justify-center border border-emerald-400/35 bg-[#004A35] px-4 text-sm font-medium whitespace-nowrap text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300/60 hover:bg-[#005A40] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10B981]"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Tablet & Mobile Right Controls */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={
                  isDark ? "Switch to light mode" : "Switch to dark mode"
                }
                aria-pressed={isDark}
                className="btn-leaf-sm inline-flex h-9 w-9 cursor-pointer items-center justify-center border border-[#10B981]/45 bg-[#004C36] text-emerald-100 transition-colors hover:border-[#10B981] hover:bg-[#005B41] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10B981]"
              >
                {isDark ? (
                  <Sun className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Moon className="h-4 w-4" aria-hidden="true" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation"
                aria-label={
                  mobileMenuOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
                }
                className="btn-leaf-sm inline-flex h-9 w-9 cursor-pointer items-center justify-center border border-white/15 bg-[#004A35] text-white transition-colors hover:bg-[#005A40] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10B981]"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Menu className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile / Tablet Expandable Drawer */}
          <AnimatePresence initial={false}>
            {mobileMenuOpen ? (
              <motion.div
                id="mobile-navigation"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className={cn(
                  "overflow-hidden border-t border-white/10 bg-[#003425]/95 backdrop-blur-xl lg:hidden",
                  isScrolled && "rounded-b-2xl",
                )}
              >
                <div className="mx-auto w-full max-w-7xl space-y-4 px-4 py-5 sm:px-6">
                  <nav
                    aria-label="Mobile navigation"
                    className="flex flex-col gap-1"
                  >
                    {navItems.map((item) => {
                      const active = isRouteActive(pathname, item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                            active
                              ? "border-l-2 border-[#10B981] bg-[#004A35] text-white"
                              : "text-emerald-100/85 hover:bg-[#004330] hover:text-white",
                          )}
                        >
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </nav>

                  <div className="space-y-2.5 border-t border-white/10 pt-4">
                    <Link
                      href="/events/create"
                      onClick={() => setMobileMenuOpen(false)}
                      className="btn-leaf-sm inline-flex h-10 w-full items-center justify-center gap-1.5 bg-[#059669] px-4 text-sm font-medium text-white shadow-xs transition-colors hover:bg-[#10B981]"
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                      <span>Create Event</span>
                    </Link>

                    {user ? (
                      <div className="space-y-2.5 rounded-xl border border-white/10 bg-[#002B1F] p-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-white">
                              {user.name}
                            </p>
                            <p className="truncate text-xs text-emerald-100/75">
                              {user.email}
                            </p>
                          </div>
                          <span className="shrink-0 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-200 uppercase">
                            {user.provider === "google" ? "Google" : "Email"}
                          </span>
                        </div>

                        <button
                          type="button"
                          disabled={isSigningOut}
                          onClick={() => void handleSignOut()}
                          className="btn-leaf-sm inline-flex h-9 w-full cursor-pointer items-center justify-center gap-2 border border-red-400/30 bg-red-500/15 px-4 text-xs font-semibold text-red-100 transition-colors hover:bg-red-500/25 disabled:opacity-60"
                        >
                          {isSigningOut ? (
                            <Loader2
                              className="h-3.5 w-3.5 animate-spin"
                              aria-hidden="true"
                            />
                          ) : (
                            <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                          )}
                          <span>
                            {isSigningOut ? "Signing Out..." : "Sign Out"}
                          </span>
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2.5">
                        <Link
                          href="/sign-in"
                          onClick={() => setMobileMenuOpen(false)}
                          className="btn-leaf-sm inline-flex h-10 items-center justify-center border border-white/15 bg-transparent px-4 text-sm font-medium text-emerald-100 transition-colors hover:bg-[#004A35] hover:text-white"
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/sign-up"
                          onClick={() => setMobileMenuOpen(false)}
                          className="btn-leaf-sm inline-flex h-10 items-center justify-center border border-emerald-400/35 bg-[#004A35] px-4 text-sm font-medium text-white transition-colors hover:border-emerald-300/60 hover:bg-[#005A40]"
                        >
                          Sign Up
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
