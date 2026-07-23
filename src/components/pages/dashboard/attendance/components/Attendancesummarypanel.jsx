"use client";

import React from "react";

export default function AttendanceSummaryPanel({ students, onSave, saved }) {
  const total = students.length;
  const present = students.filter((s) => s.status === "present").length;
  const absent = students.filter((s) => s.status === "absent").length;
  const late = students.filter((s) => s.status === "late").length;
  const notMarked = total - present - absent - late;
  const pct = total ? Math.round((present / total) * 1000) / 10 : 0;

  const circumference = 2 * Math.PI * 46;
  const dash = (pct / 100) * circumference;
  const absentList = students.filter((s) => s.status === "absent");

  return (
    <div className="space-y-4">
      <div className="dashboard-card p-5">
        <p className="text-sm font-display font-semibold text-foreground mb-4">Attendance Summary</p>
        <div className="flex items-center justify-center">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="46" fill="none" stroke="var(--border)" strokeWidth="10" />
            <circle
              cx="60" cy="60" r="46" fill="none" stroke="#10b981" strokeWidth="10"
              strokeDasharray={`${dash} ${circumference}`}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
            />
            <text x="60" y="56" textAnchor="middle" className="fill-foreground" style={{ fontSize: 20, fontWeight: 700 }}>{pct}%</text>
            <text x="60" y="74" textAnchor="middle" className="fill-slate-400" style={{ fontSize: 10 }}>Present</text>
          </svg>
        </div>
        <div className="mt-4 space-y-2 text-sm">
          <Row color="#10b981" label="Present" value={present} pct={total ? Math.round((present / total) * 1000) / 10 : 0} />
          <Row color="#ef4444" label="Absent" value={absent} pct={total ? Math.round((absent / total) * 1000) / 10 : 0} />
          <Row color="#f59e0b" label="Late" value={late} pct={total ? Math.round((late / total) * 1000) / 10 : 0} />
          <Row color="#cbd5e1" label="Not Marked" value={notMarked} pct={total ? Math.round((notMarked / total) * 1000) / 10 : 0} />
        </div>
      </div>

      <div className="dashboard-card p-5">
        <p className="text-sm font-display font-semibold text-foreground mb-3">Absent Students ({absent})</p>
        <div className="space-y-1.5 max-h-48 overflow-y-auto">
          {absentList.length === 0 && <p className="text-xs text-slate-400 dark:text-slate-500">No absentees marked yet.</p>}
          {absentList.map((s) => (
            <div key={s.id} className="flex items-center gap-2 text-xs">
              <span className="h-5 w-5 rounded-full bg-rose-50 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold shrink-0">{s.rollNo}</span>
              <span className="text-slate-700 dark:text-slate-300 font-medium truncate">{s.name}</span>
            </div>
          ))}
        </div>
      </div>

      <button onClick={onSave} className="btn-pill-primary w-full !py-3 text-sm justify-center gap-2">
        {saved ? "Saved ✓" : "Save Attendance"}
      </button>
    </div>
  );
}

function Row({ color, label, value, pct }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-2 w-2 rounded-full shrink-0" style={{ background: color }} />
      <span className="text-slate-600 dark:text-slate-300 flex-1">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
      <span className="text-slate-400 dark:text-slate-500 text-xs w-10 text-right">{pct}%</span>
    </div>
  );
}