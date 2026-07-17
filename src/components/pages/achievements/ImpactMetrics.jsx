"use client";

import React, { useRef, useState, useEffect } from "react";
import { useInView } from "framer-motion";
import { Award, GraduationCap, Trophy, Microscope } from "lucide-react";
import { Card } from "@/components/ui/card";

const AnimatedStat = ({ value }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const [display, setDisplay] = useState("");

  useEffect(() => {
    const rawNumber = value.match(/\d+/);
    if (!rawNumber || !inView) {
      setDisplay(value);
      return;
    }

    const target = parseInt(rawNumber[0], 10);
    let startTimestamp = null;
    const duration = 2000;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const calculated = Math.floor(easeOut * target);

      setDisplay(value.replace(/\d+/, calculated));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setDisplay(value);
      }
    };

    requestAnimationFrame(step);
  }, [inView, value]);

  return <span ref={ref}>{display}</span>;
};

export function ImpactMetrics() {
  const stats = [
    { label: "National Awards", val: "45+", icon: Award, color: "text-[#c99a3f]" },
    { label: "Board Top Rankers", val: "120+", icon: GraduationCap, color: "text-[#3454d1]" },
    { label: "Sports Championships", val: "30+", icon: Trophy, color: "text-emerald-500" },
    { label: "Innovation Grants", val: "15+", icon: Microscope, color: "text-purple-500" },
  ];

  return (
    <section className="py-8 border-b border-slate-200/80 relative -mt-8 mx-4 sm:mx-auto max-w-5xl z-20">
      <Card className="bg-white rounded-2xl shadow-xl border-none">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 px-4 md:px-6 py-2">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="text-center p-2 md:p-4">
                <Icon className={`h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 md:mb-3 ${stat.color}`} />
                <h3 className="font-mono text-2xl md:text-3xl font-bold text-slate-900">
                  <AnimatedStat value={stat.val} />
                </h3>
                <p className="text-[9px] md:text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </Card>
    </section>
  );
}