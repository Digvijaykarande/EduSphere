"use client";

import React from "react";
import { AboutHero } from "@/components/pages/about/AboutHero";
import { MissionVision } from "@/components/pages/about/MissionVision";
import { CampusTour } from "@/components/pages/about/CampusTour";
import { CoreValues } from "@/components/pages/about/CoreValues";
import { Timeline } from "@/components/pages/about/Timeline";
import { Leadership } from "@/components/pages/about/Leadership";
import { AdmissionsCta } from "@/components/pages/about/AdmissionsCta";

export default function AboutPage() {
  return (
    <div className="bg-[#f8fafc] text-[#141b2d] min-h-screen selection:bg-blue-500 selection:text-white">
      <AboutHero />
      <MissionVision />
      <CampusTour />
      <CoreValues />
      <Timeline />
      <Leadership />
      <AdmissionsCta />
    </div>
  );
}