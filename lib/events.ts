import type {
  CommunityEvent,
  EventCategory,
  EventCategoryOption,
  EventFilterCategory,
  EventMonthOption,
  EventSortOrder,
} from "@/types";

export const ALL_MONTHS_VALUE = "all";
export const DEFAULT_SORT_ORDER: EventSortOrder = "latest";

export const EVENT_CATEGORIES: readonly EventFilterCategory[] = [
  "All",
  "Cleanup",
  "Donation",
  "Plantation",
  "Other",
];

export const events: readonly CommunityEvent[] = [
  {
    id: "coastal-shoreline-beach-cleanup",
    title: "Coastal Shoreline & Beach Cleanup",
    category: "Cleanup",
    image: "/images/photo-1618477461853-cf6ed80faba5.webp",
    imageAlt:
      "Two community volunteers wearing teal shirts, gloves, and caps collecting shoreline plastic debris into a reusable sack",
    imagePosition: "object-center",
    location: "Patenga Coastal Shoreline",
    addressDetails: "Sector 2 North Beach Access, Coastal Drive",
    date: "Sat, Nov 14, 2026",
    time: "7:30 AM",
    dateTime: "Sat, Nov 14, 2026 · 7:30 AM",
    startAt: "2026-11-14T07:30",
    month: "november-2026",
    monthLabel: "November 2026",
    description:
      "Team up along the shoreline with gloves and woven sacks to clear washed-up plastics, fishing line, and coastal litter.",
    fullDescription:
      "Join local environmental volunteers at sunrise for a focused coastal restoration morning. Participants work in small zone teams to gather single-use plastics, driftwood debris, and discarded packaging along the tide line before weighed sorting with municipal recycling partners.",
    organizer: "HopeNest Coastal Watch",
    duration: "3 hours",
    spotsRemaining: 18,
    highlights: [
      "Heavy-duty gloves, sun caps, and woven collection sacks provided at check-in",
      "Sorted plastic and recyclable weighing logged for community impact tracking",
      "Post-cleanup hydration station and coastal conservation briefing",
    ],
    whatToBring: [
      "Refillable water bottle",
      "Closed-toe walking shoes or sturdy sandals",
      "Sunscreen and lightweight outdoor layers",
    ],
  },
  {
    id: "native-sapling-nurture-plantation",
    title: "Native Sapling & Woodland Restoration Drive",
    category: "Plantation",
    image: "/images/photo-1542601906990-b4d3fb778b09.webp",
    imageAlt:
      "Volunteer hands carefully cradling rich soil with a healthy green native tree sapling above forest foliage",
    imagePosition: "object-center",
    location: "Greenway Botanical Trail",
    addressDetails: "Trailhead Gate B, Riverside Preserve",
    date: "Sun, Nov 15, 2026",
    time: "8:00 AM",
    dateTime: "Sun, Nov 15, 2026 · 8:00 AM",
    startAt: "2026-11-15T08:00",
    month: "november-2026",
    monthLabel: "November 2026",
    description:
      "Plant native tree saplings along shaded woodland corridors and mulch starter soil beds to restore local biodiversity.",
    fullDescription:
      "Help expand urban tree canopy cover along the Greenway Botanical Trail. Guided by local arborists, volunteers learn proper root-ball placement, organic mulching, and early watering techniques to give 150 native saplings the strongest start.",
    organizer: "HopeNest Urban Canopy Collective",
    duration: "3.5 hours",
    spotsRemaining: 24,
    highlights: [
      "Hands-on sapling planting guided by certified community foresters",
      "Over 150 native shade and pollinator trees scheduled for corridor planting",
      "Organic mulch and biodegradable tree guards supplied on site",
    ],
    whatToBring: [
      "Sturdy outdoor shoes that can get muddy",
      "Sun hat and reusable water bottle",
      "Gardening gloves if you prefer your own pair",
    ],
  },
  {
    id: "free-community-vision-eye-screening",
    title: "Free Community Vision & Eye Screening Camp",
    category: "Other",
    image: "/images/types-eye-tests.webp",
    imageAlt:
      "Woman receiving a gentle clinical eye screening examination using optical diagnostic equipment",
    imagePosition: "object-[50%_25%]",
    location: "Mercy Civic Health Clinic",
    addressDetails: "Outpatient Wing, 42 Central Avenue",
    date: "Wed, Nov 18, 2026",
    time: "9:00 AM",
    dateTime: "Wed, Nov 18, 2026 · 9:00 AM",
    startAt: "2026-11-18T09:00",
    month: "november-2026",
    monthLabel: "November 2026",
    description:
      "Receive complimentary vision checkups, optometry consultations, and prescription eyeglass referrals from volunteer clinicians.",
    fullDescription:
      "Preventive eye care made accessible for students, seniors, and working families. Licensed optometrists and nursing volunteers provide visual acuity checks, slit-lamp eye screenings, and voucher referrals for subsidized prescription frames.",
    organizer: "HopeNest Health & Sight Network",
    duration: "5 hours",
    spotsRemaining: 32,
    highlights: [
      "Complimentary visual acuity and slit-lamp eye health screenings",
      "One-on-one consultations with volunteer optometrists",
      "Prescription voucher support for eligible seniors and school children",
    ],
    whatToBring: [
      "Existing eyeglasses or current prescription (if any)",
      "Photo ID for clinic check-in desk",
    ],
  },
  {
    id: "fresh-produce-food-box-distribution",
    title: "Fresh Produce & Emergency Food Box Drive",
    category: "Donation",
    image: "/images/photo-1593113598332-cd288d649433.webp",
    imageAlt:
      "Masked and gloved volunteers unloading stacked fresh produce boxes from a relief truck",
    imagePosition: "object-[50%_25%]",
    location: "Westside Community Food Hub",
    addressDetails: "Loading Bay 3, 210 Harvest Market Lane",
    date: "Sat, Nov 21, 2026",
    time: "9:00 AM",
    dateTime: "Sat, Nov 21, 2026 · 9:00 AM",
    startAt: "2026-11-21T09:00",
    month: "november-2026",
    monthLabel: "November 2026",
    description:
      "Unload, sort, and deliver crates of fresh farm produce and weekly nutrition parcels to neighborhood pantries.",
    fullDescription:
      "Partner with local growers and pantry coordinators to move 400 crates of fresh vegetables, fruit, and staple pantry items from delivery trucks into family-ready nutrition parcels for weekend neighborhood distribution.",
    organizer: "HopeNest Harvest Relief",
    duration: "3 hours",
    spotsRemaining: 14,
    highlights: [
      "Direct farm-to-pantry fresh produce sorting and quality checks",
      "Over 400 weekly nutrition boxes prepared for local families",
      "Accessible drive-up and walk-up distribution lanes",
    ],
    whatToBring: [
      "Closed-toe shoes suitable for unloading bays",
      "Reusable tote bags if picking up a family share",
    ],
  },
  {
    id: "winter-blanket-warm-clothes-distribution",
    title: "Winter Blanket & Warm Clothes Distribution",
    category: "Donation",
    image: "/images/imageMyjpg.webp",
    imageAlt:
      "Community organizer preparing winter blanket and warm clothes distribution records on a laptop",
    imagePosition: "object-[50%_22%]",
    location: "Khulna Zilla School Ground, Khulna",
    addressDetails: "Main Assembly Field, Station Road, Khulna",
    date: "Sat, Nov 28, 2026",
    time: "5:00 AM",
    dateTime: "Sat, Nov 28, 2026 · 5:00 AM",
    startAt: "2026-11-28T05:00",
    month: "november-2026",
    monthLabel: "November 2026",
    description:
      "Organize and distribute warm blankets, sweaters, and cold-weather essentials to vulnerable families before dawn.",
    fullDescription:
      "Early-morning winter relief initiative coordinating volunteer check-in rosters, size-sorted sweater racks, and thermal blanket bundles so elderly residents, daily wage earners, and families receive warm winter protection smoothly.",
    organizer: "HopeNest Khulna Chapter",
    duration: "4 hours",
    spotsRemaining: 22,
    highlights: [
      "Digital beneficiary coordination ensuring fair, organized distribution",
      "Heavy wool blankets, insulated jackets, and children's knitwear",
      "Hot tea and warm breakfast packets served to attendees",
    ],
    whatToBring: [
      "Warm morning jacket",
      "Donated clean blankets or sweaters (optional drop-off)",
    ],
  },
  {
    id: "winter-clothes-drive",
    title: "Winter Clothes Drive",
    category: "Donation",
    image: "/images/photo-1576091160550-2173dba999ef.webp",
    imageAlt:
      "Community health and winter care coordinator working at a desk with a laptop and stethoscope",
    imagePosition: "object-center",
    location: "Downtown Community Center",
    addressDetails: "Hall B & Care Desk, 88 Oakridge Street",
    date: "Tue, Dec 1, 2026",
    time: "5:00 AM",
    dateTime: "Tue, Dec 1, 2026 · 5:00 AM",
    startAt: "2026-12-01T05:00",
    month: "december-2026",
    monthLabel: "December 2026",
    description:
      "Coordinate winter coat donations, hygiene kits, and community clinic referrals for underserved residents.",
    fullDescription:
      "A combined winter garment collection and community health outreach morning at Downtown Community Center. Volunteers log coat sizes, assemble cold-weather hygiene pouches, and connect guests with primary care clinic appointments.",
    organizer: "HopeNest Community Care",
    duration: "4 hours",
    spotsRemaining: 19,
    highlights: [
      "Men's, women's, and children's winter coats sorted by size",
      "On-site health screening referrals paired with warm clothing kits",
      "Drop-off bins open throughout the morning for donor contributions",
    ],
    whatToBring: [
      "Clean, gently used winter coats, scarves, or mittens to donate",
      "Volunteer enthusiasm and warm layers",
    ],
  },
  {
    id: "make-a-change-community-fundraiser",
    title: "Make a Change Community Micro-Grant Drive",
    category: "Other",
    homeBadgeLabel: "Fundraising",
    image: "/images/photo-1532629345422-7515f3d16bb6.webp",
    imageAlt:
      "Hands holding donated coins with a handwritten note reading Make a Change",
    imagePosition: "object-center",
    location: "Riverfront Civic Hall",
    addressDetails: "Main Mezzanine, 15 Harborfront Walk",
    date: "Sat, Dec 5, 2026",
    time: "10:00 AM",
    dateTime: "Sat, Dec 5, 2026 · 10:00 AM",
    startAt: "2026-12-05T10:00",
    month: "december-2026",
    monthLabel: "December 2026",
    description:
      "Pool grassroots neighborhood contributions to fund resident-led micro-grants, student tools, and emergency aid vouchers.",
    fullDescription:
      "Every small contribution multiplies when neighbors give together. Join community organizers at Riverfront Civic Hall for transparent micro-grant pitches from neighborhood leaders and help fund local tutoring corners, tool libraries, and crisis vouchers.",
    organizer: "HopeNest Grassroots Fund",
    duration: "3 hours",
    spotsRemaining: 40,
    highlights: [
      "Live pitches from 6 resident-led neighborhood project teams",
      "100% of pooled small-dollar donations matched up to local grant caps",
      "Open Q&A with transparent budget breakdowns",
    ],
    whatToBring: [
      "Friends or neighbors interested in local civic projects",
      "Optional coin jar or small pledge contribution",
    ],
  },
  {
    id: "cultural-heritage-preservation-night-walk",
    title: "Cultural Heritage & Climate Awareness Night Walk",
    category: "Other",
    homeBadgeLabel: "Awareness",
    image: "/images/photo-1552832230-c0197dd311b5.webp",
    imageAlt:
      "Warmly illuminated Colosseum at twilight hosting an evening heritage and climate awareness walk",
    imagePosition: "object-center",
    location: "Piazza del Colosseo, Rome",
    addressDetails: "Arch of Constantine Pedestrian Promenade",
    date: "Fri, Dec 11, 2026",
    time: "6:00 PM",
    dateTime: "Fri, Dec 11, 2026 · 6:00 PM",
    startAt: "2026-12-11T18:00",
    month: "december-2026",
    monthLabel: "December 2026",
    description:
      "Walk beneath twilight landmarks with heritage advocates discussing sustainable urban conservation and climate resilience.",
    fullDescription:
      "An illuminated evening community walk exploring how historic stone monuments and walkable civic plazas adapt to urban heat and climate shifts. Led by urban planners and local historians with interactive twilight listening stops.",
    organizer: "HopeNest Heritage & Climate Forum",
    duration: "2 hours",
    spotsRemaining: 35,
    highlights: [
      "Guided evening route across pedestrianized historic landmarks",
      "Expert commentary on climate resilience in heritage cities",
      "Family-friendly accessible walking pace",
    ],
    whatToBring: [
      "Comfortable walking shoes",
      "Light evening coat or scarf",
    ],
  },
  {
    id: "neighborhood-cardboard-recycling-cleanup",
    title: "Neighborhood Recycling & Waste Sorting Drive",
    category: "Cleanup",
    image: "/images/photo-1528323273322-d81458248d40.webp",
    imageAlt:
      "Three compacted bales of sorted recyclable cardboard stacked cleanly on wooden pallets",
    imagePosition: "object-center",
    location: "Eastside Civic Recycling Depot",
    addressDetails: "Bay 1, 74 Industrial Greenway",
    date: "Sun, Dec 13, 2026",
    time: "9:00 AM",
    dateTime: "Sun, Dec 13, 2026 · 9:00 AM",
    startAt: "2026-12-13T09:00",
    month: "december-2026",
    monthLabel: "December 2026",
    description:
      "Sort, flatten, and bundle community cardboard and dry recyclables for local circular material recovery.",
    fullDescription:
      "Holiday shipping creates tons of clean cardboard that often ends up contaminated in mixed trash. Join our sorting depot volunteers to break down boxes, remove tape/liners, and prepare palletized bales for direct mill recycling.",
    organizer: "HopeNest Circular Waste Initiative",
    duration: "3 hours",
    spotsRemaining: 16,
    highlights: [
      "High-volume cardboard flattening and clean bale preparation",
      "Household drop-off lane for sorted paper, glass, and aluminum",
      "Zero-waste sorting guide provided for first-time volunteers",
    ],
    whatToBring: [
      "Work gloves and sturdy closed-toe footwear",
      "Clean flattened cardboard bundles from home",
    ],
  },
  {
    id: "park-reforestation-volunteer-planting",
    title: "Community Park Tree Planting Day",
    category: "Plantation",
    image: "/images/pexels-photo-8543586.webp",
    imageAlt:
      "Volunteer wearing a blue shirt and gardening gloves planting a young tree sapling on green park grass",
    imagePosition: "object-[50%_20%]",
    location: "Meadowbrook Public Park",
    addressDetails: "East Lawn Pavilion, Meadowbrook Drive",
    date: "Sat, Dec 19, 2026",
    time: "8:30 AM",
    dateTime: "Sat, Dec 19, 2026 · 8:30 AM",
    startAt: "2026-12-19T08:30",
    month: "december-2026",
    monthLabel: "December 2026",
    description:
      "Join fellow volunteers in the park with gloves and spades to plant young shade trees across open green lawns.",
    fullDescription:
      "Bring the whole family outdoors to add 100 drought-tolerant shade trees along Meadowbrook Park's walking loop and children's play area. Tools, protective gloves, and celebratory warm cider are ready at the pavilion.",
    organizer: "HopeNest Park Stewards",
    duration: "3 hours",
    spotsRemaining: 28,
    highlights: [
      "100 young shade trees ready to plant across sunny park zones",
      "Beginner-friendly tool demo and team assignments",
      "Adopt-a-Tree plaque tagging for participating families",
    ],
    whatToBring: [
      "Comfortable outdoor clothes that can handle soil",
      "Refillable water bottle",
    ],
  },
  {
    id: "youth-school-supplies-donation",
    title: "Back-to-School Kits & Care Donation Drive",
    category: "Donation",
    image: "/images/photo-1488521787991-ed7bbaae773c.webp",
    imageAlt:
      "Smiling children sitting together on steps raising peace signs during a school support outreach",
    imagePosition: "object-[50%_20%]",
    location: "Sunrise Primary Learning Center",
    addressDetails: "Courtyard Hall, 19 Knowledge Lane",
    date: "Sat, Jan 9, 2027",
    time: "10:00 AM",
    dateTime: "Sat, Jan 9, 2027 · 10:00 AM",
    startAt: "2027-01-09T10:00",
    month: "january-2027",
    monthLabel: "January 2027",
    description:
      "Donate backpacks, notebooks, stationery kits, and storybooks to brighten the new school term for local children.",
    fullDescription:
      "Start the new academic term with every student equipped to succeed. Volunteers pack backpacks with notebooks, pencils, geometry sets, water flasks, and age-appropriate storybooks for 250 primary students.",
    organizer: "HopeNest Education Relief",
    duration: "3.5 hours",
    spotsRemaining: 21,
    highlights: [
      "250 complete student stationery and backpack kits assembled",
      "Reading corner book-swap table for local kids",
      "Encouragement notes written by community mentors",
    ],
    whatToBring: [
      "New notebooks, pens, or school backpacks (optional donation)",
      "A positive smile for welcome distribution",
    ],
  },
  {
    id: "neighborhood-potting-nursery-workshop",
    title: "Neighborhood Nursery & Soil Prep Workshop",
    category: "Plantation",
    image: "/images/photo3.webp",
    imageAlt:
      "Dark potting soil, perlite mix, green hand scoop, moss, and pruning shears arranged for nursery planting",
    imagePosition: "object-center",
    location: "Harborview Urban Greenhouse",
    addressDetails: "Glasshouse Studio 2, Dockyard Gardens",
    date: "Sun, Jan 17, 2027",
    time: "9:30 AM",
    dateTime: "Sun, Jan 17, 2027 · 9:30 AM",
    startAt: "2027-01-17T09:30",
    month: "january-2027",
    monthLabel: "January 2027",
    description:
      "Prepare rich composted soil mixes, prune starter planters, and pot resilient seedlings for spring street plantings.",
    fullDescription:
      "Learn practical urban nursery propagation inside Harborview Urban Greenhouse. Master gardeners teach aerated potting soil mixing, clean stem pruning, and moisture control so seedlings thrive until spring transplant day.",
    organizer: "HopeNest Seed & Soil Guild",
    duration: "2.5 hours",
    spotsRemaining: 15,
    highlights: [
      "Hands-on composting and well-draining potting mix formulation",
      "Each volunteer takes home a potted herb or native starter plant",
      "All scoops, pruning shears, ceramic pots, and organic soil provided",
    ],
    whatToBring: [
      "Apron or shirt suitable for potting soil",
      "Clean small containers if you want extra cuttings",
    ],
  },
  {
    id: "youth-swim-safety-aquatics-clinic",
    title: "Youth Swim Safety & Aquatics Clinic",
    category: "Other",
    image: "/images/photo-1530549387789-4c1017266635.webp",
    imageAlt:
      "Swimmer practicing butterfly stroke techniques between lane lines inside an aquatic training pool",
    imagePosition: "object-center",
    location: "Central Aquatic Training Pool",
    addressDetails: "Competition Pool Deck, 105 Sports Complex Rd",
    date: "Sat, Jan 23, 2027",
    time: "4:00 PM",
    dateTime: "Sat, Jan 23, 2027 · 4:00 PM",
    startAt: "2027-01-23T16:00",
    month: "january-2027",
    monthLabel: "January 2027",
    description:
      "Coach-led water safety sessions, stroke technique drills, and inclusive swim instruction for neighborhood youth.",
    fullDescription:
      "Certified lifeguards and community swim coaches host a free clinic focused on water confidence, breathing rhythm, rescue awareness, and foundational stroke skills for youth aged 8–17.",
    organizer: "HopeNest Community Athletics",
    duration: "2.5 hours",
    spotsRemaining: 20,
    highlights: [
      "Certified lifeguard supervision across beginner and intermediate lanes",
      "Free loaner goggles and kickboards at deck check-in",
      "Parent water-safety orientation included",
    ],
    whatToBring: [
      "Swimwear and towel",
      "Swim cap if required by facility rules",
    ],
  },
  {
    id: "community-art-creative-mural-workshop",
    title: "Community Art & Creative Painting Studio",
    category: "Other",
    image: "/images/photo-1513364776144-60967b0f800f.webp",
    imageAlt:
      "Artist paintbrushes loaded with vibrant red and yellow acrylic paint alongside colorful paint tubes",
    imagePosition: "object-center",
    location: "Oakwood Cultural Arts Studio",
    addressDetails: "Studio Loft 3A, 64 Artisan Way",
    date: "Sat, Jan 30, 2027",
    time: "2:00 PM",
    dateTime: "Sat, Jan 30, 2027 · 2:00 PM",
    startAt: "2027-01-30T14:00",
    month: "january-2027",
    monthLabel: "January 2027",
    description:
      "Gather with local artists for an open acrylic painting studio creating vibrant banners for neighborhood spaces.",
    fullDescription:
      "No prior art training needed! Local muralists guide community members of all ages through color mixing, bold brushwork, and collaborative canvas panels destined for local library and youth center hallways.",
    organizer: "HopeNest Arts & Culture Circle",
    duration: "3 hours",
    spotsRemaining: 25,
    highlights: [
      "All canvases, non-toxic acrylic paints, and brushes provided free",
      "Step-by-step color blending guidance from local teaching artists",
      "Finished community panels exhibited at Oakwood Public Library",
    ],
    whatToBring: [
      "Old shirt or painting apron you don't mind getting paint on",
      "Creative ideas to share with neighbors",
    ],
  },
];

