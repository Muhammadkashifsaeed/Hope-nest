# HopeNest — Social Development & Community Events Platform

HopeNest is a production-ready Next.js 16 App Router web application built with TypeScript, Tailwind CSS v4, Framer Motion, React Hook Form, Zod, and Axios. It connects community volunteers, event organizers, and local relief initiatives with full SEO metadata, structured JSON-LD data, authentication (Email/Password + Google OAuth 2.0 PKCE), dark/light theme support, and Vercel-ready API route handlers.

## Routes & Features

- `/` — Home page with hero event search (filtered by real event locations and categories), upcoming events carousel, community impact pillars, gallery, and newsletter signup
- `/events` — Interactive event catalog with category tabs, keyword search, location filter badges, sort order, and URL query state sync
- `/events/[id]` — Event detail pages with Schema.org `Event` JSON-LD, RSVP toggle persistence, share link copy, and related events
- `/events/create` — Organizer event submission form wired to `POST /api/events`
- `/about` — Platform overview, how it works, and community calls to action
- `/contact` — Contact page with interactive inquiry form backed by `POST /api/contact`
- `/sign-in` & `/sign-up` — Authentication views supporting Email/Password and Google OAuth 2.0 (`GET /api/auth/google`)
- `/privacy` & `/terms-of-service` — Legal policy documents with sticky interactive Table of Contents
- SEO & App Metadata — `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest`, dynamic `/opengraph-image`, `/twitter-image`, and SVG app icon

## Getting Started

1. Copy environment variables:

```bash
cp .env.example .env.local
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

## Available Scripts

- `npm run dev` — Start the Next.js development server
- `npm run build` — Create an optimized production build
- `npm run start` — Start the production server
- `npm run lint` — Run ESLint across the codebase
- `npm run lint:fix` — Run ESLint and automatically fix issues
- `npm run typecheck` — Generate Next.js route types and run TypeScript type checking
- `npm run check` — Run both `typecheck` and `lint`

## Deploying to Vercel

1. Push this project to GitHub (`/.next` and `.env*` other than `.env.example` are already gitignored).
2. Import the repository into [Vercel](https://vercel.com). Framework Preset will auto-detect **Next.js**.
3. Set these Environment Variables in **Project Settings → Environment Variables**:
   - `AUTH_SECRET` — **Required** in production so signed session cookies stay valid across serverless instances (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`).
   - `NEXT_PUBLIC_SITE_URL` — Recommended if using a custom production domain (e.g. `https://hopenest.org`). When omitted, HopeNest automatically resolves Vercel's `VERCEL_PROJECT_PRODUCTION_URL` / `VERCEL_URL` for `metadataBase`, canonical links, `robots.txt`, and `sitemap.xml`.
   - `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` *(optional)* — Enable Google OAuth 2.0 (`https://<your-domain>/api/auth/google/callback` in Google Cloud Console Authorized Redirect URIs).
   - `RESEND_API_KEY` & `CONTACT_TO_EMAIL` *(optional)* — Forward contact, newsletter, and event submissions via Resend.
