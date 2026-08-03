"use client";

import { useState, useMemo } from "react";
import { Folder, Video, FileText, Link as LinkIcon, Download, Play, ExternalLink, ChevronLeft } from "lucide-react";

const ICONS = {
  folder: { icon: Folder, tone: "stat-icon-violet", actionIcon: Folder, actionLabel: "Open" },
  video: { icon: Video, tone: "stat-icon-orange", actionIcon: Play, actionLabel: "Play" },
  pdf: { icon: FileText, tone: "stat-icon-green", actionIcon: Download, actionLabel: "Download" },
  link: { icon: LinkIcon, tone: "stat-icon-blue", actionIcon: ExternalLink, actionLabel: "Open link" },
};

const FOLDER_TONES = ["stat-icon-violet", "stat-icon-blue", "stat-icon-green", "stat-icon-orange"];

export default function StudyMaterialsWidget({ materials, onOpenMaterial }) {
  const [activeFolder, setActiveFolder] = useState(null);
  const [typeFilter, setTypeFilter] = useState("all");


  const folders = useMemo(() => {
    const groups = {};
    materials.forEach((item) => {
      const key = item.subject || item.classSection || "General";
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    return Object.entries(groups).map(([name, items], idx) => ({
      name,
      items,
      tone: FOLDER_TONES[idx % FOLDER_TONES.length],
    }));
  }, [materials]);

  const activeItems = activeFolder
    ? folders.find((f) => f.name === activeFolder)?.items || []
    : [];

  const visibleItems = typeFilter === "all" ? activeItems : activeItems.filter((i) => i.type === typeFilter);

  const handleOpen = (item) => {
    if (item.type === "link" && item.url) window.open(item.url, "_blank");
    onOpenMaterial?.(item);
  };

  return (
    <div className="dashboard-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {activeFolder ? (
            <button
              type="button"
              onClick={() => {
                setActiveFolder(null);
                setTypeFilter("all");
              }}
              className="stat-icon-box stat-icon-violet hover:opacity-80 transition-opacity"
              title="Back to folders"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="stat-icon-box stat-icon-violet">
              <Folder className="w-5 h-5" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-bold text-foreground tracking-tight">
              {activeFolder || "Study Materials"}
            </h3>
            <p className="text-xs text-slate-400">
              {activeFolder ? `${activeItems.length} item${activeItems.length === 1 ? "" : "s"}` : "Browse by subject & class"}
            </p>
          </div>
        </div>
      </div>

      {/* Folder grid — landing view */}
      {!activeFolder && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {folders.map((folder) => (
            <button
              key={folder.name}
              type="button"
              onClick={() => setActiveFolder(folder.name)}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800/60 hover:shadow-sm transition-all flex flex-col items-center text-center gap-2"
            >
              <div className={`stat-icon-box ${folder.tone}`}>
                <Folder className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-foreground text-sm truncate w-full">{folder.name}</h4>
              <p className="text-[11px] text-slate-400 font-medium">
                {folder.items.length} item{folder.items.length === 1 ? "" : "s"}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Materials grid — inside a folder */}
      {activeFolder && (
        <>
          <div className="flex items-center gap-1.5 mb-5 flex-wrap">
            {["all", "pdf", "video", "link"].map((key) => (
              <button
                key={key}
                onClick={() => setTypeFilter(key)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors capitalize ${
                  typeFilter === key
                    ? "bg-primary text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-primary"
                }`}
              >
                {key}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {visibleItems.map((item) => {
              const cfg = ICONS[item.type] || ICONS.pdf;
              const Icon = cfg.icon;
              const ActionIcon = cfg.actionIcon;

              return (
                <div
                  key={item.id}
                  className="group p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800/60 hover:shadow-sm transition-all flex flex-col items-center text-center justify-between"
                >
                  <div className={`stat-icon-box ${cfg.tone} my-2`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="w-full">
                    <h4 className="font-bold text-foreground text-sm truncate" title={item.title}>
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-medium mt-1">
                      {item.fileCount
                        ? `${item.fileCount} files • ${item.fileSize}`
                        : item.duration
                        ? `Video • ${item.duration}`
                        : item.fileSize || "Link resource"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpen(item)}
                    className="mt-3 w-full flex items-center justify-center gap-1.5 text-[11px] font-bold text-primary bg-primary/5 hover:bg-primary/10 rounded-lg py-2 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ActionIcon className="w-3.5 h-3.5" />
                    {cfg.actionLabel}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}