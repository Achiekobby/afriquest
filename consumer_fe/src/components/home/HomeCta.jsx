import { Link } from "react-router";
import { motion } from "motion/react";
import Container from "../layout/Container";
import env, { getWhatsAppUrl } from "../../config/env";
import { ROUTES } from "../../constants/routes";
import { brand } from "../../data/brandContent";

const EASE = [0.16, 1, 0.3, 1];

const hubs = ["Ghana", "Kenya", "South Africa"];

export default function HomeCta() {
  return (
    <section className="relative overflow-hidden pb-14 sm:pb-16 lg:pb-20">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-brand-green via-brand-green to-brand-green-dark px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Ccircle cx='2' cy='2' r='1' fill='%23ffffff' fill-opacity='0.35'/%3E%3C/svg%3E\")",
              backgroundSize: "24px 24px",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-gold/15 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-brand-orange/10 blur-3xl"
          />

          <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_auto] lg:gap-12">
            <div className="text-center lg:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-gold">
                Join the movement
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl lg:text-[2rem] lg:leading-tight">
                Ready to experience Ghana, Kenya &amp; South Africa?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/80 lg:mx-0 sm:text-base">
                {brand.transformationLine} Join travelers, universities, and groups who explore Africa
                authentically with AfriQwest Global.
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                {hubs.map((hub) => (
                  <span
                    key={hub}
                    className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm"
                  >
                    {hub}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:items-stretch lg:justify-end">
              <Link
                to={ROUTES.contact}
                className="inline-flex w-full min-w-[11rem] items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-brand-green shadow-lg transition-all duration-300 hover:bg-brand-cream sm:w-auto"
              >
                Request a quote
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
              <Link
                to={ROUTES.stories}
                className="inline-flex w-full min-w-[11rem] items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 sm:w-auto"
              >
                Read our stories
              </Link>
              <a
                href={getWhatsAppUrl("Hello AfriQwest, I would like to plan a trip to Ghana, Kenya, or South Africa.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full min-w-[11rem] items-center justify-center gap-2 rounded-xl bg-brand-orange px-6 py-3.5 text-sm font-semibold text-white shadow-[0_10px_24px_-8px_rgba(0,0,0,0.35)] transition-all duration-300 hover:bg-brand-orange-dark sm:w-auto"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>

          <div className="relative mt-8 flex flex-col items-center justify-center gap-2 border-t border-white/15 pt-6 text-sm text-white/70 sm:flex-row sm:gap-6 lg:justify-start">
            <a href={`mailto:${env.contactEmail}`} className="transition-colors hover:text-white">
              {env.contactEmail}
            </a>
            <span className="hidden sm:inline" aria-hidden>·</span>
            <a href={`tel:${env.contactPhoneUs}`} className="transition-colors hover:text-white">
              {env.contactPhoneUs}
            </a>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
