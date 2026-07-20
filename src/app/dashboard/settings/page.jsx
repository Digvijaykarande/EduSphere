"use client";

import React, { useState } from "react";
import { useThemeStore } from "@/store/use-theme-store";
import {
  CreditCard,
  Upload,
  Save,
  Mail,
  MessageSquare,
  Smartphone,
  AlertCircle,
  FileText,
  Cloud,
  Download,
  ChevronDown,
  UserCircle,
} from "lucide-react";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
import GeneralInformationSection from "../../../components/pages/dashboard/settings/GeneralInformationSection";
// Define access rules for different sections
const PERMISSIONS = {
  generalInfo: ["superadmin", "principal"],
  generalInfoEdit: ["superadmin"], // Only superadmin can edit core school details
  notifications: ["superadmin", "principal", "teacher"],
  systemPrefs: ["superadmin", "principal", "teacher"],
  academicSession: ["superadmin", "principal"],
  dataBackup: ["superadmin"],
};

export default function SettingsPage() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  // TODO: Replace this with your actual Auth hook (e.g., useSession from NextAuth)
  const [currentUserRole, setCurrentUserRole] = useState("superadmin");

  const [toggles, setToggles] = useState({
    email: true,
    sms: true,
    push: true,
    feeReminders: true,
    attendanceAlerts: true,
    examNotifications: true,
    showTips: true,
  });
  const [weeklyOff, setWeeklyOff] = useState(new Set(["Sat", "Sun"]));

  const handleToggle = (key) => setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  const toggleWeeklyOff = (day) =>
    setWeeklyOff((prev) => {
      const next = new Set(prev);
      next.has(day) ? next.delete(day) : next.add(day);
      return next;
    });

  // Helper function to check if the current user can view a section
  const hasAccess = (section) => PERMISSIONS[section].includes(currentUserRole);

  const Switch = ({ checked, onChange, disabled }) => (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-[22px] w-[42px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
        checked ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <span
        className={`pointer-events-none inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );

  const Select = ({ label, children, ...props }) => (
    <div>
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{label}</label>
      <div className="relative">
        <select
          {...props}
          className="dash-focus w-full appearance-none border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm text-foreground bg-white dark:bg-slate-800 cursor-pointer pr-8 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {children}
        </select>
        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-[1700px] mx-auto min-h-screen">
      
      {/* DEVELOPMENT ONLY: Temporary Role Switcher to test UI */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center gap-4">
        <UserCircle className="text-blue-500" />
        <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Test Role View:</span>
        <div className="flex gap-2">
          {["superadmin", "principal", "teacher"].map((role) => (
            <button
              key={role}
              onClick={() => setCurrentUserRole(role)}
              className={`px-3 py-1.5 text-xs font-bold rounded-md capitalize transition-colors ${
                currentUserRole === role 
                  ? "bg-blue-600 text-white" 
                  : "bg-white text-blue-600 hover:bg-blue-100 border border-blue-200"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-display tracking-tight">Settings</h1>
          <div className="flex items-center text-sm text-slate-500 mt-1 font-medium">
            <span className="hover:text-primary cursor-pointer transition-colors">Dashboard</span>
            <span className="mx-2 text-slate-300">›</span>
            <span className="text-slate-700 dark:text-slate-300">Settings</span>
          </div>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm shadow-md hover:bg-primary/90 hover:shadow-lg transition-all">
          <Save size={18} />
          Save Changes
        </button>
      </div>

      <div>
        {/* Column 1 */}
        <div className="space-y-6">
          
          {/* General Information */}
          {/* {hasAccess("generalInfo") && (
            <div className="dashboard-card p-6 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
              <h2 className="text-lg font-bold text-foreground mb-1">General Information</h2>
              <p className="text-sm text-slate-500 mb-6">Update your school's basic information.</p>

              <div className="flex flex-col sm:flex-row gap-8">
                <div className="flex flex-col items-center gap-4 shrink-0">
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 w-full">School Logo</div>
                  <div className="w-32 h-32 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center p-2 shadow-sm overflow-hidden">
                    <img
                      src="https://t4.ftcdn.net/jpg/02/38/94/05/240_F_238940516_0BihE7YocY9vpgClPDDWuuaLneDwxtWn.jpg"
                      alt="School Logo"
                      className="object-contain h-full opacity-80 mix-blend-multiply"
                    />
                  </div>
                  {hasAccess("generalInfoEdit") && (
                    <>
                      <button className="text-primary text-sm font-semibold flex items-center gap-1.5 hover:text-primary/80 transition-colors">
                        <Upload size={16} /> Change Logo
                      </button>
                      <span className="text-[11px] text-slate-400 -mt-2">PNG, JPG up to 2MB</span>
                    </>
                  )}
                </div>

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">School Name</label>
                    <input 
                      type="text" 
                      defaultValue="EduSphere International School" 
                      disabled={!hasAccess("generalInfoEdit")}
                      className="dash-focus w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-foreground bg-white dark:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">School Code</label>
                    <input 
                      type="text" 
                      defaultValue="EDU1234" 
                      disabled={!hasAccess("generalInfoEdit")}
                      className="dash-focus w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-foreground bg-white dark:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                    <input 
                      type="email" 
                      defaultValue="info@edusphere.com" 
                      className="dash-focus w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-foreground bg-white dark:bg-slate-800" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Phone Number</label>
                    <div className="flex border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 overflow-hidden dash-focus-within">
                      <div className="bg-slate-50 dark:bg-slate-700/60 border-r border-slate-200 dark:border-slate-700 px-3 py-2 text-sm flex items-center gap-1.5 cursor-pointer">
                        🇮🇳  
                      </div>
                      <input type="text" defaultValue="+91 98765 43210" className="w-full px-3 py-2 text-sm text-foreground outline-none bg-transparent" />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Address</label>
                    <textarea 
                      type="text" 
                      defaultValue="123 Education Street, Knowledge City, Bangalore" 
                      disabled={!hasAccess("generalInfoEdit")}
                      className="dash-focus w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-foreground bg-white dark:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed" 
                    />
                  </div>
                </div>
              </div>
            </div>
          )} */}
          <GeneralInformationSection />

         {/* Academic Session */}
          {hasAccess("academicSession") && (
            <div className="dashboard-card p-6 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
              <h2 className="text-lg font-bold text-foreground mb-1">Academic Session</h2>
              <p className="text-sm text-slate-500 mb-6">Set the current term, calendar, and grading system.</p>

              <div className="space-y-5">
                <Select label="Current Academic Session" defaultValue="2024-2025">
                  <option value="2024-2025">2024 - 2025</option>
                  <option value="2023-2024">2023 - 2024</option>
                </Select>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Session Start</label>
                    <input type="date" defaultValue="2024-06-01" className="dash-focus w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-foreground bg-white dark:bg-slate-800" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Session End</label>
                    <input type="date" defaultValue="2025-04-30" className="dash-focus w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-foreground bg-white dark:bg-slate-800" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Weekly Off Days</label>
                  <div className="flex flex-wrap gap-2">
                    {WEEKDAYS.map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleWeeklyOff(day)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                          weeklyOff.has(day)
                            ? "bg-primary text-white border-primary"
                            : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                <Select label="Grading System" defaultValue="percentage">
                  <option value="percentage">Percentage (0–100)</option>
                  <option value="gpa">GPA (4.0 scale)</option>
                  <option value="letter">Letter Grade (A–F)</option>
                </Select>
              </div>
            </div>
          )}

         
        </div>

        {/* Column 2 */}
        <div className="space-y-6">
          {/* Notification Preferences */}
          {hasAccess("notifications") && (
            <div className="dashboard-card p-7 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm" style={{marginTop:"7px"}}>
              <h2 className="text-lg font-bold text-foreground mb-1">Notification Preferences</h2>
              <p className="text-sm text-slate-500 mb-6">Choose how you want to receive notifications.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { key: "email", label: "Email Notifications", desc: "Receive updates via email", icon: Mail, tone: "bg-[#eef0ff] text-primary" },
                  { key: "feeReminders", label: "Fee Reminders", desc: "Receive fee reminder notifications", icon: CreditCard, tone: "bg-green-50 text-green-600" },
                  { key: "sms", label: "SMS Notifications", desc: "Receive important updates via SMS", icon: MessageSquare, tone: "bg-blue-50 text-blue-500" },
                  { key: "attendanceAlerts", label: "Attendance Alerts", desc: "Receive attendance related alerts", icon: AlertCircle, tone: "bg-orange-50 text-orange-500" },
                  { key: "push", label: "Push Notifications", desc: "Receive push notifications in browser", icon: Smartphone, tone: "bg-yellow-50 text-yellow-500" },
                  { key: "examNotifications", label: "Exam Notifications", desc: "Receive exam related notifications", icon: FileText, tone: "bg-indigo-50 text-indigo-500" },
                ].map(({ key, label, desc, icon: Icon, tone }) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${tone}`}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">{label}</div>
                        <div className="text-[11px] text-slate-400">{desc}</div>
                      </div>
                    </div>
                    <Switch checked={toggles[key]} onChange={() => handleToggle(key)} />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div style={{display:"flex",flexDirection:'row',flexWrap:"wrap", justifyContent:"space-between", gap:'10px'}}>
            {/* System Preferences */}
            {hasAccess("systemPrefs") && (
              <div className="dashboard-card p-6 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm" style={{minWidth:'49%'}}>
                <h2 className="text-lg font-bold text-foreground mb-1">System Preferences</h2>
                <p className="text-sm text-slate-500 mb-6">Customize system-wide preferences.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <Select label="Appearance" value={theme} onChange={(e) => setTheme(e.target.value)}>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </Select>
                  <Select label="Items Per Page" defaultValue="25">
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                  </Select>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-5">
                  <div>
                    <div className="text-sm font-semibold text-foreground">Show Tips</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Show helpful tips and suggestions</div>
                  </div>
                  <Switch checked={toggles.showTips} onChange={() => handleToggle("showTips")} />
                </div>
              </div>
            )}

            {/* Data & Backup */}
            {hasAccess("dataBackup") && (
              <div className="dashboard-card p-6 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm" style={{minWidth:'49%'}}>
                <h2 className="text-lg font-bold text-foreground mb-1">Data & Backup</h2>
                <p className="text-sm text-slate-500 mb-5">Manage backups and data related actions.</p>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-slate-100 dark:border-slate-800 rounded-xl hover:border-slate-200 dark:hover:border-slate-700 transition-colors bg-slate-50/50 dark:bg-slate-800/40">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-50 text-purple-600 shrink-0">
                        <Cloud size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">Backup Data</div>
                        <div className="text-[11px] text-slate-500">Create a backup of your system data</div>
                      </div>
                    </div>
                    <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-primary hover:bg-[#eef0ff] dark:hover:bg-primary/10 hover:border-primary/30 transition-colors bg-white dark:bg-slate-800 shrink-0">
                      Create Backup
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-slate-100 dark:border-slate-800 rounded-xl hover:border-slate-200 dark:hover:border-slate-700 transition-colors bg-slate-50/50 dark:bg-slate-800/40">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                        <Download size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">Export Data</div>
                        <div className="text-[11px] text-slate-500">Export system data to CSV/Excel</div>
                      </div>
                    </div>
                    <button className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-primary hover:bg-[#eef0ff] dark:hover:bg-primary/10 hover:border-primary/30 transition-colors bg-white dark:bg-slate-800 shrink-0">
                      <Download size={14} /> Export
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}