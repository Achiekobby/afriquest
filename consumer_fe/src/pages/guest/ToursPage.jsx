import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import Container from "../../components/layout/Container";
import { ROUTES } from "../../constants/routes";
import { allTours, FILTER_CATEGORIES } from "../../data/toursData";

const EASE = [0.16, 1, 0.3, 1];

// ── Star rating ───────────────────────────────────────────────────────────────
function StarRating({ value }) {
  return (
    <span className="flex items-center gap-0.5">
      <svg className="h-3 w-3 fill-brand-orange text-brand-orange" viewBox="0 0 20 20" aria-hidden>
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
      <span className="text-[11px] font-semibold text-brand-ink">{value}</span>
    </span>
  );
}

// ── Tour card ─────────────────────────────────────────────────────────────────
function TourCard({ tour, index }) {
  const [imgError, setImgError] = useState(false);
  const isFilling = tour.spotsLeft <= 3;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.4, ease: EASE, delay: Math.min(index * 0.04, 0.28) }}
      className="group flex flex-col"
    >
      <Link to={ROUTES.tourDetail(tour.slug)} className="flex flex-col gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 rounded-xl">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-xl bg-brand-border/30">
          {!imgError ? (
            <img
              src={tour.image}
              alt={tour.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-brand-cream text-4xl">
              {tour.categories.includes("safari") ? "🦁" : tour.categories.includes("beach") ? "🌊" : "🌍"}
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Badge */}
          {tour.badge && (
            <span className={`absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${tour.badgeColor ?? "bg-white/90 text-brand-ink"}`}>
              {tour.badge}
            </span>
          )}

          {/* Filling fast */}
          {isFilling && (
            <span className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-full bg-red-500/90 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              {tour.spotsLeft} spots left
            </span>
          )}

          {/* Wishlist button */}
          <button
            type="button"
            aria-label="Save to wishlist"
            className="absolute right-2.5 bottom-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:bg-white"
          >
            <svg className="h-4 w-4 text-brand-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-0.5 px-0.5">
          <div className="flex items-start justify-between gap-2">
            <p className="line-clamp-1 text-sm font-semibold text-brand-ink group-hover:text-brand-green transition-colors">
              {tour.name}
            </p>
            <StarRating value={tour.rating} />
          </div>
          <p className="line-clamp-1 text-xs text-brand-muted">{tour.location}</p>
          <p className="text-xs text-brand-muted">{tour.duration} · {tour.groupSize}</p>
          <p className="text-xs text-brand-muted">Departs {tour.nextDate}</p>
          <p className="mt-1 text-sm font-bold text-brand-ink">
            {tour.priceLabel}{" "}
            <span className="text-xs font-normal text-brand-muted">/ person</span>
          </p>
        </div>
      </Link>
    </motion.article>
  );
}

// ── Filter pill ───────────────────────────────────────────────────────────────
function FilterPill({ cat, active, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(cat.id)}
      className={[
        "relative flex shrink-0 flex-col items-center gap-1.5 px-4 pb-3 pt-2.5 text-center transition-all duration-200",
        active
          ? "text-brand-ink"
          : "text-brand-muted hover:text-brand-ink",
      ].join(" ")}
    >
      <span className="text-xl leading-none">{cat.icon}</span>
      <span className="whitespace-nowrap text-xs font-semibold">{cat.label}</span>
      {active && (
        <motion.span
          layoutId="filter-underline"
          className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-brand-ink"
        />
      )}
    </button>
  );
}

// ── Sort dropdown ─────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "price-asc",   label: "Price: low to high" },
  { value: "price-desc",  label: "Price: high to low" },
  { value: "rating",      label: "Top rated" },
  { value: "spots",       label: "Filling fast" },
];

