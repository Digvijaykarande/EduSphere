"use client";

import React, { useState } from "react";
import PageWrapper from "@/components/shared/PageWrapper";
import { BookOpen, MapPin, Clock, Calendar, CheckCircle2, UserCheck, Layers } from "lucide-react";

// Mock Data representing an active professor's course allocations
const assignedClasses = [
  { id: 1, subject: "Mathematics", grade: "Grade 10-A", time: "09:00 AM - 10:15 AM", room: "Room 302", progress: 65 },
  { id: 2, subject: "Physics", grade: "Grade 11-B", time: "11:00 AM - 12:15 PM", room: "Lab 2", progress: 40 },
  { id: 3, subject: "Advanced Geometry", grade: "Grade 10-B", time: "02:00 PM - 03:15 PM", room: "Room 304", progress: 80 },
];

const substitutions = [
  { id: 1, originalTeacher: "Prof. Patil", subject: "Chemistry", grade: "Grade 12-A", time: "12:30 PM - 01:30 PM", room: "Lab 1", status: "Pending Action" }
];

const weeklyTimetable = {
  Monday: [
    { subject: "Math", room: "R302", time: "9:00 AM" },
    { subject: "Physics", room: "Lab 2", time: "11:00 AM" },
  ],
  Tuesday: [
    { subject: "Geometry", room: "R304", time: "2:00 PM" },
  ],
  Wednesday: [
    { subject: "Math", room: "R302", time: "9:00 AM" },
    { subject: "Physics", room: "Lab 2", time: "11:00 AM" },
  ],
  Thursday: [
    { subject: "Geometry", room: "R304", time: "2:00 PM" },
  ],
  Friday: [
    { subject: "Math", room: "R302", time: "9:00 AM" },
  ],
};

export default function AcademicsPage() {
  const [activeTab, setActiveTab] = useState("schedule");
  const [currentDay, setCurrentDay] = useState("Monday");

  return (
    <PageWrapper>
      {/* Top Meta Brand Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Academic Console</h1>
        <p className="text-sm text-slate-500 mt-1">Manage running timetables, track syllabus completion, and respond to temporary course cover allocations.</p>
      </div>

      {/* Internal Sub-Module Navigation Matrix Tabs */}
      <div className="flex border-b border-slate-200 mb-8 gap-6 select-none">
        <button
          onClick={() => setActiveTab("schedule")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "schedule" ? "border-primary text-primary" : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          My Load & Schedule
        </button>
        <button
          onClick={() => setActiveTab("timetable")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "timetable" ? "border-primary text-primary" : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Weekly Master Timetable
        </button>
      </div>

      {activeTab === "schedule" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column Left: Active Course Allocations */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Layers size={18} className="text-primary" /> Current Subject Allocations
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              {assignedClasses.map((cls) => (
                <div key={cls.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:border-slate-300 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div>
                      <span className="text-xs font-bold text-primary bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-md mb-2 inline-block">
                        {cls.grade}
                      </span>
                      <h4 className="text-lg font-bold text-slate-800">{cls.subject}</h4>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500">
                      <span className="flex items-center gap-1.5"><Clock size={14} /> {cls.time}</span>
                      <span className="flex items-center gap-1.5"><MapPin size={14} /> {cls.room}</span>
                    </div>
                  </div>

                  {/* Syllabus Progression Tracking Scale */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1.5">
                      <span>Syllabus Covered Progress</span>
                      <span className="text-slate-700">{cls.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full transition-all duration-500" style={{ width: `${cls.progress}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column Sidebar: Substitution Actions */}
          <div className="space-y-6">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <UserCheck size={18} className="text-warning" /> Arranged Cover Duties
            </h3>

            {substitutions.length > 0 ? (
              substitutions.map((sub) => (
                <div key={sub.id} className="bg-white border border-amber-200 bg-amber-50/20 rounded-xl p-5 shadow-sm border-dashed">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wide mb-2">
                    <span className="h-2 w-2 bg-amber-500 rounded-full animate-pulse" /> Urgent Cover Request
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">{sub.subject} ({sub.grade})</h4>
                  <p className="text-xs text-slate-500 mt-1">Covering for absent faculty: <strong className="text-slate-700">{sub.originalTeacher}</strong></p>
                  
                  <div className="mt-4 pt-4 border-t border-slate-200/60 space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2"><Clock size={14} /> {sub.time}</div>
                    <div className="flex items-center gap-2"><MapPin size={14} /> {sub.room}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <button className="bg-primary text-white text-xs font-semibold py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors">
                      Accept Cover
                    </button>
                    <button className="bg-white border border-slate-200 text-slate-600 text-xs font-semibold py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors">
                      Decline
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">No temporary arrangements assigned for today.</p>
            )}
          </div>

        </div>
      ) : (
        /* Tab View 2: Weekly Master Timetable Grid Layout Matrix */
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="flex bg-slate-50 border-b border-slate-200 overflow-x-auto select-none">
            {Object.keys(weeklyTimetable).map((day) => (
              <button
                key={day}
                onClick={() => setCurrentDay(day)}
                className={`px-6 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
                  currentDay === day ? "border-primary text-primary bg-white" : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {weeklyTimetable[currentDay]?.map((slot, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white border border-slate-200 rounded-lg text-primary shadow-sm">
                      <BookOpen size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{slot.subject}</h4>
                      <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><MapPin size={12} /> {slot.room}</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded-md shadow-sm flex items-center gap-1">
                    <Clock size={12} /> {slot.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}