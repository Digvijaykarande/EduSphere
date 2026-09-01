// components/pages/dashboard/dashboardpage/sharedUI.jsx
//
// All small, reusable presentational pieces used across the dashboard hub
// and the attendance page: StatCard, PanelHeader, QuickAction, EmptyRow,
// UpcomingEvents, FeeSnapshot, DashboardHeader, QuickActionsBar, StatsGrid.

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Clock3, MapPin, AlertCircle } from "lucide-react";
import {
  itemVariants,
  containerVariants,
  formatINRCompact,
  ROLE_LABEL,
  greeting,
  todayLabel,
} from "./helpers";

/* ---------------------------- StatCard ---------------------------- */

export function StatCard({ label, value, sub, icon: Icon, tone = "violet" }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -2 }}
      className="report-card p-5 pt-6 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {label}
          </p>
          <h3 className="text-2xl font-mono font-semibold text-foreground mt-2 truncate">
            {value}
          </h3>
          {sub ? (
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mt-1.5 truncate">
              {sub}
            </span>
          ) : null}
        </div>
        <div className={`stat-icon-box stat-icon-${tone}`}>
          <Icon size={20} />
        </div>
      </div>
    </motion.div>
  );
}

/* ---------------------------- PanelHeader ---------------------------- */

export function PanelHeader({ title, subtitle, href, action }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h3 className="text-base font-display font-semibold text-foreground">{title}</h3>
        {subtitle ? (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{subtitle}</p>
        ) : null}
      </div>
      {href ? (
        <Link
          href={href}
          className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:gap-1.5 transition-all dash-focus rounded-md"
        >
          {action || "View"} <ArrowRight size={13} />
        </Link>
      ) : null}
    </div>
  );
}

/* ---------------------------- QuickAction / QuickActionsBar ---------------------------- */

export function QuickAction({ href, label, icon: Icon, tone = "violet" }) {
  return (
    <Link href={href} className="group">
      <div className="flex items-center gap-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 hover:border-primary/50 hover:shadow-sm transition-all">
        <span className={`stat-icon-box stat-icon-${tone} !h-8 !w-8 !rounded-lg`}>
          <Icon size={15} />
        </span>
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">
          {label}
        </span>
        <ArrowUpRight
          size={13}
          className="ml-auto text-slate-300 dark:text-slate-600 group-hover:text-primary transition-colors"
        />
      </div>
    </Link>
  );
}

export function QuickActionsBar({ actions }) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {actions.map((a) => (
        <QuickAction key={a.href + a.label} {...a} />
      ))}
    </div>
  );
}

/* ---------------------------- EmptyRow ---------------------------- */

export function EmptyRow({ children }) {
  return <p className="text-xs text-slate-400 dark:text-slate-500 py-6 text-center">{children}</p>;
}

/* ---------------------------- UpcomingEvents ---------------------------- */

export function UpcomingEvents({ events }) {
  return (
    <div className="report-card p-5 pt-6 shadow-sm">
      <PanelHeader
        title="Upcoming events"
        subtitle="Next dates on the school calendar"
        href="/dashboard/events"
      />
      <div className="space-y-2.5">
        {(!events || events.length === 0) && <EmptyRow>No upcoming events scheduled.</EmptyRow>}
        {events?.slice(0, 5).map((e, i) => {
          const d = e.date ? new Date(e.date) : null;
          return (
            <div
              key={e._id || i}
              className="flex items-center gap-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 px-3 py-2.5"
            >
              <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="text-[9px] font-bold uppercase text-primary leading-none">
                  {d ? d.toLocaleDateString("en-US", { month: "short" }) : "—"}
                </span>
                <span className="text-sm font-mono font-bold text-foreground leading-tight">
                  {d ? d.getDate() : "?"}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                  {e.title || "Untitled event"}
                </p>
                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">
                  {e.category ? <span className="badge-tone badge-event">{e.category}</span> : null}
                  {e.start ? (
                    <span className="inline-flex items-center gap-1">
                      <Clock3 size={10} /> {e.start}
                    </span>
                  ) : null}
                  {e.location ? (
                    <span className="inline-flex items-center gap-1 truncate">
                      <MapPin size={10} /> {e.location}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------- FeeSnapshot ---------------------------- */

export function FeeSnapshot({ feeStats, loading }) {
  if (loading)
    return <div className="h-24 animate-pulse bg-slate-50 dark:bg-slate-800/40 rounded-xl" />;

  if (!feeStats)
    return (
      <div className="flex items-center gap-2 text-xs text-slate-400 py-4 justify-center">
        <AlertCircle size={14} /> Fee data unavailable.
      </div>
    );

  const cells = [
    { label: "Collected", value: formatINRCompact(feeStats.totalCollected), tone: "text-emerald-600 dark:text-emerald-400" },
    { label: "Pending", value: formatINRCompact(feeStats.totalPending), tone: "text-amber-600 dark:text-amber-400" },
    { label: "Collection rate", value: `${feeStats.collectionRate}%`, tone: "text-primary" },
    { label: "Fully paid", value: `${feeStats.statusBreakdown?.Paid ?? 0}`, tone: "text-slate-700 dark:text-slate-200" },
    { label: "Pending students", value: `${feeStats.statusBreakdown?.Pending ?? 0}`, tone: "text-slate-700 dark:text-slate-200" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {cells.map((c) => (
        <div
          key={c.label}
          className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 px-4 py-3"
        >
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {c.label}
          </p>
          <p className={`text-lg font-mono font-semibold mt-1 ${c.tone}`}>{c.value}</p>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------- DashboardHeader ---------------------------- */

export function DashboardHeader({ role, displayName, schoolName }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl md:text-3xl font-display font-semibold text-foreground tracking-tight truncate">
          {greeting()}, {displayName}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {ROLE_LABEL[role] || "Member"} · {schoolName} · {todayLabel()}
        </p>
      </div>
      <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 text-xs font-mono font-medium text-slate-600 dark:text-slate-300 shadow-sm self-start md:self-auto">
        <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
        <span>All services operational</span>
      </div>
    </div>
  );
}

/* ---------------------------- StatsGrid ---------------------------- */

export function StatsGrid({ loading, stats }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="report-card p-5 pt-6 h-[116px] animate-pulse">
            <div className="h-3 w-20 bg-slate-100 dark:bg-slate-800 rounded" />
            <div className="h-6 w-24 bg-slate-100 dark:bg-slate-800 rounded mt-3" />
            <div className="h-3 w-16 bg-slate-100 dark:bg-slate-800 rounded mt-3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
    >
      {stats.map((s) => (
        <StatCard key={s.label} {...s} />
      ))}
    </motion.div>
  );
}
