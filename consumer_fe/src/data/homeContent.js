import { images } from "../config/images";
import { ROUTES } from "../constants/routes";

export const heroContent = {
  badge: "2025 African Cultural Travel Series",
  title: "Travel Africa with purpose, culture, and care",
  subtitle:
    "From Ghana's historic Cape Coast Castles, to Kenya's majestic safaris, and South Africa's vibrant cities, we are reimagining what it means to experience Africa authentically.",
  primaryCta: { label: "Explore 2025 tours", to: ROUTES.tours },
  secondaryCta: { label: "Request a group quote", to: ROUTES.contact },
};

export const stats = [
  { value: "10+", label: "Years of expertise" },
  { value: "3", label: "Countries served" },
  { value: "3", label: "Signature 2025 tours" },
  { value: "100%", label: "Curated experiences" },
];

export const featuredTours = [
  {
    slug: "ghana-heritage-2025",
    name: "Ghana Heritage Tour",
    country: "Ghana",
    duration: "10 days",
    description:
      "Accra, Cape Coast Castle, Kumasi, and living culture — a deep dive into West Africa's history and hospitality.",
    priceLabel: "From $1,850",
    rating: "5.0",
    image: images.home.ghana,
  },
  {
    slug: "kenya-safari-culture-2025",
    name: "Kenya Safari & Culture",
    country: "Kenya",
    duration: "9 days",
    description:
      "Maasai Mara wildlife, cultural encounters, and landscapes that define the soul of East Africa.",
    priceLabel: "From $2,200",
    rating: "4.9",
    image: images.home.kenya,
  },
  {
    slug: "south-africa-discovery-2025",
    name: "South Africa Discovery",
    country: "South Africa",
    duration: "8 days",
    description:
      "Cape Town, Johannesburg, and curated experiences across one of Africa's most dynamic regions.",
    priceLabel: "From $1,950",
    rating: "4.9",
    image: images.home.southAfrica,
  },
];

export const upcomingTours = [
  {
    slug: "ghana-heritage-classic",
    name: "Ghana Heritage Tour",
    country: "Ghana",
    departDate: "June 14, 2025",
    departDay: "14",
    departMonth: "Jun",
    duration: "10 days",
    priceLabel: "From $1,850",
    spotsLeft: 4,
    totalSpots: 18,
    image: images.home.destinations.ghana,
  },
  {
    slug: "ghana-cultural-immersion",
    name: "Ghana Cultural Immersion",
    country: "Ghana",
    departDate: "September 10, 2025",
    departDay: "10",
    departMonth: "Sep",
    duration: "10 days",
    priceLabel: "From $1,850",
    spotsLeft: 7,
    totalSpots: 18,
    image: images.home.ghana,
  },
  {
    slug: "kenya-safari-culture",
    name: "Kenya Safari & Culture",
    country: "Kenya",
    departDate: "July 3, 2025",
    departDay: "03",
    departMonth: "Jul",
    duration: "9 days",
    priceLabel: "From $2,200",
    spotsLeft: 2,
    totalSpots: 14,
    image: images.home.destinations.kenya,
  },
  {
    slug: "maasai-mara-experience",
    name: "Kenya Maasai Mara Experience",
    country: "Kenya",
    departDate: "August 5, 2025",
    departDay: "05",
    departMonth: "Aug",
    duration: "9 days",
    priceLabel: "From $2,200",
    spotsLeft: 5,
    totalSpots: 14,
    image: images.home.kenya,
  },
  {
    slug: "ghana-year-end-heritage",
    name: "Ghana Year-End Heritage",
    country: "Ghana",
    departDate: "December 5, 2025",
    departDay: "05",
    departMonth: "Dec",
    duration: "10 days",
    priceLabel: "From $1,850",
    spotsLeft: 6,
    totalSpots: 18,
    image: images.home.ghana,
  },
  {
    slug: "kenya-autumn-safari",
    name: "Kenya Autumn Safari",
    country: "Kenya",
    departDate: "September 22, 2025",
    departDay: "22",
    departMonth: "Sep",
    duration: "9 days",
    priceLabel: "From $2,200",
    spotsLeft: 4,
    totalSpots: 14,
    image: images.home.kenya,
  },
  {
    slug: "south-africa-discovery",
    name: "South Africa Discovery",
    country: "South Africa",
    departDate: "October 18, 2025",
    departDay: "18",
    departMonth: "Oct",
    duration: "8 days",
    priceLabel: "From $1,950",
    spotsLeft: 6,
    totalSpots: 15,
    image: images.home.destinations.southAfrica,
  },
  {
    slug: "cape-town-johannesburg",
    name: "Cape Town & Johannesburg",
    country: "South Africa",
    departDate: "November 12, 2025",
    departDay: "12",
    departMonth: "Nov",
    duration: "8 days",
    priceLabel: "From $1,950",
    spotsLeft: 9,
    totalSpots: 15,
    image: images.home.southAfrica,
  },
];

