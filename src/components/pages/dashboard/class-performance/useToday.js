"use client";

import { useEffect, useState } from "react";
import { startOfDay } from "./performance.utils";

/** Timestamp of local midnight today; updates itself when the day rolls over. */
export function useToday() {
  const [day, setDay] = useState(() => startOfDay(new Date()).getTime());

  useEffect(() => {
    const check = () => setDay((d) => {
      const n = startOfDay(new Date()).getTime();
      return n === d ? d : n;
    });
    const t = setInterval(check, 60_000);
    document.addEventListener("visibilitychange", check);
    return () => {
      clearInterval(t);
      document.removeEventListener("visibilitychange", check);
    };
  }, []);

  return day;
}
