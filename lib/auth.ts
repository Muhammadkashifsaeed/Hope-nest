import {
  createHash,
  createHmac,
  randomBytes,
  randomUUID,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import type { AuthProviderType, AuthUser } from "@/types";

export const SESSION_COOKIE_NAME = "hopenest_session";
export const OAUTH_TX_COOKIE_NAME = "hopenest_oauth_tx";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days
export const OAUTH_TX_MAX_AGE_SECONDS = 60 * 10; // 10 minutes

interface StoredUserRecord {
  id: string;
  name: string;
  email: string;
  provider: AuthProviderType;
  passwordHash?: string;
  googleSub?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface SignedSessionPayload {
  sub: string;
  name: string;
  email: string;
  provider: AuthProviderType;
  avatarUrl?: string;
  createdAt: string;
  exp: number;
}

export interface SignedOAuthTxPayload {
  state: string;
  codeVerifier: string;
  intent: "sign-in" | "sign-up";
  nextPath: string;
  exp: number;
}

let cachedSecret: string | null = null;
let cachedUsersFilePath: string | null = null;
let storeMutex: Promise<void> = Promise.resolve();

function withStoreLock<T>(task: () => Promise<T>): Promise<T> {
  const next = storeMutex.then(task, task);
  storeMutex = next.then(
    () => undefined,
    () => undefined,
  );
  return next;
}

async function getWritableDataPaths(filename: string): Promise<[string, string]> {
  const primary = path.join(process.cwd(), ".next", "data", filename);
  const fallback = path.join(os.tmpdir(), `hopenest-${filename}`);
  return [primary, fallback];
}

async function getAuthSecret(): Promise<string> {
  const configured =
    process.env.AUTH_SECRET?.trim() ||
    process.env.NEXTAUTH_SECRET?.trim() ||
    process.env.API_SECRET_KEY?.trim();
  if (configured) {
    return configured;
  }

  if (cachedSecret) {
    return cachedSecret;
  }

  const candidatePaths = await getWritableDataPaths("auth-secret.key");
  for (const secretPath of candidatePaths) {
    try {
      const existing = (await readFile(/*turbopackIgnore: true*/ secretPath, "utf8")).trim();
      if (existing.length >= 32) {
        cachedSecret = existing;
        return existing;
      }
    } catch {
      // File may not exist yet; continue to next check or create it.
    }
  }

  const generated = randomBytes(48).toString("hex");
  for (const secretPath of candidatePaths) {
    try {
      await mkdir(path.dirname(secretPath), { recursive: true });
      await writeFile(secretPath, generated, { encoding: "utf8", mode: 0o600 });
      cachedSecret = generated;
      return generated;
    } catch {
      continue;
    }
  }

  cachedSecret = generated;
  return generated;
}

async function resolveUsersFilePath(): Promise<string> {
  if (cachedUsersFilePath) {
    return cachedUsersFilePath;
  }

  const candidatePaths = await getWritableDataPaths("users.json");
  for (const targetPath of candidatePaths) {
    try {
      await mkdir(path.dirname(targetPath), { recursive: true });
      try {
        await readFile(/*turbopackIgnore: true*/ targetPath, "utf8");
      } catch {
        await writeFile(targetPath, "[]\n", { encoding: "utf8", mode: 0o600 });
      }
      cachedUsersFilePath = targetPath;
      return targetPath;
    } catch {
      continue;
    }
  }

  throw new Error("Unable to initialize authentication user storage.");
}

async function readUsersUnsafe(): Promise<StoredUserRecord[]> {
  const filePath = await resolveUsersFilePath();
  try {
    const raw = await readFile(/*turbopackIgnore: true*/ filePath, "utf8");
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredUserRecord[]) : [];
  } catch {
    return [];
  }
}

async function writeUsersUnsafe(records: StoredUserRecord[]): Promise<void> {
  const filePath = await resolveUsersFilePath();
  await writeFile(filePath, `${JSON.stringify(records, null, 2)}\n`, {
    encoding: "utf8",
    mode: 0o600,
  });
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function sanitizeRedirectPath(raw: string | null | undefined): string {
  const candidate = raw?.trim();
  if (!candidate) return "/";
  if (
    candidate.startsWith("/") &&
    !candidate.startsWith("//") &&
    !candidate.startsWith("/\\") &&
    !/[\r\n]/.test(candidate)
  ) {
    return candidate;
  }
  return "/";
}

export function shouldUseSecureCookie(request?: Request): boolean {
  if (!request) {
    return false;
  }
  const forwardedProto = request.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim()
    .toLowerCase();
  if (forwardedProto) {
    return forwardedProto === "https";
  }
  try {
    return new URL(request.url).protocol === "https:";
  } catch {
    return false;
  }
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const digest = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${digest}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split(":");
  if (parts.length !== 2) return false;
  const [salt, expectedHex] = parts;
  if (!salt || !expectedHex) return false;

  try {
    const actualBuf = scryptSync(password, salt, 64);
    const expectedBuf = Buffer.from(expectedHex, "hex");
    if (actualBuf.length !== expectedBuf.length) {
      return false;
    }
    return timingSafeEqual(actualBuf, expectedBuf);
  } catch {
    return false;
  }
}

function toAuthUser(record: StoredUserRecord): AuthUser {
  return {
    id: record.id,
    name: record.name,
    email: record.email,
    provider: record.provider,
    avatarUrl: record.avatarUrl,
    createdAt: record.createdAt,
  };
}

export async function signPayload<T extends object>(payload: T): Promise<string> {
  const secret = await getAuthSecret();
  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString(
    "base64url",
  );
  const signature = createHmac("sha256", secret)
    .update(encoded)
    .digest("base64url");
  return `${encoded}.${signature}`;
}

export async function verifySignedPayload<T extends { exp: number }>(
  token: string,
): Promise<T | null> {
  const dotIndex = token.indexOf(".");
  if (dotIndex <= 0) return null;

  const encoded = token.slice(0, dotIndex);
  const providedSig = token.slice(dotIndex + 1);
  if (!encoded || !providedSig) return null;

  try {
    const secret = await getAuthSecret();
    const expectedSig = createHmac("sha256", secret)
      .update(encoded)
      .digest("base64url");

    const providedBuf = Buffer.from(providedSig, "utf8");
    const expectedBuf = Buffer.from(expectedSig, "utf8");
    if (
      providedBuf.length !== expectedBuf.length ||
      !timingSafeEqual(providedBuf, expectedBuf)
    ) {
      return null;
    }

    const parsed = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8"),
    ) as T;
    if (typeof parsed.exp !== "number" || Date.now() > parsed.exp) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export async function createSessionCookieValue(user: AuthUser): Promise<string> {
  const payload: SignedSessionPayload = {
    sub: user.id,
    name: user.name,
    email: user.email,
    provider: user.provider,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
    exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  };
  return signPayload(payload);
}

export async function attachSessionCookie(
  response: NextResponse,
  user: AuthUser,
  request?: Request,
): Promise<void> {
  const token = await createSessionCookieValue(user);
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
    secure: shouldUseSecureCookie(request),
  });
}

export function clearSessionCookie(
  response: NextResponse,
  request?: Request,
): void {
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    secure: shouldUseSecureCookie(request),
  });
}

