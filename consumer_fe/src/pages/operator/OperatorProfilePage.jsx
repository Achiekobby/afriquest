import { ROLE_META, USER_ROLES } from "../../constants/roles";
import { useAuth } from "../../hooks/useAuth";
import AppIcon from "../../components/icons/AppIcon";

export default function OperatorProfilePage() {
  const { user } = useAuth();
  const meta = ROLE_META[USER_ROLES.SITE_OPERATOR];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-orange">Account</p>
        <h1 className="mt-1 font-heading text-3xl text-brand-ink">Operator profile</h1>
        <p className="mt-2 text-sm text-brand-muted">Your site operator credentials and contact details.</p>
      </div>

      <dl className="max-w-lg space-y-5 rounded-2xl border border-brand-border/60 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 border-b border-brand-border/50 pb-5">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-cream text-brand-green">
            <AppIcon name={meta.icon} className="h-6 w-6" />
          </span>
          <div>
            <p className="font-bold text-brand-ink">{meta.label}</p>
            <p className="text-xs text-brand-muted">{meta.description}</p>
          </div>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted">Name</dt>
          <dd className="mt-1 font-medium text-brand-ink">{user?.name || "—"}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted">Organization / site</dt>
          <dd className="mt-1 font-medium text-brand-ink">{user?.organization || "—"}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted">Phone</dt>
          <dd className="mt-1 font-medium text-brand-ink">{user?.phone || "—"}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted">Email</dt>
          <dd className="mt-1 font-medium text-brand-ink">{user?.email || "—"}</dd>
        </div>
      </dl>
    </div>
  );
}
