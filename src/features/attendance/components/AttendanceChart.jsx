"use client";

import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const data = [
  { name: "Mon", rate: 94 },
  { name: "Tue", rate: 96 },
  { name: "Wed", rate: 92 },
  { name: "Thu", rate: 97 },
  { name: "Fri", rate: 95 },
];

export default function AttendanceChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3454d1" stopOpacity={0.22} />
              <stop offset="95%" stopColor="#3454d1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef1f6" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#8891a8" style={{ fontSize: "12px", fontFamily: "var(--font-mono)" }} />
          <YAxis domain={[80, 100]} axisLine={false} tickLine={false} stroke="#8891a8" style={{ fontSize: "12px", fontFamily: "var(--font-mono)" }} />
          <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e1e5ee", borderRadius: "8px", fontFamily: "var(--font-body)" }} />
          <Area type="monotone" dataKey="rate" stroke="#3454d1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRate)" name="Attendance %" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}