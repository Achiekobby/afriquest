import { Link } from "react-router";
import { motion } from "motion/react";
import Container from "../../components/layout/Container";
import { ROUTES } from "../../constants/routes";
import { images } from "../../config/images";
import { brand, immersionExperiences } from "../../data/brandContent";
import { getWhatsAppUrl } from "../../config/env";

const EASE = [0.16, 1, 0.3, 1];

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.65, ease: EASE, delay },
});

const stats = [
  { value: "10+", label: "Years of expertise" },
  { value: "3", label: "Countries served" },
  { value: "5,000+", label: "Travelers guided" },
  { value: "100%", label: "Curated experiences" },
];


const values = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.6 9h16.8M3.6 15h16.8" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.2 2.4 3.4 5.1 3.6 9-.2 3.9-1.4 6.6-3.6 9-2.2-2.4-3.4-5.1-3.6-9 .2-3.9 1.4-6.6 3.6-9z" />
      </svg>
    ),
    label: "Authenticity",
    description: "Travel like a local, not just a tourist. Every itinerary is built around genuine cultural encounters.",
    accent: "bg-brand-green/10 text-brand-green ring-brand-green/20",
    bar: "bg-brand-green",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m0-4a4 4 0 110-8 4 4 0 010 8zm8 0a4 4 0 110-8 4 4 0 010 8z" />
      </svg>
    ),
    label: "Expert Guides",
    description: "Knowledgeable professionals with deep local roots in Ghana, Kenya, and South Africa.",
    accent: "bg-brand-orange/10 text-brand-orange ring-brand-orange/20",
    bar: "bg-brand-orange",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    label: "Sustainability",
    description: "Eco-conscious travel that gives back — supporting local communities and preserving natural heritage.",
    accent: "bg-brand-gold/15 text-brand-gold ring-brand-gold/25",
    bar: "bg-brand-gold",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    label: "Personalized Service",
    description: "Every trip is crafted around you — your group, your goals, your timeline.",
    accent: "bg-brand-green/10 text-brand-green ring-brand-green/20",
    bar: "bg-brand-green",
  },
];

const services = [
  { label: "Tailored Tours", icon: "✈️" },
  { label: "Wildlife Safaris", icon: "🦁" },
  { label: "Heritage & Culture", icon: "🏛️" },
  { label: "Adventure Travel", icon: "🏔️" },
  { label: "Beach Getaways", icon: "🌊" },
  { label: "Group Programs", icon: "👥" },
  { label: "University Tours", icon: "🎓" },
  { label: "Corporate Retreats", icon: "💼" },
  { label: "Flight & Hotel", icon: "🏨" },
];

const hubs = [
  {
    name: "Ghana",
    region: "West Africa",
    tagline: "Heritage Coast",
    desc: "Cape Coast Castle, Kumasi, Accra — immerse in the history and spirit of West Africa.",
    image: images.home.ghana,
    badge: "bg-brand-gold/20 text-brand-gold",
  },
  {
    name: "Kenya",
    region: "East Africa",
    tagline: "Safari & Savanna",
    desc: "Maasai Mara wildlife, cultural encounters, and breathtaking landscapes across East Africa.",
    image: images.home.kenya,
    badge: "bg-brand-orange/15 text-brand-orange",
  },
  {
    name: "South Africa",
    region: "Southern Africa",
    tagline: "Vibrant Cities",
    desc: "Table Mountain, Johannesburg townships, and Cape Town's vibrant urban culture.",
    image: images.home.southAfrica,
    badge: "bg-brand-green/15 text-brand-green",
  },
];

function DotPattern() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-30"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Ccircle cx='2' cy='2' r='1' fill='%232D5A47' fill-opacity='0.07'/%3E%3C/svg%3E\")",
        backgroundSize: "24px 24px",
      }}
    />
  );
}

function KentePattern() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-40"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'%3E%3Cg fill='none' transform='rotate(45 14 14)'%3E%3Crect width='14' height='14' fill='%232D5A47' fill-opacity='0.03'/%3E%3Crect x='14' y='14' width='14' height='14' fill='%23E3A020' fill-opacity='0.025'/%3E%3C/g%3E%3C/svg%3E\")",
        backgroundSize: "28px 28px",
      }}
    />
  );
}

