"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Lock, Mail, ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("student"); // 'student' | 'parent' | 'admin'
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication delay
    setTimeout(() => {
      setIsLoading(false);
      // Redirect to dashboard after login
      router.push("/dashboard");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#0b1226] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor Shapes */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[#1d3bb5] text-white shadow-lg shadow-primary/30">
              <GraduationCap className="h-6 w-6 transition-transform group-hover:scale-110" />
            </div>
            <div className="text-left">
              <span className="block font-display text-xl font-bold tracking-tight text-white">
                Everest
              </span>
              <span className="block text-[11px] font-semibold tracking-widest text-gold uppercase -mt-1">
                Global School
              </span>
            </div>
          </Link>
          <h1 className="text-2xl font-display font-bold text-white tracking-tight">
            Portal Access
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Log in to manage your academic profile & dashboard
          </p>
        </div>

        {/* Card Wrapper */}
        <div className="bg-white rounded-2xl p-8 shadow-2xl border border-slate-100">
          
          {/* Role Switcher Tabs */}
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl mb-6 text-xs font-semibold">
            {[
              { id: "student", label: "Student" },
              { id: "parent", label: "Parent" },
              { id: "admin", label: "Admin" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setRole(tab.id)}
                className={`py-2 rounded-lg transition-all duration-200 capitalize ${
                  role === tab.id
                    ? "bg-white text-primary shadow-sm font-bold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email / ID Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                {role === "admin" ? "Admin Email" : "User ID / Email"}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder={
                    role === "admin"
                      ? "admin@everestschool.edu.in"
                      : "STU-10492 or email"
                  }
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-primary focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="#"
                  className="text-[11px] font-semibold text-primary hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-primary focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
              />
              <label htmlFor="remember" className="text-xs text-slate-600 font-medium cursor-pointer">
                Keep me logged in for this session
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0f1a3a] text-white font-bold text-xs py-3.5 px-4 rounded-xl hover:bg-primary transition-all shadow-md flex items-center justify-center gap-2 group disabled:opacity-70 mt-2"
            >
              {isLoading ? (
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In to Portal
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
          {/* sign up links */}
          <div>
            <Link href="/register" className="block text-center text-xs text-lab(1 0 0) hover:text-primary mt-4">
              Don't have an account? <span className="font-bold text-primary">Sign Up</span>
            </Link>
          </div>

          {/* Footer Note */}
          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              256-Bit Encrypted Institutional Access
            </span>
          </div>
        </div>

        {/* Return to Home link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            ← Back to Main Website
          </Link>

        </div>
      </div>
    </div>
  );
}