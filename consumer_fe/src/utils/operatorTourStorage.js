import { buildGhanaLocationLabel } from "../data/ghanaRegions";
import { getImagePreviewSrc, MAX_FEATURE_IMAGES, normalizeTourImages, toApiImagePayload } from "./tourImageUtils";

const STORAGE_KEY = "afriqwest_operator_tours";

function generateId() {
  return `tour_${Date.now().toString(36)}`;
}

export function getOperatorTours() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const tours = raw ? JSON.parse(raw) : [];
    return tours.map(normalizeTourListing);
  } catch {
    return [];
  }
}

function saveAll(tours) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tours));
  window.dispatchEvent(new CustomEvent("afriqwest:operator-tours-updated"));
}

export function getOperatorTourById(id) {
  const tour = getOperatorTours().find((t) => t.id === id) ?? null;
  return tour ? normalizeTourListing(tour) : null;
}

export function normalizeTourListing(tour) {
  const normalized = normalizeTourImages(tour);
  const isGhana = normalized.countryCode === "ghana";

  if (isGhana && normalized.region) {
    const derivedLocation = buildGhanaLocationLabel(normalized);
    if (derivedLocation) {
      normalized.location = derivedLocation;
    }
  }

  return {
    ...normalized,
    region: normalized.region || "",
    city: normalized.city || "",
    cityIsCustom: Boolean(normalized.cityIsCustom),
    customCity: normalized.customCity || "",
    shortDescription: normalized.shortDescription || "",
    totalSlots: normalized.slotsInfinite ? null : Number(normalized.totalSlots) || 18,
    slotsInfinite: Boolean(normalized.slotsInfinite),
  };
}

export function buildTourApiPayload(tour) {
  const normalized = normalizeTourListing(tour);
  const {
    slug: _slug,
    slugTouched: _slugTouched,
    galleryImages: _legacyGallery,
    galleryImageUrls: _legacyGalleryUrls,
    ...rest
  } = normalized;

  const featureImages = (normalized.featureImages || [])
    .filter((img) => img?.uri || img?.data)
    .slice(0, MAX_FEATURE_IMAGES)
    .map(toApiImagePayload);

  return {
    ...rest,
    coverImage: toApiImagePayload(normalized.coverImage),
    featureImages,
    coverImageUrl: getImagePreviewSrc(normalized.coverImage),
    featureImageUrls: (normalized.featureImages || []).map(getImagePreviewSrc).filter(Boolean),
  };
}

export function saveOperatorTour(tour) {
  const payload = buildTourApiPayload(tour);
  const record = {
    ...payload,
    ...(tour.slug ? { slug: tour.slug } : {}),
    id: tour.id || generateId(),
    updatedAt: new Date().toISOString(),
    createdAt: tour.createdAt || new Date().toISOString(),
  };
  const existing = getOperatorTours();
  const updated = [record, ...existing.filter((t) => t.id !== record.id)];
  saveAll(updated);
  return record;
}

export function deleteOperatorTour(id) {
  const updated = getOperatorTours().filter((t) => t.id !== id);
  saveAll(updated);
}

export const TOUR_CATEGORY_OPTIONS = [
  { id: "heritage", label: "Heritage", description: "Historic sites, monuments, and UNESCO landmarks." },
  { id: "cultural", label: "Cultural", description: "Festivals, crafts, cuisine, and living traditions." },
  { id: "safari", label: "Safari", description: "Wildlife parks, game drives, and nature reserves." },
  { id: "adventure", label: "Adventure", description: "Hiking, canopy walks, and active exploration." },
  { id: "beach", label: "Beach", description: "Coastal escapes, resorts, and water activities." },
  { id: "group", label: "Groups", description: "Shared departures ideal for families and teams." },
];

export const COUNTRY_OPTIONS = [
  { code: "ghana", label: "Ghana", country: "Ghana" },
  { code: "kenya", label: "Kenya", country: "Kenya" },
  { code: "southafrica", label: "South Africa", country: "South Africa" },
];

export const BADGE_VARIANTS = [
  { id: "orange", label: "Orange" },
  { id: "gold", label: "Gold" },
  { id: "green", label: "Green" },
];

export function createEmptyTourListing() {
  return {
    name: "",
    location: "",
    region: "",
    city: "",
    cityIsCustom: false,
    customCity: "",
    shortDescription: "",
    totalSlots: 18,
    slotsInfinite: false,
    country: "Ghana",
    countryCode: "ghana",
    categories: ["ghana", "heritage", "cultural"],
    status: "draft",
    featured: false,
    durationDays: 10,
    durationLabel: "10 days",
    groupSizeMin: 12,
    groupSizeMax: 20,
    groupSizeLabel: "12–20 pax",
    priceAmount: 1850,
    priceCurrency: "USD",
    priceLabel: "From $1,850",
    rating: 5,
    reviewCount: 0,
    badge: "",
    badgeVariant: "orange",
    coverImage: { uri: "", data: "", mimeType: "image/jpeg" },
    featureImages: [],
    description: "",
    highlights: ["", "", "", ""],
    itinerary: [
      { day: 1, title: "Welcome & orientation", description: "Arrival, briefing, and welcome dinner with your guide." },
      { day: 2, title: "Heritage exploration", description: "Guided visit to key cultural and historic sites." },
    ],
    included: [
      "Airport transfers on arrival & departure",
      "All accommodation (3–4 star hotels & lodges)",
      "Daily breakfast and selected meals",
      "Licensed local guide throughout",
    ],
    notIncluded: [
      "International flights",
      "Travel insurance (strongly recommended)",
      "Personal expenses & souvenirs",
    ],
    departureDates: [
      { date: "", dateLabel: "", spotsTotal: 18, spotsLeft: 10, label: "Next departure" },
    ],
    bookingSettings: {
      depositPercent: 30,
      payOnSiteAllowed: true,
      onlinePaymentAllowed: true,
      maxGroupSize: 200,
      minGroupSize: 2,
    },
  };
}

export function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
