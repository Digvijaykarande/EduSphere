// Mock data for the Academics module.
// Replace with real API calls once the backend endpoints are ready —
// the shape of each object is kept flat and simple on purpose.

export const USER_PROFILES = {
  principal: {
    name: "Admin User",
    role: "principal",
    roleTitle: "Super Admin / Principal",
    email: "principal@edusphere.edu",
  },
  teacher: {
    name: "Prof. Robert Miller",
    role: "teacher",
    roleTitle: "Senior Faculty - Mathematics",
    email: "r.miller@edusphere.edu",
  },
  student: {
    name: "Alex Johnson",
    role: "student",
    roleTitle: "Grade 10 Student",
    email: "alex.j@student.edusphere.edu",
    grade: "Grade 10 - Section A",
  },
};

// ---- Student ----
export const INITIAL_STUDENT_TIMETABLE = [
  {
    id: "tp-1",
    periodNumber: 1,
    subject: "Mathematics",
    timeSlot: "08:00 AM - 09:00 AM",
    room: "ROOM 302",
    teacher: "Dr. Sarah Mills",
  },
  {
    id: "tp-2",
    periodNumber: 2,
    subject: "Physics",
    timeSlot: "09:00 AM - 10:00 AM",
    room: "LAB 1",
    isOngoing: true,
    teacher: "Prof. Alan Turing",
  },
  {
    id: "tp-3",
    periodNumber: 3,
    subject: "English Lit",
    timeSlot: "10:15 AM - 11:15 AM",
    room: "ROOM 104",
    teacher: "Mrs. Emma Watson",
  },
  {
    id: "tp-4",
    periodNumber: 4,
    subject: "World History",
    timeSlot: "11:15 AM - 12:15 PM",
    room: "ROOM 205",
    teacher: "Mr. David Attenborough",
  },
];

export const INITIAL_STUDENT_WEEK_TIMETABLE = {
  days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  periods: [
    {
      id: "wtp-1",
      time: "08:00 AM",
      Mon: { subject: "Mathematics", room: "ROOM 302" },
      Tue: { subject: "Chemistry", room: "LAB 2" },
      Wed: { subject: "Mathematics", room: "ROOM 302" },
      Thu: { subject: "Physics", room: "LAB 1" },
      Fri: { subject: "Mathematics", room: "ROOM 302" },
      Sat: null,
    },
    {
      id: "wtp-2",
      time: "09:00 AM",
      Mon: { subject: "Physics", room: "LAB 1" },
      Tue: { subject: "English Lit", room: "ROOM 104" },
      Wed: { subject: "Physics", room: "LAB 1" },
      Thu: { subject: "World History", room: "ROOM 205" },
      Fri: { subject: "Chemistry", room: "LAB 2" },
      Sat: { subject: "Doubt Clearing", room: "ROOM 302" },
    },
    {
      id: "wtp-3",
      time: "10:15 AM",
      Mon: { subject: "English Lit", room: "ROOM 104" },
      Tue: null,
      Wed: { subject: "World History", room: "ROOM 205" },
      Thu: { subject: "Mathematics", room: "ROOM 302" },
      Fri: { subject: "English Lit", room: "ROOM 104" },
      Sat: null,
    },
    {
      id: "wtp-4",
      time: "11:15 AM",
      Mon: { subject: "World History", room: "ROOM 205" },
      Tue: { subject: "Physics", room: "LAB 1" },
      Wed: null,
      Thu: { subject: "Chemistry", room: "LAB 2" },
      Fri: null,
      Sat: null,
    },
  ],
};