// Preserves the existing Home Page carousel showcase card without inflating the 14-event catalog.
const homeMentalHealthAwarenessEvent: CommunityEvent = {
  id: "mental-health-awareness-walk",
  title: "Mental Health Awareness Walk",
  category: "Other",
  homeBadgeLabel: "Awareness",
  image: "/images/photo-1618477461853-cf6ed80faba5.webp",
  imageAlt:
    "Volunteers collaborating outdoors on the coastline during a community care and awareness event",
  imagePosition: "object-center",
  location: "Town Square",
  addressDetails: "Town Square North Promenade",
  date: "Wed, Nov 11, 2026",
  time: "5:00 AM",
  dateTime: "Wed, Nov 11, 2026 · 5:00 AM",
  startAt: "2026-11-11T05:00",
  month: "november-2026",
  monthLabel: "November 2026",
  description:
    "Join neighbors for an early-morning community walk promoting mental wellness resources and peer support.",
  fullDescription:
    "Start the morning alongside counselors, advocates, and neighbors to break stigma around mental wellness. The route winds cleanly from Town Square through green park paths with wellness resource booths at the finish line.",
  organizer: "HopeNest Wellness Circle",
  duration: "2 hours",
  spotsRemaining: 30,
  highlights: [
    "Guided community walk with peer support ambassadors",
    "Free local counseling and helpline resource directory",
    "Warm refreshments after the walk",
  ],
  whatToBring: [
    "Comfortable walking sneakers",
    "Light layered jacket",
  ],
};

