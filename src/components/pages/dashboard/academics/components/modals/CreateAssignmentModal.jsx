"use client";

import { useState, useRef } from "react";
import { X, Plus, Paperclip, File, Image as ImageIcon, FileText } from "lucide-react";

function fileIconFor(file) {
  if (file.type.startsWith("image/")) return ImageIcon;
  if (file.type === "application/pdf") return FileText;
  return File;
}

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function CreateAssignmentModal({ onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [classSection, setClassSection] = useState("");
  const [dueStatus, setDueStatus] = useState("");
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);

  const handleFilesSelected = (fileList) => {
    const newFiles = Array.from(fileList).map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
      file,
    }));
    setAttachments((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveAttachment = (id) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newAssignment = {
      id: `ta-${Date.now()}`,
      title,
      classSection,
      dueStatus: dueStatus.toUpperCase(),
      isDueSoon: dueStatus.toLowerCase().includes("tomorrow") || dueStatus.toLowerCase().includes("today"),
      submissions: "0/45",
      // Attachments are optional reference files the teacher provides with the
      // assignment (instructions, worksheets, images, etc.) — not student submissions.
      attachments: attachments.map((a) => ({
        name: a.file.name,
        size: a.file.size,
        type: a.file.type,
      })),
    };

    onCreate(newAssignment);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-foreground">Assign New Homework / Task</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Assignment title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Organic Chemistry Worksheet 3"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Class & subject
            </label>
            <input
              type="text"
              required
              value={classSection}
              onChange={(e) => setClassSection(e.target.value)}
              placeholder="e.g. Class 10-A • Mathematics"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Due date / deadline status
            </label>
            <input
              type="text"
              required
              value={dueStatus}
              onChange={(e) => setDueStatus(e.target.value)}
              placeholder="e.g. DUE TOMORROW or DUE 28 JUL"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Attach documents <span className="font-medium text-slate-400 normal-case">(optional)</span>
            </label>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
              onChange={(e) => {
                if (e.target.files?.length) handleFilesSelected(e.target.files);
                e.target.value = "";
              }}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-primary bg-slate-50/40 dark:bg-slate-800/20 hover:bg-primary/5 transition-all py-5"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Paperclip className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-primary">Click to attach files</span>
              <span className="text-[10px] text-slate-400">Images, PDFs, docs & more</span>
            </button>

            {attachments.length > 0 && (
              <ul className="mt-3 space-y-2">
                {attachments.map((a) => {
                  const Icon = fileIconFor(a.file);
                  return (
                    <li
                      key={a.id}
                      className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 px-3 py-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="text-xs font-semibold text-foreground truncate" title={a.file.name}>
                          {a.file.name}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0">{formatFileSize(a.file.size)}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(a.id)}
                        className="p-1 rounded-md text-slate-400 hover:text-destructive hover:bg-destructive/10 transition-all shrink-0"
                        aria-label={`Remove ${a.file.name}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
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
              <span>Assign task</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}