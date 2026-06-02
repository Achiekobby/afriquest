import { motion } from "motion/react";
import Container from "../layout/Container";
import { testimonials } from "../../data/homeContent";

const EASE = [0.16, 1, 0.3, 1];

function TestimonialCard({ item }) {
  return (
    <article className="relative w-[min(340px,85vw)] shrink-0 overflow-hidden rounded-2xl border border-brand-border/60 bg-white shadow-[0_14px_44px_-24px_rgba(28,43,38,0.45)] ring-1 ring-white/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_-22px_rgba(28,43,38,0.35)]">
      <div className="flex items-center justify-between border-b border-brand-border/60 bg-gradient-to-r from-brand-green/8 via-brand-cream to-brand-gold/10 px-5 py-3">
        <span className="rounded-full bg-brand-green/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-green">
          {item.tour}
        </span>
        <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-ink">
          <span className="text-brand-gold">★</span> {item.rating}
        </span>
      </div>

      <div className="relative px-5 pb-5 pt-4">
        <span
          className="pointer-events-none absolute right-4 top-2 select-none font-serif text-5xl leading-none text-brand-gold/25"
          aria-hidden
        >
          &ldquo;
        </span>
        <blockquote className="relative line-clamp-4 text-sm leading-relaxed text-brand-ink">
          {item.quote}
        </blockquote>

        <div className="mt-5 flex items-center gap-3 border-t border-brand-border/60 pt-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-xs font-bold text-brand-green ring-2 ring-brand-cream">
            {item.initials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-brand-green">{item.name}</p>
            <p className="truncate text-xs text-brand-muted">{item.role}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

function TestimonialMarquee({ items, reverse = false }) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-brand-cream to-transparent sm:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-brand-cream to-transparent sm:w-28" />

      <div className="overflow-hidden">
        <div
          className={[
            "flex w-max gap-5 py-1 hover:[animation-play-state:paused]",
            reverse ? "animate-marquee-reverse" : "animate-marquee",
          ].join(" ")}
        >
          {items.map((item, i) => (
            <TestimonialCard key={`${item.name}-${i}`} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomeTestimonial() {
  const rowOne = [...testimonials, ...testimonials];
  const rowTwo = [...testimonials.slice().reverse(), ...testimonials.slice().reverse()];

  return (
    <section className="relative overflow-hidden bg-brand-cream py-16 sm:py-20 lg:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'%3E%3Cg fill='none' transform='rotate(45 14 14)'%3E%3Crect width='14' height='14' fill='%232D5A47' fill-opacity='0.03'/%3E%3Crect x='14' y='14' width='14' height='14' fill='%23E3A020' fill-opacity='0.025'/%3E%3C/g%3E%3C/svg%3E\")",
          backgroundSize: "28px 28px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-64 w-96 -translate-x-1/2 rounded-full bg-brand-gold/5 blur-3xl"
      />

      <Container className="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-orange">
            Traveler stories
          </p>
          <h2 className="mt-3 text-3xl font-bold text-brand-ink sm:text-4xl">
            Loved by explorers worldwide
          </h2>
          <p className="mt-3 text-base leading-relaxed text-brand-muted">
            Real experiences from universities, groups, and independent travelers across
            Ghana, Kenya, and South Africa.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-brand-border bg-white/80 px-4 py-2 text-sm font-semibold text-brand-green shadow-sm">
            <span className="text-brand-gold">★★★★★</span>
            <span>4.9 average · 120+ reviews</span>
          </div>
        </motion.div>
      </Container>

      <div className="relative mt-12 space-y-5 sm:mt-14">
        <TestimonialMarquee items={rowOne} />
        <TestimonialMarquee items={rowTwo} reverse />
      </div>
    </section>
  );
}
