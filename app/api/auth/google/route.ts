import { randomBytes } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import {
  createPkceChallenge,
  getGoogleOAuthConfig,
  OAUTH_TX_COOKIE_NAME,
  OAUTH_TX_MAX_AGE_SECONDS,
  resolveRequestOrigin,
  sanitizeRedirectPath,
  shouldUseSecureCookie,
  signPayload,
  type SignedOAuthTxPayload,
} from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const intent =
    url.searchParams.get("intent") === "sign-up" ? "sign-up" : "sign-in";
  const nextPath = sanitizeRedirectPath(url.searchParams.get("next"));
  const origin = resolveRequestOrigin(request);

  const googleConfig = getGoogleOAuthConfig(request);
  if (!googleConfig) {
    const fallbackUrl = new URL(`/${intent}`, origin);
    fallbackUrl.searchParams.set("error", "google_not_configured");
    if (nextPath !== "/") {
      fallbackUrl.searchParams.set("next", nextPath);
    }
    return NextResponse.redirect(fallbackUrl, { status: 302 });
  }

  const state = randomBytes(24).toString("hex");
  const codeVerifier = randomBytes(32).toString("base64url");
  const codeChallenge = createPkceChallenge(codeVerifier);

  const txPayload: SignedOAuthTxPayload = {
    state,
    codeVerifier,
    intent,
    nextPath,
    exp: Date.now() + OAUTH_TX_MAX_AGE_SECONDS * 1000,
  };
  const signedTxCookie = await signPayload(txPayload);

  const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleAuthUrl.searchParams.set("client_id", googleConfig.clientId);
  googleAuthUrl.searchParams.set("redirect_uri", googleConfig.redirectUri);
  googleAuthUrl.searchParams.set("response_type", "code");
  googleAuthUrl.searchParams.set("scope", "openid email profile");
  googleAuthUrl.searchParams.set("state", state);
  googleAuthUrl.searchParams.set("code_challenge", codeChallenge);
  googleAuthUrl.searchParams.set("code_challenge_method", "S256");
  googleAuthUrl.searchParams.set("prompt", "select_account");

  const response = NextResponse.redirect(googleAuthUrl, { status: 302 });
  response.cookies.set(OAUTH_TX_COOKIE_NAME, signedTxCookie, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: OAUTH_TX_MAX_AGE_SECONDS,
    secure: shouldUseSecureCookie(request),
  });

  return response;
}

