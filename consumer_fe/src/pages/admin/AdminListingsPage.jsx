import { useEffect, useState } from "react";
import { Map } from "lucide-react";
import AdminPagination from "../../components/admin/AdminPagination";
import {
  AdminMobileCard,
  AdminMobileCardBody,
  AdminMobileCardHeader,
  AdminMobileCardRow,
  AdminTableDesktop,
  AdminTableMobile,
} from "../../components/admin/AdminResponsiveTable";
import { getOperatorTours } from "../../utils/operatorTourStorage";
import { useAdminPagination } from "../../hooks/useAdminPagination";

function StatusBadge({ status }) {
  const map = {
    published: "bg-emerald-100 text-emerald-700",
    draft: "bg-amber-100 text-amber-700",
    archived: "bg-brand-cream text-brand-muted",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${map[status] ?? "bg-brand-cream text-brand-muted"}`}>
      {status}
    </span>
  );
}

export default function AdminListingsPage() {
  const [tours, setTours] = useState([]);

  useEffect(() => {
    setTours(getOperatorTours());
  }, []);

  const pagination = useAdminPagination(tours);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-orange">Listing management</p>
        <h1 className="mt-1 font-heading text-3xl font-bold text-brand-ink">Tour listings</h1>
        <p className="mt-2 text-sm text-brand-muted">
          Review and approve operator tour listings across the platform.
        </p>
      </div>

      {tours.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-black/8 bg-white py-20 text-center shadow-sm">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
            <Map className="h-6 w-6" strokeWidth={1.75} aria-hidden />
          </span>
          <p className="text-base font-bold text-brand-ink">No listings yet</p>
          <p className="max-w-xs text-sm text-brand-muted">
            Operator tour listings will appear here for review.
          </p>
        </div>
      ) : (
        <>
          <AdminTableMobile columns={2}>
            {pagination.paginatedItems.map((tour) => (
              <AdminMobileCard key={tour.id}>
                <AdminMobileCardHeader
                  title={tour.title || "—"}
                  subtitle={tour.location || "—"}
                  trailing={<StatusBadge status={tour.status || "draft"} />}
                />
                <AdminMobileCardBody>
                  <AdminMobileCardRow label="Price" value={tour.price ? `GHS ${tour.price}` : "—"} />
                </AdminMobileCardBody>
              </AdminMobileCard>
            ))}
          </AdminTableMobile>

          <AdminTableDesktop>
            <table className="w-full text-left">
              <thead className="border-b border-black/8 bg-brand-cream/50">
                <tr>
                  {["Tour title", "Location", "Price", "Status"].map((h) => (
                    <th key={h} className="px-5 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-brand-muted">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pagination.paginatedItems.map((tour) => (
                  <tr key={tour.id} className="border-b border-black/5 last:border-0 hover:bg-brand-cream/30">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-brand-ink">{tour.title || "—"}</p>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-brand-muted">{tour.location || "—"}</td>
                    <td className="px-5 py-3.5 text-sm text-brand-ink">
                      {tour.price ? `GHS ${tour.price}` : "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={tour.status || "draft"} />
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
