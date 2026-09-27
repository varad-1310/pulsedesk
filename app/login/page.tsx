"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { UserRole } from "@/lib/types";
import Link from "next/link";

export default function LoginPage() {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>("admin");
  const [email, setEmail] = useState("admin@pulsedesk.org");
  const [password, setPassword] = useState("admin");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleRoleSwitch(role: UserRole) {
    setSelectedRole(role);
    setErrorMessage(null);
    if (role === "admin") {
      setEmail("admin@pulsedesk.org");
      setPassword("admin");
    } else {
      setEmail("aarav.sharma@gmail.com");
      setPassword("patient");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    const result = login(email, password, selectedRole);
    if (!result.success && result.error) {
      setErrorMessage(result.error);
    }
  }

  function handleQuickLogin(role: UserRole, demoEmail: string, demoPass: string) {
    setSelectedRole(role);
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage(null);
    login(demoEmail, demoPass, role);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 flex flex-col justify-center items-center p-4 sm:p-6">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 text-white font-extrabold shadow-lg shadow-blue-500/30 text-2xl mb-3">
          🩺
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white">
          Pulse<span className="text-blue-400">Desk</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1 font-medium tracking-wide">
          Unified Healthcare & Emergency Operations Gateway
        </p>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md rounded-3xl border border-slate-700/80 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-white">
        {/* Role Selector Tabs */}
        <div className="mb-6 grid grid-cols-2 gap-1.5 rounded-2xl bg-slate-800/80 p-1.5 border border-slate-700/50">
          <button
            type="button"
            onClick={() => handleRoleSwitch("admin")}
            className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all duration-150 ${
              selectedRole === "admin"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span>👨‍⚕️</span>
            <span>Doctor / Staff</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleSwitch("patient")}
            className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all duration-150 ${
              selectedRole === "patient"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span>🧑</span>
            <span>Patient Portal</span>
          </button>
        </div>

        {/* Dynamic Context Header */}
        <div className="mb-5">
          <h2 className="text-xl font-extrabold text-white">
            {selectedRole === "admin"
              ? "Staff & Clinician Login"
              : "Patient & Public Portal"}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {selectedRole === "admin"
              ? "Access emergency dispatch room, fleet tracking, and clinical records."
              : "Book appointments, request emergency SOS, and view medical profile."}
          </p>
        </div>

        {/* Error Alert Message */}
        {errorMessage && (
          <div className="mb-4 rounded-xl border border-rose-500/50 bg-rose-950/80 p-3.5 text-xs text-rose-200 flex items-start gap-2 animate-in fade-in duration-200">
            <span className="text-base leading-none">⚠️</span>
            <div className="flex-1 font-medium">{errorMessage}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMessage(null);
              }}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder={
                selectedRole === "admin"
                  ? "doctor@pulsedesk.org"
                  : "patient@gmail.com"
              }
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Password
              </label>
              <span className="text-[11px] text-blue-400">
                Default: {selectedRole === "admin" ? "admin" : "patient"}
              </span>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMessage(null);
              }}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99] transition-all cursor-pointer"
          >
            Sign In as {selectedRole === "admin" ? "Doctor / Staff" : "Patient"} →
          </button>
        </form>

        {/* 1-Click Demo Shortcut Section */}
        <div className="mt-6 pt-5 border-t border-slate-800/90">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center mb-3">
            Quick 1-Click Demo Access
          </p>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() =>
                handleQuickLogin("admin", "admin@pulsedesk.org", "admin")
              }
              className="w-full flex items-center justify-between rounded-xl bg-slate-800/90 hover:bg-slate-750 px-3.5 py-2.5 text-xs text-left border border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">👨‍⚕️</span>
                <div>
                  <p className="font-bold text-slate-200">
                    Chief Medical Officer (Admin)
                  </p>
                  <p className="text-[10px] text-slate-400">
                    admin@pulsedesk.org • Pass: admin
                  </p>
                </div>
              </div>
              <span className="text-blue-400 font-bold text-xs">Enter →</span>
            </button>

            <button
              type="button"
              onClick={() =>
                handleQuickLogin("patient", "aarav.sharma@gmail.com", "patient")
              }
              className="w-full flex items-center justify-between rounded-xl bg-slate-800/90 hover:bg-slate-750 px-3.5 py-2.5 text-xs text-left border border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">🧑</span>
                <div>
                  <p className="font-bold text-slate-200">
                    Patient (Aarav Sharma)
                  </p>
                  <p className="text-[10px] text-slate-400">
                    aarav.sharma@gmail.com • Pass: patient
                  </p>
                </div>
              </div>
              <span className="text-emerald-400 font-bold text-xs">Enter →</span>
            </button>
          </div>
        </div>

        {/* Create Account Link */}
        <div className="mt-5 pt-4 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            Need a new account?{" "}
            <Link
              href="/register"
              className="font-bold text-blue-400 hover:text-blue-300 underline ml-1"
            >
              Register New Patient or Doctor
            </Link>
          </p>
        </div>
      </div>

      {/* Emergency Hotline Banner */}
      <div className="mt-8 flex items-center gap-2 text-xs text-slate-400">
        <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
        <span>24/7 Emergency Line:</span>
        <strong className="text-rose-400 font-bold">108 (India)</strong>
      </div>
    </div>
  );
}
