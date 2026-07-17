"use client";

import React, { useState, useEffect } from "react";
import { User, Check, X, Clock } from "lucide-react";

// Mock Data Seed matching our classroom cohort
const initialStudents = [
  { id: "101", name: "Amit Sharma", rollNo: "01", status: "Present", overall: "96%" },
  { id: "102", name: "Neha Patil", rollNo: "02", status: "Present", overall: "92%" },
  { id: "103", name: "Rahul Deshmukh", rollNo: "03", status: "Absent", overall: "71%" }, // Below threshold
  { id: "104", name: "Sneha Kulkarni", rollNo: "04", status: "Present", overall: "88%" },
  { id: "105", name: "Vikram Rathod", rollNo: "05", status: "Late", overall: "74%" },    // Below threshold
];

export default function AttendanceMarkingGrid({ grade, query }) {
  const [students, setStudents] = useState(initialStudents);

  // Helper handler function to cycle status loops on click
  const updateStatus = (studentId, newStatus) => {
    setStudents(prev =>
      prev.map(stu => stu.id === studentId ? { ...stu, status: newStatus } : stu)
    );
  };

  // Simple reactive fuzzy lookup matching search strings
  const filteredStudents = students.filter(stu =>
    stu.name.toLowerCase().includes(query.toLowerCase()) || 
    stu.rollNo.includes(query)
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50">
            <th className="py-4 px-6">Roll No</th>
            <th className="py-4 px-6">Student Info</th>
            <th className="py-4 px-6">Overall Term Stat</th>
            <th className="py-4 px-6 text-center">Mark Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {filteredStudents.map((student) => {
            const isWarning = parseFloat(student.overall) < 75;

            return (
              <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                {/* Roll Info */}
                <td className="py-4 px-6 font-mono font-medium text-slate-400 w-20">{student.rollNo}</td>
                
                {/* Profile Meta Info */}
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                      <User size={16} />
                    </div>
                    <span className="font-medium text-slate-800">{student.name}</span>
                  </div>
                </td>
                
                {/* Overridden Alert threshold indexes */}
                <td className="py-4 px-6">
                  <span className={`font-semibold ${isWarning ? "text-red-500 font-bold" : "text-slate-600"}`}>
                    {student.overall} {isWarning && "⚠️"}
                  </span>
                </td>
                
                {/* Interactive Status Selector Matrix */}
                <td className="py-4 px-6">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => updateStatus(student.id, "Present")}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        student.status === "Present"
                          ? "tone-present scale-105 shadow-sm"
                          : "text-slate-400 hover:bg-slate-100"
                      }`}
                    >
                      <Check size={14} /> Present
                    </button>
                    
                    <button
                      onClick={() => updateStatus(student.id, "Absent")}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        student.status === "Absent"
                          ? "tone-absent scale-105 shadow-sm"
                          : "text-slate-400 hover:bg-slate-100"
                      }`}
                    >
                      <X size={14} /> Absent
                    </button>
                    
                    <button
                      onClick={() => updateStatus(student.id, "Late")}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        student.status === "Late"
                          ? "tone-late scale-105 shadow-sm"
                          : "text-slate-400 hover:bg-slate-100"
                      }`}
                    >
                      <Clock size={14} /> Late
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}