export const INITIAL_STUDENT_ASSIGNMENTS = [
  {
    id: "sa-1",
    title: "Calculus Differentiation",
    subject: "Mathematics",
    category: "Unit 4 Homework",
    teacher: "Dr. Sarah Mills",
    givenDate: "22 Jul, 2026",
    deadline: "27 Jul, 2026",
    isUrgent: true,
    status: "IN PROGRESS",
    description:
      "Solve problem set 4.2 to 4.5 on limits and derivative rules. Submit work as a PDF.",
  },
  {
    id: "sa-2",
    title: "Quantum Mechanics Intro",
    subject: "Physics",
    category: "Lab Report",
    teacher: "Prof. Alan Turing",
    givenDate: "20 Jul, 2026",
    deadline: "25 Jul, 2026",
    status: "SUBMITTED",
    description:
      "Write a 2-page report detailing the wave-particle duality observation from Lab 2.",
  },
  {
    id: "sa-3",
    title: "Shakespeare Sonnet Analysis",
    subject: "English",
    category: "Literature Review",
    teacher: "Mrs. Emma Watson",
    givenDate: "18 Jul, 2026",
    deadline: "24 Jul, 2026",
    status: "GRADED",
    marks: "85/100",
    description:
      "Critical essay analyzing Sonnet 18 meter, rhyme scheme, and thematic imagery.",
  },
];

export const INITIAL_STUDENT_ATTENDANCE = [
  { category: "Present", count: 8, percentage: 19, color: "#10b981" },
  { category: "Absent", count: 0, percentage: 0, color: "#ef4444" },
  { category: "Late", count: 0, percentage: 0, color: "#f59e0b" },
  { category: "Not Marked", count: 34, percentage: 81, color: "#e5e7eb" },
];

export const INITIAL_STUDENT_STUDY_MATERIALS = [
  {
    id: "sm-1",
    title: "Calculus_Formula_Sheet.pdf",
    subject: "Mathematics",
    type: "pdf",
    fileSize: "1.2 MB",
    uploadedDate: "21 Jul, 2026",
  },
  {
    id: "sm-2",
    title: "World_War_II_Summary.pdf",
    subject: "History",
    type: "pdf",
    fileSize: "450 KB",
    uploadedDate: "19 Jul, 2026",
  },
  {
    id: "sm-3",
    title: "Gravity_Explained_Video.mp4",
    subject: "Physics",
    type: "video",
    fileSize: "12.5 MB",
    uploadedDate: "15 Jul, 2026",
  },
];

// ---- Teacher ----
export const INITIAL_TEACHER_SCHEDULE = [
  {
    id: "ts-1",
    time: "09:00 AM",
    title: "Advanced Mathematics",
    topic: "Calculus - Integral Foundations",
    classBadge: "CLASS 10-A",
    type: "class",
    durationMinutes: 45,
  },
  {
    id: "ts-2",
    time: "10:00 AM",
    title: "Syllabus Review Session",
    topic: "Location: Staff Room (Block B)",
    type: "planning",
    durationMinutes: 60,
  },
  {
    id: "ts-3",
    time: "11:15 AM",
    title: "Physics Lab",
    topic: "Practical: Optics & Light Refraction",
    classBadge: "CLASS 9-C",
    type: "lab",
    durationMinutes: 45,
  },
  {
    id: "ts-4",
    time: "1:15 PM",
    title: "Java Lab",
    topic: "Practical:Java class & object",
    classBadge: "CLASS 10-A",
    type: "lab",
    durationMinutes: 45,
  },
];

export const INITIAL_SYLLABUS_TRACKING = [
  {
    id: "syl-1",
    subjectName: "Mathematics (Grade 10)",
    progressPercentage: 78,
    currentUnit: "Unit 4 - Geometry (3 chapters left)",
    color: "#6366f1",
  },
  {
    id: "syl-2",
    subjectName: "Physics (Grade 9)",
    progressPercentage: 92,
    currentUnit: "Unit 9 - Modern Physics (Finalizing)",
    color: "#10b981",
  },
  {
    id: "syl-3",
    subjectName: "Chemistry (Grade 10)",
    progressPercentage: 45,
    currentUnit: "Unit 2 - Organic Chemistry",
    color: "#3b82f6",
  },
];

