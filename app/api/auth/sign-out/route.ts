import { NextResponse, type NextRequest } from "next/server";
import { clearSessionCookie } from "@/lib/auth";
import type { ApiSuccessResponse } from "@/types";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const payload: ApiSuccessResponse<{ signedOut: true }> = {
    success: true,
    data: { signedOut: true },
    message: "You have been signed out.",
  };

  const response = NextResponse.json(payload, { status: 200 });
  clearSessionCookie(response, request);
  return response;
}

