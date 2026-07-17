"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  LifeBuoy, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical,
  MessageSquare,
  User,
  Tag
} from "lucide-react";

// Mock Data for Support Overview
const supportStats = [
  { label: "Active Tickets", value: "24", change: "4 created today", icon: LifeBuoy, color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
  { label: "Urgent Issues", value: "3", change: "Requires immediate action", icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50 border-rose-100" },
  { label: "Resolved (This Week)", value: "142", change: "+12% resolution rate", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
  { label: "Avg Response Time", value: "1.4h", change: "Within SLA targets", icon: Clock, color: "text-purple-600", bg: "bg-purple-50 border-purple-100" },
];

// Mock Data for the Ticketing Ledger
const ticketsList = [
  { id: "TCK-8091", subject: "Unable to access mid-term grade portal", requester: "Rahul Verma", role: "Student", category: "IT / Portal", priority: "High", status: "Open", time: "10 mins ago" },
  { id: "TCK-8090", subject: "Fee receipt #9401 not generating PDF", requester: "Sunita Desai", role: "Parent", category: "Finance", priority: "Medium", status: "In Progress", time: "2 hours ago" },
  { id: "TCK-8089", subject: "Library card renewal issue", requester: "Amit Patel", role: "Student", category: "Administrative", priority: "Low", status: "Open", time: "4 hours ago" },
  { id: "TCK-8088", subject: "Smartboard not syncing in Room 402", requester: "Prof. Dattatray", role: "Faculty", category: "IT / Hardware", priority: "High", status: "Resolved", time: "1 day ago" },
  { id: "TCK-8087", subject: "Update transport route for next month", requester: "Kavita Rao", role: "Parent", category: "Transport", priority: "Medium", status: "Resolved", time: "2 days ago" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

export default function SupportPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "High":
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200"><AlertCircle className="h-3 w-3" /> HIGH</span>;
      case "Medium":
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">MEDIUM</span>;
      case "Low":
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">LOW</span>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Open":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">OPEN</span>;
      case "In Progress":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">IN PROGRESS</span>;
      case "Resolved":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">RESOLVED</span>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">Helpdesk & Support</h1>
          <p className="text-sm text-slate-500 mt-1">Manage incoming tickets, resolve user issues, and monitor SLA performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-[#3454d1] text-white hover:bg-blue-700 text-xs font-bold px-4 py-2.5 rounded-lg shadow-md transition-all">
            <Plus className="h-4 w-4" /> Create Ticket
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
        {supportStats.map((stat, idx) => {
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

      {/* Tickets Table Section */}
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
              placeholder="Search by ticket ID, subject, or requester..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#3454d1] focus:ring-2 focus:ring-blue-500/10 transition-all"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select className="bg-white border border-slate-200 text-slate-600 text-xs font-semibold px-3 py-2 rounded-lg focus:outline-none transition-all cursor-pointer">
              <option>All Statuses</option>
              <option>Open</option>
              <option>In Progress</option>
              <option>Resolved</option>
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
                <th className="px-6 py-4 font-semibold">Ticket Details</th>
                <th className="px-6 py-4 font-semibold">Requester</th>
                <th className="px-6 py-4 font-semibold">Category / Priority</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {ticketsList.map((ticket, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900 text-sm leading-tight flex items-start gap-2">
                      {ticket.subject}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] font-mono text-slate-500">
                      <span>{ticket.id}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {ticket.time}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                        <User className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-xs">{ticket.requester}</p>
                        <p className="text-[10px] text-slate-500">{ticket.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Tag className="h-3 w-3 text-slate-400" /> {ticket.category}
                    </div>
                    <div>{getPriorityBadge(ticket.priority)}</div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(ticket.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#3454d1] hover:bg-blue-50 rounded-md transition-colors border border-transparent hover:border-blue-100">
                      <MessageSquare className="h-3.5 w-3.5" /> Reply
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors ml-1">
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
          <span>Showing 1 to 5 of 24 open tickets</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-slate-200 rounded hover:bg-white transition-colors disabled:opacity-50" disabled>Prev</button>
            <button className="px-3 py-1 border border-slate-200 rounded bg-white font-bold text-[#3454d1]">1</button>
            <button className="px-3 py-1 border border-slate-200 rounded hover:bg-white transition-colors">2</button>
            <button className="px-3 py-1 border border-slate-200 rounded hover:bg-white transition-colors">Next</button>
          </div>
        </div>

      </motion.div>
    </div>
  );
}