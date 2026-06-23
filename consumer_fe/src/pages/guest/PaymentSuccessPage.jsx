import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Compass,
  Download,
  Luggage,
  Loader2,
  MapPin,
  Users,
} from "lucide-react";
import Container from "../../components/layout/Container";
import { ROUTES } from "../../constants/routes";
import consumerPaymentsServiceApi from "../../apis/ConsumerPaymentsServiceApi";
import { formatPaymentDate } from "../../utils/paymentHelpers";
import { downloadPaymentReceiptPdf, mapVerifiedPaymentToReceipt } from "../../utils/paymentReceipt";

const EASE = [0.22, 1, 0.36, 1];

function resolveBookingRef(searchParams) {
  return (
    searchParams.get("ref") ||
    searchParams.get("booking") ||
    searchParams.get("bookingCode") ||
    searchParams.get("reference") ||
    searchParams.get("trxref") ||
    ""
  ).trim();
}

function ReceiptPreview({ receipt }) {
  const travelerName = `${receipt.leadTraveler?.firstName || ""} ${receipt.leadTraveler?.lastName || ""}`.trim();

  return (
    <div className="overflow-hidden rounded-2xl border border-brand-border/50 bg-gradient-to-br from-white to-brand-cream/50">
      {receipt.tour.image ? (
        <div className="relative h-28 overflow-hidden sm:h-32">
          <img src={receipt.tour.image} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/55 to-transparent" />
          <p className="absolute bottom-3 left-4 text-sm font-bold text-white">{receipt.tour.name}</p>
        </div>
      ) : null}

      <div className="grid gap-4 p-5 sm:grid-cols-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-brand-muted">Payment reference</p>
          <p className="mt-1 font-mono text-sm font-bold text-brand-green">{receipt.paymentReference}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-brand-muted">Booking reference</p>
          <p className="mt-1 font-mono text-sm font-bold text-brand-ink">{receipt.bookingRef}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-brand-muted">Amount paid</p>
          <p className="mt-1 text-xl font-bold text-brand-green">{receipt.amountLabel}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-brand-muted">Paid at</p>
          <p className="mt-1 text-sm font-semibold text-brand-ink">{formatPaymentDate(receipt.paidAt)}</p>
        </div>
      </div>

      <div className="border-t border-brand-border/40 bg-white/60 px-5 py-4">
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          {!receipt.tour.image ? (
            <div className="sm:col-span-2">
              <dt className="text-brand-muted">Tour</dt>
              <dd className="font-semibold text-brand-ink">{receipt.tour.name}</dd>
            </div>
          ) : null}
          <div className="flex items-start gap-2">
            <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" strokeWidth={2} aria-hidden />
            <div>
              <dt className="text-brand-muted">Departure</dt>
              <dd className="font-semibold text-brand-ink">{receipt.selectedDate}</dd>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Users className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" strokeWidth={2} aria-hidden />
            <div>
              <dt className="text-brand-muted">Travelers</dt>
              <dd className="font-semibold text-brand-ink">{receipt.travelers}</dd>
            </div>
          </div>
          {receipt.tour.location ? (
            <div className="flex items-start gap-2 sm:col-span-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" strokeWidth={2} aria-hidden />
              <div>
                <dt className="text-brand-muted">Location</dt>
                <dd className="font-semibold text-brand-ink">{receipt.tour.location}</dd>
              </div>
            </div>
          ) : null}
          {travelerName ? (
            <div className="sm:col-span-2">
              <dt className="text-brand-muted">Lead traveler</dt>
              <dd className="font-semibold text-brand-ink">{travelerName}</dd>
            </div>
          ) : null}
        </dl>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const bookingRef = useMemo(() => resolveBookingRef(searchParams), [searchParams]);

  const [phase, setPhase] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    let active = true;

    async function verify() {
      if (!bookingRef) {
        setPhase("missing");
        return;
      }

      setPhase("loading");
      setErrorMessage("");

      const result = await consumerPaymentsServiceApi.verifyPayment(bookingRef);
      if (!active) return;

      if (!result.ok) {
        setPhase("error");
        setErrorMessage(result.reason || result.message || "Could not verify this payment.");
        return;
      }

      if (!result.verified || result.data?.status !== "paid") {
        setPhase("failed");
        setErrorMessage(result.reason || "Payment was not completed or could not be confirmed.");
        return;
      }

      setReceipt(mapVerifiedPaymentToReceipt(result.data));
      setPhase("success");
    }

    verify();
    return () => {
      active = false;
    };
  }, [bookingRef]);

  function handleDownloadReceipt() {
    if (receipt) downloadPaymentReceiptPdf(receipt);
  }

  const isSuccess = phase === "success" && receipt;

  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-brand-cream/60 to-white pb-20 pt-8 sm:pt-10">
      <Container className="max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="overflow-hidden rounded-[1.75rem] border border-brand-border/60 bg-white shadow-[0_20px_60px_-24px_rgba(28,43,38,0.22)]"
        >
          <div
            className={[
              "relative border-b border-brand-border/40 px-6 py-8 text-center text-white sm:px-10 sm:py-9",
              isSuccess
                ? "bg-gradient-to-br from-brand-green via-brand-green to-brand-green-dark"
                : phase === "loading"
                  ? "bg-gradient-to-br from-brand-ink/90 to-brand-green-dark"
                  : "bg-gradient-to-br from-brand-ink to-brand-ink/90",
            ].join(" ")}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-25"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'%3E%3Cg fill='none' transform='rotate(45 14 14)'%3E%3Crect width='14' height='14' fill='%23ffffff' fill-opacity='0.05'/%3E%3Crect x='14' y='14' width='14' height='14' fill='%23E3A020' fill-opacity='0.04'/%3E%3C/g%3E%3C/svg%3E\")",
                backgroundSize: "28px 28px",
              }}
            />

            <div className="relative">
              <AnimatePresence mode="wait">
                {phase === "loading" ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/15 ring-4 ring-white/20"
                  >
                    <Loader2 className="h-8 w-8 animate-spin text-brand-gold" strokeWidth={2} aria-hidden />
                  </motion.div>
                ) : isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                    className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/15 ring-4 ring-white/20"
                  >
                    <CheckCircle2 className="h-8 w-8 text-brand-gold" strokeWidth={2} aria-hidden />
                  </motion.div>
                ) : (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/15 ring-4 ring-white/20"
                  >
                    <AlertCircle className="h-8 w-8 text-brand-orange" strokeWidth={2} aria-hidden />
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="relative mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
                {phase === "loading" ? "Verifying payment" : isSuccess ? "Payment verified" : "Verification issue"}
              </p>
              <h1 className="relative mt-2 font-heading text-2xl font-bold sm:text-3xl">
                {phase === "loading"
                  ? "Confirming your payment…"
                  : isSuccess
                    ? "Thank you — you're all set!"
                    : phase === "missing"
                      ? "Missing booking reference"
                      : "Payment could not be verified"}
              </h1>
              <p className="relative mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/80">
                {phase === "loading"
                  ? "We're confirming your payment for this booking."
                  : isSuccess
                    ? "Your payment is confirmed and your booking is secured. Download your receipt below."
                    : errorMessage ||
                      (phase === "missing"
                        ? "Return from checkout with your booking reference in the URL (e.g. ?ref=AFQ_123456)."
                        : "If you believe this is an error, contact support with your booking reference.")}
              </p>

              {bookingRef ? (
                <p className="relative mt-4 font-mono text-xs text-white/60">{bookingRef}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-6 p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="receipt"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="space-y-6"
                >
                  <ReceiptPreview receipt={receipt} />

                  <button
                    type="button"
                    onClick={handleDownloadReceipt}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-green py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(45,90,71,0.55)] transition-all hover:bg-brand-green-dark"
                  >
                    <Download className="h-4 w-4" strokeWidth={2} aria-hidden />
                    Download PDF receipt
                  </button>
                  <p className="text-center text-xs text-brand-muted">
                    Opens print dialog — choose &ldquo;Save as PDF&rdquo; to save your receipt.
                  </p>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Link
                      to={ROUTES.tours}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-brand-border bg-white py-3.5 text-sm font-semibold text-brand-ink transition-all hover:border-brand-green/30 hover:bg-brand-cream"
                    >
                      <Compass className="h-4 w-4" strokeWidth={2} aria-hidden />
                      Explore tours
                    </Link>
                    <Link
                      to={ROUTES.myBookings}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-orange py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(212,97,26,0.55)] transition-all hover:bg-brand-orange-dark"
                    >
                      <Luggage className="h-4 w-4" strokeWidth={2} aria-hidden />
                      My bookings
                    </Link>
                  </div>
                </motion.div>
              ) : phase !== "loading" ? (
                <motion.div
                  key="actions"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  {phase === "failed" && bookingRef ? (
                    <Link
                      to={ROUTES.paymentFailure(bookingRef)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-orange py-3.5 text-sm font-semibold text-white transition-all hover:bg-brand-orange-dark"
                    >
                      Try payment again
                    </Link>
                  ) : null}
                  <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    to={ROUTES.tours}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-brand-border bg-white py-3.5 text-sm font-semibold text-brand-ink transition-all hover:border-brand-green/30 hover:bg-brand-cream"
                  >
                    <Compass className="h-4 w-4" strokeWidth={2} aria-hidden />
                    Explore tours
                  </Link>
                  <Link
                    to={ROUTES.myBookings}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-orange py-3.5 text-sm font-semibold text-white transition-all hover:bg-brand-orange-dark"
                  >
                    <Luggage className="h-4 w-4" strokeWidth={2} aria-hidden />
                    My bookings
                  </Link>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </motion.div>
      </Container>
    </div>
  );
}
