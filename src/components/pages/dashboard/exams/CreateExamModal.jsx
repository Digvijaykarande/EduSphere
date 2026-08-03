// src/components/pages/dashboard/exams/CreateExamModal.jsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, BookOpen, ChevronRight, ChevronLeft, Check, CheckCircle2 } from "lucide-react";

const SUBJECTS = ["Mathematics", "Physics", "Chemistry", "Object-Oriented Software Eng.", "Full-Stack Web Dev", "Database Systems"];
const CLASS_SECTIONS = ["9-A", "9-B", "10-A", "10-B", "11-A", "11-B", "12-A", "CS-301", "CS-302"];
const EXAM_TYPES = ["Theory", "Practical", "Oral", "Project"];

const STEPS = ["Basic Details", "Classes & Schedule", "Marking Scheme", "Review"];

const emptyForm = {
  title: "",
  subject: "",
  type: "Theory",
  sections: [],
  date: "",
  startTime: "",
  endTime: "",
  room: "",
  maxMarks: 100,
  passingMarks: 40,
  weightage: 20,
  instructions: "",
};

export default function CreateExamModal({ isOpen, onClose }) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const update = (patch) => setFormData((prev) => ({ ...prev, ...patch }));

  const toggleSection = (section) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.includes(section)
        ? prev.sections.filter((s) => s !== section)
        : [...prev.sections, section],
    }));
  };

  const validateStep = () => {
    const e = {};
    if (step === 0) {
      if (!formData.title.trim()) e.title = "Give this exam a name";
      if (!formData.subject) e.subject = "Choose a subject";
    }
    if (step === 1) {
      if (formData.sections.length === 0) e.sections = "Select at least one class or section";
      if (!formData.date) e.date = "Pick a date";
      if (!formData.startTime) e.startTime = "Set a start time";
      if (!formData.endTime) e.endTime = "Set an end time";
    }
    if (step === 2) {
      if (!formData.maxMarks || formData.maxMarks <= 0) e.maxMarks = "Enter total marks";
      if (formData.passingMarks > formData.maxMarks) e.passingMarks = "Can't exceed total marks";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < STEPS.length - 1) setStep(step + 1);
  };

  const handleBack = () => setStep((s) => Math.max(0, s - 1));

  const handleSubmit = () => {
    if (!validateStep()) return;
    console.log("Creating exam:", formData);
    setSubmitted(true);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(0);
      setFormData(emptyForm);
      setErrors({});
      setSubmitted(false);
    }, 250);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            {submitted ? (
              <div className="p-10 flex flex-col items-center text-center gap-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <CheckCircle2 size={28} />
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Exam created</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                  {formData.title} is scheduled for {formData.sections.join(", ")} on {formData.date || "the selected date"}. It now appears in All Exams and the Schedule tab.
                </p>
                <button
                  onClick={handleClose}
                  className="mt-3 px-6 py-2.5 rounded-xl text-sm font-bold bg-primary text-white hover:bg-blue-600 transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Create New Exam</h2>
                    <p className="text-[11px] text-slate-500 mt-0.5">Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>
                  </div>
                  <button onClick={handleClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                    <X size={18} />
                  </button>
                </div>

                {/* Step indicator */}
                <div className="flex items-center gap-2 px-6 pt-4">
                  {STEPS.map((s, i) => (
                    <div key={s} className="flex-1 flex items-center gap-2">
                      <div
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          i <= step ? "bg-primary" : "bg-slate-200 dark:bg-slate-800"
                        }`}
                      />
                    </div>
                  ))}
                </div>

                <div className="p-6 min-h-[320px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-5"
                    >
                      {step === 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="md:col-span-2 space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase">Exam Title</label>
                            <input
                              type="text"
                              placeholder="e.g., Mid Term Examination"
                              value={formData.title}
                              onChange={(e) => update({ title: e.target.value })}
                              className={`w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none ${
                                errors.title ? "border-rose-400" : "border-slate-200 dark:border-slate-700"
                              }`}
                            />
                            {errors.title && <p className="text-[11px] text-rose-500 font-semibold">{errors.title}</p>}
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase">Subject</label>
                            <div className="relative">
                              <BookOpen size={16} className="absolute left-3 top-2.5 text-slate-400" />
                              <select
                                value={formData.subject}
                                onChange={(e) => update({ subject: e.target.value })}
                                className={`w-full bg-slate-50 dark:bg-slate-800 border rounded-xl pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none ${
                                  errors.subject ? "border-rose-400" : "border-slate-200 dark:border-slate-700"
                                }`}
                              >
                                <option value="">Select subject</option>
                                {SUBJECTS.map((s) => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                            </div>
                            {errors.subject && <p className="text-[11px] text-rose-500 font-semibold">{errors.subject}</p>}
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase">Exam Type</label>
                            <div className="flex flex-wrap gap-2">
                              {EXAM_TYPES.map((t) => (
                                <button
                                  key={t}
                                  type="button"
                                  onClick={() => update({ type: t })}
                                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
                                    formData.type === t
                                      ? "bg-primary text-white border-primary"
                                      : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                                  }`}
                                >
                                  {t}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="md:col-span-2 space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase">Instructions (optional)</label>
                            <textarea
                              rows={3}
                              placeholder="Syllabus scope, materials allowed, special notes for invigilators…"
                              value={formData.instructions}
                              onChange={(e) => update({ instructions: e.target.value })}
                              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                            />
                          </div>
                        </div>
                      )}

                      {step === 1 && (
                        <div className="space-y-5">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase">Classes & Sections</label>
                            <div className="flex flex-wrap gap-2">
                              {CLASS_SECTIONS.map((section) => {
                                const active = formData.sections.includes(section);
                                return (
                                  <button
                                    key={section}
                                    type="button"
                                    onClick={() => toggleSection(section)}
                                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                                      active
                                        ? "bg-primary/10 text-primary border-primary/30"
                                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500"
                                    }`}
                                  >
                                    {active && <Check size={12} />} {section}
                                  </button>
                                );
                              })}
                            </div>
                            {errors.sections && <p className="text-[11px] text-rose-500 font-semibold">{errors.sections}</p>}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-slate-500 uppercase">Date</label>
                              <div className="relative">
                                <Calendar size={16} className="absolute left-3 top-2.5 text-slate-400" />
                                <input
                                  type="date"
                                  value={formData.date}
                                  onChange={(e) => update({ date: e.target.value })}
                                  className={`w-full bg-slate-50 dark:bg-slate-800 border rounded-xl pl-9 pr-3 py-2 text-sm outline-none ${
                                    errors.date ? "border-rose-400" : "border-slate-200 dark:border-slate-700"
                                  }`}
                                />
                              </div>
                              {errors.date && <p className="text-[11px] text-rose-500 font-semibold">{errors.date}</p>}
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-slate-500 uppercase">Room / Venue</label>
                              <input
                                type="text"
                                placeholder="e.g., Room 204"
                                value={formData.room}
                                onChange={(e) => update({ room: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm outline-none"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-slate-500 uppercase">Start Time</label>
                              <div className="relative">
                                <Clock size={16} className="absolute left-3 top-2.5 text-slate-400" />
                                <input
                                  type="time"
                                  value={formData.startTime}
                                  onChange={(e) => update({ startTime: e.target.value })}
                                  className={`w-full bg-slate-50 dark:bg-slate-800 border rounded-xl pl-9 pr-3 py-2 text-sm outline-none ${
                                    errors.startTime ? "border-rose-400" : "border-slate-200 dark:border-slate-700"
                                  }`}
                                />
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-slate-500 uppercase">End Time</label>
                              <div className="relative">
                                <Clock size={16} className="absolute left-3 top-2.5 text-slate-400" />
                                <input
                                  type="time"
                                  value={formData.endTime}
                                  onChange={(e) => update({ endTime: e.target.value })}
                                  className={`w-full bg-slate-50 dark:bg-slate-800 border rounded-xl pl-9 pr-3 py-2 text-sm outline-none ${
                                    errors.endTime ? "border-rose-400" : "border-slate-200 dark:border-slate-700"
                                  }`}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {step === 2 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase">Max Marks</label>
                            <input
                              type="number"
                              min={1}
                              value={formData.maxMarks}
                              onChange={(e) => update({ maxMarks: Number(e.target.value) })}
                              className={`w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-sm outline-none font-mono ${
                                errors.maxMarks ? "border-rose-400" : "border-slate-200 dark:border-slate-700"
                              }`}
                            />
                            {errors.maxMarks && <p className="text-[11px] text-rose-500 font-semibold">{errors.maxMarks}</p>}
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase">Passing Marks</label>
                            <input
                              type="number"
                              min={0}
                              value={formData.passingMarks}
                              onChange={(e) => update({ passingMarks: Number(e.target.value) })}
                              className={`w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-sm outline-none font-mono ${
                                errors.passingMarks ? "border-rose-400" : "border-slate-200 dark:border-slate-700"
                              }`}
                            />
                            {errors.passingMarks && <p className="text-[11px] text-rose-500 font-semibold">{errors.passingMarks}</p>}
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase">Weightage in Final Grade (%)</label>
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={formData.weightage}
                              onChange={(e) => update({ weightage: Number(e.target.value) })}
                              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm outline-none font-mono"
                            />
                          </div>
                          <div className="md:col-span-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                            Students will need <span className="font-bold text-slate-700 dark:text-slate-300">{formData.passingMarks}/{formData.maxMarks}</span> to pass, and this exam contributes <span className="font-bold text-slate-700 dark:text-slate-300">{formData.weightage}%</span> to the final subject grade.
                          </div>
                        </div>
                      )}

                      {step === 3 && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <SummaryRow label="Title" value={formData.title || "—"} />
                            <SummaryRow label="Subject" value={formData.subject || "—"} />
                            <SummaryRow label="Type" value={formData.type} />
                            <SummaryRow label="Sections" value={formData.sections.join(", ") || "—"} />
                            <SummaryRow label="Date" value={formData.date || "—"} />
                            <SummaryRow label="Time" value={formData.startTime && formData.endTime ? `${formData.startTime} – ${formData.endTime}` : "—"} />
                            <SummaryRow label="Room" value={formData.room || "—"} />
                            <SummaryRow label="Marks" value={`${formData.passingMarks} / ${formData.maxMarks} to pass`} />
                            <SummaryRow label="Weightage" value={`${formData.weightage}% of final grade`} />
                          </div>
                          {formData.instructions && (
                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                              {formData.instructions}
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={step === 0 ? handleClose : handleBack}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    {step > 0 && <ChevronLeft size={16} />} {step === 0 ? "Cancel" : "Back"}
                  </button>
                  {step < STEPS.length - 1 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-bold bg-primary text-white hover:bg-blue-600"
                    >
                      Next <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-bold bg-primary text-white hover:bg-blue-600"
                    >
                      <Check size={16} /> Create Exam
                    </button>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{label}</p>
      <p className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-0.5">{value}</p>
    </div>
  );
}