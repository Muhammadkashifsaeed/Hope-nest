export type EventCategory = "Cleanup" | "Donation" | "Plantation" | "Other";

export type EventFilterCategory = "All" | EventCategory;

export type EventBadgeTone =
  | EventCategory
  | "Awareness"
  | "Fundraising";

export type EventSortOrder = "latest" | "oldest";

export interface CommunityEvent {
  id: string;
  title: string;
  category: EventCategory;
  image: string;
  imageAlt: string;
  imagePosition?: string;
  location: string;
  addressDetails: string;
  date: string;
  time: string;
  dateTime: string;
  startAt: string;
  month: string;
  monthLabel: string;
  description: string;
  fullDescription: string;
  organizer: string;
  duration: string;
  spotsRemaining: number;
  highlights: readonly string[];
  whatToBring: readonly string[];
  homeBadgeLabel?: EventBadgeTone;
}

export interface EventMonthOption {
  value: string;
  label: string;
}

export interface EventCategoryOption {
  category: EventFilterCategory;
  label: string;
  count: number;
}
