"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, Calendar, FileText, Send, User, Hash } from "lucide-react";

export default function StudentLeaveForm() {
  const [status, setStatus] = useState("idle"); // "idle" | "submitting" | "success"
  const [formData, setFormData] = useState({
    studentName: "",
    rollNo: "",
    dateFrom: "",
    dateTo: "",
    reason: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.studentName.trim() ||
      !formData.rollNo.trim() ||
      !formData.dateFrom ||
      !formData.dateTo ||
      !formData.reason.trim()
    ) {
      return;
    }
    
    setStatus("submitting");
    
    // Simulate a network request delay for UX
    setTimeout(() => {
      setStatus("success");
    }, 1500);
  };

  const handleReset = () => {
    setFormData({ studentName: "", rollNo: "", dateFrom: "", dateTo: "", reason: "" });
    setStatus("idle");
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-3 flex flex-col h-full relative overflow-hidden">
      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Leave Application</h3>
      
      <div className="relative flex-1 flex flex-col justify-center min-h-[325px]">
        <AnimatePresence mode="wait">
          
          {/* STATE 1: FORM ENTRY */}
          {status !== "success" && (
            <motion.form 
              key="form"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit} 
              className="space-y-4"
            >
              {/* Identity Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 mb-1.5 block tracking-wider">
                    Student Name
                  </label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      required
                      disabled={status === "submitting"}
                      value={formData.studentName}
                      onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                      placeholder="Full Name" 
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl py-2 pl-9 pr-3 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-60" 
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 mb-1.5 block tracking-wider">
                    Roll No
                  </label>
                  <div className="relative">
                    <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      required
                      disabled={status === "submitting"}
                      value={formData.rollNo}
                      onChange={(e) => setFormData({...formData, rollNo: e.target.value})}
                      placeholder="e.g. 101" 
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl py-2 pl-9 pr-3 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-60" 
                    />
                  </div>
                </div>
              </div>

              {/* Date Range Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-bold uppercase text-slate-400 dark:text-slate-500 mb-1.5 block tracking-wider">
                    Date From
                  </label>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input 
                      type="date" 
                      required
                      disabled={status === "submitting"}
                      value={formData.dateFrom}
                      onChange={(e) => setFormData({...formData, dateFrom: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl py-2 pl-9 pr-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-60 cursor-pointer" 
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 mb-1.5 block tracking-wider">
                    Date To
                  </label>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input 
                      type="date" 
                      required
                      disabled={status === "submitting"}
                      value={formData.dateTo}
                      onChange={(e) => setFormData({...formData, dateTo: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl py-2 pl-9 pr-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-60 cursor-pointer" 
                    />
                  </div>
                </div>
              </div>
              
              {/* Reason Field */}
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 mb-1.5 block tracking-wider">
                  Reason
                </label>
                <div className="relative">
                  <FileText size={14} className="absolute left-3 top-3 text-slate-400" />
                  <textarea 
                    rows="3" 
                    required
                    disabled={status === "submitting"}
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    placeholder="Brief explanation..." 
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl py-2 pl-9 pr-3 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none transition-all disabled:opacity-60"
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={status === "submitting"}
                className="w-full bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-80 disabled:cursor-not-allowed shadow-sm shadow-slate-900/10 dark:shadow-indigo-600/20 active:scale-[0.98]"
              >
                {status === "submitting" ? (
                  <><Loader2 size={16} className="animate-spin" /> Submitting...</>
                ) : (
                  <><Send size={15} /> Submit Request</>
                )}
              </button>
            </motion.form>
          )}

          {/* STATE 2: SUCCESS RESULT */}
          {status === "success" && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 20 }}
                className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4 shadow-sm"
              >
                <CheckCircle2 size={24} strokeWidth={2.5} />
              </motion.div>
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
                Request Submitted
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[200px] mb-6">
                Your leave application has been sent to your class teacher for approval.
              </p>
              <button 
                onClick={handleReset}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 py-2 px-4 rounded-lg transition-colors cursor-pointer"
              >
                Submit Another Request
              </button>
            </motion.div>
          )}
          
        </AnimatePresence>
      </div>
    </div>
  );
}