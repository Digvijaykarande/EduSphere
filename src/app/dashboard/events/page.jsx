"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  CalendarDays, 
  Users, 
  Megaphone, 
  CheckCircle2, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical,
  MapPin,
  Clock,
  Calendar,
  Sparkles,
  Trophy,
  BookOpen,
  Settings
} from "lucide-react";

// Mock Data for Event Overview
const eventStats = [
  { label: "Upcoming Events", value: "12", change: "Next 30 days", icon: CalendarDays, color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
  { label: "Total Registrations", value: "850+", change: "Across active events", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
  { label: "Pending Approvals", value: "3", change: "Requires admin review", icon: Megaphone, color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
  { label: "Past Events (YTD)", value: "45", change: "Successfully hosted", icon: CheckCircle2, color: "text-slate-600", bg: "bg-slate-100 border-slate-200" },
];

// Mock Data for the Events Table
const eventsList = [
  { id: "EVT-101", title: "Annual Sports Meet 2026", type: "Sports", date: "Aug 15 - Aug 18, 2026", time: "09:00 AM", venue: "Main Athletic Ground", status: "Upcoming", attendees: 450 },
  { id: "EVT-102", title: "Inter-School Science Fair", type: "Academic", date: "Sep 02, 2026", time: "10:00 AM", venue: "Innovation Block", status: "Upcoming", attendees: 120 },
  { id: "EVT-103", title: "Q2 Parent-Teacher Meeting", type: "Administrative", date: "Jul 20, 2026", time: "08:00 AM", venue: "Respective Classrooms", status: "Upcoming", attendees: 1200 },
  { id: "EVT-104", title: "Summer Coding Bootcamp", type: "Workshop", date: "Jul 05 - Jul 10, 2026", time: "10:00 AM", venue: "CS Lab 3", status: "Completed", attendees: 65 },
  { id: "EVT-105", title: "Cultural Fest: Rhythm '26", type: "Cultural", date: "Oct 24, 2026", time: "04:00 PM", venue: "Open Amphitheater", status: "Planning", attendees: 800 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

export default function AdminEventsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const getTypeBadge = (type) => {
    switch (type) {
      case "Sports":
        return <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-orange-600"><Trophy className="h-3 w-3" /> Sports</span>;
      case "Academic":
        return <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-600"><BookOpen className="h-3 w-3" /> Academic</span>;
      case "Cultural":
        return <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-purple-600"><Sparkles className="h-3 w-3" /> Cultural</span>;
      case "Administrative":
        return <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-600"><Settings className="h-3 w-3" /> Admin</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600"><Megaphone className="h-3 w-3" /> {type}</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Upcoming":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">UPCOMING</span>;
      case "Completed":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">COMPLETED</span>;
      case "Planning":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">PLANNING</span>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">Campus Events & Calendar</h1>
          <p className="text-sm text-slate-500 mt-1">Schedule activities, monitor registrations, and manage institutional calendar events.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm transition-all">
            <Calendar className="h-4 w-4" /> Calendar View
          </button>
          <button className="flex items-center gap-2 bg-[#3454d1] text-white hover:bg-blue-700 text-xs font-bold px-4 py-2.5 rounded-lg shadow-md transition-all">
            <Plus className="h-4 w-4" /> Create Event
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {eventStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div key={idx} variants={itemVariants} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-start gap-4">
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center border shrink-0 ${stat.bg}`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{stat.label}</p>
                <h3 className="text-2xl font-mono font-bold text-slate-900 mt-1">{stat.value}</h3>
                <p className="text-[11px] font-medium text-slate-400 mt-1">{stat.change}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Events Table Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden"
      >
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search events by title or venue..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#3454d1] focus:ring-2 focus:ring-blue-500/10 transition-all"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select className="bg-white border border-slate-200 text-slate-600 text-xs font-semibold px-3 py-2 rounded-lg focus:outline-none transition-all cursor-pointer">
              <option>All Types</option>
              <option>Academic</option>
              <option>Sports</option>
              <option>Cultural</option>
            </select>
            <button className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold px-4 py-2 rounded-lg transition-all">
              <Filter className="h-4 w-4" /> Filter
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                <th className="px-6 py-4 font-semibold">Event Details</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Date & Time</th>
                <th className="px-6 py-4 font-semibold">Location</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {eventsList.map((evt, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900 text-sm leading-tight">{evt.title}</p>
                    <p className="text-[11px] text-slate-500 font-mono mt-1">ID: {evt.id} • {evt.attendees} Registered</p>
                  </td>
                  <td className="px-6 py-4">
                    {getTypeBadge(evt.type)}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-slate-800 font-medium">{evt.date}</p>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                      <Clock className="h-3 w-3" /> {evt.time}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-700">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[150px]">{evt.venue}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(evt.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
          <span>Showing 1 to 5 of 45 events</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-slate-200 rounded hover:bg-white transition-colors disabled:opacity-50" disabled>Prev</button>
            <button className="px-3 py-1 border border-slate-200 rounded bg-white font-bold text-[#3454d1]">1</button>
            <button className="px-3 py-1 border border-slate-200 rounded hover:bg-white transition-colors">2</button>
            <button className="px-3 py-1 border border-slate-200 rounded hover:bg-white transition-colors">3</button>
            <button className="px-3 py-1 border border-slate-200 rounded hover:bg-white transition-colors">Next</button>
          </div>
        </div>

      </motion.div>
    </div>
  );
}