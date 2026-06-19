import { Users } from "lucide-react";

export default function AdminClientsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-orange">Client management</p>
        <h1 className="mt-1 font-heading text-3xl font-bold text-brand-ink">Clients</h1>
        <p className="mt-2 text-sm text-brand-muted">
          View and manage registered travelers on the platform.
        </p>
      </div>
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-black/8 bg-white py-20 text-center shadow-sm">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600">
          <Users className="h-6 w-6" strokeWidth={1.75} aria-hidden />
        </span>
        <p className="text-base font-bold text-brand-ink">Client management ready</p>
        <p className="max-w-xs text-sm text-brand-muted">
          Connect the client API endpoint to populate this table with registered traveler accounts.
        </p>
      </div>
    </div>
  );
}
