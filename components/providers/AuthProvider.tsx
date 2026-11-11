"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import type {
  ApiSuccessResponse,
  AuthSessionResponse,
  AuthUser,
} from "@/types";

interface AuthContextValue {
  user: AuthUser | null;
  googleConfigured: boolean;
  isLoading: boolean;
  isSigningOut: boolean;
  setSessionUser: (user: AuthUser | null) => void;
  refreshSession: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [googleConfigured, setGoogleConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const refreshSession = useCallback(async () => {
    try {
      const res =
        await apiClient.get<ApiSuccessResponse<AuthSessionResponse>>(
          "/auth/session",
        );
      if (res.data?.success) {
        setUser(res.data.data.user);
        setGoogleConfigured(res.data.data.googleConfigured);
      }
    } catch {
      // Keep current session state on transient network failure.
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function loadInitialSession() {
      try {
        const res =
          await apiClient.get<ApiSuccessResponse<AuthSessionResponse>>(
            "/auth/session",
          );
        if (active && res.data?.success) {
          setUser(res.data.data.user);
          setGoogleConfigured(res.data.data.googleConfigured);
        }
      } catch {
        // Keep current session state on transient network failure.
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadInitialSession();
    return () => {
      active = false;
    };
  }, []);

  const setSessionUser = useCallback((nextUser: AuthUser | null) => {
    setUser(nextUser);
    setIsLoading(false);
  }, []);

  const signOut = useCallback(async () => {
    setIsSigningOut(true);
    try {
      await apiClient.post("/auth/sign-out");
      setUser(null);
      router.refresh();
    } finally {
      setIsSigningOut(false);
    }
  }, [router]);

  return (
    <AuthContext
      value={{
        user,
        googleConfigured,
        isLoading,
        isSigningOut,
        setSessionUser,
        refreshSession,
        signOut,
      }}
    >
      {children}
    </AuthContext>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }
  return context;
}
