"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import TeacherSchedule from "./TeacherSchedule";
import SyllabusTracker from "./SyllabusTracker";
import TeacherPerformanceCard from "./TeacherPerformanceCard";
import TeacherAssignments from "./TeacherAssignments";
import StudyMaterialLibrary from "./StudyMaterialLibrary";
import AttendanceSummary from "./AttendanceSummary";
import AssignmentSubmissionsPanel from "./AssignmentSubmissionsPanel";
import CreateAssignmentModal from "../modals/CreateAssignmentModal";
import AddMaterialModal from "../modals/AddMaterialModal";
import {
  INITIAL_TEACHER_SCHEDULE,
  INITIAL_TEACHER_WEEK_SCHEDULE,
  INITIAL_SYLLABUS_TRACKING,
  INITIAL_TEACHER_ASSIGNMENTS,
  INITIAL_TEACHER_MATERIALS,
  INITIAL_TEACHER_ATTENDANCE,
  INITIAL_ASSIGNMENT_SUBMISSIONS,
} from "../../data/initialData";

export default function TeacherAcademics() {
  const [schedule] = useState(INITIAL_TEACHER_SCHEDULE);
  const [weekSchedule] = useState(INITIAL_TEACHER_WEEK_SCHEDULE);
  const [attendance] = useState(INITIAL_TEACHER_ATTENDANCE);
  const [syllabus] = useState(INITIAL_SYLLABUS_TRACKING);
  const [assignments, setAssignments] = useState(INITIAL_TEACHER_ASSIGNMENTS);
  const [materials, setMaterials] = useState(INITIAL_TEACHER_MATERIALS);
  const [submissionsByAssignment] = useState(INITIAL_ASSIGNMENT_SUBMISSIONS);

  const [isCreateAssignmentOpen, setIsCreateAssignmentOpen] = useState(false);
  const [isAddMaterialOpen, setIsAddMaterialOpen] = useState(false);
  const [activeSubmissionsAssignment, setActiveSubmissionsAssignment] = useState(null);

  const handleCreateAssignment = (newAssignment) => {
    setAssignments([newAssignment, ...assignments]);
    setIsCreateAssignmentOpen(false);
  };

  const handleDeleteAssignment = (id) => {
    setAssignments(assignments.filter((a) => a.id !== id));
  };

  const handleAddMaterial = (newMat) => {
    setMaterials([...materials, newMat]);
    setIsAddMaterialOpen(false);
  };

  const handleOpenMaterial = (material) => {
    // Placeholder until real file storage/URLs are wired up.
    console.log("Open material:", material.title);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Row 1: schedule planning is the primary daily tool, so it gets the most room */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <TeacherSchedule scheduleItems={schedule} weekSchedule={weekSchedule} />
        </div>

        <div className="lg:col-span-4 space-y-6 flex flex-col">
          {/* <TeacherPerformanceCard /> */}
          <AttendanceSummary records={attendance} />
        </div>
      </div>

      {/* Row 2: syllabus progress sits beside assignments since both track curriculum pace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <SyllabusTracker subjects={syllabus} />
        </div>

        <div className="lg:col-span-8">
          <TeacherAssignments
            assignments={assignments}
            onCreateNew={() => setIsCreateAssignmentOpen(true)}
            onDeleteAssignment={handleDeleteAssignment}
            onViewSubmissions={setActiveSubmissionsAssignment}
          />
        </div>
      </div>

      {/* Row 3: materials library, full width */}
      <StudyMaterialLibrary
        materials={materials}
        onAddMaterial={() => setIsAddMaterialOpen(true)}
        onOpenMaterial={handleOpenMaterial}
      />

      {isCreateAssignmentOpen && (
        <CreateAssignmentModal onClose={() => setIsCreateAssignmentOpen(false)} onCreate={handleCreateAssignment} />
      )}

      {isAddMaterialOpen && (
        <AddMaterialModal onClose={() => setIsAddMaterialOpen(false)} onAdd={handleAddMaterial} />
      )}

      {activeSubmissionsAssignment && (
        <AssignmentSubmissionsPanel
          assignment={activeSubmissionsAssignment}
          roster={submissionsByAssignment[activeSubmissionsAssignment.id] || []}
          onClose={() => setActiveSubmissionsAssignment(null)}
        />
      )}
    </motion.div>
  );
}