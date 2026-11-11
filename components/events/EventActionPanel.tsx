"use client";

import { useState, useSyncExternalStore } from "react";
import { CheckCircle2, Share2, UserCheck } from "lucide-react";
import { cn } from "@/utils/cn";

export interface EventActionPanelProps {
  eventId?: string;
  eventTitle: string;
}

const RSVP_CHANGE_EVENT = "hopenest-rsvp-change";

function subscribeToRsvpStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(RSVP_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(RSVP_CHANGE_EVENT, callback);
  };
}

function readStoredRsvp(storageKey: string | null): boolean {
  if (!storageKey) return false;
  try {
    return window.localStorage.getItem(storageKey) === "1";
  } catch {
    return false;
  }
}

export function EventActionPanel({
  eventId,
  eventTitle,
}: EventActionPanelProps) {
  const storageKey = eventId ? `hopenest_rsvp_${eventId}` : null;
  const storedJoined = useSyncExternalStore(
    subscribeToRsvpStorage,
    () => readStoredRsvp(storageKey),
    () => false,
  );
  const [fallbackJoined, setFallbackJoined] = useState(false);
  const [copied, setCopied] = useState(false);

  const joined = storageKey ? storedJoined : fallbackJoined;

  function handleToggleJoin() {
    if (!storageKey) {
      setFallbackJoined((prev) => !prev);
      return;
    }

    const next = !storedJoined;
    try {
      if (next) {
        window.localStorage.setItem(storageKey, "1");
      } else {
        window.localStorage.removeItem(storageKey);
      }
      window.dispatchEvent(new Event(RSVP_CHANGE_EVENT));
    } catch {
      setFallbackJoined(next);
    }
  }

  async function handleCopyShareLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-3 pt-2">
      <button
        type="button"
        aria-pressed={joined}
        onClick={handleToggleJoin}
        className={cn(
          "btn-leaf inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 px-5 text-sm font-semibold shadow-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#059669]",
          joined
            ? "border border-[#059669] bg-emerald-50 text-[#047857] hover:bg-emerald-100 dark:border-emerald-400/50 dark:bg-emerald-500/20 dark:text-emerald-200 dark:hover:bg-emerald-500/30"
            : "bg-[#059669] text-white hover:bg-[#047857] dark:hover:bg-[#10B981]",
        )}
      >
        <UserCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>{joined ? "Spot Reserved — Cancel RSVP" : "Join This Event"}</span>
      </button>

      <button
        type="button"
        onClick={handleCopyShareLink}
        className="btn-leaf inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#059669] dark:border-white/15 dark:bg-[#083526] dark:text-emerald-100 dark:hover:bg-[#0B4532]"
      >
        <Share2
          className="h-4 w-4 shrink-0 text-[#059669] dark:text-emerald-400"
          aria-hidden="true"
        />
        <span>{copied ? "Event Link Copied" : "Share Event Link"}</span>
      </button>

      {joined ? (
        <p
          role="status"
          className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 text-xs leading-relaxed font-medium text-[#047857] dark:border-emerald-400/25 dark:bg-emerald-500/15 dark:text-emerald-200"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            Spot reserved for {eventTitle}. Show your organizer confirmation at
            the event check-in desk when you arrive.
          </span>
        </p>
      ) : null}
    </div>
  );
}