export async function getSessionUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = await verifySignedPayload<SignedSessionPayload>(token);
  if (!payload || !payload.sub || !payload.email) {
    return null;
  }

  return {
    id: payload.sub,
    name: payload.name,
    email: payload.email,
    provider: payload.provider,
    avatarUrl: payload.avatarUrl,
    createdAt: payload.createdAt,
  };
}

export async function registerCredentialsUser(input: {
  name: string;
  email: string;
  password: string;
}): Promise<
  | { ok: true; user: AuthUser }
  | { ok: false; code: "EMAIL_EXISTS" | "GOOGLE_ACCOUNT_EXISTS"; message: string }
> {
  const email = normalizeEmail(input.email);
  const name = input.name.trim();
  const now = new Date().toISOString();

  return withStoreLock(async () => {
    const users = await readUsersUnsafe();
    const existing = users.find((u) => u.email === email);
    if (existing) {
      if (existing.provider === "google" && !existing.passwordHash) {
        return {
          ok: false,
          code: "GOOGLE_ACCOUNT_EXISTS",
          message:
            "An account with this email already uses Google Sign-In. Please continue with Google.",
        };
      }
      return {
        ok: false,
        code: "EMAIL_EXISTS",
        message: "An account with this email already exists. Try signing in instead.",
      };
    }

    const record: StoredUserRecord = {
      id: randomUUID(),
      name,
      email,
      provider: "credentials",
      passwordHash: hashPassword(input.password),
      createdAt: now,
      updatedAt: now,
    };

    users.push(record);
    await writeUsersUnsafe(users);
    return { ok: true, user: toAuthUser(record) };
  });
}

