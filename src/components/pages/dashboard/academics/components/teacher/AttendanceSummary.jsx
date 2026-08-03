"use client";

import { UserCheck } from "lucide-react";

function attendanceTone(pct) {
  if (pct >= 90) return "text-success";
  if (pct >= 75) return "text-amber-500";
  return "text-destructive";
}

export default function AttendanceSummary({ records }) {
  return (
    <div className="dashboard-card p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="stat-icon-box stat-icon-blue">
          <UserCheck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground tracking-tight">Attendance Summary</h3>
          <p className="text-xs text-slate-400">Today's attendance across your classes</p>
        </div>
      </div>

      <div className="space-y-3">
        {records.map((r) => {
          const pct = Math.round((r.present / r.total) * 100);
          return (
            <div
              key={r.id}
              className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30"
            >
              <div>
                <p className="text-sm font-bold text-foreground">{r.classSection}</p>
                <p className="text-[11px] text-slate-400 font-medium">{r.subject}</p>
              </div>

              <div className="text-right">
                <p className={`text-sm font-extrabold ${attendanceTone(pct)}`}>
                  {r.present}/{r.total}
                </p>
                <p className="text-[11px] text-slate-400 font-medium">{pct}% present</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}