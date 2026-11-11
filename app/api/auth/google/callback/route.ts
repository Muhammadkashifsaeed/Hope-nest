import { NextResponse, type NextRequest } from "next/server";
import {
  attachSessionCookie,
  getGoogleOAuthConfig,
  OAUTH_TX_COOKIE_NAME,
  resolveRequestOrigin,
  safeEqualStrings,
  sanitizeRedirectPath,
  shouldUseSecureCookie,
  upsertGoogleUser,
  verifySignedPayload,
  type SignedOAuthTxPayload,
} from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface GoogleTokenResponse {
  access_token?: string;
  token_type?: string;
}

interface GoogleUserInfo {
  sub?: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
}

function redirectWithAuthError(
  origin: string,
  intent: "sign-in" | "sign-up",
  errorCode: string,
  request: NextRequest,
): NextResponse {
  const target = new URL(`/${intent}`, origin);
  target.searchParams.set("error", errorCode);
  const res = NextResponse.redirect(target, { status: 302 });
  res.cookies.set(OAUTH_TX_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    secure: shouldUseSecureCookie(request),
  });
  return res;
}

export async function GET(request: NextRequest) {
  const origin = resolveRequestOrigin(request);
  const url = new URL(request.url);
  const txCookie = request.cookies.get(OAUTH_TX_COOKIE_NAME)?.value;

  const txPayload = txCookie
    ? await verifySignedPayload<SignedOAuthTxPayload>(txCookie)
    : null;
  const intent = txPayload?.intent ?? "sign-in";

  if (!txPayload) {
    return redirectWithAuthError(origin, intent, "oauth_state_expired", request);
  }

  const providerError = url.searchParams.get("error");
  if (providerError) {
    return redirectWithAuthError(
      origin,
      intent,
      providerError === "access_denied" ? "oauth_cancelled" : "oauth_failed",
      request,
    );
  }

  const code = url.searchParams.get("code")?.trim();
  const state = url.searchParams.get("state")?.trim();
  if (!code || !state || !safeEqualStrings(state, txPayload.state)) {
    return redirectWithAuthError(origin, intent, "oauth_state_invalid", request);
  }

  const googleConfig = getGoogleOAuthConfig(request);
  if (!googleConfig) {
    return redirectWithAuthError(
      origin,
      intent,
      "google_not_configured",
      request,
    );
  }

  try {
    const tokenBody = new URLSearchParams({
      code,
      client_id: googleConfig.clientId,
      client_secret: googleConfig.clientSecret,
      redirect_uri: googleConfig.redirectUri,
      grant_type: "authorization_code",
      code_verifier: txPayload.codeVerifier,
    });

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: tokenBody.toString(),
      signal: AbortSignal.timeout(10_000),
    });

    if (!tokenRes.ok) {
      return redirectWithAuthError(
        origin,
        intent,
        "google_exchange_failed",
        request,
      );
    }

    const tokenData = (await tokenRes.json()) as GoogleTokenResponse;
    if (!tokenData.access_token) {
      return redirectWithAuthError(
        origin,
        intent,
        "google_exchange_failed",
        request,
      );
    }

    const userInfoRes = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
        signal: AbortSignal.timeout(10_000),
      },
    );

    if (!userInfoRes.ok) {
      return redirectWithAuthError(
        origin,
        intent,
        "google_profile_failed",
        request,
      );
    }

    const profile = (await userInfoRes.json()) as GoogleUserInfo;
    if (!profile.sub || !profile.email || profile.email_verified !== true) {
      return redirectWithAuthError(
        origin,
        intent,
        "google_email_unverified",
        request,
      );
    }

    const user = await upsertGoogleUser({
      sub: profile.sub,
      email: profile.email,
      name: profile.name || profile.email.split("@")[0],
      picture: profile.picture,
    });

    const nextPath = sanitizeRedirectPath(txPayload.nextPath);
    const destination = new URL(nextPath, origin);
    const response = NextResponse.redirect(destination, { status: 302 });

    response.cookies.set(OAUTH_TX_COOKIE_NAME, "", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
      secure: shouldUseSecureCookie(request),
    });
    await attachSessionCookie(response, user, request);

    return response;
  } catch {
    return redirectWithAuthError(origin, intent, "oauth_failed", request);
  }
}