export async function authenticateCredentialsUser(input: {
  email: string;
  password: string;
}): Promise<
  | { ok: true; user: AuthUser }
  | {
      ok: false;
      code: "INVALID_CREDENTIALS" | "USE_GOOGLE_SIGN_IN";
      message: string;
    }
> {
  const email = normalizeEmail(input.email);

  return withStoreLock(async () => {
    const users = await readUsersUnsafe();
    const existing = users.find((u) => u.email === email);
    if (!existing) {
      return {
        ok: false,
        code: "INVALID_CREDENTIALS",
        message: "Invalid email or password.",
      };
    }

    if (!existing.passwordHash) {
      return {
        ok: false,
        code: "USE_GOOGLE_SIGN_IN",
        message:
          "This account is linked with Google Sign-In. Please click Continue with Google.",
      };
    }

    if (!verifyPassword(input.password, existing.passwordHash)) {
      return {
        ok: false,
        code: "INVALID_CREDENTIALS",
        message: "Invalid email or password.",
      };
    }

    return { ok: true, user: toAuthUser(existing) };
  });
}

export async function upsertGoogleUser(profile: {
  sub: string;
  email: string;
  name: string;
  picture?: string;
}): Promise<AuthUser> {
  const email = normalizeEmail(profile.email);
  const now = new Date().toISOString();

  return withStoreLock(async () => {
    const users = await readUsersUnsafe();
    const existingIndex = users.findIndex(
      (u) => u.googleSub === profile.sub || u.email === email,
    );

    if (existingIndex !== -1) {
      const current = users[existingIndex];
      const updated: StoredUserRecord = {
        ...current,
        name: profile.name.trim() || current.name,
        googleSub: profile.sub,
        avatarUrl: profile.picture || current.avatarUrl,
        provider: current.passwordHash ? current.provider : "google",
        updatedAt: now,
      };
      users[existingIndex] = updated;
      await writeUsersUnsafe(users);
      return toAuthUser(updated);
    }

    const created: StoredUserRecord = {
      id: randomUUID(),
      name: profile.name.trim() || email.split("@")[0],
      email,
      provider: "google",
      googleSub: profile.sub,
      avatarUrl: profile.picture,
      createdAt: now,
      updatedAt: now,
    };

    users.push(created);
    await writeUsersUnsafe(users);
    return toAuthUser(created);
  });
}

export function isGoogleOAuthConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID?.trim() &&
      process.env.GOOGLE_CLIENT_SECRET?.trim(),
  );
}

export function resolveRequestOrigin(request: Request): string {
  const forwardedHost = request.headers
    .get("x-forwarded-host")
    ?.split(",")[0]
    ?.trim();
  const forwardedProto = request.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim();

  if (forwardedHost) {
    return `${forwardedProto || "https"}://${forwardedHost}`;
  }

  try {
    return new URL(request.url).origin;
  } catch {
    return "http://localhost:3000";
  }
}

export function getGoogleOAuthConfig(request: Request): {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
} | null {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) {
    return null;
  }

  const origin = resolveRequestOrigin(request);
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI?.trim() ||
    `${origin}/api/auth/google/callback`;

  return { clientId, clientSecret, redirectUri };
}

export function createPkceChallenge(codeVerifier: string): string {
  return createHash("sha256").update(codeVerifier).digest("base64url");
}

export function safeEqualStrings(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

