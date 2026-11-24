"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, Check, ChevronDown, Plus, Search, Users, X } from "lucide-react";
import EntityAvatar from "./StudentAvatar";
import { compareRoll, compareText, formatPoints, pointsChipClass } from "./performance.utils";

const SORTS = [
  { value: "roll", label: "Roll no." },
  { value: "name", label: "Name A–Z" },
  { value: "today-desc", label: "Most today" },
  { value: "today-asc", label: "Least today" },
];

export default function ScoringList({
  students,
  todayMap,
  weekMap,
  selectMode,
  selected,
  onToggleSelectMode,
  onToggle,
  onToggleAll,
  onAward,
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("roll");
  const [onlyUnscored, setOnlyUnscored] = useState(false);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = students.filter(
      (s) => !q || s.name.toLowerCase().includes(q) || String(s.roll ?? "").toLowerCase().includes(q),
    );
    if (onlyUnscored) list = list.filter((s) => !todayMap.get(s.id)?.count);
    const pts = (s) => todayMap.get(s.id)?.points ?? 0;
    const sorted = [...list];
    if (sort === "name") sorted.sort((a, b) => compareText(a.name, b.name));
    else if (sort === "today-desc") sorted.sort((a, b) => pts(b) - pts(a) || compareRoll(a, b));
    else if (sort === "today-asc") sorted.sort((a, b) => pts(a) - pts(b) || compareRoll(a, b));
    else sorted.sort(compareRoll);
    return sorted;
  }, [students, query, sort, onlyUnscored, todayMap]);

  const allVisibleSelected = visible.length > 0 && visible.every((s) => selected.has(s.id));
  const unscoredCount = students.filter((s) => !todayMap.get(s.id)?.count).length;

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="dashboard-card p-2.5 sm:p-3 space-y-2.5">
        <div className="flex gap-2">
          <div className="relative flex-1 min-w-0">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name or roll no." aria-label="Search students"
              className="w-full h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-9 pr-9 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="Clear search"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full flex items-center justify-center text-slate-400 hover:text-foreground cursor-pointer">
                <X size={14} />
              </button>
            )}
          </div>
          <div className="relative shrink-0">
            <ArrowUpDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort students"
              className="h-10 appearance-none rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-8 pr-8 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer w-[7.5rem] sm:w-36">
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <button type="button" onClick={() => setOnlyUnscored((v) => !v)} aria-pressed={onlyUnscored}
              className={`h-8 px-3 rounded-full text-[11px] font-bold border transition-colors cursor-pointer whitespace-nowrap ${
                onlyUnscored ? "bg-primary text-white border-primary" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary"
              }`}>
              Not scored today · {unscoredCount}
            </button>
            {selectMode && (
              <button type="button" onClick={() => onToggleAll(visible.map((s) => s.id), !allVisibleSelected)}
                disabled={visible.length === 0}
                className="h-8 px-2 text-[11px] font-bold text-primary disabled:opacity-40 cursor-pointer whitespace-nowrap">
                {allVisibleSelected ? "Unselect all" : "Select all"}
              </button>
            )}
          </div>
          <button type="button" onClick={onToggleSelectMode} aria-pressed={selectMode}
            className={`h-8 px-4 rounded-full text-[11px] font-bold border transition-colors cursor-pointer ${
              selectMode ? "bg-primary/10 text-primary border-primary" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary"
            }`}>
            {selectMode ? "Done" : "Select"}
          </button>
        </div>
      </div>

      {/* Students */}
      {visible.length === 0 ? (
        <div className="dashboard-card py-14 px-6 text-center">
          <Users className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600 mb-2" />
          <p className="text-sm font-semibold text-foreground">
            {students.length === 0 ? "No students in this class yet" : "No students match"}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {students.length === 0 ? "Students appear here once they are added to the section." : "Try a different search or clear the filter."}
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-2.5">
          {visible.map((s) => {
            const today = todayMap.get(s.id);
            const week = weekMap.get(s.id);
            const checked = selected.has(s.id);
            return (
              <li key={s.id}>
                <button type="button"
                  onClick={() => (selectMode ? onToggle(s.id) : onAward(s))}
                  aria-pressed={selectMode ? checked : undefined}
                  aria-label={selectMode ? `Select ${s.name}` : `Award points to ${s.name}`}
                  className={`w-full flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl border text-left transition-all active:scale-[0.985] cursor-pointer ${
                    checked
                      ? "border-primary bg-primary/5 ring-1 ring-primary/40"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary/50 hover:shadow-sm"
                  }`}>
                  <span className="relative shrink-0">
                    <EntityAvatar name={s.name} src={s.photo} className="h-11 w-11" />
                    {selectMode && (
                      <span className={`absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center ${
                        checked ? "bg-primary text-white" : "bg-slate-200 dark:bg-slate-700"
                      }`}>
                        {checked && <Check size={11} strokeWidth={3} />}
                      </span>
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-foreground truncate">{s.name}</span>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400 truncate tabular-nums">
                      Roll {s.roll ?? "—"} · Week {week ? formatPoints(week.points) : "—"}
                    </span>
                  </span>
                  {today ? (
                    <span className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full tabular-nums ${pointsChipClass(today.points)}`}>
                      {formatPoints(today.points)}
                    </span>
                  ) : !selectMode ? (
                    <span className="shrink-0 h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <Plus size={16} />
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
