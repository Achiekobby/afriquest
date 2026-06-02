import PageShell from "../../components/misc/PageShell";
import { useAuth } from "../../hooks/useAuth";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <PageShell title="Profile" subtitle="Manage your account details.">
      <dl className="max-w-md space-y-4 rounded-lg border border-brand-border bg-white p-6">
        <div>
          <dt className="text-sm text-brand-muted">Name</dt>
          <dd className="mt-1 font-medium text-brand-ink">{user?.name || "—"}</dd>
        </div>
        <div>
          <dt className="text-sm text-brand-muted">Phone</dt>
          <dd className="mt-1 font-medium text-brand-ink">{user?.phone || "—"}</dd>
        </div>
      </dl>
    </PageShell>
  );
}
