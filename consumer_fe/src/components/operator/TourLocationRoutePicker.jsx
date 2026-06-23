import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ChevronRight,
  GripVertical,
  MapPin,
  Plus,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { GHANA_CITY_SUGGESTIONS } from "../../utils/operatorTourMapper";

const EASE = [0.16, 1, 0.3, 1];

const QUICK_PICKS = ["Accra", "Cape Coast", "Kumasi", "Tamale", "Takoradi", "Elmina"];
const EMPTY_LOCATIONS = [];

function normalizeCity(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function reorderList(list, fromIndex, toIndex) {
  if (fromIndex === toIndex) return list;
  const next = [...list];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

export default function TourLocationRoutePicker({ value = [], onChange, countryId = "ghana", error = "" }) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);
  const inputRef = useRef(null);

  const locations = Array.isArray(value) ? value : EMPTY_LOCATIONS;
  const suggestions = useMemo(() => {
    const routeLocations = Array.isArray(value) ? value : EMPTY_LOCATIONS;
    const q = query.trim().toLowerCase();
    const pool = countryId === "ghana" ? GHANA_CITY_SUGGESTIONS : [];
    if (!q) return pool.slice(0, 8);
    return pool
      .filter((city) => city.toLowerCase().includes(q))
      .filter((city) => !routeLocations.some((l) => l.toLowerCase() === city.toLowerCase()))
      .slice(0, 8);
  }, [query, value, countryId]);

  function addCity(city) {
    const next = normalizeCity(city);
    if (!next) return;
    if (locations.some((l) => l.toLowerCase() === next.toLowerCase())) return;
    onChange([...locations, next]);
    setQuery("");
    setFocused(false);
  }

  function removeCity(index) {
    onChange(locations.filter((_, i) => i !== index));
  }

  function handleDragStart(e, index) {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
    setDragIndex(index);
    setOverIndex(index);
  }

  function handleDragOver(e, index) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (overIndex !== index) setOverIndex(index);
  }

  function handleDrop(index) {
    if (dragIndex === null) return;
    onChange(reorderList(locations, dragIndex, index));
    setDragIndex(null);
    setOverIndex(null);
  }

  function handleDragEnd() {
    setDragIndex(null);
    setOverIndex(null);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      addCity(query);
    }
    if (e.key === "Backspace" && !query && locations.length) {
      removeCity(locations.length - 1);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-brand-border/70 bg-gradient-to-br from-brand-cream/80 via-white to-brand-green/5 p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
            <MapPin className="h-5 w-5" strokeWidth={1.75} aria-hidden />
          </div>
          <div>
            <p className="text-sm font-bold text-brand-ink">Tour route — cities & stops</p>
            <p className="mt-1 text-xs leading-relaxed text-brand-muted">
              Add every city your travelers will visit, in the order they experience them. This builds the route shown on
              your listing — e.g. <span className="font-semibold text-brand-ink">Accra → Cape Coast → Kumasi</span>.
            </p>
          </div>
        </div>

        {locations.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="mt-5"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-orange">Your route preview</p>
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {locations.map((city, index) => (
                <div key={`preview-${city}-${index}`} className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-brand-ink shadow-sm ring-1 ring-brand-border/60">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-green/10 text-[10px] font-bold text-brand-green">
                      {index + 1}
                    </span>
                    {city}
                  </span>
                  {index < locations.length - 1 ? (
                    <ChevronRight className="h-4 w-4 text-brand-muted/60" strokeWidth={2} aria-hidden />
                  ) : null}
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="mt-5 rounded-xl border border-dashed border-brand-border/80 bg-white/60 px-4 py-6 text-center">
            <Sparkles className="mx-auto h-6 w-6 text-brand-orange/70" strokeWidth={1.75} aria-hidden />
            <p className="mt-2 text-sm font-semibold text-brand-ink">No cities added yet</p>
            <p className="mt-1 text-xs text-brand-muted">Pick from suggestions below or type a city name and press Enter.</p>
          </div>
        )}
      </div>

      <div className="relative">
        <label htmlFor="tour-city-search" className="sr-only">
          Search or add a city
        </label>
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted"
          strokeWidth={2}
          aria-hidden
        />
        <input
          ref={inputRef}
          id="tour-city-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => window.setTimeout(() => setFocused(false), 150)}
          onKeyDown={handleKeyDown}
          placeholder="Type a city and press Enter — e.g. Accra"
          className="w-full rounded-xl border-2 border-brand-border bg-white py-3 pl-11 pr-4 text-sm font-medium text-brand-ink outline-none transition-all focus:border-brand-green focus:ring-2 focus:ring-brand-green/15"
        />

        <AnimatePresence>
          {focused && suggestions.length > 0 ? (
            <motion.ul
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: EASE }}
              className="absolute z-20 mt-2 max-h-52 w-full overflow-auto rounded-xl border border-brand-border/70 bg-white py-1 shadow-lg"
            >
              {suggestions.map((city) => (
                <li key={city}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => addCity(city)}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-brand-ink transition-colors hover:bg-brand-cream"
                  >
                    <MapPin className="h-3.5 w-3.5 text-brand-green" strokeWidth={2} aria-hidden />
                    {city}
                  </button>
                </li>
              ))}
            </motion.ul>
          ) : null}
        </AnimatePresence>
      </div>

      {countryId === "ghana" ? (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-muted">Quick add — popular stops</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {QUICK_PICKS.map((city) => {
              const added = locations.some((l) => l.toLowerCase() === city.toLowerCase());
              return (
                <button
                  key={city}
                  type="button"
                  disabled={added}
                  onClick={() => addCity(city)}
                  className={[
                    "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-all",
                    added
                      ? "cursor-default bg-brand-green/10 text-brand-green ring-1 ring-brand-green/20"
                      : "bg-white text-brand-muted ring-1 ring-brand-border hover:text-brand-green hover:ring-brand-green/30",
                  ].join(" ")}
                >
                  {added ? null : <Plus className="h-3 w-3" strokeWidth={2.5} aria-hidden />}
                  {city}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {locations.length > 0 ? (
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-muted">
            Stops in order — drag to reorder
          </p>
          {locations.map((city, index) => {
            const isDragging = dragIndex === index;
            const isDropTarget = overIndex === index && dragIndex !== null && dragIndex !== index;

            return (
              <div
                key={`stop-${city}-${index}`}
                draggable
                onDragStart={(e) => {
                  if (e.target.closest("[data-no-drag]")) {
                    e.preventDefault();
                    return;
                  }
                  handleDragStart(e, index);
                }}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={() => handleDrop(index)}
                className={[
                  "flex cursor-grab items-center gap-2 rounded-xl border bg-white px-2 py-2.5 shadow-sm transition-all duration-200 active:cursor-grabbing",
                  isDragging ? "scale-[0.98] border-brand-orange/40 opacity-50" : "border-brand-border/60",
                  isDropTarget ? "border-brand-green ring-2 ring-brand-green/25" : "",
                ].join(" ")}
                aria-label={`Drag to reorder ${city}`}
              >
                <div className="pointer-events-none rounded-lg p-1.5 text-brand-muted">
                  <GripVertical className="h-4 w-4" strokeWidth={2} aria-hidden />
                </div>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-cream text-xs font-bold text-brand-green">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-semibold text-brand-ink">{city}</span>
                <button
                  type="button"
                  data-no-drag
                  draggable={false}
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={() => removeCity(index)}
                  className="cursor-pointer rounded-lg p-1.5 text-brand-muted transition-colors hover:bg-red-50 hover:text-red-500"
                  aria-label={`Remove ${city}`}
                >
                  <X className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>
            );
          })}
        </div>
      ) : null}

      {error ? <p className="text-xs font-medium text-red-500">{error}</p> : null}
    </div>
  );
}
