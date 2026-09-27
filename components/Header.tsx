"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, role, logout } = useAuth();

  const adminNavItems = [
    { label: "Admin Command", href: "/", icon: "📊" },
    { label: "Emergency Room", href: "/emergency", icon: "🚨" },
    { label: "Appointments", href: "/appointments", icon: "📅" },
    { label: "Patients", href: "/patients", icon: "👥" },
    { label: "Ambulance Fleet", href: "/ambulance", icon: "🚑" },
    { label: "Blood Bank", href: "/blood", icon: "🩸" },
    { label: "Facilities", href: "/facilities", icon: "🏥" },
    { label: "Database Explorer", href: "/database", icon: "🗄️" },
  ];

  const patientNavItems = [
    { label: "Patient Portal", href: "/portal", icon: "🏠" },
    { label: "Emergency SOS", href: "/emergency", icon: "🚨" },
    { label: "Book Appointment", href: "/appointments", icon: "📅" },
    { label: "Hospital Beds", href: "/facilities", icon: "🛏️" },
    { label: "Blood Bank", href: "/blood", icon: "🩸" },
  ];

  const navItems = role === "admin" ? adminNavItems : patientNavItems;

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md sm:px-6 lg:pl-70">
        <div className="flex items-center gap-3">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 lg:hidden hover:bg-slate-50"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>

          <div className="lg:hidden flex items-center gap-2">
            <span className="text-xl">🩺</span>
            <span className="font-extrabold text-slate-900 tracking-tight">
              Pulse<span className="text-blue-600">Desk</span>
            </span>
          </div>

          {/* Role Indicator Badge */}
          <div className="hidden sm:flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider border ${
                role === "admin"
                  ? "bg-purple-50 text-purple-700 border-purple-200"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
              }`}
            >
              {role === "admin" ? "🛡️ Admin / Doctor View" : "🧑 Patient View"}
            </span>

            <span className="text-xs text-slate-400 font-medium">
              • {user?.name || "Authenticated"}
            </span>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2.5">
          {role === "admin" ? (
            <Link
              href="/emergency"
              className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs shadow-rose-500/25 hover:bg-rose-700 transition-all active:scale-95"
            >
              <span>🚨</span>
              <span className="hidden sm:inline">Emergency Dispatch</span>
              <span className="sm:hidden">Emergency</span>
            </Link>
          ) : (
            <Link
              href="/portal"
              className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs shadow-rose-500/25 hover:bg-rose-700 transition-all active:scale-95 animate-pulse"
            >
              <span>🚨</span>
              <span>1-Tap SOS</span>
            </Link>
          )}

          {role === "patient" && (
            <Link
              href="/appointments"
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors"
            >
              <span>+ Book Visit</span>
            </Link>
          )}

          {/* User profile & Logout */}
          <div className="flex items-center gap-2 border-l border-slate-200 pl-2.5">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-black ${
                role === "admin"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {role === "admin" ? "MD" : "PT"}
            </div>
            <div className="hidden md:block text-left text-xs leading-tight">
              <p className="font-bold text-slate-800 truncate max-w-[120px]">
                {user?.name || (role === "admin" ? "Doctor Admin" : "Patient")}
              </p>
              <button
                onClick={logout}
                className="text-[11px] text-rose-600 hover:underline cursor-pointer block"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/40 lg:hidden backdrop-blur-xs">
          <div className="w-72 bg-white h-full shadow-2xl flex flex-col">
            <div className="flex h-16 items-center justify-between border-b border-slate-100 px-6">
              <div className="flex items-center gap-2">
                <span className="text-xl">🩺</span>
                <span className="font-extrabold text-slate-900 text-lg">
                  Pulse<span className="text-blue-600">Desk</span>
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {/* Mobile Profile info */}
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700 font-bold text-xs">
                  {role === "admin" ? "MD" : "PT"}
                </div>
                <div className="leading-tight">
                  <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                  <p className="text-[11px] text-slate-500 capitalize">
                    {role === "admin" ? "Doctor / Staff Admin" : "Patient Account"}
                  </p>
                </div>
              </div>
            </div>

            <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname?.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-100">
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full rounded-xl bg-rose-50 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100 border border-rose-200"
              >
                🚪 Sign Out
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </>
  );
}
