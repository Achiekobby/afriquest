import { Link } from "react-router";
import { motion } from "motion/react";
import Container from "../../components/layout/Container";
import { NAV_FEATURES } from "../../components/navigation/navConfig";
import { ROUTES } from "../../constants/routes";
import { images } from "../../config/images";
import { getWhatsAppUrl } from "../../config/env";
import {
  brand,
  whyChooseAfriQwest,
  immersionExperiences,
  experienceCategories,
} from "../../data/brandContent";

const EASE = [0.16, 1, 0.3, 1];

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.65, ease: EASE, delay },
});

const reasonIcons = [
  (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m0-4a4 4 0 110-8 4 4 0 010 8zm8 0a4 4 0 110-8 4 4 0 010 8z" />
    </svg>
  ),
  (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
  (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  ),
  (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  ),
];

const accents = [
  "bg-brand-green/10 text-brand-green ring-brand-green/20",
  "bg-brand-orange/10 text-brand-orange ring-brand-orange/20",
  "bg-brand-gold/15 text-brand-gold ring-brand-gold/25",
  "bg-brand-green/10 text-brand-green ring-brand-green/20",
  "bg-brand-orange/10 text-brand-orange ring-brand-orange/20",
];

export default function WhyUsPage() {
  return (
    <div className="overflow-x-hidden">

      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-green pb-0 pt-14 sm:pt-16 lg:pt-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'%3E%3Cg fill='none' transform='rotate(45 14 14)'%3E%3Crect width='14' height='14' fill='%232D5A47' fill-opacity='0.03'/%3E%3Crect x='14' y='14' width='14' height='14' fill='%23E3A020' fill-opacity='0.025'/%3E%3C/g%3E%3C/svg%3E\")",
            backgroundSize: "28px 28px",
          }}
        />
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-brand-gold/10 blur-3xl" />

        <Container className="relative pb-12 sm:pb-14">
          <motion.div {...rise()} className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-gold backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
              Why AfriQwest
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3rem]">
              {brand.transformationLine.replace("This is not just travel.", "Travel that transforms.")}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-white/80 sm:text-lg">
              {brand.movementLine}
            </p>
            <p className="mt-3 text-sm italic text-white/70">{brand.tagline}</p>
          </motion.div>
        </Container>

        <div className="h-6 bg-gradient-to-b from-brand-green to-brand-cream" />
      </section>

      {/* Why choose grid */}
      <section className="bg-brand-cream py-16 sm:py-20">
        <Container>
          <motion.div {...rise()} className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-orange">Our difference</p>
            <h2 className="mt-3 text-3xl font-bold text-brand-ink sm:text-4xl">Why Choose AfriQwest?</h2>
            <p className="mt-3 text-base leading-relaxed text-brand-muted">
              Over a decade of expertise, deep local connections, and a team passionate about your comfort and cultural immersion.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {whyChooseAfriQwest.map((item, i) => (
              <motion.div
                key={item.title}
                {...rise(i * 0.07)}
                className="group relative overflow-hidden rounded-2xl border border-brand-border/70 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-green/25 hover:shadow-md"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ring-1 ${accents[i % accents.length]}`}>
                  {reasonIcons[i]}
                </div>
                <h3 className="mt-4 font-bold text-brand-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-muted">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Feel Africa */}
      <section className="relative overflow-hidden bg-white py-16 sm:py-20">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.div {...rise()}>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-orange">Cultural immersion</p>
              <h2 className="mt-3 text-3xl font-bold text-brand-ink sm:text-4xl">
                Feel it. Taste it. <span className="text-brand-green">Live it.</span>
              </h2>
              <p className="mt-5 text-base leading-relaxed text-brand-muted">{brand.feelAfricaLine}</p>
              <ul className="mt-6 space-y-3">
                {immersionExperiences.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-brand-ink">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
                      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} aria-hidden><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div {...rise(0.12)} className="relative overflow-hidden rounded-[1.75rem] shadow-[0_24px_60px_-24px_rgba(28,43,38,0.4)]">
              <img src={images.home.hero} alt="AfriQwest cultural immersion" className="aspect-[4/3] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/50 to-transparent" />
              <blockquote className="absolute bottom-6 left-6 right-6 text-lg font-semibold italic leading-snug text-white">
                &ldquo;{brand.mission}&rdquo;
              </blockquote>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Experience categories */}
      <section className="bg-brand-cream py-16 sm:py-20">
        <Container>
          <motion.div {...rise()} className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-orange">What we curate</p>
            <h2 className="mt-3 text-3xl font-bold text-brand-ink sm:text-4xl">Experiences for every traveler</h2>
          </motion.div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {experienceCategories.map((cat, i) => (
              <motion.div
                key={cat.title}
                {...rise(i * 0.06)}
                className="rounded-2xl border border-brand-border/60 bg-white p-5 shadow-sm"
              >
                <span className="text-2xl" aria-hidden>{cat.icon}</span>
                <h3 className="mt-3 font-bold text-brand-ink">{cat.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-muted">{cat.description}</p>
              </motion.div>
            ))}
          </div>

          {NAV_FEATURES.experiences ? (
            <motion.div {...rise(0.2)} className="mt-10 text-center">
              <Link
                to={ROUTES.experiences}
                className="inline-flex items-center gap-2 rounded-xl border border-brand-border bg-white px-6 py-3 text-sm font-semibold text-brand-green shadow-sm transition-all hover:border-brand-green/30 hover:shadow-md"
              >
                Explore all experiences
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </Link>
            </motion.div>
          ) : null}
        </Container>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-brand-green py-14 sm:py-16">
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-gold/15 blur-3xl" />
        <Container className="relative text-center">
          <motion.div {...rise()}>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-gold">Join the movement</p>
            <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
              Ready to explore Africa authentically?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
              {brand.operations}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to={ROUTES.tours}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-orange px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-brand-orange-dark"
              >
                Browse 2025 tours
              </Link>
              <a
                href={getWhatsAppUrl("Hello AfriQwest, I would like to learn more about your travel programs.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}
