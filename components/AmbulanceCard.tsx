import React from "react";
import { Ambulance } from "@/lib/types";
import StatusBadge from "./StatusBadge";

interface AmbulanceCardProps {
  ambulance: Ambulance;
  onStatusChange?: (id: string, status: Ambulance["status"]) => void;
}

export default function AmbulanceCard({
  ambulance,
  onStatusChange,
}: AmbulanceCardProps) {
  const statusOptions: Ambulance["status"][] = [
    "Available",
    "Dispatched",
    "On Route",
    "Maintenance",
  ];

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:shadow-md transition-all duration-200">
      <div>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🚑</span>
              <h4 className="font-extrabold text-slate-900 text-base">
                {ambulance.vehicleNumber}
              </h4>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {ambulance.type}
            </p>
          </div>
          <StatusBadge status={ambulance.status} size="sm" />
        </div>

        <div className="mt-4 space-y-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Driver & Contact</span>
            <span className="font-semibold text-slate-800">
              {ambulance.driverName} ({ambulance.driverPhone})
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Location</span>
            <span className="font-medium text-slate-800 truncate max-w-[180px]">
              📍 {ambulance.currentLocation}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Fuel Level</span>
            <span className="font-bold text-slate-700">
              ⚡ {ambulance.fuelLevel}%
            </span>
          </div>

          {ambulance.etaMinutes !== undefined && ambulance.status !== "Available" && (
            <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
              <span className="text-slate-400">ETA to Scene</span>
              <span className="font-extrabold text-rose-600">
                ⏱️ ~{ambulance.etaMinutes} mins
              </span>
            </div>
          )}
        </div>
      </div>

      {onStatusChange && (
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-xs text-slate-400 font-medium">Fleet Status:</span>
          <select
            value={ambulance.status}
            onChange={(e) =>
              onStatusChange(ambulance.id, e.target.value as Ambulance["status"])
            }
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500"
          >
            {statusOptions.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
