import { Link } from "react-router";
import Container from "./Container";
import env, { getWhatsAppUrl } from "../../config/env";
import { images } from "../../config/images";
import { ROUTES } from "../../constants/routes";
import { brand } from "../../data/brandContent";

const footerLinks = {
  Explore: [
    { label: "Home", to: ROUTES.home },
    { label: "Tours", to: ROUTES.tours },
    { label: "Experiences", to: ROUTES.experiences },
    { label: "Stories", to: ROUTES.stories },
    { label: "Contact", to: ROUTES.contact },
  ],
  Company: [
    { label: "About us", to: ROUTES.about },
    { label: "Why AfriQwest", to: ROUTES.whyUs },
  ],
  Account: [
    { label: "My bookings", to: ROUTES.myBookings },
    { label: "Sign in", to: ROUTES.login },
    { label: "Create account", to: ROUTES.signup },
  ],
};

const hubs = [
  { name: "Ghana", label: "Heritage Coast" },
  { name: "Kenya", label: "Safari & Culture" },
  { name: "South Africa", label: "Vibrant Cities" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-brand-green-dark bg-brand-green text-white">
      <div
        aria-hidden
        className="h-1 bg-gradient-to-r from-brand-gold/60 via-brand-orange/50 to-brand-gold/60"
      />

      <Container className="py-12 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Link to={ROUTES.home}>
              <img
                src={images.general_logo || images.logo}
                alt={brand.legalName}
                className="h-20 w-auto brightness-0 invert sm:h-24 lg:h-28"
              />
            </Link>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/75">
              {brand.tagline}. Deep expertise across Ghana, Kenya, and South Africa — with global
              headquarters in Houston, Texas.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {hubs.map((hub) => (
                <span
                  key={hub.name}
                  className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs"
                >
                  <span className="font-semibold text-white">{hub.name}</span>
                  <span className="text-white/60"> · {hub.label}</span>
                </span>
              ))}
            </div>

            <div className="mt-6 space-y-2 text-sm text-white/70">
              <p>
                <a href={`mailto:${env.contactEmail}`} className="transition-colors hover:text-brand-gold">
                  {env.contactEmail}
                </a>
              </p>
              <p>
                <a href={`tel:${env.contactPhoneUs}`} className="transition-colors hover:text-brand-gold">
                  US: {env.contactPhoneUs}
                </a>
                {" · "}
                <a href={`tel:${env.contactPhoneGh}`} className="transition-colors hover:text-brand-gold">
                  GH: {env.contactPhoneGh}
                </a>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-brand-gold">
                  {title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="text-sm text-white/75 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-brand-gold">
                Get in touch
              </h3>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <Link
                    to={ROUTES.contact}
                    className="text-sm text-white/75 transition-colors hover:text-white"
                  >
                    Request a quote
                  </Link>
                </li>
                <li>
                  <a
                    href={getWhatsAppUrl("Hello AfriQwest")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/75 transition-colors hover:text-white"
                  >
                    WhatsApp us
                  </a>
                </li>
                <li>
                  <a
                    href={env.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/75 transition-colors hover:text-white"
                  >
                    afriqwestglobal.com
                  </a>
                </li>
              </ul>
              <p className="mt-4 text-xs leading-relaxed text-white/50">
                Global HQ: Houston, Texas
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/15 pt-6 sm:flex-row">
          <p className="text-xs text-white/55">
            © {new Date().getFullYear()} {env.appName}. All rights reserved.
          </p>
          <p className="text-xs text-white/55">
            Ghana · Kenya · South Africa
          </p>
        </div>
      </Container>
    </footer>
  );
}
