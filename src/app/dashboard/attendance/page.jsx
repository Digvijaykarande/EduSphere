"use client";

import React, { useState } from "react";
import PageWrapper from "@/components/shared/PageWrapper";
import AttendanceMarkingGrid from "@/features/attendance/components/AttendanceMarkingGrid";
import { Calendar, Users, AlertTriangle, CheckCircle } from "lucide-react";

export default function AttendancePage() {
  const [selectedGrade, setSelectedGrade] = useState("10-A");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <PageWrapper>
      {/* Module Title Section */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Attendance Engine</h1>
          <p className="text-sm text-slate-500 mt-1">Manage running daily classroom registries and monitor strict operational thresholds.</p>
        </div>
        
        {/* Filter Configuration Controller */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Cohort:</label>
          <select 
            value={selectedGrade} 
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:border-primary shadow-sm"
          >
            <option value="10-A">Grade 10 (Section A)</option>
            <option value="10-B">Grade 10 (Section B)</option>
            <option value="11-A">Grade 11 (Section A)</option>
          </select>
        </div>
      </div>

      {/* Mini Tracker Micro-Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Users size={20} /></div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase">Enrolled Students</p>
            <h4 className="text-xl font-bold text-slate-800 mt-0.5">42 Active</h4>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-success rounded-xl"><CheckCircle size={20} /></div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase">Marked Present</p>
            <h4 className="text-xl font-bold text-slate-800 mt-0.5">38 Today</h4>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-warning rounded-xl"><AlertTriangle size={20} /></div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase">Below Threshold (&lt;75%)</p>
            <h4 className="text-xl font-bold text-red-600 mt-0.5">3 Flagged</h4>
          </div>
        </div>
      </div>

      {/* Main Student Roster & Marking Engine */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-800">Class Roster Registry</h3>
            <p className="text-xs text-slate-400">Click a state tag to instantly save attendance records in real-time.</p>
          </div>
          <input 
            type="text"
            placeholder="Search student by name or roll number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-4 py-1.5 text-sm focus:outline-none focus:border-primary w-full sm:w-72"
          />
        </div>

        <AttendanceMarkingGrid grade={selectedGrade} query={searchQuery} />
      </div>
    </PageWrapper>
  );
}