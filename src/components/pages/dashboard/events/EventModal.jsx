import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Trash2, Clock, MapPin } from "lucide-react";
import { CATEGORY_LIST, CATEGORY_META, toKey, formatDayLabel } from "./events.utils";

export default function EventModal({
  modalDate,
  closeModal,
  eventsByDate,
  deleteEvent,
  handleAddEvent,
  draft,
  setDraft,
}) {
  return (
    <AnimatePresence>
      {modalDate && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 w-full max-w-md max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900">
                <div>
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">Events on</p>
                  <p className="text-sm font-display font-semibold text-foreground">{formatDayLabel(modalDate)}</p>
                </div>
                <button onClick={closeModal} className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="p-5 space-y-2.5">
                {(eventsByDate[toKey(modalDate)] || []).length === 0 && (
                  <p className="text-xs text-slate-400 dark:text-slate-500">No events yet — add the first one below.</p>
                )}
                {(eventsByDate[toKey(modalDate)] || []).map((ev) => (
                  <div key={ev.id} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="h-2.5 w-2.5 rounded-full mt-1.5 shrink-0" style={{ background: CATEGORY_META[ev.category].dot }} />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{ev.title}</p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1"><Clock size={12} /> {ev.start}{ev.end ? ` – ${ev.end}` : ""}</span>
                        <span className="flex items-center gap-1"><MapPin size={12} /> {ev.location}</span>
                      </div>
                    </div>
                    <button onClick={() => deleteEvent(ev.id)} className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddEvent} className="p-5 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">Add an event</p>
                <input
                  type="text"
                  required
                  value={draft.title}
                  onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                  placeholder="Event title"
                  className="dash-focus w-full bg-[#f5f6fb] dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg py-2 px-3 text-sm placeholder:text-slate-400 text-foreground"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={draft.start}
                    onChange={(e) => setDraft((d) => ({ ...d, start: e.target.value }))}
                    placeholder="Start (e.g. 10:00 AM)"
                    className="dash-focus w-full bg-[#f5f6fb] dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg py-2 px-3 text-sm placeholder:text-slate-400 text-foreground"
                  />
                  <input
                    type="text"
                    value={draft.end}
                    onChange={(e) => setDraft((d) => ({ ...d, end: e.target.value }))}
                    placeholder="End (optional)"
                    className="dash-focus w-full bg-[#f5f6fb] dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg py-2 px-3 text-sm placeholder:text-slate-400 text-foreground"
                  />
                </div>
                <input
                  type="text"
                  value={draft.location}
                  onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))}
                  placeholder="Location"
                  className="dash-focus w-full bg-[#f5f6fb] dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg py-2 px-3 text-sm placeholder:text-slate-400 text-foreground"
                />
                <select
                  value={draft.category}
                  onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
                  className="dash-focus w-full bg-[#f5f6fb] dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg py-2 px-3 text-sm text-foreground"
                >
                  {CATEGORY_LIST.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <button type="submit" className="btn-pill-primary w-full !py-2.5 text-sm justify-center mt-2">
                  Save Event
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}