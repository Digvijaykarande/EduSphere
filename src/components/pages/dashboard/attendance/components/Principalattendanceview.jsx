"use client";

import React from "react";
import { useLeaveStore } from "@/store/use-leave-store";
import LeaveInbox from "./Leaveinbox";
import AttendanceChart from "./AttendanceChart";
import { 
  Users, 
  UserCheck, 
  GraduationCap, 
  TrendingUp, 
  AlertTriangle, 
  Bell, 
  Activity 
} from "lucide-react";

export default function PrincipalAttendanceView() {
  const teacherLeaves = useLeaveStore((s) => s.teacherLeaves);
  const actOnTeacherLeave = useLeaveStore((s) => s.actOnTeacherLeave);

  // Expanded Mock Data for the Principal Dashboard
  const stats = [
    { label: "Total Teachers", value: "48", icon: Users, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-500/20", trend: "Fully Staffed" },
    { label: "Present Teachers", value: "45", icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-500/20", trend: "3 on leave" },
    { label: "Total Students", value: "1,200", icon: GraduationCap, color: "text-indigo-600", bg: "bg-indigo-100 dark:bg-indigo-500/20", trend: "Active Enrollment" },
    { label: "Avg Attendance", value: "94.2%", icon: TrendingUp, color: "text-violet-600", bg: "bg-violet-100 dark:bg-violet-500/20", trend: "+1.2% this week" },
  ];

  const criticalAlerts = [
    { id: 1, title: "Low Attendance: Grade 10-B", desc: "Current attendance is 72% (below 75% threshold).", time: "10 mins ago", type: "warning" },
    { id: 2, title: "Unmarked Registers", desc: "3 teachers have not submitted morning attendance.", time: "1 hour ago", type: "alert" },
    { id: 3, title: "Staff Shortage", desc: "Science department has 2 teachers on unexpected leave.", time: "2 hours ago", type: "warning" },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Level Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="dashboard-card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            {/* Decorative background accent */}
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-20 dark:opacity-10 pointer-events-none ${stat.bg}`} />
            
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={22} strokeWidth={2.5} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {stat.trend}
              </span>
            </div>
            <div className="relative z-10">
              <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-1 tracking-tight">
                {stat.value}
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Section: Chart and Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Analytics Chart */}
        <div className="xl:col-span-2 dashboard-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-5 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity size={18} className="text-indigo-500" /> School-wide Trends
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Daily attendance percentages for the current week</p>
            </div>
          </div>
          <div className="flex-1 min-h-[250px]">
            {/* Renders the AreaChart from your existing component */}
            <AttendanceChart />
          </div>
        </div>

        {/* Critical Alerts Feed */}
        <div className="dashboard-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col h-full overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bell size={16} className="text-rose-500" /> Action Required
            </h3>
            <span className="bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {criticalAlerts.length} New
            </span>
          </div>
          
          <div className="p-5 flex-1 space-y-4 overflow-y-auto max-h-[300px] no-scrollbar">
            {criticalAlerts.map((alert) => (
              <div key={alert.id} className="flex gap-3 items-start group">
                <div className={`mt-0.5 p-2 rounded-full shrink-0 ${
                  alert.type === 'alert' 
                    ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400' 
                    : 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400'
                }`}>
                  <AlertTriangle size={14} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{alert.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{alert.desc}</p>
                  <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 mt-1.5 block uppercase tracking-wider">
                    {alert.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Leave Inbox */}
      <div className="dashboard-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <LeaveInbox
          title="Staff Leave Approvals"
          subtitle="Pending requests across all departments"
          requests={teacherLeaves}
          onApprove={(id) => actOnTeacherLeave(id, "Approved")}
          onDeny={(id) => actOnTeacherLeave(id, "Denied")}
        />
      </div>
      
    </div>
  );
}