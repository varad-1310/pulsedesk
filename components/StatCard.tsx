import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string | React.ReactNode;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  accentColor?: "blue" | "red" | "emerald" | "amber" | "purple";
}

export default function StatCard({
  title,
  value,
  icon,
  subtitle,
  trend,
  accentColor = "blue",
}: StatCardProps) {
  const accentClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    red: "bg-rose-50 text-rose-600 border-rose-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900">
              {value}
            </span>
            {trend && (
              <span
                className={`text-xs font-semibold ${
                  trend.isPositive ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {trend.value}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-400 font-medium">{subtitle}</p>
          )}
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl border text-xl ${accentClasses[accentColor]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
