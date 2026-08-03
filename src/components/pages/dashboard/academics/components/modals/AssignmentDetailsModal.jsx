"use client";

import { useState } from "react";
import { X, Clock, CheckCircle, Upload, Paperclip } from "lucide-react";

const STATUS_META = {
  "IN PROGRESS": { label: "In progress", className: "text-primary bg-primary/10" },
  SUBMITTED: { label: "Submitted", className: "text-success bg-success/10" },
  GRADED: { label: "Graded", className: "text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300" },
};

export default function AssignmentDetailsModal({ assignment, onClose, onStatusChange }) {
  const [files, setFiles] = useState([]);
  const meta = STATUS_META[assignment.status] || STATUS_META["IN PROGRESS"];

  const handleFilesSelected = (fileList) => {
    const newFiles = Array.from(fileList).map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
      name: file.name,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleSubmit = () => {
    onStatusChange(assignment.id, "SUBMITTED");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[90vh] flex flex-col">
        {/* Fixed header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div>
            <span
              className={`inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider px-2.5 py-1 rounded-full mb-2 ${meta.className}`}
            >
              {assignment.status === "SUBMITTED" && <CheckCircle className="w-3 h-3" />}
              {assignment.status === "IN PROGRESS" && <Clock className="w-3 h-3" />}
              {meta.label}
              {assignment.status === "GRADED" && assignment.marks && (
                <span className="text-primary font-extrabold">· {assignment.marks}</span>
              )}
            </span>
            <h3 className="text-lg font-bold text-foreground leading-tight">{assignment.title}</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {assignment.subject} • {assignment.category}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto px-6 py-4 space-y-5">
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div>
              <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mb-1">Teacher</p>
              <p className="font-bold text-foreground">{assignment.teacher}</p>
            </div>
            <div>
              <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mb-1">Given</p>
              <p className="font-bold text-foreground">{assignment.givenDate}</p>
            </div>
            <div>
              <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mb-1">Deadline</p>
              <p className={`font-bold ${assignment.isUrgent ? "text-destructive" : "text-foreground"}`}>
                {assignment.deadline}
              </p>
            </div>
          </div>

          <div>
            <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mb-1.5">Instructions</p>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{assignment.description}</p>
          </div>

          {assignment.status === "IN PROGRESS" && (
            <div>
              <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mb-2">
                Attach your work <span className="normal-case font-medium">(optional)</span>
              </p>

              <input
                type="file"
                id="assignment-upload-input"
                multiple
                onChange={(e) => {
                  if (e.target.files?.length) handleFilesSelected(e.target.files);
                  e.target.value = "";
                }}
                className="hidden"
              />
              <label
                htmlFor="assignment-upload-input"
                className="flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-primary bg-slate-50/40 dark:bg-slate-800/20 hover:bg-primary/5 transition-all py-5 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-primary">Click to attach files</span>
                <span className="text-[10px] text-slate-400">PDFs, images, docs</span>
              </label>

              {files.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {files.map((f) => (
                    <li
                      key={f.id}
                      className="flex items-center gap-2 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 px-3 py-2"
                    >
                      <Paperclip className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-xs font-semibold text-foreground truncate">{f.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Fixed footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-foreground transition-colors"
          >
            Close
          </button>
          {assignment.status === "IN PROGRESS" && (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2.5 bg-primary hover:opacity-90 text-white font-bold text-xs rounded-full transition-all flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Mark as submitted</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}