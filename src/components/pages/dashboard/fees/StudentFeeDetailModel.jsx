// src/components/pages/dashboard/fees/StudentFeeDetailModel.jsx
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Edit3, Save, X } from "lucide-react";
import { StudentAvatar, StatusBadge } from "./shared";
import { Input } from "@/components/ui/input";

export default function StudentFeeDetailModal({ student, onClose }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(student);

  // Reset form if a different student is selected while the modal is open
  useEffect(() => {
    setFormData(student);
    setIsEditing(false);
  }, [student]);

  if (!student) return null;

  const handleSave = () => {
    console.log("Saved Student Data:", formData);
    // Add your API save logic here
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        
        {isEditing ? (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                setFormData(student); // Reset changes
                setIsEditing(false);
              }}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1 rounded-md transition-colors"
            >
              <X className="h-3.5 w-3.5" /> Cancel
            </button>
            <button 
              onClick={handleSave}
              className="flex items-center gap-1.5 text-xs font-bold text-white bg-primary hover:bg-primary/90 px-3 py-1.5 rounded-lg shadow-sm transition-colors"
            >
              <Save className="h-3.5 w-3.5" /> Save
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:bg-primary/10 px-2 py-1 rounded-md transition-colors"
          >
            <Edit3 className="h-3.5 w-3.5" /> Edit Student
          </button>
        )}
      </div>

      {/* Profile Header */}
      <div className="flex items-center gap-4">
        <StudentAvatar name={formData.name} src={formData.avatar} className="w-16 h-16" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {isEditing ? (
              <Input 
                value={formData.name} 
                onChange={(e) => handleChange("name", e.target.value)} 
                className="h-7 text-sm font-bold w-full max-w-[200px]"
              />
            ) : (
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{formData.name}</h3>
            )}
            {!isEditing && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">Active</span>}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Roll No: {formData.rollNo} • Class {formData.class}
          </p>
        </div>
      </div>

      {/* Quick Fee Highlights Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Fees</p>
          <p className="text-lg font-mono font-bold text-slate-900 dark:text-white mt-1">₹{formData.totalFees.toLocaleString()}</p>
        </div>
        <div className="bg-emerald-500/5 p-3.5 rounded-xl border border-emerald-500/10">
          <p className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">Paid Amount</p>
          <p className="text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1">₹{formData.paidAmount.toLocaleString()}</p>
        </div>
        <div className="bg-amber-500/5 p-3.5 rounded-xl border border-amber-500/10">
          <p className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 tracking-wider">Pending</p>
          <p className="text-lg font-mono font-bold text-amber-600 dark:text-amber-400 mt-1">₹{formData.pendingAmount.toLocaleString()}</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-center">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Status</p>
          <div>
            <StatusBadge status={formData.status} />
          </div>
        </div>
      </div>

      {/* Editable Contact & Fee Details */}
      <div className="space-y-2 pt-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Student Details</h4>
        <div className="text-xs space-y-2.5 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60">
          
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Admission No</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">{formData.id}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Guardian Name</span>
            {isEditing ? (
              <Input 
                value={formData.guardianName} 
                onChange={(e) => handleChange("guardianName", e.target.value)} 
                className="h-7 w-40 text-xs text-right font-semibold"
              />
            ) : (
              <span className="font-semibold text-slate-900 dark:text-white">{formData.guardianName}</span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Phone Number</span>
            {isEditing ? (
              <Input 
                value={formData.phone} 
                onChange={(e) => handleChange("phone", e.target.value)} 
                className="h-7 w-40 text-xs text-right font-medium"
              />
            ) : (
              <span className="font-medium text-slate-900 dark:text-white">{formData.phone}</span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Email Address</span>
            {isEditing ? (
              <Input 
                value={formData.email} 
                onChange={(e) => handleChange("email", e.target.value)} 
                className="h-7 w-48 text-xs text-right font-medium"
              />
            ) : (
              <span className="font-medium text-slate-900 dark:text-white">{formData.email}</span>
            )}
          </div>
          
        </div>
      </div>

      {/* Particulars Fee Structure Breakdown Table */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Fees Structure (Class {formData.class})
        </h4>
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="px-4 py-2.5">Particulars</th>
                <th className="px-4 py-2.5 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {formData.breakdown.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="px-4 py-2.5 font-medium">{item.particular}</td>
                  <td className="px-4 py-2.5 text-right font-mono font-semibold">{item.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50/80 dark:bg-slate-800/80 font-bold border-t border-slate-200 dark:border-slate-700">
              <tr>
                <td className="px-4 py-3 text-slate-900 dark:text-white">Total Fees</td>
                <td className="px-4 py-3 text-right font-mono text-primary text-sm">₹{formData.totalFees.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}