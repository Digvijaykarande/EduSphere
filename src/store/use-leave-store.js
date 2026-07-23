import { create } from "zustand";

let seq = 0;
const nextId = () => `LR-${Date.now()}-${seq++}`;

export const useLeaveStore = create((set) => ({
  studentLeaves: [
    { id: nextId(), name: "Mayur Mehta", role: "Student", section: "10-A", from: "2026-07-24", to: "2026-07-25", reason: "Fever", status: "Pending" },
  ],
  teacherLeaves: [],

  submitStudentLeave: (req) =>
    set((s) => ({ studentLeaves: [{ ...req, id: nextId(), status: "Pending" }, ...s.studentLeaves] })),
  actOnStudentLeave: (id, status) =>
    set((s) => ({ studentLeaves: s.studentLeaves.map((r) => (r.id === id ? { ...r, status } : r)) })),

  submitTeacherLeave: (req) =>
    set((s) => ({ teacherLeaves: [{ ...req, id: nextId(), status: "Pending" }, ...s.teacherLeaves] })),
  actOnTeacherLeave: (id, status) =>
    set((s) => ({ teacherLeaves: s.teacherLeaves.map((r) => (r.id === id ? { ...r, status } : r)) })),
}));
