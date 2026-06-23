import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { motion } from "motion/react";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  Loader2,
  MapPin,
  Pencil,
  Sparkles,
  Trash2,
  Users,
  XCircle,
} from "lucide-react";
import operatorToursServiceApi from "../../apis/OperatorToursServiceApi";
import { formatTourCategoryLabel } from "../../utils/operatorTourConstants";
import AdminConfirmModal from "../../components/admin/AdminConfirmModal";
import ImageLightbox from "../../components/misc/ImageLightbox";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import { buildLocationsLabel } from "../../utils/operatorTourMapper";

const EASE = [0.22, 1, 0.36, 1];

function Section({ title, subtitle, children }) {
  return (
    <section className="rounded-2xl border border-brand-border/60 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="font-heading text-lg font-bold text-brand-ink">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-brand-muted">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

function statusClass(status) {
  const map = {
    published: "bg-brand-green/10 text-brand-green",
    draft: "bg-brand-gold/15 text-brand-ink",
    archived: "bg-brand-muted/10 text-brand-muted",
  };
  return map[status] || map.draft;
}

export default function OperatorTourDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    if (!token || !slug) return undefined;

    let active = true;
    async function load() {
      setLoading(true);
      const result = await operatorToursServiceApi.getTour(token, slug);
      if (!active) return;
      setLoading(false);

      if (!result.ok || !result.tour) {
        setNotFound(true);
        return;
      }
      setTour(result.tour);
    }

    load();
    return () => {
      active = false;
    };
  }, [token, slug]);

  const galleryImages = useMemo(() => {
    const urls = (tour?.galleryImageUrls || []).filter(Boolean);
    if (tour?.coverImageUrl && !urls.includes(tour.coverImageUrl)) {
      return [tour.coverImageUrl, ...urls];
    }
    if (urls.length) return urls;
    return tour?.coverImageUrl ? [tour.coverImageUrl] : [];
  }, [tour?.coverImageUrl, tour?.galleryImageUrls]);

  async function handleDelete() {
    if (!token || !slug) return;

    setDeleting(true);
    const result = await operatorToursServiceApi.deleteTour(token, slug);
    setDeleting(false);

    if (!result.ok) {
      toast.error(result.reason || result.message);
      return;
    }

    toast.success(result.reason || "Tour deleted.");
    setDeleteOpen(false);
    navigate(ROUTES.operator.tours, { replace: true });
  }

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-brand-border/60 bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-brand-green" strokeWidth={2} aria-hidden />
      </div>
    );
  }

  if (notFound || !tour) {
    return (
      <div className="rounded-2xl border border-brand-border bg-white p-10 text-center">
        <p className="font-semibold text-brand-ink">Listing not found</p>
        <Link to={ROUTES.operator.tours} className="btn-primary mt-4 inline-flex">Back to listings</Link>
      </div>
    );
  }

  const routeLabel = buildLocationsLabel(tour.locations);

  return (
    <div className="space-y-6">
      <Link to={ROUTES.operator.tours} className="inline-flex items-center gap-2 text-sm font-medium text-brand-muted hover:text-brand-ink">
        <ArrowLeft className="h-4 w-4" strokeWidth={2} aria-hidden />
        Back to listings
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="relative overflow-hidden rounded-[1.75rem] border border-brand-border/60 bg-brand-ink text-white shadow-xl"
      >
        <div className="absolute inset-0">
          {tour.coverImageUrl ? (
            <img src={tour.coverImageUrl} alt="" className="h-full w-full object-cover opacity-40" />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-ink via-brand-ink/90 to-brand-ink/60" />
        </div>

        <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${statusClass(tour.status)}`}>
                {tour.status}
              </span>
              {tour.featured ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-orange px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                  <Sparkles className="h-3 w-3" strokeWidth={2.5} aria-hidden />
                  Featured
                </span>
              ) : null}
              {tour.badge ? (
                <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
                  {tour.badge}
                </span>
              ) : null}
            </div>

            <h1 className="mt-4 font-heading text-3xl font-bold sm:text-4xl">{tour.name}</h1>

            {routeLabel ? (
              <p className="mt-3 flex flex-wrap items-center gap-1.5 text-sm text-white/80">
                <MapPin className="h-4 w-4 shrink-0 text-brand-gold" strokeWidth={2} aria-hidden />
                {tour.locations.map((city, index) => (
                  <span key={`${city}-${index}`} className="inline-flex items-center gap-1.5">
                    {index > 0 ? <ChevronRight className="h-3.5 w-3.5 text-white/40" strokeWidth={2} aria-hidden /> : null}
                    <span className="font-medium">{city}</span>
                  </span>
                ))}
              </p>
            ) : null}

            <div className="mt-5 flex flex-wrap gap-4 text-sm text-white/70">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4 text-brand-gold" strokeWidth={2} aria-hidden />
                {tour.durationLabel}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-4 w-4 text-brand-gold" strokeWidth={2} aria-hidden />
                {tour.groupSizeMax} slot{tour.groupSizeMax === 1 ? "" : "s"}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-brand-gold" strokeWidth={2} aria-hidden />
                {tour.country}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-end">
            <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-right backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/50">From</p>
              <p className="text-2xl font-bold text-brand-gold">{tour.priceLabel}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to={ROUTES.operator.tourEdit(tour.slug)} className="btn-secondary inline-flex items-center gap-2 bg-white/10 text-white ring-white/20 hover:bg-white/20">
                <Pencil className="h-4 w-4" strokeWidth={2} aria-hidden />
                Edit
              </Link>
              <button
                type="button"
                onClick={() => setDeleteOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-red-400/30 bg-red-500/15 px-4 py-2.5 text-sm font-semibold text-red-100 transition-colors hover:bg-red-500/25"
              >
                <Trash2 className="h-4 w-4" strokeWidth={2} aria-hidden />
                Delete
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {galleryImages.length ? (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted">Photo gallery</p>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {galleryImages.map((url, index) => {
              const isCover = url === tour.coverImageUrl;
              return (
                <button
                  key={`${url}-${index}`}
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  className={[
                    "group relative h-28 w-40 shrink-0 cursor-zoom-in overflow-hidden rounded-xl shadow-sm transition-all hover:ring-2 hover:ring-brand-green/40",
                    isCover
                      ? "border-2 border-brand-green/50 ring-1 ring-brand-green/20"
                      : "border border-brand-border/60",
                  ].join(" ")}
                  aria-label={isCover ? "View cover image full size" : `View gallery image ${index + 1} full size`}
                >
                  <img src={url} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  {isCover ? (
                    <span className="absolute bottom-2 left-2 rounded-full bg-brand-green px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                      Cover
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Section title="About this tour" subtitle="What travelers will experience">
            <p className="text-sm leading-relaxed text-brand-muted">{tour.description || "No description yet."}</p>
            {tour.highlights?.length ? (
              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {tour.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-brand-ink">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" strokeWidth={2} aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
          </Section>

          <Section title="Itinerary" subtitle="Day-by-day plan">
            <div className="space-y-4">
              {tour.itinerary?.map((day) => (
                <div key={`${day.day}-${day.title}`} className="flex gap-4 rounded-xl border border-brand-border/50 bg-brand-cream/40 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-green/10 text-sm font-bold text-brand-green">
                    {day.day}
                  </div>
                  <div>
                    <p className="font-semibold text-brand-ink">{day.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-brand-muted">{day.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <div className="grid gap-6 sm:grid-cols-2">
            <Section title="Included">
              <ul className="space-y-2">
                {(tour.included || []).map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-brand-ink">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" strokeWidth={2} aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </Section>
            <Section title="Not included">
              <ul className="space-y-2">
                {(tour.notIncluded || []).map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-brand-muted">
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-muted/60" strokeWidth={2} aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </Section>
          </div>
        </div>

        <div className="space-y-6">
          <Section title="Departures" subtitle="Scheduled dates & availability">
            <div className="space-y-3">
              {(tour.departureDates || []).map((dep) => (
                <div key={dep.date} className="rounded-xl border border-brand-border/60 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-brand-ink">{dep.dateLabel || dep.date}</p>
                      <p className="mt-0.5 text-xs text-brand-muted">{dep.label}</p>
                    </div>
                    <span className="rounded-full bg-brand-green/10 px-2.5 py-1 text-[11px] font-bold text-brand-green">
                      {dep.spotsLeft} / {dep.spotsTotal} left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Booking settings">
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-brand-muted">Deposit</dt>
                <dd className="font-semibold text-brand-ink">{tour.bookingSettings?.depositPercent}%</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-brand-muted">Online payment</dt>
                <dd className="font-semibold text-brand-ink">{tour.bookingSettings?.onlinePaymentAllowed ? "Allowed" : "Off"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-brand-muted">Pay on-site</dt>
                <dd className="font-semibold text-brand-ink">{tour.bookingSettings?.payOnSiteAllowed ? "Allowed" : "Off"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-brand-muted">Group size</dt>
                <dd className="font-semibold text-brand-ink">
                  {tour.bookingSettings?.minGroupSize}–{tour.bookingSettings?.maxGroupSize}
                </dd>
              </div>
            </dl>
          </Section>

          <Section title="Metadata">
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-brand-muted">Categories</dt>
                <dd className="mt-1 flex flex-wrap gap-1.5">
                  {(tour.categories || []).map((cat) => (
                    <span key={cat} className="rounded-full bg-brand-cream px-2.5 py-1 text-[11px] font-semibold capitalize text-brand-ink">
                      {formatTourCategoryLabel(cat)}
                    </span>
                  ))}
                </dd>
              </div>
              {tour.createdAt ? (
                <div className="flex items-center gap-2 text-brand-muted">
                  <Clock className="h-4 w-4" strokeWidth={2} aria-hidden />
                  Created {new Date(tour.createdAt).toLocaleDateString()}
                </div>
              ) : null}
            </dl>
          </Section>
        </div>
      </div>

      <AdminConfirmModal
        open={deleteOpen}
        title="Delete tour listing?"
        itemLabel={tour.name}
        message="This will permanently remove the listing, its departures, and gallery images. This action cannot be undone."
        confirmLabel="Delete listing"
        loading={deleting}
        onClose={() => !deleting && setDeleteOpen(false)}
        onConfirm={handleDelete}
      />

      <ImageLightbox
        open={lightboxIndex != null}
        images={galleryImages}
        index={lightboxIndex ?? 0}
        onIndexChange={setLightboxIndex}
        onClose={() => setLightboxIndex(null)}
        alt={tour.name}
      />
    </div>
  );
}
