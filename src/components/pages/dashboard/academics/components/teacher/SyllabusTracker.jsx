"use client";

import { BookOpen } from "lucide-react";

export default function SyllabusTracker({ subjects }) {
  return (
    <div className="dashboard-card p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="stat-icon-box stat-icon-violet">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground tracking-tight">Syllabus Tracking</h3>
          <p className="text-xs text-slate-400">Progress across your subjects</p>
        </div>
      </div>

      <div className="space-y-5">
        {subjects.map((item) => (
          <div key={item.id} className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-foreground">{item.subjectName}</span>
              <span className="font-extrabold text-primary">{item.progressPercentage}%</span>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${item.progressPercentage}%`, backgroundColor: item.color || "#6366f1" }}
              />
            </div>

            <p className="text-[11px] text-slate-400 font-medium">Current: {item.currentUnit}</p>
          </div>
        ))}
      </div>
    </div>
  );
}