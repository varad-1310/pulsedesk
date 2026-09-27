import React from "react";
import { EmergencyRequest } from "@/lib/types";
import StatusBadge from "./StatusBadge";

interface EmergencyCardProps {
  emergency: EmergencyRequest;
  onDispatch?: (id: string) => void;
  onResolve?: (id: string) => void;
}

export default function EmergencyCard({
  emergency,
  onDispatch,
  onResolve,
}: EmergencyCardProps) {
  const severityColors = {
    Critical: "bg-rose-600 text-white animate-pulse",
    Severe: "bg-orange-500 text-white",
    Moderate: "bg-amber-500 text-white",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-white p-5 shadow-xs transition-all duration-200 hover:shadow-md ${
        emergency.severity === "Critical"
          ? "border-rose-300 shadow-rose-100"
          : "border-slate-200"
      }`}
    >
      {/* Top Banner */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-black uppercase tracking-wider ${
              severityColors[emergency.severity]
            }`}
          >
            {emergency.severity}
          </span>
          <span className="text-xs font-bold text-slate-400">
            {emergency.id}
          </span>
        </div>
        <StatusBadge status={emergency.status} size="sm" />
      </div>

      <h4 className="mt-3 text-base font-bold text-slate-900 leading-snug">
        {emergency.emergencyType}
      </h4>

      <div className="mt-3 space-y-1.5 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 border border-slate-100">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Caller / Patient</span>
          <span className="font-semibold text-slate-800">
            {emergency.patientName} ({emergency.contact})
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Location</span>
          <span className="font-medium text-slate-800">
            📍 {emergency.location}
          </span>
        </div>
        {emergency.ambulanceAssignedId && (
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Assigned Unit</span>
            <span className="font-bold text-blue-600">
              🚑 {emergency.ambulanceAssignedId}
            </span>
          </div>
        )}
        {emergency.notes && (
          <p className="mt-2 text-slate-500 border-t border-slate-200/50 pt-1.5 italic">
            &ldquo;{emergency.notes}&rdquo;
          </p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
        {emergency.status === "Pending" && onDispatch && (
          <button
            onClick={() => onDispatch(emergency.id)}
            className="rounded-xl bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-rose-700 active:scale-95"
          >
            🚑 Dispatch Ambulance
          </button>
        )}
        {emergency.status !== "Resolved" && onResolve && (
          <button
            onClick={() => onResolve(emergency.id)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Mark Resolved ✓
          </button>
        )}
      </div>
    </div>
  );
}
