import { Link } from "react-router";
import { motion } from "motion/react";
import Container from "../layout/Container";
import { ROUTES } from "../../constants/routes";
import { upcomingTours } from "../../data/homeContent";

const EASE = [0.16, 1, 0.3, 1];

function SpotsBar({ spotsLeft, totalSpots }) {
  const filled = Math.round(((totalSpots - spotsLeft) / totalSpots) * 100);
  const urgent = spotsLeft <= 3;

  return (
    <div className="mt-4">
      <div className="mb-1.5 flex items-center justify-between text-[11px]">
        <span className={urgent ? "font-semibold text-brand-orange" : "text-brand-muted"}>
          {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left
        </span>
        <span className="text-brand-muted">{totalSpots} seats</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-brand-border/60">
        <div
          className={[
            "h-full rounded-full transition-all duration-500",
            urgent ? "bg-brand-orange" : "bg-brand-green",
          ].join(" ")}
          style={{ width: `${filled}%` }}
        />
      </div>
    </div>
  );
}

function UpcomingTourCard({ tour, index }) {
  const urgent = tour.spotsLeft <= 3;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.6, ease: EASE, delay: index * 0.08 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-brand-border/70 bg-white shadow-[0_10px_36px_-20px_rgba(28,43,38,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_-18px_rgba(28,43,38,0.25)]"
    >
      <div className="relative aspect-[5/4] overflow-hidden">
        <img
          src={tour.image}
          alt={tour.name}
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/75 via-brand-ink/20 to-transparent" />

        {/* Departure date — glass block */}
        <div className="absolute left-3 top-3 overflow-hidden rounded-xl border border-white/40 bg-white/20 shadow-lg backdrop-blur-md">
          <div className="flex flex-col items-center px-3 py-2 text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">
              {tour.departMonth}
            </span>
            <span className="text-2xl font-bold leading-none text-white">{tour.departDay}</span>
          </div>
        </div>

        {urgent && (
          <span className="absolute right-3 top-3 rounded-full bg-brand-orange px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
            Filling fast
          </span>
        )}

        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/75">
            {tour.country}
          </p>
          <h3 className="mt-0.5 line-clamp-2 text-base font-bold leading-snug text-white">
            {tour.name}
          </h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-3 text-xs text-brand-muted">
          <span className="inline-flex items-center gap-1">
            <svg className="h-3.5 w-3.5 text-brand-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            {tour.departDate}
          </span>
          <span className="h-1 w-1 rounded-full bg-brand-border" />
          <span>{tour.duration}</span>
        </div>

        <SpotsBar spotsLeft={tour.spotsLeft} totalSpots={tour.totalSpots} />

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-brand-border/60 pt-4">
          <p className="text-sm font-bold text-brand-green">{tour.priceLabel}</p>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-orange transition-all duration-300 group-hover:gap-1.5">
            Reserve
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </div>
      </div>

      <Link
        to={ROUTES.tourBook(tour.slug)}
        className="absolute inset-0 z-10 rounded-2xl"
        aria-label={`Book ${tour.name}`}
      />
    </motion.article>
  );
}

export default function HomeUpcomingTours() {
  return (
    <section className="relative overflow-hidden border-y border-brand-border bg-white py-16 sm:py-20 lg:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Ccircle cx='2' cy='2' r='1' fill='%232D5A47' fill-opacity='0.06'/%3E%3C/svg%3E\")",
          backgroundSize: "24px 24px",
        }}
      />

      <Container className="relative">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="max-w-xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-orange">
              Departures open
            </p>
            <h2 className="mt-3 text-3xl font-bold text-brand-ink sm:text-4xl">
              Popular upcoming tours
            </h2>
            <p className="mt-3 text-base leading-relaxed text-brand-muted">
              Limited-seat departures across Ghana, Kenya, and South Africa — reserve early to
              secure your spot on these in-demand journeys.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
            className="flex shrink-0 items-center gap-3"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-brand-cream px-4 py-2 text-sm font-medium text-brand-green">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-orange opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-orange" />
              </span>
              {upcomingTours.length} tours departing soon
            </span>
            <Link
              to={ROUTES.tours}
              className="hidden text-sm font-semibold text-brand-orange transition-colors hover:text-brand-orange-dark sm:inline-flex sm:items-center sm:gap-1"
            >
              View all upcoming trips
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </motion.div>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {upcomingTours.map((tour, index) => (
            <UpcomingTourCard key={tour.slug} tour={tour} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
          className="mt-10 text-center sm:hidden"
        >
          <Link to={ROUTES.tours} className="btn-secondary px-6 py-3">
            View all upcoming trips
          </Link>
        </motion.div>
      </Container>
    </section>
  );
}
