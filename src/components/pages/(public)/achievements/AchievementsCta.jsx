import React from "react";
import Link from "next/link";
import { Trophy, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AchievementsCta() {
  return (
    <section className="py-16 md:py-20 bg-[#0b1226] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="h-14 w-14 bg-[#c99a3f]/10 rounded-full flex items-center justify-center mx-auto mb-5">
          <Trophy className="h-7 w-7 text-[#c99a3f]" />
        </div>
        <h3 className="font-display text-2xl md:text-3xl font-bold mb-3">Be Part of Our Next Success Story</h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 sm:mb-8 max-w-xl mx-auto">
          At Everest Global School, we provide the platform, the mentorship, and the resources. The next great achievement could be yours.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <Button asChild size="lg" className="bg-[#c99a3f] hover:bg-amber-600 text-white font-bold text-xs w-full sm:w-auto shadow-md border-none px-6">
            <Link href="/admissions">Begin Admission Process</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white/20 hover:bg-white/10 text-white font-bold text-xs w-full sm:w-auto bg-transparent px-6">
            <Link href="/campus-life" className="inline-flex items-center gap-2">
              Explore Campus Life <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}