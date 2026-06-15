import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import { ROUTES } from "../../constants/routes";
import TourImageField from "./TourImageField";
import {
  BADGE_VARIANTS,
  COUNTRY_OPTIONS,
  TOUR_CATEGORY_OPTIONS,
  buildTourApiPayload,
} from "../../utils/operatorTourStorage";
import {
  MAX_FEATURE_IMAGES,
  MAX_FEATURE_IMAGES_TOTAL_BYTES,
  defaultFeatureImage,
  formatBytes,
  getFeatureImagesTotalBytes,
  getImagePreviewSrc,
  normalizeTourImages,
  validateFeatureImageFile,
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

function Field({ label, children, hint }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="mt-2">{children}</div>
      {hint ? <p className="mt-1.5 text-[11px] text-brand-muted">{hint}</p> : null}
    </div>
  );
}

function updateListItem(list, index, value) {
  const next = [...list];
  next[index] = value;
  return next;
}

export default function TourListingForm({ initial, onSubmit, submitLabel = "Save listing" }) {
  const normalizedInitial = useMemo(() => normalizeTourImages(initial), [initial]);
  const [form, setForm] = useState(normalizedInitial);
  const [stepIndex, setStepIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const formTopRef = useRef(null);

  const step = STEPS[stepIndex].id;
  const isLastStep = stepIndex === STEPS.length - 1;
  const nextStep = STEPS[stepIndex + 1];

  useEffect(() => {
    formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [stepIndex]);

  const featureBytesUsed = getFeatureImagesTotalBytes(form.featureImages || []);
  const featureCount = (form.featureImages || []).filter((img) => img?.uri || img?.data).length;

  function patch(updates) {
    setForm((prev) => ({ ...prev, ...updates }));
  }

  function handleNameChange(name) {
    patch({
      name,
      priceLabel: form.priceAmount ? `From $${Number(form.priceAmount).toLocaleString()}` : form.priceLabel,
    });
  }

  function handleCountryChange(code) {
    const country = COUNTRY_OPTIONS.find((c) => c.code === code);
    if (!country) return;
    patch({
      countryCode: code,
      country: country.country,
      categories: [code, ...form.categories.filter((c) => !COUNTRY_OPTIONS.some((o) => o.code === c))],
    });
  }

  function toggleCategory(id) {
    const has = form.categories.includes(id);
    patch({
      categories: has ? form.categories.filter((c) => c !== id) : [...form.categories, id],
    });
  }

  function validateStep(index) {
    const stepId = STEPS[index]?.id;
    if (stepId === "basics") {
      if (!form.name.trim()) return "Tour name is required before continuing.";
      if (!form.location.trim()) return "Location is required before continuing.";
    }
    if (stepId === "images") {
      return validateFeatureImagesCollection(form.featureImages) || "";
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

  function handleSubmit(e) {
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
    const payload = buildTourApiPayload({
      ...form,
      durationLabel: `${form.durationDays} days`,
      groupSizeLabel: `${form.groupSizeMin}–${form.groupSizeMax} pax`,
      priceLabel: `From $${Number(form.priceAmount).toLocaleString()}`,
      highlights: form.highlights.filter(Boolean),
      included: form.included.filter(Boolean),
      notIncluded: form.notIncluded.filter(Boolean),
      featureImages: (form.featureImages || []).filter((img) => img?.uri || img?.data),
      departureDates: form.departureDates.filter((d) => d.date),
    });
    onSubmit(payload);
    setSaving(false);
  }

  function updateFeatureImage(index, nextImage) {
    const featureImages = [...(form.featureImages || [])];
    featureImages[index] = nextImage;
    patch({ featureImages });
    setFormError("");
  }

  function addFeatureImage() {
    if ((form.featureImages || []).length >= MAX_FEATURE_IMAGES) {
      setFormError(`You can upload up to ${MAX_FEATURE_IMAGES} feature images.`);
      return;
    }
    setFormError("");
    patch({
      featureImages: [...(form.featureImages || []), defaultFeatureImage(form.featureImages?.length || 0)],
    });
  }

  function removeFeatureImage(index) {
    patch({
      featureImages: (form.featureImages || []).filter((_, i) => i !== index),
    });
    setFormError("");
  }

  function validateFeatureUpload(file, replaceIndex) {
    return validateFeatureImageFile(file, form.featureImages || [], replaceIndex);
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
          <Field label="Location">
            <input className={inputClass} value={form.location} onChange={(e) => patch({ location: e.target.value })} placeholder="Accra → Cape Coast → Kumasi" />
          </Field>
          <Field label="Country">
            <select className={inputClass} value={form.countryCode} onChange={(e) => handleCountryChange(e.target.value)}>
              {COUNTRY_OPTIONS.map((c) => (
                <option key={c.code} value={c.code}>{c.label}</option>
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
          <div className="sm:col-span-2">
            <p className={labelClass}>Categories</p>
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
            <p className="mt-1 text-sm text-brand-muted">Cover image plus up to five feature images (10 MB total).</p>
          </div>
          <TourImageField
            label="Cover image"
            hint="Main listing image. Sent as { uri, data } with base64 in data."
            value={form.coverImage}
            onChange={(coverImage) => patch({ coverImage })}
            uriPlaceholder="tours/cover.jpg"
          />

          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className={labelClass}>Feature images</p>
                <p className="mt-1 text-[11px] text-brand-muted">
                  Up to {MAX_FEATURE_IMAGES} images, {formatBytes(MAX_FEATURE_IMAGES_TOTAL_BYTES)} total across all feature uploads.
                </p>
              </div>
              <button
                type="button"
                onClick={addFeatureImage}
                disabled={(form.featureImages || []).length >= MAX_FEATURE_IMAGES}
                className="inline-flex items-center gap-2 rounded-xl border border-brand-border px-3 py-2 text-xs font-semibold text-brand-green transition-all hover:bg-brand-cream disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus className="h-4 w-4" strokeWidth={2} />
                Add feature image
              </button>
            </div>

            <div className="mb-5 rounded-xl border border-brand-border/60 bg-brand-cream/40 px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-brand-ink">
                <span>{featureCount} / {MAX_FEATURE_IMAGES} images</span>
                <span>{formatBytes(featureBytesUsed)} / {formatBytes(MAX_FEATURE_IMAGES_TOTAL_BYTES)} used</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
                <div
                  className={`h-full rounded-full transition-all ${featureBytesUsed > MAX_FEATURE_IMAGES_TOTAL_BYTES ? "bg-red-500" : "bg-brand-green"}`}
                  style={{ width: `${Math.min(100, (featureBytesUsed / MAX_FEATURE_IMAGES_TOTAL_BYTES) * 100)}%` }}
                />
              </div>
            </div>

            {(form.featureImages || []).length === 0 ? (
              <div className="rounded-xl border border-dashed border-brand-border bg-brand-cream/50 px-6 py-10 text-center">
                <p className="text-sm font-semibold text-brand-ink">No feature images yet</p>
                <p className="mt-2 text-xs text-brand-muted">Add supporting photos for your listing detail page.</p>
                <button type="button" onClick={addFeatureImage} className="btn-primary mt-5 inline-flex text-xs">
                  Add first feature image
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {(form.featureImages || []).map((image, index) => (
                  <div key={index} className="rounded-xl border border-brand-border/60 bg-brand-cream/30 p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-brand-ink">Feature image {index + 1}</p>
                      <button
                        type="button"
                        onClick={() => removeFeatureImage(index)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:underline"
                      >
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                        Remove
                      </button>
                    </div>
                    <TourImageField
                      label={`Feature ${index + 1}`}
                      value={image}
                      onChange={(next) => updateFeatureImage(index, next)}
                      uriPlaceholder={`feature-${index + 1}.jpg`}
                      showUriField={false}
                      beforeUpload={(file) => validateFeatureUpload(file, index)}
                    />
                  </div>
                ))}
              </div>
            )}

            {(form.featureImages || []).length > 0 && (
              <div className="mt-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted">Feature preview strip</p>
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {(form.featureImages || []).map((image, index) => {
                    const src = getImagePreviewSrc(image);
                    return (
                      <div key={index} className="h-20 w-28 shrink-0 overflow-hidden rounded-lg border border-brand-border bg-white">
                        {src ? (
                          <img src={src} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[10px] text-brand-muted">Empty</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
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
                <input key={i} className={inputClass} value={item} onChange={(e) => patch({ highlights: updateListItem(form.highlights, i, e.target.value) })} placeholder={`Highlight ${i + 1}`} />
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
            <p className="mt-1 text-sm text-brand-muted">Day-by-day plan travelers will follow.</p>
          </div>
          {form.itinerary.map((day, i) => (
            <div key={i} className="rounded-xl border border-brand-border/60 bg-brand-cream/50 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-bold text-brand-ink">Day {day.day}</p>
                {form.itinerary.length > 1 && (
                  <button type="button" onClick={() => patch({ itinerary: form.itinerary.filter((_, idx) => idx !== i) })} className="text-xs font-semibold text-red-500 hover:underline">Remove</button>
                )}
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <input className={inputClass} value={day.title} onChange={(e) => {
                  const next = [...form.itinerary];
                  next[i] = { ...day, title: e.target.value };
                  patch({ itinerary: next });
                }} placeholder="Day title" />
                <input type="number" min={1} className={inputClass} value={day.day} onChange={(e) => {
                  const next = [...form.itinerary];
                  next[i] = { ...day, day: Number(e.target.value) };
                  patch({ itinerary: next });
                }} />
              </div>
              <textarea className={`${inputClass} mt-3 min-h-[80px]`} value={day.description} onChange={(e) => {
                const next = [...form.itinerary];
                next[i] = { ...day, description: e.target.value };
                patch({ itinerary: next });
              }} placeholder="What happens on this day…" />
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
        <motion.div key="pricing" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35, ease: EASE }} className={`${sectionClass} grid gap-5 sm:grid-cols-2`}>
          <div className="sm:col-span-2">
            <h2 className="text-xl font-bold text-brand-ink">Pricing & departures</h2>
            <p className="mt-1 text-sm text-brand-muted">Set price, group size, and scheduled departure dates.</p>
          </div>
          <Field label="Price (USD)">
            <input type="number" min={0} className={inputClass} value={form.priceAmount} onChange={(e) => patch({ priceAmount: Number(e.target.value) })} />
          </Field>
          <Field label="Currency">
            <input className={inputClass} value={form.priceCurrency} onChange={(e) => patch({ priceCurrency: e.target.value })} />
          </Field>
          <Field label="Group size min">
            <input type="number" min={1} className={inputClass} value={form.groupSizeMin} onChange={(e) => patch({ groupSizeMin: Number(e.target.value) })} />
          </Field>
          <Field label="Group size max">
            <input type="number" min={1} className={inputClass} value={form.groupSizeMax} onChange={(e) => patch({ groupSizeMax: Number(e.target.value) })} />
          </Field>
          <div className="sm:col-span-2">
            <p className={labelClass}>Departure dates</p>
            <div className="mt-3 space-y-3">
              {form.departureDates.map((dep, i) => (
                <div key={i} className="grid gap-3 rounded-xl border border-brand-border/60 p-4 sm:grid-cols-4">
                  <input type="date" className={inputClass} value={dep.date} onChange={(e) => {
                    const next = [...form.departureDates];
                    next[i] = { ...dep, date: e.target.value, dateLabel: e.target.value };
                    patch({ departureDates: next });
                  }} />
                  <input type="number" min={1} className={inputClass} value={dep.spotsTotal} onChange={(e) => {
                    const next = [...form.departureDates];
                    next[i] = { ...dep, spotsTotal: Number(e.target.value) };
                    patch({ departureDates: next });
                  }} placeholder="Total spots" />
                  <input type="number" min={0} className={inputClass} value={dep.spotsLeft} onChange={(e) => {
                    const next = [...form.departureDates];
                    next[i] = { ...dep, spotsLeft: Number(e.target.value) };
                    patch({ departureDates: next });
                  }} placeholder="Spots left" />
                  <input className={inputClass} value={dep.label} onChange={(e) => {
                    const next = [...form.departureDates];
                    next[i] = { ...dep, label: e.target.value };
                    patch({ departureDates: next });
                  }} placeholder="Label" />
                </div>
              ))}
              <button
                type="button"
                onClick={() => patch({ departureDates: [...form.departureDates, { date: "", dateLabel: "", spotsTotal: 18, spotsLeft: 10, label: "Next departure" }] })}
                className="text-sm font-semibold text-brand-green hover:underline"
              >
                + Add departure
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
