import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { CATEGORY_LIST, ROLE_LIST, PRIORITY_LIST } from "./support.utils";

export default function CreateTicketModal({
  createOpen,
  setCreateOpen,
  draft,
  setDraft,
  handleCreateTicket,
}) {
  return (
    <AnimatePresence>
      {createOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCreateOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 w-full max-w-lg max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between p-3 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
                <p className="text-base font-display font-semibold text-foreground">
                  Create New Ticket
                </p>
                <button
                  onClick={() => setCreateOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:bg-lab(45 17.23 -55.8) hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateTicket} className="p-4 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Subject</label>
                  <input
                    type="text"
                    required
                    value={draft.subject}
                    onChange={(e) => setDraft((d) => ({ ...d, subject: e.target.value }))}
                    placeholder="e.g. Unable to access exam results"
                    className="dash-focus w-full bg-[#f5f6fb] dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 px-3 text-sm placeholder:text-slate-400 text-slate-700 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Description</label>
                  <textarea
                    rows={4}
                    value={draft.description}
                    onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                    placeholder="Describe the issue in detail..."
                    className="dash-focus w-full bg-[#f5f6fb] dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 px-3 text-sm placeholder:text-slate-400 text-slate-700 dark:text-slate-200 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Requester Name</label>
                    <input
                      type="text"
                      required
                      value={draft.requesterName}
                      onChange={(e) => setDraft((d) => ({ ...d, requesterName: e.target.value }))}
                      placeholder="Full name"
                      className="dash-focus w-full bg-[#f5f6fb] dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 px-3 text-sm placeholder:text-slate-400 text-slate-700 dark:text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Role</label>
                    <select
                      value={draft.requesterRole}
                      onChange={(e) => setDraft((d) => ({ ...d, requesterRole: e.target.value }))}
                      className="dash-focus w-full bg-[#f5f6fb] dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 px-3 text-sm text-slate-700 dark:text-slate-200"
                    >
                      {ROLE_LIST.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Category</label>
                    <select
                      value={draft.category}
                      onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
                      className="dash-focus w-full bg-[#f5f6fb] dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 px-3 text-sm text-slate-700 dark:text-slate-200"
                    >
                      {CATEGORY_LIST.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Priority</label>
                    <select
                      value={draft.priority}
                      onChange={(e) => setDraft((d) => ({ ...d, priority: e.target.value }))}
                      className="dash-focus w-full bg-[#f5f6fb] dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 px-3 text-sm text-slate-700 dark:text-slate-200"
                    >
                      {PRIORITY_LIST.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-pill-primary w-full !py-2 text-sm justify-center mt-4 font-bold cursor-pointer"
                >
                  Create Ticket
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}