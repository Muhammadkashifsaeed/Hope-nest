import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { newsletterSchema } from "@/lib/validations";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  NewsletterSubscriptionResult,
} from "@/types";

export const runtime = "nodejs";

interface StoredSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

let cachedStorePath: string | null = null;
let storeMutex: Promise<void> = Promise.resolve();

function withStoreLock<T>(task: () => Promise<T>): Promise<T> {
  const next = storeMutex.then(task, task);
  storeMutex = next.then(
    () => undefined,
    () => undefined,
  );
  return next;
}

async function resolveSubscribersFilePath(): Promise<string> {
  if (cachedStorePath) {
    return cachedStorePath;
  }

  const candidatePaths = [
    path.join(process.cwd(), ".next", "data", "newsletter-subscribers.json"),
    path.join(os.tmpdir(), "hopenest-newsletter-subscribers.json"),
  ];

  for (const targetPath of candidatePaths) {
    try {
      await mkdir(path.dirname(targetPath), { recursive: true });
      try {
        await readFile(/*turbopackIgnore: true*/ targetPath, "utf8");
      } catch {
        await writeFile(targetPath, "[]\n", { encoding: "utf8", mode: 0o600 });
      }
      cachedStorePath = targetPath;
      return targetPath;
    } catch {
      continue;
    }
  }

  throw new Error("Unable to initialize newsletter subscriber storage.");
}

async function upsertSubscriber(email: string): Promise<{
  record: StoredSubscriber;
  alreadySubscribed: boolean;
}> {
  return withStoreLock(async () => {
    const filePath = await resolveSubscribersFilePath();
    let existingList: StoredSubscriber[] = [];

    try {
      const raw = await readFile(/*turbopackIgnore: true*/ filePath, "utf8");
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        existingList = parsed as StoredSubscriber[];
      }
    } catch {
      existingList = [];
    }

    const existing = existingList.find((item) => item.email === email);
    if (existing) {
      return { record: existing, alreadySubscribed: true };
    }

    const created: StoredSubscriber = {
      id: randomUUID(),
      email,
      subscribedAt: new Date().toISOString(),
    };

    existingList.push(created);
    await writeFile(filePath, `${JSON.stringify(existingList, null, 2)}\n`, {
      encoding: "utf8",
      mode: 0o600,
    });

    return { record: created, alreadySubscribed: false };
  });
}

async function forwardToWebhook(record: StoredSubscriber): Promise<void> {
  const webhookUrl = process.env.NEWSLETTER_WEBHOOK_URL?.trim();
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
    throw new Error(`Newsletter webhook returned status ${response.status}`);
  }
}

async function notifyViaResend(record: StoredSubscriber): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const recipient = (
    process.env.NEWSLETTER_TO_EMAIL || process.env.CONTACT_TO_EMAIL
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
      subject: `[HopeNest Newsletter] New subscriber: ${record.email}`,
      text: `New newsletter subscription on HopeNest.\n\nEmail: ${record.email}\nSubscribed At: ${record.subscribedAt}\nID: ${record.id}`,
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
        message: "Invalid request body. Please provide a valid JSON payload.",
      },
    };
    return NextResponse.json(errorPayload, { status: 400 });
  }

  if (typeof rawBody !== "object" || rawBody === null || Array.isArray(rawBody)) {
    const errorPayload: ApiErrorResponse = {
      success: false,
      error: {
        code: "INVALID_PAYLOAD",
        message: "Subscription request must be a JSON object.",
      },
    };
    return NextResponse.json(errorPayload, { status: 400 });
  }

  const parsed = newsletterSchema.safeParse(rawBody);
  if (!parsed.success) {
    const flattened = z.flattenError(parsed.error);
    const details: Record<string, string[]> = {};
    for (const [key, messages] of Object.entries(flattened.fieldErrors)) {
      if (Array.isArray(messages) && messages.length > 0) {
        details[key] = messages;
      }
    }
    const firstError = Object.values(details).flat()[0];

    const errorPayload: ApiErrorResponse = {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: firstError || "Please enter a valid email address.",
        details,
      },
    };
    return NextResponse.json(errorPayload, { status: 400 });
  }

  const normalizedEmail = parsed.data.email.trim().toLowerCase();

  let upsertResult: { record: StoredSubscriber; alreadySubscribed: boolean } | null =
    null;

  try {
    upsertResult = await upsertSubscriber(normalizedEmail);
  } catch {
    upsertResult = null;
  }

  const record: StoredSubscriber = upsertResult?.record ?? {
    id: randomUUID(),
    email: normalizedEmail,
    subscribedAt: new Date().toISOString(),
  };
  const alreadySubscribed = upsertResult?.alreadySubscribed ?? false;

  const hasWebhook = Boolean(process.env.NEWSLETTER_WEBHOOK_URL?.trim());
  const hasResend = Boolean(
    process.env.RESEND_API_KEY?.trim() &&
      (process.env.NEWSLETTER_TO_EMAIL || process.env.CONTACT_TO_EMAIL)?.trim(),
  );

  if (!alreadySubscribed) {
    try {
      if (hasWebhook) {
        await forwardToWebhook(record);
      }
      if (hasResend) {
        await notifyViaResend(record);
      }
    } catch {
      const errorPayload: ApiErrorResponse = {
        success: false,
        error: {
          code: "SUBSCRIPTION_FAILED",
          message:
            "Unable to complete subscription right now. Please try again later.",
        },
      };
      return NextResponse.json(errorPayload, { status: 502 });
    }
  }

  if (!upsertResult && !hasWebhook && !hasResend) {
    const errorPayload: ApiErrorResponse = {
      success: false,
      error: {
        code: "STORAGE_UNAVAILABLE",
        message:
          "Subscription storage is temporarily unavailable. Please try again later.",
      },
    };
    return NextResponse.json(errorPayload, { status: 500 });
  }

  const payload: ApiSuccessResponse<NewsletterSubscriptionResult> = {
    success: true,
    data: {
      id: record.id,
      email: record.email,
      subscribedAt: record.subscribedAt,
      alreadySubscribed,
    },
    message: alreadySubscribed
      ? "This email is already subscribed to HopeNest updates."
      : "Subscribed successfully. Thank you for joining HopeNest updates!",
  };

  return NextResponse.json(payload, { status: alreadySubscribed ? 200 : 201 });
}

