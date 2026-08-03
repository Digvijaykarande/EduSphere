"use client";

import { useState, useEffect } from "react";
import { Reorder } from "framer-motion";
import { Plus, Trash2, Edit, Save, X, ChevronLeft, ChevronRight } from "lucide-react";

const STORAGE_KEY = "class_subject_maintenance_order";

const SUBJECTS_POOL = [
  "Mathematics", "English", "Science", "Physics", "Chemistry",
  "Biology", "History", "Geography", "Computer Science",
  "Physical Education", "Art", "Music",
];

// Pulls trailing digits out of a room string like "R-101" -> "101"
const roomDigits = (room) => (room || "").replace(/\D/g, "");
// Pulls leading digits out of a seats string like "32/40 Seats" -> "40"
const seatDigits = (seatsText) => (seatsText || "").match(/\d+/)?.[0] || "";

function SubjectTooltip({ children, label }) {
  return (
    <div className="group/tip relative">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 hidden group-hover/tip:flex flex-col items-center z-20 opacity-0 group-hover/tip:opacity-100 translate-y-1 group-hover/tip:translate-y-0 transition-all duration-150">
        <span className="flex items-center gap-1.5 bg-white dark:bg-slate-800 text-foreground text-[11px] font-semibold py-1.5 px-3 rounded-lg whitespace-normal text-center shadow-xl border border-slate-100 dark:border-slate-700 max-w-[220px]">
          {label}
        </span>
        <span className="w-2 h-2 -mt-1 rotate-45 bg-white dark:bg-slate-800 border-r border-b border-slate-100 dark:border-slate-700" />
      </div>
    </div>
  );
}

