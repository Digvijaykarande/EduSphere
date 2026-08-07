"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, ChevronLeft, ChevronRight, Search, Download, CheckCircle2, Loader2, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateStudents } from "./mockData";

const CLASSES = ["All Classes", "10-A", "10-B", "11-A", "11-B", "12-A"];
const SUBJECTS = ["All Subjects", "Mathematics", "Physics", "Chemistry", "Computer Science", "English"];

export default function GradebookTable() {
  const [data, setData] = useState([]);
  const [edits, setEdits] = useState({}); // { studentId: newScore }
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Categorization States
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved
  const itemsPerPage = 10;

  // Simulate fetching dynamic data
  useEffect(() => {
    // Injecting mock classes into the generated data to support the new categorization feature
    const rawData = generateStudents("Mathematics", 45).map((s, i) => ({
      ...s,
      class: CLASSES[(i % (CLASSES.length - 1)) + 1], 
      subject: SUBJECTS[(i % (SUBJECTS.length - 1)) + 1],
    }));
    setData(rawData);
    setEdits({});
    setCurrentPage(1);
  }, []);

  const filtered = useMemo(() => {
    return data.filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchClass = selectedClass === "All Classes" || s.class === selectedClass;
      const matchSubject = selectedSubject === "All Subjects" || s.subject === selectedSubject;
      return matchSearch && matchClass && matchSubject;
    });
  }, [data, searchTerm, selectedClass, selectedSubject]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginatedData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getGrade = (score) => {
    if (score >= 90) return { label: "A+", color: "bg-success/10 text-success border-success/20" };
    if (score >= 80) return { label: "A", color: "bg-success/10 text-success border-success/20" };
    if (score >= 70) return { label: "B", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" };
    if (score >= 60) return { label: "C", color: "bg-warning/10 text-warning border-warning/20" };
    return { label: "F", color: "bg-destructive/10 text-destructive border-destructive/20" };
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
    }, 800);
  };

  return (
    <div className="space-y-6">
      
      {/* ----------------- PAGE HEADER ----------------- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">Gradebook Entry</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Manage, update, and finalize student scores across all classes.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">
        
        {/* ----------------- TOOLBAR & FILTERS ----------------- */}
        <div className="p-3 sm:p-5 border-b border-border flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3 sm:gap-4 bg-muted/20">
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full xl:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search name or roll no..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="flex h-10 w-full rounded-xl border border-input bg-background pl-10 pr-4 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
              {/* shadcn Class Dropdown */}
              <div className="w-full sm:w-40">
                <Select value={selectedClass} onValueChange={(val) => { setSelectedClass(val); setCurrentPage(1); }}>
                  <SelectTrigger className="h-10 rounded-xl bg-background border-input shadow-sm focus:ring-2 focus:ring-ring">
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border shadow-xl">
                    {CLASSES.map((c) => (
                      <SelectItem key={c} value={c} className="rounded-lg text-sm font-medium focus:bg-primary/10 focus:text-primary cursor-pointer">{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* shadcn Subject Dropdown */}
              <div className="w-full sm:w-44">
                <Select value={selectedSubject} onValueChange={(val) => { setSelectedSubject(val); setCurrentPage(1); }}>
                  <SelectTrigger className="h-10 rounded-xl bg-background border-input shadow-sm focus:ring-2 focus:ring-ring">
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border shadow-xl">
                    {SUBJECTS.map((sub) => (
                      <SelectItem key={sub} value={sub} className="rounded-lg text-sm font-medium focus:bg-primary/10 focus:text-primary cursor-pointer">{sub}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full xl:w-auto justify-between xl:justify-end flex-wrap">
            {unsavedCount > 0 && (
              <motion.span 
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                className="text-[11px] font-bold text-warning whitespace-nowrap bg-warning/10 px-3 py-1.5 rounded-lg border border-warning/20"
              >
                {unsavedCount} unsaved
              </motion.span>
            )}
            <div className="flex items-center gap-2 sm:gap-3 ml-auto">
              <button className="flex items-center gap-2 h-10 px-3 sm:px-4 rounded-xl border border-input bg-background text-xs font-semibold text-foreground hover:bg-muted/50 transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Download size={14} /> <span className="hidden sm:inline">Export</span>
              </button>
              <button
                disabled={unsavedCount === 0 || saveState === "saving"}
                onClick={handleSaveAll}
                className="flex items-center gap-2 h-10 px-4 sm:px-5 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring whitespace-nowrap"
              >
                {saveState === "saving" ? <Loader2 size={14} className="animate-spin" /> : saveState === "saved" ? <CheckCircle2 size={14} /> : <Save size={14} />}
                <span className="hidden xs:inline sm:inline">{saveState === "saving" ? "Saving…" : saveState === "saved" ? "Saved" : "Save Changes"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ----------------- MOBILE CARD LIST ----------------- */}
        <div className="sm:hidden divide-y divide-border">
          <AnimatePresence initial={false}>
            {paginatedData.map((student) => {
              const currentScore = edits[student.id] !== undefined ? Number(edits[student.id]) : student.rawScore;
              const grade = getGrade(currentScore);
              const isEdited = edits[student.id] !== undefined;

              return (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`p-4 space-y-3 ${isEdited ? "bg-warning/5" : ""}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold text-[13px] text-foreground truncate">{student.name}</p>
                      <p className="font-mono text-[11px] font-bold text-muted-foreground mt-0.5">{student.rollNo}</p>
                    </div>
                    <span className={`inline-flex items-center justify-center min-w-[32px] px-2 py-1 rounded-md text-[11px] font-black tracking-wider border shrink-0 ${grade.color}`}>
                      {grade.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-white text-[10px] font-bold uppercase tracking-wider border border-secondary/50" style={{backgroundColor:"lab(55.0481% -49.9246 15.93)"}}>
                      {student.class}
                    </span>
                    <span className="text-[11px] font-medium text-muted-foreground">{student.subject}</span>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Score (/100)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={currentScore}
                      onChange={(e) => handleScoreChange(student.id, e.target.value)}
                      className={`flex h-9 w-24 rounded-lg border bg-background px-3 py-1 text-sm font-mono font-bold shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        isEdited ? "border-warning text-warning focus-visible:ring-warning/50" : "border-input text-foreground"
                      }`}
                    />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {paginatedData.length === 0 && (
            <div className="h-48 flex flex-col items-center justify-center text-muted-foreground px-6 text-center">
              <Filter className="h-8 w-8 mb-3 opacity-20" />
              <p className="text-sm font-medium">No students found.</p>
              <p className="text-xs mt-1">Try adjusting your class or subject filters.</p>
            </div>
          )}
        </div>

        {/* ----------------- DATA TABLE (tablet/desktop) ----------------- */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr className="border-b border-border">
                <th className="h-12 px-6 align-middle font-semibold uppercase tracking-wider text-xs">Roll No</th>
                <th className="h-12 px-6 align-middle font-semibold uppercase tracking-wider text-xs">Student Name</th>
                <th className="h-12 px-6 align-middle font-semibold uppercase tracking-wider text-xs">Class</th>
                <th className="h-12 px-6 align-middle font-semibold uppercase tracking-wider text-xs">Subject</th>
                <th className="h-12 px-6 align-middle font-semibold uppercase tracking-wider text-xs w-32">Score (/100)</th>
                <th className="h-12 px-6 align-middle font-semibold uppercase tracking-wider text-xs text-center">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
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
                      className={`transition-colors hover:bg-muted/30 ${isEdited ? "bg-warning/5" : ""}`}
                    >
                      <td className="p-6 align-middle font-mono text-[11px] font-bold text-muted-foreground">{student.rollNo}</td>
                      <td className="p-6 align-middle font-bold text-[13px] text-foreground">{student.name}</td>
                      <td className="p-6 align-middle">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-white text-[10px] font-bold uppercase tracking-wider border border-secondary/50" style={{backgroundColor:"lab(55.0481% -49.9246 15.93)"}}>
                          {student.class}
                        </span>
                      </td>
                      <td className="p-6 align-middle font-medium text-xs text-muted-foreground">{student.subject}</td>
                      
                      <td className="p-6 align-middle">
                        <div className="relative flex items-center">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={currentScore}
                            onChange={(e) => handleScoreChange(student.id, e.target.value)}
                            className={`flex h-9 w-20 rounded-lg border bg-background px-3 py-1 text-sm font-mono font-bold shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                              isEdited ? "border-warning text-warning focus-visible:ring-warning/50" : "border-input text-foreground"
                            }`}
                          />
                        </div>
                      </td>
                      
                      <td className="p-6 align-middle text-center">
                        <span className={`inline-flex items-center justify-center min-w-[32px] px-2 py-1 rounded-md text-[11px] font-black tracking-wider border ${grade.color}`}>
                          {grade.label}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
              
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan={6} className="h-48 text-center align-middle">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Filter className="h-8 w-8 mb-3 opacity-20" />
                      <p className="text-sm font-medium">No students found.</p>
                      <p className="text-xs mt-1">Try adjusting your class or subject filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ----------------- PAGINATION ----------------- */}
        <div className="p-3 sm:p-4 bg-muted/20 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] sm:text-xs text-muted-foreground font-medium text-center sm:text-left">
            Showing {filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} entries
          </span>
          
          <div className="flex items-center gap-1.5">
            <button 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(prev => prev - 1)} 
              className="flex items-center justify-center h-8 w-8 rounded-lg border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
            >
              <ChevronLeft size={16} />
            </button>
            
            <div className="flex items-center gap-1 overflow-x-auto max-w-[160px] sm:max-w-none no-scrollbar">
              {[...Array(totalPages)].map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentPage(i + 1)} 
                  className={`flex items-center justify-center h-8 w-8 rounded-lg text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0 ${
                    currentPage === i + 1 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            
            <button 
              disabled={currentPage === totalPages} 
              onClick={() => setCurrentPage(prev => prev + 1)} 
              className="flex items-center justify-center h-8 w-8 rounded-lg border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}