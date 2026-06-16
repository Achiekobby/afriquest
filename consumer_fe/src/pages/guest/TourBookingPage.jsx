import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import Container from "../../components/layout/Container";
import { ROUTES } from "../../constants/routes";
import { getTourBySlug } from "../../data/toursData";
import { downloadBookingReceipt } from "../../utils/bookingReceipt";
import { saveBooking } from "../../utils/bookingStorage";
import {
  validateEmail,
  validatePhone,
  validateRequired,
} from "../../utils/bookingValidation";

const EASE = [0.16, 1, 0.3, 1];

const STEPS = [
  { id: "info", label: "Your details" },
  { id: "type", label: "Booking type" },
  { id: "details", label: "Trip details" },
  { id: "payment", label: "Payment" },
  { id: "checkout", label: "Confirm" },
];

const GROUP_TYPES = [
  { id: "university", label: "University / School", icon: "🎓", desc: "Study abroad, faculty-led, or student groups" },
  { id: "corporate", label: "Corporate", icon: "💼", desc: "Team retreats, incentives, or company travel" },
  { id: "family", label: "Family & Friends", icon: "👨‍👩‍👧‍👦", desc: "Private group of family or close friends" },
  { id: "other", label: "Other organisation", icon: "👥", desc: "Community, church, NGO, or custom group" },
];

const MAX_GROUP_TRAVELERS = 200;
const MIN_GROUP_TRAVELERS = 2;

function clampGroupTravelers(count) {
  const n = Number.parseInt(String(count), 10);
  if (Number.isNaN(n)) return MIN_GROUP_TRAVELERS;
  return Math.min(MAX_GROUP_TRAVELERS, Math.max(MIN_GROUP_TRAVELERS, n));
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
}

function generateRef() {
  return `AQW-${Date.now().toString(36).toUpperCase().slice(-8)}`;
}

const PAYMENT_LOADING_STEPS = [
  { id: "connect", label: "Connecting to payment gateway" },
  { id: "secure", label: "Establishing secure session" },
  { id: "process", label: "Processing your payment" },
  { id: "confirm", label: "Confirming your booking" },
  { id: "receipt", label: "Generating your receipt" },
];

function PaymentProcessingView({ amount, activeStep, steps }) {
  const progress = Math.min(100, Math.round((activeStep / steps.length) * 100));

  return (
    <motion.div
      key="payment-processing"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="rounded-[1.75rem] border border-brand-border/60 bg-white p-6 shadow-sm sm:p-10"
    >
      <div className="mx-auto max-w-md text-center">
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-brand-green/15" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-brand-green/10 ring-4 ring-brand-green/10">
            <svg className="h-9 w-9 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-brand-orange">Secure payment in progress</p>
        <p className="mt-2 text-3xl font-bold text-brand-green">{formatCurrency(amount)}</p>
        <p className="mt-1 text-sm text-brand-muted">Redirected to payment partner — please wait…</p>
      </div>

      <div className="mx-auto mt-8 max-w-md">
        <div className="mb-2 flex justify-between text-[11px] font-semibold text-brand-muted">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-brand-border/50">
          <motion.div
            className="h-full rounded-full bg-brand-green"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.45, ease: EASE }}
          />
        </div>
      </div>

      <ul className="mx-auto mt-8 max-w-md space-y-2">
        {steps.map((item, index) => {
          const done = index < activeStep;
          const active = index === activeStep && activeStep < steps.length;

          return (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={[
                "flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors",
                active ? "border-brand-green/25 bg-brand-green/5" : "border-transparent bg-brand-cream/40",
              ].join(" ")}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center">
                {done ? (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-green text-white">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </span>
                ) : active ? (
                  <svg className="h-6 w-6 animate-spin text-brand-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                    <path d="M12 2a10 10 0 0 1 10 10" />
                  </svg>
                ) : (
                  <span className="h-2.5 w-2.5 rounded-full bg-brand-border" />
                )}
              </span>
              <span className={[
                "text-sm",
                active ? "font-semibold text-brand-ink" : done ? "text-brand-muted" : "text-brand-muted/60",
              ].join(" ")}>
                {item.label}
              </span>
            </motion.li>
          );
        })}
      </ul>

      <p className="mx-auto mt-8 max-w-sm text-center text-[11px] leading-relaxed text-brand-muted">
        Please keep this tab open. You&apos;ll be redirected to your bookings once payment is confirmed.
      </p>
    </motion.div>
  );
}

