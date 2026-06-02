import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { getWhatsAppUrl } from "../../config/env";
import { ROUTES } from "../../constants/routes";
import { downloadBookingReceipt } from "../../utils/bookingReceipt";
import { saveBooking } from "../../utils/bookingStorage";

const EASE = [0.16, 1, 0.3, 1];

const STEPS = [
  { id: "trip", label: "Trip" },
  { id: "details", label: "Details" },
  { id: "payment", label: "Payment" },
  { id: "confirm", label: "Confirm" },
];

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
}

function generateRef() {
  return `AQW-${Date.now().toString(36).toUpperCase().slice(-8)}`;
}

const EMPTY_TRAVELER = { name: "", email: "", phone: "" };

function StepIndicator({ currentStep }) {
  const activeIndex =
    currentStep === "success"
      ? STEPS.length
      : currentStep === "pay-now" || currentStep === "pay-later"
        ? 2
        : STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className="flex items-center gap-1 px-6 pt-6">
      {STEPS.map((step, i) => {
        const done = i < activeIndex;
        const active = i === activeIndex;
        return (
          <div key={step.id} className="flex flex-1 items-center gap-1">
            <div className="flex flex-col items-center gap-1 flex-1">
              <div
                className={[
                  "flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold transition-all",
                  done ? "bg-brand-green text-white" : active ? "bg-brand-orange text-white ring-4 ring-brand-orange/20" : "bg-brand-border/40 text-brand-muted",
                ].join(" ")}
              >
                {done ? (
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                ) : (
                  i + 1
                )}
              </div>
              <span className={`text-[10px] font-semibold ${active ? "text-brand-ink" : "text-brand-muted"}`}>{step.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`mb-4 h-px flex-1 ${done ? "bg-brand-green" : "bg-brand-border/60"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Field({ label, id, type = "text", required, placeholder, value, onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold text-brand-ink">
        {label}{required && <span className="text-brand-orange"> *</span>}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="h-11 rounded-xl border border-brand-border/70 bg-white px-4 text-sm outline-none transition-all focus:border-brand-green/50 focus:ring-2 focus:ring-brand-green/15"
      />
    </div>
  );
}

function TravelerStepper({ value, min, max, onChange }) {
  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-border bg-white text-lg font-bold text-brand-ink transition-all hover:border-brand-green disabled:opacity-40"
        aria-label="Decrease travelers"
      >
        −
      </button>
      <div className="min-w-[3rem] text-center">
        <p className="text-2xl font-bold text-brand-ink">{value}</p>
        <p className="text-[11px] text-brand-muted">{value === 1 ? "traveler" : "travelers"}</p>
      </div>
      <button
        type="button"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-border bg-white text-lg font-bold text-brand-ink transition-all hover:border-brand-green disabled:opacity-40"
        aria-label="Increase travelers"
      >
        +
      </button>
    </div>
  );
}

export default function TourBookingFlow({ tour, open, onClose }) {
  const maxTravelers = Math.min(tour.spotsLeft, 10);

  const [step, setStep] = useState("trip");
  const [selectedDate, setSelectedDate] = useState(tour.departureDates[0]?.date ?? tour.nextDate);
  const [travelers, setTravelers] = useState(1);
  const [paymentMode, setPaymentMode] = useState(null);
  const [payType, setPayType] = useState("full");
  const [bookingRef, setBookingRef] = useState("");
  const [processing, setProcessing] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    travelers: [],
  });

  const subtotal = tour.priceNum * travelers;
  const depositAmount = Math.round(subtotal * (tour.depositPercent / 100));
  const payNowAmount = payType === "deposit" ? depositAmount : subtotal;

  const updateForm = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  function updateAdditionalTraveler(index, field, value) {
    setForm((f) => {
      const travelers = [...f.travelers];
      travelers[index] = { ...travelers[index], [field]: value };
      return { ...f, travelers };
    });
  }

  function isTravelerComplete(traveler) {
    return traveler.name.trim() && traveler.email.trim() && traveler.phone.trim();
  }

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setStep("trip");
      setTravelers(1);
      setPaymentMode(null);
      setPayType("full");
      setSelectedDate(tour.departureDates[0]?.date ?? tour.nextDate);
      setForm({
        firstName: "", lastName: "", email: "", phone: "",
        travelers: [],
      });
    }
  }, [open, tour]);

  useEffect(() => {
    setForm((f) => {
      const extra = Math.max(0, travelers - 1);
      const list = Array.from({ length: extra }, (_, i) => ({
        ...EMPTY_TRAVELER,
        ...f.travelers[i],
      }));
      return { ...f, travelers: list };
    });
  }, [travelers]);

  const canProceedTrip = selectedDate && travelers >= 1;
  const canProceedDetails =
    form.firstName &&
    form.lastName &&
    form.email &&
    form.phone &&
    form.travelers.every(isTravelerComplete);

  function handleProceedToPayment(e) {
    e.preventDefault();
    const ref = generateRef();
    setBookingRef(ref);
    setProcessing(true);

    // Payment gateway integration point — redirect with booking ref + amount
    // e.g. window.location.href = `${PAYMENT_GATEWAY_URL}?ref=${ref}&amount=${payNowAmount}&travelers=${travelers}`;

    setTimeout(() => {
      setProcessing(false);
      setStep("success");
      saveBooking(buildReceiptData({ bookingRef: ref }));
    }, 1500);
  }

  function handlePayLaterConfirm(e) {
    e.preventDefault();
    setProcessing(true);
    const ref = generateRef();
    setBookingRef(ref);
    setTimeout(() => {
      setProcessing(false);
      setStep("success");
      saveBooking({ ...buildReceiptData(), bookingRef: ref });
    }, 1200);
  }

  const stepTitle = useMemo(() => {
    if (step === "trip") return "Plan your trip";
    if (step === "details") return "Traveler details";
    if (step === "payment") return "Choose payment";
    if (step === "pay-now") return "Pay now";
    if (step === "pay-later") return "Reserve & pay later";
    if (step === "success") return "You're booked!";
    return "";
  }, [step]);

  function buildReceiptData(overrides = {}) {
    return {
      bookingRef,
      tour: {
        name: tour.name,
        slug: tour.slug,
        location: tour.location,
        country: tour.country,
        duration: tour.duration,
        priceNum: tour.priceNum,
        image: tour.image,
      },
      selectedDate,
      travelers,
      paymentMode,
      payType,
      payNowAmount,
      subtotal,
      depositAmount,
      payLaterHoldHours: tour.payLaterHoldHours,
      depositPercent: tour.depositPercent,
      leadTraveler: {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
      },
      additionalTravelers: form.travelers,
      issuedAt: new Date().toISOString(),
      ...overrides,
    };
  }

  function handleDownloadReceipt() {
    if (!bookingRef) return;
    downloadBookingReceipt(buildReceiptData());
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-brand-ink/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="relative flex max-h-[94vh] w-full max-w-lg flex-col overflow-hidden rounded-t-[1.75rem] bg-white shadow-2xl sm:max-h-[90vh] sm:rounded-[1.75rem]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-brand-border/50 px-6 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <img src={tour.image} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
            <div className="min-w-0">
              <p id="booking-title" className="truncate text-sm font-bold text-brand-ink">{stepTitle}</p>
              <p className="truncate text-xs text-brand-muted">{tour.name}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close booking"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand-border/60 text-brand-muted hover:bg-brand-cream"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden><path strokeLinecap="round" d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>

        {step !== "success" && <StepIndicator currentStep={step} />}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <AnimatePresence mode="wait">
            {step === "trip" && (
              <motion.div key="trip" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.3, ease: EASE }} className="space-y-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-muted">Departure date</p>
                  <div className="mt-3 space-y-2">
                    {tour.departureDates.map((dep) => (
                      <button
                        key={dep.date}
                        type="button"
                        onClick={() => setSelectedDate(dep.date)}
                        className={[
                          "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all",
                          selectedDate === dep.date
                            ? "border-brand-green bg-brand-green/5 ring-2 ring-brand-green/20"
                            : "border-brand-border/70 hover:border-brand-green/30",
                        ].join(" ")}
                      >
                        <div>
                          <p className="text-sm font-semibold text-brand-ink">{dep.date}</p>
                          <p className="text-xs text-brand-muted">{dep.label}</p>
                        </div>
                        <span className={`text-xs font-bold ${dep.spots <= 3 ? "text-red-500" : "text-brand-green"}`}>
                          {dep.spots} spots left
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-brand-border/60 bg-brand-cream/60 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-muted">Number of travelers</p>
                  <div className="mt-4 flex items-center justify-between">
                    <TravelerStepper value={travelers} min={1} max={maxTravelers} onChange={setTravelers} />
                    <div className="text-right">
                      <p className="text-xs text-brand-muted">Per person</p>
                      <p className="text-lg font-bold text-brand-green">{formatCurrency(tour.priceNum)}</p>
                    </div>
                  </div>
                  {travelers > 1 && (
                    <p className="mt-3 text-xs text-brand-muted">
                      Paying for {travelers} people — total {formatCurrency(subtotal)}
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {step === "details" && (
              <motion.div key="details" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.3, ease: EASE }} className="space-y-4">
                <p className="text-sm text-brand-muted">Lead traveler — we&apos;ll send your confirmation here.</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="First name" id="firstName" required placeholder="Jane" value={form.firstName} onChange={updateForm("firstName")} />
                  <Field label="Last name" id="lastName" required placeholder="Doe" value={form.lastName} onChange={updateForm("lastName")} />
                </div>
                <Field label="Email" id="email" type="email" required placeholder="jane@example.com" value={form.email} onChange={updateForm("email")} />
                <Field label="Phone" id="phone" type="tel" required placeholder="+1 234 567 8900" value={form.phone} onChange={updateForm("phone")} />

                {travelers > 1 && (
                  <div className="space-y-5 border-t border-brand-border/50 pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
                      Additional travelers ({travelers - 1})
                    </p>
                    {form.travelers.map((traveler, i) => (
                      <div key={i} className="space-y-3 rounded-xl border border-brand-border/50 bg-brand-cream/40 p-4">
                        <p className="text-xs font-bold text-brand-ink">Traveler {i + 2}</p>
                        <Field
                          label="Full name"
                          id={`traveler-name-${i}`}
                          required
                          placeholder="Full name"
                          value={traveler.name}
                          onChange={(e) => updateAdditionalTraveler(i, "name", e.target.value)}
                        />
                        <Field
                          label="Email"
                          id={`traveler-email-${i}`}
                          type="email"
                          required
                          placeholder="email@example.com"
                          value={traveler.email}
                          onChange={(e) => updateAdditionalTraveler(i, "email", e.target.value)}
                        />
                        <Field
                          label="Phone"
                          id={`traveler-phone-${i}`}
                          type="tel"
                          required
                          placeholder="+1 234 567 8900"
                          value={traveler.phone}
                          onChange={(e) => updateAdditionalTraveler(i, "phone", e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {step === "payment" && (
              <motion.div key="payment" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.3, ease: EASE }} className="space-y-4">
                <p className="text-sm text-brand-muted">How would you like to secure your spots?</p>

                <button
                  type="button"
                  onClick={() => { setPaymentMode("now"); setStep("pay-now"); }}
                  className="group flex w-full items-start gap-4 rounded-xl border-2 border-brand-border/70 p-5 text-left transition-all hover:border-brand-green hover:bg-brand-green/5"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                  </div>
                  <div>
                    <p className="font-bold text-brand-ink group-hover:text-brand-green">Pay now</p>
                    <p className="mt-1 text-xs leading-relaxed text-brand-muted">
                      Secure all {travelers} {travelers === 1 ? "spot" : "spots"} instantly. Pay in full or a {tour.depositPercent}% deposit today.
                    </p>
                    <p className="mt-2 text-sm font-bold text-brand-green">{formatCurrency(subtotal)} total</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => { setPaymentMode("later"); setStep("pay-later"); }}
                  className="group flex w-full items-start gap-4 rounded-xl border-2 border-brand-border/70 p-5 text-left transition-all hover:border-brand-orange hover:bg-brand-orange/5"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <p className="font-bold text-brand-ink group-hover:text-brand-orange">Pay later</p>
                    <p className="mt-1 text-xs leading-relaxed text-brand-muted">
                      Reserve your spots free for {tour.payLaterHoldHours} hours. Pay the {tour.depositPercent}% deposit before the hold expires.
                    </p>
                    <p className="mt-2 text-sm font-bold text-brand-orange">{formatCurrency(depositAmount)} deposit due later</p>
                  </div>
                </button>
              </motion.div>
            )}

            {step === "pay-now" && (
              <motion.form key="pay-now" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.3, ease: EASE }} onSubmit={handleProceedToPayment} className="space-y-5">
                {/* Order summary */}
                <div className="rounded-xl border border-brand-border/60 bg-brand-cream/50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-muted">Order summary</p>
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-brand-muted">{formatCurrency(tour.priceNum)} × {travelers} {travelers === 1 ? "person" : "people"}</span>
                      <span className="font-semibold text-brand-ink">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-brand-muted">
                      <span>{selectedDate} · {tour.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Pay type toggle */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "full", label: "Pay in full", amount: subtotal },
                    { id: "deposit", label: `${tour.depositPercent}% deposit`, amount: depositAmount },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPayType(opt.id)}
                      className={[
                        "rounded-xl border-2 px-3 py-3 text-left transition-all",
                        payType === opt.id ? "border-brand-green bg-brand-green/5" : "border-brand-border/60 hover:border-brand-green/30",
                      ].join(" ")}
                    >
                      <p className="text-xs font-semibold text-brand-ink">{opt.label}</p>
                      <p className="mt-0.5 text-sm font-bold text-brand-green">{formatCurrency(opt.amount)}</p>
                    </button>
                  ))}
                </div>

                <div className="rounded-xl border border-brand-green/25 bg-brand-green/5 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-brand-ink">Secure payment checkout</p>
                      <p className="mt-1 text-xs leading-relaxed text-brand-muted">
                        You&apos;ll be redirected to our secure payment partner to complete your {payType === "deposit" ? "deposit" : "payment"} of {formatCurrency(payNowAmount)}. Card details are handled entirely by the gateway — we never store them.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-green py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-brand-green-dark disabled:opacity-70"
                >
                  {processing ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden><circle cx="12" cy="12" r="10" strokeOpacity="0.25" /><path d="M12 2a10 10 0 0 1 10 10" /></svg>
                      Redirecting to checkout…
                    </>
                  ) : (
                    <>
                      Continue to secure checkout — {formatCurrency(payNowAmount)}
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                    </>
                  )}
                </button>
              </motion.form>
            )}

            {step === "pay-later" && (
              <motion.form key="pay-later" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.3, ease: EASE }} onSubmit={handlePayLaterConfirm} className="space-y-5">
                <div className="rounded-xl border border-brand-orange/30 bg-brand-orange/5 p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-orange/15 text-brand-orange">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                      <p className="font-bold text-brand-ink">Your spots are held for {tour.payLaterHoldHours} hours</p>
                      <p className="mt-1 text-xs leading-relaxed text-brand-muted">
                        No payment required now. We&apos;ll email you a secure payment link. Pay the {tour.depositPercent}% deposit ({formatCurrency(depositAmount)}) before your hold expires to confirm.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-brand-border/60 bg-brand-cream/50 p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-brand-muted">Tour ({travelers} {travelers === 1 ? "person" : "people"})</span>
                    <span className="font-semibold">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-muted">Due within {tour.payLaterHoldHours}h</span>
                    <span className="font-bold text-brand-orange">{formatCurrency(depositAmount)}</span>
                  </div>
                  <div className="flex justify-between border-t border-brand-border/40 pt-2">
                    <span className="text-brand-muted">Due before departure</span>
                    <span className="font-semibold text-brand-ink">{formatCurrency(subtotal - depositAmount)}</span>
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-brand-muted">
                  <li className="flex items-center gap-2"><span className="text-brand-green">✓</span> Confirmation email sent immediately</li>
                  <li className="flex items-center gap-2"><span className="text-brand-green">✓</span> Flexible — pay deposit or full amount later</li>
                  <li className="flex items-center gap-2"><span className="text-brand-green">✓</span> Spots released if deposit not received in time</li>
                </ul>

                <button
                  type="submit"
                  disabled={processing}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-orange py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-brand-orange-dark disabled:opacity-70"
                >
                  {processing ? "Reserving…" : "Reserve my spots — pay later"}
                </button>
              </motion.form>
            )}

            {step === "success" && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease: EASE }} className="py-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-green/10">
                  <svg className="h-8 w-8 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="mt-5 text-xl font-bold text-brand-ink">
                  {paymentMode === "now" ? "Booking confirmed!" : "Reservation confirmed!"}
                </h3>
                <p className="mt-2 text-sm text-brand-muted">
                  {paymentMode === "now"
                    ? <>Payment of <strong className="text-brand-ink">{formatCurrency(payNowAmount)}</strong> processed. Confirmation sent to <strong className="text-brand-ink">{form.email}</strong></>
                    : <>A confirmation has been sent to <strong className="text-brand-ink">{form.email}</strong></>}
                </p>

                <div className="mt-6 rounded-xl border border-brand-border/60 bg-brand-cream/50 p-4 text-left text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-brand-muted">Booking reference</span>
                    <span className="font-mono font-bold text-brand-green">{bookingRef}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-muted">Tour</span>
                    <span className="font-semibold text-brand-ink">{tour.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-muted">Departure</span>
                    <span>{selectedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-muted">Travelers</span>
                    <span>{travelers}</span>
                  </div>
                  {paymentMode === "now" && (
                    <div className="flex justify-between border-t border-brand-border/40 pt-2">
                      <span className="text-brand-muted">Paid today</span>
                      <span className="font-bold text-brand-green">{formatCurrency(payNowAmount)}</span>
                    </div>
                  )}
                  {paymentMode === "later" && (
                    <div className="flex justify-between border-t border-brand-border/40 pt-2">
                      <span className="text-brand-muted">Deposit due by</span>
                      <span className="font-bold text-brand-orange">{tour.payLaterHoldHours}h</span>
                    </div>
                  )}
                </div>

                <div className="mt-5 rounded-xl border border-brand-gold/40 bg-brand-gold/10 px-4 py-4 text-left">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-gold/20 text-brand-orange">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-brand-ink">Present this receipt at the premises</p>
                      <p className="mt-1 text-xs leading-relaxed text-brand-muted">
                        Download your receipt and show it to AfriQwest staff or your guide upon arrival. This confirms your booking and traveler details.
                      </p>
                      <button
                        type="button"
                        onClick={handleDownloadReceipt}
                        className="mt-3 inline-flex items-center gap-2 rounded-lg bg-brand-green px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-brand-green-dark"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download receipt
                      </button>
                    </div>
                  </div>
                </div>

                <a
                  href={getWhatsAppUrl(`Hi AfriQwest, my booking ref is ${bookingRef}. I'd like to confirm details for ${tour.name}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-green hover:underline"
                >
                  Questions? Chat with us on WhatsApp
                </a>
                <Link
                  to={ROUTES.myBookings}
                  onClick={onClose}
                  className="mt-3 block text-xs font-semibold text-brand-muted hover:text-brand-green"
                >
                  View all my bookings →
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer nav */}
        {step !== "success" && step !== "pay-now" && step !== "pay-later" && (
          <div className="flex items-center justify-between border-t border-brand-border/50 px-6 py-4">
            <button
              type="button"
              onClick={() => {
                if (step === "trip") onClose();
                else if (step === "details") setStep("trip");
                else if (step === "payment") setStep("details");
              }}
              className="text-sm font-semibold text-brand-muted hover:text-brand-ink"
            >
              {step === "trip" ? "Cancel" : "Back"}
            </button>
            {step === "trip" && (
              <button
                type="button"
                disabled={!canProceedTrip}
                onClick={() => setStep("details")}
                className="rounded-xl bg-brand-green px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-green-dark disabled:opacity-50"
              >
                Continue
              </button>
            )}
            {step === "details" && (
              <button
                type="button"
                disabled={!canProceedDetails}
                onClick={() => setStep("payment")}
                className="rounded-xl bg-brand-green px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-green-dark disabled:opacity-50"
              >
                Continue
              </button>
            )}
          </div>
        )}

        {(step === "pay-now" || step === "pay-later") && (
          <div className="border-t border-brand-border/50 px-6 py-3">
            <button type="button" onClick={() => setStep("payment")} className="text-sm font-semibold text-brand-muted hover:text-brand-ink">
              ← Change payment option
            </button>
          </div>
        )}

        {step === "success" && (
          <div className="flex flex-col gap-2 border-t border-brand-border/50 px-6 py-4">
            <button
              type="button"
              onClick={handleDownloadReceipt}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-brand-green/30 bg-brand-green/5 py-3 text-sm font-semibold text-brand-green transition-all hover:bg-brand-green/10"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download receipt
            </button>
            <button type="button" onClick={onClose} className="w-full rounded-xl bg-brand-green py-3 text-sm font-semibold text-white hover:bg-brand-green-dark">
              Done
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
