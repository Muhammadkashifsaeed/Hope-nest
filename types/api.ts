export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface HealthCheckPayload {
  status: "ok";
  service: string;
  timestamp: string;
  uptimeSeconds: number;
}

export interface ContactSubmissionResult {
  id: string;
  subject: string;
  submittedAt: string;
}

export interface NewsletterSubscriptionResult {
  id: string;
  email: string;
  subscribedAt: string;
  alreadySubscribed: boolean;
}

export interface CreateEventResult {
  id: string;
  slug: string;
  title: string;
  category: string;
  dateTime: string;
  location: string;
  submittedAt: string;
}


