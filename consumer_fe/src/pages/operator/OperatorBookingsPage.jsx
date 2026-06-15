import { Link } from "react-router";
import { ROUTES } from "../../constants/routes";
import AppIcon from "../../components/icons/AppIcon";

export default function OperatorBookingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-orange">Reservations</p>
        <h1 className="mt-1 font-heading text-3xl text-brand-ink">Bookings</h1>
        <p className="mt-2 text-sm text-brand-muted">Traveler reservations for your published listings will appear here once the API is connected.</p>
      </div>

      <div className="rounded-2xl border border-brand-border/60 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-cream text-brand-green">
          <AppIcon name="clipboard-list" className="h-8 w-8" strokeWidth={1.5} />
        </div>
        <p className="mt-5 text-lg font-semibold text-brand-ink">No bookings yet</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-brand-muted">
          When travelers book your tours, you'll see individual and group reservations, payment status, and departure dates in this inbox.
        </p>
        <Link to={ROUTES.operator.tours} className="btn-primary mt-6 inline-flex">Manage listings</Link>
      </div>
    </div>
  );
}
