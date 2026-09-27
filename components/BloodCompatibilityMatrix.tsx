"use client";

import React, { useState } from "react";
import { BloodGroup, BloodStock } from "@/lib/types";

interface CompatibilityData {
  canDonateTo: BloodGroup[];
  canReceiveFrom: BloodGroup[];
  description: string;
  isUniversalDonor?: boolean;
  isUniversalRecipient?: boolean;
}

const COMPATIBILITY_RULES: Record<BloodGroup, CompatibilityData> = {
  "O-": {
    canDonateTo: ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
    canReceiveFrom: ["O-"],
    description: "Universal Red Cell Donor. Essential for emergency room trauma resuscitation before cross-matching.",
    isUniversalDonor: true,
  },
  "O+": {
    canDonateTo: ["O+", "A+", "B+", "AB+"],
    canReceiveFrom: ["O-", "O+"],
    description: "Most common blood group. High clinical demand across emergency and general surgeries.",
  },
  "A-": {
    canDonateTo: ["A-", "A+", "AB-", "AB+"],
    canReceiveFrom: ["O-", "A-"],
    description: "Rare Rh-negative group. Crucial for oncology and pediatric cardiovascular units.",
  },
  "A+": {
    canDonateTo: ["A+", "AB+"],
    canReceiveFrom: ["O-", "O+", "A-", "A+"],
    description: "Second most common blood group. High utility for routine hospital procedures.",
  },
  "B-": {
    canDonateTo: ["B-", "B+", "AB-", "AB+"],
    canReceiveFrom: ["O-", "B-"],
    description: "Very rare blood type. High priority for proactive blood collection drives.",
  },
  "B+": {
    canDonateTo: ["B+", "AB+"],
    canReceiveFrom: ["O-", "O+", "B-", "B+"],
    description: "Widespread in South Asia. In continuous demand for trauma and thalassemia management.",
  },
  "AB-": {
    canDonateTo: ["AB-", "AB+"],
    canReceiveFrom: ["O-", "A-", "B-", "AB-"],
    description: "Rarest regular blood type. Rh-negative plasma can be given to all blood types.",
  },
  "AB+": {
    canDonateTo: ["AB+"],
    canReceiveFrom: ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
    description: "Universal Red Cell Recipient. Can safely accept packed red cells from any donor group.",
    isUniversalRecipient: true,
  },
};

export default function BloodCompatibilityMatrix({
  stocks,
}: {
  stocks: BloodStock[];
}) {
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup>("O-");
  const info = COMPATIBILITY_RULES[selectedGroup];

  // Calculate total units available across all compatible donors for this group
  const compatibleAvailableUnits = info.canReceiveFrom.reduce((acc, grp) => {
    const stock = stocks.find((s) => s.bloodGroup === grp);
    return acc + (stock ? stock.unitsAvailable : 0);
  }, 0);

  return (
    <div className="rounded-3xl border border-rose-200/90 bg-white p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-rose-100 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-rose-600 text-white text-xs font-black shadow-xs">
              🩸
            </span>
            <h3 className="font-extrabold text-slate-900 text-base">
              Blood Compatibility Matrix & Transfusion Matcher
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time ABO/Rh cross-match validator and emergency compatibility intelligence
          </p>
        </div>

        {/* Group selector tabs */}
        <div className="flex flex-wrap items-center gap-1">
          {(Object.keys(COMPATIBILITY_RULES) as BloodGroup[]).map((grp) => (
            <button
              key={grp}
              onClick={() => setSelectedGroup(grp)}
              className={`rounded-xl px-2.5 py-1 text-xs font-extrabold transition-all ${
                selectedGroup === grp
                  ? "bg-rose-600 text-white shadow-xs scale-105"
                  : "bg-rose-50 text-rose-800 hover:bg-rose-100"
              }`}
            >
              {grp}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-12">
        {/* Profile Card (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-gradient-to-br from-rose-50 to-orange-50/60 p-5 border border-rose-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-rose-700">
                Type {selectedGroup}
              </span>
              {info.isUniversalDonor && (
                <span className="rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase px-2.5 py-1 tracking-wider">
                  Universal Donor
                </span>
              )}
              {info.isUniversalRecipient && (
                <span className="rounded-full bg-blue-600 text-white text-[10px] font-black uppercase px-2.5 py-1 tracking-wider">
                  Universal Recipient
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              {info.description}
            </p>
          </div>

          <div className="mt-5 rounded-xl bg-white p-3.5 border border-rose-100 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Compatible Units in Cold Storage
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-slate-900">
                {compatibleAvailableUnits}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                safe transfusable units
              </span>
            </div>
          </div>
        </div>

        {/* Transfusion Pathways (8 cols) */}
        <div className="lg:col-span-8 grid gap-4 sm:grid-cols-2">
          {/* Can Receive From */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Can Receive From (Inflow)
              </span>
              <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                {info.canReceiveFrom.length} Group(s)
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {info.canReceiveFrom.map((grp) => {
                const stock = stocks.find((s) => s.bloodGroup === grp);
                return (
                  <div
                    key={grp}
                    className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 border border-slate-200 shadow-2xs"
                  >
                    <span className="font-black text-rose-600 text-xs">{grp}</span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      ({stock?.unitsAvailable || 0}u)
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-slate-500 mt-4 leading-relaxed">
              Patients with {selectedGroup} can safely accept erythrocyte units from these groups without acute hemolytic reaction.
            </p>
          </div>

          {/* Can Donate To */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Can Donate To (Outflow)
              </span>
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                {info.canDonateTo.length} Group(s)
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {info.canDonateTo.map((grp) => (
                <div
                  key={grp}
                  className="rounded-xl bg-white px-3 py-1.5 border border-slate-200 shadow-2xs font-black text-slate-800 text-xs"
                >
                  {grp}
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-500 mt-4 leading-relaxed">
              Donors with {selectedGroup} are compatible recipients for patients carrying any of these ABO/Rh surface antigens.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
