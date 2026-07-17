"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";

export function Faq() {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: "How are students assessed throughout the year?",
      a: "We follow a continuous evaluation model combining formative assessments (projects, quizzes, class participation) with summative board-pattern exams, all tracked in real-time through the EduSphere ERP."
    },
    {
      q: "When do students choose their Senior Secondary stream?",
      a: "Stream selection happens at the end of Grade 8, guided by an aptitude assessment and one-on-one counseling sessions with our academic advisors."
    },
    {
      q: "Are extracurriculars integrated into the academic day?",
      a: "Yes — fine arts, physical education, and coding/robotics modules are built directly into the timetable rather than offered only after school hours."
    },
    {
      q: "Can students switch streams after Grade 9?",
      a: "Stream switches are evaluated case-by-case with our counseling team, typically only feasible before the start of Grade 10 board preparation."
    },
  ];

  return (
    <section className="py-16 md:py-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-[#3454d1]">Common Questions</span>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Academics FAQ</h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openFaq === idx;
          return (
            <Card key={idx} className="bg-white border border-slate-200/80 rounded-xl overflow-hidden transition-colors duration-200 text-card-foreground shadow-none">
              <button
                onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                className="w-full flex items-center justify-between gap-4 p-4 md:p-5 text-left transition-colors cursor-pointer focus:outline-none"
              >
                <span className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && (
                <div className="px-4 pb-4 md:px-5 md:pb-5 -mt-1">
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </section>
  );
}