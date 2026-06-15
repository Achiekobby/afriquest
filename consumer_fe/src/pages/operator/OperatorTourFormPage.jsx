import { useNavigate, useParams } from "react-router";
import { ROUTES } from "../../constants/routes";
import TourListingForm from "../../components/operator/TourListingForm";
import {
  createEmptyTourListing,
  getOperatorTourById,
  saveOperatorTour,
} from "../../utils/operatorTourStorage";

export default function OperatorTourFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const existing = isEdit ? getOperatorTourById(id) : null;
  const initial = existing || createEmptyTourListing();

  if (isEdit && !existing) {
    return (
      <div className="rounded-2xl border border-brand-border bg-white p-10 text-center">
        <p className="font-semibold text-brand-ink">Listing not found</p>
        <button type="button" onClick={() => navigate(ROUTES.operator.tours)} className="btn-primary mt-4">Back to listings</button>
      </div>
    );
  }

  function handleSubmit(payload) {
    saveOperatorTour({ ...payload, id: existing?.id });
    navigate(ROUTES.operator.tours);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-orange">{isEdit ? "Edit listing" : "New listing"}</p>
        <h1 className="mt-1 font-heading text-3xl text-brand-ink">{isEdit ? "Update tour" : "Create tour listing"}</h1>
        <p className="mt-2 text-sm text-brand-muted">Fields map directly to the tour API payload — basics, content, itinerary, pricing, and booking rules.</p>
      </div>
      <TourListingForm initial={initial} onSubmit={handleSubmit} submitLabel={isEdit ? "Save changes" : "Save listing"} />
    </div>
  );
}