export default function AboutPage() {
  return (
    <div className="overflow-x-hidden">

      {/* ── Hero ── */}
      <section className="relative min-h-[520px] overflow-hidden pb-16 pt-16 sm:min-h-[580px] sm:pt-20 lg:min-h-[640px] lg:pt-24">

        {/* Full-bleed photo */}
        <img
          src={images.home.hero}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        {/* Layered overlays */}
        <div aria-hidden className="absolute inset-0 bg-[#1C2B26]/65" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-[#1C2B26]/55 via-[#2D5A47]/35 to-[#1C2B26]/50" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#1C2B26]/55 via-transparent to-transparent" />

        {/* Kente diamond grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.28]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'%3E%3Cg fill='none' transform='rotate(45 14 14)'%3E%3Crect width='14' height='14' fill='%232D5A47' fill-opacity='0.06'/%3E%3Crect x='14' y='14' width='14' height='14' fill='%23E3A020' fill-opacity='0.04'/%3E%3Cline x1='0' y1='14' x2='14' y2='14' stroke='%232D5A47' stroke-width='0.3' stroke-opacity='0.08'/%3E%3C/g%3E%3C/svg%3E\")",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Ambient colour blobs */}
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-brand-gold/12 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-brand-orange/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-green/10 blur-[80px]" />

        {/* Concentric SVG rings — decorative depth behind content */}
        <svg
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 opacity-[0.06]"
          viewBox="0 0 500 500"
          fill="none"
        >
          <circle cx="250" cy="250" r="80" stroke="#E3A020" strokeWidth="1" />
          <circle cx="250" cy="250" r="140" stroke="#2D5A47" strokeWidth="0.8" strokeDasharray="5 9" />
          <circle cx="250" cy="250" r="200" stroke="#D4611A" strokeWidth="0.6" strokeDasharray="3 12" />
          <circle cx="250" cy="250" r="240" stroke="#E3A020" strokeWidth="0.5" strokeDasharray="8 16" />
        </svg>

        {/* Travel route arcs */}
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]"
          viewBox="0 0 1400 640"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          <path d="M60 560 C300 250,700 400,1300 80" stroke="#2D5A47" strokeWidth="1.5" strokeDasharray="7 13" strokeLinecap="round" />
          <path d="M40 620 C360 300,760 450,1340 150" stroke="#D4611A" strokeWidth="1" strokeDasharray="4 16" strokeLinecap="round" />
          <circle cx="60" cy="560" r="5" fill="#2D5A47" fillOpacity="0.5" />
          <circle cx="1300" cy="80" r="5" fill="#E3A020" fillOpacity="0.6" />
        </svg>

        {/* Top kente accent band */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-brand-green via-brand-gold to-brand-orange"
        />

        <Container className="relative z-10 text-center">

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.75, ease: EASE }}
            className="mb-8 flex justify-center"
          >
            <div className="relative inline-flex items-center justify-center">
              <div aria-hidden className="absolute h-24 w-48 rounded-full bg-brand-gold/20 blur-2xl" />
              <img
                src={images.general_logo}
                alt="AfriQwest Global"
                className="relative h-16 w-auto drop-shadow-[0_4px_24px_rgba(227,160,32,0.5)] sm:h-20 lg:h-[5.5rem]"
              />
            </div>
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
          >
            <span className="inline-flex items-center gap-2.5 rounded-full border border-white/18 bg-white/8 px-5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-gold backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-gold opacity-55" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-gold" />
              </span>
              Our Story · Since 2014
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.18 }}
            className="mx-auto mt-6 max-w-3xl text-[2.6rem] font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]"
          >
            More than a travel agency —
            <br />
            <span className="text-brand-gold">a movement.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE, delay: 0.26 }}
            className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg"
          >
            {brand.taglineShort} {brand.tagline}
          </motion.p>

          {/* Location line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.34 }}
            className="mt-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/38"
          >
            Ghana · Kenya · South Africa · Houston, TX
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.32 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              to={ROUTES.tours}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-green px-7 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_-8px_rgba(45,90,71,0.8)] transition-all hover:bg-brand-green-dark"
            >
              Explore our tours
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
            <Link
              to={ROUTES.whyUs}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-7 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/16"
            >
              Why AfriQwest
            </Link>
          </motion.div>

          {/* Stats chips */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.44 }}
            className="mt-11 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
          >
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-3 rounded-2xl border border-white/12 bg-white/8 px-5 py-3 backdrop-blur-md"
              >
                <p className="text-xl font-bold text-brand-gold sm:text-2xl">{s.value}</p>
                <p className="text-left text-[11px] leading-snug text-white/65">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </Container>

        {/* Bottom kente divider */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-brand-green via-brand-gold to-brand-orange"
        />
      </section>


      {/* ── About Us ── */}
      <section className="relative overflow-hidden bg-white py-16 sm:py-20">
        <DotPattern />
        <div aria-hidden className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-brand-green/5 blur-3xl" />

        <Container className="relative">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.div {...rise()}>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-orange">About us</p>
              <h2 className="mt-3 text-3xl font-bold text-brand-ink sm:text-4xl">
                Who is <span className="text-brand-green">AfriQwest?</span>
              </h2>
              <div className="mt-5 space-y-4 text-base leading-relaxed text-brand-muted">
                <p>{brand.intro}</p>
                <p>{brand.movementLine}</p>
                <p>{brand.operations}</p>
              </div>
              <blockquote className="mt-8 border-l-4 border-brand-orange pl-5 italic text-brand-ink">
                &ldquo;{brand.transformationLine}&rdquo;
              </blockquote>
            </motion.div>

            <motion.div {...rise(0.12)} className="relative">
              <div className="relative overflow-hidden rounded-[1.75rem] shadow-[0_24px_60px_-24px_rgba(28,43,38,0.4)]">
                <img
                  src={images.home.hero}
                  alt="AfriQwest travelers"
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/40 to-transparent" />
              </div>
              <div className="absolute -bottom-5 -left-4 rounded-2xl border border-brand-border/60 bg-white px-4 py-3 shadow-xl">
                <p className="text-xs font-bold text-brand-green">Founded in the USA</p>
                <p className="mt-0.5 text-[11px] text-brand-muted">Operations across 3 countries</p>
              </div>
              <div className="absolute -right-4 top-6 rounded-2xl border border-brand-border/60 bg-white px-4 py-3 shadow-xl">
                <p className="text-xs font-bold text-brand-green">Houston, Texas</p>
                <p className="mt-0.5 text-[11px] text-brand-muted">Global headquarters</p>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ── Cultural Immersion ── */}
      <section className="relative overflow-hidden bg-brand-cream py-16 sm:py-20">
        <KentePattern />
        <Container className="relative">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

            {/* ── Venn diagram ── */}
            <motion.div {...rise()} className="flex items-center justify-center">
              <svg
                viewBox="-10 -10 420 420"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full max-w-[520px]"
                aria-label="AfriQwest experience Venn diagram"
              >
                {/* ── Circle fills ── */}
                <circle cx="140" cy="138" r="130" fill="#2D5A47" fillOpacity="0.12" />
                <circle cx="260" cy="138" r="130" fill="#D4611A" fillOpacity="0.10" />
                <circle cx="200" cy="232" r="130" fill="#E3A020" fillOpacity="0.12" />

                {/* ── Circle strokes ── */}
                <circle cx="140" cy="138" r="130" stroke="#2D5A47" strokeWidth="1.6" strokeOpacity="0.35" />
                <circle cx="260" cy="138" r="130" stroke="#D4611A" strokeWidth="1.6" strokeOpacity="0.30" />
                <circle cx="200" cy="232" r="130" stroke="#E3A020" strokeWidth="1.6" strokeOpacity="0.40" />

                {/* ── Intersection tints ── */}
                <path d="M200 48 C232 70,232 206,200 228 C168 206,168 70,200 48 Z" fill="#2D5A47" fillOpacity="0.07" />
                <path d="M112 205 C138 172,176 172,200 198 C176 228,134 238,112 205 Z" fill="#E3A020" fillOpacity="0.07" />
                <path d="M288 205 C266 238,224 228,200 198 C224 172,262 172,288 205 Z" fill="#D4611A" fillOpacity="0.07" />

                {/* ── Centre intersection ── */}
                <ellipse cx="200" cy="188" rx="40" ry="34" fill="#2D5A47" fillOpacity="0.18" />

                {/* ── Centre label ── */}
                <text x="200" y="183" textAnchor="middle" fill="#2D5A47" fontSize="12" fontWeight="700" fontFamily="system-ui,sans-serif" letterSpacing="0.8">LIVE</text>
                <text x="200" y="199" textAnchor="middle" fill="#2D5A47" fontSize="12" fontWeight="700" fontFamily="system-ui,sans-serif" letterSpacing="0.8">AFRICA</text>

                {/* ── Circle labels ── */}
                <text x="100" y="86" textAnchor="middle" fill="#2D5A47" fontSize="13" fontWeight="700" fontFamily="system-ui,sans-serif">Culture &amp;</text>
                <text x="100" y="103" textAnchor="middle" fill="#2D5A47" fontSize="13" fontWeight="700" fontFamily="system-ui,sans-serif">Heritage</text>

                <text x="300" y="86" textAnchor="middle" fill="#C05A18" fontSize="13" fontWeight="700" fontFamily="system-ui,sans-serif">Wildlife &amp;</text>
                <text x="300" y="103" textAnchor="middle" fill="#C05A18" fontSize="13" fontWeight="700" fontFamily="system-ui,sans-serif">Nature</text>

                <text x="200" y="334" textAnchor="middle" fill="#B8860B" fontSize="13" fontWeight="700" fontFamily="system-ui,sans-serif">Adventure &amp;</text>
                <text x="200" y="351" textAnchor="middle" fill="#B8860B" fontSize="13" fontWeight="700" fontFamily="system-ui,sans-serif">Community</text>

                {/* ── Sub-labels in each petal ── */}
                <text x="122" y="200" textAnchor="middle" fill="#2D5A47" fontSize="10" fontFamily="system-ui,sans-serif" fillOpacity="0.75">History</text>
                <text x="122" y="213" textAnchor="middle" fill="#2D5A47" fontSize="10" fontFamily="system-ui,sans-serif" fillOpacity="0.75">· Traditions</text>

                <text x="278" y="200" textAnchor="middle" fill="#C05A18" fontSize="10" fontFamily="system-ui,sans-serif" fillOpacity="0.75">Safaris</text>
                <text x="278" y="213" textAnchor="middle" fill="#C05A18" fontSize="10" fontFamily="system-ui,sans-serif" fillOpacity="0.75">· Landscapes</text>

                <text x="200" y="272" textAnchor="middle" fill="#B8860B" fontSize="10" fontFamily="system-ui,sans-serif" fillOpacity="0.75">People · Cuisine</text>
                <text x="200" y="285" textAnchor="middle" fill="#B8860B" fontSize="10" fontFamily="system-ui,sans-serif" fillOpacity="0.75">· Local Stories</text>

                {/* ── Decorative dot accents ── */}
                <circle cx="140" cy="6" r="3.5" fill="#2D5A47" fillOpacity="0.25" />
                <circle cx="260" cy="6" r="3.5" fill="#D4611A" fillOpacity="0.25" />
                <circle cx="48" cy="258" r="3" fill="#E3A020" fillOpacity="0.3" />
                <circle cx="352" cy="258" r="3" fill="#E3A020" fillOpacity="0.3" />
              </svg>
            </motion.div>

            {/* ── Text + Experiences ── */}
            <div>
              <motion.div {...rise(0.08)}>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-orange">Live the experience</p>
                <h2 className="mt-3 text-3xl font-bold text-brand-ink sm:text-4xl">
                  Feel it. Taste it. <span className="text-brand-green">Live Africa.</span>
                </h2>
                <p className="mt-4 text-base leading-relaxed text-brand-muted">{brand.feelAfricaLine}</p>
              </motion.div>

              <motion.ul {...rise(0.16)} className="mt-7 space-y-3">
                {immersionExperiences.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-xl border border-brand-border/60 bg-white px-4 py-3.5 text-sm text-brand-ink shadow-sm"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
                      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} aria-hidden><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                    {item}
                  </li>
                ))}
              </motion.ul>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Our Three Hubs ── */}
      <section className="relative overflow-hidden bg-brand-cream py-16 sm:py-20">
        <KentePattern />
        <div aria-hidden className="pointer-events-none absolute -left-20 top-1/3 h-64 w-64 rounded-full bg-brand-orange/5 blur-3xl" />

        <Container className="relative">
          <motion.div {...rise()} className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-orange">Where we operate</p>
            <h2 className="mt-3 text-3xl font-bold text-brand-ink sm:text-4xl">Our three hubs</h2>
            <p className="mt-3 text-base leading-relaxed text-brand-muted">
              Three countries. Deeply known. Authentically delivered.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {hubs.map((hub, i) => (
              <motion.div
                key={hub.name}
                {...rise(i * 0.1)}
                className="group overflow-hidden rounded-[1.75rem] border border-brand-border/60 bg-white shadow-[0_12px_40px_-24px_rgba(28,43,38,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_-20px_rgba(28,43,38,0.28)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={hub.image} alt={hub.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/70 via-brand-ink/10 to-transparent" />
                  <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${hub.badge}`}>
                    {hub.region}
                  </span>
                  <p className="absolute bottom-3 left-4 text-xl font-bold text-white">{hub.name}</p>
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange">{hub.tagline}</p>
                  <p className="mt-2 text-sm leading-relaxed text-brand-muted">{hub.desc}</p>
                  <Link
                    to={ROUTES.tours}
                    className="group/link mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-green transition-colors hover:text-brand-green-dark"
                  >
                    View tours
                    <svg className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="relative overflow-hidden bg-white py-16 sm:py-20">
        <DotPattern />
        <div aria-hidden className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-brand-green/5 blur-3xl" />

        <Container className="relative">
          <motion.div {...rise()} className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-orange">Why choose us</p>
            <h2 className="mt-3 text-3xl font-bold text-brand-ink sm:text-4xl">Why Choose AfriQwest?</h2>
            <p className="mt-3 text-base leading-relaxed text-brand-muted">
              We combine deep local expertise with world-class service to deliver Africa like you&apos;ve never experienced it.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {values.map((v, i) => (
              <motion.div
                key={v.label}
                {...rise(i * 0.08)}
                className="group relative overflow-hidden rounded-2xl border border-brand-border/70 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-green/25 hover:shadow-md"
              >
                <div className={`absolute left-0 top-6 h-10 w-1 rounded-r-full ${v.bar}`} aria-hidden />
                <div className="flex gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1 ${v.accent}`}>
                    {v.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-ink">{v.label}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-brand-muted">{v.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Our Services ── */}
      <section className="relative overflow-hidden bg-brand-cream py-16 sm:py-20">
        <KentePattern />

        <Container className="relative">
          <motion.div {...rise()} className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-orange">What we offer</p>
            <h2 className="mt-3 text-3xl font-bold text-brand-ink sm:text-4xl">Our Services</h2>
            <p className="mt-3 text-base leading-relaxed text-brand-muted">
              From safari adventures to heritage walks — we curate every detail.
            </p>
          </motion.div>

          <motion.div {...rise(0.1)} className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
            {services.map((s, i) => (
              <motion.div
                key={s.label}
                {...rise(i * 0.05)}
                className="flex items-center gap-3 rounded-xl border border-brand-border/60 bg-white px-4 py-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-green/25 hover:shadow-md"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-green/8 text-xl">
                  {s.icon}
                </span>
                <span className="text-sm font-semibold text-brand-ink">{s.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden bg-brand-green py-14 sm:py-16">
        <KentePattern />
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-gold/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-brand-orange/10 blur-3xl" />

        <Container className="relative text-center">
          <motion.div {...rise()}>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-gold">Ready to begin?</p>
            <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
              Let us plan your African journey
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/80">
              Whether you&apos;re planning a solo expedition, university program, or corporate retreat — our team is ready to craft your perfect experience.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link
                to={ROUTES.contact}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-brand-green shadow-lg transition-all hover:bg-brand-cream"
              >
                Request a quote
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </Link>
              <a
                href={getWhatsAppUrl("Hello AfriQwest, I'd like to learn more about your tours.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-orange px-7 py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(0,0,0,0.3)] transition-all hover:bg-brand-orange-dark"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        </Container>
      </section>

    </div>
  );
}
