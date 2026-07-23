export const ROLE_PERMISSIONS = {
  "Super Admin": { scope: "school" },
  Principal: { scope: "school" },
  Teacher: { scope: "class" },
  Student: { scope: "self" },
};

export const CLASS_SECTIONS = [
  { value: "10-A", class: "Class 10", section: "A" },
  { value: "10-B", class: "Class 10", section: "B" },
  { value: "11-A", class: "Class 11", section: "A" },
];

export const SUBJECTS = ["Mathematics", "Science", "English", "History"];
export const PERIODS = [
  "1st Period (09:00 AM - 09:45 AM)",
  "2nd Period (10:00 AM - 10:45 AM)",
  "3rd Period (11:00 AM - 11:45 AM)",
];

function makeRoster(prefix, count) {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-${i + 1}`,
    rollNo: i + 1,
    name: `Student ${i + 1}`,
    status: "not-marked",
  }));
}

export const ROSTER_BY_SECTION = {
  "10-A": makeRoster("10A", 42),
  "10-B": makeRoster("10B", 38),
  "11-A": makeRoster("11A", 35),
};

export const STATUS_META = {
  present: { label: "Present", seat: "bg-emerald-100 border-emerald-300 text-emerald-800 dark:bg-emerald-500/20 dark:border-emerald-500/40 dark:text-emerald-300" },
  absent: { label: "Absent", seat: "bg-rose-100 border-rose-300 text-rose-800 dark:bg-rose-500/20 dark:border-rose-500/40 dark:text-rose-300" },
  late: { label: "Late", seat: "bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-500/20 dark:border-amber-500/40 dark:text-amber-300" },
  "not-marked": { label: "Not Marked", seat: "bg-white border-slate-200 text-slate-400 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-500" },
};

export const STATUS_CYCLE = ["not-marked", "present", "absent", "late"];

export const inputClass =
  "dash-focus w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg py-2 px-3 text-sm text-slate-700 dark:text-slate-200";
