"use client";

import React from "react";
import { Search, Grid3x3, List as ListIcon } from "lucide-react";

export default function BulkActionsBar({ onMarkAll, onClearAll, query, setQuery, view, setView }) {
  return (
    <div className="dashboard-card p-3 flex flex-col sm:flex-row items-center gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={() => onMarkAll("present")} className="btn-pill-primary !px-4 !py-2 text-xs"> All Present</button>
        <button onClick={() => onMarkAll("absent")} className="btn-pill-outline !px-4 !py-2 text-xs dark:"> All Absent</button>
        <button onClick={() => onMarkAll("late")} className="btn-pill-outline !px-4 !py-2 text-xs"> All Late</button>
        <button onClick={onClearAll} className="btn-pill-outline !px-4 !py-2 text-xs">Clear All</button>
      </div>
      <div className="flex items-center gap-2 sm:ml-auto w-full sm:w-auto">
        <div className="relative flex-1 sm:w-56">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search roll / name"
            className="dash-focus w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg py-2 pl-8 pr-3 text-xs"
          />
        </div>
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          <button onClick={() => setView("seat")} className={`p-1.5 rounded-md ${view === "seat" ? "bg-white dark:bg-slate-700 shadow-sm text-primary" : "text-slate-400"}`}>
            <Grid3x3 size={15} />
          </button>
          <button onClick={() => setView("list")} className={`p-1.5 rounded-md ${view === "list" ? "bg-white dark:bg-slate-700 shadow-sm text-primary" : "text-slate-400"}`}>
            <ListIcon size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}