export const topDestinations = [
  {
    slug: "ghana-heritage-2025",
    name: "Ghana",
    region: "Heritage Coast",
    tagline: "Cape Coast Castles, Kumasi & living culture",
    tours: "12 tours",
    image: images.home.destinations.ghana,
  },
  {
    slug: "kenya-safari-culture-2025",
    name: "Kenya",
    region: "Safari & Savanna",
    tagline: "Maasai Mara, wildlife & cultural encounters",
    tours: "9 tours",
    image: images.home.destinations.kenya,
  },
  {
    slug: "south-africa-discovery-2025",
    name: "South Africa",
    region: "Vibrant Cities",
    tagline: "Cape Town, Johannesburg & dynamic regions",
    tours: "8 tours",
    image: images.home.destinations.southAfrica,
  },
];

export const operatingHubs = [
  {
    name: "Ghana",
    filterId: "ghana",
    region: "West Africa",
    tagline: "Heritage Coast",
    desc: "Cape Coast Castle, Kumasi, Accra — immerse in the history and spirit of West Africa.",
    image: images.home.ghana,
    badge: "bg-brand-gold/20 text-brand-gold",
  },
  {
    name: "Kenya",
    filterId: "kenya",
    region: "East Africa",
    tagline: "Safari & Savanna",
    desc: "Maasai Mara wildlife, cultural encounters, and breathtaking landscapes across East Africa.",
    image: images.home.kenya,
    badge: "bg-brand-orange/15 text-brand-orange",
  },
  {
    name: "South Africa",
    filterId: "southafrica",
    region: "Southern Africa",
    tagline: "Vibrant Cities",
    desc: "Table Mountain, Johannesburg townships, and Cape Town's vibrant urban culture.",
    image: images.home.southAfrica,
    badge: "bg-brand-green/15 text-brand-green",
  },
];

export const features = [
  {
    title: "Authentic cultural immersion",
    description:
      "Markets, artisans, traditional ceremonies, and cuisine — experiences designed to connect, not just observe.",
  },
  {
    title: "Trusted local partnerships",
    description:
      "Deep local networks across Ghana, Kenya, and South Africa for safe, seamless travel.",
  },
  {
    title: "Groups & institutions welcome",
    description:
      "Tailored programs for universities, corporate retreats, and community impact tours.",
  },
];

export const testimonials = [
  {
    quote:
      "AfriQwest did not just plan a trip — they opened a classroom without walls. Our students returned transformed.",
    name: "Dr. Amara Williams",
    role: "University program coordinator, USA",
    rating: "5.0",
    tour: "Ghana Heritage",
    initials: "AW",
  },
  {
    quote:
      "Every day felt intentional — from the Maasai village visit to the sunrise game drive. Flawless logistics, genuine warmth.",
    name: "James Okonkwo",
    role: "Corporate retreat lead, UK",
    rating: "4.9",
    tour: "Kenya Safari",
    initials: "JO",
  },
  {
    quote:
      "Cape Town to Johannesburg with zero stress. AfriQwest handled culture, comfort, and safety better than any operator we've used.",
    name: "Sarah Mitchell",
    role: "Group travel organizer, Canada",
    rating: "4.9",
    tour: "South Africa Discovery",
    initials: "SM",
  },
  {
    quote:
      "Walking through Cape Coast Castle with AfriQwest's guides gave our group a depth of understanding no textbook could match.",
    name: "Patricia Mensah",
    role: "Heritage educator, Ghana diaspora network",
    rating: "5.0",
    tour: "Ghana Heritage",
    initials: "PM",
  },
  {
    quote:
      "The Maasai village visit and sunrise game drive were perfectly paced — authentic, respectful, and unforgettable.",
    name: "Emily Kariuki",
    role: "NGO program manager, Kenya",
    rating: "4.9",
    tour: "Kenya Safari",
    initials: "EK",
  },
  {
    quote:
      "From Table Mountain to Soweto — AfriQwest balanced history, culture, and comfort across every day of our itinerary.",
    name: "Nathan Reed",
    role: "University faculty lead, USA",
    rating: "4.9",
    tour: "South Africa Discovery",
    initials: "NR",
  },
];

/** @deprecated Use testimonials array */
export const testimonial = {
  quote: testimonials[0].quote,
  name: testimonials[0].name,
  role: testimonials[0].role,
  rating: testimonials[0].rating,
  reviews: "120+ reviews",
  image: images.home.testimonial,
};

export const partners = [
  "Universities",
  "Corporate retreats",
  "Cultural exchanges",
  "Community impact",
  "Group travel",
];
