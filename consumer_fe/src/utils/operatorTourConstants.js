export const TOUR_CATEGORY_OPTIONS = [
  { id: "heritage", label: "Heritage", description: "Historic sites, monuments, and UNESCO landmarks." },
  { id: "cultural", label: "Cultural", description: "Festivals, crafts, cuisine, and living traditions." },
  { id: "safari", label: "Safari", description: "Wildlife parks, game drives, and nature reserves." },
  { id: "adventure", label: "Adventure", description: "Hiking, canopy walks, and active exploration." },
  { id: "beach", label: "Beach", description: "Coastal escapes, resorts, and water activities." },
  { id: "group", label: "Groups", description: "Shared departures ideal for families and teams." },
];

export const GHANA_PACKAGE_LINE_OPTIONS = [
  {
    id: "accra",
    label: "Accra",
    icon: "🏙️",
    tagline: "Arts & city culture",
    description: "Markets, crafts, and vibrant capital experiences — Arts Centre, Aburi, and more.",
    photoHints: {
      cover: "Arts Centre, Aburi Arts market, or craft stalls in Accra.",
      gallery: "Artisans at work, market scenes, city culture, and coastal day trips.",
    },
  },
  {
    id: "kumasi",
    label: "Kumasi",
    icon: "👑",
    tagline: "Ashanti heritage",
    description: "Royal history, kente weaving, and the cultural heart of the Ashanti Kingdom.",
    photoHints: {
      cover: "Manhyia Palace or kente weaving at Bonwire.",
      gallery: "Palace grounds, craft villages, traditional ceremonies, and Ashanti landmarks.",
    },
  },
  {
    id: "volta",
    label: "Volta",
    icon: "⛰️",
    tagline: "Mountains & waterfalls",
    description: "Highland treks, Wli Falls, and nature-forward journeys in Ghana's Volta Region.",
    photoHints: {
      cover: "Wli Falls, Volta mountains, or waterfall hiking trails.",
      gallery: "Forest canopy, mountain vistas, village stops, and outdoor adventure.",
    },
  },
  {
    id: "end-of-year",
    label: "End of Year",
    icon: "🎉",
    tagline: "Detty December",
    description: "Festival season energy — concerts, Afrochella vibes, and December celebrations.",
    photoHints: {
      cover: "Detty December crowds, festival stage, or December nightlife in Accra.",
      gallery: "Concerts, street parties, festival fashion, and celebratory group moments.",
    },
  },
];

export const GHANA_PACKAGE_LINE_IDS = GHANA_PACKAGE_LINE_OPTIONS.map((option) => option.id);

export function isGhanaPackageLineId(id) {
  return GHANA_PACKAGE_LINE_IDS.includes(id);
}

export function getGhanaPackageLineOption(id) {
  return GHANA_PACKAGE_LINE_OPTIONS.find((option) => option.id === id) || null;
}

export function extractPackageLineId(categories = []) {
  return (categories || []).find(isGhanaPackageLineId) || "";
}

export function getPackageLinePhotoHints(packageLineId) {
  return getGhanaPackageLineOption(packageLineId)?.photoHints || null;
}

export function formatTourCategoryLabel(categoryId) {
  const packageLine = getGhanaPackageLineOption(categoryId);
  if (packageLine) return packageLine.label;

  const theme = TOUR_CATEGORY_OPTIONS.find((option) => option.id === categoryId);
  if (theme) return theme.label;

  return String(categoryId || "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export const COUNTRY_OPTIONS = [
  { id: "ghana", label: "Ghana", country: "Ghana", dialCode: "233" },
  { id: "kenya", label: "Kenya", country: "Kenya", dialCode: "254" },
  { id: "southafrica", label: "South Africa", country: "South Africa", dialCode: "27" },
];

export const BADGE_VARIANTS = [
  { id: "orange", label: "Orange" },
  { id: "gold", label: "Gold" },
  { id: "green", label: "Green" },
];

export const TOUR_CURRENCY = {
  code: "GHS",
  label: "Ghana Cedis",
  symbol: "GH₵",
};

export const TOUR_CURRENCY_OPTIONS = [TOUR_CURRENCY];

export function formatTourPriceLabel(amount) {
  return `From ${TOUR_CURRENCY.symbol}${Number(amount || 0).toLocaleString()}`;
}

export function createEmptyTourListing() {
  return {
    name: "",
    locations: [],
    country: "Ghana",
    countryId: "ghana",
    countryCode: "233",
    packageLineId: "",
    categories: ["ghana", "heritage", "cultural"],
    status: "draft",
    featured: false,
    durationDays: 10,
    durationLabel: "10 days",
    groupSizeMin: 1,
    groupSizeMax: 18,
    priceAmount: 1850,
    priceCurrency: "GHS",
    priceLabel: "From GH₵1,850",
    totalSlots: 18,
    rating: 5,
    reviewCount: 0,
    badge: "",
    badgeVariant: "orange",
    coverImage: { uri: "", data: "", mimeType: "image/jpeg" },
    coverImageUrl: "",
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
      { date: "", dateLabel: "", spotsTotal: 18, label: "" },
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
