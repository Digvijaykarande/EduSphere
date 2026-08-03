"use client";

import { Folder, Video, FileText, Upload, Link as LinkIcon, Download, Play, ExternalLink } from "lucide-react";

const ICONS = {
  folder: { icon: Folder, tone: "stat-icon-violet", actionIcon: Folder, actionLabel: "Open" },
  video: { icon: Video, tone: "stat-icon-orange", actionIcon: Play, actionLabel: "Play" },
  pdf: { icon: FileText, tone: "stat-icon-green", actionIcon: Download, actionLabel: "Download" },
  link: { icon: LinkIcon, tone: "stat-icon-blue", actionIcon: ExternalLink, actionLabel: "Open link" },
};

export default function StudyMaterialLibrary({ materials, onAddMaterial, onOpenMaterial }) {
  return (
    <div className="dashboard-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="stat-icon-box stat-icon-violet">
            <Folder className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground tracking-tight">Study Material Library</h3>
            <p className="text-xs text-slate-400">Notes, PDFs, videos & links for your classes</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {materials.map((item) => {
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
                onClick={() => onOpenMaterial?.(item)}
                className="mt-3 w-full flex items-center justify-center gap-1.5 text-[11px] font-bold text-primary bg-primary/5 hover:bg-primary/10 rounded-lg py-2 transition-all opacity-0 group-hover:opacity-100"
              >
                <ActionIcon className="w-3.5 h-3.5" />
                {cfg.actionLabel}
              </button>
            </div>
          );
        })}

        <button
          type="button"
          onClick={onAddMaterial}
          className="p-5 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-primary bg-slate-50/20 dark:bg-slate-800/10 hover:bg-primary/5 transition-all flex flex-col items-center justify-center text-center min-h-[140px]"
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
            <Upload className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-primary">Upload / add material</span>
          <span className="text-[10px] text-slate-400 mt-0.5">Files, URLs or videos</span>
        </button>
      </div>
    </div>
  );
}