import { Link } from "react-router";
import { motion } from "motion/react";
import Container from "../layout/Container";
import { ROUTES } from "../../constants/routes";
import { topDestinations } from "../../data/homeContent";

const EASE = [0.16, 1, 0.3, 1];

function DestinationCard({ destination, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, ease: EASE, delay: index * 0.08 }}
    >
      <Link
        to={ROUTES.tourDetail(destination.slug)}
        className="group flex h-full flex-col overflow-hidden rounded-xl border border-brand-border/70 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-green/25 hover:shadow-md sm:flex-row"
      >
        <div className="relative h-36 shrink-0 overflow-hidden sm:h-auto sm:w-28 md:w-32">
          <img
            src={destination.image}
            alt={destination.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-brand-ink/10 transition-colors group-hover:bg-brand-ink/5" />
        </div>

        <div className="flex flex-1 flex-col justify-center px-4 py-3.5 sm:py-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-orange">
            {destination.region}
          </p>
          <h3 className="mt-0.5 text-base font-bold text-brand-ink group-hover:text-brand-green">
            {destination.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-brand-muted">
            {destination.tagline}
          </p>
          <div className="mt-2.5 flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-brand-green">{destination.tours}</span>
            <span className="text-xs font-semibold text-brand-orange transition-transform duration-300 group-hover:translate-x-0.5">
              Explore →
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export default function HomeDestinations() {
  return (
    <section className="border-y border-brand-border bg-white py-12 sm:py-14">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-orange">
              Our three hubs
            </p>
            <h2 className="mt-1.5 text-2xl font-bold text-brand-ink sm:text-[1.65rem]">
              Ghana, Kenya &amp; South Africa
            </h2>
          </div>
          <Link
            to={ROUTES.tours}
            className="text-sm font-semibold text-brand-orange transition-colors hover:text-brand-orange-dark"
          >
            View all tours →
          </Link>
        </motion.div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {topDestinations.map((destination, index) => (
            <DestinationCard key={destination.name} destination={destination} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}