function StepProgress({ currentIndex }) {
  return (
    <div className="flex items-center gap-1">
      {STEPS.map((step, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <div key={step.id} className="flex flex-1 items-center gap-1">
            <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
              <div
                className={[
                  "flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold transition-all",
                  done ? "bg-brand-green text-white" : active ? "bg-brand-orange text-white ring-4 ring-brand-orange/20" : "bg-brand-border/50 text-brand-muted",
                ].join(" ")}
              >
                {done ? (
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                ) : (
                  i + 1
                )}
              </div>
              <span className={`hidden truncate text-[10px] font-semibold sm:block ${active ? "text-brand-ink" : "text-brand-muted"}`}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && <div className={`mb-5 h-px flex-1 ${done ? "bg-brand-green" : "bg-brand-border/60"}`} />}
          </div>
        );
      })}
    </div>
  );
}

function FormField({ label, id, error, hint, children, required }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold text-brand-ink">
        {label}{required && <span className="text-brand-orange"> *</span>}
      </label>
      {children}
      {error ? <p className="text-[11px] font-medium text-red-500">{error}</p> : hint ? <p className="text-[11px] text-brand-muted">{hint}</p> : null}
    </div>
  );
}

function inputClass(error) {
  return [
    "h-11 w-full rounded-xl border bg-white px-4 text-sm outline-none transition-all",
    error ? "border-red-400 ring-2 ring-red-100" : "border-brand-border/70 focus:border-brand-green/50 focus:ring-2 focus:ring-brand-green/15",
  ].join(" ");
}

function TourSummary({ tour, travelers, subtotal, selectedDate }) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-brand-border/60 bg-white shadow-[0_12px_40px_-24px_rgba(28,43,38,0.28)]">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={tour.image} alt={tour.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/60 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/80">{tour.country}</p>
          <p className="text-lg font-bold text-white">{tour.name}</p>
        </div>
      </div>
      <div className="space-y-3 p-5 text-sm">
        <div className="flex justify-between">
          <span className="text-brand-muted">Duration</span>
          <span className="font-semibold text-brand-ink">{tour.duration}</span>
        </div>
        {selectedDate && (
          <div className="flex justify-between">
            <span className="text-brand-muted">Departure</span>
            <span className="font-semibold text-brand-ink">{selectedDate}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-brand-muted">Travelers</span>
          <span className="font-semibold text-brand-ink">{travelers}</span>
        </div>
        <div className="flex justify-between border-t border-brand-border/50 pt-3">
          <span className="font-semibold text-brand-ink">Estimated total</span>
          <span className="text-lg font-bold text-brand-green">{formatCurrency(subtotal)}</span>
        </div>
        <p className="text-[11px] text-brand-muted">{formatCurrency(tour.priceNum)} per person</p>
      </div>
    </div>
  );
}

