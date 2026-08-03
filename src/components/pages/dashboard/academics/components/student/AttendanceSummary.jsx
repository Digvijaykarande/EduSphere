"use client";

export default function AttendanceSummary({ records }) {
  const present = records.find((r) => r.category === "Present");
  const presentPct = present ? present.percentage : 0;

  // Build a conic-gradient ring from the record percentages — no SVG needed.
  let cursor = 0;
  const stops = records
    .filter((r) => r.percentage > 0)
    .map((r) => {
      const start = cursor;
      cursor += r.percentage;
      return `${r.color} ${start}% ${cursor}%`;
    })
    .join(", ");

  return (
    <div className="dashboard-card p-6 h-fit-content flex flex-col justify-between">
      <h3 className="text-lg font-bold text-foreground tracking-tight mb-4">Attendance Summary</h3>

      {/* Donut ring built with a CSS conic-gradient */}
      <div className="relative flex items-center justify-center my-4">
        <div
          className="w-[180px] h-[180px] rounded-full flex items-center justify-center"
          style={{ background: `conic-gradient(${stops})` }}
        >
          <div className="w-[144px] h-[144px] rounded-full bg-card flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold text-foreground tracking-tight">{presentPct}%</span>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Present</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        {records.map((rec) => (
          <div key={rec.category} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: rec.color }} />
              <span className="font-medium text-slate-700 dark:text-slate-300">{rec.category}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold text-foreground">{rec.count}</span>
              <span className="text-slate-400 font-normal min-w-[32px] text-right">{rec.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
