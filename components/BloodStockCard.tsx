import React from "react";
import { BloodStock } from "@/lib/types";
import { getBloodGroupColor } from "@/lib/utils";
import StatusBadge from "./StatusBadge";

interface BloodStockCardProps {
  stock: BloodStock;
  onUpdateUnits?: (id: string, delta: number) => void;
}

export default function BloodStockCard({
  stock,
  onUpdateUnits,
}: BloodStockCardProps) {
  const percentage = Math.min(
    100,
    Math.round((stock.unitsAvailable / (stock.minThreshold * 2.5)) * 100)
  );

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:shadow-md transition-all duration-200">
      <div>
        <div className="flex items-start justify-between">
          <span
            className={`rounded-2xl border px-3 py-1.5 text-base font-extrabold ${getBloodGroupColor(
              stock.bloodGroup
            )}`}
          >
            {stock.bloodGroup}
          </span>
          <StatusBadge status={stock.status} size="sm" />
        </div>

        <div className="mt-4">
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">
              {stock.unitsAvailable}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              Units in stock
            </span>
          </div>

          {/* Supply progress bar */}
          <div className="mt-2.5 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                stock.status === "Critical"
                  ? "bg-rose-500"
                  : stock.status === "Low"
                  ? "bg-orange-500"
                  : "bg-emerald-500"
              }`}
              style={{ width: `${Math.max(8, percentage)}%` }}
            />
          </div>

          <p className="mt-2 text-[11px] text-slate-400">
            Safety threshold: {stock.minThreshold} units
          </p>
        </div>
      </div>

      {onUpdateUnits && (
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-xs font-semibold text-slate-500">
            Adjust Stock:
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onUpdateUnits(stock.id, -1)}
              disabled={stock.unitsAvailable <= 0}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-30"
              title="Dispense 1 Unit"
            >
              -
            </button>
            <button
              onClick={() => onUpdateUnits(stock.id, 1)}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-700 hover:bg-blue-100"
              title="Add 1 Unit"
            >
              +
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
