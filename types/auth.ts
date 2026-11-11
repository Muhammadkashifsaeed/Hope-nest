export type AuthProviderType = "credentials" | "google";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  provider: AuthProviderType;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthSessionResponse {
  user: AuthUser | null;
  googleConfigured: boolean;
}

