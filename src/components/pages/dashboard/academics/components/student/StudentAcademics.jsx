"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import DailyTimetable from "./DailyTimetable";
import AttendanceSummary from "./AttendanceSummary";
import HomeworkTable from "./HomeworkTable";
import StudyMaterialsWidget from "./StudyMaterialsWidget";
import AssignmentDetailsModal from "../modals/AssignmentDetailsModal";
import StudyDiaryWidget from "./StudyDiaryWidget"
import {
  INITIAL_STUDENT_TIMETABLE,
  INITIAL_STUDENT_WEEK_TIMETABLE,
  INITIAL_STUDENT_ASSIGNMENTS,
  INITIAL_STUDENT_ATTENDANCE,
  INITIAL_STUDENT_STUDY_MATERIALS,
} from "../../data/initialData";

export default function StudentAcademics() {
  const [timetable] = useState(INITIAL_STUDENT_TIMETABLE);
  const [weekTimetable] = useState(INITIAL_STUDENT_WEEK_TIMETABLE);
  const [assignments, setAssignments] = useState(INITIAL_STUDENT_ASSIGNMENTS);
  const [attendance] = useState(INITIAL_STUDENT_ATTENDANCE);
  const [materials] = useState(INITIAL_STUDENT_STUDY_MATERIALS);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const handleUpdateAssignmentStatus = (id, newStatus) => {
    setAssignments((prev) => prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <DailyTimetable periods={timetable} weekTimetable={weekTimetable} />
          <HomeworkTable assignments={assignments} onSelectAssignment={setSelectedAssignment} />
        </div>

        <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
          <AttendanceSummary records={attendance} />
          <StudyDiaryWidget />
        </div>
        
      </div>
      <StudyMaterialsWidget materials={materials} onOpenMaterial={handleOpenMaterial} />

      {selectedAssignment && (
        <AssignmentDetailsModal
          assignment={selectedAssignment}
          onClose={() => setSelectedAssignment(null)}
          onStatusChange={handleUpdateAssignmentStatus}
        />
      )}
    </motion.div>
  );
}