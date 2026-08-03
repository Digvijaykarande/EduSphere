"use client";

import { BookOpen, CheckCircle, Clock } from "lucide-react";

/* Small modern tooltip used for the teacher icon */
function TeacherTooltip({ children, label }) {
  return (
    <div className="group/tip relative flex items-center">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 hidden group-hover/tip:flex flex-col items-center z-20 opacity-0 group-hover/tip:opacity-100 translate-y-1 group-hover/tip:translate-y-0 transition-all duration-150">
        <span className="flex items-center gap-1.5 bg-white dark:bg-slate-800 text-foreground text-[11px] font-semibold py-1.5 px-3 rounded-lg whitespace-nowrap shadow-xl border border-slate-100 dark:border-slate-700 max-w-[220px] whitespace-normal text-center">
          {label}
        </span>
        <span className="w-2 h-2 -mt-1 rotate-45 bg-white dark:bg-slate-800 border-r border-b border-slate-100 dark:border-slate-700" />
      </div>
    </div>
  );
}

export default function HomeworkTable({ assignments, onSelectAssignment }) {
  return (
    <div className="dashboard-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="stat-icon-box stat-icon-green">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground tracking-tight">Homework & Assignments</h3>
            <p className="text-xs text-slate-400">Track pending tasks, deadlines, and grades</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="pb-3 pl-2">Assignment</th>
              <th className="pb-3 px-3">Teacher</th>
              <th className="pb-3 px-3">Given</th>
              <th className="pb-3 px-3">Deadline</th>
              <th className="pb-3 pr-2 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {assignments.map((assignment) => (
              <tr
                key={assignment.id}
                onClick={() => onSelectAssignment(assignment)}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
              >
                <td className="py-4 pl-2 pr-3">
                  <div className="font-bold text-foreground group-hover:text-primary transition-colors">
                    {assignment.title}
                  </div>
                  <div className="text-xs text-slate-400 font-medium mt-0.5">
                    {assignment.subject} • {assignment.category}
                  </div>
                </td>

                <td className="py-4 px-3">
                  <div className="flex items-center gap-2">
                    <TeacherTooltip label={assignment.teacher}>
                      <span className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[10px] flex items-center justify-center uppercase cursor-default transition-all group-hover/tip:border-primary group-hover/tip:bg-primary/10 group-hover/tip:text-primary group-hover/tip:-translate-y-0.5 shrink-0 cursor-pointer">
                        {assignment.teacher[0]}
                      </span>
                    </TeacherTooltip>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {assignment.teacher}
                    </span>
                  </div>
                </td>

                <td className="py-4 px-3 text-xs font-medium text-slate-500">{assignment.givenDate}</td>

                <td className="py-4 px-3 text-xs font-semibold">
                  <span className={assignment.isUrgent ? "text-destructive font-bold" : "text-slate-700 dark:text-slate-300"}>
                    {assignment.deadline}
                  </span>
                </td>

                <td className="py-4 pr-2 text-right">
                  {assignment.status === "IN PROGRESS" && (
                    <span className="inline-flex items-center gap-1.5 text-primary bg-primary/10 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider">
                      <Clock className="w-3 h-3" />
                      In progress
                    </span>
                  )}
                  {assignment.status === "SUBMITTED" && (
                    <span className="inline-flex items-center gap-1.5 text-success bg-success/10 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider">
                      <CheckCircle className="w-3 h-3" />
                      Submitted
                    </span>
                  )}
                  {assignment.status === "GRADED" && (
                    <span className="inline-flex items-center gap-2 text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider">
                      <span>Graded</span>
                      <span className="text-primary font-extrabold">{assignment.marks}</span>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}