import React from "react";
import { Plus } from "lucide-react";

export default function SupportHeader({ setCreateOpen }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">
          Support & Tickets
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage user issues, respond to tickets, and monitor SLA performance.
        </p>
      </div>
      <button
        onClick={() => setCreateOpen(true)}
        className="btn-pill-primary !px-5 !py-2.5 text-xs gap-2 shrink-0 w-full md:w-auto justify-center cursor-pointer" style={{background:"lab(40 29.66 -62.04)"}}
      >
        <Plus size={15} /> Create Ticket
      </button>
    </div>
  );
}