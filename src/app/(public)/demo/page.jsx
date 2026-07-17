"use client";

import React from "react";
import Navbar from "@/components/pages/demo/Navbar";
import Hero from "@/components/pages/demo/Hero";
import Pillars from "@/components/pages/demo/Pillars";
import AboutPreview from "@/components/pages/demo/AboutPreview";
import Highlights from "@/components/pages/demo/Highlights";
import EventsAchievements from "@/components/pages/demo/EventsAchievements";
import LifeAtEverest from "@/components/pages/demo/LifeAtEverest";
import Footer from "@/components/pages/demo/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#141b2d] font-sans antialiased selection:bg-primary selection:text-white">
    {/* <Navbar /> */}
      <Hero />
      <Pillars />
      <AboutPreview />
      <Highlights />
      <EventsAchievements />
      <LifeAtEverest />
      {/* <Footer /> */}
    </div>
  );
}