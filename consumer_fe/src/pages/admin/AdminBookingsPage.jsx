import { CalendarCheck } from "lucide-react";
import AdminPagination from "../../components/admin/AdminPagination";
import {
  AdminMobileCard,
  AdminMobileCardBody,
  AdminMobileCardHeader,
  AdminMobileCardRow,
  AdminTableDesktop,
  AdminTableMobile,
} from "../../components/admin/AdminResponsiveTable";
import { useLocalAdminPagination } from "../../hooks/useAdminPagination";

const STATUS_STYLES = {
  confirmed: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  cancelled: "bg-red-100 text-red-700",
  "payment-processing": "bg-sky-100 text-sky-700",
  completed: "bg-brand-green/10 text-brand-green",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${STATUS_STYLES[status] ?? "bg-brand-cream text-brand-muted"}`}
    >
      {(status || "pending").replace(/-/g, " ")}
    </span>
  );
}

export default function AdminBookingsPage() {
  const bookings = [];
  const pagination = useLocalAdminPagination(bookings);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-orange">Reservation oversight</p>
          <h1 className="mt-1 font-heading text-3xl font-bold text-brand-ink">Bookings</h1>
          <p className="mt-2 text-sm text-brand-muted">
            Platform booking audit — reservations, payment status, and operator fulfillment.
          </p>
        </div>
        <span className="rounded-full border border-black/8 bg-white px-4 py-2 text-xs font-bold text-brand-muted shadow-sm">
          {bookings.length} record{bookings.length !== 1 ? "s" : ""}
        </span>
      </div>

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-black/8 bg-white py-20 text-center shadow-sm">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-600">
            <CalendarCheck className="h-6 w-6" strokeWidth={1.75} aria-hidden />
          </span>
          <p className="text-base font-bold text-brand-ink">No bookings yet</p>
          <p className="max-w-xs text-sm text-brand-muted">
            Booking records will appear here once the admin bookings API is connected.
          </p>
        </div>
      ) : (
        <>
          <AdminTableMobile columns={2}>
            {pagination.paginatedItems.map((booking) => (
              <AdminMobileCard key={booking.bookingRef || booking.id}>
                <AdminMobileCardHeader
                  title={booking.tourTitle || booking.tour?.name || "—"}
                  subtitle={booking.travelerName || "—"}
                  trailing={<StatusBadge status={booking.status} />}
                />
                <AdminMobileCardBody>
                  <AdminMobileCardRow
                    label="Booking ref"
                    value={
                      <span className="font-mono text-xs font-bold text-brand-green">{booking.bookingRef || "—"}</span>
                    }
                  />
                  <AdminMobileCardRow
                    label="Amount"
                    value={booking.totalAmount ? `GHS ${booking.totalAmount}` : "—"}
                  />
                </AdminMobileCardBody>
              </AdminMobileCard>
            ))}
          </AdminTableMobile>

          <AdminTableDesktop>
            <table className="w-full text-left">
              <thead className="border-b border-black/8 bg-brand-cream/50">
                <tr>
                  {["Booking ref", "Tour", "Traveler", "Amount", "Status"].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-brand-muted">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pagination.paginatedItems.map((booking) => (
                  <tr key={booking.bookingRef || booking.id} className="border-b border-black/5 last:border-0 hover:bg-brand-cream/30">
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs font-bold text-brand-green">{booking.bookingRef || "—"}</span>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-brand-ink">
                      {booking.tourTitle || booking.tour?.name || "—"}
                    </td>
                    <td className="px-5 py-4 text-sm text-brand-muted">{booking.travelerName || "—"}</td>
                    <td className="px-5 py-4 text-sm text-brand-ink">
                      {booking.totalAmount ? `GHS ${booking.totalAmount}` : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={booking.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </AdminTableDesktop>

          <AdminPagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            rangeStart={pagination.rangeStart}
            rangeEnd={pagination.rangeEnd}
            onPageChange={pagination.setPage}
          />
        </>
      )}
    </div>
  );
}
