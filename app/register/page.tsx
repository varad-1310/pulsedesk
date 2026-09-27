"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { BloodGroup } from "@/lib/types";

export default function RegisterPage() {
  const { registerPatient, registerDoctor } = useAuth();
  const [role, setRole] = useState<"patient" | "doctor">("patient");

  // Patient Form
  const [patientForm, setPatientForm] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "Male" as "Male" | "Female" | "Other",
    phone: "",
    bloodGroup: "O+" as BloodGroup,
    emergencyContact: "",
    address: "",
    medicalHistory: "",
  });

  // Doctor Form
  const [doctorForm, setDoctorForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    department: "Emergency & Trauma",
    licenseNumber: "",
    hospitalName: "PulseDesk Central Hospital",
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

  const departments = [
    "Emergency & Trauma",
    "General Medicine",
    "Cardiology",
    "General Surgery",
    "Pediatrics",
    "Orthopedics",
    "Neurology",
    "Critical Care (ICU)",
  ];

  function handlePatientSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!patientForm.name || !patientForm.email || !patientForm.phone || !patientForm.age) {
      alert("Please fill in all required fields.");
      return;
    }

    registerPatient({
      name: patientForm.name,
      email: patientForm.email,
      password: patientForm.password,
      age: Number(patientForm.age),
      gender: patientForm.gender,
      phone: patientForm.phone,
      bloodGroup: patientForm.bloodGroup,
      emergencyContact: patientForm.emergencyContact || "108 Emergency",
      address: patientForm.address,
      medicalHistory: patientForm.medicalHistory,
    });
  }

  function handleDoctorSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!doctorForm.name || !doctorForm.email || !doctorForm.licenseNumber || !doctorForm.phone) {
      alert("Please fill in doctor name, email, medical license number, and phone.");
      return;
    }

    registerDoctor({
      name: doctorForm.name,
      email: doctorForm.email,
      password: doctorForm.password,
      phone: doctorForm.phone,
      department: doctorForm.department,
      licenseNumber: doctorForm.licenseNumber,
      hospitalName: doctorForm.hospitalName,
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 flex flex-col justify-center items-center p-4 sm:p-6 py-12">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 text-white font-extrabold shadow-lg shadow-blue-500/30 text-2xl mb-3">
          🩺
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white">
          Pulse<span className="text-blue-400">Desk</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1 font-medium">
          Create your clinical or patient identity
        </p>
      </div>

      {/* Main Registration Card */}
      <div className="w-full max-w-xl rounded-3xl border border-slate-700/80 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-white">
        {/* Role Selector Tabs */}
        <div className="mb-6 grid grid-cols-2 gap-1.5 rounded-2xl bg-slate-800/80 p-1.5 border border-slate-700/50">
          <button
            type="button"
            onClick={() => setRole("patient")}
            className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
              role === "patient"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span>🧑</span>
            <span>Register as Patient / User</span>
          </button>
          <button
            type="button"
            onClick={() => setRole("doctor")}
            className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
              role === "doctor"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span>👨‍⚕️</span>
            <span>Register as Doctor / Staff</span>
          </button>
        </div>

        {/* Dynamic Context Header */}
        <div className="mb-6">
          <h2 className="text-xl font-extrabold text-white">
            {role === "patient"
              ? "New Patient Enrollment"
              : "Doctor & Clinician Credentialing"}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {role === "patient"
              ? "Set up your medical profile, emergency contact, and verified blood type."
              : "Register as an attending physician or hospital administrator."}
          </p>
        </div>

        {role === "patient" ? (
          /* Patient Registration Form */
          <form onSubmit={handlePatientSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Full Legal Name *
              </label>
              <input
                type="text"
                required
                value={patientForm.name}
                onChange={(e) =>
                  setPatientForm({ ...patientForm, name: e.target.value })
                }
                placeholder="e.g. Ramesh Deshmukh"
                className="w-full rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={patientForm.email}
                  onChange={(e) =>
                    setPatientForm({ ...patientForm, email: e.target.value })
                  }
                  placeholder="ramesh@gmail.com"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={patientForm.password}
                  onChange={(e) =>
                    setPatientForm({ ...patientForm, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Age *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="120"
                  value={patientForm.age}
                  onChange={(e) =>
                    setPatientForm({ ...patientForm, age: e.target.value })
                  }
                  placeholder="35"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Gender
                </label>
                <select
                  value={patientForm.gender}
                  onChange={(e) =>
                    setPatientForm({
                      ...patientForm,
                      gender: e.target.value as "Male" | "Female" | "Other",
                    })
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/90 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Blood Group *
                </label>
                <select
                  value={patientForm.bloodGroup}
                  onChange={(e) =>
                    setPatientForm({
                      ...patientForm,
                      bloodGroup: e.target.value as BloodGroup,
                    })
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/90 px-3 py-2.5 text-sm text-rose-400 font-bold outline-none focus:border-blue-500"
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
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Mobile Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={patientForm.phone}
                  onChange={(e) =>
                    setPatientForm({ ...patientForm, phone: e.target.value })
                  }
                  placeholder="9876543210"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Emergency Relative Contact
                </label>
                <input
                  type="tel"
                  value={patientForm.emergencyContact}
                  onChange={(e) =>
                    setPatientForm({
                      ...patientForm,
                      emergencyContact: e.target.value,
                    })
                  }
                  placeholder="Relative/Guardian phone"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Residential Address
              </label>
              <input
                type="text"
                value={patientForm.address}
                onChange={(e) =>
                  setPatientForm({ ...patientForm, address: e.target.value })
                }
                placeholder="Locality, apartment, street address"
                className="w-full rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Known Conditions & Allergies (Optional)
              </label>
              <textarea
                rows={2}
                value={patientForm.medicalHistory}
                onChange={(e) =>
                  setPatientForm({
                    ...patientForm,
                    medicalHistory: e.target.value,
                  })
                }
                placeholder="e.g. Asthma, Penicillin allergy, Hypertension..."
                className="w-full rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:from-blue-500 hover:to-indigo-500 transition-all cursor-pointer"
            >
              Complete Patient Registration & Enter Portal →
            </button>
          </form>
        ) : (
          /* Doctor Registration Form */
          <form onSubmit={handleDoctorSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Doctor Full Name *
              </label>
              <input
                type="text"
                required
                value={doctorForm.name}
                onChange={(e) =>
                  setDoctorForm({ ...doctorForm, name: e.target.value })
                }
                placeholder="e.g. Sandeep Kulkarni"
                className="w-full rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Official Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={doctorForm.email}
                  onChange={(e) =>
                    setDoctorForm({ ...doctorForm, email: e.target.value })
                  }
                  placeholder="doctor@pulsedesk.org"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={doctorForm.password}
                  onChange={(e) =>
                    setDoctorForm({ ...doctorForm, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Medical Registration / License # *
                </label>
                <input
                  type="text"
                  required
                  value={doctorForm.licenseNumber}
                  onChange={(e) =>
                    setDoctorForm({
                      ...doctorForm,
                      licenseNumber: e.target.value,
                    })
                  }
                  placeholder="MCI-MH-49201"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Emergency Contact / Mobile *
                </label>
                <input
                  type="tel"
                  required
                  value={doctorForm.phone}
                  onChange={(e) =>
                    setDoctorForm({ ...doctorForm, phone: e.target.value })
                  }
                  placeholder="+91 98220 00000"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Department / Specialty *
                </label>
                <select
                  value={doctorForm.department}
                  onChange={(e) =>
                    setDoctorForm({ ...doctorForm, department: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/90 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500 font-medium"
                >
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Hospital / Base Station
                </label>
                <input
                  type="text"
                  value={doctorForm.hospitalName}
                  onChange={(e) =>
                    setDoctorForm({
                      ...doctorForm,
                      hospitalName: e.target.value,
                    })
                  }
                  placeholder="PulseDesk Central Hospital"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/25 hover:from-purple-500 hover:to-indigo-500 transition-all cursor-pointer"
            >
              Verify Credentials & Access Command Center →
            </button>
          </form>
        )}

        {/* Footer navigation */}
        <div className="mt-6 pt-5 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            Already registered?{" "}
            <Link
              href="/login"
              className="font-bold text-blue-400 hover:text-blue-300 underline ml-1"
            >
              Sign In to Your Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
