"use client";

import { useState, useRef, useEffect } from "react";
import { 
  X, 
  Upload, 
  ChevronDown, 
  FileText, 
  Video, 
  Folder, 
  Link as LinkIcon,
  CloudUpload,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MATERIAL_TYPES = [
  { value: "pdf", label: "PDF Document", icon: FileText },
  { value: "video", label: "Video Lecture", icon: Video },
  { value: "folder", label: "Resource Folder", icon: Folder },
  { value: "link", label: "Web URL Link", icon: LinkIcon },
];

export default function AddMaterialModal({ onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [type, setType] = useState(MATERIAL_TYPES[0]);
  const [note, setNote] = useState("");
  
  // Custom Dropdown State
  const [isTypeMenuOpen, setIsTypeMenuOpen] = useState(false);
  const typeMenuRef = useRef(null);

  // File Upload State
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Handle outside click for dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (typeMenuRef.current && !typeMenuRef.current.contains(event.target)) {
        setIsTypeMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Drag and Drop Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelection = (selectedFile) => {
    setFile(selectedFile);
    // Auto-fill title if empty
    if (!title && selectedFile.name) {
      setTitle(selectedFile.name.split('.').slice(0, -1).join('.'));
    }
    // Auto-fill size string
    const sizeInMB = (selectedFile.size / (1024 * 1024)).toFixed(2);
    setNote(`${sizeInMB} MB`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newMaterial = {
      id: `sm-${Date.now()}`,
      title,
      subject,
      type: type.value,
      fileSize: type.value === "pdf" || type.value === "folder" ? note || "—" : undefined,
      duration: type.value === "video" ? note || "—" : undefined,
      url: type.value === "link" ? note : undefined,
      uploadedDate: "Just now",
      fileName: file ? file.name : undefined,
    };

    onAdd(newMaterial);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white dark:bg-slate-950 rounded-xl sm:rounded-lg max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex flex-col space-y-1.5 p-6 pb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold leading-none tracking-tight text-slate-900 dark:text-slate-50">
              Provide Study Material
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 dark:ring-offset-slate-950 dark:focus:ring-primary dark:data-[state=open]:bg-slate-800"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Upload files or add links for students to access.
          </p>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 pt-0 overflow-y-auto space-y-5 custom-scrollbar">
          
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-900 dark:text-slate-200">
              Title / Document Name
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Trigonometry_Identity_Notes"
              className="flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 dark:ring-offset-slate-950 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-900 dark:text-slate-200">
                Subject
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Mathematics"
                className="flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 dark:ring-offset-slate-950 transition-all"
              />
            </div>

            {/* Shadcn-Style Custom Dropdown */}
            <div className="space-y-2 relative" ref={typeMenuRef}>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-900 dark:text-slate-200">
                Material Type
              </label>
              <button
                type="button"
                onClick={() => setIsTypeMenuOpen(!isTypeMenuOpen)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 dark:ring-offset-slate-950 transition-all"
              >
                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                  <type.icon className="w-4 h-4 text-slate-500" />
                  {type.label}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </button>

              <AnimatePresence>
                {isTypeMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute z-50 w-full min-w-[8rem] overflow-hidden rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-950 dark:text-slate-50 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 mt-1 top-full left-0"
                  >
                    <div className="p-1">
                      {MATERIAL_TYPES.map((t) => (
                        <button
                          key={t.value}
                          type="button"
                          onClick={() => { setType(t); setIsTypeMenuOpen(false); setFile(null); }}
                          className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-50 focus:bg-slate-100 focus:text-slate-900 dark:focus:bg-slate-800 dark:focus:text-slate-50 transition-colors"
                        >
                          <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                            {type.value === t.value && <Check className="h-4 w-4" />}
                          </span>
                          <span className="flex items-center gap-2">
                            <t.icon className="w-4 h-4 text-slate-500" />
                            {t.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Conditional Upload Zone / Link Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-900 dark:text-slate-200">
              {type.value === "link" ? "URL Address" : "Upload File"}
            </label>
            
            {type.value === "link" ? (
              <input
                type="url"
                required
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="https://..."
                className="flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 dark:ring-offset-slate-950 transition-all"
              />
            ) : (
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center w-full h-40 px-4 py-6 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                  isDragging 
                    ? "border-primary bg-primary/5" 
                    : file 
                      ? "border-success/50 bg-success/5 dark:bg-success/10" 
                      : "border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:border-slate-400 dark:hover:border-slate-500"
                }`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={(e) => e.target.files && handleFileSelection(e.target.files[0])}
                />
                
                {file ? (
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="w-10 h-10 bg-success/20 text-success rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[200px] truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); setFile(null); setNote(""); }}
                      className="text-xs text-destructive hover:underline mt-1"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-center pointer-events-none">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full flex items-center justify-center mb-1">
                      <CloudUpload className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      SVG, PNG, JPG, PDF or MP4 (max. 100MB)
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {type.value !== "link" && (
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-900 dark:text-slate-200">
                {type.value === "video" ? "Duration" : "File Size / Extra Notes"}
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={type.value === "video" ? "e.g. 12:40" : "e.g. 2.8 MB"}
                className="flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 dark:ring-offset-slate-950 transition-all"
              />
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/20 rounded-b-xl sm:rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50 h-10 px-4 py-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={type.value !== "link" && !file && !note}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2"
          >
            <Upload className="w-4 h-4" />
            Publish Material
          </button>
        </div>
      </motion.div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
        }
      `}</style>
    </div>
  );
}