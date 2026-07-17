"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useSidebarStore } from "@/store/use-sidebar-store";
import {
  LayoutDashboard, GraduationCap, CalendarCheck,
  FileText, CreditCard, HelpCircle, Calendar,
  ChevronLeft, ChevronRight
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Attendance", href: "/dashboard/attendance", icon: CalendarCheck },
  { label: "Academics", href: "/dashboard/academics", icon: GraduationCap },
  { label: "Exams", href: "/dashboard/exams", icon: FileText },
  { label: "Fees", href: "/dashboard/fees", icon: CreditCard },
  { label: "Events", href: "/dashboard/events", icon: Calendar },
  { label: "Support", href: "/dashboard/support", icon: HelpCircle },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, toggleSidebar } = useSidebarStore();

  return (
    <motion.div
      animate={{ width: isOpen ? "260px" : "80px" }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="hidden md:flex flex-col h-screen bg-sidebar-bg text-sidebar-text border-r border-white/5 relative z-20 shrink-0 select-none"
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 border-b border-white/5 justify-between">
        {isOpen ? (
          <div className="flex items-center gap-2.5 text-white font-display font-semibold text-lg">
            <div className="h-8 w-8 rounded-full stamp-badge text-gold shrink-0">
              <GraduationCap size={16} className="text-gold" />
            </div>
            <span>EduSphere</span>
          </div>
        ) : (
          <div className="h-8 w-8 rounded-full stamp-badge text-gold mx-auto">
            <GraduationCap size={16} className="text-gold" />
          </div>
        )}

        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-5 bg-gold text-sidebar-bg p-1 rounded-full border border-sidebar-bg shadow-md hover:brightness-110 transition-all"
        >
          {isOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
        </button>
      </div>

      {/* Navigation Roster */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href} passHref>
              <div
                className={`relative flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer group ${
                  isActive
                    ? "text-white"
                    : "hover:bg-sidebar-hover hover:text-slate-100"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavPill"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    className="absolute inset-0 bg-sidebar-hover rounded-lg border-l-2 border-gold"
                  />
                )}
                <Icon className={`relative h-[18px] w-[18px] shrink-0 ${isActive ? "text-gold" : "text-sidebar-text group-hover:text-slate-200"}`} />
                {isOpen && <span className="relative">{item.label}</span>}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer System Version */}
      {isOpen && (
        <div className="p-6 border-t border-white/5 text-[11px] text-sidebar-text/70 tracking-wide font-mono">
          SYSTEM v1.0.0
        </div>
      )}
    </motion.div>
  );
}