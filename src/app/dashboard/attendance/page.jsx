"use client";

import React, { useState } from "react";
import PageWrapper from "@/components/shared/PageWrapper";
import { ROLE_PERMISSIONS } from "@/store/attendance.utils";
import TeacherAttendancePage from "@/components/pages/dashboard/attendance/components/Teacherattendancepage";
import StudentAttendanceView from "@/components/pages/dashboard/attendance/components/Studentattendanceview";
import PrincipalAttendanceView from "@/components/pages/dashboard/attendance/components/Principalattendanceview";
import RoleSwitcher from "@/components/pages/dashboard/attendance/components/RoleSwitcher";

export default function AttendancePage() {
  const [activeRole, setActiveRole] = useState("Teacher");
  const scope = ROLE_PERMISSIONS[activeRole]?.scope || "class";

  return (
    <PageWrapper>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">
            Attendance
          </h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
            Dashboard <span className="mx-1">›</span> Attendance
          </p>
        </div>

        {/* Manual Rule Selection UI */}
        <RoleSwitcher activeRole={activeRole} setActiveRole={setActiveRole} />
      </div>

      {/* Render the correct component based on the scope */}
      {scope === "self" && <StudentAttendanceView />}
      {scope === "class" && <TeacherAttendancePage />}
      {scope === "school" && <PrincipalAttendanceView />}
    </PageWrapper>
  );
}
