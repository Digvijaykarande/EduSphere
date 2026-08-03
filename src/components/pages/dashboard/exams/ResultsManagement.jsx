// src/components/pages/dashboard/exams/ResultsManagement.jsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Clock, FileSpreadsheet, Send, Loader2 } from "lucide-react";
import { resultsQueue } from "./mockData";

const STATUS_STYLE = {
  Published: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Processing: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  "Not Started": "bg-slate-200/60 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
};

export default function ResultsManagement() {
  const [results, setResults] = useState(resultsQueue);
  const [publishingId, setPublishingId] = useState(null);
  const [toast, setToast] = useState(null);

  const handlePublish = (id) => {
    setPublishingId(id);
    // Simulate a short publish step so the action feels real, then flip status
    setTimeout(() => {
      setResults((prev) => prev.map((r) => (r.id === id ? { ...r, status: "Published" } : r)));
      setPublishingId(null);
      setToast("Results published — visible to students and parents now.");
      setTimeout(() => setToast(null), 3000);
    }, 900);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Results Management</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Track marks entry progress and publish results to students</p>
        </div>
        <button className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 text-xs font-bold px-4 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <FileSpreadsheet size={14} /> Export Summary
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 font-bold uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-5">Exam</th>
              <th className="py-3.5 px-5">Class</th>
              <th className="py-3.5 px-5 w-56">Marks Entered</th>
              <th className="py-3.5 px-5">Status</th>
              <th className="py-3.5 px-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {results.map((r) => {
              const pct = r.total ? Math.round((r.entered / r.total) * 100) : 0;
              const ready = pct === 100 && r.status !== "Published";
              return (
                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="py-3.5 px-5">
                    <p className="font-bold text-slate-800 dark:text-slate-100">{r.title}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{r.subject} • {r.date}</p>
                  </td>
                  <td className="py-3.5 px-5 font-semibold text-slate-600 dark:text-slate-300">{r.class}</td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${pct === 100 ? "bg-emerald-500" : "bg-primary"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-500 w-16 text-right">
                        {r.entered}/{r.total}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${STATUS_STYLE[r.status]}`}>
                      {r.status === "Published" && <CheckCircle2 size={11} />}
                      {r.status === "Processing" && <Clock size={11} />}
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    {r.status === "Published" ? (
                      <span className="text-[10px] text-slate-400 font-semibold">Published to students</span>
                    ) : (
                      <button
                        disabled={!ready || publishingId === r.id}
                        onClick={() => handlePublish(r.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-primary text-white hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        title={!ready ? "All marks must be entered before publishing" : "Publish results"}
                      >
                        {publishingId === r.id ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                        {publishingId === r.id ? "Publishing…" : "Publish"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 z-50"
          >
            <CheckCircle2 size={14} className="text-emerald-400" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}