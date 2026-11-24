"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

// Self-contained role gate: only teachers may open Class Performance.
export default function TeacherOnly({ children }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const fetchMe = useAuthStore((s) => s.fetchMe);

  useEffect(() => {
    if (!hydrated) fetchMe?.();
  }, [hydrated, fetchMe]);

  const allowed = user?.role?.toUpperCase() === "TEACHER";

  useEffect(() => {
    if (hydrated && !allowed) router.replace("/dashboard");
  }, [hydrated, allowed, router]);

  if (!hydrated || !allowed) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }
  return <>{children}</>;
}