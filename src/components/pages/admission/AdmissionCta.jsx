import React from "react";
import Link from "next/link";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdmissionCta() {
  return (
    <section className="py-20 bg-[#0f1a3a] text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="font-display text-3xl sm:text-4xl font-extrabold mb-4">Ready to Submit Your Application?</h3>
        <p className="text-sm text-slate-300 leading-relaxed mb-10 max-w-2xl mx-auto">
          Access the digital portal to create your profile, upload your documents, and track your application status in real-time.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-5">
          <Button asChild size="lg" className="bg-[#3454d1] hover:bg-blue-600 text-white font-bold px-8 py-4 h-auto rounded-xl shadow-lg hover:shadow-blue-900/50 hover:-translate-y-1 transition-all border-none">
            <Link href="/register">
              Create Applicant Account
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="border-white/20 hover:bg-white/10 text-white font-bold px-8 py-4 h-auto rounded-xl transition-all flex items-center gap-2 hover:-translate-y-1 bg-transparent">
            <Download className="h-5 w-5" /> Download Prospectus
          </Button>
        </div>
      </div>
    </section>
  );
}