"use client";

import React, { useState } from "react";
import StatCard from "@/components/StatCard";
import BloodStockCard from "@/components/BloodStockCard";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import { initialBloodStock } from "@/lib/data";
import { BloodStock, BloodGroup } from "@/lib/types";
import { useToast } from "@/components/ToastProvider";
import BloodCompatibilityMatrix from "@/components/BloodCompatibilityMatrix";

export default function BloodBankPage() {
  const { showToast } = useToast();
  const [bloodStocks, setBloodStocks] =
    useState<BloodStock[]>(initialBloodStock);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const [donationForm, setDonationForm] = useState({
    donorName: "",
    bloodGroup: "O+" as BloodGroup,
    units: 1,
    hospitalName: "PulseDesk Regional Blood Bank",
  });

  const [requestForm, setRequestForm] = useState({
    patientName: "",
    bloodGroup: "O-" as BloodGroup,
    units: 1,
    urgency: "Immediate Trauma",
  });

  const bloodGroups: BloodGroup[] = [
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-",
  ];

  function handleUpdateUnits(id: string, delta: number) {
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
  }

  function handleRecordDonation(e: React.FormEvent) {
    e.preventDefault();

    setBloodStocks((prev) =>
      prev.map((b) => {
        if (b.bloodGroup === donationForm.bloodGroup) {
          const nextUnits = b.unitsAvailable + Number(donationForm.units);
          let nextStatus: BloodStock["status"] = "Sufficient";
          if (nextUnits <= b.minThreshold / 2) nextStatus = "Critical";
          else if (nextUnits <= b.minThreshold) nextStatus = "Low";
          return {
            ...b,
            unitsAvailable: nextUnits,
            status: nextStatus,
            lastDonationDate: new Date().toISOString().split("T")[0],
          };
        }
        return b;
      })
    );

    setShowDonationModal(false);
    showToast(
      "Donation Logged",
      `Credited ${donationForm.units} unit(s) of ${donationForm.bloodGroup} from donor ${donationForm.donorName}. Cold storage updated.`,
      "success"
    );
  }

  function handleRecordRequest(e: React.FormEvent) {
    e.preventDefault();

    const targetStock = bloodStocks.find(
      (b) => b.bloodGroup === requestForm.bloodGroup
    );
    if (!targetStock || targetStock.unitsAvailable < Number(requestForm.units)) {
      showToast(
        "Insufficient Stock",
        `Only ${targetStock?.unitsAvailable || 0} unit(s) of ${requestForm.bloodGroup} available. Emergency reserve triggered.`,
        "danger"
      );
      return;
    }

    setBloodStocks((prev) =>
      prev.map((b) => {
        if (b.bloodGroup === requestForm.bloodGroup) {
          const nextUnits = Math.max(
            0,
            b.unitsAvailable - Number(requestForm.units)
          );
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

    setShowRequestModal(false);
    showToast(
      "Blood Units Dispensed",
      `Transfusion release: ${requestForm.units} unit(s) of ${requestForm.bloodGroup} authorized for ${requestForm.patientName}.`,
      "warning"
    );
  }

  const totalUnits = bloodStocks.reduce((acc, b) => acc + b.unitsAvailable, 0);
  const criticalGroups = bloodStocks.filter((b) => b.status === "Critical");
  const lowGroups = bloodStocks.filter((b) => b.status === "Low");

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🩸</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Blood Bank & Component Inventory
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time supply tracking across all ABO and Rh blood groups with shortage alerts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            icon="📋"
            onClick={() => setShowRequestModal(true)}
          >
            Dispense Units
          </Button>
          <Button
            variant="primary"
            icon="+"
            onClick={() => setShowDonationModal(true)}
          >
            Record Donation
          </Button>
        </div>
      </div>

      {/* Critical Shortage Warning Banner */}
      {criticalGroups.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50/90 p-4 text-rose-900 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-600 text-white font-bold text-lg animate-pulse">
              ⚠️
            </span>
            <div>
              <h2 className="font-bold text-sm text-rose-950">
                CRITICAL INVENTORY ALERT:{" "}
                {criticalGroups.map((g) => g.bloodGroup).join(", ")} Reserve Below
                Minimum Safe Level
              </h2>
              <p className="text-xs text-rose-700">
                Urgent blood donor mobilization and inter-hospital exchange required.
              </p>
            </div>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowDonationModal(true)}
          >
            Log Emergency Blood Inflow
          </Button>
        </div>
      )}

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Blood Units"
          value={totalUnits}
          icon="🩸"
          subtitle="Regional Central Vault"
          accentColor="blue"
        />
        <StatCard
          title="Critical Groups"
          value={criticalGroups.length}
          icon="⚠️"
          subtitle="Immediate Deficit"
          accentColor="red"
        />
        <StatCard
          title="Low Reserve Groups"
          value={lowGroups.length}
          icon="📉"
          subtitle="Approaching Threshold"
          accentColor="amber"
        />
        <StatCard
          title="Sufficient Groups"
          value={bloodStocks.length - criticalGroups.length - lowGroups.length}
          icon="🟢"
          subtitle="Stable Supply"
          accentColor="emerald"
        />
      </div>

      {/* Interactive Blood Compatibility Matrix */}
      <BloodCompatibilityMatrix stocks={bloodStocks} />

      {/* Blood Cards Grid (8 ABO groups) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {bloodStocks.map((stock) => (
          <BloodStockCard
            key={stock.id}
            stock={stock}
            onUpdateUnits={handleUpdateUnits}
          />
        ))}
      </div>

      {/* Record Donation Modal */}
      <Modal
        isOpen={showDonationModal}
        onClose={() => setShowDonationModal(false)}
        title="Record Voluntary Blood Donation"
        subtitle="Credits blood bags into cold storage inventory"
      >
        <form onSubmit={handleRecordDonation} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Donor Name *
            </label>
            <input
              type="text"
              required
              value={donationForm.donorName}
              onChange={(e) =>
                setDonationForm({ ...donationForm, donorName: e.target.value })
              }
              placeholder="e.g. Anand Deshpande"
              className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Blood Group *
              </label>
              <select
                value={donationForm.bloodGroup}
                onChange={(e) =>
                  setDonationForm({
                    ...donationForm,
                    bloodGroup: e.target.value as BloodGroup,
                  })
                }
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500 font-bold"
              >
                {bloodGroups.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Units Donated (450ml / unit)
              </label>
              <input
                type="number"
                min="1"
                max="5"
                required
                value={donationForm.units}
                onChange={(e) =>
                  setDonationForm({
                    ...donationForm,
                    units: Number(e.target.value),
                  })
                }
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Receiving Center / Blood Bank
            </label>
            <input
              type="text"
              value={donationForm.hospitalName}
              onChange={(e) =>
                setDonationForm({
                  ...donationForm,
                  hospitalName: e.target.value,
                })
              }
              className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowDonationModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Confirm & Credit Inventory
            </Button>
          </div>
        </form>
      </Modal>

      {/* Dispense Modal */}
      <Modal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        title="Dispense Blood to Ward / Surgery"
        subtitle="Deducts units for immediate cross-match or transfusion"
      >
        <form onSubmit={handleRecordRequest} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Recipient Patient Name *
            </label>
            <input
              type="text"
              required
              value={requestForm.patientName}
              onChange={(e) =>
                setRequestForm({
                  ...requestForm,
                  patientName: e.target.value,
                })
              }
              placeholder="e.g. Gopal Krishna (Trauma Bay)"
              className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Blood Group Needed *
              </label>
              <select
                value={requestForm.bloodGroup}
                onChange={(e) =>
                  setRequestForm({
                    ...requestForm,
                    bloodGroup: e.target.value as BloodGroup,
                  })
                }
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500 font-bold"
              >
                {bloodGroups.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Units Required
              </label>
              <input
                type="number"
                min="1"
                max="10"
                required
                value={requestForm.units}
                onChange={(e) =>
                  setRequestForm({
                    ...requestForm,
                    units: Number(e.target.value),
                  })
                }
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowRequestModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="danger" size="sm">
              Authorize Dispensation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
