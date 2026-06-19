import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Eye, Loader2, MessageSquare, Search, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import adminContactsServiceApi from "../../apis/AdminContactsServiceApi";
import AdminConfirmModal from "../../components/admin/AdminConfirmModal";
import AdminPagination from "../../components/admin/AdminPagination";
import {
  AdminMobileCard,
  AdminMobileCardActions,
  AdminMobileCardBody,
  AdminMobileCardHeader,
  AdminMobileCardRow,
  AdminTableDesktop,
  AdminTableMobile,
  adminIconBtnClass,
  adminIconBtnDangerClass,
  adminIconBtnViewClass,
} from "../../components/admin/AdminResponsiveTable";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import { useAdminPagination } from "../../hooks/useAdminPagination";
import {
  CONTACT_STATUS_STYLES,
  formatContactDate,
  formatContactLabel,
  UPDATABLE_CONTACT_STATUSES,
} from "../../utils/adminContactHelpers";

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${CONTACT_STATUS_STYLES[status] ?? "bg-brand-cream text-brand-muted"}`}
    >
      {formatContactLabel(status)}
    </span>
  );
}

function ContactStatusSelect({ contact, updating, onUpdate }) {
  const isUpdating = updating === contact.id;

  return (
    <select
      value=""
      disabled={isUpdating}
      onChange={(e) => {
        const nextStatus = e.target.value;
        if (nextStatus) onUpdate(contact.id, nextStatus);
        e.target.value = "";
      }}
      aria-label={`Update status for ${contact.fullname}`}
      className="max-w-[9.5rem] rounded-xl border-2 border-brand-border bg-white px-2.5 py-2 text-xs font-semibold text-brand-ink outline-none transition-all focus:border-brand-green focus:ring-2 focus:ring-brand-green/15 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <option value="">{isUpdating ? "Updating…" : "Set status"}</option>
      {UPDATABLE_CONTACT_STATUSES.filter((option) => option.value !== contact.status).map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

const EASE = [0.22, 1, 0.36, 1];

function truncateMessage(message, max = 72) {
  if (!message) return "—";
  if (message.length <= max) return message;
  return `${message.slice(0, max)}…`;
}

export default function AdminContactsPage() {
  const { token } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadContacts = useCallback(async () => {
    setLoading(true);
    const result = await adminContactsServiceApi.listContacts(token);
    setLoading(false);

    if (!result.ok) {
      toast.error(result.reason || result.message);
      return;
    }

    setContacts(Array.isArray(result.data) ? result.data : []);
  }, [token]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  async function handleStatusUpdate(contactId, status) {
    setUpdatingId(contactId);
    const result = await adminContactsServiceApi.updateContact(token, contactId, { status });
    setUpdatingId(null);

    if (!result.ok) {
      toast.error(result.reason || result.message);
      return;
    }

    toast.success(result.reason || "Contact status updated.");
    setContacts((prev) =>
      prev.map((item) => (item.id === contactId ? { ...item, ...result.data } : item))
    );
  }

  async function handleDelete() {
    if (!deleteTarget) return;

    setDeleting(true);
    const result = await adminContactsServiceApi.deleteContact(token, deleteTarget.id);
    setDeleting(false);

    if (!result.ok) {
      toast.error(result.reason || result.message);
      return;
    }

    toast.success(result.reason || "Contact deleted.");
    setDeleteTarget(null);
    setContacts((prev) => prev.filter((item) => item.id !== deleteTarget.id));
  }

  const filteredContacts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return contacts;

    return contacts.filter((contact) => {
      const haystack = [
        contact.fullname,
        contact.email,
        contact.phone_number,
        contact.message,
        contact.status,
        contact.type,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [contacts, search]);

  const pagination = useAdminPagination(filteredContacts, { resetKey: search });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-orange">Contact management</p>
        <h1 className="mt-1 font-heading text-3xl font-bold text-brand-ink">Contact inquiries</h1>
        <p className="mt-2 max-w-2xl text-sm text-brand-muted">
          Review inbound messages and support requests from travelers and visitors.
        </p>
      </div>

      <div className="rounded-2xl border border-black/8 bg-white p-4 shadow-sm sm:p-5">
        <div className="relative max-w-md">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted"
            strokeWidth={1.75}
            aria-hidden
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, message, or status..."
            className="w-full rounded-xl border-2 border-brand-border bg-white py-3 pl-10 pr-4 text-sm font-medium text-brand-ink outline-none transition-all focus:border-brand-green focus:ring-2 focus:ring-brand-green/15"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-black/8 bg-white py-24">
          <Loader2 className="h-7 w-7 animate-spin text-brand-green" aria-hidden />
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-black/12 bg-white py-20 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-600">
            <MessageSquare className="h-6 w-6" strokeWidth={1.75} aria-hidden />
          </span>
          <p className="font-bold text-brand-ink">
            {search ? "No enquiries match your search" : "No contact enquiries yet"}
          </p>
          <p className="max-w-sm text-sm text-brand-muted">
            {search ? "Try a different search term." : "New contact form submissions will appear here."}
          </p>
        </div>
      ) : (
        <>
          <AdminTableMobile columns={2}>
            {pagination.paginatedItems.map((contact, index) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: EASE, delay: index * 0.03 }}
              >
                <AdminMobileCard>
                  <AdminMobileCardHeader
                    title={contact.fullname || "—"}
                    subtitle={contact.email}
                    trailing={<StatusBadge status={contact.status} />}
                  />
                  <AdminMobileCardBody>
                    <AdminMobileCardRow label="Phone" value={contact.phone_number || "—"} />
                    <AdminMobileCardRow
                      label="Type"
                      value={
                        <span className="inline-flex items-center rounded-full bg-violet-500/10 px-2.5 py-1 text-[11px] font-semibold text-violet-700">
                          {formatContactLabel(contact.type)}
                        </span>
                      }
                    />
                    <AdminMobileCardRow label="Message" value={truncateMessage(contact.message, 120)} />
                    <AdminMobileCardRow label="Received" value={formatContactDate(contact.created_at)} />
                  </AdminMobileCardBody>
                  <AdminMobileCardActions>
                    <ContactStatusSelect
                      contact={contact}
                      updating={updatingId}
                      onUpdate={handleStatusUpdate}
                    />
                    <Link
                      to={ROUTES.admin.contactDetail(contact.id)}
                      className={`${adminIconBtnClass} ${adminIconBtnViewClass}`}
                      aria-label={`View enquiry from ${contact.fullname}`}
                    >
                      <Eye className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(contact)}
                      className={`${adminIconBtnClass} ${adminIconBtnDangerClass}`}
                      aria-label={`Delete enquiry from ${contact.fullname}`}
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                    </button>
                  </AdminMobileCardActions>
                </AdminMobileCard>
              </motion.div>
            ))}
          </AdminTableMobile>

          <AdminTableDesktop>
            <table className="w-full text-left">
              <thead className="border-b border-black/8 bg-brand-cream/50">
                <tr>
                  {["Contact", "Message", "Type", "Status", "Received", "Actions"].map((heading) => (
                    <th
                      key={heading}
                      className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-brand-muted"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pagination.paginatedItems.map((contact, index) => (
                  <motion.tr
                    key={contact.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: EASE, delay: index * 0.03 }}
                    className="border-b border-black/5 last:border-0 hover:bg-brand-cream/30"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-brand-ink">{contact.fullname || "—"}</p>
                      <p className="text-xs text-brand-muted">{contact.email}</p>
                      <p className="text-xs text-brand-muted">{contact.phone_number || "—"}</p>
                    </td>
                    <td className="max-w-xs px-5 py-4">
                      <p className="text-sm text-brand-ink">{truncateMessage(contact.message)}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center rounded-full bg-violet-500/10 px-2.5 py-1 text-[11px] font-semibold text-violet-700">
                        {formatContactLabel(contact.type)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={contact.status} />
                    </td>
                    <td className="px-5 py-4 text-sm text-brand-muted">{formatContactDate(contact.created_at)}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <ContactStatusSelect
                          contact={contact}
                          updating={updatingId}
                          onUpdate={handleStatusUpdate}
                        />
                      <Link
                        to={ROUTES.admin.contactDetail(contact.id)}
                        className={`${adminIconBtnClass} ${adminIconBtnViewClass}`}
                        aria-label={`View enquiry from ${contact.fullname}`}
                      >
                        <Eye className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                      </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(contact)}
                          className={`${adminIconBtnClass} ${adminIconBtnDangerClass}`}
                          aria-label={`Delete enquiry from ${contact.fullname}`}
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
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

      <AdminConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete contact enquiry?"
        itemLabel={deleteTarget?.fullname}
        message="This will permanently remove the enquiry and its message from the platform. This action cannot be undone."
        confirmLabel="Delete enquiry"
        loading={deleting}
        onClose={() => !deleting && setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
