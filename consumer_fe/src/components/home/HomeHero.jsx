import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import Container from "../layout/Container";
import { images } from "../../config/images";
import { heroContent } from "../../data/homeContent";
import { ROUTES } from "../../constants/routes";

const DESTINATIONS = ["Ghana", "Kenya", "South Africa"];

const EASE = [0.16, 1, 0.3, 1];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const rise = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const avatars = [images.home.ghana, images.home.kenya, images.home.southAfrica];

const collageTiles = [
  {
    key: "ghana",
    src: images.home.hero_three,
    alt: "Ghana heritage coast",
    label: "Ghana",
    className: "col-span-5 row-span-5 col-start-1 row-start-1 lg:translate-y-1",
    delay: 0.2,
  },
  {
    key: "kenya",
    src: images.home.hero_two,
    alt: "Kenya safari",
    label: "Kenya",
    className: "col-span-7 row-span-6 col-start-6 row-start-1 -translate-y-2 lg:-translate-y-3",
    delay: 0.3,
  },
  {
    key: "hero",
    src: images.home.hero_one,
    alt: "African landscape",
    label: "Heritage Coast",
    className: "col-span-5 row-span-7 col-start-1 row-start-6 translate-y-2 lg:translate-y-3",
    delay: 0.4,
  },
  {
    key: "ghana-castle",
    src: images.home.hero_four,
    alt: "Ghana discovery",
    label: "Ghana",
    className: "col-span-7 row-span-6 col-start-6 row-start-7 -translate-y-1 lg:-translate-y-2",
    delay: 0.5,
  },
];

function HeroBackgroundPatterns() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Soft color washes */}
      <div className="absolute -right-32 -top-40 h-[28rem] w-[28rem] rounded-full bg-brand-green/5 blur-3xl" />
      <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-brand-orange/5 blur-3xl" />
      <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-brand-gold/5 blur-3xl" />

      {/* Full-section diamond textile grid */}
      <div
        className="absolute inset-0 opacity-80"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'%3E%3Cg fill='none' transform='rotate(45 14 14)'%3E%3Crect width='14' height='14' fill='%232D5A47' fill-opacity='0.04'/%3E%3Crect x='14' y='14' width='14' height='14' fill='%23E3A020' fill-opacity='0.035'/%3E%3Cline x1='0' y1='14' x2='28' y2='14' stroke='%232D5A47' stroke-width='0.5' stroke-opacity='0.06'/%3E%3Cline x1='14' y1='0' x2='14' y2='28' stroke='%23D4611A' stroke-width='0.5' stroke-opacity='0.05'/%3E%3C/g%3E%3C/svg%3E\")", backgroundSize: "28px 28px" }}
      />

      {/* Left column — cross stitch accent */}
      <div
        className="absolute inset-y-0 left-0 w-[55%] opacity-60 lg:w-[48%]"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath d='M16 8v16M8 16h16' stroke='%232D5A47' stroke-width='0.6' stroke-opacity='0.05'/%3E%3C/svg%3E\")",
          backgroundSize: "32px 32px",
          maskImage: "linear-gradient(to right, black 40%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, black 40%, transparent 100%)",
        }}
      />

      {/* Right column — radial rings behind collage */}
      <svg
        className="absolute -right-16 top-1/2 h-[min(720px,90vw)] w-[min(720px,90vw)] -translate-y-1/2 opacity-[0.07] lg:-right-8"
        viewBox="0 0 400 400"
        fill="none"
      >
        <circle cx="200" cy="200" r="60" stroke="#2D5A47" strokeWidth="1" />
        <circle cx="200" cy="200" r="100" stroke="#2D5A47" strokeWidth="0.8" strokeDasharray="4 8" />
        <circle cx="200" cy="200" r="140" stroke="#D4611A" strokeWidth="0.8" strokeDasharray="2 10" />
        <circle cx="200" cy="200" r="180" stroke="#E3A020" strokeWidth="0.6" strokeDasharray="6 12" />
      </svg>

      {/* Travel route arcs */}
      <svg
        className="absolute right-0 top-8 h-[420px] w-[min(520px,70vw)] opacity-[0.08] lg:top-12"
        viewBox="0 0 520 420"
        fill="none"
      >
        <path
          d="M20 320 C120 180, 280 260, 480 80"
          stroke="#2D5A47"
          strokeWidth="1.5"
          strokeDasharray="6 10"
          strokeLinecap="round"
        />
        <path
          d="M40 380 C180 220, 320 300, 500 140"
          stroke="#D4611A"
          strokeWidth="1"
          strokeDasharray="4 12"
          strokeLinecap="round"
        />
        <circle cx="20" cy="320" r="4" fill="#2D5A47" fillOpacity="0.4" />
        <circle cx="480" cy="80" r="4" fill="#D4611A" fillOpacity="0.4" />
        <circle cx="500" cy="140" r="3" fill="#E3A020" fillOpacity="0.5" />
      </svg>

      {/* Topographic contour lines — bottom fade */}
      <svg
        className="absolute -bottom-8 left-0 h-48 w-full opacity-[0.06]"
        viewBox="0 0 800 120"
        preserveAspectRatio="none"
        fill="none"
      >
        <path d="M0 80 Q200 40, 400 70 T800 50" stroke="#2D5A47" strokeWidth="1" />
        <path d="M0 95 Q200 55, 400 85 T800 65" stroke="#2D5A47" strokeWidth="0.8" />
        <path d="M0 110 Q200 70, 400 100 T800 80" stroke="#D4611A" strokeWidth="0.6" />
      </svg>

      {/* Dot grid overlay for texture */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Ccircle cx='2' cy='2' r='1' fill='%232D5A47' fill-opacity='0.07'/%3E%3C/svg%3E\")",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Bottom kente band */}
      <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-brand-green/20 via-brand-gold/25 to-brand-orange/20" />
      <div
        className="absolute inset-x-0 bottom-1.5 h-3 opacity-40"
        style={{
          backgroundImage: "repeating-linear-gradient(90deg, #2D5A47 0, #2D5A47 2px, transparent 2px, transparent 10px, #E3A020 10px, #E3A020 12px, transparent 12px, transparent 20px, #D4611A 20px, #D4611A 22px, transparent 22px, transparent 32px)",
        }}
      />
    </div>
  );
}

