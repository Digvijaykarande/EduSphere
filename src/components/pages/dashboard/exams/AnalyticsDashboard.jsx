// src/components/pages/dashboard/exams/AnalyticsDashboard.jsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { TrendingDown, TrendingUp, AlertTriangle, ArrowRight } from "lucide-react";
import GradeAnalyticsChart from "./GradeAnalyticsChart";
import { subjectPerformance, classComparison, termTrend, atRiskStudents } from "./mockData";

const cardClass =
  "bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm";

export default function AnalyticsDashboard() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GradeAnalyticsChart />

        <div className={cardClass}>
          <div className="mb-2">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Score Trend Across Terms</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">School-wide average, unit tests through finals</p>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={termTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                <XAxis dataKey="term" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#8891a8" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#8891a8" }} domain={[50, 100]} />
                <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
                <Line type="monotone" dataKey="average" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: "#6366f1" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={cardClass}>
          <div className="mb-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Subject Performance — This Term vs Last</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Average score by subject</p>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectPerformance} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                <XAxis dataKey="subject" tick={{ fontSize: 10, fill: "#8891a8" }} axisLine={false} tickLine={false} interval={0} angle={-20} textAnchor="end" height={60} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#8891a8" }} />
                <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="lastTerm" name="Last Term" fill="#cbd5e1" radius={[4, 4, 0, 0]} maxBarSize={22} />
                <Bar dataKey="average" name="This Term" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={cardClass}>
          <div className="mb-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Class Comparison</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Average score & pass rate by class</p>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classComparison} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                <XAxis dataKey="class" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#8891a8" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#8891a8" }} />
                <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="average" name="Avg Score" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={22} />
                <Bar dataKey="passRate" name="Pass Rate %" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* At-risk students */}
      <div className={cardClass}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <AlertTriangle size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">Students Needing Attention</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Scoring below 50% in their most recent exam</p>
            </div>
          </div>
          <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
            View all <ArrowRight size={12} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {atRiskStudents.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60"
            >
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{s.name}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Class {s.class} • {s.subject}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono font-bold text-rose-500">{s.score}%</span>
                {s.trend === "down" ? (
                  <TrendingDown size={14} className="text-rose-500" />
                ) : (
                  <TrendingUp size={14} className="text-slate-400" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}