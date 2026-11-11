import type { Metadata } from "next";

export const SITE_NAME = "HopeNest";
export const SITE_TAGLINE = "Social Development & Community Events Platform";
export const SITE_DESCRIPTION =
  "Discover, organize, and join meaningful community events, volunteer drives, environmental cleanups, tree plantations, and local relief initiatives with HopeNest.";

function normalizeOriginCandidate(raw: string | undefined): string | null {
  const trimmed = raw?.trim();
  if (!trimmed) return null;

  const withProtocol =
    trimmed.startsWith("http://") || trimmed.startsWith("https://")
      ? trimmed
      : `https://${trimmed}`;

  try {
    const url = new URL(withProtocol);
    return url.origin;
  } catch {
    return null;
  }
}

export function resolveSiteUrl(): string {
  const explicitSite = normalizeOriginCandidate(process.env.NEXT_PUBLIC_SITE_URL);
  if (explicitSite) {
    return explicitSite;
  }

  const explicitAppUrl = normalizeOriginCandidate(process.env.NEXT_PUBLIC_APP_URL);
  const isLocalFallback =
    !explicitAppUrl ||
    explicitAppUrl.includes("localhost") ||
    explicitAppUrl.includes("127.0.0.1");

  if (!isLocalFallback && explicitAppUrl) {
    return explicitAppUrl;
  }

  const vercelProdUrl = normalizeOriginCandidate(
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
  );
  if (vercelProdUrl) {
    return vercelProdUrl;
  }

  const vercelBranchUrl = normalizeOriginCandidate(
    process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL,
  );
  if (vercelBranchUrl) {
    return vercelBranchUrl;
  }

  return explicitAppUrl ?? "http://localhost:3000";
}

export interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
}

export function buildPageMetadata({
  title,
  description,
  path,
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: normalizedPath,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: SITE_NAME,
      title: `${title} | ${SITE_NAME}`,
      description,
      url: normalizedPath,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} — ${SITE_TAGLINE}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: ["/twitter-image"],
    },
    ...(noIndex
      ? {
          robots: {
            index: false,
            follow: false,
          },
        }
      : {}),
  };
}

