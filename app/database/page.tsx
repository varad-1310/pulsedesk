"use client";

import React, { useState } from "react";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import {
  initialPatients,
  initialAppointments,
  initialAmbulances,
  initialEmergencies,
  initialBloodStock,
  initialFacilities,
} from "@/lib/data";

type TableName =
  | "patients"
  | "appointments"
  | "ambulances"
  | "emergencies"
  | "bloodStocks"
  | "facilities";

export default function DatabaseViewerPage() {
  const [selectedTable, setSelectedTable] = useState<TableName>("patients");
  const [search, setSearch] = useState("");
  const [viewJson, setViewJson] = useState(false);

  const tables: {
    id: TableName;
    name: string;
    icon: string;
    count: number;
    description: string;
  }[] = [
    {
      id: "patients",
      name: "patients",
      icon: "👥",
      count: initialPatients.length,
      description: "Electronic Medical Records & Patient Identity",
    },
    {
      id: "appointments",
      name: "appointments",
      icon: "📅",
      count: initialAppointments.length,
      description: "Clinic Consultations & Status Lifecycle",
    },
    {
      id: "ambulances",
      name: "ambulances",
      icon: "🚑",
      count: initialAmbulances.length,
      description: "Fleet Readiness & Telemetry Tracking",
    },
    {
      id: "emergencies",
      name: "emergency_requests",
      icon: "🚨",
      count: initialEmergencies.length,
      description: "108 Triage & Rapid Response Incidents",
    },
    {
      id: "bloodStocks",
      name: "blood_stocks",
      icon: "🩸",
      count: initialBloodStock.length,
      description: "Regional ABO/Rh Inventory & Thresholds",
    },
    {
      id: "facilities",
      name: "facilities",
      icon: "🏥",
      count: initialFacilities.length,
      description: "Hospitals, Clinics & Bed Capacity Directory",
    },
  ];

  function getTableData() {
    switch (selectedTable) {
      case "patients":
        return initialPatients;
      case "appointments":
        return initialAppointments;
      case "ambulances":
        return initialAmbulances;
      case "emergencies":
        return initialEmergencies;
      case "bloodStocks":
        return initialBloodStock;
      case "facilities":
        return initialFacilities;
      default:
        return [];
    }
  }

  const rawData = getTableData();

  const filteredData = rawData.filter((item: any) => {
    if (!search) return true;
    const str = JSON.stringify(item).toLowerCase();
    return str.includes(search.toLowerCase());
  });

  const columns = rawData.length > 0 ? Object.keys(rawData[0]) : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🗄️</span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Database Explorer
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Live database table inspector, relational schemas, and data records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewJson(!viewJson)}
            className={`rounded-xl border px-3.5 py-2 text-xs font-bold transition-colors ${
              viewJson
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {viewJson ? "📋 Show Table View" : "{ } View Raw JSON"}
          </button>
        </div>
      </div>

      {/* Database Connection Info Banner */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50/80 p-4 text-xs text-blue-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="font-bold">Database Storage:</span>{" "}
            <span>In-Memory Active Store seeded with realistic clinical records</span>
            <span className="mx-2">•</span>
            <span className="font-bold">Schema Engine:</span>{" "}
            <span className="font-mono text-[11px] bg-blue-100/80 px-1.5 py-0.5 rounded">
              prisma/schema.prisma
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Connected & Syncing
          </span>
        </div>
      </div>

      {/* Table Selector Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {tables.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setSelectedTable(t.id);
              setSearch("");
            }}
            className={`flex flex-col items-start p-3.5 rounded-2xl border text-left transition-all ${
              selectedTable === t.id
                ? "border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20 shadow-xs"
                : "border-slate-200/90 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/60"
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-base">{t.icon}</span>
              <span
                className={`text-[11px] font-black rounded-full px-2 py-0.5 ${
                  selectedTable === t.id
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {t.count}
              </span>
            </div>
            <span className="mt-2 font-bold text-xs capitalize truncate w-full">
              {t.name}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 truncate w-full">
              {t.count} record(s)
            </span>
          </button>
        ))}
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`🔍 Search in table '${selectedTable}'...`}
            className="w-full rounded-xl border border-slate-200 px-4 py-2 text-xs outline-none focus:border-blue-500"
          />
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Showing <strong>{filteredData.length}</strong> of{" "}
          <strong>{rawData.length}</strong> row(s)
        </div>
      </div>

      {/* Main Data View */}
      {viewJson ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-900 p-5 text-emerald-400 font-mono text-xs overflow-x-auto shadow-inner max-h-[550px]">
          <pre>{JSON.stringify(filteredData, null, 2)}</pre>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
          <div className="overflow-x-auto max-h-[550px]">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="sticky top-0 bg-slate-100/90 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider backdrop-blur-xs">
                <tr>
                  <th className="px-4 py-3">#</th>
                  {columns.map((col) => (
                    <th key={col} className="px-4 py-3 whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {filteredData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length + 1}
                      className="p-8 text-center text-slate-400 font-sans"
                    >
                      No records found in this table matching &ldquo;{search}&rdquo;.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((row: any, idx: number) => (
                    <tr
                      key={idx}
                      className="hover:bg-blue-50/30 transition-colors"
                    >
                      <td className="px-4 py-3 text-slate-400 font-bold">
                        {idx + 1}
                      </td>
                      {columns.map((col) => {
                        const val = row[col];
                        const isStatus =
                          col === "status" || col === "severity";
                        return (
                          <td
                            key={col}
                            className="px-4 py-3 whitespace-nowrap max-w-xs truncate"
                          >
                            {isStatus && typeof val === "string" ? (
                              <StatusBadge status={val} size="sm" />
                            ) : typeof val === "boolean" ? (
                              <span
                                className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                                  val
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-slate-100 text-slate-500"
                                }`}
                              >
                                {val ? "TRUE" : "FALSE"}
                              </span>
                            ) : val !== null && val !== undefined ? (
                              String(val)
                            ) : (
                              <span className="text-slate-300 italic">null</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
