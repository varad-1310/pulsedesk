"use client";

import React, { useState } from "react";
import Link from "next/link";
import StatCard from "@/components/StatCard";
import AppointmentCard from "@/components/AppointmentCard";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import { initialAppointments, initialPatients } from "@/lib/data";
import { Appointment, AppointmentStatus } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ToastProvider";

export default function AppointmentsPage() {
  const { user, role } = useAuth();
  const { showToast } = useToast();
  const [appointments, setAppointments] =
    useState<Appointment[]>(initialAppointments);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const [form, setForm] = useState({
    patientName: "",
    phone: "",
    doctorName: "Dr. Sandeep Kulkarni",
    department: "General Medicine",
    date: "2026-09-27",
    time: "11:00 AM",
    purpose: "",
    priority: "Normal" as Appointment["priority"],
    notes: "",
  });

  const statusOptions: AppointmentStatus[] = [
    "Scheduled",
    "Waiting",
    "In Consultation",
    "Completed",
    "Cancelled",
  ];

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.patientName.toLowerCase().includes(search.toLowerCase()) ||
      appointment.phone.includes(search) ||
      appointment.doctorName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || appointment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  function addAppointment(e: React.FormEvent) {
    e.preventDefault();

    if (!form.patientName || !form.phone || !form.purpose) {
      showToast(
        "Missing Information",
        "Please fill in patient name, phone, and visit purpose.",
        "warning"
      );
      return;
    }

    const newAppointment: Appointment = {
      id: `APT-${2000 + appointments.length + 1}`,
      patientName: form.patientName,
      phone: form.phone,
      doctorName: form.doctorName,
      department: form.department,
      date: form.date,
      time: form.time,
      purpose: form.purpose,
      priority: form.priority,
      status: "Scheduled",
      notes: form.notes,
      createdAt: new Date().toISOString(),
    };

    setAppointments([newAppointment, ...appointments]);
    setShowModal(false);
    showToast(
      "Appointment Booked",
      `Consultation scheduled for ${newAppointment.patientName} with ${newAppointment.doctorName}.`,
      "success"
    );
    setForm({
      patientName: "",
      phone: "",
      doctorName: "Dr. Sandeep Kulkarni",
      department: "General Medicine",
      date: "2026-09-27",
      time: "11:00 AM",
      purpose: "",
      priority: "Normal",
      notes: "",
    });
  }

  function handleUpdateStatus(id: string, status: AppointmentStatus) {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
    showToast(
      "Consultation Queue",
      `Appointment ${id} status updated to "${status}".`,
      "info"
    );
  }

  const todayCount = appointments.filter(
    (a) => a.date === "2026-09-27"
  ).length;
  const waitingCount = appointments.filter(
    (a) => a.status === "Waiting"
  ).length;
  const inConsultCount = appointments.filter(
    (a) => a.status === "In Consultation"
  ).length;
  const completedCount = appointments.filter(
    (a) => a.status === "Completed"
  ).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📅</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Outpatient Appointments
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Book patient visits, coordinate doctor queues, and record triage status.
          </p>
        </div>

        {role === "patient" ? (
          <Button
            variant="primary"
            icon="+"
            onClick={() => setShowModal(true)}
          >
            Book Appointment
          </Button>
        ) : (
          <div className="flex items-center gap-2 rounded-xl bg-purple-50 border border-purple-200 px-3.5 py-2 text-xs font-bold text-purple-700">
            <span>🛡️ Clinician Queue Mode</span>
            <span className="text-purple-400 font-normal">| Manage Status</span>
          </div>
        )}
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Visits"
          value={todayCount}
          icon="📅"
          accentColor="blue"
        />
        <StatCard
          title="In Waiting Room"
          value={waitingCount}
          icon="⏱️"
          accentColor="amber"
        />
        <StatCard
          title="In Consultation"
          value={inConsultCount}
          icon="👨‍⚕️"
          accentColor="purple"
        />
        <StatCard
          title="Completed Today"
          value={completedCount}
          icon="✓"
          accentColor="emerald"
        />
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs sm:flex-row sm:items-center justify-between">
        <div className="relative flex-1">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Search patient, phone number, or doctor..."
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500"
          >
            <option value="All">All Statuses ({appointments.length})</option>
            {statusOptions.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Appointments Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAppointments.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-200 p-12 text-center text-slate-400">
            No appointments match your criteria.
          </div>
        ) : (
          filteredAppointments.map((apt) => (
            <AppointmentCard
              key={apt.id}
              appointment={apt}
              onUpdateStatus={handleUpdateStatus}
            />
          ))
        )}
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Schedule New Appointment"
        subtitle="Reserve an outpatient consultation slot"
      >
        <form onSubmit={addAppointment} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Select or Type Patient Name *
            </label>
            <input
              type="text"
              required
              value={form.patientName}
              onChange={(e) =>
                setForm({ ...form, patientName: e.target.value })
              }
              placeholder="e.g. Aarav Sharma"
              list="patients-list"
              className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
            />
            <datalist id="patients-list">
              {initialPatients.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.phone} ({p.bloodGroup})
                </option>
              ))}
            </datalist>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                placeholder="10-digit mobile"
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Priority
              </label>
              <select
                value={form.priority}
                onChange={(e) =>
                  setForm({
                    ...form,
                    priority: e.target.value as Appointment["priority"],
                  })
                }
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
              >
                <option value="Normal">Normal</option>
                <option value="Urgent">Urgent</option>
                <option value="Follow-up">Follow-up</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Doctor
              </label>
              <select
                value={form.doctorName}
                onChange={(e) =>
                  setForm({ ...form, doctorName: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
              >
                <option value="Dr. Sandeep Kulkarni">
                  Dr. Sandeep Kulkarni (General Medicine)
                </option>
                <option value="Dr. Neha Mehta">
                  Dr. Neha Mehta (Surgery Post-Op)
                </option>
                <option value="Dr. Aniruddh Gupta">
                  Dr. Aniruddh Gupta (Cardiology)
                </option>
                <option value="Dr. Meera Nambiar">
                  Dr. Meera Nambiar (Endocrinology)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Department
              </label>
              <input
                type="text"
                value={form.department}
                onChange={(e) =>
                  setForm({ ...form, department: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Time
              </label>
              <input
                type="text"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                placeholder="e.g. 10:30 AM"
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Purpose of Visit *
            </label>
            <input
              type="text"
              required
              value={form.purpose}
              onChange={(e) => setForm({ ...form, purpose: e.target.value })}
              placeholder="e.g. Chest pain review, routine checkup"
              className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Clinical Notes / Symptoms
            </label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Optional pre-consultation notes..."
              className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Confirm Booking
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}