function requireCatalogEvent(id: string): CommunityEvent {
  const match = events.find((item) => item.id === id);
  if (!match) {
    throw new Error(`Missing featured catalog event: ${id}`);
  }
  return match;
}

export const upcomingEvents: readonly CommunityEvent[] = [
  requireCatalogEvent("winter-blanket-warm-clothes-distribution"),
  requireCatalogEvent("winter-clothes-drive"),
  homeMentalHealthAwarenessEvent,
  requireCatalogEvent("fresh-produce-food-box-distribution"),
  requireCatalogEvent("make-a-change-community-fundraiser"),
  requireCatalogEvent("cultural-heritage-preservation-night-walk"),
];

export function getAllEvents(): readonly CommunityEvent[] {
  return events;
}

export function getEventMonths(
  eventList: readonly CommunityEvent[] = events,
): EventMonthOption[] {
  const seen = new Map<string, string>();
  for (const item of eventList) {
    if (!seen.has(item.month)) {
      seen.set(item.month, item.monthLabel);
    }
  }
  return Array.from(seen.entries()).map(([value, label]) => ({ value, label }));
}

export function getEventLocations(
  eventList: readonly CommunityEvent[] = events,
): string[] {
  const seen = new Set<string>();
  for (const item of eventList) {
    if (item.location.trim()) {
      seen.add(item.location.trim());
    }
  }
  return Array.from(seen).sort((a, b) => a.localeCompare(b));
}

