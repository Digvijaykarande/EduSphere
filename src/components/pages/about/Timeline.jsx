import React from "react";
import { Card } from "@/components/ui/card";

export function Timeline() {
  const milestones = [
    { year: "2001", title: "Foundation Laid", desc: "Established with a single campus block and an initial cohort of 120 primary students." },
    { year: "2010", title: "Senior Secondary Expansion", desc: "Introduced advanced Science & Commerce streams with state-of-the-art laboratory complexes." },
    { year: "2018", title: "Digital ERP Transformation", desc: "Pioneered smart classrooms, biometric access corridors, and cloud-integrated student tracking." },
    { year: "2026", title: "Global Accreditation", desc: "Recognized among top regional schools with 4,000+ active students and 150+ expert faculty members." },
  ];

  return (
    <section className="py-16 md:py-20 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#c99a3f]">Our Journey</span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-1">Milestones Over the Decades</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {milestones.map((m, idx) => (
            <Card key={idx} className="bg-white/5 border border-white/10 p-5 md:p-6 rounded-2xl text-white shadow-none">
              <span className="text-xl md:text-2xl font-mono font-bold text-[#c99a3f] block mb-1">{m.year}</span>
              <h4 className="font-bold text-white text-xs md:text-sm">{m.title}</h4>
              <p className="text-[11px] md:text-xs text-slate-400 mt-2 leading-relaxed">{m.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}