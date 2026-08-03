"use client";

import { useState, useMemo } from "react";
import { Clock, ChevronDown, MapPin } from "lucide-react";

const VISIBLE_CARDS = 3; // shown before day view scrolls, arranged in the responsive grid
const DAY_SCROLL_MAX_HEIGHT = 420; // px — roughly 2 rows of cards on a wide screen

/** Parses "08:00 AM - 09:00 AM" into [startMinutes, endMinutes] from midnight. */
function parseTimeSlot(timeSlot) {
  const parts = timeSlot.split("-").map((s) => s.trim());
  if (parts.length !== 2) return null;

  const toMinutes = (timeStr) => {
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return null;
    let [, h, m, period] = match;
    h = parseInt(h, 10);
    m = parseInt(m, 10);
    if (period.toUpperCase() === "PM" && h !== 12) h += 12;
    if (period.toUpperCase() === "AM" && h === 12) h = 0;
    return h * 60 + m;
  };

  const start = toMinutes(parts[0]);
  const end = toMinutes(parts[1]);
  if (start === null || end === null) return null;
  return [start, end];
}

function useOngoingPeriodId(periods) {
  return useMemo(() => {
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    for (const period of periods) {
      const range = parseTimeSlot(period.timeSlot);
      if (!range) continue;
      const [start, end] = range;
      if (nowMinutes >= start && nowMinutes < end) return period.id;
    }
    return null;
  }, [periods]);
}

