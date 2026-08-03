"use client";

import { useState, useRef, useEffect } from "react";
import { X, Plus, ChevronDown, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const CLASS_GRADES = Array.from({ length: 12 }, (_, i) => String(i + 1));
const SECTIONS = ["A", "B", "C", "D", "E"];
const ROOMS = ["R-101", "R-102", "R-103", "R-204", "R-205", "LAB-1", "LAB-2"];
const SUBJECTS_POOL = [
  "Mathematics", "English", "Science", "Physics", "Chemistry",
  "Biology", "History", "Geography", "Computer Science",
  "Physical Education", "Art", "Music",
];

/* Compact select dropdown matching the dashboard's existing form-field style */
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

export default function CreateClassModal({ onClose, onCreate }) {
  const [classNumber, setClassNumber] = useState(CLASS_GRADES[9]);
  const [section, setSection] = useState(SECTIONS[0]);
  const [room, setRoom] = useState(ROOMS[0]);
  const [seats, setSeats] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const maxSubjects = 16;
  const remaining = maxSubjects - selectedSubjects.length;

  const toggleSubject = (subject) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
    } else if (selectedSubjects.length < maxSubjects) {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const subs = selectedSubjects.map((s) => s.charAt(0).toUpperCase());

    const newClass = {
      id: `cs-${Date.now()}`,
      classNumber,
      section,
      room,
      subjects: subs.slice(0, 3),
      extraSubjectsCount: Math.max(0, subs.length - 3),
      seatsText: `${seats || 40} Seats`,
      seatsStatus: "available",
    };

    onCreate(newClass);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-foreground">Create New Class Section</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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

          <div className="grid grid-cols-2 gap-4">
            <SelectField label="Room number" value={room} displayValue={room} options={ROOMS} onChange={setRoom} />
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Seat capacity</label>
              <input
                type="number"
                min="1"
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
                placeholder="e.g. 40"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* LinkedIn-style subject picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Subjects</label>

            {selectedSubjects.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                <AnimatePresence initial={false}>
                  {selectedSubjects.map((sub) => (
                    <motion.span
                      key={sub}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-1 bg-primary text-white text-xs font-semibold pl-2.5 pr-1.5 py-1 rounded-full"
                    >
                      {sub}
                      <button
                        type="button"
                        onClick={() => toggleSubject(sub)}
                        className="p-0.5 rounded-full hover:bg-white/20 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
            )}

            <p className="text-[11px] text-slate-400 mb-2">
              Click to add · {remaining} more subject{remaining === 1 ? "" : "s"} allowed
            </p>

            <div className="flex flex-wrap gap-2">
              {SUBJECTS_POOL.filter((s) => !selectedSubjects.includes(s)).map((subject) => (
                <button
                  key={subject}
                  type="button"
                  onClick={() => toggleSubject(subject)}
                  disabled={remaining === 0}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-primary hover:bg-primary/5 hover:text-primary disabled:opacity-40 disabled:pointer-events-none transition-colors"
                >
                  {subject} <Plus className="w-3 h-3" />
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-primary hover:opacity-90 text-white font-bold text-xs rounded-full transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create section</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}