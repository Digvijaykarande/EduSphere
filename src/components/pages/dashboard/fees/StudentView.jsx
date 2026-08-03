"use client";

import { motion } from "framer-motion";
import { 
  Clock, 
  CreditCard, 
  Download, 
  CheckCircle2, 
  Receipt, 
  ShieldCheck, 
  PieChart, 
  ArrowRight,
  Smartphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StudentAvatar } from "./shared";
import { studentTransactions } from "./mockData";
import { formatINR } from "@/lib/formatCurrency";

const currentStudent = {
  name: "Aarav Sharma",
  rollNo: "101",
  class: "10-A",
  avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
  totalFees: 25000,
  paidAmount: 20000,
  pendingAmount: 5000,
  nextDueDate: "31 May 2025",
};

// New mock data for the added breakdown section
const feeBreakdown = [
  { category: "Tuition Fee", amount: 15000, paid: 15000 },
  { category: "Library & Lab", amount: 5000, paid: 5000 },
  { category: "Transport", amount: 5000, paid: 0 },
];

export default function StudentView() {
  const percentPaid = Math.round((currentStudent.paidAmount / currentStudent.totalFees) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-5xl mx-auto space-y-6"
    >
      {/* =========================================================
          STUDENT PROFILE OVERVIEW (UNTOUCHED)
          ========================================================= */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        
        {/* Decorative Background Glow */}
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <StudentAvatar
            name={currentStudent.name}
            src={currentStudent.avatar}
            className="h-16 w-16 border-2 border-primary/50 shadow-lg"
          />
          <div>
            <h2 className="text-xl font-bold tracking-tight">{currentStudent.name}</h2>
            <p className="text-xs text-indigo-200 mt-0.5 font-medium">
              Roll No: {currentStudent.rollNo} • Class {currentStudent.class}
            </p>
            <span className="inline-flex mt-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
              Active Student
            </span>
          </div>
        </div>

        {/* =========================================================
            DYNAMIC FEE METRIC SECTION (UPGRADED)
            ========================================================= */}
        <div className="mt-8 pt-6 border-t border-indigo-800/50 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
              <PieChart className="h-4 w-4" /> Academic Year 2025-26
            </span>
            <span className="text-[11px] font-medium text-indigo-200 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
              {percentPaid}% Cleared
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Glassmorphic Stat Card 1: Total & Paid */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-indigo-200 font-bold mb-1">Total Fees</p>
                  <p className="text-xl font-mono font-bold text-white">{formatINR(currentStudent.totalFees)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider text-emerald-300 font-bold mb-1">Paid</p>
                  <p className="text-xl font-mono font-bold text-emerald-400">{formatINR(currentStudent.paidAmount)}</p>
                </div>
              </div>
              {/* Mini Progress Bar */}
              <div className="h-1.5 w-full bg-indigo-950/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full" 
                  style={{ width: `${percentPaid}%` }} 
                />
              </div>
            </div>

            {/* Glassmorphic Stat Card 2: Pending Amount */}
            <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-md rounded-2xl p-4 border border-amber-500/20 flex flex-col justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-amber-300 font-bold mb-1">Pending Amount</p>
                <p className="text-3xl font-mono font-bold text-amber-400">{formatINR(currentStudent.pendingAmount)}</p>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-amber-200/80 mt-2">
                <Clock className="h-3.5 w-3.5" /> Due by {currentStudent.nextDueDate}
              </div>
            </div>

            {/* Glassmorphic Stat Card 3: Action / CTA */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col justify-center gap-3">
               <p className="text-xs text-indigo-200 font-medium text-center">
                 {currentStudent.pendingAmount === 0 
                   ? "You're all caught up for this term!" 
                   : "Clear your pending dues to avoid late fees."}
               </p>
               <Button
                className={`w-full rounded-xl font-bold text-sm h-11 transition-all shadow-lg ${
                  currentStudent.pendingAmount === 0 
                    ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30" 
                    : "bg-white text-indigo-900 hover:bg-slate-100"
                }`}
                disabled={currentStudent.pendingAmount === 0}
              >
                {currentStudent.pendingAmount === 0 ? (
                  <><CheckCircle2 className="w-4 h-4 mr-2" /> Fully Paid</>
                ) : (
                  <><CreditCard className="w-4 h-4 mr-2" /> Pay {formatINR(currentStudent.pendingAmount)}</>
                )}
              </Button>
            </div>

          </div>
        </div>
      </div>

      {/* =========================================================
          NEW SECTIONS: BREAKDOWN, TRANSACTIONS, ACTIONS
          ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Breakdown & Actions */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Fee Structure Breakdown */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-foreground mb-5 flex items-center gap-2">
              <Receipt className="h-4 w-4 text-primary" /> Fee Breakdown
            </h3>
            <div className="space-y-4">
              {feeBreakdown.map((item, i) => {
                const isFullyPaid = item.paid === item.amount;
                return (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between items-end text-xs">
                      <span className="font-semibold text-foreground">{item.category}</span>
                      <span className="font-mono text-muted-foreground">{formatINR(item.amount)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${isFullyPaid ? 'bg-success' : 'bg-warning'}`} 
                          style={{ width: `${(item.paid / item.amount) * 100}%` }} 
                        />
                      </div>
                      <span className={`text-[10px] font-bold ${isFullyPaid ? 'text-success' : 'text-warning'}`}>
                        {isFullyPaid ? "Paid" : "Pending"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions / Payment Methods */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3.5 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/30 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary">
                    <Download className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-foreground">Tax Certificate</p>
                    <p className="text-[10px] text-muted-foreground">Download Section 80G</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
              
              <button className="w-full flex items-center justify-between p-3.5 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/30 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary">
                    <Smartphone className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-foreground">Manage AutoPay</p>
                    <p className="text-[10px] text-muted-foreground">UPI & Saved Cards</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Recent Transactions */}
        <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-base font-bold text-foreground">Recent Fee Transactions</h3>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-success" /> 256-bit encrypted secure payments
              </p>
            </div>
            <Button variant="outline" size="sm" className="h-8 text-xs font-semibold rounded-lg gap-2">
              <Download className="h-3.5 w-3.5" /> All Receipts
            </Button>
          </div>

          <div className="divide-y divide-border flex-1">
            {studentTransactions.map((tx, idx) => (
              <div key={idx} className="py-4 flex items-center justify-between gap-3 group">
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 transition-colors ${
                      tx.status === "Success" 
                        ? "bg-success/10 text-success group-hover:bg-success/20" 
                        : "bg-warning/10 text-warning group-hover:bg-warning/20"
                    }`}
                  >
                    {tx.status === "Success" ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{tx.title}</p>
                    <p className="text-[11px] font-medium text-muted-foreground mt-0.5">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-mono font-extrabold text-foreground">{tx.amount}</p>
                  <span
                    className={`inline-flex items-center mt-1 px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider ${
                      tx.status === "Success" 
                        ? "border-success/30 bg-success/10 text-success" 
                        : "border-warning/30 bg-warning/10 text-warning"
                    }`}
                  >
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </motion.div>
  );
}