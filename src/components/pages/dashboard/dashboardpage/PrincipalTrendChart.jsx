// components/pages/dashboard/dashboardpage/PrincipalTrendChart.jsx
//
// Principal's "attendance trend" chart — Chart.js, redesigned for a more
// premium, modern, interactive feel.
//
// - Custom HTML tooltip positioned at the cursor/point, with a
//   "met target" badge per-point.
// - Range toggle (7D / 30D / All) that slices the incoming trend data
//   client-side — no new props required, purely presentational.
// - Segment-colored line: the stroke shifts color between consecutive
//   points based on whether the *later* point is above/below target.
// - Dashed target reference line via a custom plugin (no extra deps).
// - Crosshair vertical guide line on hover via a custom plugin.
// - Animated gradient fill, glow-pulse marker on the latest point.
// - Summary stat row: current value, delta vs period start, best/worst day.
// - Loading skeleton + empty state preserved.
//
// Data contract unchanged: data.trend = [{ date, pct }, ...] — same shape
// returned by getSchoolAttendanceTrend / useDashboardData.

"use client";

import { useMemo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip as ChartTooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { TrendingUp, TrendingDown, Minus, Target, Sparkles } from "lucide-react";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, ChartTooltip);

const TARGET_PCT = 90;

const RANGES = [
  { key: "7d", label: "7D", days: 7 },
  { key: "30d", label: "30D", days: 30 },
  { key: "all", label: "All", days: null },
];

