import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EventDetail } from "@/components/events/EventDetail";
import {
  getAllEventDetailIds,
  getEventById,
  getRelatedEvents,
} from "@/lib/events";
import { SITE_NAME, resolveSiteUrl } from "@/lib/site";

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return getAllEventDetailIds().map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const event = getEventById(id);

  if (!event) {
    return {
      title: "Event Not Found",
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const canonicalPath = `/events/${event.id}`;

  return {
    title: event.title,
    description: event.description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      title: `${event.title} | ${SITE_NAME}`,
      description: event.description,
      url: canonicalPath,
      images: [
        {
          url: event.image,
          alt: event.imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${event.title} | ${SITE_NAME}`,
      description: event.description,
      images: [event.image],
    },
  };
}

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const { id } = await params;
  const event = getEventById(id);

  if (!event) {
    notFound();
  }

  const relatedEvents = getRelatedEvents(event, 3);
  const siteUrl = resolveSiteUrl();

  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.fullDescription || event.description,
    startDate: event.startAt,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.location,
      address: event.addressDetails,
    },
    image: [`${siteUrl}${event.image}`],
    organizer: {
      "@type": "Organization",
      name: event.organizer,
      url: siteUrl,
    },
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${siteUrl}/events/${event.id}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(eventJsonLd).replaceAll("<", "\\u003c"),
        }}
      />
      <EventDetail event={event} relatedEvents={relatedEvents} />
    </>
  );
}
