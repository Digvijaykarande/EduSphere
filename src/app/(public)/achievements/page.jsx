"use client";

import React from "react";
import PageTransition from "@/components/shared/PageTransition";
import { AchievementsHero } from "@/components/pages/achievements/AchievementsHero";
import { ImpactMetrics } from "@/components/pages/achievements/ImpactMetrics";
import { MajorAccolades } from "@/components/pages/achievements/MajorAccolades";
import { StudentSpotlight } from "@/components/pages/achievements/StudentSpotlight";
import { AchievementsCta } from "@/components/pages/achievements/AchievementsCta";

export default function AchievementsPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#141b2d] selection:bg-blue-500 selection:text-white">
      <PageTransition>
        <AchievementsHero />
        <ImpactMetrics />
        <MajorAccolades />
        <StudentSpotlight />
        <AchievementsCta />
      </PageTransition>
    </div>
  );
}