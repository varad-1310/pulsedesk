import React from "react";
import { Appointment } from "@/lib/types";
import StatusBadge from "./StatusBadge";

interface AppointmentCardProps {
  appointment: Appointment;
  onUpdateStatus?: (id: string, status: Appointment["status"]) => void;
}

export default function AppointmentCard({
  appointment,
  onUpdateStatus,
}: AppointmentCardProps) {
  const statusOptions: Appointment["status"][] = [
    "Scheduled",
    "Waiting",
    "In Consultation",
    "Completed",
    "Cancelled",
  ];

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:shadow-md transition-all duration-200">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="font-bold text-slate-900 text-base">
              {appointment.patientName}
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              📞 {appointment.phone}
            </p>
          </div>
          <StatusBadge status={appointment.status} size="sm" />
        </div>

        <div className="mt-4 space-y-2 rounded-xl bg-slate-50/70 p-3 text-xs text-slate-600 border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Doctor</span>
            <span className="font-semibold text-slate-800">
              {appointment.doctorName}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Department</span>
            <span className="font-medium text-slate-700">
              {appointment.department}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Schedule</span>
            <span className="font-medium text-slate-700">
              {appointment.date} at {appointment.time}
            </span>
          </div>
          <div className="pt-1 text-slate-600 border-t border-slate-200/50">
            <span className="text-slate-400">Purpose: </span>
            <span className="font-medium">{appointment.purpose}</span>
          </div>
        </div>
      </div>

      {onUpdateStatus && (
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-xs text-slate-400 font-medium">Change Status:</span>
          <select
            value={appointment.status}
            onChange={(e) =>
              onUpdateStatus(appointment.id, e.target.value as Appointment["status"])
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
