"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type ThemeMode = "light" | "dark";
type StoredTheme = ThemeMode | "system";

interface ThemeContextValue {
  theme: StoredTheme;
  resolvedTheme: ThemeMode;
  setTheme: (theme: StoredTheme) => void;
  toggleTheme: () => void;
}

const STORAGE_KEY = "hopenest-theme";
const THEME_EVENT = "hopenest-theme-change";

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredTheme(): StoredTheme {
  if (typeof window === "undefined") return "system";
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark" || saved === "system") {
      return saved;
    }
  } catch {
    // Ignore storage access errors in restricted browsing modes.
  }
  return "system";
}

function getSystemTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function subscribeTheme(onChange: () => void) {
  if (typeof window === "undefined") return () => {};

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) onChange();
  };

  window.addEventListener(THEME_EVENT, onChange);
  window.addEventListener("storage", handleStorage);
  mediaQuery.addEventListener("change", onChange);

  return () => {
    window.removeEventListener(THEME_EVENT, onChange);
    window.removeEventListener("storage", handleStorage);
    mediaQuery.removeEventListener("change", onChange);
  };
}

function getThemeSnapshot(): string {
  const stored = readStoredTheme();
  const resolved: ThemeMode = stored === "system" ? getSystemTheme() : stored;
  return `${stored}:${resolved}`;
}

function getServerThemeSnapshot(): string {
  return "system:light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  const [stored, resolved] = snapshot.split(":") as [StoredTheme, ThemeMode];

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    if (stored === "light" || stored === "dark") {
      root.classList.add(stored);
    } else if (resolved === "dark") {
      root.classList.add("dark");
    }
  }, [stored, resolved]);

  const setTheme = useCallback((nextTheme: StoredTheme) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, nextTheme);
    } catch {
      // Ignore storage access errors.
    }
    window.dispatchEvent(new Event(THEME_EVENT));
  }, []);

  const toggleTheme = useCallback(() => {
    const next: ThemeMode = resolved === "dark" ? "light" : "dark";
    setTheme(next);
  }, [resolved, setTheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: stored,
      resolvedTheme: resolved,
      setTheme,
      toggleTheme,
    }),
    [stored, resolved, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider.");
  }
  return context;
}

