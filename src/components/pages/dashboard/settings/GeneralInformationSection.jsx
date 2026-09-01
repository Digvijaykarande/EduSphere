"use client";

import React, { useState, useRef } from "react";
import { Upload, Crop } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter,
} from "@/components/ui/modal";

export default function GeneralInformationSection({ hasAccess = () => true }) {
  const fileInputRef = useRef(null);
  const [logoUrl, setLogoUrl] = useState("https://t4.ftcdn.net/jpg/02/38/94/05/240_F_238940516_0BihE7YocY9vpgClPDDWuuaLneDwxtWn.jpg");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
        setZoomScale(1);
        setIsCropOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExecuteCrop = () => {
    setLogoUrl(selectedImage);
    setIsCropOpen(false);
    setSelectedImage(null);
  };

  return (
    <>
      {hasAccess("generalInfo") && (
        <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">General Information</h2>
          <p className="text-sm text-slate-500 mb-6">Update your school's basic information.</p>

          <div className="flex flex-col sm:flex-row gap-8">
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
                    className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold flex items-center gap-1.5 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors cursor-pointer"
                  >
                    <Upload size={16} /> Change Logo
                  </button>
                  <span className="text-[11px] text-slate-400 -mt-2">PNG, JPG up to 2MB</span>
                </>
              )}
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="sc-name">School Name</Label>
                <Input 
                  id="sc-name"
                  type="text" 
                  defaultValue="EduSphere International School" 
                  disabled={!hasAccess("generalInfoEdit")}
                />
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="sc-code">School Code</Label>
                <Input 
                  id="sc-code"
                  type="text" 
                  defaultValue="EDU1234" 
                  disabled
                />
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="sc-email">Email Address</Label>
                <Input 
                  id="sc-email"
                  type="email" 
                  defaultValue="info@edusphere.com" 
                />
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="sc-phone">Phone Number</Label>
                <div className="flex border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/20">
                  <div className="bg-slate-50 dark:bg-slate-700/60 border-r border-slate-200 dark:border-slate-700 px-3 py-2 text-sm flex items-center gap-1.5 cursor-default">
                    <span>🇮🇳</span>
                  </div>
                  <Input 
                    id="sc-phone"
                    type="text" 
                    defaultValue="+91 98765 43210" 
                    className="border-0 focus-visible:ring-0"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-2 max-w-xl w-full space-y-1.5">
                <Label htmlFor="sc-address">Address</Label>
                <Textarea 
                  id="sc-address"
                  rows={3}
                  defaultValue="123 Education Street, Knowledge City, Bangalore" 
                  disabled={!hasAccess("generalInfoEdit")}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal isOpen={isCropOpen} onClose={() => setIsCropOpen(false)}>
        <ModalContent maxWidth="max-w-md">
          <ModalHeader>
            <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white text-sm">
              <Crop size={16} className="text-indigo-500" />
              <span>Adjust School Logo Bounds</span>
            </div>
          </ModalHeader>

          <div className="py-4 space-y-6 flex flex-col items-center">
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

          <ModalFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCropOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleExecuteCrop}
            >
              Apply Crop
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}