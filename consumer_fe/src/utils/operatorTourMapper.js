import { GHANA_TOURIST_CITIES } from "../data/ghanaRegions";
import {
  COUNTRY_OPTIONS,
  createEmptyTourListing,
  extractPackageLineId,
  formatTourPriceLabel,
  isGhanaPackageLineId,
  TOUR_CURRENCY,
} from "./operatorTourConstants";
import { normalizeTourImages, resolveImageForApiPayload } from "./tourImageUtils";

const POPULAR_GHANA_CITIES = [
  "Accra",
  "Cape Coast",
  "Kumasi",
  "Tamale",
  "Takoradi",
  "Ho",
  "Bolgatanga",
  "Elmina",
  "Kakum",
  "Ada Foah",
];

export const GHANA_CITY_SUGGESTIONS = [
  ...new Set([
    ...POPULAR_GHANA_CITIES,
    ...Object.values(GHANA_TOURIST_CITIES).flat(),
  ]),
].sort((a, b) => a.localeCompare(b));

export function formatDepartureDateLabel(dateStr) {
  if (!dateStr) return "";
  const date = new Date(`${dateStr}T12:00:00`);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function resolveCountryOption(countryCode, countryName) {
  const byDial = COUNTRY_OPTIONS.find((c) => c.dialCode === String(countryCode || ""));
  if (byDial) return byDial;

  const byId = COUNTRY_OPTIONS.find(
    (c) => c.id === String(countryCode || "").toLowerCase() || c.country === countryName
  );
  if (byId) return byId;

  return COUNTRY_OPTIONS[0];
}

export function mapOperatorTour(raw) {
  if (!raw) return null;

  const country = resolveCountryOption(raw.countryCode, raw.country);
  const locations = Array.isArray(raw.locations)
    ? raw.locations.filter(Boolean)
    : raw.location
      ? [raw.location]
      : [];

  const galleryUrls = raw.galleryImageUrls || raw.featureImageUrls || [];
  const featureImages = galleryUrls.map((url, index) => ({
    uri: url,
    data: "",
    mimeType: "image/jpeg",
    id: `gallery-${index}`,
  }));

  const coverUrl = raw.coverImageUrl || raw.coverImage?.uri || "";
  const departureDates = raw.departureDates?.length
    ? raw.departureDates
    : [{ date: "", dateLabel: "", spotsTotal: 18, label: "Next departure" }];
  const allocatedSlots = getAllocatedDepartureSlots(departureDates);
  const totalSlots = Number(raw.totalSlots) || allocatedSlots || raw.groupSizeMax || 18;

  return normalizeTourImages({
    slug: raw.slug || "",
    name: raw.name || "",
    locations,
    country: raw.country || country.country,
    countryId: country.id,
    countryCode: country.dialCode,
    categories: raw.categories || [],
    packageLineId: extractPackageLineId(raw.categories || []),
    status: raw.status || "draft",
    featured: Boolean(raw.featured),
    durationDays: raw.durationDays ?? 1,
    durationLabel: raw.durationLabel || `${raw.durationDays ?? 1} days`,
    groupSizeMin: raw.groupSizeMin ?? 2,
    groupSizeMax: raw.groupSizeMax ?? 20,
    priceAmount: raw.priceAmount ?? 0,
    priceCurrency: raw.priceCurrency || TOUR_CURRENCY.code,
    priceLabel: raw.priceLabel || "",
    rating: raw.rating ?? 0,
    reviewCount: raw.reviewCount ?? 0,
    badge: raw.badge || "",
    badgeVariant: raw.badgeVariant || "orange",
    coverImage: { uri: coverUrl, data: "", mimeType: "image/jpeg" },
    coverImageUrl: coverUrl,
    featureImages,
    galleryImageUrls: galleryUrls,
    description: raw.description || "",
    highlights: raw.highlights?.length ? raw.highlights : [""],
    itinerary: raw.itinerary?.length
      ? raw.itinerary
      : [{ day: 1, title: "", description: "" }],
    included: raw.included?.length ? raw.included : [""],
    notIncluded: raw.notIncluded?.length ? raw.notIncluded : [""],
    totalSlots,
    departureDates,
    bookingSettings: {
      depositPercent: raw.bookingSettings?.depositPercent ?? 30,
      payOnSiteAllowed: raw.bookingSettings?.payOnSiteAllowed ?? true,
      onlinePaymentAllowed: raw.bookingSettings?.onlinePaymentAllowed ?? true,
      maxGroupSize: raw.bookingSettings?.maxGroupSize ?? 200,
      minGroupSize: raw.bookingSettings?.minGroupSize ?? 2,
    },
    operatorSlug: raw.operatorSlug || "",
    createdAt: raw.createdAt || "",
    updatedAt: raw.updatedAt || "",
  });
}

export function mapOperatorTourList(data) {
  if (Array.isArray(data)) {
    return { items: data.map(mapOperatorTour).filter(Boolean), pagination: null };
  }

  const items = (data?.items || []).map(mapOperatorTour).filter(Boolean);
  return { items, pagination: data?.pagination ?? null };
}

export function buildLocationsLabel(locations) {
  return (locations || []).filter(Boolean).join(" · ");
}

export function getAllocatedDepartureSlots(departureDates) {
  return (departureDates || [])
    .filter((d) => d.date)
    .reduce((sum, d) => sum + Math.max(0, Number(d.spotsTotal) || 0), 0);
}

export function getRemainingDepartureSlots(totalSlots, departureDates) {
  const total = Math.max(0, Number(totalSlots) || 0);
  return Math.max(0, total - getAllocatedDepartureSlots(departureDates));
}

export function validateTourSlotAllocation(form) {
  const total = Math.max(0, Number(form.totalSlots) || 0);
  if (total < 1) return "Set total tour slots to at least 1.";

  const datedDepartures = (form.departureDates || []).filter((d) => d.date);
  if (!datedDepartures.length) return "Add at least one departure date.";

  const allocated = getAllocatedDepartureSlots(form.departureDates);
  if (allocated !== total) {
    return `Departure slots must add up to ${total}. You have allocated ${allocated}.`;
  }

  return "";
}

export function buildCreateTourPayload(form) {
  return buildTourPayload(form, { isUpdate: false });
}

export function buildTourPayload(form, { isUpdate = false } = {}) {
  const country = COUNTRY_OPTIONS.find((c) => c.id === form.countryId) || COUNTRY_OPTIONS[0];
  const locations = (form.locations || []).map((l) => String(l).trim()).filter(Boolean);
  const themeCategories = (form.categories || []).filter(
    (c) => !COUNTRY_OPTIONS.some((o) => o.id === c) && !isGhanaPackageLineId(c),
  );
  const categories = [country.id];
  if (country.id === "ghana" && form.packageLineId) {
    categories.push(form.packageLineId);
  }
  categories.push(...themeCategories);
  const uniqueCategories = [...new Set(categories)];

  const galleryFallbacks = form.galleryImageUrls || [];
  const featureImages = (form.featureImages || []).filter((img) => img?.uri || img?.data);
  const coverImageUrl = resolveImageForApiPayload(form.coverImage, form.coverImageUrl || "");
  const galleryImageUrls = featureImages
    .map((img, index) => resolveImageForApiPayload(img, galleryFallbacks[index] || img?.uri || ""))
    .filter(Boolean);

  const departureDates = (form.departureDates || [])
    .filter((d) => d.date)
    .map((d, index) => {
      const spotsTotal = Number(d.spotsTotal) || 0;
      const spotsLeft = isUpdate && d.spotsLeft != null
        ? Math.min(Number(d.spotsLeft) || 0, spotsTotal)
        : spotsTotal;

      return {
        date: d.date,
        dateLabel: d.dateLabel || formatDepartureDateLabel(d.date),
        spotsTotal,
        spotsLeft,
        label: d.label || (index === 0 ? "Next departure" : "Available"),
      };
    });

  const totalSlots = Math.max(1, Number(form.totalSlots) || getAllocatedDepartureSlots(form.departureDates) || 1);
  const durationDays = Number(form.durationDays) || 1;
  const priceAmount = Number(form.priceAmount) || 0;
  const groupSizeMin = 1;
  const groupSizeMax = totalSlots;

  return {
    name: form.name.trim(),
    locations,
    country: country.country,
    countryCode: country.dialCode,
    categories: uniqueCategories,
    status: form.status || "draft",
    featured: Boolean(form.featured),
    durationDays,
    durationLabel: form.durationLabel || `${durationDays} days`,
    groupSizeMin,
    groupSizeMax,
    priceAmount,
    priceCurrency: form.priceCurrency || TOUR_CURRENCY.code,
    priceLabel: form.priceLabel || formatTourPriceLabel(priceAmount),
    rating: Number(form.rating) || 0,
    reviewCount: Number(form.reviewCount) || 0,
    badge: form.badge || "",
    badgeVariant: form.badgeVariant || "orange",
    coverImageUrl,
    galleryImageUrls,
    description: form.description.trim(),
    highlights: (form.highlights || []).map((h) => h.trim()).filter(Boolean),
    itinerary: (form.itinerary || [])
      .filter((d) => d.title?.trim() || d.description?.trim())
      .map((d) => ({
        day: Number(d.day) || 1,
        title: d.title.trim(),
        description: d.description.trim(),
      })),
    included: (form.included || []).map((i) => i.trim()).filter(Boolean),
    notIncluded: (form.notIncluded || []).map((i) => i.trim()).filter(Boolean),
    departureDates,
    bookingSettings: {
      depositPercent: Number(form.bookingSettings?.depositPercent) || 0,
      payOnSiteAllowed: Boolean(form.bookingSettings?.payOnSiteAllowed),
      onlinePaymentAllowed: Boolean(form.bookingSettings?.onlinePaymentAllowed),
      maxGroupSize: Number(form.bookingSettings?.maxGroupSize) || groupSizeMax,
      minGroupSize: Number(form.bookingSettings?.minGroupSize) || 1,
    },
  };
}

export function mapOperatorTourToForm(tour) {
  return mapOperatorTour(tour) || createEmptyTourListing();
}
