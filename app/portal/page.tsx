"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import StatCard from "@/components/StatCard";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import StatusBadge from "@/components/StatusBadge";
import {
  initialPatients,
  initialAppointments,
  initialFacilities,
  initialBloodStock,
  initialAmbulances,
} from "@/lib/data";
import { Appointment, EmergencyRequest, BloodGroup } from "@/lib/types";
import { useToast } from "@/components/ToastProvider";

export default function PatientPortalPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const fallback =
    initialPatients.find((p) => p.id === user?.patientId) || initialPatients[0];

  const patientData = {
    id: user?.patientId || fallback.id,
    name: user?.name || fallback.name,
    age: user?.age || fallback.age,
    gender: user?.gender || fallback.gender,
    bloodGroup: user?.bloodGroup || fallback.bloodGroup,
    phone: user?.phone || fallback.phone,
    emergencyContact: user?.emergencyContact || fallback.emergencyContact,
    address: user?.address || fallback.address,
    medicalHistory: user?.medicalHistory || fallback.medicalHistory,
  };

  const [appointments, setAppointments] = useState<Appointment[]>(
    initialAppointments.filter((a) => a.phone === patientData.phone)
  );
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [sosTriggered, setSosTriggered] = useState(false);
  const [sosEmergency, setSosEmergency] = useState<EmergencyRequest | null>(null);

  // SOS Form state
  const [sosForm, setSosForm] = useState({
    emergencyType: "Acute Shortness of Breath / Breathing Difficulty",
    location: patientData.address || "Green Meadows, Pune",
    notes: "",
  });

  // Book appointment state
  const [bookForm, setBookForm] = useState({
    doctorName: "Dr. Sandeep Kulkarni",
    department: "General Medicine",
    date: "2026-09-28",
    time: "10:30 AM",
    purpose: "",
  });

  function handleTriggerSos(e: React.FormEvent) {
    e.preventDefault();

    const newSos: EmergencyRequest = {
      id: `EMG-${Math.floor(Math.random() * 800) + 900}`,
      patientName: patientData.name,
      contact: patientData.phone,
      emergencyType: sosForm.emergencyType,
      severity: "Critical",
      location: sosForm.location,
      ambulanceAssignedId: "AMB-01",
      status: "Dispatched",
      requestedAt: new Date().toISOString(),
      notes: sosForm.notes || "Triggered via Patient Portal 1-Tap SOS",
    };

    setSosEmergency(newSos);
    setSosTriggered(true);
    setSosModalOpen(false);
    showToast(
      "SOS Alert Broadcasted",
      "Ambulance AMB-01 dispatched to your coordinates! Live siren priority active.",
      "danger"
    );
  }

  function handleBookAppointment(e: React.FormEvent) {
    e.preventDefault();

    if (!bookForm.purpose) {
      showToast("Missing Field", "Please enter the reason for your visit.", "warning");
      return;
    }

    const newApt: Appointment = {
      id: `APT-${Math.floor(Math.random() * 8000) + 2000}`,
      patientId: patientData.id,
      patientName: patientData.name,
      phone: patientData.phone,
      doctorName: bookForm.doctorName,
      department: bookForm.department,
      date: bookForm.date,
      time: bookForm.time,
      purpose: bookForm.purpose,
      status: "Scheduled",
      priority: "Normal",
      createdAt: new Date().toISOString(),
    };

    setAppointments([newApt, ...appointments]);
    setBookModalOpen(false);
    showToast(
      "Appointment Confirmed",
      `Consultation with ${bookForm.doctorName} booked for ${bookForm.date} at ${bookForm.time}.`,
      "success"
    );
    setBookForm({
      doctorName: "Dr. Sandeep Kulkarni",
      department: "General Medicine",
      date: "2026-09-28",
      time: "10:30 AM",
      purpose: "",
    });
  }

  // Check blood availability for patient's blood group
  const myBloodStock = initialBloodStock.find(
    (b) => b.bloodGroup === patientData.bloodGroup
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner & Role Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-6 sm:p-8 text-white shadow-xl shadow-blue-500/15">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-md">
              Patient Portal
            </span>
            <span className="text-xs text-blue-100">
              ID: {patientData.id}
            </span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {patientData.name}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-blue-100 max-w-xl">
            Access your outpatient appointments, emergency SOS dispatch, live hospital bed availability, and health profile.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="danger"
            size="md"
            icon="🚨"
            onClick={() => setSosModalOpen(true)}
            className="animate-pulse shadow-lg shadow-rose-900/30"
          >
            1-Tap Emergency SOS
          </Button>
          <Button
            variant="outline"
            size="md"
            icon="📅"
            onClick={() => setBookModalOpen(true)}
            className="bg-white/10 text-white border-white/20 hover:bg-white/20"
          >
            Book Visit
          </Button>
        </div>
      </div>

      {/* Live SOS Status Card (if triggered) */}
      {sosTriggered && sosEmergency && (
        <div className="rounded-3xl border-2 border-rose-500 bg-rose-50/90 p-6 text-rose-950 shadow-md animate-in slide-in-from-top-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-600 text-white text-2xl animate-ping">
                🚨
              </span>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-rose-600">
                  ACTIVE EMERGENCY DISPATCH
                </span>
                <h3 className="text-lg font-black text-rose-950">
                  Ambulance {sosEmergency.ambulanceAssignedId} En Route to Your Location
                </h3>
                <p className="text-xs text-rose-800 mt-0.5">
                  Destination: {sosEmergency.location} • Estimated Arrival: ~5 mins
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="tel:108"
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-rose-700 shadow-sm"
              >
                📞 Call 108 Dispatcher
              </a>
              <button
                onClick={() => setSosTriggered(false)}
                className="rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Patient Health Card & Quick Overview Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Digital Medical Identity Card */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  PulseDesk Health Passport
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  {patientData.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {patientData.age} yrs • {patientData.gender}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span className="rounded-2xl bg-rose-50 border border-rose-200 px-3 py-1 text-sm font-black text-rose-700">
                  {patientData.bloodGroup}
                </span>
                <span className="text-[10px] text-slate-400 mt-1">Blood Type</span>
              </div>
            </div>

            <div className="mt-5 space-y-2.5 rounded-2xl bg-slate-50 p-4 text-xs text-slate-700 border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-400">Mobile Phone</span>
                <span className="font-semibold text-slate-900">{patientData.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Emergency Relative</span>
                <span className="font-bold text-rose-700">
                  🚨 {patientData.emergencyContact}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Registered Address</span>
                <span className="font-medium text-slate-800 text-right truncate max-w-[160px]">
                  {patientData.address}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Known Conditions & Allergies
              </span>
              <p className="rounded-xl bg-amber-50/60 p-3 text-xs text-amber-900 border border-amber-200/80 font-medium">
                {patientData.medicalHistory || "None recorded"}
              </p>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400">Status: Active Patient</span>
            <span className="text-blue-600 font-bold">QR Verified ✓</span>
          </div>
        </div>

        {/* My Appointments Card */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  My Consultations & Appointments
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Scheduled clinic appointments and queue position
                </p>
              </div>
              <button
                onClick={() => setBookModalOpen(true)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                + New Appointment
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {appointments.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-400 text-xs">
                  You have no appointments scheduled.
                </div>
              ) : (
                appointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-slate-50 p-4 border border-slate-100 hover:bg-slate-100/60 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">
                          {apt.doctorName}
                        </h4>
                        <span className="text-xs text-slate-400 font-medium">
                          • {apt.department}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Reason: <strong>{apt.purpose}</strong>
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        📅 {apt.date} at ⏱️ {apt.time}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <StatusBadge status={apt.status} size="sm" />
                      {apt.status === "Waiting" && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800">
                          Queue #2
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-400 flex justify-between items-center">
            <span>Please arrive 10 minutes prior to consultation.</span>
            <Link
              href="/appointments"
              className="text-blue-600 font-bold hover:underline"
            >
              Hospital Schedule →
            </Link>
          </div>
        </div>
      </div>

      {/* Grid: Live Hospital Bed Capacity (for patients) & Blood Bank Availability */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Nearby Facilities Bed Finder */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Live Hospital Bed Finder
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time admission vacancy across network hospitals
              </p>
            </div>
            <Link
              href="/facilities"
              className="text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              Directory ({initialFacilities.length}) →
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {initialFacilities.slice(0, 3).map((facility) => (
              <div
                key={facility.id}
                className="flex items-center justify-between rounded-2xl bg-slate-50 p-3.5 border border-slate-100 text-xs"
              >
                <div>
                  <h4 className="font-bold text-slate-900">{facility.name}</h4>
                  <p className="text-slate-400 mt-0.5">📍 {facility.address}</p>
                  <p className="text-slate-500 mt-1 font-medium">
                    📞 {facility.phone}
                  </p>
                </div>
                <div className="text-right">
                  <span className="rounded-xl bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-bold text-emerald-700 block">
                    {facility.availableBeds} Beds Free
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    {facility.availableIcu} ICU Ready
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Blood Supply Tracker (Personalized) */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Regional Blood Availability
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Verify reserves for your group ({patientData.bloodGroup}) & family
              </p>
            </div>
            <Link
              href="/blood"
              className="text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              All Blood Stocks →
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {initialBloodStock.slice(0, 4).map((stock) => (
              <div
                key={stock.id}
                className={`rounded-2xl border p-3 text-center ${
                  stock.bloodGroup === patientData.bloodGroup
                    ? "bg-blue-50 border-blue-300 ring-2 ring-blue-500/20"
                    : "bg-slate-50 border-slate-100"
                }`}
              >
                <span className="text-sm font-black text-slate-900 block">
                  {stock.bloodGroup}
                </span>
                <span className="text-xl font-black text-blue-600 block my-1">
                  {stock.unitsAvailable}
                </span>
                <span
                  className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${
                    stock.status === "Critical"
                      ? "bg-rose-100 text-rose-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {stock.status}
                </span>
                {stock.bloodGroup === patientData.bloodGroup && (
                  <span className="text-[10px] font-bold text-blue-600 block mt-1.5">
                    Your Group ★
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-2xl bg-blue-50/80 p-3.5 text-xs text-blue-900 border border-blue-100 flex items-center justify-between">
            <span>Need emergency blood transfusion?</span>
            <Link
              href="/blood"
              className="font-bold text-blue-700 underline"
            >
              Request Units
            </Link>
          </div>
        </div>
      </div>

      {/* 1-Tap SOS Emergency Modal */}
      <Modal
        isOpen={sosModalOpen}
        onClose={() => setSosModalOpen(false)}
        title="🚨 1-Tap Emergency SOS Dispatch"
        subtitle="Immediately routes GPS alert to closest trauma center & ambulance"
      >
        <form onSubmit={handleTriggerSos} className="space-y-4">
          <div className="rounded-2xl bg-rose-50 p-4 border border-rose-200 text-xs text-rose-900">
            ⚡ <strong>Critical Alert:</strong> This immediately transmits your name (
            {patientData.name}), phone ({patientData.phone}), and coordinates to
            the 108 Emergency Dispatch room.
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Select Emergency Symptoms / Nature *
            </label>
            <select
              value={sosForm.emergencyType}
              onChange={(e) =>
                setSosForm({ ...sosForm, emergencyType: e.target.value })
              }
              className="w-full rounded-xl border border-slate-200 p-3 text-sm font-semibold text-rose-700 outline-none focus:border-rose-500"
            >
              <option value="Acute Shortness of Breath / Breathing Difficulty">
                Acute Shortness of Breath / Breathing Difficulty
              </option>
              <option value="Chest Pain / Suspected Heart Attack">
                Chest Pain / Suspected Heart Attack
              </option>
              <option value="Severe Physical Trauma / Road Accident">
                Severe Physical Trauma / Road Accident
              </option>
              <option value="Loss of Consciousness / Seizure">
                Loss of Consciousness / Seizure
              </option>
              <option value="Severe Pediatric Emergency">
                Severe Pediatric Emergency
              </option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Current Location / Pickup Address *
            </label>
            <input
              type="text"
              required
              value={sosForm.location}
              onChange={(e) =>
                setSosForm({ ...sosForm, location: e.target.value })
              }
              placeholder="Apartment, building, road landmark"
              className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Additional Details (Optional)
            </label>
            <textarea
              rows={2}
              value={sosForm.notes}
              onChange={(e) =>
                setSosForm({ ...sosForm, notes: e.target.value })
              }
              placeholder="e.g. 2nd floor, patient is sitting upright..."
              className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSosModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="danger" size="sm">
              Confirm & Dispatch Ambulance Now
            </Button>
          </div>
        </form>
      </Modal>

      {/* Book Visit Modal */}
      <Modal
        isOpen={bookModalOpen}
        onClose={() => setBookModalOpen(false)}
        title="Book Outpatient Consultation"
        subtitle={`Booking for ${patientData.name} (${patientData.phone})`}
      >
        <form onSubmit={handleBookAppointment} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Doctor
              </label>
              <select
                value={bookForm.doctorName}
                onChange={(e) =>
                  setBookForm({ ...bookForm, doctorName: e.target.value })
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
                value={bookForm.department}
                onChange={(e) =>
                  setBookForm({ ...bookForm, department: e.target.value })
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
                required
                value={bookForm.date}
                onChange={(e) =>
                  setBookForm({ ...bookForm, date: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Preferred Time
              </label>
              <select
                value={bookForm.time}
                onChange={(e) =>
                  setBookForm({ ...bookForm, time: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
              >
                <option value="09:30 AM">09:30 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="10:30 AM">10:30 AM</option>
                <option value="11:30 AM">11:30 AM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="04:30 PM">04:30 PM</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Reason / Symptoms *
            </label>
            <input
              type="text"
              required
              value={bookForm.purpose}
              onChange={(e) =>
                setBookForm({ ...bookForm, purpose: e.target.value })
              }
              placeholder="e.g. Asthma review, general checkup"
              className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setBookModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Confirm Appointment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
