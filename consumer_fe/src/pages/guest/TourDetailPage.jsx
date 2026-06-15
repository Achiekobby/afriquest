import { useState } from "react";
import { Link, useNavigate, useParams, Navigate } from "react-router";
import { motion } from "motion/react";
import Container from "../../components/layout/Container";
import { ROUTES } from "../../constants/routes";
import { getTourBySlug, getRelatedTours } from "../../data/toursData";
import { getWhatsAppUrl } from "../../config/env";

const EASE = [0.16, 1, 0.3, 1];

function StarRating({ value, reviews }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <svg className="h-4 w-4 fill-brand-orange text-brand-orange" viewBox="0 0 20 20" aria-hidden>
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
      <span className="text-sm font-bold text-brand-ink">{value}</span>
      {reviews && <span className="text-sm text-brand-muted">({reviews} reviews)</span>}
    </span>
  );
}

function CheckList({ items, included = true }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm text-brand-muted">
          {included ? (
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-brand-muted/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {item}
        </li>
      ))}
    </ul>
  );
}

function BookingCard({ tour, onBook }) {
  const isFilling = tour.spotsLeft <= 3;

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-brand-border/60 bg-white shadow-[0_16px_48px_-20px_rgba(28,43,38,0.28)]">
      <div className="border-b border-brand-border/40 p-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-muted">From</p>
            <p className="text-3xl font-bold text-brand-green">${tour.priceNum.toLocaleString()}</p>
            <p className="text-xs text-brand-muted">per person</p>
          </div>
          <StarRating value={tour.rating} />
        </div>

        {isFilling && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            Only {tour.spotsLeft} spots left on next departure
          </div>
        )}
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
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" /></svg>
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
  const tour = getTourBySlug(slug);
  const [activeImage, setActiveImage] = useState(0);

  if (!tour) return <Navigate to={ROUTES.tours} replace />;

  const related = getRelatedTours(slug);
  const goToBook = () => navigate(ROUTES.tourBook(slug));

  return (
    <div className="pb-24 lg:pb-16">
      {/* Breadcrumb */}
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

      {/* Gallery hero */}
      <section className="bg-white px-4 pt-6 sm:px-6 lg:px-8">
        <Container>
          <div className="grid gap-3 lg:grid-cols-[1.6fr_1fr] lg:grid-rows-2 lg:gap-3">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[1.25rem] lg:row-span-2 lg:aspect-auto lg:min-h-[420px]">
              <img
                src={tour.gallery[activeImage] ?? tour.image}
                alt={tour.name}
                className="h-full w-full object-cover transition-all duration-500"
              />
              {tour.badge && (
                <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${tour.badgeColor ?? "bg-white/90 text-brand-ink"}`}>
                  {tour.badge}
                </span>
              )}
            </div>
            {tour.gallery.slice(1, 3).map((img, i) => (
              <button
                key={img}
                type="button"
                onClick={() => setActiveImage(i + 1)}
                className={[
                  "relative hidden aspect-[16/10] overflow-hidden rounded-[1.25rem] lg:block",
                  activeImage === i + 1 ? "ring-2 ring-brand-green ring-offset-2" : "",
                ].join(" ")}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>

          {/* Thumbnail strip mobile */}
          <div className="mt-3 flex gap-2 overflow-x-auto lg:hidden">
            {tour.gallery.map((img, i) => (
              <button
                key={img}
                type="button"
                onClick={() => setActiveImage(i)}
                className={[
                  "h-16 w-20 shrink-0 overflow-hidden rounded-lg",
                  activeImage === i ? "ring-2 ring-brand-green" : "opacity-70",
                ].join(" ")}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* Content */}
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-14">
            {/* Main column */}
            <div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-brand-green/10 px-3 py-1 text-xs font-bold text-brand-green">{tour.country}</span>
                  {tour.categories.filter((c) => !["ghana", "kenya", "southafrica"].includes(c)).slice(0, 2).map((cat) => (
                    <span key={cat} className="rounded-full bg-brand-cream px-3 py-1 text-xs font-semibold capitalize text-brand-muted">{cat}</span>
                  ))}
                </div>

                <h1 className="mt-4 text-3xl font-bold text-brand-ink sm:text-4xl">{tour.name}</h1>
                <p className="mt-2 text-base text-brand-muted">{tour.location}</p>

                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <StarRating value={tour.rating} reviews={tour.reviews} />
                  <span className="text-sm text-brand-muted">{tour.duration}</span>
                  <span className="text-sm text-brand-muted">{tour.groupSize}</span>
                </div>

                <p className="mt-6 text-base leading-relaxed text-brand-muted">{tour.description}</p>

                {/* Highlights */}
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {tour.highlights.map((h) => (
                    <div key={h} className="flex items-center gap-2.5 rounded-xl border border-brand-border/50 bg-brand-cream/50 px-4 py-3 text-sm font-medium text-brand-ink">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-brand-green text-xs">✓</span>
                      {h}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Itinerary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: EASE }}
                className="mt-14"
              >
                <h2 className="text-xl font-bold text-brand-ink">Day-by-day itinerary</h2>
                <div className="relative mt-6 space-y-0">
                  <div aria-hidden className="absolute left-[19px] top-3 bottom-3 w-px bg-brand-border/60" />
                  {tour.itinerary.map((day) => (
                    <div key={day.day} className="relative flex gap-5 pb-8 last:pb-0">
                      <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-brand-green bg-white text-xs font-bold text-brand-green">
                        {day.day}
                      </div>
                      <div className="pt-1.5">
                        <p className="font-semibold text-brand-ink">{day.title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-brand-muted">{day.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Included / Not included */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: EASE }}
                className="mt-14 grid gap-8 sm:grid-cols-2"
              >
                <div>
                  <h2 className="text-lg font-bold text-brand-ink">What&apos;s included</h2>
                  <div className="mt-4"><CheckList items={tour.included} included /></div>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-brand-ink">Not included</h2>
                  <div className="mt-4"><CheckList items={tour.notIncluded} included={false} /></div>
                </div>
              </motion.div>
            </div>

            {/* Sticky booking sidebar */}
            <div className="hidden lg:block">
              <div className="sticky top-[88px]">
                <BookingCard tour={tour} onBook={goToBook} />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Related tours */}
      {related.length > 0 && (
        <section className="border-t border-brand-border/40 bg-brand-cream px-4 py-14 sm:px-6 lg:px-8">
          <Container>
            <h2 className="text-xl font-bold text-brand-ink">You might also like</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              {related.map((t) => (
                <Link
                  key={t.slug}
                  to={ROUTES.tourDetail(t.slug)}
                  className="group overflow-hidden rounded-xl border border-brand-border/60 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={t.image} alt={t.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
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
      )}

      {/* Mobile sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-brand-border/60 bg-white/95 px-4 py-3 shadow-[0_-8px_24px_-8px_rgba(28,43,38,0.15)] backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-brand-muted">From</p>
            <p className="text-lg font-bold text-brand-green">${tour.priceNum.toLocaleString()}<span className="text-xs font-normal text-brand-muted"> /person</span></p>
          </div>
          <button
            type="button"
            onClick={goToBook}
            className="flex-1 max-w-[200px] rounded-xl bg-brand-orange py-3 text-sm font-semibold text-white shadow-md"
          >
            Book now
          </button>
        </div>
      </div>

    </div>
  );
}
