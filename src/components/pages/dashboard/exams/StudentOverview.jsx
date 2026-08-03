// src/components/pages/dashboard/exams/StudentOverview.jsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { LineChart, Calendar, Award, Download, CalendarDays, Clock, MapPin } from "lucide-react";
import { stats, upcomingExams, recentResults, examTimetable, studentReportCard } from "./mockData";

export default function StudentOverview() {
  const gpa = (studentReportCard.reduce((sum, r) => sum + r.score, 0) / studentReportCard.length / 25).toFixed(1);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-6">
      
      {/* Student Top Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 rounded-3xl p-6 shadow-xl text-white relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
          <div>
            <h2 className="text-xl font-bold">Exam Overview</h2>
            <p className="text-xs text-indigo-300 mt-1">This Academic Year (2025-26)</p>
            <div className="mt-4 flex items-center gap-4">
              <div className="bg-indigo-950/60 p-3 rounded-xl border border-indigo-800/40">
                <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">Overall GPA</p>
                <p className="text-2xl font-mono font-bold text-emerald-400 mt-0.5">{gpa}<span className="text-sm text-indigo-500">/4.0</span></p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm"><LineChart size={24} className="text-indigo-200"/></div>
            <button className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all">
              <Download size={14} /> Download Transcript
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-indigo-800/50">
           <div><p className="text-2xl font-bold">{stats.totalExams}</p><p className="text-[10px] text-indigo-300 uppercase">Total Exams</p></div>
           <div><p className="text-2xl font-bold text-amber-400">{stats.upcomingExams}</p><p className="text-[10px] text-indigo-300 uppercase">Upcoming</p></div>
           <div><p className="text-2xl font-bold text-emerald-400">{stats.completedExams}</p><p className="text-[10px] text-indigo-300 uppercase">Completed</p></div>
           <div><p className="text-2xl font-bold">{stats.averageScore}</p><p className="text-[10px] text-indigo-300 uppercase">Avg Score</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Subject Breakdown */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Subject Breakdown</h3>
          </div>
          <div className="space-y-3">
            {studentReportCard.map((res, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{res.subject}</p>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">{res.score}/100</span>
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] border border-emerald-500/20">
                      {res.grade}
                    </span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${res.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timetable */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
           <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Upcoming Schedule</h3>
          </div>
          <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-3 space-y-6 pb-2">
            {examTimetable.map((exam, idx) => (
              <div key={idx} className="relative pl-6">
                <div className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-4 border-white dark:border-slate-900 ${exam.status === 'Completed' ? 'bg-slate-300 dark:bg-slate-600' : 'bg-primary'}`} />
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{exam.subject}</p>
                <div className="flex flex-wrap items-center gap-3 mt-1.5">
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500"><CalendarDays className="w-3 h-3" /> {exam.date}</span>
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500"><Clock className="w-3 h-3" /> {exam.time}</span>
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500"><MapPin className="w-3 h-3" /> {exam.room}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Upcoming */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Calendar className="text-primary w-4 h-4"/> Upcoming Exams</h3>
          <div className="space-y-3">
             {upcomingExams.map(ex => (
                <div key={ex.id} className="flex gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{ex.subject}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{ex.test}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{ex.date}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-indigo-500/10 text-indigo-500 rounded text-[9px] font-bold uppercase">{ex.class}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Results */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Award className="text-primary w-4 h-4"/> Recent Results</h3>
          <div className="space-y-3">
             {recentResults.map(r => (
                <div key={r.id} className="flex gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{r.subject}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{r.test}</p>
                  </div>
                  <div className="text-right flex flex-col items-end justify-center">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide ${r.status === 'Published' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                      {r.status}
                    </span>
                    <p className="text-[9px] text-slate-400 mt-1">{r.date}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
}