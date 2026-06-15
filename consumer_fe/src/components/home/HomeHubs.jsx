import { Link } from "react-router";
import { motion } from "motion/react";
import Container from "../layout/Container";
import { ROUTES } from "../../constants/routes";
import { operatingHubs } from "../../data/homeContent";

const EASE = [0.16, 1, 0.3, 1];

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

function HubCard({ hub, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, ease: EASE, delay: index * 0.1 }}
    >
      <Link
        to={ROUTES.toursWithCountry(hub.filterId)}
        className="group block overflow-hidden rounded-[1.75rem] border border-brand-border/60 bg-white shadow-[0_12px_40px_-24px_rgba(28,43,38,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_-20px_rgba(28,43,38,0.28)]"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={hub.image}
            alt={hub.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/70 via-brand-ink/10 to-transparent" />
          <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${hub.badge}`}>
            {hub.region}
          </span>
          <p className="absolute bottom-3 left-4 text-xl font-bold text-white">{hub.name}</p>
        </div>
        <div className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange">{hub.tagline}</p>
          <p className="mt-2 text-sm leading-relaxed text-brand-muted">{hub.desc}</p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-green transition-colors group-hover:text-brand-green-dark">
            View tours
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export default function HomeHubs() {
  return (
    <section className="relative overflow-hidden bg-brand-cream py-16 sm:py-20">
      <KentePattern />
      <div aria-hidden className="pointer-events-none absolute -left-20 top-1/3 h-64 w-64 rounded-full bg-brand-orange/5 blur-3xl" />

      <Container className="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-orange">Where we operate</p>
          <h2 className="mt-3 text-3xl font-bold text-brand-ink sm:text-4xl">Our three hubs</h2>
          <p className="mt-3 text-base leading-relaxed text-brand-muted">
            Three countries. Deeply known. Authentically delivered.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {operatingHubs.map((hub, index) => (
            <HubCard key={hub.name} hub={hub} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}
