"use client";

import React from "react";
import PageTransition from "@/components/shared/PageTransition";
import { ContactHero } from "@/components/pages/contact/ContactHero";
import { InfoCards } from "@/components/pages/contact/InfoCards";
import { DigitalForm } from "@/components/pages/contact/DigitalForm";
import { LocationMap } from "@/components/pages/contact/LocationMap";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#141b2d] selection:bg-blue-500 selection:text-white">
      <PageTransition>
        <ContactHero />
        <InfoCards />
        <DigitalForm />
        <LocationMap />
      </PageTransition>
    </div>
  );
}