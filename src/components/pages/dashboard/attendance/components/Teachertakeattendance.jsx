"use client";

import React, { useState } from "react";
import AttendanceToolbar from "./Attendancetoolbar";
import BulkActionsBar from "./Bulkactionsbar";
import SeatGrid from "./Seatgrid";
// import ListView from "./Listview";
import AttendanceSummaryPanel from "./Attendancesummarypanel";
import { CLASS_SECTIONS, SUBJECTS, PERIODS, ROSTER_BY_SECTION, STATUS_CYCLE } from "@/store/attendance.utils";

export default function TeacherTakeAttendance() {
  const [section, setSection] = useState(CLASS_SECTIONS[0].value);
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [period, setPeriod] = useState(PERIODS[1]);
  const [view, setView] = useState("seat");
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState(false);
  const [students, setStudents] = useState(ROSTER_BY_SECTION[section]);

  function changeSection(val) {
    setSection(val);
    setStudents(ROSTER_BY_SECTION[val]);
    setSaved(false);
  }
  function cycleStatus(id) {
    setStudents((prev) => prev.map((s) => (s.id !== id ? s : { ...s, status: STATUS_CYCLE[(STATUS_CYCLE.indexOf(s.status) + 1) % STATUS_CYCLE.length] })));
    setSaved(false);
  }
  function setStatus(id, status) {
    setStudents((prev) => prev.map((s) => (s.id !== id ? s : { ...s, status })));
    setSaved(false);
  }
  function markAll(status) {
    setStudents((prev) => prev.map((s) => ({ ...s, status })));
    setSaved(false);
  }
  function clearAll() {
    setStudents((prev) => prev.map((s) => ({ ...s, status: "not-marked" })));
    setSaved(false);
  }
  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  
  return (
    <div className="space-y-4">
      <AttendanceToolbar
        section={section} setSection={changeSection}
        subject={subject} setSubject={setSubject}
        date={date} setDate={setDate}
        period={period} setPeriod={setPeriod}
      />
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-2 items-start">
        <div className="space-y-4">
          <BulkActionsBar onMarkAll={markAll} onClearAll={clearAll} query={query} setQuery={setQuery} view={view} setView={setView} />
          <div className="dashboard-card ">
              <SeatGrid students={students} onCycle={cycleStatus} query={query} />
          </div>
        </div>
        <AttendanceSummaryPanel students={students} onSave={handleSave} saved={saved} />
      </div>
    </div>
  );
}