import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import Container from "../layout/Container";
import { images } from "../../config/images";
import { ROUTES } from "../../constants/routes";
import { primaryNavLinks } from "./navConfig";

const EASE = [0.16, 1, 0.3, 1];

function navLinkClass({ isActive }) {
  return [
    "relative rounded-full px-4 py-2 text-sm transition-colors duration-200",
    isActive
      ? "font-semibold text-brand-green"
      : "font-medium text-brand-muted hover:bg-white/60 hover:text-brand-green",
  ].join(" ");
}

function mobileNavLinkClass({ isActive }) {
  return [
    "flex items-center gap-3 rounded-xl px-4 py-3 text-base transition-colors",
    isActive
      ? "border-l-4 border-brand-orange bg-brand-green/10 pl-3 font-semibold text-brand-green"
      : "border-l-4 border-transparent font-medium text-brand-ink hover:bg-brand-cream",
  ].join(" ");
}

export default function NavbarShell({ actions, mobileActions }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 16);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={[
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-brand-border/50 bg-white/75 shadow-[0_8px_32px_-12px_rgba(28,43,38,0.18)] backdrop-blur-xl"
          : "border-b border-transparent bg-brand-cream/80 backdrop-blur-sm",
      ].join(" ")}
    >
      <Container
        className={[
          "flex items-center justify-between gap-4 transition-all duration-300",
          scrolled ? "py-3" : "py-4 lg:py-5",
        ].join(" ")}
      >
        <Link to={ROUTES.home} className="group flex shrink-0 items-center gap-3">
          <img
            src={images.general_logo}
            alt="AfriQwest Global Travel & Tour"
            className={[
              "w-auto transition-all duration-300",
              scrolled ? "h-11" : "h-10 sm:h-16",
            ].join(" ")}
          />
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-brand-border/40 bg-white/50 p-1 shadow-sm backdrop-blur-md lg:flex">
          {primaryNavLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={navLinkClass}
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  {isActive && (
                    <>
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-brand-green/10 ring-1 ring-brand-green/20"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                      <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-brand-orange" aria-hidden />
                    </>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">{actions}</div>

        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-brand-border/60 bg-white/70 text-brand-green shadow-sm transition-colors hover:bg-white lg:hidden"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            {menuOpen ? (
              <>
                <path d="M6 6l12 12" />
                <path d="M18 6 6 18" />
              </>
            ) : (
              <>
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </>
            )}
          </svg>
        </button>
      </Container>

      {/* Brand accent strip when scrolled */}
      <div
        className={[
          "h-0.5 w-full bg-gradient-to-r from-brand-green/30 via-brand-gold/40 to-brand-orange/30 transition-opacity duration-300",
          scrolled ? "opacity-100" : "opacity-0",
        ].join(" ")}
        aria-hidden
      />

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto overscroll-contain border-t border-brand-border/40 bg-white/90 backdrop-blur-xl lg:hidden"
          >
            <Container className="py-5">
              <nav className="flex flex-col gap-1">
                {primaryNavLinks.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3, ease: EASE }}
                  >
                    <NavLink
                      to={link.to}
                      end={link.end}
                      onClick={() => setMenuOpen(false)}
                      className={mobileNavLinkClass}
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <span className="flex h-2 w-2 shrink-0 rounded-full bg-brand-orange" aria-hidden />
                          )}
                          {link.label}
                        </>
                      )}
                    </NavLink>
                  </motion.div>
                ))}
              </nav>

              <div
                className="mt-5 flex flex-col gap-3 border-t border-brand-border/50 pt-5"
                onClick={(e) => {
                  if (e.target.closest("a, button")) setMenuOpen(false);
                }}
              >
                {mobileActions ?? actions}
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
