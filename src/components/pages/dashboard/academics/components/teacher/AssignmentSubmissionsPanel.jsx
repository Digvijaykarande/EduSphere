"use client";

import { X, Users } from "lucide-react";

const STATUS_STYLES = {
  GRADED: "bg-success/10 text-success",
  SUBMITTED: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  LATE: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  MISSING: "bg-destructive/10 text-destructive",
};

export default function AssignmentSubmissionsPanel({ assignment, roster, onClose }) {
  if (!assignment) return null;

  const submittedCount = roster.filter((s) => s.status !== "MISSING").length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="dashboard-card w-full max-w-lg max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <div className="flex items-start justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-start gap-3">
            <div className="stat-icon-box stat-icon-violet">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground tracking-tight">{assignment.title}</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">{assignment.classSection}</p>
              <p className="text-[11px] text-slate-400 font-medium mt-1">
                {submittedCount}/{roster.length} submitted · Due {assignment.deadline}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shrink-0"
            aria-label="Close"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        <div className="overflow-y-auto p-4 space-y-2">
          {roster.map((student) => (
            <div
              key={student.id}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30"
            >
              <div>
                <p className="text-sm font-bold text-foreground">{student.name}</p>
                {student.submittedOn && (
                  <p className="text-[11px] text-slate-400 font-medium">Submitted {student.submittedOn}</p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {student.marks && (
                  <span className="text-xs font-bold text-foreground">{student.marks}</span>
                )}
                <span
                  className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                    STATUS_STYLES[student.status] || "bg-slate-100 text-slate-600"
                  }`}
                >
                  {student.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}