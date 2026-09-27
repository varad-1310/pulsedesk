"use client";

import React, { useState } from "react";
import StatCard from "@/components/StatCard";
import Button from "@/components/Button";
import { initialFacilities } from "@/lib/data";
import { Facility, FacilityType } from "@/lib/types";

export default function FacilitiesPage() {
  const [facilities, setFacilities] =
    useState<Facility[]>(initialFacilities);
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [search, setSearch] = useState("");

  const facilityTypes: FacilityType[] = [
    "Hospital",
    "Clinic",
    "ICU Center",
    "Diagnostic Lab",
    "Blood Bank",
  ];

  const filteredFacilities = facilities.filter((fac) => {
    const matchesSearch =
      fac.name.toLowerCase().includes(search.toLowerCase()) ||
      fac.address.toLowerCase().includes(search.toLowerCase());

    const matchesType = typeFilter === "All" || fac.type === typeFilter;

    return matchesSearch && matchesType;
  });

  function adjustBeds(id: string, delta: number) {
    setFacilities((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          return {
            ...f,
            availableBeds: Math.max(
              0,
              Math.min(f.totalBeds, f.availableBeds + delta)
            ),
          };
        }
        return f;
      })
    );
  }

  const totalBeds = facilities.reduce((acc, f) => acc + f.totalBeds, 0);
  const totalAvailableBeds = facilities.reduce(
    (acc, f) => acc + f.availableBeds,
    0
  );
  const totalIcuBeds = facilities.reduce((acc, f) => acc + f.icuBeds, 0);
  const availableIcu = facilities.reduce((acc, f) => acc + f.availableIcu, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🏥</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Healthcare Facilities Directory
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Network hospitals, trauma centers, ICU capacity, and clinical bed availability.
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Bed Capacity"
          value={totalBeds}
          icon="🛏️"
          subtitle="Regional Grid"
          accentColor="blue"
        />
        <StatCard
          title="Beds Available Now"
          value={totalAvailableBeds}
          icon="🟢"
          subtitle={`${Math.round((totalAvailableBeds / (totalBeds || 1)) * 100)}% Available`}
          accentColor="emerald"
        />
        <StatCard
          title="Total ICU Beds"
          value={totalIcuBeds}
          icon="🩺"
          subtitle="Critical Care Units"
          accentColor="purple"
        />
        <StatCard
          title="Available ICU Beds"
          value={availableIcu}
          icon="🚨"
          subtitle="Immediate High-Dependency"
          accentColor={availableIcu <= 5 ? "red" : "amber"}
        />
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs sm:flex-row sm:items-center justify-between">
        <div className="relative flex-1">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Search hospital, clinic, or location..."
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Type:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500"
          >
            <option value="All">All Facilities ({facilities.length})</option>
            {facilityTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Facilities Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredFacilities.map((facility) => {
          const occupancy = Math.round(
            ((facility.totalBeds - facility.availableBeds) /
              (facility.totalBeds || 1)) *
              100
          );

          return (
            <div
              key={facility.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs hover:shadow-md transition-all duration-200"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-block rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 mb-2">
                      {facility.type}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 leading-snug">
                      {facility.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      📍 {facility.address}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 border border-amber-200">
                    ★ {facility.rating}
                  </div>
                </div>

                {/* Bed Capacity Progress */}
                <div className="mt-5 rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-600">Bed Occupancy</span>
                    <span className="text-slate-900 font-bold">{occupancy}% Full</span>
                  </div>
                  <div className="mt-2 h-2.5 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        occupancy >= 90
                          ? "bg-rose-500"
                          : occupancy >= 75
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${occupancy}%` }}
                    />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">
                        Available General Beds
                      </span>
                      <span className="text-base font-extrabold text-slate-900">
                        {facility.availableBeds}{" "}
                        <span className="text-xs font-normal text-slate-400">
                          / {facility.totalBeds}
                        </span>
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">
                        Available ICU Beds
                      </span>
                      <span className="text-base font-extrabold text-rose-600">
                        {facility.availableIcu}{" "}
                        <span className="text-xs font-normal text-slate-400">
                          / {facility.icuBeds}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Emergency Desk</span>
                    <span className="font-semibold text-slate-800">
                      📞 {facility.phone}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Operating Hours</span>
                    <span className="font-medium text-slate-700">
                      ⏱️ {facility.operatingHours}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-xs font-semibold text-slate-500">
                  Quick Bed Allocation:
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => adjustBeds(facility.id, -1)}
                    disabled={facility.availableBeds <= 0}
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-30"
                    title="Admit Patient (-1 Bed)"
                  >
                    -
                  </button>
                  <button
                    onClick={() => adjustBeds(facility.id, 1)}
                    disabled={facility.availableBeds >= facility.totalBeds}
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-700 hover:bg-blue-100 disabled:opacity-30"
                    title="Discharge Patient (+1 Bed)"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
