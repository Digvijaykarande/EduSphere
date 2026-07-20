"use client";

import React, { useEffect } from "react";
import Sidebar from "@/components/pages/dashboard/Sidebar";
import Navbar from "@/components/pages/dashboard/Navbar";
import { useSidebarStore } from "@/store/use-sidebar-store";
import { useThemeStore } from "@/store/use-theme-store";

export default function DashboardLayout({ children }) {
  const isOpen = useSidebarStore((state) => state.isOpen);
  const hydrate = useThemeStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main App Content Viewport */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {/* Top Navbar */}
        <Navbar />

        {/* Dynamic Inner Page Router */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50 dark:bg-slate-950 transition-colors">
          {children}
        </main>
      </div>
    </div>
  );
}