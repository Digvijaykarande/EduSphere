import React from "react";
import { Award, Trophy, Microscope, Target } from "lucide-react";
import { Card } from "@/components/ui/card";

export function MajorAccolades() {
  const awards = [
    { 
      year: "2026", 
      category: "Academics", 
      title: "National Standard Curriculums Excellence Seal", 
      desc: "Awarded by central regulatory panels recognizing exceptional pedagogical metric standard delivery values and a 100% board exam pass rate.",
      icon: Award,
      theme: "bg-blue-50 text-[#3454d1] border-blue-200"
    },
    { 
      year: "2025", 
      category: "Sports", 
      title: "State Football Championship Gold Cup", 
      desc: "Secured first rank consistently across comprehensive institutional level knockout championship rounds for the Under-19 category.",
      icon: Trophy,
      theme: "bg-amber-50 text-[#c99a3f] border-amber-200"
    },
    { 
      year: "2025", 
      category: "Technology", 
      title: "Innovative Digital Classroom Deployment Honor", 
      desc: "Recognized as a premier forward-integrated school integrating operational LMS nodes to standard learning channels and smart campuses.",
      icon: Microscope,
      theme: "bg-purple-50 text-purple-600 border-purple-200"
    },
    { 
      year: "2024", 
      category: "Academics", 
      title: "Best Regional STEM Program", 
      desc: "Honored for outstanding contributions to science and mathematics education, featuring our newly integrated robotics and AI labs.",
      icon: Target,
      theme: "bg-emerald-50 text-emerald-600 border-emerald-200"
    },
  ];

  return (
    <section className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
      <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
        <span className="text-xs font-bold uppercase tracking-wider text-[#3454d1]">Trophy Cabinet</span>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Major Accolades</h2>
        <p className="text-[11px] md:text-xs text-slate-500 mt-2">A curated selection of our most prestigious institutional awards and recognitions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {awards.map((aw, idx) => {
          const Icon = aw.icon;
          return (
            <Card key={idx} className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all group text-card-foreground">
              <div className="flex items-start justify-between mb-5">
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center border ${aw.theme}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                  {aw.year} • {aw.category}
                </span>
              </div>
              <h4 className="text-base md:text-lg font-bold text-slate-900 leading-tight group-hover:text-[#3454d1] transition-colors">{aw.title}</h4>
              <p className="text-xs md:text-sm text-slate-600 mt-3 leading-relaxed">{aw.desc}</p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}