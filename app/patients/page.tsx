"use client";

import React, { useState } from "react";
import StatCard from "@/components/StatCard";
import PatientCard from "@/components/PatientCard";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import { initialPatients } from "@/lib/data";
import { Patient, BloodGroup } from "@/lib/types";

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [search, setSearch] = useState("");
  const [bloodFilter, setBloodFilter] = useState<string>("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "Male" as Patient["gender"],
    phone: "",
    bloodGroup: "O+" as BloodGroup,
    emergencyContact: "",
    address: "",
    medicalHistory: "",
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

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(search.toLowerCase()) ||
      patient.phone.includes(search) ||
      patient.id.toLowerCase().includes(search.toLowerCase());

    const matchesBlood =
      bloodFilter === "All" || patient.bloodGroup === bloodFilter;

    return matchesSearch && matchesBlood;
  });

  function addPatient(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name || !form.age || !form.phone) {
      alert("Please fill in Name, Age, and Phone.");
      return;
    }

    const newPatient: Patient = {
      id: `PAT-${1000 + patients.length + 1}`,
      name: form.name,
      age: Number(form.age),
      gender: form.gender,
      phone: form.phone,
      bloodGroup: form.bloodGroup,
      emergencyContact: form.emergencyContact || "Not provided",
      address: form.address || "",
      medicalHistory: form.medicalHistory || "None recorded",
      createdAt: new Date().toISOString(),
    };

    setPatients([newPatient, ...patients]);
    setShowModal(false);
    setForm({
      name: "",
      age: "",
      gender: "Male",
      phone: "",
      bloodGroup: "O+",
      emergencyContact: "",
      address: "",
      medicalHistory: "",
    });
  }

  const maleCount = patients.filter((p) => p.gender === "Male").length;
  const femaleCount = patients.filter((p) => p.gender === "Female").length;
  const rareBloodCount = patients.filter((p) =>
    p.bloodGroup.includes("-")
  ).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">👥</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Patients Directory
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Registered patient records, medical background, and emergency contacts.
          </p>
        </div>

        <Button
          variant="primary"
          icon="+"
          onClick={() => setShowModal(true)}
        >
          Register New Patient
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Registered"
          value={patients.length}
          icon="👥"
          accentColor="blue"
        />
        <StatCard
          title="Male Patients"
          value={maleCount}
          icon="👨"
          accentColor="purple"
        />
        <StatCard
          title="Female Patients"
          value={femaleCount}
          icon="👩"
          accentColor="emerald"
        />
        <StatCard
          title="Rh-Negative (Rare)"
          value={rareBloodCount}
          icon="🩸"
          subtitle="Special Blood Triage"
          accentColor="red"
        />
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs sm:flex-row sm:items-center justify-between">
        <div className="relative flex-1">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Search patient by name, ID (e.g. PAT-1001), or phone..."
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Blood Group:</span>
          <select
            value={bloodFilter}
            onChange={(e) => setBloodFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500"
          >
            <option value="All">All Blood Types</option>
            {bloodGroups.map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Patient Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPatients.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-200 p-12 text-center text-slate-400">
            No patient records match the query.
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <PatientCard
              key={patient.id}
              patient={patient}
              onSelect={(p) => setSelectedPatient(p)}
            />
          ))
        )}
      </div>

      {/* Patient Profile View Modal */}
      <Modal
        isOpen={!!selectedPatient}
        onClose={() => setSelectedPatient(null)}
        title={selectedPatient?.name || "Patient Profile"}
        subtitle={`Registration ID: ${selectedPatient?.id}`}
      >
        {selectedPatient && (
          <div className="space-y-4 text-sm text-slate-700">
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <span className="text-xs text-slate-400 block">Age & Gender</span>
                <span className="font-semibold text-slate-900">
                  {selectedPatient.age} years old • {selectedPatient.gender}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Blood Group</span>
                <span className="font-extrabold text-rose-600">
                  {selectedPatient.bloodGroup}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Primary Contact</span>
                <span className="font-semibold text-slate-900">
                  📞 {selectedPatient.phone}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Emergency Contact</span>
                <span className="font-semibold text-rose-700">
                  🚨 {selectedPatient.emergencyContact}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Residential Address
              </span>
              <p className="bg-white p-3 rounded-xl border border-slate-200 text-xs">
                {selectedPatient.address || "No address on file."}
              </p>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Clinical History & Known Conditions
              </span>
              <p className="bg-amber-50/50 p-3 rounded-xl border border-amber-200 text-xs text-amber-950">
                {selectedPatient.medicalHistory || "None reported."}
              </p>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedPatient(null)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Registration Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Register New Patient"
        subtitle="Create an electronic health identity"
      >
        <form onSubmit={addPatient} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Full Legal Name *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Ramesh Patel"
              className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Age *
              </label>
              <input
                type="number"
                required
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                placeholder="Age"
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Gender
              </label>
              <select
                value={form.gender}
                onChange={(e) =>
                  setForm({
                    ...form,
                    gender: e.target.value as Patient["gender"],
                  })
                }
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Blood Group
              </label>
              <select
                value={form.bloodGroup}
                onChange={(e) =>
                  setForm({
                    ...form,
                    bloodGroup: e.target.value as BloodGroup,
                  })
                }
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
              >
                {bloodGroups.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>
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
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="10-digit mobile"
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Emergency Contact Number
              </label>
              <input
                type="tel"
                value={form.emergencyContact}
                onChange={(e) =>
                  setForm({ ...form, emergencyContact: e.target.value })
                }
                placeholder="Relative or guardian phone"
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Residential Address
            </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="City, locality, street"
              className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Medical History / Chronic Conditions
            </label>
            <textarea
              rows={2}
              value={form.medicalHistory}
              onChange={(e) =>
                setForm({ ...form, medicalHistory: e.target.value })
              }
              placeholder="e.g. Hypertension, penicillin allergy, prior surgeries..."
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
              Save Patient Record
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}