function DayView({ periods }) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const ongoingId = useOngoingPeriodId(periods);
  const needsScroll = periods.length > VISIBLE_CARDS;

  return (
    <div>
      <div className="relative">
        <div
          className={needsScroll ? "overflow-y-auto pr-1" : ""}
          style={needsScroll ? { maxHeight: DAY_SCROLL_MAX_HEIGHT } : undefined}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {periods.map((period) => {
              const isOngoing = period.id === ongoingId;

              return (
                <div
                  key={period.id}
                  className={`relative p-4 rounded-xl border transition-all duration-200 ${
                    isOngoing
                      ? "bg-primary/5 border-2 border-primary shadow-sm"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  {isOngoing && (
                    <span className="absolute -top-3 right-3 bg-primary text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wider uppercase">
                      Ongoing
                    </span>
                  )}

                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                      {period.periodNumber}
                    </span>
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Period</span>
                  </div>

                  <h4 className="font-bold text-foreground text-base mb-1 truncate">{period.subject}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-3">
                    <Clock className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span>{period.timeSlot}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md uppercase tracking-wider shrink-0">
                      <MapPin className="w-3 h-3" />
                      {period.room}
                    </span>
                    {period.teacher && (
                      <span className="text-[11px] text-slate-400 truncate">{period.teacher}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {needsScroll && (
        <div className="flex items-center justify-center gap-1 mt-2 text-[11px] font-semibold text-slate-400">
          <ChevronDown className="w-3.5 h-3.5" />
          <span>Scroll for more periods</span>
        </div>
      )}
    </div>
  );
}

const WEEK_ROW_HEIGHT = 90;
const WEEK_VISIBLE_ROWS = 4;

function WeekView({ weekTimetable }) {
  const { days, periods } = weekTimetable;
  const needsScroll = periods.length > WEEK_VISIBLE_ROWS;

  const todayIndex = useMemo(() => {
    // JS getDay(): 0=Sun..6=Sat. Map onto Mon-first day arrays like ["Mon", ..., "Sat"].
    const jsDay = new Date().getDay();
    const mondayFirst = jsDay === 0 ? 6 : jsDay - 1;
    const dayAbbrev = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][mondayFirst];
    return days.indexOf(dayAbbrev);
  }, [days]);

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-sm flex flex-col">
      <div className="overflow-x-auto custom-scrollbar">
        <div className="min-w-[760px]">
          
          {/* Header Row */}
          <div 
            className="grid bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20"
            style={{ gridTemplateColumns: `85px repeat(${days.length}, minmax(110px, 1fr))` }}
          >
            <div className="p-3 border-r border-slate-200 dark:border-slate-800 sticky left-0 bg-slate-50 dark:bg-slate-900/50 z-30" />
            {days.map((day, i) => {
              const isToday = i === todayIndex;
              return (
                <div 
                  key={day} 
                  className={`p-3 text-center border-r border-slate-200 dark:border-slate-800 last:border-r-0 ${isToday ? 'bg-primary/5' : ''}`}
                >
                  <span className={`text-[11px] font-extrabold uppercase tracking-wider ${isToday ? 'text-primary' : 'text-slate-500 dark:text-slate-400'}`}>
                    {day}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Body Rows */}
          <div 
            className={`custom-scrollbar ${needsScroll ? "overflow-y-auto" : ""}`}
            style={needsScroll ? { maxHeight: WEEK_ROW_HEIGHT * WEEK_VISIBLE_ROWS } : undefined}
          >
            {periods.map((period, rowIdx) => (
              <div 
                key={period.id} 
                className="grid border-b border-slate-200 dark:border-slate-800 last:border-b-0 group transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/20" 
                style={{ gridTemplateColumns: `85px repeat(${days.length}, minmax(110px, 1fr))` }}
              >
                
                {/* Time Column (Sticky) */}
                <div className="p-2 flex flex-col justify-center items-center text-center border-r border-slate-200 dark:border-slate-800 sticky left-0 bg-white dark:bg-slate-950 group-hover:bg-slate-50/50 dark:group-hover:bg-slate-800/50 transition-colors z-10">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    {period.time.split("-")[0]?.trim()}
                  </span>
                  {period.time.split("-")[1] && (
                    <span className="text-[9px] font-medium text-slate-400">
                      to {period.time.split("-")[1]?.trim()}
                    </span>
                  )}
                </div>

                {/* Day Columns */}
                {days.map((day, colIdx) => {
                  const slot = period[day];
                  const isToday = colIdx === todayIndex;

                  return (
                    <div 
                      key={`${period.id}-${day}`} 
                      className={`p-1.5 border-r border-slate-200 dark:border-slate-800 last:border-r-0 ${isToday ? 'bg-primary/[0.02]' : ''}`}
                      style={{ height: WEEK_ROW_HEIGHT }}
                    >
                      {slot ? (
                        <div className="h-full w-full rounded-lg bg-primary/10 border border-primary/20 p-2.5 flex flex-col justify-center hover:bg-primary/15 hover:border-primary/30 transition-all cursor-pointer">
                          <span className="text-xs font-bold text-primary leading-tight line-clamp-2 mb-1.5">
                            {slot.subject}
                          </span>
                          {slot.room && (
                            <div className="flex items-center gap-1.5 text-primary/80">
                              <MapPin className="w-3 h-3 shrink-0" />
                              <span className="text-[10px] font-semibold tracking-wide truncate">
                                {slot.room}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="h-full w-full rounded-lg border-2 border-dashed border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors cursor-pointer flex items-center justify-center group/empty">
                          <span className="text-[18px] font-light text-slate-300 dark:text-slate-600 opacity-0 group-hover/empty:opacity-100 transition-opacity">
                            +
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}

              </div>
            ))}
          </div>
        </div>
      </div>

      {needsScroll && (
        <div className="flex items-center justify-center gap-1 py-2.5 text-[11px] font-semibold text-slate-500 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <ChevronDown className="w-3.5 h-3.5" />
          <span>
            Scroll to see more periods
          </span>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 6px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
        }
      `}</style>
    </div>
  );
}

export default function DailyTimetable({ periods, weekTimetable }) {
  const [viewMode, setViewMode] = useState("day");
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  return (
    <div className="dashboard-card p-6">
      <div className="flex items-center justify-between flex-start mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="stat-icon-box stat-icon-violet">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground tracking-tight">
              {viewMode === "day" ? "Daily Timetable" : "Weekly Timetable"}
            </h3>
            <p className="text-xs text-slate-400">
              {viewMode === "day" ? "Today's scheduled academic periods" : "Your full class schedule this week"}
            </p>
          </div>
        </div>

        <div className="flex justify-end mb-4">
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
            {today}
          </span>
        </div>

        <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <button
            type="button"
            onClick={() => setViewMode("day")}
            className={`px-3 py-1 rounded-lg transition-all ${
              viewMode === "day" ? "bg-white dark:bg-slate-900 text-primary font-bold shadow-sm" : "hover:text-foreground"
            }`}
          >
            Day
          </button>
          <button
            type="button"
            onClick={() => setViewMode("week")}
            className={`px-3 py-1 rounded-lg transition-all ${
              viewMode === "week" ? "bg-white dark:bg-slate-900 text-primary font-bold shadow-sm" : "hover:text-foreground"
            }`}
          >
            Week
          </button>
        </div>
      </div>

      {viewMode === "day" ? <DayView periods={periods} /> : <WeekView weekTimetable={weekTimetable} />}
    </div>
  );
}