import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import Container from "../../components/layout/Container";
import { ROUTES } from "../../constants/routes";
import { getWhatsAppUrl } from "../../config/env";
import { downloadBookingReceipt } from "../../utils/bookingReceipt";
import { getBookings, isUpcoming } from "../../utils/bookingStorage";

const EASE = [0.16, 1, 0.3, 1];

const FILTERS = [
  { id: "all", label: "All bookings" },
  { id: "upcoming", label: "Upcoming" },
  { id: "paid", label: "Paid" },
  { id: "reserved", label: "Pending payment" },
];

const STATUS_CONFIG = {
  paid: { label: "Paid in full", className: "bg-brand-green/10 text-brand-green ring-brand-green/20" },
  deposit_paid: { label: "Deposit paid", className: "bg-emerald-100 text-emerald-700 ring-emerald-200" },
  pay_onsite: { label: "Pay on site", className: "bg-brand-gold/15 text-brand-orange ring-brand-gold/30" },
  reserved: { label: "Pending payment", className: "bg-brand-orange/10 text-brand-orange ring-brand-orange/20" },
};

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
}

function formatSavedDate(iso) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(iso));
}

function BookingCard({ booking, index }) {
  const status = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.reserved;
  const upcoming = isUpcoming(booking);
  const image = booking.tour?.image;
  const slug = booking.tour?.slug;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE, delay: Math.min(index * 0.06, 0.3) }}
      className="overflow-hidden rounded-[1.5rem] border border-brand-border/60 bg-white shadow-[0_10px_36px_-20px_rgba(28,43,38,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_44px_-18px_rgba(28,43,38,0.28)]"
    >
      <div className="flex flex-col sm:flex-row">
        {/* Image strip */}
        <div className="relative aspect-[16/9] shrink-0 overflow-hidden sm:aspect-auto sm:w-52 md:w-60">
          {image ? (
            <img src={image} alt={booking.tour.name} className="h-full w-full object-cover sm:min-h-[200px]" />
          ) : (
            <div className="flex h-full min-h-[160px] items-center justify-center bg-brand-cream text-4xl sm:min-h-[200px]">🌍</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent sm:bg-gradient-to-r" />
          {!upcoming && (
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-muted">
              Past
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-mono text-xs font-bold text-brand-green">{booking.bookingRef}</p>
              <h2 className="mt-1 text-lg font-bold text-brand-ink">{booking.tour.name}</h2>
              <p className="mt-0.5 text-sm text-brand-muted">{booking.tour.location}</p>
            </div>
            <span className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold ring-1 ${status.className}`}>
              {status.label}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-muted">Departure</p>
              <p className="mt-0.5 font-semibold text-brand-ink">{booking.selectedDate}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-muted">Travelers</p>
              <p className="mt-0.5 font-semibold text-brand-ink">{booking.travelers}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-muted">Duration</p>
              <p className="mt-0.5 font-semibold text-brand-ink">{booking.tour.duration}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-muted">Booked</p>
              <p className="mt-0.5 font-semibold text-brand-ink">{formatSavedDate(booking.savedAt ?? booking.issuedAt)}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-brand-border/40 pt-4">
            <span className="text-sm font-bold text-brand-ink">
              {booking.paymentMode === "online"
                ? formatCurrency(booking.payNowAmount)
                : formatCurrency(booking.subtotal)}
              <span className="ml-1 text-xs font-normal text-brand-muted">
                {booking.paymentMode === "online"
                  ? " paid online"
                  : booking.paymentMode === "onsite"
                    ? " due on site"
                    : booking.paymentMode === "now" && booking.payType === "deposit"
                      ? " deposit paid"
                      : booking.paymentMode === "later"
                        ? " total"
                        : ""}
              </span>
            </span>
          </div>

          {/* Premises notice */}
          <div className="mt-3 flex items-start gap-2 rounded-lg bg-brand-gold/10 px-3 py-2.5">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[11px] leading-relaxed text-brand-muted">
              Present your receipt at the premises upon arrival.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => downloadBookingReceipt(booking)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-green px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-brand-green-dark"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download receipt
            </button>
            {slug && (
              <Link
                to={ROUTES.tourDetail(slug)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-brand-border bg-white px-4 py-2 text-xs font-semibold text-brand-ink transition-all hover:border-brand-green/30 hover:text-brand-green"
              >
                View tour
              </Link>
            )}
            <a
              href={getWhatsAppUrl(`Hi AfriQwest, I need help with booking ${booking.bookingRef}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-brand-border bg-white px-4 py-2 text-xs font-semibold text-brand-muted transition-all hover:border-brand-green/30 hover:text-brand-green"
            >
              Get support
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function MyBookingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const welcomeRef = searchParams.get("booked");
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showWelcome, setShowWelcome] = useState(Boolean(welcomeRef));

  const loadBookings = useCallback(() => {
    setBookings(getBookings());
  }, []);

  useEffect(() => {
    loadBookings();
    window.addEventListener("afriqwest:bookings-updated", loadBookings);
    return () => window.removeEventListener("afriqwest:bookings-updated", loadBookings);
  }, [loadBookings]);

  useEffect(() => {
    if (!welcomeRef) return undefined;
    const timer = window.setTimeout(() => {
      setShowWelcome(false);
      setSearchParams({}, { replace: true });
    }, 8000);
    return () => window.clearTimeout(timer);
  }, [welcomeRef, setSearchParams]);

  const stats = useMemo(() => ({
    total: bookings.length,
    upcoming: bookings.filter(isUpcoming).length,
    paid: bookings.filter((b) => b.status === "paid" || b.status === "deposit_paid").length,
    pending: bookings.filter((b) => b.status === "reserved" || b.status === "pay_onsite").length,
  }), [bookings]);

  const filtered = useMemo(() => {
    let list = bookings;
    if (filter === "upcoming") list = list.filter(isUpcoming);
    if (filter === "paid") list = list.filter((b) => b.status === "paid" || b.status === "deposit_paid");
    if (filter === "reserved") list = list.filter((b) => b.status === "reserved" || b.status === "pay_onsite");
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) =>
          b.bookingRef.toLowerCase().includes(q) ||
          b.tour.name.toLowerCase().includes(q) ||
          b.tour.country.toLowerCase().includes(q) ||
          b.selectedDate.toLowerCase().includes(q),
      );
    }
    return list;
  }, [bookings, filter, search]);

  return (
    <div className="min-h-screen bg-brand-cream">

      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-green pb-12 pt-12 sm:pt-14">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-40" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'%3E%3Cg fill='none' transform='rotate(45 14 14)'%3E%3Crect width='14' height='14' fill='%23ffffff' fill-opacity='0.04'/%3E%3Crect x='14' y='14' width='14' height='14' fill='%23E3A020' fill-opacity='0.04'/%3E%3C/g%3E%3C/svg%3E\")", backgroundSize: "28px 28px" }} />
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-gold/10 blur-3xl" />

        <Container className="relative">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-gold">Your trips</p>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">My bookings</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/80">
              All your AfriQwest tour reservations in one place. Download receipts and present them at the premises on arrival.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
            className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4"
          >
            {[
              { v: stats.total, l: "Total bookings" },
              { v: stats.upcoming, l: "Upcoming" },
              { v: stats.paid, l: "Confirmed" },
              { v: stats.pending, l: "Pending payment" },
            ].map((s) => (
              <div key={s.l} className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
                <p className="text-2xl font-bold text-brand-gold">{s.v}</p>
                <p className="text-[11px] text-white/70">{s.l}</p>
              </div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* List */}
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <Container>
          <AnimatePresence>
            {showWelcome && welcomeRef && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-6 flex flex-col gap-3 rounded-2xl border border-brand-green/30 bg-brand-green/5 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-green/15 text-brand-green">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <p className="font-bold text-brand-ink">Booking confirmed!</p>
                    <p className="mt-0.5 text-sm text-brand-muted">
                      Reference <span className="font-mono font-semibold text-brand-green">{welcomeRef}</span> — your receipt has been downloaded. Present it on arrival.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const booking = bookings.find((b) => b.bookingRef === welcomeRef);
                    if (booking) downloadBookingReceipt(booking);
                  }}
                  className="shrink-0 rounded-xl bg-brand-green px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-green-dark"
                >
                  Download receipt again
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toolbar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className={[
                    "rounded-full px-4 py-1.5 text-sm font-semibold transition-all",
                    filter === f.id
                      ? "bg-brand-green text-white shadow-sm"
                      : "border border-brand-border/70 bg-white text-brand-muted hover:border-brand-green/30 hover:text-brand-green",
                  ].join(" ")}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <svg className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by ref, tour, country…"
                className="h-10 w-full rounded-full border border-brand-border/70 bg-white pl-9 pr-4 text-sm outline-none focus:border-brand-green/50 focus:ring-2 focus:ring-brand-green/15"
              />
            </div>
          </div>

          <p className="mt-5 text-sm text-brand-muted">
            <span className="font-semibold text-brand-ink">{filtered.length}</span>
            {filtered.length === 1 ? " booking" : " bookings"}
            {filter !== "all" && <> · {FILTERS.find((f) => f.id === filter)?.label}</>}
          </p>

          <AnimatePresence mode="wait">
            {filtered.length > 0 ? (
              <motion.div
                key={`${filter}-${search}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-6 space-y-5"
              >
                {filtered.map((booking, i) => (
                  <BookingCard key={booking.bookingRef} booking={booking} index={i} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-12 flex flex-col items-center rounded-[1.75rem] border border-brand-border/60 bg-white px-8 py-16 text-center shadow-sm"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-green/10 text-3xl">🧳</div>
                <h2 className="mt-5 text-xl font-bold text-brand-ink">No bookings yet</h2>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-brand-muted">
                  {bookings.length === 0
                    ? "When you book a tour, it will appear here with your receipt and departure details."
                    : "No bookings match your current filter. Try adjusting your search or filter."}
                </p>
                <Link
                  to={ROUTES.tours}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-green px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-brand-green-dark"
                >
                  Browse tours
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </Container>
      </section>
    </div>
  );
}