export default function ClassSubjectMaintenance({ classes: initialClasses, onNewClass, onDeleteClass }) {
  const [classes, setClasses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [hasMounted, setHasMounted] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // 1. Initialize state safely from LocalStorage on client mount
  useEffect(() => {
    setHasMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setClasses(JSON.parse(saved));
      } else {
        setClasses(initialClasses || []);
      }
    } catch (e) {
      console.error("Failed to load classes from localStorage:", e);
      setClasses(initialClasses || []);
    }
  }, [initialClasses]);

  // 2. Persist state changes back to LocalStorage
  const updateClassesState = (updatedClasses) => {
    setClasses(updatedClasses);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedClasses));
    } catch (e) {
      console.error("Failed to save classes to localStorage:", e);
    }
  };

  // Pagination Calculations
  const totalPages = Math.max(1, Math.ceil(classes.length / ITEMS_PER_PAGE));

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [classes.length, currentPage, totalPages]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentClasses = classes.slice(startIndex, endIndex);

  // Handle Drag-and-Drop Reorder
  const handleReorder = (newOrder) => {
    const newClasses = [...classes];
    newClasses.splice(startIndex, ITEMS_PER_PAGE, ...newOrder);
    updateClassesState(newClasses);
  };

  const startEdit = (c) => {
    setEditingId(c.id);
    setEditForm({
      room: roomDigits(c.room),
      seats: seatDigits(c.seatsText),
      subjects: [...c.subjects],
    });
  };

  const toggleEditSubject = (subject) => {
    setEditForm((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject],
    }));
  };

  const saveEdit = (id) => {
    const updated = classes.map((c) =>
      c.id === id
        ? {
            ...c,
            room: `R-${editForm.room}`,
            seatsText: `${editForm.seats} Seats`,
            subjects: editForm.subjects,
          }
        : c
    );
    updateClassesState(updated);
    setEditingId(null);
  };

  const localDelete = (id) => {
    const updated = classes.filter((c) => c.id !== id);
    updateClassesState(updated);
    if (onDeleteClass) onDeleteClass(id);
  };

  if (!hasMounted) {
    return null;
  }

  return (
    <div className="dashboard-card p-6 flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-foreground tracking-tight">Class & Subject Maintenance</h3>
          <p className="text-xs text-slate-400">Drag rows to reorder · manage sections, timetables, and subjects</p>
        </div>

        <button onClick={onNewClass} className="btn-pill-primary !px-4 !py-2.5 !text-xs gap-2 self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          <span>New class</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="pb-3 pl-1">Class & section</th>
              <th className="pb-3 px-3">Room</th>
              <th className="pb-3 px-3">Subjects</th>
              <th className="pb-3 px-3">Seats</th>
              <th className="pb-3 pr-4 text-center">Actions</th>
            </tr>
          </thead>
          <Reorder.Group as="tbody" axis="y" values={currentClasses} onReorder={handleReorder} className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {currentClasses.map((c) => {
              const visibleSubjects = c.subjects.slice(0, 3);
              const hiddenSubjects = c.subjects.slice(3);

              return (
                <Reorder.Item
                  as="tr"
                  key={c.id}
                  value={c}
                  className={`${editingId === c.id ? "bg-slate-50 dark:bg-slate-800/80" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"} transition-colors align-top`}
                  whileDrag={{ scale: 1.01, backgroundColor: "rgba(79,70,229,0.05)" }}
                >
                  <td className="py-4 pl-1 pr-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary font-black text-xs flex items-center justify-center shrink-0 cursor-grab active:cursor-grabbing">
                        {c.classNumber}
                      </span>
                      <span className="font-bold text-foreground">
                        Class {c.classNumber} - {c.section}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-3">
                    {editingId === c.id ? (
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-slate-400">R-</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={editForm.room}
                          onChange={(e) => setEditForm({ ...editForm, room: e.target.value.replace(/\D/g, "") })}
                          className="w-16 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-2 py-1.5 outline-none focus:border-primary"
                        />
                      </div>
                    ) : (
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{c.room}</span>
                    )}
                  </td>

                  <td className="py-4 px-3 max-w-[260px]">
                    {editingId === c.id ? (
                      <div>
                        {editForm.subjects.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {editForm.subjects.map((sub) => (
                              <span
                                key={sub}
                                className="flex items-center gap-1 bg-primary text-white text-[11px] font-semibold pl-2 pr-1 py-0.5 rounded-full"
                              >
                                {sub}
                                <button
                                  type="button"
                                  onClick={() => toggleEditSubject(sub)}
                                  className="p-0.5 rounded-full hover:bg-white/20 transition-colors"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex flex-wrap gap-1.5">
                          {SUBJECTS_POOL.filter((s) => !editForm.subjects.includes(s)).map((subject) => (
                            <button
                              key={subject}
                              type="button"
                              onClick={() => toggleEditSubject(subject)}
                              className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:border-primary hover:bg-primary/5 hover:text-primary transition-colors"
                            >
                              {subject} <Plus className="w-2.5 h-2.5" />
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {visibleSubjects.map((sub, idx) => (
                          <SubjectTooltip key={idx} label={sub}>
                            <span className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[10px] flex items-center justify-center uppercase cursor-default transition-all group-hover/tip:border-primary group-hover/tip:bg-primary/10 group-hover/tip:text-primary group-hover/tip:-translate-y-0.5">
                              {sub.charAt(0)}
                            </span>
                          </SubjectTooltip>
                        ))}
                        {hiddenSubjects.length > 0 && (
                          <SubjectTooltip label={hiddenSubjects.join(", ")}>
                            <span className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 font-bold text-[9px] flex items-center justify-center transition-all group-hover/tip:border-primary group-hover/tip:bg-primary/10 group-hover/tip:text-primary group-hover/tip:-translate-y-0.5">
                              +{hiddenSubjects.length}
                            </span>
                          </SubjectTooltip>
                        )}
                      </div>
                    )}
                  </td>

                  <td className="py-4 px-3">
                    {editingId === c.id ? (
                      <input
                        type="text"
                        inputMode="numeric"
                        value={editForm.seats}
                        onChange={(e) => setEditForm({ ...editForm, seats: e.target.value.replace(/\D/g, "") })}
                        className="w-16 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-2 py-1.5 outline-none focus:border-primary"
                      />
                    ) : (
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          c.seatsStatus === "full" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                        }`}
                      >
                        {c.seatsText}
                      </span>
                    )}
                  </td>

                  <td className="py-4 pr-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {editingId === c.id ? (
                        <>
                          <button onClick={() => saveEdit(c.id)} className="p-1.5 rounded-lg text-success hover:bg-success/10 transition-all">
                            <Save className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEdit(c)} className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-all">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => localDelete(c.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-destructive hover:bg-destructive/10 transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
        </table>
      </div>

      {/* Pagination Section */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          Showing <span className="text-foreground">{classes.length > 0 ? startIndex + 1 : 0}</span> to <span className="text-foreground">{Math.min(endIndex, classes.length)}</span> of <span className="text-foreground">{classes.length}</span> entries
        </span>

        <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/50 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg text-slate-500 hover:text-foreground hover:bg-white dark:hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                currentPage === page
                  ? "bg-white dark:bg-slate-700 text-primary shadow-sm border border-slate-200 dark:border-slate-600"
                  : "text-slate-500 hover:text-foreground hover:bg-white dark:hover:bg-slate-700 border border-transparent"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg text-slate-500 hover:text-foreground hover:bg-white dark:hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}