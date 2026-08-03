"use client";

import { useState } from "react";
import { BookOpen, Plus, Clock, Calendar, Tag, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const INITIAL_ENTRIES = [
  {
    id: 1,
    date: "Today",
    time: "2:30 PM",
    content: "Studied about Light Reflection in Physics. It was interesting to learn about how light bounces back from different surfaces.",
    duration: "1h 20m",
    tags: ["Physics", "Reflection"],
  },
  {
    id: 2,
    date: "Yesterday",
    time: "6:15 PM",
    content: "Solved 15 questions on Quadratic Equations. Also revised the formulas and did extra practice questions.",
    duration: "1h 45m",
    tags: ["Maths", "Algebra"],
  },
];

export default function StudyDiaryWidget() {
  const [entries, setEntries] = useState(INITIAL_ENTRIES);
  const [isAdding, setIsAdding] = useState(false);
  
  // Form State
  const [content, setContent] = useState("");
  const [duration, setDuration] = useState("");
  const [tagInput, setTagInput] = useState("");

  const handleAddEntry = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newEntry = {
      id: Date.now(),
      date: "Just now",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content,
      duration: duration || "30m",
      tags: tagInput.split(",").map(t => t.trim()).filter(t => t !== ""),
    };

    setEntries([newEntry, ...entries]);
    
    // Reset and close form
    setContent("");
    setDuration("");
    setTagInput("");
    setIsAdding(false);
  };

  return (
    <div className="flex flex-col w-full max-w-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden h-[500px]">
      {/* Shadcn-style Card Header */}
      <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/20" 
      style={{display:"flex",justifyContent:"center",gap:"10px",flexDirection:"column",flexWrap:"nowrap",alignItems:"stretch"}}>
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-primary/10 text-primary rounded-lg">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 leading-none tracking-tight">Study Diary</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Track your self-learning journey</p>
          </div>
        </div>
        
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center justify-center gap-1.5 rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm h-8 px-3"
          >
            <Plus className="w-3.5 h-3.5" />
            New Note
          </button>
        )}
      </div>

      {/* Card Content (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar relative">
        <AnimatePresence mode="popLayout">
          {/* New Entry Inline Form */}
          {isAdding && (
            <motion.div 
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <form onSubmit={handleAddEntry} className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">What did you study?</span>
                  <button type="button" onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="e.g., Read chapter 3 of History and made short notes..."
                  className="w-full text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md p-2.5 outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none min-h-[80px]"
                  autoFocus
                />
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <Clock className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                    <input 
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="Duration (e.g. 45m)"
                      className="w-full text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md py-2 pl-8 pr-2 outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div className="relative">
                    <Tag className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                    <input 
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Tags (comma separated)"
                      className="w-full text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md py-2 pl-8 pr-2 outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button 
                    type="submit"
                    disabled={!content.trim()}
                    className="inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-8 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save Entry
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Timeline List */}
          <div className="space-y-5 relative before:absolute before:inset-0 before:ml-1.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-800 before:to-transparent">
            {entries.map((entry) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={entry.id} 
                className="relative flex items-start gap-4"
              >
                {/* Timeline Dot */}
                <div className="absolute left-0 w-3 h-3 rounded-full bg-primary ring-4 ring-white dark:ring-slate-950 z-10 mt-1.5" />
                
                {/* Entry Card */}
                <div className="flex-1 ml-6 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{entry.date}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                      <span>{entry.time}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                    {entry.content}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-wrap gap-1.5">
                      {entry.tags.map((tag, idx) => (
                        <span key={idx} className="inline-flex items-center rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-primary transition-colors">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                      <Clock className="w-3 h-3" />
                      {entry.duration}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
        }
      `}</style>
    </div>
  );
}