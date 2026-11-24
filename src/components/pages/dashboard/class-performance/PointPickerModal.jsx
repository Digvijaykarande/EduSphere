"use client";

import { useMemo, useState } from "react";
import { Check, Minus, Plus, Search, Settings2 } from "lucide-react";
import Sheet from "./Sheet";
import EntityAvatar from "./StudentAvatar";
import { MAX_ABS_POINTS, formatPoints, pointsChipClass, validateCategory } from "./performance.utils";

const inputCls =
  "w-full h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 text-sm text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

const FILTERS = [["all", "All"], ["pos", "Rewards"], ["neg", "Deductions"]];
const SEARCH_THRESHOLD = 8;

/**
 * Compact award picker. Tapping a category awards it straight away to every
 * target; "Custom" awards a one-off reason/points (optionally saved as a category).
 */
export default function PointPickerModal({ targets, categories, onApply, onClose, onOpenSetup }) {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [customOpen, setCustomOpen] = useState(categories.length === 0);
  const [label, setLabel] = useState("");
  const [points, setPoints] = useState("");
  const [save, setSave] = useState(false);
  const [error, setError] = useState("");

  const single = targets.length === 1 ? targets[0] : null;
  const hasPos = categories.some((c) => c.points > 0);
  const hasNeg = categories.some((c) => c.points < 0);
  const showFilter = hasPos && hasNeg;
  const showSearch = categories.length > SEARCH_THRESHOLD;

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return categories.filter((c) =>
      (filter === "all" || (filter === "pos" ? c.points > 0 : c.points < 0)) &&
      (!q || c.label.toLowerCase().includes(q)),
    );
  }, [categories, filter, query]);

  const step = (delta) => {
    const n = Number(points);
    const next = (Number.isNaN(n) ? 0 : n) + delta;
    setPoints(String(Math.max(-MAX_ABS_POINTS, Math.min(MAX_ABS_POINTS, next))));
    setError("");
  };

  const submitCustom = (e) => {
    e.preventDefault();
    const msg = validateCategory(label, points, save ? categories : []);
    if (msg) return setError(msg);
    onApply({ categoryId: null, label: label.trim(), points: Number(points) }, save);
  };

  const leading = (
    <div className="flex -space-x-2 shrink-0">
      {targets.slice(0, 3).map((t) => (
        <EntityAvatar key={t.id} name={t.name} src={t.photo} className="h-9 w-9 ring-2 ring-white dark:ring-slate-900" />
      ))}
    </div>
  );

  return (
    <Sheet
      title="Award points"
      subtitle={single ? `${single.name}${single.roll != null ? ` · Roll ${single.roll}` : ""}` : `${targets.length} students selected`}
      leading={leading}
      onClose={onClose}
    >
      <div className="space-y-3">
        {categories.length === 0 ? (
          <div className="rounded-xl bg-primary/5 border border-primary/15 px-3.5 py-3 flex items-center gap-3">
            <p className="text-xs text-slate-600 dark:text-slate-300 flex-1">
              You haven&apos;t created any point categories yet. Add your own in Setup, or award a custom amount below.
            </p>
            <button type="button" onClick={onOpenSetup}
              className="shrink-0 h-8 px-3 rounded-full bg-primary text-white text-[11px] font-bold inline-flex items-center gap-1.5 cursor-pointer">
              <Settings2 size={12} /> Setup
            </button>
          </div>
        ) : (
          <>
            {(showFilter || showSearch) && (
              <div className="flex items-center gap-2">
                {showFilter && (
                  <div className="flex p-0.5 rounded-full bg-slate-100 dark:bg-slate-800 shrink-0">
                    {FILTERS.filter(([v]) => v === "all" || (v === "pos" ? hasPos : hasNeg)).map(([v, l]) => (
                      <button key={v} type="button" onClick={() => setFilter(v)} aria-pressed={filter === v}
                        className={`h-7 px-3 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
                          filter === v ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-500 dark:text-slate-400"
                        }`}>
                        {l}
                      </button>
                    ))}
                  </div>
                )}
                {showSearch && (
                  <div className="relative flex-1 min-w-0">
                    <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" aria-label="Search categories"
                      className={`${inputCls} !h-8 !rounded-full pl-8 text-xs`} />
                  </div>
                )}
              </div>
            )}

            {list.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">No categories match.</p>
            ) : (
              <ul aria-label="Point categories"
                className="grid grid-cols-2 gap-2 max-h-[min(40vh,300px)] overflow-y-auto -mx-1 px-1 py-0.5">
                {list.map((c) => (
                  <li key={c.id}>
                    <button type="button" title={c.purpose || c.label}
                      onClick={() => onApply({ categoryId: c.id, label: c.label, points: c.points }, false)}
                      className="w-full h-12 flex items-center justify-between gap-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-left hover:border-primary hover:bg-primary/5 active:scale-[0.97] transition-all cursor-pointer">
                      <span className="text-[13px] font-semibold text-foreground leading-tight line-clamp-2 min-w-0">{c.label}</span>
                      <span className={`shrink-0 text-[11px] font-bold px-1.5 py-0.5 rounded-md tabular-nums ${pointsChipClass(c.points)}`}>
                        {formatPoints(c.points)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {/* Custom amount */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
          {!customOpen ? (
            <button type="button" onClick={() => setCustomOpen(true)}
              className="text-xs font-bold text-primary inline-flex items-center gap-1.5 cursor-pointer">
              <Plus size={14} /> Custom points
            </button>
          ) : (
            <form onSubmit={submitCustom} noValidate className="space-y-2.5">
              <div className="flex items-center gap-2">
                <input className={inputCls} value={label} maxLength={40} placeholder="Reason, e.g. Helped in lab"
                  aria-label="Reason" onChange={(e) => { setLabel(e.target.value); setError(""); }} />
                <div className="flex items-center shrink-0 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 h-10">
                  <button type="button" onClick={() => step(-1)} aria-label="Decrease points"
                    className="h-full w-8 flex items-center justify-center text-slate-500 hover:text-primary cursor-pointer"><Minus size={14} /></button>
                  <input type="number" inputMode="decimal" step="any" value={points} placeholder="0" aria-label="Points"
                    onChange={(e) => { setPoints(e.target.value); setError(""); }}
                    className="w-12 h-full bg-transparent text-center text-sm font-bold tabular-nums focus:outline-none" />
                  <button type="button" onClick={() => step(1)} aria-label="Increase points"
                    className="h-full w-8 flex items-center justify-center text-slate-500 hover:text-primary cursor-pointer"><Plus size={14} /></button>
                </div>
              </div>
              {error && <p role="alert" className="text-xs font-semibold text-rose-600 dark:text-rose-400">{error}</p>}
              <div className="flex items-center justify-between gap-2">
                <button type="button" onClick={() => setSave((v) => !v)} aria-pressed={save}
                  className={`h-8 px-3 rounded-full text-[11px] font-bold border inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
                    save ? "bg-primary/10 border-primary text-primary" : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400"
                  }`}>
                  {save && <Check size={12} />} Save as category
                </button>
                <button type="submit"
                  className="h-9 px-5 rounded-full bg-primary text-white text-xs font-bold hover:opacity-90 active:scale-95 transition-all inline-flex items-center gap-1.5 cursor-pointer">
                  Award {Number(points) ? formatPoints(Number(points)) : ""}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Sheet>
  );
}
