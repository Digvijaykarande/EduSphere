"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  Wallet, 
  Search, 
  Filter, 
  Plus, 
  Download,
  MoreVertical,
  CheckCircle2,
  Clock
} from "lucide-react";

// Mock Data for Financial Overview
const feeStats = [
  { label: "Total Collected", value: "₹4.8M", change: "+12.5% this month", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
  { label: "Pending Dues", value: "₹850K", change: "142 students pending", icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
  { label: "Expected Revenue", value: "₹5.65M", change: "Term 2 Projections", icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
  { label: "Recent Refunds", value: "₹24K", change: "3 disputes resolved", icon: Wallet, color: "text-slate-600", bg: "bg-slate-100 border-slate-200" },
];

// Mock Data for the Ledger Table
const transactions = [
  { id: "INV-2026-9041", student: "Aarav Sharma", studentId: "EGS-104", grade: "Grade 10-A", amount: "₹45,000", date: "Jul 10, 2026", status: "Paid", method: "Credit Card" },
  { id: "INV-2026-9042", student: "Priya Desai", studentId: "EGS-219", grade: "Grade 12-B", amount: "₹52,000", date: "Jul 09, 2026", status: "Pending", method: "Bank Transfer" },
  { id: "INV-2026-9043", student: "Rohan Gupta", studentId: "EGS-084", grade: "Grade 8-C", amount: "₹38,000", date: "Jul 05, 2026", status: "Overdue", method: "Cash" },
  { id: "INV-2026-9044", student: "Ananya Singh", studentId: "EGS-302", grade: "Grade 11-A", amount: "₹48,000", date: "Jul 11, 2026", status: "Paid", method: "UPI" },
  { id: "INV-2026-9045", student: "Kabir Khan", studentId: "EGS-115", grade: "Grade 9-B", amount: "₹42,000", date: "Jul 11, 2026", status: "Paid", method: "Credit Card" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

export default function FeesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusBadge = (status) => {
    switch (status) {
      case "Paid":
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 className="h-3 w-3" /> PAID</span>;
      case "Pending":
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200"><Clock className="h-3 w-3" /> PENDING</span>;
      case "Overdue":
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200"><AlertCircle className="h-3 w-3" /> OVERDUE</span>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">Fee Collection & Ledger</h1>
          <p className="text-sm text-slate-500 mt-1">Manage student billing, track pending dues, and process digital receipts.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm transition-all">
            <Download className="h-4 w-4" /> Export Report
          </button>
          <button className="flex items-center gap-2 bg-[#3454d1] text-white hover:bg-blue-700 text-xs font-bold px-4 py-2.5 rounded-lg shadow-md transition-all">
            <Plus className="h-4 w-4" /> Generate Invoice
          </button>
        </div>
      </div>

      {/* Financial Stats Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {feeStats.map((stat, idx) => {
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

      {/* Ledger Table Section */}
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
              placeholder="Search by student name or invoice ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#3454d1] focus:ring-2 focus:ring-blue-500/10 transition-all"
            />
          </div>
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold px-4 py-2 rounded-lg transition-all">
            <Filter className="h-4 w-4" /> Filter Records
          </button>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                <th className="px-6 py-4 font-semibold">Invoice ID</th>
                <th className="px-6 py-4 font-semibold">Student Info</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Date / Method</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {transactions.map((tx, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs font-bold text-slate-700">{tx.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900 text-xs">{tx.student}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{tx.studentId} • {tx.grade}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono font-bold text-slate-900">{tx.amount}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-slate-700 font-medium">{tx.date}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{tx.method}</p>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(tx.status)}
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
          <span>Showing 1 to 5 of 142 records</span>
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