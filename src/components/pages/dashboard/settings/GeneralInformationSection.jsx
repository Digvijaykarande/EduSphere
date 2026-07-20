"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Crop } from "lucide-react";

export default function GeneralInformationSection({  hasAccess = () => true  }) {
  // File upload state management
  const fileInputRef = useRef(null);
  const [logoUrl, setLogoUrl] = useState("https://t4.ftcdn.net/jpg/02/38/94/05/240_F_238940516_0BihE7YocY9vpgClPDDWuuaLneDwxtWn.jpg");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);

  // Trigger file browser click
  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  // Process initial chosen image file into object stream for the crop window
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
        setZoomScale(1); // reset scale bounds
        setIsCropOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Process visual canvas slice manipulation
  const handleExecuteCrop = () => {
    // In production application workflows, draw this image out to a canvas element:
    // ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh) based on the zoomScale value.
    setLogoUrl(selectedImage); 
    setIsCropOpen(false);
    setSelectedImage(null);
  };

  return (
    <>
      {hasAccess("generalInfo") && (
        <div className="dashboard-card p-6 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">General Information</h2>
          <p className="text-sm text-slate-500 mb-6">Update your school's basic information.</p>

          <div className="flex flex-col sm:flex-row gap-8">
            {/* School Logo Column with Action Handling hooks */}
            <div className="flex flex-col items-center gap-4 shrink-0">
              <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 w-full">School Logo</div>
              
              <div className="w-32 h-32 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center p-2 shadow-sm overflow-hidden">
                <img
                  src={logoUrl}
                  alt="School Logo"
                  className="object-contain h-full w-full opacity-90 dark:mix-blend-normal mix-blend-multiply"
                />
              </div>

              {hasAccess("generalInfoEdit") && (
                <>
                  <input 
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/png, image/jpeg"
                    onChange={handleFileChange}
                  />
                  <button 
                    type="button"
                    onClick={handleTriggerUpload}
                    className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold flex items-center gap-1.5 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                  >
                    <Upload size={16} /> Change Logo
                  </button>
                  <span className="text-[11px] text-slate-400 -mt-2">PNG, JPG up to 2MB</span>
                </>
              )}
            </div>

            {/* Input Data Forms Column */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">School Name</label>
                <input 
                  type="text" 
                  defaultValue="EduSphere International School" 
                  disabled={!hasAccess("generalInfoEdit")}
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60 disabled:cursor-not-allowed" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">School Code</label>
                <input 
                  type="text" 
                  defaultValue="EDU1234" 
                  disabled={!hasAccess("generalInfoEdit")}
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed" 
                  style={{cursor:"no-drop"}}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  defaultValue="info@edusphere.com" 
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Phone Number</label>
                <div className="flex border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/20">
                  <div className="bg-slate-50 dark:bg-slate-700/60 border-r border-slate-200 dark:border-slate-700 px-3 py-2 text-sm flex items-center gap-1.5 cursor-default">
                    <span>🇮🇳</span>
                  </div>
                  <input 
                    type="text" 
                    defaultValue="+91 98765 43210" 
                    className="w-full px-3 py-2 text-sm text-slate-800 dark:text-slate-100 outline-none bg-transparent" 
                  />
                </div>
              </div>
              
              {/* Constrained Textarea block wrapper */}
              <div className="sm:col-span-2 max-w-xl w-full">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Address</label>
                <textarea 
                  rows={3}
                  defaultValue="123 Education Street, Knowledge City, Bangalore" 
                  disabled={!hasAccess("generalInfoEdit")}
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none" 
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightweight Modular Image Crop Preview Dialog Box */}
      {isCropOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-150 dark:border-slate-800">
              <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white text-sm">
                <Crop size={16} className="text-indigo-500" />
                <span>Adjust School Logo Bounds</span>
              </div>
              <button 
                onClick={() => setIsCropOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-6 flex flex-col items-center">
              {/* Dynamic Scaling Window View box */}
              <div className="w-48 h-48 bg-slate-50 dark:bg-slate-950 rounded-xl overflow-hidden border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center relative">
                <div className="absolute inset-2 border-2 border-indigo-500/40 rounded-lg pointer-events-none z-10" />
                {selectedImage && (
                  <img
                    src={selectedImage}
                    alt="To Crop View"
                    style={{ transform: `scale(${zoomScale})` }}
                    className="object-contain max-h-full max-w-full transition-transform duration-75"
                  />
                )}
              </div>

              {/* Slider Controller */}
              <div className="w-full space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-slate-500">
                  <span>Zoom Level</span>
                  <span>{Math.round(zoomScale * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={zoomScale}
                  onChange={(e) => setZoomScale(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/40 px-5 py-3.5 flex justify-end gap-2 border-t border-slate-150 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsCropOpen(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteCrop}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg shadow-sm transition-colors"
              >
                Apply Crop
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}