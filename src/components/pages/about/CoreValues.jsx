import React from "react";
import { Target, Heart, Globe, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

export function CoreValues() {
  const coreValues = [
    { title: "Academic Rigor", desc: "Unwavering commitment to conceptual clarity, critical problem solving, and standard evaluation excellence.", icon: Target, color: "text-[#3454d1] bg-blue-50" },
    { title: "Empathetic Community", desc: "Fostering inclusive values where student mental health, safety, and mutual respect form our baseline.", icon: Heart, color: "text-red-500 bg-red-50" },
    { title: "Global Orientation", desc: "Preparing students with digital readiness, global cultural exposure, and sustainable leadership skills.", icon: Globe, color: "text-emerald-600 bg-emerald-50" },
    { title: "Innovation & Discovery", desc: "Encouraging curiosity through modern robotics labs, artistic expression, and interdisciplinary research.", icon: Sparkles, color: "text-[#c99a3f] bg-amber-50" },
  ];

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-[#3454d1]">Guiding Pillars</span>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Our Core Institutional Values</h2>
        <p className="text-[11px] md:text-xs text-slate-500 mt-2">Principles that shape our daily interactions, policy decisions, and academic strategies.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {coreValues.map((v, idx) => {
          const Icon = v.icon;
          return (
            <Card key={idx} className="bg-white p-5 md:p-6 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-[#3454d1] transition-colors text-card-foreground">
              <div>
                <div className={`h-10 w-10 ${v.color} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm md:text-base">{v.title}</h4>
                <p className="text-[11px] md:text-xs text-slate-500 mt-2 leading-relaxed">{v.desc}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}