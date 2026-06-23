import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Loader2 } from "lucide-react";
import publicListingsServiceApi from "../../apis/PublicListingsServiceApi";
import Container from "../../components/layout/Container";
import { ROUTES } from "../../constants/routes";
import { mapServerPagination } from "../../utils/adminPaginationHelpers";
import {
  buildListingsPayload,
  COUNTRY_FILTER_OPTIONS,
  formatDepartureDateLabel,
  getPackageLineLabel,
  LISTING_SORT_OPTIONS,
  PACKAGE_FILTER_OPTIONS,
  resolveCountryFilterFromParams,
  resolvePackageFilterFromParams,
  tourHasDepartureOnDate,
  tourMatchesPackageLine,
} from "../../utils/publicListingsHelpers";

const EASE = [0.16, 1, 0.3, 1];

function StarRating({ value }) {
  if (!value) return null;

  return (
    <span className="flex items-center gap-0.5">
      <svg className="h-3 w-3 fill-brand-orange text-brand-orange" viewBox="0 0 20 20" aria-hidden>
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
      <span className="text-[11px] font-semibold text-brand-ink">{Number(value).toFixed(1)}</span>
    </span>
  );
}

function TourCard({ tour, index }) {
  const [imgError, setImgError] = useState(false);
  const isFilling = tour.spotsLeft <= 3 && tour.spotsLeft > 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.4, ease: EASE, delay: Math.min(index * 0.04, 0.28) }}
      className="group flex flex-col"
    >
      <Link
        to={ROUTES.tourDetail(tour.slug)}
        aria-label={`View ${tour.name}`}
        className="flex flex-col gap-2.5 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2"
      >
        <div className="relative aspect-square overflow-hidden rounded-xl bg-brand-border/30">
          {!imgError && tour.image ? (
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

          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {tour.badge ? (
            <span className={`absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${tour.badgeColor ?? "bg-white/90 text-brand-ink"}`}>
              {tour.badge}
            </span>
          ) : null}

          {isFilling ? (
            <span className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-full bg-red-500/90 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              {tour.spotsLeft} spots left
            </span>
          ) : null}
        </div>

        <div className="flex flex-col gap-0.5 px-0.5">
          <div className="flex items-start justify-between gap-2">
            <p className="line-clamp-1 text-sm font-semibold text-brand-ink transition-colors group-hover:text-brand-green">
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

function FilterChip({ option, active, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(option.id)}
      className={[
        "flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition-all duration-200",
        active
          ? "border-brand-ink bg-brand-ink text-white shadow-sm"
          : "border-brand-border/70 bg-white/80 text-brand-muted hover:border-brand-green/35 hover:text-brand-ink",
      ].join(" ")}
    >
      <span className="text-sm leading-none">{option.icon}</span>
      <span className="whitespace-nowrap">{option.label}</span>
    </button>
  );
}

function SortDropdown({ value, onChange, compact = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handler(event) {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = LISTING_SORT_OPTIONS.find((option) => option.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={[
          "flex items-center gap-1.5 rounded-full border border-brand-border/70 bg-white/80 font-semibold text-brand-ink shadow-sm transition-all hover:border-brand-green/35 hover:shadow-md",
          compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-xs",
        ].join(" ")}
      >
        <svg className="h-3.5 w-3.5 text-brand-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M10 12h4" />
        </svg>
        {current?.label}
        <svg className={`h-3 w-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.ul
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-30 mt-2 min-w-[220px] overflow-hidden rounded-xl border border-brand-border/60 bg-white shadow-xl"
          >
            {LISTING_SORT_OPTIONS.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`flex w-full flex-col items-start px-4 py-2.5 text-left transition-colors hover:bg-brand-cream ${option.value === value ? "bg-brand-green/5" : ""}`}
                >
                  <span className={`text-xs ${option.value === value ? "font-bold text-brand-green" : "font-semibold text-brand-ink"}`}>
                    {option.label}
                  </span>
                  <span className="mt-0.5 text-[10px] text-brand-muted">{option.description}</span>
                </button>
              </li>
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function describeActiveFilters(countryFilter, sort, departureDate, packageFilter) {
  const parts = [];
  const country = COUNTRY_FILTER_OPTIONS.find((option) => option.id === countryFilter);
  if (country?.apiCountry) parts.push(country.label);

  if (packageFilter) {
    parts.push(getPackageLineLabel(packageFilter));
  }

  if (departureDate) {
    parts.push(`Departs ${formatDepartureDateLabel(departureDate)}`);
  }

  const sortOption = LISTING_SORT_OPTIONS.find((option) => option.value === sort);
  if (sort !== "default" && sortOption) parts.push(sortOption.label);

  return parts.length ? parts.join(" · ") : "All published tours";
}

function buildToursSearchParams({ country, date, package: packageId }) {
  const params = new URLSearchParams();
  if (country && country !== "all") params.set("country", country);
  if (packageId) params.set("package", packageId);
  if (date) params.set("date", date);
  return params;
}

export default function ToursPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const countryParam = searchParams.get("country");
  const packageParam = searchParams.get("package");
  const dateParam = searchParams.get("date") || "";
  const [activeFilter, setActiveFilter] = useState(() => {
    const resolvedPackage = resolvePackageFilterFromParams(packageParam);
    if (resolvedPackage && !countryParam) return "ghana";
    return resolveCountryFilterFromParams(countryParam);
  });
  const [activePackage, setActivePackage] = useState(() => resolvePackageFilterFromParams(packageParam));
  const [activeDate, setActiveDate] = useState(dateParam);
  const [sort, setSort] = useState("default");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [tours, setTours] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterScrolled, setFilterScrolled] = useState(false);
  const filterRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const packageScrollContainerRef = useRef(null);

  const showPackageFilters = activeFilter === "ghana" || activeFilter === "all";

  const paginationMeta = useMemo(
    () => mapServerPagination(pagination, { page }),
    [pagination, page],
  );

  const loadListings = useCallback(async () => {
    setLoading(true);
    setError("");

    const payload = buildListingsPayload({
      countryFilter: activePackage ? "ghana" : activeFilter,
      sort,
      departureDate: activeDate,
      packageFilter: activePackage,
    });
    const result = await publicListingsServiceApi.listListings(payload, { page, per_page: 15 });

    setLoading(false);

    if (!result.ok) {
      setTours([]);
      setPagination(null);
      setError(result.reason || result.message || "Could not load tours.");
      return;
    }

    setTours(result.items);
    setPagination(result.pagination);
  }, [activeFilter, activePackage, sort, page, activeDate]);

  useEffect(() => {
    const resolvedPackage = resolvePackageFilterFromParams(packageParam);
    setActivePackage(resolvedPackage);
    if (resolvedPackage && !countryParam) {
      setActiveFilter("ghana");
      return;
    }
    setActiveFilter(resolveCountryFilterFromParams(countryParam));
  }, [countryParam, packageParam]);

  useEffect(() => {
    setActiveDate(dateParam);
    setPage(1);
  }, [dateParam]);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  useEffect(() => {
    function onScroll() {
      if (!filterRef.current) return;
      const rect = filterRef.current.getBoundingClientRect();
      setFilterScrolled(rect.top <= 72);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const visibleTours = useMemo(() => {
    let list = tours;

    if (activePackage) {
      list = list.filter((tour) => tourMatchesPackageLine(tour, activePackage));
    }

    if (activeDate) {
      list = list.filter((tour) => tourHasDepartureOnDate(tour, activeDate));
    }

    if (!search.trim()) return list;

    const query = search.toLowerCase();
    return list.filter(
      (tour) =>
        tour.name.toLowerCase().includes(query) ||
        tour.location.toLowerCase().includes(query) ||
        tour.country.toLowerCase().includes(query) ||
        tour.categories.some((category) => category.includes(query)),
    );
  }, [tours, search, activeDate, activePackage]);

  const applySearchParams = useCallback(({ country, date, package: packageId }) => {
    const params = buildToursSearchParams({ country, date, package: packageId });
    setSearchParams(params, { replace: true });
  }, [setSearchParams]);

  const handleFilter = useCallback((id) => {
    setPage(1);
    setActiveFilter(id);
    const keepPackage = id === "ghana" || id === "all";
    const nextPackage = keepPackage ? activePackage : "";
    if (!keepPackage) {
      setActivePackage("");
    }
    applySearchParams({
      country: id === "all" ? undefined : id,
      date: activeDate || undefined,
      package: nextPackage || undefined,
    });
    if (scrollContainerRef.current) {
      const button = scrollContainerRef.current.querySelector(`[data-country="${id}"]`);
      button?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    }
  }, [applySearchParams, activeDate, activePackage]);

  const handlePackageFilter = useCallback((packageId) => {
    setPage(1);
    const nextPackage = activePackage === packageId ? "" : packageId;
    setActivePackage(nextPackage);
    const nextCountry = nextPackage
      ? "ghana"
      : activeFilter === "all"
        ? undefined
        : activeFilter;
    if (nextPackage && activeFilter === "all") {
      setActiveFilter("ghana");
    }
    applySearchParams({
      country: nextCountry,
      date: activeDate || undefined,
      package: nextPackage || undefined,
    });
    if (packageScrollContainerRef.current) {
      const button = packageScrollContainerRef.current.querySelector(`[data-package="${packageId}"]`);
      button?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    }
  }, [activePackage, activeFilter, activeDate, applySearchParams]);

  function handleSortChange(value) {
    setPage(1);
    setSort(value);
  }

  function clearAll() {
    setPage(1);
    setActiveFilter("all");
    setActivePackage("");
    setActiveDate("");
    setSort("default");
    setSearch("");
    setSearchParams({}, { replace: true });
  }

  function clearDateFilter() {
    setPage(1);
    setActiveDate("");
    applySearchParams({
      country: activeFilter === "all" ? undefined : activeFilter,
      date: undefined,
      package: activePackage || undefined,
    });
  }

  function clearPackageFilter() {
    setPage(1);
    setActivePackage("");
    applySearchParams({
      country: activeFilter === "all" ? undefined : activeFilter,
      date: activeDate || undefined,
      package: undefined,
    });
  }

  const hasActiveFilters =
    activeFilter !== "all" ||
    Boolean(activePackage) ||
    sort !== "default" ||
    search.trim() !== "" ||
    Boolean(activeDate);

  return (
    <div className="min-h-screen bg-white">
      <div
        ref={filterRef}
        className={[
          "sticky top-[72px] z-40 w-full border-b transition-all duration-300 relative",
          filterScrolled
            ? "border-brand-border/60 bg-white/95 shadow-[0_4px_20px_-8px_rgba(28,43,38,0.12)] backdrop-blur-xl"
            : "border-brand-border/40 bg-brand-cream/90",
        ].join(" ")}
      >
        <div
          aria-hidden
          className="h-0.5 bg-gradient-to-r from-brand-green via-brand-gold to-brand-orange"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'%3E%3Cg fill='none' transform='rotate(45 14 14)'%3E%3Crect width='14' height='14' fill='%232D5A47' fill-opacity='0.03'/%3E%3Crect x='14' y='14' width='14' height='14' fill='%23E3A020' fill-opacity='0.025'/%3E%3C/g%3E%3C/svg%3E\")",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative px-4 sm:px-6 lg:px-8">
          <Container className="py-2.5 sm:py-3">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="flex flex-wrap items-center gap-x-3 gap-y-2"
            >
              <div className="flex shrink-0 items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-brand-ink sm:text-xl">Tours</h1>
                <span className="rounded-md bg-brand-green/12 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-brand-green">
                  {loading ? "…" : paginationMeta.totalItems || tours.length}
                </span>
              </div>

              <div className="relative min-w-0 flex-1 sm:max-w-xs lg:max-w-sm">
                <svg
                  className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-brand-muted"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search tours…"
                  className="h-8 w-full rounded-full border border-brand-border/70 bg-white/90 pl-8 pr-8 text-sm text-brand-ink placeholder:text-brand-muted/70 outline-none transition-all focus:border-brand-green/50 focus:ring-2 focus:ring-brand-green/15"
                />
                {search ? (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-ink"
                  >
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden>
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                ) : null}
              </div>

              <div className="shrink-0">
                <SortDropdown value={sort} onChange={handleSortChange} compact />
              </div>
            </motion.div>

            <div className="mt-2 flex min-w-0 items-center gap-2 border-t border-brand-border/35 pt-2">
              <div
                ref={scrollContainerRef}
                className="flex shrink-0 items-center gap-1 overflow-x-auto"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {COUNTRY_FILTER_OPTIONS.map((option) => (
                  <div key={option.id} data-country={option.id}>
                    <FilterChip
                      option={option}
                      active={activeFilter === option.id}
                      onClick={handleFilter}
                    />
                  </div>
                ))}
              </div>

              {showPackageFilters ? (
                <>
                  <span className="h-3.5 w-px shrink-0 bg-brand-border/60" aria-hidden />
                  <div
                    ref={packageScrollContainerRef}
                    className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    {PACKAGE_FILTER_OPTIONS.map((option) => (
                      <div key={option.id} data-package={option.id}>
                        <FilterChip
                          option={option}
                          active={activePackage === option.id}
                          onClick={handlePackageFilter}
                        />
                      </div>
                    ))}
                  </div>
                </>
              ) : null}
            </div>

            <AnimatePresence>
              {hasActiveFilters ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-brand-border/35 pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted">
                      {loading ? "…" : visibleTours.length}
                      {!search.trim() && paginationMeta.totalItems ? ` of ${paginationMeta.totalItems}` : ""}
                      tour{visibleTours.length === 1 ? "" : "s"}
                    </span>
                    <span className="text-brand-border">·</span>
                    <span className="text-xs font-medium text-brand-green">
                      {describeActiveFilters(activeFilter, sort, activeDate, activePackage)}
                    </span>
                    {search.trim() ? (
                      <>
                        <span className="text-brand-border">·</span>
                        <span className="text-xs text-brand-muted">
                          &ldquo;<span className="font-medium text-brand-ink">{search}</span>&rdquo;
                        </span>
                      </>
                    ) : null}
                    {activeDate ? (
                      <button
                        type="button"
                        onClick={clearDateFilter}
                        className="rounded-full bg-brand-orange/10 px-2 py-0.5 text-[10px] font-semibold text-brand-orange hover:bg-brand-orange/15"
                      >
                        Clear date ×
                      </button>
                    ) : null}
                    {activePackage ? (
                      <button
                        type="button"
                        onClick={clearPackageFilter}
                        className="rounded-full bg-brand-orange/10 px-2 py-0.5 text-[10px] font-semibold text-brand-orange hover:bg-brand-orange/15"
                      >
                        Clear package ×
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={clearAll}
                      className="ml-auto text-[10px] font-semibold text-brand-muted underline-offset-2 hover:text-brand-ink hover:underline"
                    >
                      Clear all
                    </button>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </Container>
        </div>
      </div>

      <div className="px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <Container>
          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex min-h-[280px] items-center justify-center"
              >
                <Loader2 className="h-8 w-8 animate-spin text-brand-green" strokeWidth={2} aria-hidden />
              </motion.div>
            ) : visibleTours.length > 0 ? (
              <motion.div
                key={`grid-${activeFilter}-${sort}-${page}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
              >
                {visibleTours.map((tour, index) => (
                  <TourCard key={tour.slug} tour={tour} index={index} />
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
                <p className="mt-1.5 text-sm text-brand-muted">
                  {activeDate
                    ? "Try another departure date, country, or reset your filters."
                    : "Try another country or reset the sort filters."}
                </p>
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

          {!loading && paginationMeta.totalPages > 1 ? (
            <nav aria-label="Tour listings pagination" className="mt-10 flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="rounded-xl border border-brand-border px-4 py-2 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-cream disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-brand-muted">
                Page <span className="font-semibold text-brand-ink">{page}</span> of {paginationMeta.totalPages}
              </span>
              <button
                type="button"
                disabled={page >= paginationMeta.totalPages}
                onClick={() => setPage((current) => current + 1)}
                className="rounded-xl border border-brand-border px-4 py-2 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-cream disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </nav>
          ) : null}

          {visibleTours.length > 0 ? (
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
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </div>
              </div>
            </motion.div>
          ) : null}
        </Container>
      </div>
    </div>
  );
}
