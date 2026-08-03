"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
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
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap ${
        STATUS_STYLES[status] || STATUS_STYLES.Pending
      }`}
    >
      {status}
    </span>
  );
}

// ------------------------------------------------------------------
// 3. STAT CARD COMPONENT (Ultra-Minimalist & Modern)
// ------------------------------------------------------------------
export function StatCard({ label, value, change, trend, icon: Icon }) {
  const isPositive = trend === "up";
  const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;
  
  // Clean, soft text colors for the trend indicator
  const trendColorClass = isPositive 
    ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10" 
    : "text-rose-600 dark:text-rose-400 bg-rose-500/10";

  return (
    <Card className="flex flex-col justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-sm hover:shadow-md transition-shadow h-[115px]">
      
      {/* Top Label & Tiny Accent Icon */}
      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-3">
        {Icon && <Icon className="h-4 w-4 stroke-[2px]" />}
        <p className="text-xs font-semibold uppercase tracking-wider">{label}</p>
      </div>

      {/* Main Big Value */}
      <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
        {value}
      </h3>

      {/* Bottom Subtle Trend */}
      <div className="mt-auto flex items-center">
        <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-xs font-bold ${trendColorClass}`}>
          <TrendIcon className="h-3.5 w-3.5 mr-0.5" strokeWidth={2.5} />
          {change}
        </span>
      </div>
      
    </Card>
  );
}