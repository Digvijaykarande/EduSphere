"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { X } from "lucide-react";

/**
 * Responsive dialog: a bottom sheet on phones, a centred card on larger screens.
 * Only mount it while open (render it conditionally).
 */
export default function Sheet({ title, subtitle, leading, onClose, children, maxWidth = "sm:max-w-md" }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center sm:p-6">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}
        onClick={onClose} aria-hidden="true"
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
      />
      <motion.div
        role="dialog" aria-modal="true" aria-label={title}
        initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, ease: "easeOut" }}
        className={`relative w-full ${maxWidth} max-h-[88vh] flex flex-col bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl`}
      >
        <div className="sm:hidden mx-auto mt-2 h-1 w-9 rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="flex items-center gap-3 px-4 sm:px-5 pt-3 sm:pt-4 pb-3 shrink-0">
          {leading}
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-display font-bold text-foreground tracking-tight truncate">{title}</h2>
            {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Close"
            className="h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-foreground cursor-pointer">
            <X size={16} />
          </button>
        </div>
        <div className="px-4 sm:px-5 pb-4 overflow-y-auto" style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}>
          {children}
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}
