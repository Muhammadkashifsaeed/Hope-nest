import { randomUUID } from "node:crypto";
import { appendFile, mkdir } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { contactSchema } from "@/lib/validations";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  ContactSubmissionResult,
} from "@/types";

export const runtime = "nodejs";

interface StoredContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function persistSubmissionToDisk(
  record: StoredContactSubmission,
): Promise<boolean> {
  const line = `${JSON.stringify(record)}\n`;
  const primaryPath = path.join(
    process.cwd(),
    ".next",
    "data",
    "contact-submissions.ndjson",
  );
  const fallbackPath = path.join(
    os.tmpdir(),
    "hopenest-contact-submissions.ndjson",
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

async function sendViaResend(record: StoredContactSubmission): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const recipient = process.env.CONTACT_TO_EMAIL?.trim();
  if (!apiKey || !recipient) {
    return;
  }

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
      reply_to: record.email,
      subject: `[HopeNest Contact] ${record.subject} — ${record.name}`,
      text: [
        `Inquiry ID: ${record.id}`,
        `Submitted: ${record.submittedAt}`,
        `Name: ${record.name}`,
        `Email: ${record.email}`,
        `Subject: ${record.subject}`,
        "",
        "Message:",
        record.message,
      ].join("\n"),
      html: `
        <h2>New HopeNest Contact Inquiry</h2>
        <p><strong>Reference:</strong> ${escapeHtml(record.id)}</p>
        <p><strong>Name:</strong> ${escapeHtml(record.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(record.email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(record.subject)}</p>
        <p><strong>Submitted:</strong> ${escapeHtml(record.submittedAt)}</p>
        <hr />
        <p style="white-space: pre-wrap;">${escapeHtml(record.message)}</p>
      `,
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`Email service returned status ${response.status}`);
  }
}

async function forwardToWebhook(record: StoredContactSubmission): Promise<void> {
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL?.trim();
  if (!webhookUrl) {
    return;
  }

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
        message: "Contact form submission must be a JSON object.",
      },
    };
    return NextResponse.json(errorPayload, { status: 400 });
  }

  const parsed = contactSchema.safeParse(rawBody);
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
          firstFieldError || "Please check all required fields and try again.",
        details,
      },
    };
    return NextResponse.json(errorPayload, { status: 400 });
  }

  const record: StoredContactSubmission = {
    id: randomUUID(),
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject,
    message: parsed.data.message,
    submittedAt: new Date().toISOString(),
  };

  const hasEmailIntegration = Boolean(
    process.env.RESEND_API_KEY?.trim() && process.env.CONTACT_TO_EMAIL?.trim(),
  );
  const hasWebhookIntegration = Boolean(
    process.env.CONTACT_WEBHOOK_URL?.trim(),
  );

  try {
    if (hasEmailIntegration) {
      await sendViaResend(record);
    }
    if (hasWebhookIntegration) {
      await forwardToWebhook(record);
    }
  } catch {
    const errorPayload: ApiErrorResponse = {
      success: false,
      error: {
        code: "DELIVERY_FAILED",
        message:
          "We could not deliver your message right now. Please try again shortly or email info@hopenest.io directly.",
      },
    };
    return NextResponse.json(errorPayload, { status: 502 });
  }

  const persisted = await persistSubmissionToDisk(record);
  if (!persisted && !hasEmailIntegration && !hasWebhookIntegration) {
    const errorPayload: ApiErrorResponse = {
      success: false,
      error: {
        code: "STORAGE_UNAVAILABLE",
        message:
          "Unable to save your message right now. Please try again later or email info@hopenest.io.",
      },
    };
    return NextResponse.json(errorPayload, { status: 500 });
  }

  const payload: ApiSuccessResponse<ContactSubmissionResult> = {
    success: true,
    data: {
      id: record.id,
      subject: record.subject,
      submittedAt: record.submittedAt,
    },
    message:
      "Thank you for reaching out! Your message has been received and our team will respond within 1-2 business days.",
  };

  return NextResponse.json(payload, { status: 201 });
}