export function getCategoryCounts(
  eventList: readonly CommunityEvent[] = events,
): EventCategoryOption[] {
  const counts: Record<EventCategory, number> = {
    Cleanup: 0,
    Donation: 0,
    Plantation: 0,
    Other: 0,
  };

  for (const item of eventList) {
    counts[item.category] += 1;
  }

  return [
    { category: "All", label: "All", count: eventList.length },
    { category: "Cleanup", label: "Cleanup", count: counts.Cleanup },
    { category: "Donation", label: "Donation", count: counts.Donation },
    { category: "Plantation", label: "Plantation", count: counts.Plantation },
    { category: "Other", label: "Other", count: counts.Other },
  ];
}

export function filterEvents(
  category: EventFilterCategory,
  month: string,
  eventList: readonly CommunityEvent[] = events,
  searchQuery = "",
  sortOrder: EventSortOrder = DEFAULT_SORT_ORDER,
  locationQuery = "",
): CommunityEvent[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const normalizedLocation = locationQuery.trim().toLowerCase();

  const filtered = eventList.filter((item) => {
    const matchesCategory = category === "All" || item.category === category;
    const matchesMonth = month === ALL_MONTHS_VALUE || item.month === month;
    if (!matchesCategory || !matchesMonth) {
      return false;
    }

    if (normalizedLocation) {
      const matchesLoc =
        item.location.toLowerCase().includes(normalizedLocation) ||
        item.addressDetails.toLowerCase().includes(normalizedLocation);
      if (!matchesLoc) {
        return false;
      }
    }

    if (!normalizedQuery) {
      return true;
    }

    return [
      item.title,
      item.location,
      item.addressDetails,
      item.description,
      item.category,
      item.monthLabel,
    ].some((field) => field.toLowerCase().includes(normalizedQuery));
  });

  return [...filtered].sort((a, b) =>
    sortOrder === "oldest"
      ? a.startAt.localeCompare(b.startAt)
      : b.startAt.localeCompare(a.startAt),
  );
}

