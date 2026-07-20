import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Eye, EyeOff } from "lucide-react";
import { inputClass } from "./profile.utils";

export default function PasswordModal({
  passwordOpen,
  setPasswordOpen,
  passwordForm,
  setPasswordForm,
  passwordError,
  showPw,
  setShowPw,
  handlePasswordSubmit,
}) {
  return (
    <AnimatePresence>
      {passwordOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPasswordOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
            style={{height:"100vh"}}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 w-full max-w-sm overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <p className="text-base font-display font-semibold text-foreground">
                  Change Password
                </p>
                <button
                  onClick={() => setPasswordOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
                {["current", "next", "confirm"].map((key) => (
                  <div key={key}>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 block">
                      {key === "current"
                        ? "Current Password"
                        : key === "next"
                        ? "New Password"
                        : "Confirm New Password"}
                    </label>
                    <div className="relative">
                      <input
                        type={showPw ? "text" : "password"}
                        value={passwordForm[key]}
                        onChange={(e) =>
                          setPasswordForm((p) => ({ ...p, [key]: e.target.value }))
                        }
                        className={`${inputClass} pr-10`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                      >
                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                ))}

                {passwordError && (
                  <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 pt-1">
                    {passwordError}
                  </p>
                )}

                <button
                  type="submit"
                  className="btn-pill-primary w-full !py-3 text-sm justify-center mt-2 font-bold"
                >
                  Update Password
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}