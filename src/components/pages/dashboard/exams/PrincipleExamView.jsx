// src/components/pages/dashboard/exams/PrincipalExamView.jsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, FileSpreadsheet } from "lucide-react";
import GradeAnalyticsChart from "./GradeAnalyticsChart";
import GradebookTable from "./GradebookTable";
import { examMetrics, courseList } from "./mockData";

export default function PrincipalExamView() {
  const [selectedCourse, setSelectedCourse] = useState(courseList[0].id);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      
      {/* Analytics KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {examMetrics.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{stat.label}</p>
            <h3 className="text-2xl font-mono font-bold text-slate-900 dark:text-white mt-1">{stat.value}</h3>
            <span className={`inline-block mt-2 px-2 py-0.5 rounded-md text-[10px] font-bold border ${stat.bg} ${stat.color}`}>
              {stat.subtext}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <GradeAnalyticsChart />
        </div>
        
        <div className="lg:col-span-2">
          {/* Controls Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:w-auto">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Select Course Ledger</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full sm:w-64 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {courseList.map(course => <option key={course.id} value={course.id}>{course.name}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
               <button className="flex-1 sm:flex-none flex justify-center items-center gap-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-bold px-4 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                <FileSpreadsheet size={14} /> Export CSV
              </button>
              <button className="flex-1 sm:flex-none flex justify-center items-center gap-1.5 bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-blue-600 transition-all shadow-md">
                <Plus size={14} /> Create Exam
              </button>
            </div>
          </div>

          <GradebookTable />
        </div>
      </div>
    </motion.div>
  );
}