"use client";

import React, { useMemo } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { useLeaveStore } from "@/store/use-leave-store";
import LeaveApplyForm from "./Leaveapplyform";
import { TrendingUp, CheckCircle2, AlertCircle, Clock, CalendarDays, FileText } from "lucide-react";

export default function StudentAttendanceView() {
  const user = useAuthStore((s) => s.user) || { name: "Rohan Mehta", role: "Student", section: "10-A" };
  const submitStudentLeave = useLeaveStore((s) => s.submitStudentLeave);
  
  const rawStudentLeaves = useLeaveStore((s) => s.studentLeaves);
  const myLeaves = useMemo(() => {
    return rawStudentLeaves.filter((r) => r.name === user.name);
  }, [rawStudentLeaves, user.name]);

  const stats = [
    { label: "Overall Attendance", value: "88%", icon: TrendingUp, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-500/10", trend: "+2% this month" },
    { label: "Days Present", value: "42", icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", trend: "Consistent" },
    { label: "Days Absent", value: "4", icon: AlertCircle, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-500/10", trend: "Needs attention" },
    { label: "Days Late", value: "2", icon: Clock, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10", trend: "Mostly on time" },
  ];

  return (
    <div className="space-y-6">
      {/* SaaS-Style Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  {stat.label}
                </span>
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {stat.value}
                </span>
              </div>
              <div className={`p-2.5 rounded-lg ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon size={18} strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex items-center">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
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
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm flex flex-col h-full overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <FileText size={16} className="text-slate-400" />
              Leave History
            </h3>
            <span className="text-[10px] font-bold bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md">
              {myLeaves.length} Records
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto max-h-[400px] no-scrollbar">
            {myLeaves.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl flex items-center justify-center mb-3 shadow-sm">
                  <CalendarDays size={20} className="text-slate-400" />
                </div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No requests found</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Your leave history will appear here.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {myLeaves.map((r) => (
                  <div key={r.id} className="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block mb-1">
                          {r.from}{r.to && r.to !== r.from ? `  →  ${r.to}` : ""}
                        </span>
                        <StatusBadge status={r.status} />
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                      <span className="font-medium text-slate-400 dark:text-slate-500 mr-1">Reason:</span>
                      {r.reason}
                    </p>
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
    Pending: "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    Approved: "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    Denied: "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
  };
  return (
    <span className={`inline-flex shrink-0 font-bold px-2 py-0.5 rounded-[4px] text-[9px] uppercase tracking-wider border ${map[status] || map.Pending}`}>
      {status}
    </span>
  );
}