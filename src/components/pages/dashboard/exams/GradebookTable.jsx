// src/components/pages/dashboard/exams/GradebookTable.jsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, ChevronLeft, ChevronRight, Search, Download, CheckCircle2, Loader2 } from "lucide-react";
import { generateStudents } from "./mockData";

export default function GradebookTable({ subject = "All Subjects" }) {
  const [data, setData] = useState([]);
  const [edits, setEdits] = useState({}); // { studentId: newScore }
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved
  const itemsPerPage = 10;

  // Simulate fetching dynamic data based on subject
  useEffect(() => {
    setData(generateStudents(subject, 34)); // Generate 34 dummy students
    setEdits({});
    setCurrentPage(1); // Reset to page 1 on subject change
  }, [subject]);

  const filtered = useMemo(
    () => data.filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.rollNo.toLowerCase().includes(searchTerm.toLowerCase())),
    [data, searchTerm]
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginatedData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getGrade = (score) => {
    if (score >= 90) return { label: "A+", color: "bg-emerald-500/10 text-emerald-500" };
    if (score >= 80) return { label: "A", color: "bg-emerald-500/10 text-emerald-500" };
    if (score >= 70) return { label: "B", color: "bg-blue-500/10 text-blue-500" };
    if (score >= 60) return { label: "C", color: "bg-amber-500/10 text-amber-500" };
    return { label: "F", color: "bg-rose-500/10 text-rose-500" };
  };

  const handleScoreChange = (id, value) => {
    setEdits((prev) => ({ ...prev, [id]: value }));
  };

  const unsavedCount = Object.keys(edits).length;

  const handleSaveAll = () => {
    setSaveState("saving");
    setTimeout(() => {
      setData((prev) => prev.map((s) => (edits[s.id] !== undefined ? { ...s, rawScore: Number(edits[s.id]) } : s)));
      setEdits({});
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 1800);
    }, 700);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden mt-6 shadow-sm">
      {/* Toolbar */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/30">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or roll no..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {unsavedCount > 0 && (
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap">
              {unsavedCount} unsaved change{unsavedCount > 1 ? "s" : ""}
            </span>
          )}
          <button className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Download size={13} /> Export
          </button>
          <button
            disabled={unsavedCount === 0 || saveState === "saving"}
            onClick={handleSaveAll}
            className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-xs font-bold bg-primary text-white hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {saveState === "saving" ? <Loader2 size={13} className="animate-spin" /> : saveState === "saved" ? <CheckCircle2 size={13} /> : <Save size={13} />}
            {saveState === "saving" ? "Saving…" : saveState === "saved" ? "Saved" : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 font-bold uppercase tracking-wider">
            <tr>
              <th className="py-4 px-5">Roll No</th>
              <th className="py-4 px-5">Student Name</th>
              <th className="py-4 px-5">Subject</th>
              <th className="py-4 px-5 w-32">Score (/100)</th>
              <th className="py-4 px-5 text-center">Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            <AnimatePresence initial={false}>
              {paginatedData.map((student) => {
                const currentScore = edits[student.id] !== undefined ? Number(edits[student.id]) : student.rawScore;
                const grade = getGrade(currentScore);
                const isEdited = edits[student.id] !== undefined;
                return (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/30 text-slate-700 dark:text-slate-300 ${isEdited ? "bg-amber-50/60 dark:bg-amber-500/5" : ""}`}
                  >
                    <td className="py-3 px-5 font-mono">{student.rollNo}</td>
                    <td className="py-3 px-5 font-semibold">{student.name}</td>
                    <td className="py-3 px-5">{student.subject}</td>
                    <td className="py-3 px-5">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={currentScore}
                        onChange={(e) => handleScoreChange(student.id, e.target.value)}
                        className={`w-16 bg-slate-50 dark:bg-slate-800 border rounded-lg px-2 py-1 font-mono text-xs focus:ring-1 focus:ring-primary outline-none ${
                          isEdited ? "border-amber-400" : "border-slate-200 dark:border-slate-700"
                        }`}
                      />
                    </td>
                    <td className="py-3 px-5 text-center">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${grade.color}`}>{grade.label}</span>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-slate-400 text-xs font-semibold">
                  No students match "{searchTerm}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="p-4 bg-slate-50/50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-500 font-medium">
          Showing {filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} entries
        </span>
        <div className="flex items-center gap-1">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"><ChevronLeft size={16} /></button>
          
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${currentPage === i + 1 ? "bg-primary text-white" : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
              {i + 1}
            </button>
          ))}
          
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"><ChevronRight size={16} /></button>
        </div>
      </div>
    </div>
  );
}