"use client";

import { useState, useRef, useEffect } from "react";
import { X, UserPlus, ChevronDown, Check, Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const CLASS_GRADES = Array.from({ length: 12 }, (_, i) => String(i + 1));
const SECTIONS = ["A", "B", "C", "D", "E"];
const DEPARTMENTS = ["Science & Tech", "Humanities", "Commerce & Business"];
const SUBJECTS_POOL = [
  "Mathematics", "English", "Science", "Physics", "Chemistry",
  "Biology", "History", "Geography", "Computer Science",
  "Physical Education", "Art", "Music",
];

/* Compact select dropdown — same pattern used in CreateClassModal */
function SelectField({ label, value, displayValue, options, onChange, renderOption }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen((p) => !p)}
        className={`w-full flex items-center justify-between bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-sm font-medium text-slate-800 dark:text-slate-100 transition-all ${
          isOpen ? "border-primary ring-2 ring-primary/20" : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
        }`}
      >
        <span>{displayValue}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180 text-primary" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-30 max-h-48 overflow-y-auto py-1"
          >
            {options.map((opt) => {
              const selected = opt === value;
              return (
                <div
                  key={opt}
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between px-3.5 py-2 text-sm cursor-pointer transition-colors ${
                    selected
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60"
                  }`}
                >
                  {renderOption ? renderOption(opt) : opt}
                  {selected && <Check className="w-4 h-4" />}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AllocateTeacherModal({ onClose, onAllocate }) {
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState(DEPARTMENTS[0]);

  const [classNumber, setClassNumber] = useState(CLASS_GRADES[9]);
  const [section, setSection] = useState(SECTIONS[0]);
  const [pendingSubjects, setPendingSubjects] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const toggleSubject = (subject) => {
    setPendingSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  };

  const addAssignment = () => {
    if (pendingSubjects.length === 0) return;
    const label = `${classNumber}-${section}`;
    const newEntries = pendingSubjects
      .map((sub) => `${label} (${sub})`)
      .filter((entry) => !assignments.includes(entry));
    setAssignments([...assignments, ...newEntries]);
    setPendingSubjects([]);
  };

  const removeAssignment = (entry) => {
    setAssignments(assignments.filter((a) => a !== entry));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (assignments.length === 0) return;

    const newTeacher = {
      id: `tal-${Date.now()}`,
      name,
      designation,
      department,
      status: "ACTIVE",
      assignedClasses: assignments,
    };

    onAllocate(newTeacher);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[90vh] flex flex-col">
        {/* Fixed header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <h3 className="text-lg font-bold text-foreground">Allocate Teacher to Class</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable form body */}
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-4 overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Teacher name</label>
            <input
              type="text"
              placeholder="Enter name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Designation</label>
              <input
                type="text"
                placeholder="Enter designation"
                required
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <SelectField
              label="Department"
              value={department}
              displayValue={department}
              options={DEPARTMENTS}
              onChange={setDepartment}
            />
          </div>

          {/* Class + Section + Subject assignment builder */}
          <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mt-4 mb-2">
              Assign classes & subjects
            </label>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <SelectField
                label="Class grade"
                value={classNumber}
                displayValue={`Class ${classNumber}`}
                options={CLASS_GRADES}
                onChange={setClassNumber}
                renderOption={(opt) => `Class ${opt}`}
              />
              <SelectField
                label="Section"
                value={section}
                displayValue={`Section ${section}`}
                options={SECTIONS}
                onChange={setSection}
                renderOption={(opt) => `Section ${opt}`}
              />
            </div>

            <p className="text-[11px] text-slate-400 mb-2">
              Click subjects to teach for Class {classNumber}-{section}, then add
            </p>

            <div className="flex flex-wrap gap-2 mb-3">
              {SUBJECTS_POOL.map((subject) => {
                const selected = pendingSubjects.includes(subject);
                return (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => toggleSubject(subject)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors ${
                      selected
                        ? "bg-primary text-white border-primary"
                        : "text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary hover:bg-primary/5 hover:text-primary"
                    }`}
                  >
                    {subject} {selected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={addAssignment}
              disabled={pendingSubjects.length === 0}
              className="w-full text-xs font-bold text-primary border border-primary/30 hover:bg-primary/5 rounded-lg py-2 transition-colors disabled:opacity-40 disabled:pointer-events-none"
            >
              + Add Class {classNumber}-{section} assignment
            </button>

            {assignments.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                <AnimatePresence initial={false}>
                  {assignments.map((entry) => (
                    <motion.span
                      key={entry}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold pl-2.5 pr-1.5 py-1 rounded-lg"
                    >
                      {entry}
                      <button
                        type="button"
                        onClick={() => removeAssignment(entry)}
                        className="p-0.5 rounded hover:text-destructive transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 pb-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={assignments.length === 0}
              className="px-5 py-2.5 bg-primary hover:opacity-90 text-white font-bold text-xs rounded-full transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none"
            >
              <UserPlus className="w-4 h-4" />
              <span>Allocate faculty</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}