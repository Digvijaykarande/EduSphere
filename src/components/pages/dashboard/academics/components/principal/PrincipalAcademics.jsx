"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AcademicStructure from "./AcademicStructure";
import ClassSubjectMaintenance from "./ClassSubjectMaintenance";
import TeacherAllocation from "./TeacherAllocation";
import CreateClassModal from "../modals/CreateClassModal";
import AllocateTeacherModal from "../modals/AllocateTeacherModal";
import {
  INITIAL_ACADEMIC_WINGS,
  INITIAL_CLASSES,
  INITIAL_TEACHERS_ALLOCATED,
} from "../../data/initialData";

export default function PrincipalAcademics() {
  const [wings] = useState(INITIAL_ACADEMIC_WINGS);
  const [classes, setClasses] = useState(INITIAL_CLASSES);
  const [teachers, setTeachers] = useState(INITIAL_TEACHERS_ALLOCATED);

  const [isCreateClassOpen, setIsCreateClassOpen] = useState(false);
  const [isAllocateTeacherOpen, setIsAllocateTeacherOpen] = useState(false);

  const handleCreateClass = (newClass) => {
    setClasses([...classes, newClass]);
    setIsCreateClassOpen(false);
  };

  const handleDeleteClass = (id) => {
    setClasses(classes.filter((c) => c.id !== id));
  };

  const handleAllocateTeacher = (newAllocation) => {
    setTeachers([...teachers, newAllocation]);
    setIsAllocateTeacherOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <AcademicStructure wings={wings} />
        </div>

        <div className="lg:col-span-8 space-y-6">
          <ClassSubjectMaintenance
            classes={classes}
            onNewClass={() => setIsCreateClassOpen(true)}
            onDeleteClass={handleDeleteClass}
          />
        </div>
      </div>
      <TeacherAllocation teachers={teachers} onAllocateNew={() => setIsAllocateTeacherOpen(true)} />

      {isCreateClassOpen && (
        <CreateClassModal onClose={() => setIsCreateClassOpen(false)} onCreate={handleCreateClass} />
      )}

      {isAllocateTeacherOpen && (
        <AllocateTeacherModal onClose={() => setIsAllocateTeacherOpen(false)} onAllocate={handleAllocateTeacher} />
      )}
    </motion.div>
  );
}
