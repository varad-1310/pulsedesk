import React from "react";
import { Patient } from "@/lib/types";
import { getBloodGroupColor } from "@/lib/utils";

interface PatientCardProps {
  patient: Patient;
  onSelect?: (patient: Patient) => void;
}

export default function PatientCard({ patient, onSelect }: PatientCardProps) {
  const initials = patient.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div
      onClick={() => onSelect?.(patient)}
      className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      <div>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 font-extrabold text-sm border border-blue-100">
              {initials}
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">
                {patient.name}
              </h4>
              <p className="text-xs text-slate-400 font-semibold">{patient.id}</p>
            </div>
          </div>
          <span
            className={`rounded-xl border px-2.5 py-1 text-xs ${getBloodGroupColor(
              patient.bloodGroup
            )}`}
          >
            {patient.bloodGroup}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
          <div>
            <span className="text-slate-400 block text-[11px]">Age / Gender</span>
            <span className="font-medium text-slate-800">
              {patient.age} yrs • {patient.gender}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Phone</span>
            <span className="font-medium text-slate-800">{patient.phone}</span>
          </div>
          <div className="col-span-2">
            <span className="text-slate-400 block text-[11px]">
              Emergency Contact
            </span>
            <span className="font-medium text-slate-800">
              🚨 {patient.emergencyContact}
            </span>
          </div>
        </div>

        {patient.medicalHistory && (
          <p className="mt-3 text-xs text-slate-500 line-clamp-1 italic">
            <span className="font-medium not-italic text-slate-600">History: </span>
            {patient.medicalHistory}
          </p>
        )}
      </div>

      <div className="mt-4 border-t border-slate-100 pt-3 text-right">
        <span className="text-xs font-semibold text-blue-600 hover:text-blue-800">
          View Profile & History →
        </span>
      </div>
    </div>
  );
}
