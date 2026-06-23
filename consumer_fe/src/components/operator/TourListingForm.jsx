import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Info, X } from "lucide-react";
import { ROUTES } from "../../constants/routes";
import TourImageField from "./TourImageField";
import TourFeatureImagesField from "./TourFeatureImagesField";
import TourLocationRoutePicker from "./TourLocationRoutePicker";
import {
  BADGE_VARIANTS,
  COUNTRY_OPTIONS,
  GHANA_PACKAGE_LINE_OPTIONS,
  getPackageLinePhotoHints,
  isGhanaPackageLineId,
  TOUR_CATEGORY_OPTIONS,
} from "../../utils/operatorTourStorage";
import {
  TOUR_CURRENCY,
  TOUR_CURRENCY_OPTIONS,
  formatTourPriceLabel,
} from "../../utils/operatorTourConstants";
import { buildTourPayload, formatDepartureDateLabel, getAllocatedDepartureSlots, getRemainingDepartureSlots, validateTourSlotAllocation } from "../../utils/operatorTourMapper";
import {
  normalizeTourImages,
  validateFeatureImagesCollection,
} from "../../utils/tourImageUtils";

const inputClass =
  "w-full rounded-xl border-2 border-brand-border bg-white px-4 py-2.5 text-sm font-medium text-brand-ink outline-none transition-all focus:border-brand-green focus:ring-2 focus:ring-brand-green/15";
const labelClass = "block text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted";
const sectionClass = "rounded-2xl border border-brand-border/70 bg-white p-6 shadow-sm";

const EASE = [0.16, 1, 0.3, 1];

const STEPS = [
  { id: "basics", label: "Basics" },
  { id: "images", label: "Images" },
  { id: "content", label: "Content" },
  { id: "itinerary", label: "Itinerary" },
  { id: "pricing", label: "Pricing & dates" },
  { id: "booking", label: "Booking rules" },
];

