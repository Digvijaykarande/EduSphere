"use client";

import React, { useMemo } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { useLeaveStore } from "@/store/use-leave-store";
import LeaveApplyForm from "./Leaveapplyform";
import {
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Clock,
  CalendarDays,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";

export default function StudentAttendanceView() {
  const user = useAuthStore((s) => s.user) || {
    name: "Mayur Mehta",
    role: "Student",
    section: "10-A",
  };
  const submitStudentLeave = useLeaveStore((s) => s.submitStudentLeave);

  const rawStudentLeaves = useLeaveStore((s) => s.studentLeaves);
  const myLeaves = useMemo(() => {
    return rawStudentLeaves.filter((r) => r.name === user.name);
  }, [rawStudentLeaves, user.name]);

  // Enhanced stats array with semantic trend types for dynamic styling
  const stats = [
    {
      label: "Overall Attendance",
      value: "88%",
      icon: TrendingUp,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-500/10",
      glow: "bg-indigo-500",
      trend: "+2% this month",
      trendType: "positive",
    },
    {
      label: "Days Present",
      value: "42",
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      glow: "bg-emerald-500",
      trend: "Consistent",
      trendType: "positive",
    },
    {
      label: "Days Absent",
      value: "4",
      icon: AlertCircle,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-500/10",
      glow: "bg-rose-500",
      trend: "Needs attention",
      trendType: "negative",
    },
    {
      label: "Days Late",
      value: "2",
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-500/10",
      glow: "bg-amber-500",
      trend: "Mostly on time",
      trendType: "neutral",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Modern SaaS-Style Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="relative bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
          >
            {/* Atmospheric Background Glow */}
            <div
              className={`absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-0 group-hover:opacity-10 dark:opacity-0 dark:group-hover:opacity-20 blur-3xl transition-all duration-500 pointer-events-none ${stat.glow}`}
            />

            {/* Header: Icon & Label */}
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-105 transition-transform duration-300`}
              >
                <stat.icon size={20} strokeWidth={2.5} />
              </div>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {stat.label}
              </span>
            </div>

            {/* Body: Metric Value */}
            <div className="relative z-10 mb-4">
              <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {stat.value}
              </span>
            </div>

            {/* Footer: Dynamic Trend Pill */}
            <div className="relative z-10 flex items-center">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                  stat.trendType === "positive"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                    : stat.trendType === "negative"
                      ? "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20"
                      : "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
                }`}
              >
                {stat.trendType === "positive" && (
                  <ArrowUpRight size={12} strokeWidth={3} />
                )}
                {stat.trendType === "negative" && (
                  <ArrowDownRight size={12} strokeWidth={3} />
                )}
                {stat.trendType === "neutral" && (
                  <Minus size={12} strokeWidth={3} />
                )}
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Form */}
        <div className="xl:col-span-2 flex flex-col">
          <LeaveApplyForm
            applicantName={user.name}
            applicantMeta={{ role: "Student", section: user.section || "10-A" }}
            submittedTo="your class teacher"
            onSubmit={submitStudentLeave}
          />
        </div>

        {/* Right Column: Flush SaaS Activity Feed */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col h-full overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200/60 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2.5">
              <FileText size={16} className="text-indigo-500" />
              Leave History
            </h3>
            <span className="text-[10px] font-bold bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md uppercase tracking-wider">
              {myLeaves.length} Records
            </span>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[400px] no-scrollbar">
            {myLeaves.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                  <CalendarDays size={20} className="text-slate-400" />
                </div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  No requests found
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Your leave history will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {myLeaves.map((r) => (
                  <div
                    key={r.id}
                    className="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                          {r.from}
                          {r.to && r.to !== r.from ? `  →  ${r.to}` : ""}
                        </span>
                        <StatusBadge status={r.status} />
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800/60 mt-3 relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500/20" />
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed pl-1.5">
                        <span className="font-semibold text-slate-500 dark:text-slate-400 mr-1">
                          Reason:
                        </span>
                        {r.reason}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Minimalist SaaS Status Badge
function StatusBadge({ status }) {
  const map = {
    Pending:
      "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    Approved:
      "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    Denied:
      "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
  };
  return (
    <span
      className={`inline-flex shrink-0 font-bold px-2 py-0.5 rounded-[6px] text-[9px] uppercase tracking-wider border ${map[status] || map.Pending}`}
    >
      {status}
    </span>
  );
}
