"use client";

import React, { useState } from "react";
import StatCard from "@/components/StatCard";
import EmergencyCard from "@/components/EmergencyCard";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import { initialEmergencies, initialAmbulances } from "@/lib/data";
import {
  EmergencyRequest,
  EmergencySeverity,
  EmergencyStatus,
} from "@/lib/types";
import { useToast } from "@/components/ToastProvider";

export default function EmergencyPage() {
  const { showToast } = useToast();
  const [emergencies, setEmergencies] =
    useState<EmergencyRequest[]>(initialEmergencies);
  const [ambulances, setAmbulances] = useState(initialAmbulances);
  const [showModal, setShowModal] = useState(false);
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(
    null
  );
  const [selectedAmbulanceId, setSelectedAmbulanceId] = useState<string>("");
  const [severityFilter, setSeverityFilter] = useState<string>("All");

  const [form, setForm] = useState({
    patientName: "",
    contact: "",
    emergencyType: "",
    severity: "Critical" as EmergencySeverity,
    location: "",
    notes: "",
  });

  const filteredEmergencies = emergencies.filter((emg) => {
    if (severityFilter === "All") return true;
    return emg.severity === severityFilter;
  });

  function handleDispatch(id: string) {
    setSelectedIncidentId(id);
    const available = ambulances.find((a) => a.status === "Available");
    if (available) {
      setSelectedAmbulanceId(available.id);
    }
    setDispatchModalOpen(true);
  }

  function confirmDispatch() {
    if (!selectedIncidentId || !selectedAmbulanceId) return;

    setEmergencies((prev) =>
      prev.map((e) =>
        e.id === selectedIncidentId
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
              etaMinutes: Math.floor(Math.random() * 6) + 3,
            }
          : a
      )
    );

    showToast(
      "Ambulance Dispatched",
      `Unit ${selectedAmbulanceId} dispatched to incident ${selectedIncidentId}. Siren Priority Active.`,
      "danger"
    );

    setDispatchModalOpen(false);
    setSelectedIncidentId(null);
  }

  function handleResolve(id: string) {
    setEmergencies((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: "Resolved" } : e))
    );
    showToast(
      "Incident Resolved",
      `Emergency #${id} successfully marked as resolved.`,
      "success"
    );
  }

  function createIncident(e: React.FormEvent) {
    e.preventDefault();

    if (!form.patientName || !form.contact || !form.emergencyType || !form.location) {
      showToast(
        "Missing Fields",
        "Please fill in caller name, phone, emergency condition, and location.",
        "warning"
      );
      return;
    }

    const newIncident: EmergencyRequest = {
      id: `EMG-${900 + emergencies.length + 1}`,
      patientName: form.patientName,
      contact: form.contact,
      emergencyType: form.emergencyType,
      severity: form.severity,
      location: form.location,
      status: "Pending",
      notes: form.notes,
      requestedAt: new Date().toISOString(),
    };

    setEmergencies([newIncident, ...emergencies]);
    setShowModal(false);
    showToast(
      "Emergency Broadcasted",
      `New incident #${newIncident.id} (${newIncident.severity}) logged. Trauma bay alerted.`,
      "danger"
    );
    setForm({
      patientName: "",
      contact: "",
      emergencyType: "",
      severity: "Critical",
      location: "",
      notes: "",
    });
  }

  const criticalCount = emergencies.filter(
    (e) => e.severity === "Critical" && e.status !== "Resolved"
  ).length;
  const pendingCount = emergencies.filter((e) => e.status === "Pending").length;
  const dispatchedCount = emergencies.filter(
    (e) => e.status === "Dispatched"
  ).length;
  const resolvedCount = emergencies.filter(
    (e) => e.status === "Resolved"
  ).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full bg-rose-600 animate-ping" />
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Emergency Command & Triage Room
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            24/7 active incident dispatch, life-support telemetry, and hospital trauma coordination.
          </p>
        </div>

        <Button
          variant="danger"
          icon="🚨"
          onClick={() => setShowModal(true)}
        >
          New Emergency Incident
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Critical Incidents"
          value={criticalCount}
          icon="🚨"
          subtitle="Red Code Priority"
          accentColor="red"
        />
        <StatCard
          title="Awaiting Dispatch"
          value={pendingCount}
          icon="⏱️"
          subtitle="Immediate Action Needed"
          accentColor="amber"
        />
        <StatCard
          title="Ambulances En Route"
          value={dispatchedCount}
          icon="🚑"
          subtitle="Active Response Units"
          accentColor="purple"
        />
        <StatCard
          title="Resolved Today"
          value={resolvedCount}
          icon="✓"
          subtitle="Admitted or Stabilized"
          accentColor="emerald"
        />
      </div>

      {/* Severity Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {["All", "Critical", "Severe", "Moderate"].map((sev) => (
          <button
            key={sev}
            onClick={() => setSeverityFilter(sev)}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              severityFilter === sev
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {sev} Incidents
          </button>
        ))}
      </div>

      {/* Emergency Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredEmergencies.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-200 p-12 text-center text-slate-400">
            No incidents found in this category.
          </div>
        ) : (
          filteredEmergencies.map((emg) => (
            <EmergencyCard
              key={emg.id}
              emergency={emg}
              onDispatch={handleDispatch}
              onResolve={handleResolve}
            />
          ))
        )}
      </div>

      {/* New Emergency Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Log Emergency Incident (108 Dispatch)"
        subtitle="Immediately enters the high-priority medical triage feed"
      >
        <form onSubmit={createIncident} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Caller / Patient Name *
            </label>
            <input
              type="text"
              required
              value={form.patientName}
              onChange={(e) =>
                setForm({ ...form, patientName: e.target.value })
              }
              placeholder="Full name or 'Bystander/Unidentified'"
              className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Caller Contact Number *
              </label>
              <input
                type="tel"
                required
                value={form.contact}
                onChange={(e) =>
                  setForm({ ...form, contact: e.target.value })
                }
                placeholder="10-digit mobile"
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Triage Severity Level
              </label>
              <select
                value={form.severity}
                onChange={(e) =>
                  setForm({
                    ...form,
                    severity: e.target.value as EmergencySeverity,
                  })
                }
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500 font-bold text-rose-600"
              >
                <option value="Critical">🔴 Critical (Immediate Life Threat)</option>
                <option value="Severe">🟠 Severe (Major Trauma / Illness)</option>
                <option value="Moderate">🟡 Moderate (Stable but Urgent)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Chief Medical Complaint / Emergency Type *
            </label>
            <input
              type="text"
              required
              value={form.emergencyType}
              onChange={(e) =>
                setForm({ ...form, emergencyType: e.target.value })
              }
              placeholder="e.g. Cardiac arrest, road traffic accident, stroke"
              className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Incident Location / Landmark *
            </label>
            <input
              type="text"
              required
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Address, road intersection, building name"
              className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              On-scene Observations / Hazards
            </label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Consciousness level, visible hemorrhaging, number of casualties..."
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
            <Button type="submit" variant="danger" size="sm">
              Trigger Emergency Dispatch
            </Button>
          </div>
        </form>
      </Modal>

      {/* Dispatch Modal */}
      <Modal
        isOpen={dispatchModalOpen}
        onClose={() => setDispatchModalOpen(false)}
        title="Deploy Ambulance Unit"
        subtitle={`Incident Ref: ${selectedIncidentId}`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Select Available Unit
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

          <div className="rounded-xl bg-rose-50 p-3.5 text-xs text-rose-800 border border-rose-200">
            🚨 <strong>Emergency Audio Transmission:</strong> Driver phone will
            receive immediate automated phone dispatch audio and GPS navigation
            waypoint.
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
              Dispatch Unit Now
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
