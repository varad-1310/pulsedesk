"use client";

import React, { useState } from "react";
import Link from "next/link";
import StatCard from "@/components/StatCard";
import EmergencyCard from "@/components/EmergencyCard";
import AppointmentCard from "@/components/AppointmentCard";
import AmbulanceCard from "@/components/AmbulanceCard";
import BloodStockCard from "@/components/BloodStockCard";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import {
  initialEmergencies,
  initialAppointments,
  initialAmbulances,
  initialBloodStock,
  initialFacilities,
  initialPatients,
} from "@/lib/data";
import {
  EmergencyRequest,
  Appointment,
  Ambulance,
  BloodStock,
} from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ToastProvider";
import LiveDispatchRadar from "@/components/LiveDispatchRadar";
import AiTriageAssistant from "@/components/AiTriageAssistant";
import PatientPortalPage from "./portal/page";

export default function DashboardPage() {
  const { user, role, isLoading } = useAuth();
  const { showToast } = useToast();

  if (isLoading || !user) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent" />
          <p className="mt-3 text-xs font-semibold text-slate-500">
            Connecting to PulseDesk Command Center...
          </p>
        </div>
      </div>
    );
  }

  if (role === "patient") {
    return <PatientPortalPage />;
  }

  const [emergencies, setEmergencies] =
    useState<EmergencyRequest[]>(initialEmergencies);
  const [appointments, setAppointments] =
    useState<Appointment[]>(initialAppointments);
  const [ambulances, setAmbulances] =
    useState<Ambulance[]>(initialAmbulances);
  const [bloodStocks, setBloodStocks] =
    useState<BloodStock[]>(initialBloodStock);

  // Quick dispatch modal state
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [selectedEmergencyId, setSelectedEmergencyId] = useState<string | null>(
    null
  );
  const [selectedAmbulanceId, setSelectedAmbulanceId] = useState<string>("");

  // Statistics
  const activeEmergencies = emergencies.filter(
    (e) => e.status === "Pending" || e.status === "Dispatched"
  ).length;
  const criticalCount = emergencies.filter(
    (e) => e.severity === "Critical" && e.status !== "Resolved"
  ).length;
  const availableAmbulances = ambulances.filter(
    (a) => a.status === "Available"
  ).length;
  const waitingAppointments = appointments.filter(
    (a) => a.status === "Waiting" || a.status === "In Consultation"
  ).length;
  const criticalBloodUnits = bloodStocks.filter(
    (b) => b.status === "Critical"
  ).length;
  const totalAvailableBeds = initialFacilities.reduce(
    (acc, f) => acc + f.availableBeds,
    0
  );

  function handleDispatchAmbulance(emergencyId: string) {
    setSelectedEmergencyId(emergencyId);
    const firstAvailable = ambulances.find((a) => a.status === "Available");
    if (firstAvailable) {
      setSelectedAmbulanceId(firstAvailable.id);
    }
    setDispatchModalOpen(true);
  }

  function confirmDispatch() {
    if (!selectedEmergencyId || !selectedAmbulanceId) return;

    setEmergencies((prev) =>
      prev.map((e) =>
        e.id === selectedEmergencyId
          ? {
              ...e,
              status: "Dispatched",
              ambulanceAssignedId: selectedAmbulanceId,
            }
          : e
      )
    );

    setAmbulances((prev) =>
      prev.map((a) =>
        a.id === selectedAmbulanceId
          ? {
              ...a,
              status: "Dispatched",
              etaMinutes: Math.floor(Math.random() * 8) + 4,
              lastUpdated: "Just now",
            }
          : a
      )
    );

    showToast(
      "Ambulance Dispatched",
      `Unit ${selectedAmbulanceId} assigned to incident ${selectedEmergencyId}. GPS telemetry active.`,
      "danger"
    );

    setDispatchModalOpen(false);
    setSelectedEmergencyId(null);
  }

  function handleResolveEmergency(emergencyId: string) {
    setEmergencies((prev) =>
      prev.map((e) =>
        e.id === emergencyId ? { ...e, status: "Resolved" } : e
      )
    );
    showToast(
      "Incident Resolved",
      `Emergency case ${emergencyId} successfully stabilized and handed over to trauma center.`,
      "success"
    );
  }

  function handleUpdateAppointmentStatus(
    id: string,
    status: Appointment["status"]
  ) {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
    showToast(
      "Queue Updated",
      `Consultation status updated to "${status}".`,
      "info"
    );
  }

  function handleAmbulanceStatus(id: string, status: Ambulance["status"]) {
    setAmbulances((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
    showToast(
      "Ambulance Fleet Status",
      `Vehicle ${id} marked as ${status}.`,
      "info"
    );
  }

  function handleUpdateBlood(id: string, delta: number) {
    setBloodStocks((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const nextUnits = Math.max(0, b.unitsAvailable + delta);
          let nextStatus: BloodStock["status"] = "Sufficient";
          if (nextUnits <= b.minThreshold / 2) nextStatus = "Critical";
          else if (nextUnits <= b.minThreshold) nextStatus = "Low";
          return {
            ...b,
            unitsAvailable: nextUnits,
            status: nextStatus,
          };
        }
        return b;
      })
    );
    showToast(
      "Blood Inventory Synchronized",
      `Blood units ${delta > 0 ? "added (+)" : "dispensed (-)"} for cold-storage lot ${id}.`,
      delta > 0 ? "success" : "warning"
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Alert Header if Critical Emergencies exist */}
      {criticalCount > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50/90 p-4 shadow-xs text-rose-900">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-600 text-white font-bold text-lg animate-pulse">
              🚨
            </span>
            <div>
              <h2 className="font-bold text-base text-rose-950">
                CRITICAL TRIAGE ALERT: {criticalCount} Active Life-Threatening Case(s)
              </h2>
              <p className="text-xs text-rose-700">
                Immediate clinical response and ambulance routing required.
              </p>
            </div>
          </div>
          <Link
            href="/emergency"
            className="inline-flex items-center justify-center rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 shadow-sm transition-all"
          >
            Open Dispatch Room →
          </Link>
        </div>
      )}

      {/* Main Title Section */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
            Duty Officer: {user?.name || "Dr. Sandeep Kulkarni"}{" "}
            {user?.department ? `• ${user.department}` : ""}
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Hospital Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time telemetry across emergencies, ambulance fleets, outpatient clinics, and blood inventory.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/emergency">
            <Button variant="danger" size="sm" icon="🚨">
              Emergency Request
            </Button>
          </Link>
          <Link href="/appointments">
            <Button variant="outline" size="sm" icon="📋">
              View Appointments Queue
            </Button>
          </Link>
        </div>
      </div>

      {/* Top 6 KPI Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          title="Active Emergencies"
          value={activeEmergencies}
          icon="🚨"
          subtitle={`${criticalCount} Critical Cases`}
          accentColor="red"
        />
        <StatCard
          title="Ambulances Ready"
          value={availableAmbulances}
          icon="🚑"
          subtitle={`${ambulances.length} Total Vehicles`}
          accentColor="purple"
        />
        <StatCard
          title="Waiting Today"
          value={waitingAppointments}
          icon="⏳"
          subtitle="Outpatient Triage"
          accentColor="amber"
        />
        <StatCard
          title="Registered Patients"
          value={initialPatients.length}
          icon="👥"
          subtitle="Hospital Directory"
          accentColor="blue"
        />
        <StatCard
          title="Critical Blood"
          value={criticalBloodUnits}
          icon="🩸"
          subtitle="Under Safe Reserve"
          accentColor="red"
        />
        <StatCard
          title="Available Beds"
          value={totalAvailableBeds}
          icon="🛏️"
          subtitle="Regional Network"
          accentColor="emerald"
        />
      </div>

      {/* Tactical Dispatch Radar & GPS Telemetry Visualizer */}
      <LiveDispatchRadar />

      {/* PulseAI Clinical Triage Assistant */}
      <AiTriageAssistant />

      {/* Grid: Live Emergency Feed (left) & Today's Appointments (right) */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Live Emergencies Section */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-rose-600 animate-ping" />
                <h3 className="font-extrabold text-slate-900 text-lg">
                  Live Emergency Feed
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Active incoming 108 medical calls and trauma triage
              </p>
            </div>
            <Link
              href="/emergency"
              className="text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              All Emergencies ({emergencies.length}) →
            </Link>
          </div>

          <div className="mt-5 space-y-4">
            {emergencies.slice(0, 3).map((emg) => (
              <EmergencyCard
                key={emg.id}
                emergency={emg}
                onDispatch={handleDispatchAmbulance}
                onResolve={handleResolveEmergency}
              />
            ))}
          </div>
        </div>

        {/* Today's Appointments Section */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">
                Appointments Schedule
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Today&apos;s outpatient queue and consultation status
              </p>
            </div>
            <Link
              href="/appointments"
              className="text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              View Full Schedule →
            </Link>
          </div>

          <div className="mt-5 space-y-4">
            {appointments.slice(0, 3).map((apt) => (
              <AppointmentCard
                key={apt.id}
                appointment={apt}
                onUpdateStatus={handleUpdateAppointmentStatus}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Ambulance Fleet (left) & Blood Reserves (right) */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Ambulance Fleet Tracking */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">
                Ambulance Fleet Status
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                GPS telemetry, driver readiness, and dispatch coordinates
              </p>
            </div>
            <Link
              href="/ambulance"
              className="text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              Manage Fleet →
            </Link>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {ambulances.slice(0, 2).map((amb) => (
              <AmbulanceCard
                key={amb.id}
                ambulance={amb}
                onStatusChange={handleAmbulanceStatus}
              />
            ))}
          </div>
        </div>

        {/* Blood Stock Availability */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">
                Blood Bank Inventory
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Reserve levels across rare and common blood groups
              </p>
            </div>
            <Link
              href="/blood"
              className="text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              Manage Stock →
            </Link>
          </div>

          <div className="mt-5 grid gap-4 grid-cols-2 sm:grid-cols-4">
            {bloodStocks.slice(0, 4).map((stock) => (
              <BloodStockCard
                key={stock.id}
                stock={stock}
                onUpdateUnits={handleUpdateBlood}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Ambulance Dispatch Modal */}
      <Modal
        isOpen={dispatchModalOpen}
        onClose={() => setDispatchModalOpen(false)}
        title="Dispatch Ambulance Unit"
        subtitle={`Assign emergency vehicle to incident ${selectedEmergencyId}`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Select Available Ambulance
            </label>
            <select
              value={selectedAmbulanceId}
              onChange={(e) => setSelectedAmbulanceId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500"
            >
              {ambulances.map((amb) => (
                <option
                  key={amb.id}
                  value={amb.id}
                  disabled={amb.status === "Maintenance"}
                >
                  {amb.id} • {amb.vehicleNumber} ({amb.type}) — {amb.status} (
                  {amb.currentLocation})
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-xl bg-amber-50 p-3.5 text-xs text-amber-800 border border-amber-200">
            ⚡ <strong>Protocol Notice:</strong> Dispatching will transmit GPS
            coordinates to the on-board mobile data terminal and trigger siren
            priority.
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDispatchModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon="🚑"
              onClick={confirmDispatch}
            >
              Confirm Dispatch
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
