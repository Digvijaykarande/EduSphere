"use client";

import { useMemo, useState } from "react";
import { Search, Trash2, History } from "lucide-react";
import {
  dayLabel,
  formatPoints,
  pointsChipClass,
  round2,
  startOfDay,
  startOfWeek,
  timeLabel,
} from "./performance.utils";

const PAGE = 40;
const RANGES = [
  { value: "today", label: "Today" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "all", label: "All" },
];

function since(range) {
  const now = new Date();
  if (range === "today") return startOfDay(now);
  if (range === "week") return startOfWeek(now);
  if (range === "month") return new Date(now.getFullYear(), now.getMonth(), 1);
  return new Date(0);
}

export default function HistoryPanel({ events, onDelete }) {
  const [query, setQuery] = useState("");
  const [range, setRange] = useState("week");
  const [limit, setLimit] = useState(PAGE);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const from = since(range).getTime();
    return events
      .filter((e) => new Date(e.ts).getTime() >= from)
      .filter((e) => !q || e.studentName.toLowerCase().includes(q) || e.label.toLowerCase().includes(q) || String(e.rollNumber ?? "").toLowerCase().includes(q))
      .sort((a, b) => new Date(b.ts) - new Date(a.ts));
  }, [events, query, range]);

  const shown = filtered.slice(0, limit);
  const groups = [];
  for (const e of shown) {
    const label = dayLabel(e.ts);
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.items.push(e);
    else groups.push({ label, items: [e] });
  }
  const total = round2(filtered.reduce((a, e) => a + e.points, 0));

  return (
    <div className="dashboard-card overflow-hidden">
      <div className="p-2.5 sm:p-3 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input type="search" value={query} onChange={(e) => { setQuery(e.target.value); setLimit(PAGE); }}
            placeholder="Search student or category" aria-label="Search history"
            className="w-full h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>
        <div role="group" aria-label="History period" className="flex p-0.5 rounded-full bg-slate-100 dark:bg-slate-800 sm:shrink-0">
          {RANGES.map((r) => (
            <button key={r.value} type="button" aria-pressed={range === r.value}
              onClick={() => { setRange(r.value); setLimit(PAGE); }}
              className={`flex-1 sm:flex-none h-9 sm:px-4 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                range === r.value ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-500 dark:text-slate-400"
              }`}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-14 px-6 text-center">
          <History className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600 mb-2" />
          <p className="text-sm font-semibold text-foreground">No activity found</p>
          <p className="text-xs text-slate-500 mt-1">Awarded points show up here. You can remove a mistaken entry.</p>
        </div>
      ) : (
        <>
          <p className="px-4 py-2 text-[11px] text-slate-500 bg-slate-50/70 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
            {filtered.length} entr{filtered.length === 1 ? "y" : "ies"} · net <span className="font-bold tabular-nums">{formatPoints(total)}</span> points
          </p>
          {groups.map((g) => (
            <section key={g.label}>
              <h3 className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{g.label}</h3>
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {g.items.map((e) => (
                  <li key={e.id} className="flex items-center gap-3 px-3 sm:px-4 py-2">
                    <span className={`shrink-0 w-14 text-center text-xs font-bold px-2 py-1 rounded-full tabular-nums ${pointsChipClass(e.points)}`}>
                      {formatPoints(e.points)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-foreground truncate">{e.studentName}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {e.label} · Roll {e.rollNumber ?? "—"} · {timeLabel(e.ts)}
                      </p>
                    </div>
                    <button type="button" onClick={() => onDelete(e)} aria-label={`Remove ${e.label} for ${e.studentName}`}
                      className="h-9 w-9 shrink-0 rounded-full flex items-center justify-center text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 cursor-pointer">
                      <Trash2 size={15} />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
          {filtered.length > limit && (
            <div className="p-3 border-t border-slate-100 dark:border-slate-800 text-center">
              <button type="button" onClick={() => setLimit((l) => l + PAGE)}
                className="h-9 px-5 rounded-full text-xs font-bold text-primary bg-primary/10 hover:bg-primary/15 cursor-pointer">
                Show more ({filtered.length - limit} left)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
