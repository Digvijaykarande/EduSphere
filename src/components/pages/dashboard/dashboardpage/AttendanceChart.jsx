// components/pages/dashboard/attendance/components/AttendanceChart.jsx
//
// Simple, accurate Present vs Absent chart, Monday - Saturday.
// No synthesized/fake data, no gradients, no custom tooltip overlays -
// styled close to the plain Chart.js line-chart reference.
//
// Data contract:
//   <AttendanceChart present={12} absent={3} />
//     -> only "today's" real numbers are known, so a single real point
//        is plotted (labeled with today's weekday). This is intentionally
//        NOT padded with fabricated days - a flat/guessed week is
//        misleading. Once a weekly-history endpoint exists, pass:
//
//   <AttendanceChart week={[{ label: "Mon", present: 40, absent: 5 }, ...]} />
//     -> plots the real week, Monday - Saturday, present vs absent only.

"use client";

import { useMemo } from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Legend,
  Tooltip as ChartTooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Users } from "lucide-react";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Legend,
  ChartTooltip,
);

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const PRESENT_COLOR = "#10B981"; // emerald-500
const ABSENT_COLOR = "#F43F5E"; // rose-500

function todayLabel() {
  const jsDay = new Date().getDay(); // 0 = Sun ... 6 = Sat
  return jsDay === 0 ? "Sat" : WEEKDAYS[jsDay - 1];
}

export default function AttendanceChart({ present = 0, absent = 0, week }) {
  const hasWeek = Array.isArray(week) && week.length > 0;

  // Normalize into { label, present, absent }[] for Mon - Sat only.
  const points = useMemo(() => {
    if (hasWeek) {
      return WEEKDAYS.map((label) => {
        const match = week.find((d) => d.label === label);
        return {
          label,
          present: match ? Number(match.present) || 0 : null,
          absent: match ? Number(match.absent) || 0 : null,
        };
      });
    }
    // Only today's real numbers are known - plot a single true point,
    // not a fabricated week.
    return [
      {
        label: todayLabel(),
        present: Number(present) || 0,
        absent: Number(absent) || 0,
      },
    ];
  }, [hasWeek, week, present, absent]);

  const total = points.reduce(
    (acc, p) => acc + (p.present || 0) + (p.absent || 0),
    0,
  );

  const chartData = {
    labels: points.map((p) => p.label),
    datasets: [
      {
        label: "Present",
        data: points.map((p) => p.present),
        borderColor: PRESENT_COLOR,
        backgroundColor: PRESENT_COLOR,
        pointBackgroundColor: PRESENT_COLOR,
        pointBorderColor: "#ffffff",
        pointBorderWidth: 1.5,
        pointRadius: points.length === 1 ? 6 : 4,
        pointHoverRadius: 7,
        borderWidth: 2.5,
        tension: 0.25,
        spanGaps: true,
        fill: false,
      },
      {
        label: "Absent",
        data: points.map((p) => p.absent),
        borderColor: ABSENT_COLOR,
        backgroundColor: ABSENT_COLOR,
        pointBackgroundColor: ABSENT_COLOR,
        pointBorderColor: "#ffffff",
        pointBorderWidth: 1.5,
        pointRadius: points.length === 1 ? 6 : 4,
        pointHoverRadius: 7,
        borderWidth: 2.5,
        tension: 0.25,
        spanGaps: true,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 400, easing: "easeOutCubic" },
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: {
        display: true,
        position: "top",
        align: "end",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          boxWidth: 7,
          boxHeight: 7,
          padding: 16,
          font: { size: 11, weight: "600" },
          color: "#64748b",
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(15, 23, 42, 0.92)",
        titleColor: "#f8fafc",
        bodyColor: "#e2e8f0",
        padding: 8,
        cornerRadius: 6,
        displayColors: true,
        boxWidth: 8,
        boxHeight: 8,
        titleFont: { size: 11, weight: "600" },
        bodyFont: { size: 11 },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: "#94a3b8", font: { size: 11, weight: "600" } },
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(148,163,184,0.15)" },
        border: { display: false },
        ticks: { color: "#94a3b8", font: { size: 10 }, precision: 0 },
      },
    },
  };

  if (!total) {
    return (
      <div className="h-[260px] flex flex-col items-center justify-center gap-2 text-slate-400 dark:text-slate-500">
        <Users size={28} strokeWidth={1.5} />
        <p className="text-xs font-medium">No attendance recorded yet.</p>
      </div>
    );
  }

  return (
    <div>
      {!hasWeek && (
        <p className="px-1 pb-2 text-[11px] font-medium text-slate-400 dark:text-slate-500">
          Showing today ({points[0].label}) - weekly history not yet available.
        </p>
      )}
      <div className="relative h-[240px] w-full">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
