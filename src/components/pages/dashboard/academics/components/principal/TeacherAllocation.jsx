"use client";

import { useState, useRef, useEffect } from "react";
import { Reorder } from "framer-motion";
import { UserPlus, MoreVertical, Edit2, Trash2, X, Check, GripVertical } from "lucide-react";

export default function TeacherAllocation({ teachers: initialTeachers, onAllocateNew }) {
  const [teachers, setTeachers] = useState(initialTeachers);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleActionClick = (id, e) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const startEdit = (teacher) => {
    setEditingId(teacher.id);
    setEditForm({ ...teacher, newClass: "" });
    setOpenMenuId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const saveEdit = (id) => {
    setTeachers(teachers.map((t) => (t.id === id ? { ...editForm } : t)));
    setEditingId(null);
    setEditForm(null);
  };

  const handleDelete = (id) => {
    setTeachers(teachers.filter((t) => t.id !== id));
    setOpenMenuId(null);
  };

  const removeAssignedClass = (classToRemove) => {
    setEditForm({
      ...editForm,
      assignedClasses: editForm.assignedClasses.filter((c) => c !== classToRemove),
    });
  };

  const addAssignedClass = (e) => {
    if (e.key === "Enter" && editForm.newClass.trim() !== "") {
      e.preventDefault();
      if (!editForm.assignedClasses.includes(editForm.newClass.trim())) {
        setEditForm({
          ...editForm,
          assignedClasses: [...editForm.assignedClasses, editForm.newClass.trim()],
          newClass: "",
        });
      }
    }
  };

  return (
    <div className="dashboard-card p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-foreground tracking-tight">Teacher Allocation</h3>
          <p className="text-xs text-slate-400">Drag to reorder · faculty & subject assignments across sections</p>
        </div>
      </div>

      <Reorder.Group
        as="div"
        axis="y"
        values={teachers}
        onReorder={setTeachers}
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4"
      >
        {teachers.map((t) => (
          <Reorder.Item
            as="div"
            key={t.id}
            value={t}
            className="list-none"
            whileDrag={{ scale: 1.02, boxShadow: "0 12px 28px -8px rgba(79,70,229,0.25)", zIndex: 10 }}
          >
            <div
              className={`h-full p-5 rounded-2xl border transition-all flex flex-col gap-4 ${
                editingId === t.id
                  ? "border-primary/50 bg-primary/5 shadow-md"
                  : "border-slate-200 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800/60 hover:shadow-sm"
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 w-full min-w-0">
                  <GripVertical className="w-4 h-4 text-slate-300 cursor-grab active:cursor-grabbing shrink-0" />
                  <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-lg shrink-0">
                    {t.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    {editingId === t.id ? (
                      <div className="space-y-1.5">
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full text-sm font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-2.5 py-1.5 outline-none focus:border-primary"
                          placeholder="Teacher Name"
                        />
                        <input
                          type="text"
                          value={editForm.designation}
                          onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })}
                          className="w-full text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-2.5 py-1.5 outline-none focus:border-primary"
                          placeholder="Designation"
                        />
                      </div>
                    ) : (
                      <>
                        <h4 className="font-bold text-foreground text-sm leading-tight truncate">{t.name}</h4>
                        <p className="text-[11px] text-slate-400 font-medium truncate">{t.designation}</p>
                      </>
                    )}
                  </div>
                </div>

                {!editingId && (
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="relative" ref={openMenuId === t.id ? menuRef : null}>
                      <button
                        onClick={(e) => handleActionClick(t.id, e)}
                        className="p-1 rounded-md text-slate-400 hover:text-foreground hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {openMenuId === t.id && (
                        <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl py-1 z-20">
                          <button
                            onClick={() => startEdit(t)}
                            className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                          >
                            <Edit2 className="w-3.5 h-3.5" /> Edit Profile
                          </button>
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="w-full text-left px-4 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 flex items-center gap-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                        </div>
                      )}
                    </div>
                    <span className="bg-success/10 text-success text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {t.status}
                    </span>
                  </div>
                )}
              </div>

              {/* Assigned Classes */}
              <div className="pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Assigned Classes</p>
                <div className="flex flex-wrap gap-1.5">
                  {(editingId === t.id ? editForm.assignedClasses : t.assignedClasses).map((cls, idx) => (
                    <span
                      key={idx}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
                        editingId === t.id
                          ? "bg-white dark:bg-slate-900 border-primary/40 text-primary"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {cls}
                      {editingId === t.id && (
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-destructive transition-colors"
                          onClick={() => removeAssignedClass(cls)}
                        />
                      )}
                    </span>
                  ))}
                </div>

                {editingId === t.id && (
                  <input
                    type="text"
                    placeholder="Type class and press Enter..."
                    value={editForm.newClass}
                    onChange={(e) => setEditForm({ ...editForm, newClass: e.target.value })}
                    onKeyDown={addAssignedClass}
                    className="w-full mt-3 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 outline-none focus:border-primary"
                  />
                )}
              </div>

              {/* Edit actions */}
              {editingId === t.id && (
                <div className="flex items-center justify-end gap-2 pt-1 mt-auto">
                  <button
                    onClick={cancelEdit}
                    className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => saveEdit(t.id)}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-primary hover:bg-primary/90 rounded-lg flex items-center gap-1.5 transition-colors shadow-md shadow-primary/20"
                  >
                    <Check className="w-3.5 h-3.5" /> Save
                  </button>
                </div>
              )}
            </div>
          </Reorder.Item>
        ))}

        <button
          type="button"
          onClick={onAllocateNew}
          className="p-5 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-primary dark:hover:border-primary bg-slate-50/20 dark:bg-slate-800/10 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all flex flex-col items-center justify-center text-center min-h-[190px] group"
        >
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-primary/10 text-slate-400 group-hover:text-primary flex items-center justify-center mb-3 transition-colors">
            <UserPlus className="w-6 h-6" />
          </div>
          <span className="text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:text-primary transition-colors">
            Allocate new teacher
          </span>
          <span className="text-[11px] text-slate-400 mt-1">Assign faculty to a subject & section</span>
        </button>
      </Reorder.Group>
    </div>
  );
}