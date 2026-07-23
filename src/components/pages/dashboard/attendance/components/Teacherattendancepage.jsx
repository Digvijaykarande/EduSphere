"use client";

import React, { useState, useMemo } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { useLeaveStore } from "@/store/use-leave-store";
import TeacherTakeAttendance from "./Teachertakeattendance";
import LeaveInbox from "./Leaveinbox";
import LeaveApplyForm from "./Leaveapplyform";

const TABS = ["Take Attendance", "Student Leave Requests", "Apply Leave"];

export default function TeacherAttendancePage() {
  const [tab, setTab] = useState(TABS[0]);
  const user = useAuthStore((s) => s.user) || { name: "Vikram Patel", role: "Teacher" };
  
  const studentLeaves = useLeaveStore((s) => s.studentLeaves);
  const actOnStudentLeave = useLeaveStore((s) => s.actOnStudentLeave);
  const submitTeacherLeave = useLeaveStore((s) => s.submitTeacherLeave);
  
  // FIX: Select the raw array first, then filter it memoized
  const rawTeacherLeaves = useLeaveStore((s) => s.teacherLeaves);
  const myLeaves = useMemo(() => {
    return rawTeacherLeaves.filter((r) => r.name === user.name);
  }, [rawTeacherLeaves, user.name]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1 w-max">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              tab === t ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-500 dark:text-slate-400"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Take Attendance" && <TeacherTakeAttendance />}

      {tab === "Student Leave Requests" && (
        <LeaveInbox
          title="Student Leave Requests"
          subtitle="Pending approvals from your class"
          requests={studentLeaves}
          onApprove={(id) => actOnStudentLeave(id, "Approved")}
          onDeny={(id) => actOnStudentLeave(id, "Denied")}
        />
      )}

      {tab === "Apply Leave" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <LeaveApplyForm
              applicantName={user.name}
              applicantMeta={{ role: "Teacher" }}
              submittedTo="the Principal"
              onSubmit={submitTeacherLeave}
            />
          </div>
          <div className="dashboard-card p-5">
            <p className="text-sm font-display font-semibold text-foreground mb-3">My Requests</p>
            <div className="space-y-2.5">
              {myLeaves.length === 0 && <p className="text-xs text-slate-400 dark:text-slate-500">No leave requests yet.</p>}
              {myLeaves.map((r) => (
                <div key={r.id} className="flex items-center justify-between text-xs gap-2">
                  <span className="text-slate-700 dark:text-slate-300 font-medium truncate">
                    {r.from}{r.to !== r.from ? ` – ${r.to}` : ""}
                  </span>
                  <span
                    className={`shrink-0 font-bold px-2 py-0.5 rounded-full text-[10px] ${
                      r.status === "Approved"
                        ? "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                        : r.status === "Denied"
                        ? "bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-300"
                        : "bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300"
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}