function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = SORT_OPTIONS.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1.5 rounded-full border border-brand-border/80 bg-white px-4 py-2 text-xs font-semibold text-brand-ink shadow-sm transition-all hover:border-brand-green/40 hover:shadow-md"
      >
        <svg className="h-3.5 w-3.5 text-brand-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M10 12h4" /></svg>
        {current?.label}
        <svg className={`h-3 w-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-30 mt-2 min-w-[180px] overflow-hidden rounded-xl border border-brand-border/60 bg-white shadow-xl"
          >
            {SORT_OPTIONS.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-xs transition-colors hover:bg-brand-cream ${opt.value === value ? "font-bold text-brand-green" : "text-brand-ink"}`}
                >
                  {opt.label}
                  {opt.value === value && (
                    <svg className="h-3.5 w-3.5 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  )}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ToursPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [sort, setSort]         = useState("recommended");
  const [search, setSearch]     = useState("");
  const [filterScrolled, setFilterScrolled] = useState(false);
  const filterRef           = useRef(null);
  const scrollContainerRef  = useRef(null);
  const searchRef           = useRef(null);

  // Detect when the filter bar has reached its sticky position
  useEffect(() => {
    function onScroll() {
      if (!filterRef.current) return;
      const rect = filterRef.current.getBoundingClientRect();
      setFilterScrolled(rect.top <= 72);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Filter + search + sort
  const filtered = (() => {
    let list = activeFilter === "all"
      ? allTours
      : allTours.filter((t) => t.categories.includes(activeFilter));

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.location.toLowerCase().includes(q) ||
          t.country.toLowerCase().includes(q) ||
          t.categories.some((c) => c.includes(q)),
      );
    }

    if (sort === "price-asc")  list = [...list].sort((a, b) => a.priceNum - b.priceNum);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.priceNum - a.priceNum);
    if (sort === "rating")     list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === "spots")      list = [...list].sort((a, b) => a.spotsLeft - b.spotsLeft);
    return list;
  })();

  const handleFilter = useCallback((id) => {
    setActiveFilter(id);
    if (scrollContainerRef.current) {
      const btn = scrollContainerRef.current.querySelector(`[data-cat="${id}"]`);
      btn?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    }
  }, []);

  const activeCatLabel = FILTER_CATEGORIES.find((c) => c.id === activeFilter)?.label ?? "All tours";
  const hasActiveFilters = activeFilter !== "all" || search.trim() !== "";

  function clearAll() {
    setActiveFilter("all");
    setSearch("");
  }

  return (
    <div className="min-h-screen bg-white">

      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="bg-white px-4 pb-6 pt-8 sm:px-6 lg:px-8">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-orange">
                AfriQwest Travel &amp; Tours
              </p>
              <h1 className="mt-1.5 text-2xl font-bold text-brand-ink sm:text-3xl">
                Explore our tours
              </h1>
              <p className="mt-1 text-sm text-brand-muted">
                {allTours.length} curated experiences across Ghana, Kenya &amp; South Africa
              </p>
            </div>

            {/* Search input */}
            <div ref={searchRef} className="relative w-full max-w-xs sm:w-72 lg:w-80">
              <svg
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden
              >
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tours, locations…"
                className="h-10 w-full rounded-full border border-brand-border/70 bg-white pl-9 pr-9 text-sm text-brand-ink placeholder:text-brand-muted/70 shadow-sm outline-none transition-all focus:border-brand-green/50 focus:ring-2 focus:ring-brand-green/20"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-ink"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              )}
            </div>
          </motion.div>
        </Container>
      </div>

      {/* ── Sticky filter bar — sits 8px below the navbar ────────────── */}
      <div
        ref={filterRef}
        className={[
          "sticky top-[72px] z-40 w-full border-b transition-all duration-300",
          filterScrolled
            ? "border-brand-border/60 bg-white/95 shadow-[0_4px_20px_-8px_rgba(28,43,38,0.12)] backdrop-blur-xl"
            : "border-brand-border/40 bg-white",
        ].join(" ")}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <Container className="flex items-center justify-between gap-4 py-0">
            {/* Scrollable category pills */}
            <div
              ref={scrollContainerRef}
              className="flex flex-1 items-stretch gap-0 overflow-x-auto"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {FILTER_CATEGORIES.map((cat) => (
                <div key={cat.id} data-cat={cat.id}>
                  <FilterPill
                    cat={cat}
                    active={activeFilter === cat.id}
                    onClick={handleFilter}
                  />
                </div>
              ))}
            </div>

            {/* Divider + sort */}
            <div className="flex shrink-0 items-center gap-3 border-l border-brand-border/50 pl-4">
              <SortDropdown value={sort} onChange={setSort} />
            </div>
          </Container>
        </div>
      </div>

      {/* ── Grid ────────────────────────────────────────────────────── */}
      <div className="px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <Container>
          {/* Result count */}
          <div className="mb-5 flex items-center justify-between">
            <AnimatePresence mode="wait">
              <motion.p
                key={`${activeFilter}-${sort}-${search}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-sm text-brand-muted"
              >
                <span className="font-semibold text-brand-ink">{filtered.length} tours</span>
                {activeFilter !== "all" && (
                  <> · <span className="font-medium text-brand-green">{activeCatLabel}</span></>
                )}
                {search.trim() && (
                  <> · &ldquo;<span className="font-medium text-brand-ink">{search}</span>&rdquo;</>
                )}
              </motion.p>
            </AnimatePresence>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAll}
                className="flex items-center gap-1 text-xs font-semibold text-brand-muted underline-offset-2 hover:text-brand-ink hover:underline"
              >
                Clear all
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            )}
          </div>

          {/* 6-column Airbnb-style grid */}
          <AnimatePresence mode="wait">
            {filtered.length > 0 ? (
              <motion.div
                key={`grid-${activeFilter}-${sort}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
              >
                {filtered.map((tour, i) => (
                  <TourCard key={tour.slug} tour={tour} index={i} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <span className="text-5xl">🌍</span>
                <p className="mt-4 text-lg font-semibold text-brand-ink">No tours found</p>
                <p className="mt-1.5 text-sm text-brand-muted">Try a different category or clear the filter.</p>
                <button
                  type="button"
                  onClick={clearAll}
                  className="mt-5 rounded-xl border border-brand-border bg-white px-6 py-2.5 text-sm font-semibold text-brand-green shadow-sm transition-all hover:border-brand-green/30 hover:shadow-md"
                >
                  View all tours
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom CTA banner */}
          {filtered.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE }}
              className="relative mt-16 overflow-hidden rounded-[1.75rem] bg-brand-green px-8 py-10 text-center sm:px-12"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'%3E%3Cg fill='none' transform='rotate(45 14 14)'%3E%3Crect width='14' height='14' fill='%23ffffff' fill-opacity='0.04'/%3E%3Crect x='14' y='14' width='14' height='14' fill='%23E3A020' fill-opacity='0.04'/%3E%3C/g%3E%3C/svg%3E\")",
                  backgroundSize: "28px 28px",
                }}
              />
              <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-brand-gold/15 blur-3xl" />
              <div className="relative">
                <p className="text-sm font-semibold uppercase tracking-widest text-brand-gold">Can&apos;t find what you&apos;re looking for?</p>
                <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">We build custom tours too</h2>
                <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/80">
                  Tell us your group size, dates, and interests — we&apos;ll craft a bespoke itinerary just for you.
                </p>
                <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link
                    to={ROUTES.contact}
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3 text-sm font-semibold text-brand-green shadow-lg transition-all hover:bg-brand-cream"
                  >
                    Request a custom quote
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </Container>
      </div>
    </div>
  );
}
