"use client";

import React, { useRef, useState } from "react";
import { useAuthStore } from "@/store/use-auth-store";

import ProfileHeader from "@/components/pages/dashboard/profile/ProfileHeader";
import ProfileIdentity from "@/components/pages/dashboard/profile/ProfileIdentity";
import PersonalInfo from "@/components/pages/dashboard/profile/PersonalInfo";
import ProfessionalDetails from "@/components/pages/dashboard/profile/ProfessionalDetails";
import ProfileSecurity from "@/components/pages/dashboard/profile/ProfileSecurity";
import PasswordModal from "@/components/pages/dashboard/profile/PasswordModal";

import { ROLE_META, ROLE_SEED_DATA } from "@/components/pages/dashboard/profile/profile.utils";

export default function ProfilePage() {
  const fileInputRef = useRef(null);
  
  const authUser = useAuthStore((state) => state.user) || { name: "Admin User", role: "Super Admin" };
  const role = ROLE_META[authUser.role] ? authUser.role : "Super Admin";
  const seed = ROLE_SEED_DATA[role];
  const meta = ROLE_META[role];

  const [avatarUrl, setAvatarUrl] = useState(null);
  const [form, setForm] = useState({
    fullName: seed.fullName,
    email: seed.email,
    phone: seed.phone,
    address: seed.address,
    bio: seed.bio,
  });
  const [saveState, setSaveState] = useState("idle");
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: "", next: "", confirm: "" });
  const [passwordError, setPasswordError] = useState("");
  const [showPw, setShowPw] = useState(false);

  function updateField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (file) setAvatarUrl(URL.createObjectURL(file));
  }

  function handleSave(e) {
    e.preventDefault();
    setSaveState("saved");
    setTimeout(() => setSaveState("idle"), 2500);
  }

  // The missing function restored:
  function handlePasswordSubmit(e) {
    e.preventDefault();
    if (!passwordForm.current || !passwordForm.next || !passwordForm.confirm) {
      setPasswordError("Please fill in all fields.");
      return;
    }
    if (passwordForm.next.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    if (passwordForm.next !== passwordForm.confirm) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }
    
    // Simulating successful password update
    setPasswordForm({ current: "", next: "", confirm: "" });
    setPasswordError("");
    setPasswordOpen(false);
  }

  return (
    <div className="max-w-8xl mx-auto space-y-8 px-4 sm:px-6 pb-16 pt-2">
      <ProfileHeader saveState={saveState} handleSave={handleSave} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Avatar Banner Card & Read-only Meta Data */}
        <div className="lg:col-span-1 space-y-4">
          <ProfileIdentity
            form={form}
            role={role}
            meta={meta}
            avatarUrl={avatarUrl}
            fileInputRef={fileInputRef}
            handleAvatarChange={handleAvatarChange}
          />
          
          <ProfessionalDetails seed={seed} />
          
          <ProfileSecurity setPasswordOpen={setPasswordOpen} />
        </div>

        {/* Right Side: Primary Configuration Fields */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/80 overflow-hidden">
            <PersonalInfo form={form} updateField={updateField} />
          </form>
        </div>
      </div>

      <PasswordModal
        passwordOpen={passwordOpen}
        setPasswordOpen={setPasswordOpen}
        passwordForm={passwordForm}
        setPasswordForm={setPasswordForm}
        passwordError={passwordError}
        showPw={showPw}
        setShowPw={setShowPw}
        handlePasswordSubmit={handlePasswordSubmit}
      />
    </div>
  );
}