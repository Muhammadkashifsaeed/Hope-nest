import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { attachSessionCookie, authenticateCredentialsUser } from "@/lib/auth";
import { signInSchema } from "@/lib/validations";
import type { ApiErrorResponse, ApiSuccessResponse, AuthUser } from "@/types";

export const runtime = "nodejs";

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
        message: "Sign in submission must be a JSON object.",
      },
    };
    return NextResponse.json(errorPayload, { status: 400 });
  }

  const parsed = signInSchema.safeParse(rawBody);
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
          firstFieldError || "Please enter a valid email and password.",
        details,
      },
    };
    return NextResponse.json(errorPayload, { status: 400 });
  }

  try {
    const result = await authenticateCredentialsUser({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (!result.ok) {
      const errorPayload: ApiErrorResponse = {
        success: false,
        error: {
          code: result.code,
          message: result.message,
        },
      };
      return NextResponse.json(errorPayload, {
        status: result.code === "USE_GOOGLE_SIGN_IN" ? 400 : 401,
      });
    }

    const successPayload: ApiSuccessResponse<{ user: AuthUser }> = {
      success: true,
      data: { user: result.user },
      message: "Signed in successfully.",
    };

    const response = NextResponse.json(successPayload, { status: 200 });
    await attachSessionCookie(response, result.user, request);
    return response;
  } catch {
    const errorPayload: ApiErrorResponse = {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Unable to sign in right now. Please try again.",
      },
    };
    return NextResponse.json(errorPayload, { status: 500 });
  }
}