export default function TourBookingPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const tour = getTourBySlug(slug);

  const [step, setStep] = useState("info");
  const [touched, setTouched] = useState({});
  const [processing, setProcessing] = useState(false);
  const [paymentLoadStep, setPaymentLoadStep] = useState(0);
  const formTopRef = useRef(null);
  const isInitialStep = useRef(true);
  const pendingBookingRef = useRef(null);
  const paymentCompleteRef = useRef(false);

  useEffect(() => {
    if (isInitialStep.current) {
      isInitialStep.current = false;
      return;
    }
    formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nationality: "",
    bookingType: null,
    selectedDate: tour?.departureDates?.[0]?.date ?? tour?.nextDate ?? "",
    travelers: 1,
    groupName: "",
    groupType: "",
    organization: "",
    specialRequests: "",
    dietaryNeeds: "",
    paymentMode: null,
  });

  const subtotal = tour ? tour.priceNum * (form.bookingType === "group" ? clampGroupTravelers(form.travelers) : form.travelers) : 0;

  const errors = useMemo(() => ({
    firstName: validateRequired(form.firstName, "First name"),
    lastName: validateRequired(form.lastName, "Last name"),
    email: validateEmail(form.email),
    phone: validatePhone(form.phone),
    bookingType: !form.bookingType ? "Select individual or group booking" : "",
    selectedDate: !form.selectedDate ? "Select a departure date" : "",
    travelers:
      form.bookingType === "group" && form.travelers < MIN_GROUP_TRAVELERS
        ? "Group bookings need at least 2 travelers"
        : form.bookingType === "group" && form.travelers > MAX_GROUP_TRAVELERS
          ? `Maximum ${MAX_GROUP_TRAVELERS} travelers per booking`
          : form.travelers < 1
            ? "At least 1 traveler required"
            : "",
    groupName: form.bookingType === "group" ? validateRequired(form.groupName, "Group name") : "",
    groupType: form.bookingType === "group" && !form.groupType ? "Select a group type" : "",
    paymentMode: !form.paymentMode ? "Choose how you would like to pay" : "",
  }), [form]);

  const stepIndex = useMemo(() => {
    if (step === "info") return 0;
    if (step === "type") return 1;
    if (step === "details") return 2;
    if (step === "payment") return 3;
    return 4;
  }, [step]);

  const isPaymentProcessing = step === "payment-processing";

  const update = useCallback((field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
  }, []);

  const touch = useCallback((field) => {
    setTouched((t) => ({ ...t, [field]: true }));
  }, []);

  const touchFields = useCallback((fields) => {
    setTouched((t) => {
      const next = { ...t };
      fields.forEach((f) => { next[f] = true; });
      return next;
    });
  }, []);

  function showError(field) {
    return touched[field] ? errors[field] : "";
  }

  function canProceedInfo() {
    return !errors.firstName && !errors.lastName && !errors.email && !errors.phone && form.firstName && form.lastName && form.email && form.phone;
  }

  function canProceedType() {
    return form.bookingType === "individual" || form.bookingType === "group";
  }


  function handleGroupTravelersChange(value) {
    const n = Number.parseInt(String(value), 10);
    if (Number.isNaN(n)) return;
    update("travelers", n);
  }

  function handleGroupTravelersBlur() {
    touch("travelers");
    update("travelers", clampGroupTravelers(form.travelers));
  }

  function adjustGroupTravelers(delta) {
    update("travelers", clampGroupTravelers(form.travelers + delta));
  }

  const buildBookingData = useCallback((ref, overrides = {}) => {
    return {
      bookingRef: ref,
      bookingType: form.bookingType,
      tour: {
        name: tour.name,
        slug: tour.slug,
        location: tour.location,
        country: tour.country,
        duration: tour.duration,
        priceNum: tour.priceNum,
        image: tour.image,
      },
      selectedDate: form.selectedDate,
      travelers: form.bookingType === "group" ? clampGroupTravelers(form.travelers) : form.travelers,
      paymentMode: form.paymentMode,
      payType: form.paymentMode === "online" ? "full" : "onsite",
      payNowAmount: form.paymentMode === "online" ? subtotal : 0,
      subtotal,
      depositAmount: Math.round(subtotal * (tour.depositPercent / 100)),
      payLaterHoldHours: tour.payLaterHoldHours,
      depositPercent: tour.depositPercent,
      leadTraveler: {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        nationality: form.nationality,
      },
      groupDetails: form.bookingType === "group" ? {
        groupName: form.groupName,
        groupType: form.groupType,
        organization: form.organization,
      } : null,
      specialRequests: form.specialRequests,
      dietaryNeeds: form.dietaryNeeds,
      additionalTravelers: [],
      issuedAt: new Date().toISOString(),
      ...overrides,
    };
  }, [form, tour, subtotal]);

  const completeBooking = useCallback((ref) => {
    const data = buildBookingData(ref);
    saveBooking(data);
    downloadBookingReceipt(data);
    navigate(`${ROUTES.myBookings}?booked=${ref}`, { replace: true });
  }, [buildBookingData, navigate]);

  useEffect(() => {
    if (step !== "payment-processing") return undefined;

    if (paymentLoadStep >= PAYMENT_LOADING_STEPS.length) {
      if (paymentCompleteRef.current) return undefined;
      paymentCompleteRef.current = true;
      const ref = pendingBookingRef.current;
      if (ref) completeBooking(ref);
      return undefined;
    }

    const delay = paymentLoadStep === 0 ? 700 : paymentLoadStep === PAYMENT_LOADING_STEPS.length - 1 ? 1100 : 900;
    const timer = window.setTimeout(() => setPaymentLoadStep((s) => s + 1), delay);
    return () => window.clearTimeout(timer);
  }, [step, paymentLoadStep, completeBooking]);

  function handleInfoNext(e) {
    e.preventDefault();
    touchFields(["firstName", "lastName", "email", "phone"]);
    if (!canProceedInfo()) return;
    setStep("type");
  }

  function handleTypeNext() {
    touch("bookingType");
    if (!canProceedType()) return;
    setForm((f) => ({
      ...f,
      travelers: f.bookingType === "individual" ? 1 : Math.max(2, f.travelers),
    }));
    setStep("details");
  }

  function handleDetailsNext(e) {
    e.preventDefault();
    const travelers = form.bookingType === "group" ? clampGroupTravelers(form.travelers) : 1;
    const fields = ["selectedDate", "travelers"];
    if (form.bookingType === "group") fields.push("groupName", "groupType");
    touchFields(fields);

    if (!form.selectedDate) return;
    if (form.bookingType === "individual") {
      setForm((f) => ({ ...f, travelers: 1 }));
      setStep("payment");
      return;
    }
    if (!form.groupName || !form.groupType || travelers < MIN_GROUP_TRAVELERS) return;

    setForm((f) => ({ ...f, travelers }));
    setStep("payment");
  }

  function handlePaymentSelect(mode) {
    update("paymentMode", mode);
    setStep("checkout");
  }

  function handleOnlinePayment(e) {
    e.preventDefault();
    pendingBookingRef.current = generateRef();
    paymentCompleteRef.current = false;
    setPaymentLoadStep(0);
    setStep("payment-processing");

    // Payment gateway integration point — on return from gateway, resume with pendingBookingRef
    // e.g. window.location.href = `${PAYMENT_GATEWAY_URL}?ref=${pendingBookingRef.current}&amount=${subtotal}`;
  }

  function handleOnsiteConfirm(e) {
    e.preventDefault();
    setProcessing(true);
    const ref = generateRef();

    setTimeout(() => {
      setProcessing(false);
      completeBooking(ref);
    }, 1400);
  }

  if (!tour) return <Navigate to={ROUTES.tours} replace />;

  return (
    <div className="min-h-screen bg-brand-cream pb-16">
      <div className="border-b border-brand-border/50 bg-white px-4 py-4 sm:px-6 lg:px-8">
        <Container>
          <nav className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-brand-muted">
              <Link to={ROUTES.home} className="hover:text-brand-green">Home</Link>
              <span>/</span>
              <Link to={ROUTES.tours} className="hover:text-brand-green">Tours</Link>
              <span>/</span>
              <Link to={ROUTES.tourDetail(slug)} className="hover:text-brand-green">{tour.name}</Link>
              <span>/</span>
              <span className="font-medium text-brand-ink">Book</span>
            </div>
            <Link to={ROUTES.tourDetail(slug)} className="text-xs font-semibold text-brand-green hover:underline">
              View full itinerary →
            </Link>
          </nav>
        </Container>
      </div>

      <Container className="mt-8">
        <div className="mx-auto max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-orange">Secure booking</p>
            <h1 className="mt-1.5 text-2xl font-bold text-brand-ink sm:text-3xl">Book your tour</h1>
            <p className="mt-1 text-sm text-brand-muted">Complete the steps below — takes about 3 minutes.</p>
          </motion.div>

          <div ref={formTopRef} className="mt-8 scroll-mt-28 rounded-[1.75rem] border border-brand-border/50 bg-white p-5 shadow-sm sm:p-6">
            <StepProgress currentIndex={stepIndex} />
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px] lg:gap-10">
            <div className="min-w-0">
              <AnimatePresence mode="wait">
                {step === "info" && (
                  <motion.form
                    key="info"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    onSubmit={handleInfoNext}
                    className="space-y-5 rounded-[1.75rem] border border-brand-border/60 bg-white p-6 shadow-sm sm:p-8"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-brand-ink">Tell us about yourself</h2>
                      <p className="mt-1 text-sm text-brand-muted">We&apos;ll send your confirmation and receipt to these details.</p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField label="First name" id="firstName" required error={showError("firstName")}>
                        <input id="firstName" value={form.firstName} onChange={(e) => update("firstName", e.target.value)} onBlur={() => touch("firstName")} className={inputClass(showError("firstName"))} placeholder="Jane" />
                      </FormField>
                      <FormField label="Last name" id="lastName" required error={showError("lastName")}>
                        <input id="lastName" value={form.lastName} onChange={(e) => update("lastName", e.target.value)} onBlur={() => touch("lastName")} className={inputClass(showError("lastName"))} placeholder="Mensah" />
                      </FormField>
                    </div>

                    <FormField label="Email address" id="email" required error={showError("email")}>
                      <input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} onBlur={() => touch("email")} className={inputClass(showError("email"))} placeholder="jane@example.com" autoComplete="email" />
                    </FormField>

                    <FormField label="Phone number" id="phone" required error={showError("phone")} hint="Include country code, e.g. +233 24 123 4567">
                      <input id="phone" type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} onBlur={() => touch("phone")} className={inputClass(showError("phone"))} placeholder="+233 24 123 4567" autoComplete="tel" />
                    </FormField>

                    <FormField label="Nationality" id="nationality" hint="Optional — helps us prepare visa guidance">
                      <input id="nationality" value={form.nationality} onChange={(e) => update("nationality", e.target.value)} className={inputClass("")} placeholder="Ghanaian, American, British…" />
                    </FormField>

                    <div className="flex justify-end pt-2">
                      <button type="submit" className="rounded-xl bg-brand-green px-8 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-brand-green-dark">
                        Continue
                      </button>
                    </div>
                  </motion.form>
                )}

                {step === "type" && (
                  <motion.div
                    key="type"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className="space-y-5 rounded-[1.75rem] border border-brand-border/60 bg-white p-6 shadow-sm sm:p-8"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-brand-ink">How are you travelling?</h2>
                      <p className="mt-1 text-sm text-brand-muted">This helps us tailor the booking experience for you.</p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {[
                        { id: "individual", label: "Individual booking", icon: "🧳", desc: "Booking for yourself or one traveler on your behalf" },
                        { id: "group", label: "Group booking", icon: "👥", desc: "Universities, corporates, families, or organised groups" },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => update("bookingType", opt.id)}
                          className={[
                            "flex flex-col items-start gap-3 rounded-2xl border-2 p-5 text-left transition-all",
                            form.bookingType === opt.id ? "border-brand-green bg-brand-green/5 ring-2 ring-brand-green/15" : "border-brand-border/70 hover:border-brand-green/40",
                          ].join(" ")}
                        >
                          <span className="text-3xl">{opt.icon}</span>
                          <div>
                            <p className="font-bold text-brand-ink">{opt.label}</p>
                            <p className="mt-1 text-xs leading-relaxed text-brand-muted">{opt.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                    {showError("bookingType") && <p className="text-[11px] font-medium text-red-500">{errors.bookingType}</p>}

                    <div className="flex justify-between pt-2">
                      <button type="button" onClick={() => setStep("info")} className="text-sm font-semibold text-brand-muted hover:text-brand-ink">← Back</button>
                      <button type="button" onClick={handleTypeNext} className="rounded-xl bg-brand-green px-8 py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-green-dark">Continue</button>
                    </div>
                  </motion.div>
                )}

                {step === "details" && (
                  <motion.form
                    key="details"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    onSubmit={handleDetailsNext}
                    className="space-y-6 rounded-[1.75rem] border border-brand-border/60 bg-white p-6 shadow-sm sm:p-8"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-brand-ink">
                        {form.bookingType === "group" ? "Group details" : "Trip details"}
                      </h2>
                      <p className="mt-1 text-sm text-brand-muted">
                        {form.bookingType === "group"
                          ? "Tell us about your group so we can coordinate logistics."
                          : "Choose your departure date and share any personal requirements."}
                      </p>
                    </div>

                    {form.bookingType === "group" && (
                      <>
                        <FormField label="Group / organisation name" id="groupName" required error={showError("groupName")}>
                          <input id="groupName" value={form.groupName} onChange={(e) => update("groupName", e.target.value)} onBlur={() => touch("groupName")} className={inputClass(showError("groupName"))} placeholder="e.g. Lincoln University Heritage Trip 2025" />
                        </FormField>

                        <div>
                          <p className="text-xs font-semibold text-brand-ink">Group type <span className="text-brand-orange">*</span></p>
                          <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            {GROUP_TYPES.map((gt) => (
                              <button
                                key={gt.id}
                                type="button"
                                onClick={() => update("groupType", gt.id)}
                                className={[
                                  "flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all",
                                  form.groupType === gt.id ? "border-brand-orange bg-brand-orange/5" : "border-brand-border/70 hover:border-brand-orange/30",
                                ].join(" ")}
                              >
                                <span className="text-xl">{gt.icon}</span>
                                <div>
                                  <p className="text-sm font-bold text-brand-ink">{gt.label}</p>
                                  <p className="mt-0.5 text-[11px] text-brand-muted">{gt.desc}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                          {showError("groupType") && <p className="mt-2 text-[11px] font-medium text-red-500">{errors.groupType}</p>}
                        </div>

                        <FormField label="Institution / company (if applicable)" id="organization">
                          <input id="organization" value={form.organization} onChange={(e) => update("organization", e.target.value)} className={inputClass("")} placeholder="University of Lincoln, ABC Corp…" />
                        </FormField>

                        <FormField label="Number of travelers" id="travelers" required error={showError("travelers")} hint="Large groups welcome — we'll confirm capacity for your departure">
                          <div className="flex flex-wrap items-center gap-3">
                            <button
                              type="button"
                              disabled={form.travelers <= MIN_GROUP_TRAVELERS}
                              onClick={() => adjustGroupTravelers(-1)}
                              className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-border text-lg font-bold transition-all hover:border-brand-green disabled:opacity-40"
                              aria-label="Decrease travelers"
                            >
                              −
                            </button>
                            <input
                              id="travelers"
                              type="number"
                              min={MIN_GROUP_TRAVELERS}
                              max={MAX_GROUP_TRAVELERS}
                              inputMode="numeric"
                              value={form.travelers}
                              onChange={(e) => handleGroupTravelersChange(e.target.value)}
                              onBlur={handleGroupTravelersBlur}
                              className="h-11 w-24 rounded-xl border border-brand-border/70 bg-white px-3 text-center text-xl font-bold text-brand-ink outline-none transition-all focus:border-brand-green/50 focus:ring-2 focus:ring-brand-green/15"
                              aria-label="Number of travelers"
                            />
                            <button
                              type="button"
                              disabled={form.travelers >= MAX_GROUP_TRAVELERS}
                              onClick={() => adjustGroupTravelers(1)}
                              className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-border text-lg font-bold transition-all hover:border-brand-green disabled:opacity-40"
                              aria-label="Increase travelers"
                            >
                              +
                            </button>
                            <span className="text-xs text-brand-muted">Min {MIN_GROUP_TRAVELERS} · up to {MAX_GROUP_TRAVELERS}</span>
                          </div>
                        </FormField>
                      </>
                    )}

                    <div>
                      <p className="text-xs font-semibold text-brand-ink">Preferred departure date <span className="text-brand-orange">*</span></p>
                      <div className="mt-3 space-y-2">
                        {tour.departureDates.map((dep) => (
                          <button
                            key={dep.date}
                            type="button"
                            onClick={() => update("selectedDate", dep.date)}
                            className={[
                              "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all",
                              form.selectedDate === dep.date ? "border-brand-green bg-brand-green/5 ring-2 ring-brand-green/20" : "border-brand-border/70 hover:border-brand-green/30",
                            ].join(" ")}
                          >
                            <div>
                              <p className="text-sm font-semibold text-brand-ink">{dep.date}</p>
                              <p className="text-xs text-brand-muted">{dep.label}</p>
                            </div>
                            <span className={`text-xs font-bold ${dep.spots <= 3 ? "text-red-500" : "text-brand-green"}`}>{dep.spots} spots left</span>
                          </button>
                        ))}
                      </div>
                      {showError("selectedDate") && <p className="mt-2 text-[11px] font-medium text-red-500">{errors.selectedDate}</p>}
                    </div>

                    <FormField label="Dietary or accessibility needs" id="dietaryNeeds" hint="Optional — vegetarian, halal, mobility support, etc.">
                      <textarea
                        id="dietaryNeeds"
                        rows={2}
                        value={form.dietaryNeeds}
                        onChange={(e) => update("dietaryNeeds", e.target.value)}
                        className={`${inputClass("")} min-h-[72px] resize-none py-3`}
                        placeholder={form.bookingType === "group" ? "Let us know any requirements for your group…" : "Let us know any dietary or accessibility needs…"}
                      />
                    </FormField>

                    <FormField label="Special requests or notes" id="specialRequests">
                      <textarea
                        id="specialRequests"
                        rows={3}
                        value={form.specialRequests}
                        onChange={(e) => update("specialRequests", e.target.value)}
                        className={`${inputClass("")} min-h-[88px] resize-none py-3`}
                        placeholder="Custom activities, preferred guide language, arrival assistance…"
                      />
                    </FormField>

                    <div className="flex justify-between pt-2">
                      <button type="button" onClick={() => setStep("type")} className="text-sm font-semibold text-brand-muted hover:text-brand-ink">← Back</button>
                      <button type="submit" className="rounded-xl bg-brand-green px-8 py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-green-dark">Continue</button>
                    </div>
                  </motion.form>
                )}

                {step === "payment" && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className="space-y-5 rounded-[1.75rem] border border-brand-border/60 bg-white p-6 shadow-sm sm:p-8"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-brand-ink">How would you like to pay?</h2>
                      <p className="mt-1 text-sm text-brand-muted">Choose online payment or pay when you arrive on site.</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handlePaymentSelect("online")}
                      className="group flex w-full items-start gap-4 rounded-2xl border-2 border-brand-border/70 p-5 text-left transition-all hover:border-brand-green hover:bg-brand-green/5"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-brand-ink group-hover:text-brand-green">Pay online</p>
                        <p className="mt-1 text-xs leading-relaxed text-brand-muted">Redirect to our secure payment gateway — card details handled entirely off-site.</p>
                        <p className="mt-2 text-sm font-bold text-brand-green">{formatCurrency(subtotal)}</p>
                      </div>
                      <svg className="mt-1 h-5 w-5 shrink-0 text-brand-muted group-hover:text-brand-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>

                    <button
                      type="button"
                      onClick={() => handlePaymentSelect("onsite")}
                      className="group flex w-full items-start gap-4 rounded-2xl border-2 border-brand-border/70 p-5 text-left transition-all hover:border-brand-orange hover:bg-brand-orange/5"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-brand-ink group-hover:text-brand-orange">Pay on site</p>
                        <p className="mt-1 text-xs leading-relaxed text-brand-muted">Reserve now, pay at our Accra office or tour check-in. Receipt issued immediately.</p>
                        <p className="mt-2 text-sm font-bold text-brand-orange">No payment required today</p>
                      </div>
                      <svg className="mt-1 h-5 w-5 shrink-0 text-brand-muted group-hover:text-brand-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>

                    <div className="flex justify-start pt-2">
                      <button type="button" onClick={() => setStep("details")} className="text-sm font-semibold text-brand-muted hover:text-brand-ink">← Back</button>
                    </div>
                  </motion.div>
                )}

                {isPaymentProcessing && (
                  <PaymentProcessingView
                    amount={subtotal}
                    activeStep={paymentLoadStep}
                    steps={PAYMENT_LOADING_STEPS}
                  />
                )}

                {step === "checkout" && form.paymentMode === "online" && (
                  <motion.form
                    key="pay-online"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    onSubmit={handleOnlinePayment}
                    className="space-y-5 rounded-[1.75rem] border border-brand-border/60 bg-white p-6 shadow-sm sm:p-8"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-brand-ink">Secure checkout</h2>
                      <p className="mt-1 text-sm text-brand-muted">Review your order, then continue to our payment partner to complete your booking.</p>
                    </div>

                    <div className="rounded-xl border border-brand-border/60 bg-brand-cream/50 p-4 text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-brand-muted">{tour.name}</span>
                        <span className="font-semibold text-brand-ink">{form.travelers} {form.travelers === 1 ? "traveler" : "travelers"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-brand-muted">{form.selectedDate}</span>
                        <span className="text-brand-muted">{tour.duration}</span>
                      </div>
                      <div className="flex justify-between border-t border-brand-border/50 pt-2">
                        <span className="font-semibold text-brand-ink">Total due</span>
                        <span className="text-xl font-bold text-brand-green">{formatCurrency(subtotal)}</span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-brand-green/25 bg-brand-green/5 p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-brand-ink">You&apos;ll be redirected to our payment gateway</p>
                          <p className="mt-1 text-xs leading-relaxed text-brand-muted">
                            AfriQwest never stores card details. Payment of {formatCurrency(subtotal)} is processed securely by our payment partner. Confirmation is sent to <strong className="text-brand-ink">{form.email}</strong>.
                          </p>
                        </div>
                      </div>
                    </div>

                    <ul className="space-y-2 text-xs text-brand-muted">
                      <li className="flex items-center gap-2"><span className="text-brand-green">✓</span> 256-bit encrypted checkout</li>
                      <li className="flex items-center gap-2"><span className="text-brand-green">✓</span> Instant booking confirmation on success</li>
                      <li className="flex items-center gap-2"><span className="text-brand-green">✓</span> Downloadable receipt for your records</li>
                    </ul>

                    <div className="flex justify-between pt-2">
                      <button type="button" onClick={() => setStep("payment")} className="text-sm font-semibold text-brand-muted hover:text-brand-ink">← Back</button>
                      <button type="submit" className="flex items-center gap-2 rounded-xl bg-brand-green px-8 py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-green-dark">
                        Continue to secure checkout
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                      </button>
                    </div>
                  </motion.form>
                )}

                {step === "checkout" && form.paymentMode === "onsite" && (
                  <motion.form
                    key="pay-onsite"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    onSubmit={handleOnsiteConfirm}
                    className="space-y-5 rounded-[1.75rem] border border-brand-border/60 bg-white p-6 shadow-sm sm:p-8"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-brand-ink">Reserve &amp; pay on site</h2>
                      <p className="mt-1 text-sm text-brand-muted">Your spots will be held. Payment is due at check-in or our Accra office.</p>
                    </div>

                    <div className="rounded-xl border border-brand-orange/30 bg-brand-orange/5 p-5">
                      <p className="font-bold text-brand-ink">What happens next</p>
                      <ul className="mt-3 space-y-2.5 text-sm text-brand-muted">
                        <li className="flex items-start gap-2"><span className="text-brand-green">✓</span> Instant reservation confirmation emailed to {form.email || "you"}</li>
                        <li className="flex items-start gap-2"><span className="text-brand-green">✓</span> Downloadable receipt with your booking reference</li>
                        <li className="flex items-start gap-2"><span className="text-brand-green">✓</span> Pay {formatCurrency(subtotal)} at tour check-in or our office</li>
                        <li className="flex items-start gap-2"><span className="text-brand-green">✓</span> Present receipt on arrival at the premises</li>
                      </ul>
                    </div>

                    <div className="rounded-xl border border-brand-border/60 bg-brand-cream/50 p-4 text-sm space-y-2">
                      <div className="flex justify-between"><span className="text-brand-muted">Tour total</span><span className="font-bold text-brand-ink">{formatCurrency(subtotal)}</span></div>
                      <div className="flex justify-between"><span className="text-brand-muted">Due today</span><span className="font-bold text-brand-orange">$0 — pay on site</span></div>
                    </div>

                    <div className="flex justify-between pt-2">
                      <button type="button" onClick={() => setStep("payment")} disabled={processing} className="text-sm font-semibold text-brand-muted hover:text-brand-ink">← Back</button>
                      <button type="submit" disabled={processing} className="flex items-center gap-2 rounded-xl bg-brand-orange px-8 py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-orange-dark disabled:opacity-70">
                        {processing ? "Confirming reservation…" : "Confirm reservation"}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            <div className="lg:sticky lg:top-[88px] lg:self-start">
              <TourSummary tour={tour} travelers={form.travelers} subtotal={subtotal} selectedDate={form.selectedDate} />
              {form.bookingType === "group" && form.groupName && (
                <p className="mt-3 text-center text-xs text-brand-muted">
                  Group: <span className="font-semibold text-brand-ink">{form.groupName}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
