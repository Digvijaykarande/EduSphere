"use client";

import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const data = [
  { group: "A+", count: 12 },
  { group: "A", count: 28 },
  { group: "B+", count: 45 },
  { group: "B", count: 22 },
  { group: "C", count: 8 },
  { group: "F", count: 3 },
];

export default function GradeAnalyticsChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef1f6" />
          <XAxis dataKey="group" axisLine={false} tickLine={false} stroke="#8891a8" style={{ fontSize: "12px", fontFamily: "var(--font-mono)" }} />
          <YAxis axisLine={false} tickLine={false} stroke="#8891a8" style={{ fontSize: "12px", fontFamily: "var(--font-mono)" }} />
          <Tooltip cursor={{ fill: "#eef1f6" }} contentStyle={{ background: "#fff", border: "1px solid #e1e5ee", borderRadius: "8px", fontFamily: "var(--font-body)" }} />
          <Bar dataKey="count" fill="#c99a3f" radius={[4, 4, 0, 0]} name="Students" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}