function GlassSurface({ className = "", children }) {
  return (
    <div
      className={`border border-white/40 bg-white/20 shadow-lg ring-1 ring-inset ring-white/30 backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}

function CollageTile({ tile }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: EASE, delay: tile.delay }}
      className={`group relative overflow-visible rounded-[1.75rem] shadow-[0_16px_40px_-20px_rgba(28,43,38,0.45)] ${tile.className}`}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[1.75rem]">
        <img
          src={tile.src}
          alt={tile.alt}
          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/50 via-brand-ink/5 to-transparent" />
        <p className="absolute bottom-3 left-4 text-sm font-bold text-white">{tile.label}</p>
      </div>

      {tile.key === "ghana" && (
        <>
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.85 }}
            className="absolute left-3 top-3 z-20"
          >
            <GlassSurface className="flex items-center gap-2 rounded-full px-3 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-gold opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-gold" />
              </span>
              <span className="text-[11px] font-semibold text-white drop-shadow-sm">2,480 exploring</span>
            </GlassSurface>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.65 }}
            className="absolute -bottom-24 left-2 z-30 w-[10.5rem] sm:-left-6 sm:w-[11rem]"
          >
            <GlassSurface className="rounded-2xl px-3.5 py-3 shadow-[0_20px_50px_-20px_rgba(28,43,38,0.6)]">
              <p className="text-base font-bold leading-tight text-white drop-shadow-sm">3 Countries</p>
              <p className="mt-1 text-[10px] leading-snug text-white/85">
                Ghana · Kenya · South Africa
              </p>
            </GlassSurface>
          </motion.div>
        </>
      )}

      {tile.key === "kenya" && (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.75 }}
            className="absolute right-3 top-3 z-20"
          >
            <GlassSurface className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5">
              <svg className="h-3.5 w-3.5 text-brand-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M20 6 9 17l-5-5" />
              </svg>
              <span className="text-[11px] font-semibold text-white drop-shadow-sm">100% Verified</span>
            </GlassSurface>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.95 }}
            className="absolute bottom-4 left-3 z-20"
          >
            <GlassSurface className="flex items-center gap-2 rounded-xl px-3 py-2">
              <span className="text-sm leading-none">⭐</span>
              <div>
                <p className="text-sm font-bold leading-none text-white drop-shadow-sm">4.9</p>
                <p className="mt-0.5 text-[10px] text-white/85">5,000+ reviews</p>
              </div>
            </GlassSurface>
          </motion.div>
        </>
      )}

      {tile.key === "south-africa" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 1.05 }}
          className="absolute -left-5 top-1/2 z-30 -translate-y-1/2 sm:-left-7"
        >
          <GlassSurface className="flex items-center gap-2.5 rounded-2xl bg-white/70 px-3.5 py-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-green/15 text-brand-green">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </span>
            <div>
              <p className="text-[11px] font-bold text-brand-ink">Trusted by travelers</p>
              <p className="text-[10px] text-brand-muted">Ghana · Kenya · SA</p>
            </div>
          </GlassSurface>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function HomeHero() {
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    navigate(ROUTES.tours);
  }

  return (
    <section className="relative overflow-x-hidden bg-brand-cream">
      <HeroBackgroundPatterns />

      <Container className="relative pt-10 pb-16 sm:pt-12 sm:pb-20 lg:pt-14 lg:pb-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">

          {/* ── Left column ── */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col"
          >
            {/* Badge */}
            <motion.span
              variants={rise}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-orange/20 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-brand-orange shadow-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-orange opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-orange" />
              </span>
              Explore Africa with purpose
            </motion.span>

            {/* Headline */}
            <motion.h1
              variants={rise}
              className="mt-6 text-[2.7rem] font-bold leading-[1.05] tracking-tight text-brand-ink sm:text-[3.25rem] lg:text-[3.75rem]"
            >
              Discover The Best{" "}
              <span className="relative inline-block text-brand-orange">
                Destinations
                <svg
                  className="absolute -bottom-2 left-0 h-3 w-full text-brand-gold"
                  viewBox="0 0 200 12"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <path
                    d="M2 9C40 4 90 3 130 5C160 6.5 185 7 198 4"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <br />
              In Ghana, Kenya &amp; South Africa
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={rise}
              className="mt-6 max-w-lg text-base leading-relaxed text-brand-muted sm:text-[1.05rem]"
            >
              {heroContent.subtitle}
            </motion.p>

            {/* Search widget */}
            <motion.form
              variants={rise}
              onSubmit={handleSearch}
              className="mt-8 flex flex-col gap-2 rounded-2xl border border-brand-border/70 bg-white/90 p-2.5 shadow-[0_18px_50px_-20px_rgba(28,43,38,0.35)] backdrop-blur-sm sm:flex-row sm:items-stretch sm:gap-0"
            >
              {/* Location */}
              <div className="flex flex-1 items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-brand-cream/60">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-green/10 text-brand-green">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                <div className="flex min-w-0 flex-col">
                  <label className="text-[10px] font-semibold uppercase tracking-widest text-brand-muted">
                    Location
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full appearance-none bg-transparent text-sm font-semibold text-brand-ink outline-none"
                  >
                    <option value="">Where to go?</option>
                    {DESTINATIONS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="hidden w-px self-stretch bg-brand-border/70 sm:block" />

              {/* Date */}
              <div className="flex flex-1 items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-brand-cream/60">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-green/10 text-brand-green">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                </span>
                <div className="flex min-w-0 flex-col">
                  <label className="text-[10px] font-semibold uppercase tracking-widest text-brand-muted">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-brand-ink outline-none [color-scheme:light]"
                  />
                </div>
              </div>

              {/* CTA */}
              <button
                type="submit"
                className="group flex items-center justify-center gap-2 rounded-xl bg-brand-orange px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_-8px_rgba(212,97,26,0.7)] transition-all duration-300 hover:bg-brand-orange-dark sm:px-7"
              >
                Get Started
                <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </motion.form>

            {/* Social proof row */}
            <motion.div variants={rise} className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-5">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {avatars.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      className="h-10 w-10 rounded-full border-2 border-brand-cream object-cover"
                    />
                  ))}
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-brand-cream bg-brand-green text-[11px] font-bold text-white">
                    5k+
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-brand-gold">
                    {"★★★★★".split("").map((s, i) => (
                      <span key={i} className="text-sm leading-none">{s}</span>
                    ))}
                    <span className="ml-1 text-sm font-bold text-brand-ink">4.9</span>
                  </div>
                  <p className="text-xs text-brand-muted">Loved by 5,000+ travelers</p>
                </div>
              </div>

              <div className="h-10 w-px bg-brand-border/70" />

              <div className="flex gap-7">
                <div>
                  <p className="text-2xl font-bold text-brand-ink">10+</p>
                  <p className="text-xs text-brand-muted">Years expertise</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-brand-ink">3</p>
                  <p className="text-xs text-brand-muted">Hub countries</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* ── Right column — 4-image bento collage ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
            className="relative mx-auto w-full max-w-[560px] px-1 pb-6 sm:px-2 lg:max-w-none lg:px-3"
          >
            <div className="relative grid h-[480px] grid-cols-12 grid-rows-12 gap-3 overflow-visible sm:h-[520px] lg:h-[580px] lg:gap-3.5">
              {collageTiles.map((tile) => (
                <CollageTile key={tile.key} tile={tile} />
              ))}
            </div>
          </motion.div>

        </div>
      </Container>
    </section>
  );
}
