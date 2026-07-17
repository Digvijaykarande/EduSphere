"use client";

import React, { useState } from "react";
import PageWrapper from "@/components/shared/PageWrapper";
import GradebookTable from "@/features/exams/components/GradebookTable";
import { FileSpreadsheet, ClipboardList, TrendingUp, Award } from "lucide-react";

export default function ExamsPage() {
  const [selectedAssessment, setSelectedAssessment] = useState("mid-term");
  const [selectedSubject, setSelectedSubject] = useState("math");

  return (
    <PageWrapper>
      {/* Module Title Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Examination & Gradebook</h1>
          <p className="text-sm text-slate-500 mt-1">Configure assessment metrics, record student marks, and compile institutional grading scales.</p>
        </div>

        {/* Configuration Filters Layer */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Term:</label>
            <select
              value={selectedAssessment}
              onChange={(e) => setSelectedAssessment(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-primary shadow-sm"
            >
              <option value="mid-term">Mid-Term Evaluation (Weightage: 30%)</option>
              <option value="final-exam">Final Theory Examination (Weightage: 70%)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Subject:</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-primary shadow-sm"
            >
              <option value="math">Mathematics (Grade 10-A)</option>
              <option value="physics">Physics (Grade 11-B)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grade Summary Analytics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-primary rounded-xl"><ClipboardList size={20} /></div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase">Evaluations Graded</p>
            <h4 className="text-xl font-bold text-slate-800 mt-0.5">42 / 42 Papers</h4>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-success rounded-xl"><TrendingUp size={20} /></div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase">Class Average Score</p>
            <h4 className="text-xl font-bold text-slate-800 mt-0.5">78.4 / 100</h4>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Award size={20} /></div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase">Passing Rate Metric</p>
            <h4 className="text-xl font-bold text-emerald-600 mt-0.5">92.8% Passing</h4>
          </div>
        </div>
      </div>

      {/* Interactive Gradebook Entry Roster Card */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-800">Live Marks Ingestion Roster</h3>
            <p className="text-xs text-slate-400">Input values directly. The system automatically computes relative grade letters instantly.</p>
          </div>
          <button className="flex items-center gap-1.5 bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-emerald-700 transition-all shadow-sm">
            <FileSpreadsheet size={14} /> Export Marks Sheet (CSV)
          </button>
        </div>

        <GradebookTable subject={selectedSubject} assessment={selectedAssessment} />
      </div>
    </PageWrapper>
  );
}