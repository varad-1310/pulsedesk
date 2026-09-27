"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string;
  badgeColor?: string;
}

const adminNavItems: NavItem[] = [
  {
    label: "Admin Command Center",
    href: "/",
    icon: "📊",
  },
  {
    label: "Emergency Room",
    href: "/emergency",
    icon: "🚨",
    badge: "Live",
    badgeColor: "bg-rose-500 text-white animate-pulse",
  },
  {
    label: "Appointments",
    href: "/appointments",
    icon: "📅",
  },
  {
    label: "Patients Directory",
    href: "/patients",
    icon: "👥",
  },
  {
    label: "Ambulance Fleet",
    href: "/ambulance",
    icon: "🚑",
  },
  {
    label: "Blood Stock",
    href: "/blood",
    icon: "🩸",
    badge: "O- Low",
    badgeColor: "bg-rose-100 text-rose-700",
  },
  {
    label: "Healthcare Facilities",
    href: "/facilities",
    icon: "🏥",
  },
  {
    label: "Database Explorer",
    href: "/database",
    icon: "🗄️",
    badge: "Live",
    badgeColor: "bg-blue-100 text-blue-700",
  },
];

const patientNavItems: NavItem[] = [
  {
    label: "My Patient Portal",
    href: "/portal",
    icon: "🏠",
  },
  {
    label: "Emergency Dispatch (108)",
    href: "/emergency",
    icon: "🚨",
    badge: "SOS",
    badgeColor: "bg-rose-600 text-white animate-pulse",
  },
  {
    label: "Book & My Appointments",
    href: "/appointments",
    icon: "📅",
  },
  {
    label: "Hospital Bed Vacancies",
    href: "/facilities",
    icon: "🛏️",
  },
  {
    label: "Blood Availability",
    href: "/blood",
    icon: "🩸",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, role, logout } = useAuth();

  const navItems = role === "admin" ? adminNavItems : patientNavItems;

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-200/90 bg-white lg:flex">
      {/* Brand Logo & Name */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold shadow-sm shadow-blue-500/30">
          <span className="text-xl">🩺</span>
        </div>
        <div>
          <span className="text-lg font-black tracking-tight text-slate-900">
            Pulse<span className="text-blue-600">Desk</span>
          </span>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            {role === "admin" ? "Hospital Command" : "Patient Portal"}
          </p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto px-3.5 py-4">
        <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {role === "admin" ? "Clinical Operations" : "Patient Services"}
        </p>

        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-150 ${
                isActive
                  ? "bg-blue-600 text-white shadow-xs shadow-blue-500/25"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-base transition-transform group-hover:scale-110">
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    item.badgeColor || "bg-slate-100 text-slate-600"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile & Sign Out Footer */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/70 space-y-2">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2 truncate">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-100 font-extrabold text-xs text-blue-700">
              {role === "admin" ? "MD" : "PT"}
            </div>
            <div className="truncate text-left leading-tight">
              <p className="text-xs font-bold text-slate-900 truncate">
                {user?.name || "PulseDesk User"}
              </p>
              <p className="text-[10px] text-slate-400 capitalize">
                {role === "admin" ? "Staff Administrator" : "Patient Account"}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 px-2 text-xs font-semibold text-slate-700 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-colors shadow-2xs"
        >
          <span>🚪</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
