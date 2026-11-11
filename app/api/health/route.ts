import { NextResponse } from "next/server";
import type { ApiSuccessResponse, HealthCheckPayload } from "@/types";

export async function GET() {
  const payload: ApiSuccessResponse<HealthCheckPayload> = {
    success: true,
    data: {
      status: "ok",
      service: "hope-next",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
    },
  };

  return NextResponse.json(payload, { status: 200 });
}