function ListingStepProgress({ currentIndex }) {
  return (
    <div className="rounded-[1.75rem] border border-brand-border/60 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-orange">Listing wizard</p>
          <p className="mt-1 text-sm font-semibold text-brand-ink">
            Step {currentIndex + 1} of {STEPS.length} — {STEPS[currentIndex].label}
          </p>
        </div>
        <span className="rounded-full bg-brand-cream px-3 py-1 text-xs font-bold text-brand-green">
          {Math.round(((currentIndex + 1) / STEPS.length) * 100)}%
        </span>
      </div>
      <div className="flex items-center gap-1">
        {STEPS.map((step, i) => {
          const done = i < currentIndex;
          const active = i === currentIndex;
          return (
            <div key={step.id} className="flex flex-1 items-center gap-1">
              <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
                <div
                  className={[
                    "flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-bold transition-all duration-300",
                    done
                      ? "bg-brand-green text-white"
                      : active
                        ? "bg-brand-orange text-white ring-4 ring-brand-orange/20"
                        : "bg-brand-border/40 text-brand-muted",
                  ].join(" ")}
                >
                  {done ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span className={`hidden max-w-full truncate text-center text-[10px] font-semibold sm:block ${active ? "text-brand-ink" : "text-brand-muted"}`}>
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`mb-5 h-0.5 flex-1 rounded-full transition-colors duration-300 ${done ? "bg-brand-green" : "bg-brand-border/50"}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Field({ label, children, hint, hintClassName = "" }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="mt-2">{children}</div>
      {hint ? (
        <p className={`mt-1.5 text-[11px] text-brand-muted ${hintClassName}`}>{hint}</p>
      ) : null}
    </div>
  );
}

function updateListItem(list, index, value) {
  const next = [...list];
  next[index] = value;
  return next;
}

export default function TourListingForm({ initial, onSubmit, submitLabel = "Save listing", isUpdate = false }) {
  const normalizedInitial = useMemo(() => normalizeTourImages(initial), [initial]);
  const [form, setForm] = useState(normalizedInitial);
  const [stepIndex, setStepIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const formTopRef = useRef(null);

  const step = STEPS[stepIndex].id;
  const isLastStep = stepIndex === STEPS.length - 1;
  const nextStep = STEPS[stepIndex + 1];
  const allocatedSlots = useMemo(
    () => getAllocatedDepartureSlots(form.departureDates),
    [form.departureDates],
  );
  const totalTourSlots = Math.max(1, Number(form.totalSlots) || 1);
  const remainingSlots = Math.max(0, totalTourSlots - allocatedSlots);
  const allocationPercent = Math.min(100, Math.round((allocatedSlots / totalTourSlots) * 100));

  useEffect(() => {
    formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [stepIndex]);

  function patch(updates) {
    setForm((prev) => ({ ...prev, ...updates }));
  }

  function handleNameChange(name) {
    patch({ name });
  }

  function handlePriceChange(amount) {
    patch({
      priceAmount: amount,
      priceCurrency: TOUR_CURRENCY.code,
      priceLabel: formatTourPriceLabel(amount),
    });
  }

  function updateDeparture(index, updates) {
    const next = [...form.departureDates];
    next[index] = { ...next[index], ...updates };
    patch({ departureDates: next });
  }

  function handleDepartureSpotsTotal(index, spotsTotal) {
    updateDeparture(index, { spotsTotal: Math.max(1, Number(spotsTotal) || 1) });
  }

  function handleTotalSlotsChange(value) {
    const totalSlots = Math.max(1, Number(value) || 1);
    const updates = { totalSlots };
    if (form.departureDates.length === 1 && !form.departureDates[0].date) {
      updates.departureDates = [{ ...form.departureDates[0], spotsTotal: totalSlots }];
    }
    patch(updates);
  }

  function handleAddDeparture() {
    const remaining = getRemainingDepartureSlots(form.totalSlots, form.departureDates);
    if (remaining <= 0) {
      setFormError("All tour slots are allocated. Adjust departure slots or increase total tour slots.");
      return;
    }
    setFormError("");
    patch({
      departureDates: [
        ...form.departureDates,
        { date: "", dateLabel: "", spotsTotal: remaining, label: "" },
      ],
    });
  }

  function handleCountryChange(countryId) {
    const country = COUNTRY_OPTIONS.find((c) => c.id === countryId);
    if (!country) return;
    const themeCategories = form.categories.filter(
      (c) => TOUR_CATEGORY_OPTIONS.some((option) => option.id === c),
    );
    patch({
      countryId: country.id,
      countryCode: country.dialCode,
      country: country.country,
      packageLineId: country.id === "ghana" ? form.packageLineId : "",
      categories: [country.id, ...(country.id === "ghana" && form.packageLineId ? [form.packageLineId] : []), ...themeCategories],
    });
  }

  function handlePackageLineChange(packageLineId) {
    const themeCategories = form.categories.filter(
      (c) => TOUR_CATEGORY_OPTIONS.some((option) => option.id === c),
    );
    patch({
      packageLineId,
      categories: [form.countryId, packageLineId, ...themeCategories],
    });
  }

  function toggleCategory(id) {
    if (COUNTRY_OPTIONS.some((option) => option.id === id) || isGhanaPackageLineId(id)) return;
    const has = form.categories.includes(id);
    const themeCategories = has
      ? form.categories.filter((c) => c !== id)
      : [...form.categories, id];
    const nextCategories = [form.countryId];
    if (form.countryId === "ghana" && form.packageLineId) {
      nextCategories.push(form.packageLineId);
    }
    nextCategories.push(...themeCategories.filter((c) => TOUR_CATEGORY_OPTIONS.some((option) => option.id === c)));
    patch({ categories: [...new Set(nextCategories)] });
  }

  function validateStep(index) {
    const stepId = STEPS[index]?.id;
    if (stepId === "basics") {
      if (!form.name.trim()) return "Tour name is required before continuing.";
      if (!(form.locations || []).length) return "Add at least one city to your tour route before continuing.";
      if (form.countryId === "ghana" && !form.packageLineId) {
        return "Select a Ghana package line (Accra, Kumasi, Volta, or End of Year) before continuing.";
      }
    }
    if (stepId === "images") {
      return validateFeatureImagesCollection(form.featureImages) || "";
    }
    if (stepId === "pricing") {
      return validateTourSlotAllocation(form);
    }
    return "";
  }

  function goToStep(index) {
    setFormError("");
    setStepIndex(index);
  }

  function handleBack() {
    if (stepIndex > 0) goToStep(stepIndex - 1);
  }

  function handleContinue() {
    const error = validateStep(stepIndex);
    if (error) {
      setFormError(error);
      return;
    }
    goToStep(stepIndex + 1);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    for (let i = 0; i < STEPS.length; i += 1) {
      const error = validateStep(i);
      if (error) {
        setFormError(error);
        goToStep(i);
        return;
      }
    }

    setFormError("");
    setSaving(true);
    const payload = buildTourPayload({
      ...form,
      durationLabel: `${form.durationDays} days`,
      priceLabel: formatTourPriceLabel(form.priceAmount),
      highlights: form.highlights.filter(Boolean),
      included: form.included.filter(Boolean),
      notIncluded: form.notIncluded.filter(Boolean),
      featureImages: (form.featureImages || []).filter((img) => img?.uri || img?.data),
      departureDates: form.departureDates.filter((d) => d.date),
    }, { isUpdate });

    try {
      await onSubmit(payload);
    } finally {
      setSaving(false);
    }
  }


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div ref={formTopRef} className="scroll-mt-28">
        <ListingStepProgress currentIndex={stepIndex} />
      </div>

      <AnimatePresence mode="wait">
      {step === "basics" && (
        <motion.div key="basics" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35, ease: EASE }} className={`${sectionClass} grid gap-5 sm:grid-cols-2`}>
          <div className="sm:col-span-2">
            <h2 className="text-xl font-bold text-brand-ink">Tour basics</h2>
            <p className="mt-1 text-sm text-brand-muted">Core details shown on listing cards. URL slug is generated by the backend.</p>
          </div>
          <Field label="Tour name" hint="Displayed on cards and detail pages. URL slug is generated by the backend.">
            <input className={inputClass} value={form.name} onChange={(e) => handleNameChange(e.target.value)} required placeholder="Ghana Heritage Classic" />
          </Field>
          <div className="sm:col-span-2">
            <TourLocationRoutePicker
              value={form.locations || []}
              onChange={(locations) => patch({ locations })}
              countryId={form.countryId}
              error={formError && !(form.locations || []).length ? formError : ""}
            />
          </div>
          <Field label="Country">
            <select className={inputClass} value={form.countryId} onChange={(e) => handleCountryChange(e.target.value)}>
              {COUNTRY_OPTIONS.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Duration (days)">
            <input type="number" min={1} className={inputClass} value={form.durationDays} onChange={(e) => patch({ durationDays: Number(e.target.value) })} />
          </Field>
          <Field label="Status">
            <select className={inputClass} value={form.status} onChange={(e) => patch({ status: e.target.value })}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </Field>
          {form.countryId === "ghana" ? (
            <div className="sm:col-span-2">
              <p className={labelClass}>Ghana package line</p>
              <p className="mt-1 text-xs text-brand-muted">Primary product category — used for browsing and photo guidance.</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {GHANA_PACKAGE_LINE_OPTIONS.map((option) => {
                  const active = form.packageLineId === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handlePackageLineChange(option.id)}
                      className={[
                        "rounded-xl border px-4 py-3 text-left transition-all",
                        active
                          ? "border-brand-green bg-brand-green/5 ring-2 ring-brand-green/20"
                          : "border-brand-border bg-white hover:border-brand-green/30",
                      ].join(" ")}
                    >
                      <span className="text-lg" aria-hidden>{option.icon}</span>
                      <p className="mt-1 text-sm font-bold text-brand-ink">{option.label}</p>
                      <p className="mt-0.5 text-xs text-brand-muted">{option.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
          <div className="sm:col-span-2">
            <p className={labelClass}>Experience themes</p>
            <p className="mt-1 text-xs text-brand-muted">Optional tags describing the type of experience.</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {TOUR_CATEGORY_OPTIONS.map((cat) => {
                const active = form.categories.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={[
                      "rounded-full px-3 py-1.5 text-xs font-semibold transition-all",
                      active ? "bg-brand-green text-white" : "bg-brand-cream text-brand-muted ring-1 ring-brand-border",
                    ].join(" ")}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex flex-wrap gap-4 sm:col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium text-brand-ink">
              <input type="checkbox" checked={form.featured} onChange={(e) => patch({ featured: e.target.checked })} className="h-4 w-4 rounded border-brand-border text-brand-green" />
              Featured on homepage
            </label>
          </div>
          <Field label="Badge text (optional)">
            <input className={inputClass} value={form.badge} onChange={(e) => patch({ badge: e.target.value })} placeholder="Best seller" />
          </Field>
          <Field label="Badge color">
            <select className={inputClass} value={form.badgeVariant} onChange={(e) => patch({ badgeVariant: e.target.value })}>
              {BADGE_VARIANTS.map((b) => (
                <option key={b.id} value={b.id}>{b.label}</option>
              ))}
            </select>
          </Field>
        </motion.div>
      )}

      {step === "images" && (
        <motion.div key="images" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35, ease: EASE }} className={`${sectionClass} space-y-8`}>
          <div>
            <h2 className="text-xl font-bold text-brand-ink">Images</h2>
            <p className="mt-1 text-sm text-brand-muted">Cover image plus up to five gallery photos — select multiple at once.</p>
          </div>

          {form.countryId === "ghana" && form.packageLineId ? (
            <div className="rounded-xl border border-brand-gold/30 bg-brand-gold/5 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-orange">Photo guidance</p>
              <p className="mt-2 text-sm font-semibold text-brand-ink">
                {GHANA_PACKAGE_LINE_OPTIONS.find((option) => option.id === form.packageLineId)?.label} package
              </p>
              {(() => {
                const hints = getPackageLinePhotoHints(form.packageLineId);
                if (!hints) return null;
                return (
                  <ul className="mt-2 space-y-1.5 text-sm text-brand-muted">
                    <li><span className="font-semibold text-brand-ink">Cover:</span> {hints.cover}</li>
                    <li><span className="font-semibold text-brand-ink">Gallery:</span> {hints.gallery}</li>
                  </ul>
                );
              })()}
            </div>
          ) : null}

          <TourImageField
            label="Cover image"
            hint="Paste a public image URL or upload a file — sent as coverImageUrl in the API payload."
            value={form.coverImage}
            onChange={(coverImage) => patch({ coverImage })}
            uriPlaceholder="https://…/cover.jpg"
          />

          <TourFeatureImagesField
            coverImage={form.coverImage}
            value={form.featureImages || []}
            onChange={(featureImages) => patch({ featureImages })}
            onError={setFormError}
          />
        </motion.div>
      )}

      {step === "content" && (
        <motion.div key="content" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35, ease: EASE }} className={`${sectionClass} space-y-5`}>
          <div>
            <h2 className="text-xl font-bold text-brand-ink">Content</h2>
            <p className="mt-1 text-sm text-brand-muted">Description, highlights, and what is included or not.</p>
          </div>
          <Field label="Description">
            <textarea className={`${inputClass} min-h-[120px]`} value={form.description} onChange={(e) => patch({ description: e.target.value })} placeholder="Tell travelers what makes this experience unforgettable…" />
          </Field>
          <div>
            <p className={labelClass}>Highlights</p>
            <div className="mt-2 space-y-2">
              {form.highlights.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    className={inputClass}
                    value={item}
                    onChange={(e) => patch({ highlights: updateListItem(form.highlights, i, e.target.value) })}
                    placeholder={`Highlight ${i + 1}`}
                  />
                  {form.highlights.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => patch({ highlights: form.highlights.filter((_, idx) => idx !== i) })}
                      className="shrink-0 rounded-lg p-2 text-brand-muted transition-colors hover:bg-red-50 hover:text-red-500"
                      aria-label={`Remove highlight ${i + 1}`}
                    >
                      <X className="h-4 w-4" strokeWidth={2} aria-hidden />
                    </button>
                  ) : null}
                </div>
              ))}
              <button type="button" onClick={() => patch({ highlights: [...form.highlights, ""] })} className="text-xs font-semibold text-brand-green hover:underline">+ Add highlight</button>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className={labelClass}>Included</p>
              <div className="mt-2 space-y-2">
                {form.included.map((item, i) => (
                  <input key={i} className={inputClass} value={item} onChange={(e) => patch({ included: updateListItem(form.included, i, e.target.value) })} />
                ))}
                <button type="button" onClick={() => patch({ included: [...form.included, ""] })} className="text-xs font-semibold text-brand-green hover:underline">+ Add item</button>
              </div>
            </div>
            <div>
              <p className={labelClass}>Not included</p>
              <div className="mt-2 space-y-2">
                {form.notIncluded.map((item, i) => (
                  <input key={i} className={inputClass} value={item} onChange={(e) => patch({ notIncluded: updateListItem(form.notIncluded, i, e.target.value) })} />
                ))}
                <button type="button" onClick={() => patch({ notIncluded: [...form.notIncluded, ""] })} className="text-xs font-semibold text-brand-green hover:underline">+ Add item</button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {step === "itinerary" && (
        <motion.div key="itinerary" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35, ease: EASE }} className={`${sectionClass} space-y-4`}>
          <div>
            <h2 className="text-xl font-bold text-brand-ink">Itinerary</h2>
            <p className="mt-1 text-sm text-brand-muted">
              Build your day-by-day plan. Each entry needs a day number, a short title, and a description of what happens.
            </p>
          </div>
          {form.itinerary.map((day, i) => (
            <div key={i} className="rounded-xl border border-brand-border/60 bg-brand-cream/50 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-bold text-brand-ink">Itinerary entry {i + 1}</p>
                {form.itinerary.length > 1 && (
                  <button type="button" onClick={() => patch({ itinerary: form.itinerary.filter((_, idx) => idx !== i) })} className="text-xs font-semibold text-red-500 hover:underline">Remove day</button>
                )}
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-[9rem_1fr]">
                <Field
                  label="Day number"
                  hint="1 = arrival · 10 = departure"
                  hintClassName="whitespace-nowrap"
                >
                  <input
                    type="number"
                    min={1}
                    className={inputClass}
                    value={day.day}
                    onChange={(e) => {
                      const next = [...form.itinerary];
                      next[i] = { ...day, day: Number(e.target.value) };
                      patch({ itinerary: next });
                    }}
                    placeholder="1"
                  />
                </Field>
                <Field label="Day title" hint="Short headline shown in the itinerary — e.g. “Welcome to Accra”.">
                  <input
                    className={inputClass}
                    value={day.title}
                    onChange={(e) => {
                      const next = [...form.itinerary];
                      next[i] = { ...day, title: e.target.value };
                      patch({ itinerary: next });
                    }}
                    placeholder="Welcome to Accra"
                  />
                </Field>
              </div>
              <div className="mt-4">
                <Field label="Day description" hint="What travelers do this day — activities, meals, transfers, and highlights.">
                  <textarea
                    className={`${inputClass} min-h-[100px]`}
                    value={day.description}
                    onChange={(e) => {
                      const next = [...form.itinerary];
                      next[i] = { ...day, description: e.target.value };
                      patch({ itinerary: next });
                    }}
                    placeholder="Meet your guide, settle in, and enjoy a welcome dinner with a full trip briefing."
                  />
                </Field>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => patch({ itinerary: [...form.itinerary, { day: form.itinerary.length + 1, title: "", description: "" }] })}
            className="text-sm font-semibold text-brand-green hover:underline"
          >
            + Add day
          </button>
        </motion.div>
      )}

      {step === "pricing" && (
        <motion.div key="pricing" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35, ease: EASE }} className={`${sectionClass} space-y-6`}>
          <div>
            <h2 className="text-xl font-bold text-brand-ink">Pricing & departures</h2>
            <p className="mt-1 text-sm text-brand-muted">
              Set your tour price and total capacity, then split slots across each departure date.
            </p>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-brand-green/20 bg-brand-green/5 px-4 py-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" strokeWidth={2} aria-hidden />
            <p className="text-xs leading-relaxed text-brand-muted">
              <span className="font-semibold text-brand-ink">How this works:</span> Set one{" "}
              <span className="font-semibold text-brand-ink">total tour slots</span> figure for the whole listing.
              Then divide those slots across each <span className="font-semibold text-brand-ink">departure date</span> — they must add up exactly.
              Available seats per date are tracked automatically as bookings come in.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Price (Ghana Cedis)" hint={`Displayed as ${formatTourPriceLabel(form.priceAmount || 0)} on your listing.`}>
              <input
                type="number"
                min={0}
                className={inputClass}
                value={form.priceAmount}
                onChange={(e) => handlePriceChange(Number(e.target.value))}
              />
            </Field>
            <Field label="Currency">
              <select
                className={inputClass}
                value={form.priceCurrency || TOUR_CURRENCY.code}
                onChange={(e) => {
                  const selected = TOUR_CURRENCY_OPTIONS.find((c) => c.code === e.target.value) || TOUR_CURRENCY;
                  patch({
                    priceCurrency: selected.code,
                    priceLabel: formatTourPriceLabel(form.priceAmount),
                  });
                }}
              >
                {TOUR_CURRENCY_OPTIONS.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.label} ({currency.code})
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field
            label="Total tour slots"
            hint="Your overall capacity for this tour. Split this number across all departure dates below."
          >
            <input
              type="number"
              min={1}
              className={inputClass}
              value={form.totalSlots ?? totalTourSlots}
              onChange={(e) => handleTotalSlotsChange(Number(e.target.value))}
              placeholder="18"
            />
          </Field>

          <div className="rounded-xl border border-brand-border/60 bg-brand-cream/40 px-4 py-3">
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="font-semibold uppercase tracking-[0.12em] text-brand-muted">Slots allocated</span>
              <span
                className={[
                  "font-bold tabular-nums",
                  allocatedSlots === totalTourSlots
                    ? "text-brand-green"
                    : allocatedSlots > totalTourSlots
                      ? "text-red-500"
                      : "text-brand-orange",
                ].join(" ")}
              >
                {allocatedSlots} / {totalTourSlots}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-brand-border/40">
              <div
                className={[
                  "h-full rounded-full transition-all duration-300",
                  allocatedSlots > totalTourSlots ? "bg-red-400" : allocatedSlots === totalTourSlots ? "bg-brand-green" : "bg-brand-orange",
                ].join(" ")}
                style={{ width: `${allocationPercent}%` }}
              />
            </div>
            {allocatedSlots !== totalTourSlots ? (
              <p className="mt-2 text-[11px] text-brand-muted">
                {allocatedSlots < totalTourSlots
                  ? `${remainingSlots} slot${remainingSlots === 1 ? "" : "s"} left to assign across departures.`
                  : `${allocatedSlots - totalTourSlots} slot${allocatedSlots - totalTourSlots === 1 ? "" : "s"} over your tour total — reduce departure slots or increase total tour slots.`}
              </p>
            ) : (
              <p className="mt-2 text-[11px] font-medium text-brand-green">All tour slots are allocated across departures.</p>
            )}
          </div>

          <div>
            <p className={labelClass}>Scheduled departures</p>
            <p className="mt-1 text-[11px] text-brand-muted">
              Add every date this tour runs. Slots per date must sum to your total tour slots.
            </p>
            <div className="mt-4 space-y-4">
              {form.departureDates.map((dep, i) => (
                <div key={i} className="rounded-xl border border-brand-border/60 bg-brand-cream/40 p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <p className="text-sm font-bold text-brand-ink">Departure {i + 1}</p>
                    {form.departureDates.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => patch({ departureDates: form.departureDates.filter((_, idx) => idx !== i) })}
                        className="text-xs font-semibold text-red-500 hover:underline"
                      >
                        Remove date
                      </button>
                    ) : null}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Departure date" hint="When this trip leaves.">
                      <input
                        type="date"
                        className={inputClass}
                        value={dep.date}
                        onChange={(e) => updateDeparture(i, {
                          date: e.target.value,
                          dateLabel: formatDepartureDateLabel(e.target.value),
                        })}
                      />
                    </Field>
                    <Field label="Slots for this departure" hint="Part of your total tour slots. All departures must add up to the total above.">
                      <input
                        type="number"
                        min={1}
                        className={inputClass}
                        value={dep.spotsTotal}
                        onChange={(e) => handleDepartureSpotsTotal(i, Number(e.target.value))}
                        placeholder="18"
                      />
                    </Field>
                  </div>
                  {dep.date ? (
                    <p className="mt-3 text-[11px] text-brand-muted">
                      Preview: <span className="font-semibold text-brand-ink">{dep.dateLabel || formatDepartureDateLabel(dep.date)}</span>
                      {" · "}
                      {dep.spotsTotal} slots
                    </p>
                  ) : null}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddDeparture}
                className="text-sm font-semibold text-brand-green hover:underline"
              >
                + Add another departure date
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {step === "booking" && (
        <motion.div key="booking" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35, ease: EASE }} className={`${sectionClass} grid gap-5 sm:grid-cols-2`}>
          <div className="sm:col-span-2">
            <h2 className="text-xl font-bold text-brand-ink">Booking rules</h2>
            <p className="mt-1 text-sm text-brand-muted">Payment options and group booking limits.</p>
          </div>
          <Field label="Deposit % (online)">
            <input type="number" min={0} max={100} className={inputClass} value={form.bookingSettings.depositPercent} onChange={(e) => patch({ bookingSettings: { ...form.bookingSettings, depositPercent: Number(e.target.value) } })} />
          </Field>
          <Field label="Min group booking size">
            <input type="number" min={1} className={inputClass} value={form.bookingSettings.minGroupSize} onChange={(e) => patch({ bookingSettings: { ...form.bookingSettings, minGroupSize: Number(e.target.value) } })} />
          </Field>
          <Field label="Max group booking size">
            <input type="number" min={2} className={inputClass} value={form.bookingSettings.maxGroupSize} onChange={(e) => patch({ bookingSettings: { ...form.bookingSettings, maxGroupSize: Number(e.target.value) } })} />
          </Field>
          <div className="flex flex-col gap-3 sm:col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium text-brand-ink">
              <input type="checkbox" checked={form.bookingSettings.onlinePaymentAllowed} onChange={(e) => patch({ bookingSettings: { ...form.bookingSettings, onlinePaymentAllowed: e.target.checked } })} className="h-4 w-4 rounded border-brand-border text-brand-green" />
              Allow online payment (gateway redirect)
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-brand-ink">
              <input type="checkbox" checked={form.bookingSettings.payOnSiteAllowed} onChange={(e) => patch({ bookingSettings: { ...form.bookingSettings, payOnSiteAllowed: e.target.checked } })} className="h-4 w-4 rounded border-brand-border text-brand-green" />
              Allow pay on-site reservation
            </label>
          </div>
        </motion.div>
      )}
      </AnimatePresence>

      <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-brand-border/70 bg-white/95 p-5 shadow-lg backdrop-blur-sm">
        <div className="min-w-0 flex-1">
          {formError ? (
            <p className="text-sm font-medium text-red-500">{formError}</p>
          ) : (
            <p className="text-sm text-brand-muted">
              {isLastStep
                ? "Review booking rules, then save your listing."
                : `Complete this section, then continue to ${nextStep?.label}.`}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to={ROUTES.operator.tours} className="btn-secondary">Cancel</Link>
          {stepIndex > 0 && (
            <button type="button" onClick={handleBack} className="btn-secondary inline-flex items-center gap-1.5">
              <ChevronLeft className="h-4 w-4" strokeWidth={2} />
              Back
            </button>
          )}
          {isLastStep ? (
            <button type="submit" disabled={saving || !form.name.trim()} className="btn-primary">
              {saving ? "Saving…" : submitLabel}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleContinue}
              className="btn-primary inline-flex items-center gap-1.5"
            >
              Continue to {nextStep?.label}
              <ChevronRight className="h-4 w-4" strokeWidth={2} />
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
