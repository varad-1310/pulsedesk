"use client";

import React, { useState } from "react";
import StatCard from "@/components/StatCard";
import AmbulanceCard from "@/components/AmbulanceCard";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import { initialAmbulances } from "@/lib/data";
import { Ambulance, AmbulanceStatus, AmbulanceType } from "@/lib/types";
import { useToast } from "@/components/ToastProvider";

export default function AmbulancePage() {
  const { showToast } = useToast();
  const [ambulances, setAmbulances] =
    useState<Ambulance[]>(initialAmbulances);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    vehicleNumber: "",
    type: "Advanced Life Support (ALS)" as AmbulanceType,
    driverName: "",
    driverPhone: "",
    currentLocation: "PulseDesk Station Alpha",
    baseHospital: "PulseDesk Central Hospital",
  });

  const ambulanceTypes: AmbulanceType[] = [
    "Advanced Life Support (ALS)",
    "Basic Life Support (BLS)",
    "Patient Transport",
  ];

  const filteredAmbulances = ambulances.filter((amb) => {
    const matchesSearch =
      amb.vehicleNumber.toLowerCase().includes(search.toLowerCase()) ||
      amb.driverName.toLowerCase().includes(search.toLowerCase()) ||
      amb.currentLocation.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || amb.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  function handleStatusChange(id: string, status: AmbulanceStatus) {
    setAmbulances((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status,
              etaMinutes: status === "Available" ? undefined : a.etaMinutes || 8,
              lastUpdated: "Just now",
            }
          : a
      )
    );
    showToast(
      "Vehicle Status Updated",
      `Ambulance ${id} status set to "${status}". GPS stream synced.`,
      status === "Maintenance" ? "warning" : "info"
    );
  }

  function addAmbulance(e: React.FormEvent) {
    e.preventDefault();

    if (!form.vehicleNumber || !form.driverName || !form.driverPhone) {
      showToast(
        "Missing Data",
        "Please enter vehicle plate number, driver name, and phone.",
        "warning"
      );
      return;
    }

    const newAmb: Ambulance = {
      id: `AMB-0${ambulances.length + 1}`,
      vehicleNumber: form.vehicleNumber.toUpperCase(),
      type: form.type,
      driverName: form.driverName,
      driverPhone: form.driverPhone,
      status: "Available",
      currentLocation: form.currentLocation,
      baseHospital: form.baseHospital,
      fuelLevel: 100,
      lastUpdated: "Just registered",
    };

    setAmbulances([...ambulances, newAmb]);
    setShowModal(false);
    showToast(
      "Ambulance Enrolled",
      `Vehicle ${newAmb.vehicleNumber} (${newAmb.type}) registered into dispatch fleet.`,
      "success"
    );
    setForm({
      vehicleNumber: "",
      type: "Advanced Life Support (ALS)",
      driverName: "",
      driverPhone: "",
      currentLocation: "PulseDesk Station Alpha",
      baseHospital: "PulseDesk Central Hospital",
    });
  }

  const availableCount = ambulances.filter((a) => a.status === "Available").length;
  const dispatchedCount = ambulances.filter((a) => a.status === "Dispatched").length;
  const onRouteCount = ambulances.filter((a) => a.status === "On Route").length;
  const maintenanceCount = ambulances.filter((a) => a.status === "Maintenance").length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🚑</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Ambulance Fleet Management
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time fleet readiness, GPS staging locations, and emergency dispatch tracking.
          </p>
        </div>

        <Button
          variant="primary"
          icon="+"
          onClick={() => setShowModal(true)}
        >
          Add Fleet Vehicle
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Ready For Dispatch"
          value={availableCount}
          icon="🟢"
          subtitle={`${Math.round((availableCount / ambulances.length) * 100)}% Fleet Capacity`}
          accentColor="emerald"
        />
        <StatCard
          title="Dispatched"
          value={dispatchedCount}
          icon="🚨"
          subtitle="En Route to Incident"
          accentColor="red"
        />
        <StatCard
          title="Patient Onboard"
          value={onRouteCount}
          icon="🏥"
          subtitle="In Transit to Hospital"
          accentColor="purple"
        />
        <StatCard
          title="In Maintenance"
          value={maintenanceCount}
          icon="🔧"
          subtitle="Service Depot"
          accentColor="amber"
        />
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs sm:flex-row sm:items-center justify-between">
        <div className="relative flex-1">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Search vehicle plate, driver, or location..."
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
            <option value="All">All Fleet ({ambulances.length})</option>
            <option value="Available">Available Only</option>
            <option value="Dispatched">Dispatched</option>
            <option value="On Route">On Route</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Fleet Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAmbulances.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-200 p-12 text-center text-slate-400">
            No ambulance units match the current filter.
          </div>
        ) : (
          filteredAmbulances.map((ambulance) => (
            <AmbulanceCard
              key={ambulance.id}
              ambulance={ambulance}
              onStatusChange={handleStatusChange}
            />
          ))
        )}
      </div>

      {/* New Vehicle Registration Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Register New Ambulance Unit"
        subtitle="Add a vehicle to the regional dispatch network"
      >
        <form onSubmit={addAmbulance} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Vehicle Plate Number *
            </label>
            <input
              type="text"
              required
              value={form.vehicleNumber}
              onChange={(e) =>
                setForm({ ...form, vehicleNumber: e.target.value })
              }
              placeholder="e.g. MH-12-AB-1234"
              className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Vehicle Specification & Equipment
            </label>
            <select
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value as AmbulanceType })
              }
              className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
            >
              {ambulanceTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Driver / Paramedic Name *
              </label>
              <input
                type="text"
                required
                value={form.driverName}
                onChange={(e) =>
                  setForm({ ...form, driverName: e.target.value })
                }
                placeholder="Driver full name"
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Emergency Radio / Phone *
              </label>
              <input
                type="tel"
                required
                value={form.driverPhone}
                onChange={(e) =>
                  setForm({ ...form, driverPhone: e.target.value })
                }
                placeholder="+91 90000 00000"
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Current Staging Location
            </label>
            <input
              type="text"
              value={form.currentLocation}
              onChange={(e) =>
                setForm({ ...form, currentLocation: e.target.value })
              }
              placeholder="Base station or road junction"
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
              Register Vehicle
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
