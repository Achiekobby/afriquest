import { Link } from "react-router";
import { motion } from "motion/react";
import Container from "../layout/Container";
import { ROUTES } from "../../constants/routes";
import { features, stats } from "../../data/homeContent";
import { brand } from "../../data/brandContent";

const EASE = [0.16, 1, 0.3, 1];

const featureIcons = [
  (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.6 9h16.8M3.6 15h16.8" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.2 2.4 3.4 5.1 3.6 9-.2 3.9-1.4 6.6-3.6 9-2.2-2.4-3.4-5.1-3.6-9 .2-3.9 1.4-6.6 3.6-9z" />
    </svg>
  ),
  (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m0-4a4 4 0 110-8 4 4 0 010 8zm8 0a4 4 0 110-8 4 4 0 010 8z" />
    </svg>
  ),
  (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
];

const accentStyles = [
  {
    icon: "bg-brand-green/10 text-brand-green ring-brand-green/20",
    bar: "bg-brand-green",
    glow: "from-brand-green/10 to-transparent",
  },
  {
    icon: "bg-brand-orange/10 text-brand-orange ring-brand-orange/20",
    bar: "bg-brand-orange",
    glow: "from-brand-orange/10 to-transparent",
  },
  {
    icon: "bg-brand-gold/15 text-brand-gold ring-brand-gold/25",
    bar: "bg-brand-gold",
    glow: "from-brand-gold/15 to-transparent",
  },
];

function FeatureCard({ feature, index }) {
  const accent = accentStyles[index] ?? accentStyles[0];

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, ease: EASE, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-2xl border border-brand-border/70 bg-white p-6 shadow-[0_10px_36px_-22px_rgba(28,43,38,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/25 hover:shadow-[0_20px_44px_-20px_rgba(28,43,38,0.22)]"
    >
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent.glow} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
      <div className={`absolute left-0 top-6 h-10 w-1 rounded-r-full ${accent.bar}`} aria-hidden />

      <span className="pointer-events-none absolute right-5 top-4 text-5xl font-bold leading-none text-brand-border/40 transition-colors duration-300 group-hover:text-brand-border/60">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="relative flex gap-4">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1 ${accent.icon}`}>
          {featureIcons[index]}
        </div>
        <div className="min-w-0 pr-8">
          <h3 className="text-lg font-bold text-brand-ink transition-colors group-hover:text-brand-green">
            {feature.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-brand-muted">{feature.description}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function HomeFeatures() {
  return (
    <section className="relative overflow-hidden bg-brand-cream py-16 sm:py-20 lg:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'%3E%3Cg fill='none' transform='rotate(45 14 14)'%3E%3Crect width='14' height='14' fill='%232D5A47' fill-opacity='0.03'/%3E%3Crect x='14' y='14' width='14' height='14' fill='%23E3A020' fill-opacity='0.025'/%3E%3C/g%3E%3C/svg%3E\")",
          backgroundSize: "28px 28px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 top-1/3 h-64 w-64 rounded-full bg-brand-green/5 blur-3xl"
      />

      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-orange">
              Why AfriQwest
            </p>
            <h2 className="mt-3 text-3xl font-bold text-brand-ink sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
              More than a travel agency —{" "}
              <span className="text-brand-green">a cultural bridge</span>
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-brand-muted">
              {brand.originStory.split(".")[0]}.
              When you travel with us, you don&apos;t just visit Africa — you feel it, taste it, and live it.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-brand-border/60 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-sm"
                >
                  <p className="text-xl font-bold text-brand-green">{stat.value}</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-brand-muted">{stat.label}</p>
                </div>
              ))}
            </div>

            <Link
              to={ROUTES.whyUs}
              className="group mt-8 inline-flex items-center gap-2 rounded-xl border border-brand-border bg-white px-6 py-3 text-sm font-semibold text-brand-green shadow-sm transition-all duration-300 hover:border-brand-green/30 hover:shadow-md"
            >
              Learn more about us
              <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </motion.div>

          <div className="relative grid gap-5">
            <div
              aria-hidden
              className="pointer-events-none absolute left-6 top-8 hidden h-[calc(100%-4rem)] w-px bg-gradient-to-b from-brand-green/30 via-brand-orange/30 to-brand-gold/30 lg:block"
            />
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
