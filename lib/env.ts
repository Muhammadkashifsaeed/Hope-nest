import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().trim().min(1).default("HopeNest"),
  NEXT_PUBLIC_APP_URL: z.string().trim().min(1).default("http://localhost:3000"),
  NEXT_PUBLIC_API_BASE_URL: z.string().trim().min(1).default("/api"),
  NEXT_PUBLIC_NEWSLETTER_ENDPOINT: z.string().trim().min(1).optional(),
});

export const publicEnv = publicEnvSchema.parse({
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || undefined,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || undefined,
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || undefined,
  NEXT_PUBLIC_NEWSLETTER_ENDPOINT:
    process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT?.trim() || undefined,
});
