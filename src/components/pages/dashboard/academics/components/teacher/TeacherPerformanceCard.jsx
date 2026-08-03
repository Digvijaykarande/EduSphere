"use client";

import { Award } from "lucide-react";

export default function TeacherPerformanceCard() {
  return (
    <div className="upgrade-card p-6 relative overflow-hidden">
      <div className="relative z-10 space-y-4">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/70 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-md inline-block">
          Teacher performance
        </span>

        <div className="flex items-center gap-3">
          <Award className="w-8 h-8 text-amber-300 shrink-0" />
          <h3 className="text-2xl font-black tracking-tight">High Gear</h3>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/15">
          <div>
            <div className="text-2xl font-extrabold tracking-tight">24</div>
            <div className="text-xs text-white/70 font-medium">Lectures finished</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold tracking-tight">98%</div>
            <div className="text-xs text-white/70 font-medium">Satisfaction score</div>
          </div>
        </div>
      </div>
    </div>
  );
}