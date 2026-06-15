import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ROUTES } from "../../constants/routes";
import { deleteOperatorTour, getOperatorTours } from "../../utils/operatorTourStorage";

function statusPill(status) {
  const map = {
    published: "bg-brand-green/10 text-brand-green ring-brand-green/20",
    draft: "bg-brand-gold/15 text-brand-ink ring-brand-gold/25",
    archived: "bg-brand-muted/10 text-brand-muted ring-brand-border",
  };
  return map[status] || map.draft;
}

export default function OperatorToursPage() {
  const [tours, setTours] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    function refresh() {
      setTours(getOperatorTours());
    }
    refresh();
    window.addEventListener("afriqwest:operator-tours-updated", refresh);
    return () => window.removeEventListener("afriqwest:operator-tours-updated", refresh);
  }, []);

  const visible = filter === "all" ? tours : tours.filter((t) => t.status === filter);

  function handleDelete(id, name) {
    if (window.confirm(`Delete "${name || "this listing"}"? This cannot be undone.`)) {
      deleteOperatorTour(id);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-orange">Listings</p>
          <h1 className="mt-1 font-heading text-3xl text-brand-ink">Tour listings</h1>
          <p className="mt-2 text-sm text-brand-muted">Create, edit, and publish experiences for the AfriQwest catalog.</p>
        </div>
        <Link to={ROUTES.operator.tourNew} className="btn-primary">+ New listing</Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {["all", "published", "draft", "archived"].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={[
              "rounded-full px-4 py-2 text-xs font-semibold capitalize transition-all",
              filter === f ? "bg-brand-green text-white" : "bg-white text-brand-muted ring-1 ring-brand-border hover:text-brand-ink",
            ].join(" ")}
          >
            {f === "all" ? "All" : f}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-brand-border bg-white px-6 py-16 text-center">
          <p className="text-lg font-semibold text-brand-ink">No listings in this view</p>
          <p className="mt-2 text-sm text-brand-muted">Start with a draft — the form matches your backend payload shape.</p>
          <Link to={ROUTES.operator.tourNew} className="btn-primary mt-6 inline-flex">Create listing</Link>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((tour) => (
            <article key={tour.id} className="group overflow-hidden rounded-2xl border border-brand-border/60 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={tour.coverImageUrl} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ring-1 ${statusPill(tour.status)}`}>
                  {tour.status}
                </span>
                {tour.featured ? (
                  <span className="absolute right-3 top-3 rounded-full bg-brand-orange px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">Featured</span>
                ) : null}
              </div>
              <div className="p-5">
                <h2 className="font-bold text-brand-ink">{tour.name || "Untitled listing"}</h2>
                <p className="mt-1 text-xs text-brand-muted">{tour.location || tour.country} · {tour.durationLabel}</p>
                <p className="mt-3 text-sm font-semibold text-brand-green">{tour.priceLabel || `From $${tour.priceAmount}`}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link to={ROUTES.operator.tourEdit(tour.id)} className="btn-secondary text-xs">Edit</Link>
                  {tour.slug && tour.status === "published" ? (
                    <Link to={ROUTES.tourDetail(tour.slug)} className="text-xs font-semibold text-brand-muted hover:text-brand-green">Preview →</Link>
                  ) : null}
                  <button type="button" onClick={() => handleDelete(tour.id, tour.name)} className="text-xs font-semibold text-red-500 hover:underline">Delete</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