export const INITIAL_TEACHER_ASSIGNMENTS = [
  {
    id: "ta-1",
    title: "Algebra Homework: Set 14",
    classSection: "Class 10-A • Mathematics",
    dueStatus: "DUE TOMORROW",
    isDueSoon: true,
    submissions: "12/54",
    submissionCount: 12,
    totalStudents: 54,
    deadline: "27 Jul, 2026",
  },
  {
    id: "ta-2",
    title: "Physics Lab Report: Optics",
    classSection: "Class 9-C • Physics",
    dueStatus: "IN REVIEW",
    submissions: "48/50",
    submissionCount: 48,
    totalStudents: 50,
    deadline: "24 Jul, 2026",
  },
  {
    id: "ta-3",
    title: "Organic Chemistry Worksheet",
    classSection: "Class 10-A • Chemistry",
    dueStatus: "DUE IN 3 DAYS",
    isDueSoon: false,
    submissions: "6/54",
    submissionCount: 6,
    totalStudents: 54,
    deadline: "29 Jul, 2026",
  },
];

// Per-assignment student submission rosters, keyed by assignment id.
// In production this would be fetched on-demand when a teacher opens
// the submissions panel for a given assignment.
export const INITIAL_ASSIGNMENT_SUBMISSIONS = {
  "ta-1": [
    { id: "st-1", name: "Alex Johnson", status: "GRADED", submittedOn: "26 Jul, 2026", marks: "18/20" },
    { id: "st-2", name: "Priya Nair", status: "SUBMITTED", submittedOn: "26 Jul, 2026" },
    { id: "st-3", name: "Marcus Webb", status: "LATE", submittedOn: "27 Jul, 2026" },
    { id: "st-4", name: "Sofia Torres", status: "MISSING" },
    { id: "st-5", name: "Ethan Brooks", status: "MISSING" },
    { id: "st-6", name: "Ava Kim", status: "SUBMITTED", submittedOn: "25 Jul, 2026" },
  ],
  "ta-2": [
    { id: "st-1", name: "Alex Johnson", status: "GRADED", submittedOn: "23 Jul, 2026", marks: "45/50" },
    { id: "st-2", name: "Priya Nair", status: "GRADED", submittedOn: "22 Jul, 2026", marks: "48/50" },
    { id: "st-3", name: "Marcus Webb", status: "SUBMITTED", submittedOn: "24 Jul, 2026" },
    { id: "st-4", name: "Sofia Torres", status: "MISSING" },
  ],
  "ta-3": [
    { id: "st-1", name: "Alex Johnson", status: "MISSING" },
    { id: "st-2", name: "Priya Nair", status: "SUBMITTED", submittedOn: "26 Jul, 2026" },
    { id: "st-3", name: "Marcus Webb", status: "MISSING" },
  ],
};

// Class-wise attendance snapshot for classes this teacher teaches.
export const INITIAL_TEACHER_ATTENDANCE = [
  { id: "att-1", classSection: "Class 10-A", subject: "Mathematics", present: 49, total: 54, date: "26 Jul, 2026" },
  { id: "att-2", classSection: "Class 9-C", subject: "Physics", present: 47, total: 50, date: "26 Jul, 2026" },
  { id: "att-3", classSection: "Class 10-A", subject: "Chemistry", present: 51, total: 54, date: "26 Jul, 2026" },
];

// Weekly schedule grid: array of periods, each with an entry per day.
// dayKey values are used to build the 7-day grid; null = free period.
export const INITIAL_TEACHER_WEEK_SCHEDULE = {
  days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  periods: [
    {
      id: "wp-1",
      time: "09:00 AM",
      Mon: { title: "Adv. Mathematics", classBadge: "10-A", type: "class" },
      Tue: { title: "Chemistry", classBadge: "10-A", type: "class" },
      Wed: { title: "Adv. Mathematics", classBadge: "10-A", type: "class" },
      Thu: { title: "Physics Lab", classBadge: "9-C", type: "lab" },
      Fri: { title: "Adv. Mathematics", classBadge: "10-A", type: "class" },
      Sat: null,
    },
    {
      id: "wp-2",
      time: "10:00 AM",
      Mon: { title: "Syllabus Review", type: "planning" },
      Tue: { title: "Physics", classBadge: "9-C", type: "class" },
      Wed: { title: "Chemistry", classBadge: "10-A", type: "class" },
      Thu: null,
      Fri: { title: "Staff Meeting", type: "planning" },
      Sat: { title: "Doubt Clearing", classBadge: "10-A", type: "class" },
    },
    {
      id: "wp-3",
      time: "11:15 AM",
      Mon: { title: "Physics Lab", classBadge: "9-C", type: "lab" },
      Tue: null,
      Wed: { title: "Physics Lab", classBadge: "9-C", type: "lab" },
      Thu: { title: "Adv. Mathematics", classBadge: "10-A", type: "class" },
      Fri: null,
      Sat: null,
    },
  ],
};

