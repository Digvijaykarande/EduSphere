"use client";

import React, { useState } from "react";
import { Save, User } from "lucide-react";

const initialStudents = [
  { id: "101", name: "Amit Sharma", rollNo: "01", rawScore: 88 },
  { id: "102", name: "Neha Patil", rollNo: "02", rawScore: 94 },
  { id: "103", name: "Rahul Deshmukh", rollNo: "03", rawScore: 52 },
  { id: "104", name: "Sneha Kulkarni", rollNo: "04", rawScore: 76 },
  { id: "105", name: "Vikram Rathod", rollNo: "05", rawScore: 34 },
];

// Pure helper function to evaluate grading breaks cleanly
const calculateGrade = (score) => {
  const numeric = parseFloat(score);
  if (isNaN(numeric)) return { label: "-", color: "text-slate-400 bg-slate-50 border-slate-200" };
  if (numeric >= 90) return { label: "A+", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
  if (numeric >= 80) return { label: "A", color: "text-emerald-600 bg-emerald-50/60 border-emerald-100" };
  if (numeric >= 70) return { label: "B+", color: "text-blue-700 bg-blue-50 border-blue-200" };
  if (numeric >= 60) return { label: "B", color: "text-blue-600 bg-blue-50/60 border-blue-100" };
  if (numeric >= 40) return { label: "C", color: "text-amber-700 bg-amber-50 border-amber-200" };
  return { label: "F", color: "text-red-700 bg-red-50 border-red-200" };
};

export default function GradebookTable({ subject, assessment }) {
  const [grades, setGrades] = useState(initialStudents);
  const [isSaving, setIsSaving] = useState(false);

  const handleScoreChange = (id, val) => {
    // Prevent entry values from executing outside standard bounds
    if (val !== "" && (parseInt(val) < 0 || parseInt(val) > 100)) return;
    
    setGrades(prev =>
      prev.map(item => item.id === id ? { ...item, rawScore: val === "" ? "" : parseInt(val) } : item)
    );
  };

  const saveToBackendMock = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Gradebook updates successfully synced into administrative records!");
    }, 800);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50">
            <th className="py-4 px-6 w-24">Roll No</th>
            <th className="py-4 px-6">Student Full Name</th>
            <th className="py-4 px-6 w-40">Input Raw Score (/100)</th>
            <th className="py-4 px-6 w-32 text-center">Derived Grade</th>
            <th className="py-4 px-6 w-36 text-center">Evaluation Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {grades.map((student) => {
            const gradeInfo = calculateGrade(student.rawScore);
            const isFailing = gradeInfo.label === "F";

            return (
              <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-4 px-6 font-mono font-medium text-slate-400">{student.rollNo}</td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                      <User size={15} />
                    </div>
                    <span className="font-medium text-slate-800">{student.name}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <input
                    type="number"
                    value={student.rawScore}
                    onChange={(e) => handleScoreChange(student.id, e.target.value)}
                    placeholder="0-100"
                    className="w-24 bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-3 py-1.5 font-mono text-sm font-semibold focus:outline-none focus:border-primary text-slate-800 transition-colors"
                  />
                </td>
                <td className="py-4 px-6 text-center">
                  <span className={`inline-block px-3 py-1 rounded-md text-xs font-bold border ${gradeInfo.color} min-w-[42px]`}>
                    {gradeInfo.label}
                  </span>
                </td>
                <td className="py-4 px-6 text-center">
                  <span className={`text-xs font-semibold ${isFailing ? "text-red-500" : "text-slate-400"}`}>
                    {isFailing ? "🚨 Needs Remedial" : "Passed"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Persistent Batch Save Trigger Row */}
      <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-end">
        <button
          onClick={saveToBackendMock}
          disabled={isSaving}
          className="flex items-center gap-2 bg-primary text-white text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-600/10 disabled:opacity-50"
        >
          <Save size={14} /> {isSaving ? "Saving Ledger Records..." : "Commit Grade Changes"}
        </button>
      </div>
    </div>
  );
}