"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import PageWrapper from "@/components/shared/PageWrapper";
import AttendanceChart from "@/components/pages/dashboard/attendance/components/AttendanceChart";
import GradeAnalyticsChart from "@/components/pages/dashboard/exams/components/GradeAnalyticsChart";
import { 
  Users, CheckCircle2, DollarSign, AlertCircle, Clock, 
  ArrowUpRight, ShieldCheck, Zap, PlusCircle, Check 
} from "lucide-react";

const stats = [
  { label: "Total Students", value: "1,248", change: "+4.2% this term", icon: Users, tone: "text-primary" },
  { label: "Average Attendance", value: "94.6%", change: "Steady week", icon: CheckCircle2, tone: "text-success" },
  { label: "Fees Collected", value: "₹4.8M", change: "82% of total", icon: DollarSign, tone: "text-gold" },
  { label: "Active Tickets", value: "14", change: "4 urgent", icon: AlertCircle, tone: "text-warning" },
];

const recentActivity = [
  { id: 1, text: "Grade 10 mid-term marks uploaded by Prof. Dattatray", time: "10 mins ago", category: "Academic" },
  { id: 2, text: "Fee receipt #9401 cleared for student ID #104", time: "45 mins ago", category: "Finance" },
  { id: 3, text: "High-priority ticket #2481 opened — library access", time: "2 hours ago", category: "Support" },
];

const administrativeTasks = [
  { title: "Generate Report Slips", desc: "Batch sign term certificates.", actionable: true, route: "/dashboard/exams" },
  { title: "Review Attendance Dues", desc: "3 students flagged below 75%.", actionable: true, route: "/dashboard/attendance" },
  { title: "Emergency Faculty Cover", desc: "1 pending cover request.", actionable: true, route: "/dashboard/academics" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

export default function DashboardHub() {
  return (
    <PageWrapper>
      {/* Welcome Banner */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-semibold text-foreground tracking-tight">
            Welcome back, Portal Admin
          </h1>
          <p className="text-sm text-secondary mt-1">
            EduSphere Institutional Resource Planning Console • Live Overview
          </p>
        </div>

        {/* Live Status Pill */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 text-xs font-mono font-medium text-slate-600 shadow-sm self-start md:self-auto">
          <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
          <span>All Core Services Operational</span>
        </div>
      </div>

      {/* Quick Action Matrix */}
      <div className="mb-8 bg-slate-200/50 p-4 rounded-xl border border-slate-300/40 flex flex-wrap items-center gap-3">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 flex items-center gap-1.5">
          <Zap size={14} className="text-gold" /> Quick Engine Actions:
        </span>
        <Link href="/dashboard/attendance">
          <button className="flex items-center gap-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-semibold py-2 px-3.5 rounded-lg hover:bg-slate-50 transition-all shadow-sm">
            <PlusCircle size={14} className="text-primary" /> Lock Attendance
          </button>
        </Link>
        <Link href="/dashboard/exams">
          <button className="flex items-center gap-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-semibold py-2 px-3.5 rounded-lg hover:bg-slate-50 transition-all shadow-sm">
            <PlusCircle size={14} className="text-gold" /> Ingest Test Scores
          </button>
        </Link>
      </div>

      {/* Stat Cards — report-slip style */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              variants={item}
              whileHover={{ y: -2 }}
              className="report-card p-6 pt-7 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{stat.label}</p>
                  <h3 className="text-2xl font-mono font-semibold text-foreground mt-1.5">{stat.value}</h3>
                  <span className="text-xs font-medium text-secondary block mt-1.5">{stat.change}</span>
                </div>
                <div className={`h-10 w-10 stamp-badge ${stat.tone} shrink-0 bg-slate-50/50`}>
                  <Icon size={18} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Main Layout Layer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Attendance Area Analysis */}
        <div className="report-card p-6 pt-7 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-display font-semibold text-foreground">Weekly attendance analysis</h3>
              <p className="text-xs text-slate-400">Aggregated tracking index across running cohorts</p>
            </div>
            <span className="text-xs font-bold text-success bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
              Target &gt;90% Met
            </span>
          </div>
          <AttendanceChart />
        </div>

        {/* Actionable Tasks List */}
        <div className="report-card p-6 pt-7 shadow-sm flex flex-col justify-between">
          <div>
            <div className="mb-5">
              <h3 className="text-base font-display font-semibold text-foreground">Immediate System Actions</h3>
              <p className="text-xs text-slate-400">Tasks waiting for administrative approval</p>
            </div>
            <div className="space-y-3">
              {administrativeTasks.map((task, index) => (
                <Link href={task.route} key={index} className="block">
                  <div className="p-3 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition-colors cursor-pointer flex items-center justify-between group">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{task.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{task.desc}</p>
                    </div>
                    <ArrowUpRight size={14} className="text-slate-400 group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="pt-4 border-t border-slate-100 text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-600" /> Secure Admin Action Context
          </div>
        </div>

        {/* Real-Time Activity Feed */}
        <div className="report-card p-6 pt-7 shadow-sm lg:col-span-1">
          <div className="mb-6">
            <h3 className="text-base font-display font-semibold text-foreground">Campus activity log</h3>
            <p className="text-xs text-slate-400">Latest structural adjustments across departments</p>
          </div>
          <div className="space-y-5">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex gap-3 text-sm">
                <div className="mt-0.5 shrink-0 text-gold">
                  <Clock size={15} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-primary font-mono bg-blue-50 border border-blue-100 px-1.5 py-0.2 rounded">
                    {activity.category}
                  </span>
                  <p className="text-foreground/90 font-normal leading-snug mt-1">{activity.text}</p>
                  <span className="text-xs text-slate-400 font-mono block mt-0.5">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grade Breakdown Curves */}
        <div className="report-card p-6 pt-7 shadow-sm lg:col-span-2">
          <div className="mb-4">
            <h3 className="text-base font-display font-semibold text-foreground">Exam performance distribution</h3>
            <p className="text-xs text-slate-400">Current term bell curves across standard parameters</p>
          </div>
          <GradeAnalyticsChart />
        </div>

      </div>
    </PageWrapper>
  );
}