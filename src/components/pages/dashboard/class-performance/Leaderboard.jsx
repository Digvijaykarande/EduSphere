"use client";

import { useMemo } from "react";
import { ChevronLeft, ChevronRight, Download, Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react";
import EntityAvatar from "./StudentAvatar";
import {
  buildLeaderboard,
  downloadText,
  formatMarks,
  leaderboardToCSV,
  shiftAnchor,
  ymd,
} from "./performance.utils";

const MEDAL = {
  1: "from-amber-300 to-amber-500 text-amber-950",
  2: "from-slate-200 to-slate-400 text-slate-800",
  3: "from-orange-300 to-orange-500 text-orange-950",
};

function RankBadge({ rank, className = "" }) {
  return (
    <span className={`inline-flex items-center justify-center rounded-full font-extrabold tabular-nums ${
      MEDAL[rank] ? `bg-gradient-to-br ${MEDAL[rank]}` : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
    } ${className}`}>
      {rank}
    </span>
  );
}

function Delta({ delta }) {
  if (!delta) return <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-slate-400"><Minus size={12} />0</span>;
  const up = delta > 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span className={`inline-flex items-center gap-0.5 text-[11px] font-bold tabular-nums ${up ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
      <Icon size={12} />{Math.abs(delta)}
    </span>
  );
}

/** `period` / `offset` live in the parent so they survive switching tabs. offset 0 = current period. */
export default function Leaderboard({ students, events, sectionLabel, settings, period, offset, baseDate, onChange }) {
  const anchor = useMemo(() => shiftAnchor(period, baseDate, offset), [period, baseDate, offset]);
  const { range, rows, maxPoints } = useMemo(
    () => buildLeaderboard(students, events, period, anchor, settings),
    [students, events, period, anchor, settings],
  );

  const current = offset === 0;
  const hasActivity = rows.some((r) => r.count > 0);
  const podium = rows.filter((r) => r.rank <= 3 && r.points > 0).slice(0, 3);
  const noun = period === "week" ? "week" : "month";
  const showMarks = !!settings?.marksEnabled;

  const exportCsv = () => {
    const name = `class-performance-${(sectionLabel || "class").replace(/[^a-z0-9]+/gi, "-")}-${period}-${ymd(range.start)}.csv`;
    downloadText(name, leaderboardToCSV(rows, settings));
  };

  return (
    <div className="space-y-3">
      {/* Controls */}
      <div className="dashboard-card p-2.5 sm:p-3 flex flex-wrap items-center gap-2.5">
        <div role="group" aria-label="Ranking period" className="flex p-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
          {[["week", "Weekly"], ["month", "Monthly"]].map(([v, l]) => (
            <button key={v} type="button" aria-pressed={period === v} onClick={() => onChange({ period: v, offset: 0 })}
              className={`h-8 px-4 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                period === v ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-500 dark:text-slate-400"
              }`}>
              {l}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 flex-1 min-w-[12rem] order-last sm:order-none">
          <button type="button" aria-label={`Previous ${noun}`} onClick={() => onChange({ period, offset: offset - 1 })}
            className="h-9 w-9 shrink-0 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary cursor-pointer">
            <ChevronLeft size={16} />
          </button>
          <div className="flex-1 min-w-0 text-center leading-tight">
            <p className="text-sm font-bold text-foreground truncate">{range.label}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{current ? `This ${noun}` : `Past ${noun}`}</p>
          </div>
          <button type="button" aria-label={`Next ${noun}`} disabled={current} onClick={() => onChange({ period, offset: offset + 1 })}
            className="h-9 w-9 shrink-0 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary disabled:opacity-40 disabled:pointer-events-none cursor-pointer">
            <ChevronRight size={16} />
          </button>
          {!current && (
            <button type="button" onClick={() => onChange({ period, offset: 0 })}
              className="h-9 px-3 shrink-0 rounded-full text-xs font-bold text-primary bg-primary/10 hover:bg-primary/15 cursor-pointer">
              Now
            </button>
          )}
        </div>

        <button type="button" onClick={exportCsv} disabled={students.length === 0} aria-label="Export CSV"
          className="ml-auto sm:ml-0 h-9 px-3.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-primary hover:text-primary inline-flex items-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none cursor-pointer">
          <Download size={14} /> <span className="hidden sm:inline">Export</span>
        </button>
      </div>

      {!hasActivity ? (
        <div className="dashboard-card py-14 px-6 text-center">
          <Trophy className="mx-auto h-9 w-9 text-slate-300 dark:text-slate-600 mb-3" />
          <p className="text-sm font-bold text-foreground">No points awarded {current ? `this ${noun}` : `in this ${noun}`}</p>
          <p className="text-xs text-slate-500 mt-1">
            {current ? "Award points in the Score tab and the ranking appears here." : "Use the arrows to browse other periods."}
          </p>
        </div>
      ) : (
        <>
          {podium.length > 0 && (
            <div className="grid grid-cols-3 gap-2 sm:gap-3 items-end">
              {[podium[1], podium[0], podium[2]].map((r, i) =>
                r ? (
                  <div key={r.id}
                    className={`dashboard-card flex flex-col items-center text-center px-2 sm:px-4 ${i === 1 ? "pt-4 pb-4 sm:pt-6 ring-2 ring-amber-400/50" : "pt-3 pb-3 sm:pt-4"}`}>
                    <RankBadge rank={r.rank} className="h-6 w-6 text-xs mb-2" />
                    <EntityAvatar name={r.name} src={r.photo} className={i === 1 ? "h-14 w-14 sm:h-16 sm:w-16" : "h-11 w-11 sm:h-13 sm:w-13"} />
                    <p className="mt-2 text-xs sm:text-sm font-bold text-foreground w-full truncate">{r.name}</p>
                    <p className="mt-1 text-base sm:text-lg font-extrabold text-primary tabular-nums leading-none">
                      {r.points}<span className="text-[10px] font-bold text-slate-400 ml-0.5">pts</span>
                    </p>
                    {showMarks && <p className="text-[10px] font-semibold text-slate-500 mt-1 tabular-nums">{formatMarks(r.marks)}/{settings.totalMarks} marks</p>}
                  </div>
                ) : <div key={`empty-${i}`} />,
              )}
            </div>
          )}

          <div className="dashboard-card overflow-hidden">
            <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <p className="text-sm font-bold text-foreground">Full ranking</p>
              <p className="text-[11px] text-slate-400">{rows.length} students</p>
            </div>
            <ol className="divide-y divide-slate-100 dark:divide-slate-800">
              {rows.map((r) => (
                <li key={r.id} className="flex items-center gap-3 px-3 sm:px-4 py-2.5">
                  <RankBadge rank={r.rank} className="h-7 w-7 text-xs shrink-0" />
                  <EntityAvatar name={r.name} src={r.photo} className="h-9 w-9 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <p className="text-sm font-bold text-foreground truncate">{r.name}</p>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">#{r.roll ?? "—"}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-primary to-violet-400 transition-all duration-500"
                        style={{ width: `${maxPoints > 0 ? Math.max(0, Math.min(100, (r.points / maxPoints) * 100)) : 0}%` }} />
                    </div>
                    <p className="hidden sm:block text-[11px] text-slate-400 mt-1 truncate">
                      {r.count} action{r.count === 1 ? "" : "s"}{r.topCategory ? ` · Most: ${r.topCategory}` : ""}
                    </p>
                  </div>
                  <div className="text-right shrink-0 min-w-16">
                    <p className="text-base font-extrabold text-foreground tabular-nums leading-none">{r.points}</p>
                    {showMarks && <p className="text-[10px] font-semibold text-slate-500 tabular-nums mt-0.5">{formatMarks(r.marks)}/{settings.totalMarks}</p>}
                    <div className="mt-0.5 flex justify-end"><Delta delta={r.delta} /></div>
                  </div>
                </li>
              ))}
            </ol>
            <p className="px-4 py-2 text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
              Arrows compare with the previous {noun}. Equal points share the same rank.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
