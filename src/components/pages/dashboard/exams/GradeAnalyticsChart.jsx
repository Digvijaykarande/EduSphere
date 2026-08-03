// src/components/pages/dashboard/exams/GradeAnalyticsChart.jsx
"use client";

import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";
import { analyticsData } from "./mockData";

const GRADE_COLORS = {
  "A+": "#10b981",
  A: "#22c55e",
  B: "#6366f1",
  C: "#f59e0b",
  D: "#fb923c",
  F: "#ef4444",
};

export default function GradeAnalyticsChart() {
  const total = analyticsData.reduce((sum, g) => sum + g.count, 0);
  const failCount = analyticsData.find((g) => g.group === "F")?.count ?? 0;
  const failRate = total ? ((failCount / total) * 100).toFixed(1) : "0.0";

  return (
    <div className="h-full w-full bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">Grade Distribution</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Current term curve across all courses</p>
        </div>
        <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold uppercase tracking-wide">
          {failRate}% at risk
        </span>
      </div>
      <div className="flex-1 min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={analyticsData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-700/50" />
            <XAxis dataKey="group" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#8891a8" }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#8891a8" }} />
            <Tooltip
              cursor={{ fill: "rgba(99, 102, 241, 0.05)" }}
              contentStyle={{ backgroundColor: "var(--card, #fff)", borderColor: "var(--border, #e2e8f0)", borderRadius: "8px", fontSize: "12px" }}
              formatter={(value) => [`${value} students`, "Count"]}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={44}>
              {analyticsData.map((entry) => (
                <Cell key={entry.group} fill={GRADE_COLORS[entry.group] ?? "#6366f1"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
        <div>
          <p className="text-[10px] text-slate-500 uppercase font-bold">Total Students</p>
          <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{total}</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-500 uppercase font-bold">A grade & above</p>
          <p className="text-sm font-bold text-emerald-500 mt-0.5">
            {(((analyticsData.find((g) => g.group === "A+")?.count ?? 0) + (analyticsData.find((g) => g.group === "A")?.count ?? 0)) / total * 100).toFixed(0)}%
          </p>
        </div>
        <div>
          <p className="text-[10px] text-slate-500 uppercase font-bold">Below Passing</p>
          <p className="text-sm font-bold text-rose-500 mt-0.5">{failCount} students</p>
        </div>
      </div>
    </div>
  );
}