export const INITIAL_TEACHER_MATERIALS = [
  {
    id: "tm-1",
    title: "Grade 10 Notes",
    subject: "Mathematics",
    type: "folder",
    fileCount: 12,
    fileSize: "45MB",
    uploadedDate: "20 Jul, 2026",
  },
  {
    id: "tm-2",
    title: "Lab Manuals",
    subject: "Physics",
    type: "folder",
    fileCount: 8,
    fileSize: "12MB",
    uploadedDate: "18 Jul, 2026",
  },
  {
    id: "tm-3",
    title: "Optics Intro",
    subject: "Physics",
    type: "video",
    duration: "08:45",
    uploadedDate: "16 Jul, 2026",
  },
  {
    id: "tm-4",
    title: "Organic Chem Cheat Sheet.pdf",
    subject: "Chemistry",
    type: "pdf",
    fileSize: "890 KB",
    uploadedDate: "14 Jul, 2026",
  },
  {
    id: "tm-5",
    title: "NCERT Reference Portal",
    subject: "General",
    type: "link",
    fileSize: "External link",
    uploadedDate: "10 Jul, 2026",
  },
];

// ---- Principal ----
export const INITIAL_ACADEMIC_WINGS = [
  {
    id: "wing-1",
    name: "Senior Wing",
    classes: "Classes 9 - 12",
    iconName: "building",
    description: "Higher Secondary education & competitive preparation",
  },
  {
    id: "wing-2",
    name: "Secondary Wing",
    classes: "Classes 6 - 8",
    iconName: "landmark",
    description: "Middle school core curriculum & skill foundations",
  },
  {
    id: "wing-3",
    name: "Primary Wing",
    classes: "Classes 1 - 5",
    iconName: "shapes",
    description: "Elementary education & activity-based learning",
  },
];

export const INITIAL_CLASSES = [
  {
    id: "cs-1",
    classNumber: "10",
    section: "A",
    room: "R-204",
    subjects: ["Math", "Science", "History"],
    extraSubjectsCount: 2,
    seatsText: "42 Seats",
    seatsStatus: "available",
  },
  {
    id: "cs-2",
    classNumber: "10",
    section: "B",
    room: "R-205",
    subjects: ["Math", "Science", "History"],
    extraSubjectsCount: 0,
    seatsText: "38 Seats",
    seatsStatus: "available",
  },
  {
    id: "cs-3",
    classNumber: "09",
    section: "A",
    room: "R-101",
    subjects: ["M", "S"],
    extraSubjectsCount: 4,
    seatsText: "45 (Full)",
    seatsStatus: "full",
  },
];

export const INITIAL_TEACHERS_ALLOCATED = [
  {
    id: "tal-1",
    name: "Dr. Sarah Jenkins",
    designation: "Lead - Mathematics Dept.",
    status: "ACTIVE",
    assignedClasses: ["10-A (Calculus)", "12-B (Algebra)"],
  },
  {
    id: "tal-2",
    name: "Prof. Robert Miller",
    designation: "Senior Faculty - History",
    status: "ACTIVE",
    assignedClasses: ["09-A (World Hist)", "10-A (Civics)"],
  },
  {
    id: "tal-3",
    name: "Marcus Chen",
    designation: "Instructor - Computer Science",
    status: "ACTIVE",
    assignedClasses: ["11-C (Python)", "Lab 4 (Coordinator)"],
  },
];