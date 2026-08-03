"use client";

import { useState, useEffect } from "react";
import { Reorder, AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  Landmark,
  Shapes,
  ChevronRight,
  Edit3,
  Save,
  X,
  Trash2,
  GripVertical,
  Layers,
  Users,
  BookOpen,
} from "lucide-react";

const STORAGE_KEY = "academic_structure_wings_order";

function WingIcon({ iconName }) {
  if (iconName === "building") return <Building2 className="w-5 h-5 text-primary" />;
  if (iconName === "landmark") return <Landmark className="w-5 h-5 text-success" />;
  return <Shapes className="w-5 h-5 text-violet-500" />;
}

export default function AcademicStructure({ wings: initialWings, onDeleteWing }) {
  const [isEditing, setIsEditing] = useState(false);
  const [wings, setWings] = useState([]);
  const [activeWingId, setActiveWingId] = useState(null);
  const [hasMounted, setHasMounted] = useState(false);

  // 1. Load persisted data safely after client mount
  useEffect(() => {
    setHasMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setWings(JSON.parse(saved));
      } else {
        setWings(initialWings || []);
      }
    } catch (e) {
      console.error("Failed to load wings from localStorage:", e);
      setWings(initialWings || []);
    }
  }, [initialWings]);

  // Helper to sync local state with LocalStorage
  const updateWingsState = (updatedWings) => {
    setWings(updatedWings);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedWings));
    } catch (e) {
      console.error("Failed to save wings to localStorage:", e);
    }
  };

  // Reorder handler for drag-and-drop
  const handleReorder = (newOrder) => {
    updateWingsState(newOrder);
  };

  const handleWingChange = (id, field, value) => {
    const updated = wings.map((w) => (w.id === id ? { ...w, [field]: value } : w));
    updateWingsState(updated);
  };

  const handleDelete = (id) => {
    const updated = wings.filter((w) => w.id !== id);
    updateWingsState(updated);
    if (activeWingId === id) setActiveWingId(null);
    onDeleteWing?.(id);
  };

  // Prevent SSR/hydration mismatches by returning null during server render
  if (!hasMounted) {
    return null;
  }

  return (
    <div className="dashboard-card p-6 space-y-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-foreground tracking-tight">Academic Structure</h3>
            <p className="text-xs text-slate-400">Drag to reorder wings, click to view details</p>
          </div>
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-all flex items-center gap-1.5 text-xs font-bold"
            >
              <Edit3 className="w-4 h-4" /> Edit
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-lg text-success hover:bg-success/10 transition-all flex items-center gap-1.5 text-xs font-bold"
              >
                <Save className="w-4 h-4" /> Save
              </button>
            </div>
          )}
        </div>

        <Reorder.Group axis="y" values={wings} onReorder={handleReorder} className="space-y-3 mb-8">
          {wings.map((wing) => (
            <Reorder.Item
              key={wing.id}
              value={wing}
              className="list-none"
              whileDrag={{ scale: 1.02, boxShadow: "0 12px 28px -8px rgba(79,70,229,0.25)" }}
            >
              <div
                className={`rounded-xl border transition-all group ${
                  isEditing
                    ? "border-primary/30 bg-primary/5"
                    : activeWingId === wing.id
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800/60 hover:shadow-sm"
                }`}
              >
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 w-full">
                    {isEditing && (
                      <GripVertical className="w-4 h-4 text-slate-300 cursor-grab active:cursor-grabbing shrink-0" />
                    )}
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                      <WingIcon iconName={wing.iconName} />
                    </div>
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => !isEditing && setActiveWingId(wing.id === activeWingId ? null : wing.id)}
                    >
                      {isEditing ? (
                        <div className="space-y-2 w-full pr-4">
                          <input
                            type="text"
                            value={wing.name}
                            onChange={(e) => handleWingChange(wing.id, "name", e.target.value)}
                            className="w-full text-sm font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 outline-none focus:border-primary"
                          />
                          <input
                            type="text"
                            value={wing.classes}
                            onChange={(e) => handleWingChange(wing.id, "classes", e.target.value)}
                            className="w-full text-xs text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 outline-none focus:border-primary"
                          />
                        </div>
                      ) : (
                        <>
                          <h4 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">
                            {wing.name}
                          </h4>
                          <span className="text-xs text-slate-400 font-medium">{wing.classes}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {isEditing ? (
                    <button
                      type="button"
                      onClick={() => handleDelete(wing.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-destructive hover:bg-destructive/10 transition-all shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  ) : (
                    <ChevronRight
                      onClick={() => setActiveWingId(wing.id === activeWingId ? null : wing.id)}
                      className={`w-4 h-4 transition-all cursor-pointer shrink-0 ${
                        activeWingId === wing.id
                          ? "text-primary rotate-90"
                          : "text-slate-400 group-hover:text-primary group-hover:translate-x-0.5"
                      }`}
                    />
                  )}
                </div>

                <AnimatePresence>
                  {!isEditing && activeWingId === wing.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-1 grid grid-cols-3 gap-2">
                        <div
                          className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2.5 text-center"
                          style={{ borderRadius: "10px" }}
                        >
                          <Layers className="w-3.5 h-3.5 text-primary mx-auto mb-1" />
                          <p className="text-xs font-black text-foreground">{wing.sectionsCount ?? "—"}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase">Sections</p>
                        </div>
                        <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2.5 text-center">
                          <Users className="w-3.5 h-3.5 text-success mx-auto mb-1" />
                          <p className="text-xs font-black text-foreground">{wing.studentsCount ?? "—"}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase">Students</p>
                        </div>
                        <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2.5 text-center">
                          <BookOpen className="w-3.5 h-3.5 text-violet-500 mx-auto mb-1" />
                          <p className="text-xs font-black text-foreground">{wing.subjectsCount ?? "—"}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase">Subjects</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>
    </div>
  );
}