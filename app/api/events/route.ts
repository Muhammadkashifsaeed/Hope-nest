import { randomUUID } from "node:crypto";
import { appendFile, mkdir } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createEventSchema } from "@/lib/validations";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  CreateEventResult,
} from "@/types";

export const runtime = "nodejs";

interface StoredEventSubmission {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  time: string;
  dateTime: string;
  duration: string;
  location: string;
  addressDetails: string;
  organizer: string;
  organizerEmail: string;
  spotsAvailable: number;
  description: string;
  fullDescription: string;
  submittedAt: string;
}

function slugifyTitle(title: string, id: string): string {
  const base = title
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/(^-|-$)/g, "")
    .slice(0, 48);
  return `${base || "community-event"}-${id.slice(0, 6)}`;
}

function formatReadableDateTime(dateStr: string, timeStr: string): string {
  try {
    const parsed = new Date(`${dateStr}T${timeStr}:00`);
    if (Number.isNaN(parsed.getTime())) {
      return `${dateStr} · ${timeStr}`;
    }
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(parsed);
    const formattedTime = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }).format(parsed);
    return `${formattedDate} · ${formattedTime}`;
  } catch {
    return `${dateStr} · ${timeStr}`;
  }
}

async function persistEventSubmission(
  record: StoredEventSubmission,
): Promise<boolean> {
  const line = `${JSON.stringify(record)}\n`;
  const primaryPath = path.join(
    process.cwd(),
    ".next",
    "data",
    "event-submissions.ndjson",
  );
  const fallbackPath = path.join(
    os.tmpdir(),
    "hopenest-event-submissions.ndjson",
  );

  for (const targetPath of [primaryPath, fallbackPath]) {
    try {
      await mkdir(path.dirname(targetPath), { recursive: true });
      await appendFile(targetPath, line, "utf8");
      return true;
    } catch {
      continue;
    }
  }

  return false;
}

async function forwardToWebhook(record: StoredEventSubmission): Promise<void> {
  const webhookUrl = process.env.EVENT_SUBMISSIONS_WEBHOOK_URL?.trim();
  if (!webhookUrl) return;

  const secretKey = process.env.API_SECRET_KEY?.trim();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (secretKey) {
    headers["x-api-key"] = secretKey;
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(record),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`Webhook returned status ${response.status}`);
  }
}

async function sendViaResend(record: StoredEventSubmission): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const recipient = (
    process.env.EVENT_SUBMISSIONS_TO_EMAIL || process.env.CONTACT_TO_EMAIL
  )?.trim();
  if (!apiKey || !recipient) return;

  const fromAddress =
    process.env.CONTACT_FROM_EMAIL?.trim() || "HopeNest <onboarding@resend.dev>";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromAddress,
      to: [recipient],
      reply_to: record.organizerEmail,
      subject: `[HopeNest Event Proposal] ${record.title} (${record.category})`,
      text: [
        `Submission ID: ${record.id}`,
        `Title: ${record.title}`,
        `Category: ${record.category}`,
        `When: ${record.dateTime} (${record.duration})`,
        `Location: ${record.location} — ${record.addressDetails}`,
        `Organizer: ${record.organizer} <${record.organizerEmail}>`,
        `Volunteer Capacity: ${record.spotsAvailable}`,
        "",
        `Summary: ${record.description}`,
        record.fullDescription ? `\nOverview:\n${record.fullDescription}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`Email service returned status ${response.status}`);
  }
}

export async function POST(request: NextRequest) {
  let rawBody: unknown;

  try {
    rawBody = await request.json();
  } catch {
    const errorPayload: ApiErrorResponse = {
      success: false,
      error: {
        code: "INVALID_JSON",
        message: "Invalid request body. Please submit valid JSON data.",
      },
    };
    return NextResponse.json(errorPayload, { status: 400 });
  }

  if (typeof rawBody !== "object" || rawBody === null || Array.isArray(rawBody)) {
    const errorPayload: ApiErrorResponse = {
      success: false,
      error: {
        code: "INVALID_PAYLOAD",
        message: "Event submission must be a JSON object.",
      },
    };
    return NextResponse.json(errorPayload, { status: 400 });
  }

  const parsed = createEventSchema.safeParse(rawBody);
  if (!parsed.success) {
    const flattened = z.flattenError(parsed.error);
    const details: Record<string, string[]> = {};
    for (const [key, messages] of Object.entries(flattened.fieldErrors)) {
      if (Array.isArray(messages) && messages.length > 0) {
        details[key] = messages;
      }
    }
    const firstFieldError = Object.values(details).flat()[0];

    const errorPayload: ApiErrorResponse = {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message:
          firstFieldError || "Please check the event form fields and try again.",
        details,
      },
    };
    return NextResponse.json(errorPayload, { status: 400 });
  }

  const id = randomUUID();
  const slug = slugifyTitle(parsed.data.title, id);
  const dateTime = formatReadableDateTime(parsed.data.date, parsed.data.time);
  const submittedAt = new Date().toISOString();

  const record: StoredEventSubmission = {
    id,
    slug,
    title: parsed.data.title,
    category: parsed.data.category,
    date: parsed.data.date,
    time: parsed.data.time,
    dateTime,
    duration: parsed.data.duration,
    location: parsed.data.location,
    addressDetails: parsed.data.addressDetails,
    organizer: parsed.data.organizer,
    organizerEmail: parsed.data.organizerEmail,
    spotsAvailable: parsed.data.spotsAvailable,
    description: parsed.data.description,
    fullDescription: parsed.data.fullDescription || parsed.data.description,
    submittedAt,
  };

  const hasWebhook = Boolean(process.env.EVENT_SUBMISSIONS_WEBHOOK_URL?.trim());
  const hasEmail = Boolean(
    process.env.RESEND_API_KEY?.trim() &&
      (process.env.EVENT_SUBMISSIONS_TO_EMAIL || process.env.CONTACT_TO_EMAIL)
        ?.trim(),
  );

  try {
    if (hasEmail) {
      await sendViaResend(record);
    }
    if (hasWebhook) {
      await forwardToWebhook(record);
    }
  } catch {
    const errorPayload: ApiErrorResponse = {
      success: false,
      error: {
        code: "DELIVERY_FAILED",
        message:
          "We could not submit your event right now. Please try again shortly.",
      },
    };
    return NextResponse.json(errorPayload, { status: 502 });
  }

  const persisted = await persistEventSubmission(record);
  if (!persisted && !hasEmail && !hasWebhook) {
    const errorPayload: ApiErrorResponse = {
      success: false,
      error: {
        code: "STORAGE_UNAVAILABLE",
        message:
          "Unable to save your event proposal right now. Please try again later.",
      },
    };
    return NextResponse.json(errorPayload, { status: 500 });
  }

  const payload: ApiSuccessResponse<CreateEventResult> = {
    success: true,
    data: {
      id: record.id,
      slug: record.slug,
      title: record.title,
      category: record.category,
      dateTime: record.dateTime,
      location: record.location,
      submittedAt: record.submittedAt,
    },
    message:
      "Your community event proposal has been submitted! Our coordinators will review and publish approved listings shortly.",
  };

  return NextResponse.json(payload, { status: 201 });
}

