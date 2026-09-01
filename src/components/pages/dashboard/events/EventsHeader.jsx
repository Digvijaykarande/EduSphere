import React from "react";
import { Plus, Download } from "lucide-react";

export default function EventsHeader({
  exportEvents,
  openModal,
  selectedDate,
  canManage,
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">
          Events
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Dashboard <span className="mx-1">›</span> Events
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={exportEvents}
          className="btn-pill-outline !px-5 !py-2.5 text-xs gap-2 dark:!border-slate-700 dark:!text-slate-300 dark:bg-slate-800 cursor-pointer"
        >
          <Download size={15} /> Export Events
        </button>
        {canManage && (
          <button
            onClick={() => openModal(selectedDate)}
            className="btn-pill-primary !px-5 !py-2.5 text-xs gap-2 cursor-pointer bg-lab(45 18.62 -63.04)"
            style={{ background: "lab(45 18.62 -63.04)" }}
          >
            <Plus size={15} /> Create Event
          </button>
        )}
      </div>
    </div>
  );
}
