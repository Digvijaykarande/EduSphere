"use client";

import { ClipboardList, Plus, Paperclip, Trash2, Users } from "lucide-react";

export default function TeacherAssignments({ assignments, onCreateNew, onDeleteAssignment, onViewSubmissions }) {
  return (
    <div className="dashboard-card p-6">
      <div style={{display:"flex",flexWrap:"wrap",justifyContent:"space-between",alignContent:"center",gap:"5px",marginBottom:"5px"}}>
        <div className="flex items-center gap-3">
          <div className="stat-icon-box stat-icon-violet">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground tracking-tight">Assignments & Tasks</h3>
            <p className="text-xs text-slate-400">Assign homework & track submissions</p>
          </div>
        </div>

        <button onClick={onCreateNew} className="btn-pill-primary">
          <Plus className="w-4 h-4" />
          <span>Create new</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assignments.map((item) => {
          const completionPct = item.totalStudents
            ? Math.round((item.submissionCount / item.totalStudents) * 100)
            : 0;

          return (
            <div
              key={item.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800/60 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-bold text-foreground text-base">{item.title}</h4>
                  <p className="text-xs text-slate-500 font-medium mt-1">{item.classSection}</p>
                </div>

                <span
                  className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider shrink-0 ${
                    item.isDueSoon
                      ? "bg-destructive/10 text-destructive"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {item.dueStatus}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onViewSubmissions(item)}
                className="text-left group/submissions"
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-400 font-medium flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    Submissions
                  </span>
                  <span className="font-bold text-foreground group-hover/submissions:text-primary transition-colors">
                    {item.submissions}
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
                    style={{ width: `${completionPct}%` }}
                  />
                </div>
              </button>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => onViewSubmissions(item)}
                  className="text-primary font-bold hover:underline"
                >
                  View student list
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-all"
                    title="Attach material"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteAssignment(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-destructive hover:bg-destructive/10 transition-all"
                    title="Delete assignment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}