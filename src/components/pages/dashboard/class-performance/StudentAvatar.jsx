"use client";

import { useState } from "react";

function initials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Self-contained avatar (photo with initials fallback) so this module has no
// dependency on other shared components.
export default function StudentAvatar({ name, src, className = "h-10 w-10" }) {
  const [failed, setFailed] = useState(false);
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 dark:border-slate-700 bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider shadow-sm ${className}`}
    >
      {src && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} onError={() => setFailed(true)} className="h-full w-full object-cover" />
      ) : (
        initials(name)
      )}
    </span>
  );
}
