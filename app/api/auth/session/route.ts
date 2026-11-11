import { NextResponse } from "next/server";
import { getSessionUser, isGoogleOAuthConfigured } from "@/lib/auth";
import type { ApiSuccessResponse, AuthSessionResponse } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSessionUser();
  const payload: ApiSuccessResponse<AuthSessionResponse> = {
    success: true,
    data: {
      user,
      googleConfigured: isGoogleOAuthConfigured(),
    },
  };

  return NextResponse.json(payload, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

