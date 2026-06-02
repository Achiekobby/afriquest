import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import { images } from "../../config/images";
import OtpInput from "../../components/misc/OtpInput";

const EASE = [0.16, 1, 0.3, 1];

const slideIn = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
  transition: { duration: 0.42, ease: EASE },
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from?.pathname || ROUTES.dashboard;

  const [step, setStep] = useState("phone"); // "phone" | "otp"
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [otpError, setOtpError] = useState("");

  function validatePhone(val) {
    if (!val.trim()) return "Phone number is required.";
    if (!/^\+?[\d\s\-()]{7,15}$/.test(val.trim())) return "Enter a valid phone number.";
    return "";
  }

  function handlePhoneBlur() {
    setPhoneTouched(true);
    setPhoneError(validatePhone(phone));
  }

  function handleSendOtp(e) {
    e.preventDefault();
    setPhoneTouched(true);
    const err = validatePhone(phone);
    if (err) { setPhoneError(err); return; }
    setPhoneError("");
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep("otp"); }, 900);
  }

  function handleOtpChange(val) {
    setOtp(val);
    if (otpError) setOtpError("");
  }

  function handleVerify(e) {
    e.preventDefault();
    if (otp.length < 6) { setOtpError("Please enter all 6 digits."); return; }
    setLoading(true);
    // Stub: "000000" simulates a wrong code; everything else succeeds
    setTimeout(() => {
      if (otp === "000000") {
        setLoading(false);
        setOtpError("Incorrect code. Please check and try again.");
        return;
      }
      login("dev-token", { name: "Traveler", phone });
      navigate(redirectTo, { replace: true });
    }, 900);
  }

  function handleResend() {
    setOtp("");
    setOtpError("");
    setStep("phone");
  }

  return (
    <div className="flex h-full">

      {/* ── Left panel — fixed, non-scrollable ── */}
      <div className="relative hidden h-full overflow-hidden lg:flex lg:w-[52%] xl:w-[55%]">
        <img
          src={images.home.ghana}
          alt="AfriQwest travel"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#1C2B26]/45" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1C2B26]/50 via-[#2D5A47]/35 to-[#1C2B26]/50" />

        {/* Kente textile grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'%3E%3Cg fill='none' transform='rotate(45 14 14)'%3E%3Crect width='14' height='14' fill='%232D5A47' fill-opacity='0.08'/%3E%3Crect x='14' y='14' width='14' height='14' fill='%23E3A020' fill-opacity='0.06'/%3E%3C/g%3E%3C/svg%3E\")",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Concentric rings */}
        <svg
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 opacity-[0.07]"
          viewBox="0 0 500 500"
          fill="none"
        >
          <circle cx="250" cy="250" r="80" stroke="#E3A020" strokeWidth="1" />
          <circle cx="250" cy="250" r="140" stroke="#2D5A47" strokeWidth="0.8" strokeDasharray="5 9" />
          <circle cx="250" cy="250" r="200" stroke="#D4611A" strokeWidth="0.6" strokeDasharray="3 12" />
          <circle cx="250" cy="250" r="240" stroke="#E3A020" strokeWidth="0.5" strokeDasharray="8 16" />
        </svg>

        {/* Ambient blobs */}
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-brand-gold/12 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-10 -left-10 h-56 w-56 rounded-full bg-brand-orange/10 blur-3xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14">
          {/* Back + Logo */}
          <div className="space-y-6">
            <Link
              to={ROUTES.home}
              className="inline-flex items-center gap-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to home
            </Link>
            <img src={images.general_logo} alt="AfriQwest Global" className="h-12 w-auto drop-shadow-[0_4px_16px_rgba(227,160,32,0.4)]" />
          </div>

          {/* Bottom copy */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">Since 2014</p>
            <h2 className="mt-3 text-3xl font-bold leading-snug text-white xl:text-4xl">
              Your African journey<br />starts with a single step.
            </h2>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/65">
              Join 5,000+ travelers who have explored Ghana, Kenya, and South Africa with AfriQwest.
            </p>

            {/* Social proof */}
            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {[images.home.kenya, images.home.southAfrica, images.home.ghana].map((src, i) => (
                  <img key={i} src={src} alt="" className="h-9 w-9 rounded-full border-2 border-white/20 object-cover" />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-brand-gold text-sm">{"★★★★★"}</div>
                <p className="text-[11px] text-white/55">Trusted by 5,000+ travelers</p>
              </div>
            </div>

            {/* Kente bottom stripe */}
            <div
              aria-hidden
              className="mt-10 h-1 w-32 rounded-full opacity-60"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg,#2D5A47 0,#2D5A47 6px,transparent 6px,transparent 12px,#E3A020 12px,#E3A020 18px,transparent 18px,transparent 24px,#D4611A 24px,#D4611A 30px,transparent 30px,transparent 36px)",
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Right panel — scrollable ── */}
      <div className="flex h-full flex-1 flex-col items-center justify-center overflow-y-auto bg-brand-cream px-5 py-12 sm:px-10">
        {/* Mobile top bar */}
        <div className="mb-8 w-full lg:hidden">
          <Link
            to={ROUTES.home}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-muted transition-colors hover:text-brand-ink"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to home
          </Link>
          <div className="mt-5 flex justify-center">
            <img src={images.general_logo} alt="AfriQwest Global" className="h-10 w-auto" />
          </div>
        </div>

        <div className="w-full max-w-[400px]">
          <AnimatePresence mode="wait">

            {/* ── Step 1: Phone ── */}
            {step === "phone" && (
              <motion.div key="phone" {...slideIn}>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-orange">Welcome back</p>
                <h1 className="mt-2 text-2xl font-bold tracking-tight text-brand-ink sm:text-3xl">
                  Sign in to AfriQwest
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-brand-muted">
                  Enter your phone number and we'll send you a one-time code.
                </p>

                <form onSubmit={handleSendOtp} className="mt-8 space-y-5">
                  <div>
                    <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted">
                      Phone Number
                    </label>
                    <div className="relative mt-2">
                      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                        <svg className="h-4 w-4 text-brand-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.57 3.37 2 2 0 0 1 3.54 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.73A16 16 0 0 0 16 16.73l.88-.88a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                      </span>
                      <input
                        id="phone"
                        type="tel"
                        autoComplete="tel"
                        required
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (phoneTouched) setPhoneError(validatePhone(e.target.value));
                        }}
                        onBlur={handlePhoneBlur}
                        placeholder="+233 XX XXX XXXX"
                        className={[
                          "w-full rounded-xl border-2 bg-white py-3 pl-10 pr-4 text-sm font-medium text-brand-ink outline-none transition-all duration-200",
                          "placeholder:text-brand-muted/50",
                          "focus:ring-2",
                          phoneError
                            ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                            : "border-brand-border focus:border-brand-green focus:ring-brand-green/15",
                        ].join(" ")}
                      />
                    </div>
                    {phoneError && (
                      <p className="mt-1.5 text-xs text-red-500">{phoneError}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-brand-green py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(45,90,71,0.6)] transition-all hover:bg-brand-green-dark disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                        Sending code…
                      </>
                    ) : (
                      <>
                        Send OTP
                        <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                      </>
                    )}
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-brand-muted">
                  New here?{" "}
                  <Link to={ROUTES.signup} className="font-semibold text-brand-green hover:text-brand-green-dark">
                    Create an account
                  </Link>
                </p>
              </motion.div>
            )}

            {/* ── Step 2: OTP ── */}
            {step === "otp" && (
              <motion.div key="otp" {...slideIn}>
                {/* Back button */}
                <button
                  type="button"
                  onClick={() => { setStep("phone"); setOtp(""); }}
                  className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand-muted transition-colors hover:text-brand-ink"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                  Back
                </button>

                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-orange">Verification</p>
                <h1 className="mt-2 text-2xl font-bold tracking-tight text-brand-ink sm:text-3xl">
                  Enter your OTP
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-brand-muted">
                  We sent a 6-digit code to{" "}
                  <span className="font-semibold text-brand-ink">{phone}</span>
                </p>

                <form onSubmit={handleVerify} className="mt-8 space-y-6">
                  <div className="space-y-2">
                    <OtpInput value={otp} onChange={handleOtpChange} disabled={loading} error={!!otpError} />
                    <AnimatePresence>
                      {otpError && (
                        <motion.p
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center justify-center gap-1.5 text-xs font-medium text-red-500"
                        >
                          <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
                          {otpError}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <button
                    type="submit"
                    disabled={otp.length < 6 || loading}
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-brand-green py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(45,90,71,0.6)] transition-all hover:bg-brand-green-dark disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                        Verifying…
                      </>
                    ) : (
                      <>
                        Verify & Sign in
                        <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                      </>
                    )}
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-brand-muted">
                  Didn't receive a code?{" "}
                  <button
                    type="button"
                    onClick={handleResend}
                    className="font-semibold text-brand-green hover:text-brand-green-dark"
                  >
                    Resend OTP
                  </button>
                </p>

                {/* Security note */}
                <div className="mt-8 flex items-start gap-2.5 rounded-xl border border-brand-border/60 bg-white px-4 py-3">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <p className="text-[11px] leading-relaxed text-brand-muted">
                    This code expires in <span className="font-semibold text-brand-ink">10 minutes</span>. Never share it with anyone.
                  </p>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
