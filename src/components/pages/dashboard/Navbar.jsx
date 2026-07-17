"use client";

import React, { useState } from "react";
import { useSidebarStore } from "@/store/use-sidebar-store";
import { useAuthStore } from "@/store/use-auth-store";
import { Menu, Bell, Search, ChevronDown, LogOut, User } from "lucide-react";

export default function Navbar() {
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);
  const user = useAuthStore((state) => state.user) || { name: "Professor Digvijay", role: "Faculty Admin" };
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 z-10 select-none">
      {/* Search Bar & Mobile Nav Toggle */}
      <div className="flex items-center gap-4 w-96">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-secondary hover:bg-slate-100 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <div className="relative w-full hidden sm:block">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search records, tickets, or schedules..."
            className="w-full bg-background border border-slate-200 rounded-lg py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:border-primary transition-colors text-foreground placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Control Utility Layer */}
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-lg text-secondary hover:bg-slate-100 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-destructive rounded-full ring-2 ring-white" />
        </button>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-slate-50 transition-colors text-left"
          >
            <div className="h-8 w-8 rounded-full bg-sidebar-bg flex items-center justify-center text-gold text-sm font-display font-semibold ring-2 ring-gold/30">
              {user.name.charAt(0)}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-foreground leading-tight">{user.name}</p>
              <p className="text-xs text-slate-400 font-normal">{user.role}</p>
            </div>
            <ChevronDown size={14} className="text-slate-400 hidden md:block" />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-20 animate-in fade-in slide-in-from-top-2 duration-150">
                <button
                  onClick={() => setDropdownOpen(false)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-secondary hover:bg-slate-50 transition-colors text-left"
                >
                  <User size={16} />
                  <span>My profile</span>
                </button>
                <hr className="border-slate-100 my-1" />
                <button
                  onClick={() => setDropdownOpen(false)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-red-50 transition-colors text-left font-medium"
                >
                  <LogOut size={16} />
                  <span>Sign out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}