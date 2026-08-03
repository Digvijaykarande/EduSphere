"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, ChevronDown, FileText, FileSpreadsheet } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import RoleSwitcher from "@/components/pages/dashboard/fees/RoleSwitcher";
import ClassSectionFilter from "@/components/pages/dashboard/fees/ClassSectionFilter";
import StudentFeeDetailModal from "@/components/pages/dashboard/fees/StudentFeeDetailModel";
import StudentView from "@/components/pages/dashboard/fees/StudentView";
import FeesTable from "@/components/pages/dashboard/fees/FeesTable";
import { StatCard } from "@/components/pages/dashboard/fees/shared";
import { feeStatsPrincipal, studentsList } from "@/components/pages/dashboard/fees/mockData";

const STATUS_TABS = ["ALL", "Pending", "Partial Paid", "Paid"];

export default function FeesPage() {
  const [role, setRole] = useState("principal");
  const [selectedClass, setSelectedClass] = useState("ALL");
  const [selectedFeeCategory, setSelectedFeeCategory] = useState("ALL");
  const [statusTab, setStatusTab] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const filteredStudents = studentsList.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === "ALL" || s.class === selectedClass;
    const matchesStatus =
      statusTab === "ALL" || s.status.toLowerCase().replace(" ", "") === statusTab.toLowerCase().replace(" ", "");
    const matchesFeeCategory =
      selectedFeeCategory === "ALL" ||
      s.breakdown.some((b) => b.particular.toLowerCase().includes(selectedFeeCategory.toLowerCase()));
    return matchesSearch && matchesClass && matchesStatus && matchesFeeCategory;
  });

  return (
    
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8">
      {/* Top Header & Role Switcher Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Fees Dashboard</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Overview of all fee collections and student payments
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <RoleSwitcher currentRole={role} onRoleChange={setRole} />
          {role === "principal" && <ExportMenu />}
        </div>
      </div>

      {role === "student" ? (
        /* STUDENT VIEW SCOPE */
        <StudentView />
      ) : (
        /* PRINCIPAL VIEW SCOPE */
        <div className="space-y-4">
          {/* Top Stat Overview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {feeStatsPrincipal.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>

          {/* Class & Section Selection Bar */}
          <ClassSectionFilter
            selectedClass={selectedClass}
            onClassChange={setSelectedClass}
            selectedFeeCategory={selectedFeeCategory}
            onFeeCategoryChange={setSelectedFeeCategory}
          />

          {/* 
            STICKY TOOLBAR (Moved OUTSIDE the split grid)
            Now it always spans 100% width, regardless of the student profile state.
          */}
          <div className="sticky top-0 z-30 pt-2 pb-2 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-md">
            <div className="dashboard-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl">
              
              {/* Status Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl w-full sm:w-auto overflow-x-auto no-scrollbar">
                {STATUS_TABS.map((tab) => {
                  const active = statusTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setStatusTab(tab)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                        active
                          ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                          : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      {tab === "ALL" ? "All Students" : tab}
                    </button>
                  );
                })}
              </div>

              {/* Interactive Expanding Search Bar */}
              <div className="relative w-full sm:w-64 focus-within:sm:w-80 xl:focus-within:w-96 transition-all duration-300 ease-out flex-shrink-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search by name or admission no..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs h-10 w-full focus:ring-2 focus:ring-primary/30 transition-all shadow-sm border-slate-200 dark:border-slate-700 hover:border-primary/50"
                />
              </div>
            </div>
          </div>

          {/* Table + Detail Sidebar Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-4 items-start relative mt-4">
            
            {/* Table Column */}
            <div className={`${selectedStudent ? "lg:col-span-7 xl:col-span-8" : "lg:col-span-12"} transition-all duration-300 min-w-0`}>
              {/* Main Students Fee Table */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <FeesTable
                  key={`${searchTerm}-${selectedClass}-${selectedFeeCategory}-${statusTab}`}
                  students={filteredStudents}
                  onSelectStudent={setSelectedStudent}
                  isProfileOpen={!!selectedStudent}
                />
              </div>
            </div>

            {/* STICKY & SCROLLABLE Selected Student Detail Drawer Panel */}
            <AnimatePresence>
              {selectedStudent && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="lg:col-span-5 xl:col-span-4 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar rounded-2xl"
                >
                  <StudentFeeDetailModal
                    student={selectedStudent}
                    onClose={() => setSelectedStudent(null)}
                  />
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      )}
    </div>
  );
}

function ExportMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md transition-colors hover:bg-primary/90 dash-focus">
        Export Report <ChevronDown className="h-3.5 w-3.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="gap-2 text-xs cursor-pointer">
          <FileText className="h-3.5 w-3.5" /> Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 text-xs cursor-pointer">
          <FileSpreadsheet className="h-3.5 w-3.5" /> Export as Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}