"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getInitials } from "@/lib/formatCurrency";

// ------------------------------------------------------------------
// 1. STUDENT AVATAR COMPONENT
// ------------------------------------------------------------------
export function StudentAvatar({ name, src, className = "h-8 w-8" }) {
  return (
    <Avatar className={`${className} border border-border shadow-sm`}>
      <AvatarImage src={src} alt={name} className="object-cover" />
      <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}

// ------------------------------------------------------------------
// 2. STATUS BADGE COMPONENT
// ------------------------------------------------------------------
const STATUS_STYLES = {
  Paid: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  "Partial Paid": "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  Pending: "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400",
};

export function StatusBadge({ status }) {
  return (
    <Badge
      variant="outline"
      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap ${
        STATUS_STYLES[status] || STATUS_STYLES.Pending
      }`}
    >
      {status}
    </Badge>
  );
}

// ------------------------------------------------------------------
// 3. STAT CARD COMPONENT — matches the Attendance dashboard KPI style:
//    a colored left accent bar, a small tinted icon square, a bold
//    number on top, an uppercase label, and a muted subtext line.
// ------------------------------------------------------------------
const STAT_TONES = {
  violet: {
    bar: "bg-violet-500",
    iconBg: "bg-violet-50 dark:bg-violet-500/10",
    iconText: "text-violet-600 dark:text-violet-400",
  },
  blue: {
    bar: "bg-indigo-500",
    iconBg: "bg-indigo-50 dark:bg-indigo-500/10",
    iconText: "text-indigo-600 dark:text-indigo-400",
  },
  green: {
    bar: "bg-emerald-500",
    iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
    iconText: "text-emerald-600 dark:text-emerald-400",
  },
  orange: {
    bar: "bg-amber-500",
    iconBg: "bg-amber-50 dark:bg-amber-500/10",
    iconText: "text-amber-600 dark:text-amber-400",
  },
};

export function StatCard({ label, value, change, icon: Icon, tone = "violet" }) {
  const t = STAT_TONES[tone] || STAT_TONES.violet;

  return (
    <Card className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-0 shadow-sm">
      {/* Left accent bar */}
      <span className={`absolute left-0 top-0 h-full w-1 ${t.bar}`} />

      <div className="flex items-start gap-3 py-4 pl-5 pr-4">
        {Icon && (
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${t.iconBg} ${t.iconText}`}>
            <Icon className="h-4.5 w-4.5" strokeWidth={2} />
          </span>
        )}

        <div className="min-w-0">
          <h3 className="text-2xl font-bold leading-none tracking-tight text-slate-900 dark:text-white">
            {value}
          </h3>
          <p className="mt-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {label}
          </p>
          {change ? (
            <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500 truncate">{change}</p>
          ) : null}
        </div>
      </div>
    </Card>
  );
}