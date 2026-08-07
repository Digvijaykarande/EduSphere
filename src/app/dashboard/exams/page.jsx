// src/app/dashboard/exams/page.jsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import RoleSwitcher from "@/components/pages/dashboard/fees/RoleSwitcher";
import PrincipalOverview from "@/components/pages/dashboard/exams/PrincipleOverview";
import StudentOverview from "@/components/pages/dashboard/exams/StudentOverview";
import GradebookTable from "@/components/pages/dashboard/exams/GradebookTable";
import CreateExamModal from "@/components/pages/dashboard/exams/CreateExamModal";
import AllExamsList from "@/components/pages/dashboard/exams/AllExamsList";
import ExamSchedule from "@/components/pages/dashboard/exams/ExamSchedule";
import ResultsManagement from "@/components/pages/dashboard/exams/ResultsManagement";
import AnalyticsDashboard from "@/components/pages/dashboard/exams/AnalyticsDashboard";

const TABS = ["Overview", "All Exams", "Schedule", "Results", "Analytics", "Gradebook"];

export default function ExamsPage() {
  const [role, setRole] = useState("principal");
  const [activeTab, setActiveTab] = useState("Overview");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gradebookSubject, setGradebookSubject] = useState("All Subjects");

  return (
    <div className="p-3 sm:p-4 md:p-8 max-w-[1600px] mx-auto space-y-4 sm:space-y-6 pb-24 sm:pb-6">
      
      {/* Header Context */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Exams Dashboard</h1>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1">Manage exams, schedules, results and analytics</p>
        </div>
        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <RoleSwitcher currentRole={role} onRoleChange={setRole} />
          {role === "principal" && (
            <button onClick={() => setIsModalOpen(true)} className="hidden sm:flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-600 shadow-md transition-all">
              <Plus size={16} /> Create Exam
            </button>
          )}
        </div>
      </div>

      {/* Mobile floating Create Exam button */}
      {role === "principal" && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="sm:hidden fixed bottom-5 right-5 z-40 flex items-center justify-center h-14 w-14 rounded-full bg-primary text-white shadow-2xl active:scale-95 transition-transform"
          aria-label="Create Exam"
        >
          <Plus size={22} />
        </button>
      )}

      {role === "principal" ? (
        <>
          {/* Custom Tab Navigation */}
          <div className="flex items-center gap-4 sm:gap-6 border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative py-3 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === tab ? "text-primary" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="exam-tab-underline" className="absolute left-0 right-0 -bottom-px h-0.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Conditional Rendering based on Tab */}
          <div className="mt-4 sm:mt-6">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                {activeTab === "Overview" && (
                  <PrincipalOverview
                    onNavigateTab={setActiveTab}
                    onCreateExam={() => setIsModalOpen(true)}
                  />
                )}
                {activeTab === "All Exams" && <AllExamsList />}
                {activeTab === "Schedule" && <ExamSchedule />}
                {activeTab === "Results" && <ResultsManagement />}
                {activeTab === "Analytics" && <AnalyticsDashboard />}
                {activeTab === "Gradebook" && (
                  <div className="space-y-4">
                    <GradebookTable subject={gradebookSubject} />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </>
      ) : (
        <StudentOverview />
      )}

      {/* Global Modals */}
      <CreateExamModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

    </div>
  );
}