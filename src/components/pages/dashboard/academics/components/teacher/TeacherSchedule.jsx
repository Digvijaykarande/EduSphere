"use client";

import { useState, useMemo } from "react";
import { Calendar, Clock, ChevronDown } from "lucide-react";

// Extended TYPE_STYLES to include the new calendar grid styles
const TYPE_STYLES = {
  class: { 
    bar: "bg-primary", 
    border: "border-primary", 
    chip: "bg-primary/10 text-primary", 
    label: "Class",
    calendarBox: "bg-primary/10 border-primary/20 hover:bg-primary/15 hover:border-primary/30",
    calendarText: "text-primary"
  },
  planning: { 
    bar: "bg-success", 
    border: "border-success", 
    chip: "bg-success/10 text-success", 
    label: "Planning",
    calendarBox: "bg-success/10 border-success/20 hover:bg-success/15 hover:border-success/30",
    calendarText: "text-success"
  },
  lab: {
    bar: "bg-blue-500",
    border: "border-blue-500",
    chip: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    label: "Lab session",
    calendarBox: "bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/15 hover:border-blue-500/30",
    calendarText: "text-blue-600 dark:text-blue-400"
  },
};

const VISIBLE_ROWS = 3;
const ROW_HEIGHT = 92; // approx rendered height of one day-view row, in px

/** Parses "09:00 AM" style strings into minutes-from-midnight for comparison. */
function parseTimeToMinutes(timeStr) {
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return null;
  let [, h, m, period] = match;
  h = parseInt(h, 10);
  m = parseInt(m, 10);
  if (period.toUpperCase() === "PM" && h !== 12) h += 12;
  if (period.toUpperCase() === "AM" && h === 12) h = 0;
  return h * 60 + m;
}

function useCurrentPeriodId(scheduleItems) {
  return useMemo(() => {
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    let current = null;
    for (const item of scheduleItems) {
      const start = parseTimeToMinutes(item.time);
      if (start === null) continue;
      const end = start + (item.durationMinutes || 0);
      if (nowMinutes >= start && nowMinutes < end) {
        current = item.id;
        break;
      }
    }
    return current;
  }, [scheduleItems]);
}

function DayTimeline({ scheduleItems }) {
  const currentId = useCurrentPeriodId(scheduleItems);
  const needsScroll = scheduleItems.length > VISIBLE_ROWS;

  return (
    <div className="relative">
      <div
        className={needsScroll ? "space-y-2.5 overflow-y-auto pr-1" : "space-y-2.5"}
        style={needsScroll ? { maxHeight: ROW_HEIGHT * VISIBLE_ROWS } : undefined}
      >
        {scheduleItems.map((item) => {
          const style = TYPE_STYLES[item.type] || TYPE_STYLES.class;
          const isNow = item.id === currentId;

          return (
            <div
              key={item.id}
              className={`flex rounded-xl border transition-all overflow-hidden ${
                isNow
                  ? "border-primary bg-primary/[0.04] shadow-sm"
                  : "border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 hover:bg-slate-100/60 dark:hover:bg-slate-800/50"
              }`}
            >
              <span className={`w-1 shrink-0 ${style.bar}`} />

              <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3.5">
                <div className="sm:w-20 shrink-0">
                  <span className="text-xs font-bold text-foreground">{item.time}</span>
                  {isNow && (
                    <span className="ml-2 sm:ml-0 sm:block text-[10px] font-extrabold text-primary uppercase tracking-wider">
                      Now
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    {item.classBadge && (
                      <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                        {item.classBadge}
                      </span>
                    )}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${style.chip}`}>
                      {style.label}
                    </span>
                  </div>
                  <h4 className="font-bold text-foreground text-sm truncate">{item.title}</h4>
                  {item.topic && <p className="text-xs text-slate-500 font-medium truncate">{item.topic}</p>}
                </div>

                <div className="flex items-center gap-1 shrink-0 text-xs text-slate-400 font-medium sm:ml-auto">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{item.durationMinutes} mins</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {needsScroll && (
        <>
          <div className="pointer-events-none absolute bottom-0 left-0 right-1 h-8 bg-gradient-to-t from-card to-transparent" />
          <div className="flex items-center justify-center gap-1 mt-2 text-[11px] font-semibold text-black">
            <ChevronDown className="w-3.5 h-3.5" />
            <span style={{color:"black"}}> Scroll for more periods</span>
          </div>
        </>
      )}
    </div>
  );
}

const WEEK_ROW_HEIGHT = 90;
const WEEK_VISIBLE_ROWS = 4;

function WeekGrid({ weekSchedule }) {
  const { days, periods } = weekSchedule;
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
                    {period.time.split(" ")[0]}
                  </span>
                  {period.time.split(" ")[1] && (
                    <span className="text-[9px] font-medium text-slate-400">
                      {period.time.split(" ").slice(1).join(" ")}
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
                        (() => {
                          const style = TYPE_STYLES[slot.type] || TYPE_STYLES.class;
                          return (
                            <div className={`h-full w-full rounded-lg border p-2.5 flex flex-col justify-center transition-all cursor-pointer ${style.calendarBox}`}>
                              <span className={`text-xs font-bold leading-tight line-clamp-2 mb-1.5 ${style.calendarText}`}>
                                {slot.title}
                              </span>
                              {slot.classBadge && (
                                <span className="text-[10px] font-semibold tracking-wide truncate opacity-80" style={{ color: "inherit" }}>
                                  {slot.classBadge}
                                </span>
                              )}
                            </div>
                          );
                        })()
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

export default function TeacherSchedule({ scheduleItems, weekSchedule }) {
  const [viewMode, setViewMode] = useState("day");

  return (
    <div className="dashboard-card p-6">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="stat-icon-box stat-icon-violet">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground tracking-tight">Daily & Weekly Schedule</h3>
            <p className="text-xs text-slate-400">Your teaching timetable & prep sessions</p>
          </div>
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

      {viewMode === "day" ? <DayTimeline scheduleItems={scheduleItems} /> : <WeekGrid weekSchedule={weekSchedule} />}
    </div>
  );
}