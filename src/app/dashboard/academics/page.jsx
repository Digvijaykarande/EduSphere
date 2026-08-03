"use client";

import { useState } from "react";
import RoleSwitcher from "@/components/pages/dashboard/academics/components/RoleSwitcher";
import StudentAcademics from "@/components/pages/dashboard/academics/components/student/StudentAcademics";
import TeacherAcademics from "@/components/pages/dashboard/academics/components/teacher/TeacherAcademics";
import PrincipalAcademics from "@/components/pages/dashboard/academics/components/principal/PrincipalAcademics";
import { USER_PROFILES } from "@/components/pages/dashboard/academics/data/initialData";

export default function AcademicsPage() {
  // Manual role toggle for now — no auth/persistence wired up yet.
  const [currentRole, setCurrentRole] = useState("teacher");
  const activeUser = USER_PROFILES[currentRole];

  return (
    <div className="space-y-6">
      {/* Page title + role switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Academics</h1>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mt-1">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-primary font-bold">Academics</span>
          </div>
        </div>

        <RoleSwitcher currentRole={currentRole} onRoleChange={setCurrentRole} />
      </div>

      {/* Viewing-as indicator */}
      <p className="text-xs text-slate-400 -mt-4">
        Viewing as <span className="font-semibold text-slate-600 dark:text-slate-300">{activeUser.name}</span> ·{" "}
        {activeUser.roleTitle}
      </p>

      {/* Role-specific view */}
      {currentRole === "student" && <StudentAcademics />}
      {currentRole === "teacher" && <TeacherAcademics />}
      {currentRole === "principal" && <PrincipalAcademics />}
    </div>
  );
}