export function normalizeCategoryParam(
  rawCategory?: string | string[],
  rawLegacyType?: string | string[],
): EventFilterCategory {
  const categoryValue = Array.isArray(rawCategory)
    ? rawCategory[0]
    : rawCategory;
  if (categoryValue) {
    const lower = categoryValue.trim().toLowerCase();
    const matched = EVENT_CATEGORIES.find(
      (cat) => cat.toLowerCase() === lower,
    );
    if (matched) return matched;
  }

  const legacyValue = Array.isArray(rawLegacyType)
    ? rawLegacyType[0]
    : rawLegacyType;
  if (legacyValue) {
    const lower = legacyValue.trim().toLowerCase();
    if (lower.includes("relief") || lower.includes("food") || lower.includes("donation")) {
      return "Donation";
    }
    if (lower.includes("environment") || lower.includes("plant")) {
      return "Plantation";
    }
    if (lower.includes("clean")) {
      return "Cleanup";
    }
    if (
      lower.includes("outreach") ||
      lower.includes("youth") ||
      lower.includes("health") ||
      lower.includes("other")
    ) {
      return "Other";
    }
  }

  return "All";
}

export function normalizeMonthParam(
  rawMonth?: string | string[],
  months: readonly EventMonthOption[] = getEventMonths(),
): string {
  const value = Array.isArray(rawMonth) ? rawMonth[0] : rawMonth;
  if (!value) return ALL_MONTHS_VALUE;

  const lower = value.trim().toLowerCase();
  if (lower === ALL_MONTHS_VALUE || lower === "all-months") {
    return ALL_MONTHS_VALUE;
  }

  const matched = months.find(
    (option) =>
      option.value.toLowerCase() === lower ||
      option.label.toLowerCase() === lower,
  );
  return matched ? matched.value : ALL_MONTHS_VALUE;
}

