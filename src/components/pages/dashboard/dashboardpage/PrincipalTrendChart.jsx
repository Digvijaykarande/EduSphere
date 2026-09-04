// components/pages/dashboard/dashboardpage/PrincipalTrendChart.jsx
//
// Simple, accurate school-wide Present vs Absent chart, Monday - Saturday.
// Built from the real daily trend (`data` = [{ date, pct }, ...] from
// getSchoolAttendanceTrend) combined with the real `totalStudents` count,
// so both series are genuine numbers - not decoration.
//
// No target line, no crosshair/sparkle overlays, no custom floating
// tooltip - styled close to the plain Chart.js line-chart reference.

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
import { TrendingUp } from "lucide-react";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Legend,
  ChartTooltip,
);

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const PRESENT_COLOR = "#10B981"; // emerald-500
const ABSENT_COLOR = "#F43F5E"; // rose-500

export default function PrincipalTrendChart({
  data = [],
  dataKey = "pct",
  dateKey = "date",
  totalStudents = 0,
  loading = false,
}) {
  // Keep only Monday - Saturday, in order, and convert the daily
  // attendance % into real present/absent counts using totalStudents.
  const points = useMemo(() => {
    const rows = (data || [])
      .map((d) => {
        const dt = new Date(d[dateKey]);
        if (Number.isNaN(dt.getTime())) return null;
        const day = dt.getDay(); // 0 = Sun
        if (day === 0) return null; // drop Sunday
        const pct = Number(d[dataKey] ?? d.value ?? d.attendancePct ?? 0);
        const total = Number(totalStudents) || 0;
        const present = total ? Math.round((pct / 100) * total) : null;
        const absent =
          total && present != null ? Math.max(0, total - present) : null;
        return {
          label: WEEKDAY_LABELS[day],
          date: dt,
          present,
          absent,
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.date - b.date);
    return rows;
  }, [data, dataKey, dateKey, totalStudents]);

  const hasCounts = points.some((p) => p.present != null);

  if (loading) {
    return (
      <div className="h-[280px] w-full animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800/60" />
    );
  }

  if (!points.length) {
    return (
      <div className="h-[280px] flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500">
        <TrendingUp size={28} strokeWidth={1.5} />
        <p className="text-xs font-medium">
          No attendance trend data available.
        </p>
      </div>
    );
  }

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
        pointRadius: 4,
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
        pointRadius: 4,
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

  return (
    <div>
      {!hasCounts && (
        <p className="px-1 pb-2 text-[11px] font-medium text-slate-400 dark:text-slate-500">
          Present/Absent counts need total student count to display accurately.
        </p>
      )}
      <div className="relative h-[240px] w-full">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
