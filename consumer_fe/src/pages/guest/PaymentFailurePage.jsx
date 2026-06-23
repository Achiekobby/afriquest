import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { motion } from "motion/react";
import { AlertCircle, Compass, CreditCard, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import Container from "../../components/layout/Container";
import { ROUTES } from "../../constants/routes";
import consumerPaymentsServiceApi from "../../apis/ConsumerPaymentsServiceApi";
import { useAuth } from "../../hooks/useAuth";
import { extractPaymentRedirectUrl } from "../../utils/paymentHelpers";

const EASE = [0.22, 1, 0.36, 1];

export default function PaymentFailurePage() {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const bookingRef =
    searchParams.get("ref") ||
    searchParams.get("booking") ||
    searchParams.get("bookingCode") ||
    "";
  const paymentSlug = searchParams.get("payment") || searchParams.get("paymentSlug") || "";
  const reason = searchParams.get("reason") || searchParams.get("message") || "";

  const [retrying, setRetrying] = useState(false);

  async function handleRetryPayment() {
    if (!token) return;

    setRetrying(true);

    const result = paymentSlug
      ? await consumerPaymentsServiceApi.retryPayment(token, paymentSlug)
      : bookingRef
        ? await consumerPaymentsServiceApi.retryPaymentForBooking(token, bookingRef)
        : { ok: false, reason: "Missing payment or booking reference." };

    setRetrying(false);

    const paymentUrl = extractPaymentRedirectUrl(result);
    if (paymentUrl) {
      window.location.assign(paymentUrl);
      return;
    }

    toast.error(result.reason || result.message || "Could not retry payment.");
  }

  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-brand-cream/60 to-white pb-20 pt-10 sm:pt-14">
      <Container className="max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="overflow-hidden rounded-[1.75rem] border border-brand-border/60 bg-white shadow-[0_20px_60px_-24px_rgba(28,43,38,0.22)]"
        >
          <div className="border-b border-brand-border/40 bg-gradient-to-r from-red-600 to-red-700 px-6 py-10 text-center text-white sm:px-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/15 ring-4 ring-white/20">
              <AlertCircle className="h-8 w-8 text-white" strokeWidth={2} aria-hidden />
            </div>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">Payment not completed</p>
            <h1 className="mt-2 font-heading text-2xl font-bold sm:text-3xl">Payment was unsuccessful</h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/80">
              {reason || "Your payment could not be processed. Your booking is still reserved — you can try again."}
            </p>
          </div>

          <div className="space-y-6 p-6 sm:p-8">
            {bookingRef ? (
              <div className="rounded-2xl border border-brand-border/50 bg-brand-cream/40 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted">Booking reference</p>
                <p className="mt-1 font-mono text-lg font-bold text-brand-green">{bookingRef}</p>
                <Link
                  to={ROUTES.myBookingDetail(bookingRef)}
                  className="mt-3 inline-flex text-sm font-semibold text-brand-green hover:text-brand-green-dark"
                >
                  View booking details →
                </Link>
              </div>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row">
              {token && (paymentSlug || bookingRef) ? (
                <button
                  type="button"
                  onClick={handleRetryPayment}
                  disabled={retrying}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-orange py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(212,97,26,0.55)] transition-all hover:bg-brand-orange-dark disabled:opacity-60"
                >
                  <RefreshCw className="h-4 w-4" strokeWidth={2} aria-hidden />
                  {retrying ? "Redirecting…" : "Try payment again"}
                </button>
              ) : null}
              <Link
                to={ROUTES.myBookings}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-brand-border bg-white py-3.5 text-sm font-semibold text-brand-ink transition-all hover:border-brand-green/30 hover:bg-brand-cream"
              >
                <CreditCard className="h-4 w-4" strokeWidth={2} aria-hidden />
                My bookings
              </Link>
            </div>

            <Link
              to={ROUTES.tours}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-brand-green/25 bg-brand-green/5 py-3 text-sm font-semibold text-brand-green transition-all hover:bg-brand-green/10"
            >
              <Compass className="h-4 w-4" strokeWidth={2} aria-hidden />
              Browse other tours
            </Link>
          </div>
        </motion.div>
      </Container>
    </div>
  );
}
