import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, Navigate } from "react-router";
import { motion } from "motion/react";
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Loader2,
  MapPin,
  Sparkles,
  Users,
  XCircle,
} from "lucide-react";
import publicListingsServiceApi from "../../apis/PublicListingsServiceApi";
import Container from "../../components/layout/Container";
import ImageLightbox from "../../components/misc/ImageLightbox";
import { ROUTES } from "../../constants/routes";
import { formatTourCategoryLabel } from "../../utils/operatorTourConstants";
import { buildListingsPayloadFromCountry } from "../../utils/publicListingsHelpers";
import { getWhatsAppUrl } from "../../config/env";

const EASE = [0.22, 1, 0.36, 1];

function StarRating({ value, reviews, light = false }) {
  if (!value) return null;

  return (
    <span className="inline-flex items-center gap-1.5">
      <svg
        className={`h-4 w-4 fill-brand-orange text-brand-orange ${light ? "fill-brand-gold text-brand-gold" : ""}`}
        viewBox="0 0 20 20"
        aria-hidden
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
      <span className={`text-sm font-bold ${light ? "text-white" : "text-brand-ink"}`}>{value}</span>
      {reviews ? (
        <span className={`text-sm ${light ? "text-white/60" : "text-brand-muted"}`}>({reviews} reviews)</span>
      ) : null}
    </span>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <section className="rounded-2xl border border-brand-border/60 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="font-heading text-lg font-bold text-brand-ink">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-brand-muted">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

function BookingCard({ tour, onBook }) {
  const isFilling = tour.spotsLeft <= 3 && tour.spotsLeft > 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-brand-border/60 bg-white shadow-sm">
      <div className="border-b border-brand-border/40 p-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-muted">From</p>
            <p className="text-3xl font-bold text-brand-green">{tour.priceLabel}</p>
            <p className="text-xs text-brand-muted">per person</p>
          </div>
          <StarRating value={tour.rating} reviews={tour.reviews} />
        </div>

        {isFilling ? (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            Only {tour.spotsLeft} spots left on next departure
          </div>
        ) : null}
      </div>

      <div className="space-y-3 p-6 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-brand-muted">Duration</span>
          <span className="font-semibold text-brand-ink">{tour.duration}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-brand-muted">Group size</span>
          <span className="font-semibold text-brand-ink">{tour.groupSize}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-brand-muted">Next departure</span>
          <span className="font-semibold text-brand-ink">{tour.nextDate}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-brand-muted">Country</span>
          <span className="font-semibold text-brand-ink">{tour.country}</span>
        </div>
      </div>

      <div className="space-y-3 border-t border-brand-border/40 p-6">
        <button
          type="button"
          onClick={onBook}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-orange py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(212,97,26,0.6)] transition-all hover:bg-brand-orange-dark"
        >
          Book this tour
          <ChevronRight className="h-4 w-4" strokeWidth={2.2} aria-hidden />
        </button>
        <a
          href={getWhatsAppUrl(`Hello AfriQwest, I'm interested in ${tour.name}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-brand-border bg-white py-3 text-sm font-semibold text-brand-green transition-all hover:border-brand-green/30 hover:bg-brand-cream"
        >
          Ask a question
        </a>
        <p className="text-center text-[11px] text-brand-muted">Free cancellation up to 30 days before departure</p>
      </div>
    </div>
  );
}

export default function TourDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    if (!slug) return undefined;

    let active = true;

    async function loadTour() {
      setLoading(true);
      setNotFound(false);

      const result = await publicListingsServiceApi.getListing(slug);
      if (!active) return;

      if (!result.ok || !result.tour) {
        setLoading(false);
        setTour(null);
        setRelated([]);
        setNotFound(true);
        return;
      }

      setTour(result.tour);
      setLoading(false);

      const relatedResult = await publicListingsServiceApi.listListings(
        buildListingsPayloadFromCountry(result.tour.country),
        { page: 1, per_page: 6 },
      );

      if (!active) return;

      setRelated(
        (relatedResult.items || [])
          .filter((item) => item.slug !== slug)
          .slice(0, 3),
      );
    }

    loadTour();
    return () => {
      active = false;
    };
  }, [slug]);

  const gallery = useMemo(() => tour?.gallery || [], [tour]);
  const coverImage = tour?.image || gallery[0] || "";

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-green" strokeWidth={2} aria-hidden />
      </div>
    );
  }

  if (notFound || !tour) return <Navigate to={ROUTES.tours} replace />;

  const goToBook = () => navigate(ROUTES.tourBook(slug));
  const categoryTags = tour.categories
    .filter((cat) => !["ghana", "kenya", "southafrica"].includes(cat))
    .map(formatTourCategoryLabel);

  return (
    <div className="pb-24 lg:pb-16">
      <div className="border-b border-brand-border/40 bg-white px-4 py-3 sm:px-6 lg:px-8">
        <Container>
          <nav className="flex items-center gap-2 text-xs text-brand-muted">
            <Link to={ROUTES.home} className="hover:text-brand-green">Home</Link>
            <span>/</span>
            <Link to={ROUTES.tours} className="hover:text-brand-green">Tours</Link>
            <span>/</span>
            <span className="truncate font-medium text-brand-ink">{tour.name}</span>
          </nav>
        </Container>
      </div>

      <section className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Container className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="relative overflow-hidden rounded-[1.75rem] border border-brand-border/60 bg-brand-ink text-white shadow-xl"
          >
            <div className="absolute inset-0">
              {coverImage ? (
                <img src={coverImage} alt="" className="h-full w-full object-cover opacity-40" />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-r from-brand-ink via-brand-ink/90 to-brand-ink/60" />
            </div>

            <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-brand-green/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-gold">
                    {tour.country}
                  </span>
                  {tour.featured ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-orange px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                      <Sparkles className="h-3 w-3" strokeWidth={2.5} aria-hidden />
                      Featured
                    </span>
                  ) : null}
                  {categoryTags.slice(0, 2).map((cat) => (
                    <span
                      key={cat}
                      className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold capitalize text-white backdrop-blur-sm"
                    >
                      {cat}
                    </span>
                  ))}
                  {tour.badge ? (
                    <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
                      {tour.badge}
                    </span>
                  ) : null}
                </div>

                <h1 className="mt-4 font-heading text-3xl font-bold sm:text-4xl">{tour.name}</h1>

                {tour.location ? (
                  <p className="mt-3 flex items-start gap-1.5 text-sm text-white/80">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" strokeWidth={2} aria-hidden />
                    <span className="font-medium">{tour.location}</span>
                  </p>
                ) : null}

                <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-white/70">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4 text-brand-gold" strokeWidth={2} aria-hidden />
                    {tour.duration}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-brand-gold" strokeWidth={2} aria-hidden />
                    {tour.groupSize}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4 text-brand-gold" strokeWidth={2} aria-hidden />
                    Departs {tour.nextDate}
                  </span>
                  {tour.rating ? (
                    <StarRating value={tour.rating} reviews={tour.reviews} light />
                  ) : null}
                </div>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-right backdrop-blur-sm lg:min-w-[160px]">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/50">From</p>
                <p className="text-2xl font-bold text-brand-gold">{tour.priceLabel}</p>
                <p className="text-xs text-white/50">per person</p>
              </div>
            </div>
          </motion.div>

          {gallery.length > 0 ? (
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted">Photo gallery</p>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {gallery.map((url, index) => {
                  const isCover = index === 0;
                  return (
                    <button
                      key={`${url}-${index}`}
                      type="button"
                      onClick={() => setLightboxIndex(index)}
                      className={[
                        "group relative h-28 w-40 shrink-0 cursor-zoom-in overflow-hidden rounded-xl shadow-sm transition-all hover:ring-2 hover:ring-brand-green/40",
                        isCover
                          ? "border-2 border-brand-green/50 ring-1 ring-brand-green/20"
                          : "border border-brand-border/60",
                      ].join(" ")}
                      aria-label={isCover ? "View cover image full size" : `View gallery image ${index + 1} full size`}
                    >
                      <img
                        src={url}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {isCover ? (
                        <span className="absolute bottom-2 left-2 rounded-full bg-brand-green px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                          Cover
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Section title="About this tour" subtitle="What you'll experience">
                <p className="text-sm leading-relaxed text-brand-muted">{tour.description}</p>
                {tour.highlights.length > 0 ? (
                  <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                    {tour.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-brand-ink">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" strokeWidth={2} aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </Section>

              {tour.itinerary.length > 0 ? (
                <Section title="Itinerary" subtitle="Day-by-day plan">
                  <div className="space-y-4">
                    {tour.itinerary.map((day) => (
                      <div
                        key={`${day.day}-${day.title}`}
                        className="flex gap-4 rounded-xl border border-brand-border/50 bg-brand-cream/40 p-4"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-green/10 text-sm font-bold text-brand-green">
                          {day.day}
                        </div>
                        <div>
                          <p className="font-semibold text-brand-ink">{day.title}</p>
                          <p className="mt-1 text-sm leading-relaxed text-brand-muted">{day.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              ) : null}

              <div className="grid gap-6 sm:grid-cols-2">
                <Section title="Included">
                  <ul className="space-y-2">
                    {tour.included.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-brand-ink">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" strokeWidth={2} aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Section>
                <Section title="Not included">
                  <ul className="space-y-2">
                    {tour.notIncluded.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-brand-muted">
                        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-muted/60" strokeWidth={2} aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Section>
              </div>
            </div>

            <div className="space-y-6">
              <div className="lg:sticky lg:top-[88px]">
                <BookingCard tour={tour} onBook={goToBook} />
              </div>

              {tour.departureDates?.length > 0 ? (
                <Section title="Departures" subtitle="Scheduled dates & availability">
                  <div className="space-y-3">
                    {tour.departureDates.map((dep) => (
                      <div key={dep.date} className="rounded-xl border border-brand-border/60 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-brand-ink">{dep.dateLabel || dep.date}</p>
                            {dep.label ? <p className="mt-0.5 text-xs text-brand-muted">{dep.label}</p> : null}
                          </div>
                          <span className="shrink-0 rounded-full bg-brand-green/10 px-2.5 py-1 text-[11px] font-bold text-brand-green">
                            {dep.spotsLeft} / {dep.spotsTotal} left
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              ) : null}
            </div>
          </div>
        </Container>
      </section>

      {related.length > 0 ? (
        <section className="border-t border-brand-border/40 bg-brand-cream px-4 py-14 sm:px-6 lg:px-8">
          <Container>
            <h2 className="font-heading text-xl font-bold text-brand-ink">You might also like</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              {related.map((t) => (
                <Link
                  key={t.slug}
                  to={ROUTES.tourDetail(t.slug)}
                  className="group overflow-hidden rounded-xl border border-brand-border/60 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-semibold text-brand-green">{t.country}</p>
                    <p className="mt-1 text-sm font-bold text-brand-ink group-hover:text-brand-green">{t.name}</p>
                    <p className="mt-1 text-xs text-brand-muted">{t.duration} · {t.priceLabel}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-brand-border/60 bg-white/95 px-4 py-3 shadow-[0_-8px_24px_-8px_rgba(28,43,38,0.15)] backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-brand-muted">From</p>
            <p className="text-lg font-bold text-brand-green">
              {tour.priceLabel}
              <span className="text-xs font-normal text-brand-muted"> /person</span>
            </p>
          </div>
          <button
            type="button"
            onClick={goToBook}
            className="max-w-[200px] flex-1 rounded-xl bg-brand-orange py-3 text-sm font-semibold text-white shadow-md"
          >
            Book now
          </button>
        </div>
      </div>

      <ImageLightbox
        open={lightboxIndex != null}
        images={gallery}
        index={lightboxIndex ?? 0}
        onIndexChange={setLightboxIndex}
        onClose={() => setLightboxIndex(null)}
        alt={tour.name}
      />
    </div>
  );
}