function formatDay(d) {
  if (!d) return "";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return String(d);
  return dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatFull(d) {
  if (!d) return "";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return String(d);
  return dt.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

// ---- Custom Chart.js plugins ------------------------------------------

const targetLinePlugin = {
  id: "targetLine",
  afterDraw(chart) {
    const { ctx, chartArea, scales } = chart;
    if (!chartArea) return;
    const y = scales.y.getPixelForValue(TARGET_PCT);
    ctx.save();
    ctx.strokeStyle = "rgba(148,163,184,0.55)";
    ctx.setLineDash([4, 5]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(chartArea.left, y);
    ctx.lineTo(chartArea.right, y);
    ctx.stroke();
    ctx.restore();
  },
};

const crosshairPlugin = {
  id: "crosshair",
  afterDraw(chart) {
    const active = chart.getActiveElements();
    if (!active?.length) return;
    const { ctx, chartArea } = chart;
    const { x } = active[0].element;
    ctx.save();
    ctx.strokeStyle = "rgba(99,102,241,0.35)";
    ctx.setLineDash([3, 4]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, chartArea.top);
    ctx.lineTo(x, chartArea.bottom);
    ctx.stroke();
    ctx.restore();
  },
};

export default function PrincipalTrendChart({ data = [], dataKey = "pct", dateKey = "date", loading = false }) {
  const chartRef = useRef(null);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [range, setRange] = useState("30d");
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, index: null });

  const allPoints = useMemo(
    () =>
      (data || []).map((d, i) => ({
        x: d[dateKey] ?? i,
        y: Number(d[dataKey] ?? d.value ?? d.attendancePct ?? 0),
        raw: d,
      })),
    [data, dataKey, dateKey],
  );

  const points = useMemo(() => {
    const conf = RANGES.find((r) => r.key === range);
    if (!conf?.days) return allPoints;
    return allPoints.slice(-conf.days);
  }, [allPoints, range]);

  const trend = useMemo(() => {
    if (points.length < 2) return { delta: 0, dir: "flat" };
    const first = points[0].y;
    const last = points[points.length - 1].y;
    const delta = Math.round((last - first) * 10) / 10;
    return { delta, dir: delta > 0.4 ? "up" : delta < -0.4 ? "down" : "flat" };
  }, [points]);

  const { best, worst } = useMemo(() => {
    if (!points.length) return { best: null, worst: null };
    let best = points[0];
    let worst = points[0];
    for (const p of points) {
      if (p.y > best.y) best = p;
      if (p.y < worst.y) worst = p;
    }
    return { best, worst };
  }, [points]);

  const latest = points.length ? points[points.length - 1].y : null;

  const handleHover = useCallback((evt, elements, chart) => {
    if (!elements?.length) {
      setHoverIndex(null);
      setTooltip((t) => ({ ...t, show: false }));
      return;
    }
    const el = elements[0];
    setHoverIndex(el.index);
    const point = chart.getDatasetMeta(0).data[el.index];
    setTooltip({ show: true, x: point.x, y: point.y, index: el.index });
  }, []);

  const onLeave = useCallback(() => {
    setHoverIndex(null);
    setTooltip((t) => ({ ...t, show: false }));
  }, []);

  if (loading) {
    return <div className="h-[280px] w-full animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800/60" />;
  }

  if (!points.length) {
    return (
      <div className="h-[280px] flex flex-col items-center justify-center gap-2 text-slate-400 dark:text-slate-500">
        <TrendingUp size={28} strokeWidth={1.5} />
        <p className="text-xs font-medium">No attendance trend data yet.</p>
      </div>
    );
  }

  const TrendIcon = trend.dir === "up" ? TrendingUp : trend.dir === "down" ? TrendingDown : Minus;
  const trendTone =
    trend.dir === "up"
      ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15"
      : trend.dir === "down"
        ? "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/15"
        : "text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800";

  const isSparse = points.length <= 40;
  const pointStyles = points.map((p) => (p.y >= TARGET_PCT ? "circle" : "triangle"));
  const pointColors = points.map((p) => (p.y >= TARGET_PCT ? "#10B981" : "#F59E0B"));
  const pointRadii = points.map((_, i) => (i === hoverIndex ? 8 : isSparse ? 4 : 0));
  const pointHoverRadii = points.map(() => 8);

  const chartData = {
    labels: points.map((p) => p.x),
    datasets: [
      {
        data: points.map((p) => p.y),
        borderWidth: 2.75,
        tension: 0.35,
        fill: true,
        cubicInterpolationMode: "monotone",
        segment: {
          borderColor: (ctx) => (ctx.p1.parsed.y >= TARGET_PCT ? "#10B981" : "#F59E0B"),
        },
        backgroundColor: (context) => {
          const { chart } = context;
          const { ctx, chartArea } = chart;
          if (!chartArea) return "rgba(99,102,241,0.08)";
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, "rgba(99,102,241,0.30)");
          gradient.addColorStop(0.6, "rgba(99,102,241,0.06)");
          gradient.addColorStop(1, "rgba(99,102,241,0)");
          return gradient;
        },
        pointStyle: pointStyles,
        pointBackgroundColor: pointColors,
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: pointRadii,
        pointHoverRadius: pointHoverRadii,
        pointHitRadius: 14,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 700, easing: "easeOutCubic" },
    interaction: { mode: "index", intersect: false },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "rgba(148,163,184,0.9)",
          font: { size: 10 },
          maxTicksLimit: 7,
          callback: (val, idx) => formatDay(points[idx]?.x),
        },
      },
      y: {
        min: 0,
        max: 100,
        grid: { color: "rgba(148,163,184,0.10)" },
        ticks: { color: "rgba(148,163,184,0.9)", font: { size: 10 }, stepSize: 25 },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    onHover: handleHover,
  };

  const hoveredPoint = tooltip.index != null ? points[tooltip.index] : null;

  return (
    <div onMouseLeave={onLeave}>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-3">
        <div className="flex items-baseline gap-2">
          <motion.span
            key={latest}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-mono font-semibold text-foreground"
          >
            {latest}%
          </motion.span>
          <span className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">today</span>
          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full ${trendTone}`}>
            <TrendIcon size={12} />
            {trend.delta > 0 ? "+" : ""}
            {trend.delta}% period
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 dark:text-slate-500">
            <Target size={11} /> {TARGET_PCT}% target
          </span>
          <div className="inline-flex items-center rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5">
            {RANGES.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setRange(r.key)}
                className={`relative px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                  range === r.key
                    ? "text-white"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
              >
                {range === r.key && (
                  <motion.span
                    layoutId="rangePill"
                    className="absolute inset-0 rounded-md bg-indigo-500"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative">{r.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative h-[240px] w-full">
        <Line ref={chartRef} data={chartData} options={options} plugins={[targetLinePlugin, crosshairPlugin]} />

        {hoverIndex == null && (
          <span
            className="pointer-events-none absolute h-2.5 w-2.5 rounded-full animate-ping"
            style={{
              backgroundColor: latest >= TARGET_PCT ? "#10B981" : "#F59E0B",
              right: 4,
              top: 8,
              opacity: 0.6,
            }}
            aria-hidden
          />
        )}

        <AnimatePresence>
          {tooltip.show && hoveredPoint && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.12 }}
              style={{
                position: "absolute",
                left: Math.min(Math.max(tooltip.x, 70), 999),
                top: Math.max(tooltip.y - 78, 0),
                transform: "translateX(-50%)",
              }}
              className="pointer-events-none z-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur px-3.5 py-2.5 shadow-lg min-w-[130px]"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {formatFull(hoveredPoint.x)}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <p className="text-lg font-mono font-semibold text-foreground leading-tight">{hoveredPoint.y}%</p>
                {hoveredPoint.y >= TARGET_PCT ? <Sparkles size={13} className="text-emerald-500" /> : null}
              </div>
              <p className={`text-[10px] font-semibold mt-0.5 ${hoveredPoint.y >= TARGET_PCT ? "text-emerald-500" : "text-amber-500"}`}>
                {hoveredPoint.y >= TARGET_PCT ? "Met target" : `${(TARGET_PCT - hoveredPoint.y).toFixed(1)}% below target`}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
        <div className="flex items-center gap-4 text-[11px] text-slate-400 dark:text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> At/above target
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 bg-amber-500" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }} /> Below target
          </span>
        </div>

        {best && worst && (
          <div className="flex items-center gap-3 text-[11px]">
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              Best {formatDay(best.x)} · {best.y}%
            </span>
            <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
              Worst {formatDay(worst.x)} · {worst.y}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}