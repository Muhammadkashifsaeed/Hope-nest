import axios, { AxiosError, type AxiosInstance } from "axios";
import { publicEnv } from "@/lib/env";
import type { ApiErrorResponse } from "@/types";

export const apiClient: AxiosInstance = axios.create({
  baseURL: publicEnv.NEXT_PUBLIC_API_BASE_URL,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // Attach authorization headers or request metadata here when needed.
    return config;
  },
  (error: unknown) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => Promise.reject(error),
);

/**
 * Extracts a safe, user-facing error message from an Axios error or unknown rejection.
 */
export function extractApiErrorMessage(
  error: unknown,
  fallback = "An unexpected error occurred.",
): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const apiMessage = error.response?.data?.error?.message;
    if (apiMessage) {
      return apiMessage;
    }
    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

