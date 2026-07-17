"use client";

import React from "react";
import PageTransition from "@/components/shared/PageTransition";
import { AcademicsHero } from "@/components/pages/academics/AcademicsHero";
import { Philosophy } from "@/components/pages/academics/Philosophy";
import { ProgressionTiers } from "@/components/pages/academics/ProgressionTiers";
import { Streams } from "@/components/pages/academics/Streams";
import { InnovationLabs } from "@/components/pages/academics/InnovationLabs";
import { Testimonial } from "@/components/pages/academics/Testimonial";
import { EvaluationFramework } from "@/components/pages/academics/EvaluationFramework";
import { Faq } from "@/components/pages/academics/Faq";

export default function AcademicsPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#141b2d] selection:bg-blue-500 selection:text-white">
      <PageTransition>
        <AcademicsHero />
        <Philosophy />
        <ProgressionTiers />
        <Streams />
        <InnovationLabs />
        <Testimonial />
        <EvaluationFramework />
        <Faq />
      </PageTransition>
    </div>
  );
}