export function normalizeSortParam(
  rawSort?: string | string[],
): EventSortOrder {
  const value = Array.isArray(rawSort) ? rawSort[0] : rawSort;
  if (value && value.trim().toLowerCase() === "oldest") {
    return "oldest";
  }
  return DEFAULT_SORT_ORDER;
}

export function normalizeSearchParam(rawQuery?: string | string[]): string {
  const value = Array.isArray(rawQuery) ? rawQuery[0] : rawQuery;
  return value ? value.trim() : "";
}

export function normalizeLocationParam(
  rawLocation?: string | string[],
): string {
  const value = Array.isArray(rawLocation) ? rawLocation[0] : rawLocation;
  if (!value) return "";
  const trimmed = value.trim();
  const lower = trimmed.toLowerCase();
  if (!trimmed || lower === "all" || lower === "all locations") {
    return "";
  }
  return trimmed;
}

export function buildEventsQueryUrl(
  category: EventFilterCategory,
  month: string,
  searchQuery = "",
  sortOrder: EventSortOrder = DEFAULT_SORT_ORDER,
  locationQuery = "",
): string {
  const params = new URLSearchParams();
  if (category !== "All") {
    params.set("category", category.toLowerCase());
  }
  if (month && month !== ALL_MONTHS_VALUE) {
    params.set("month", month);
  }
  const trimmedSearch = searchQuery.trim();
  if (trimmedSearch) {
    params.set("q", trimmedSearch);
  }
  const trimmedLocation = locationQuery.trim();
  if (trimmedLocation) {
    params.set("location", trimmedLocation);
  }
  if (sortOrder !== DEFAULT_SORT_ORDER) {
    params.set("sort", sortOrder);
  }
  const query = params.toString();
  return query ? `/events?${query}` : "/events";
}

export function getEventById(id: string): CommunityEvent | undefined {
  const catalogMatch = events.find((item) => item.id === id);
  if (catalogMatch) return catalogMatch;
  return upcomingEvents.find((item) => item.id === id);
}

export function getAllEventDetailIds(): string[] {
  const ids = new Set<string>();
  for (const item of events) ids.add(item.id);
  for (const item of upcomingEvents) ids.add(item.id);
  return Array.from(ids);
}

export function getRelatedEvents(
  currentEvent: CommunityEvent,
  limit = 3,
): CommunityEvent[] {
  const sameCategory = events.filter(
    (item) =>
      item.id !== currentEvent.id && item.category === currentEvent.category,
  );
  const others = events.filter(
    (item) =>
      item.id !== currentEvent.id && item.category !== currentEvent.category,
  );
  return [...sameCategory, ...others].slice(0, limit);
}
