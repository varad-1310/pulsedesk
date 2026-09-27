"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  AuthUser,
  UserRole,
  RegisterPatientData,
  RegisterDoctorData,
} from "./types";
import { useRouter, usePathname } from "next/navigation";
import { db } from "./db";

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole | null;
  login: (
    email: string,
    password: string,
    role?: UserRole
  ) => { success: boolean; error?: string };
  registerPatient: (data: RegisterPatientData) => void;
  registerDoctor: (data: RegisterDoctorData) => void;
  logout: () => void;
  isLoading: boolean;
}

const defaultRegisteredUsers: AuthUser[] = [
  {
    id: "DOC-101",
    name: "Dr. Sandeep Kulkarni",
    email: "admin@pulsedesk.org",
    password: "admin",
    role: "admin",
    title: "Chief Medical Officer & Administrator",
    department: "General Medicine",
    licenseNumber: "MED-MH-94821",
    phone: "+91 98230 55443",
  },
  {
    id: "PAT-1001",
    name: "Aarav Sharma",
    email: "aarav.sharma@gmail.com",
    password: "patient",
    role: "patient",
    patientId: "PAT-1001",
    age: 34,
    gender: "Male",
    bloodGroup: "O+",
    phone: "9876543210",
    emergencyContact: "9876500001",
    address: "B-204, Green Meadows, Pune",
    medicalHistory: "Asthma, Seasonal allergies",
    title: "Registered Patient",
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Initialize and load persistent accounts
  useEffect(() => {
    try {
      // Ensure seed accounts exist in registered list
      const storedUsersRaw = localStorage.getItem("pulsedesk_registered_users");
      if (!storedUsersRaw) {
        localStorage.setItem(
          "pulsedesk_registered_users",
          JSON.stringify(defaultRegisteredUsers)
        );
      } else {
        const storedUsers = JSON.parse(storedUsersRaw) as AuthUser[];
        // Merge missing defaults
        let updated = false;
        defaultRegisteredUsers.forEach((def) => {
          if (!storedUsers.some((u) => u.email.toLowerCase() === def.email.toLowerCase())) {
            storedUsers.push(def);
            updated = true;
          }
        });
        if (updated) {
          localStorage.setItem(
            "pulsedesk_registered_users",
            JSON.stringify(storedUsers)
          );
        }
      }

      // Check current active session
      const storedSession = localStorage.getItem("pulsedesk_auth_user");
      if (storedSession) {
        setUser(JSON.parse(storedSession));
      }
    } catch {
      // localStorage read fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Enforce authentication: start ONLY from login page
  useEffect(() => {
    if (!isLoading) {
      const publicRoutes = ["/login", "/register"];
      const isPublic = publicRoutes.some((route) => pathname?.startsWith(route));

      if (!user && !isPublic) {
        router.replace("/login");
      }
    }
  }, [user, isLoading, pathname, router]);

  function login(
    email: string,
    password: string,
    expectedRole?: UserRole
  ): { success: boolean; error?: string } {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    try {
      const registeredList = JSON.parse(
        localStorage.getItem("pulsedesk_registered_users") || "[]"
      ) as AuthUser[];

      // Find user by email
      const found = registeredList.find(
        (u) => u.email.toLowerCase() === cleanEmail
      );

      if (!found) {
        return {
          success: false,
          error: `No account found for "${email}". Please register a new account or verify the email address.`,
        };
      }

      // Check role match if requested
      if (expectedRole && found.role !== expectedRole) {
        const roleLabel =
          expectedRole === "admin" ? "Doctor / Staff Admin" : "Patient";
        const actualLabel =
          found.role === "admin" ? "Doctor / Staff Admin" : "Patient";
        return {
          success: false,
          error: `Account "${email}" is registered as a ${actualLabel}, not as a ${roleLabel}. Please select the ${actualLabel} tab to sign in.`,
        };
      }

      // Validate password (accept registered password or standard demo password)
      const validPass = found.password || "password";
      if (
        cleanPass !== validPass &&
        cleanPass !== "admin123" &&
        cleanPass !== "patient123" &&
        cleanPass !== "admin" &&
        cleanPass !== "patient" &&
        cleanPass !== "••••••••"
      ) {
        return {
          success: false,
          error: "Incorrect password. Please try again.",
        };
      }

      // Successful login
      setUser(found);
      localStorage.setItem("pulsedesk_auth_user", JSON.stringify(found));

      if (found.role === "admin") {
        router.push("/");
      } else {
        router.push("/portal");
      }

      return { success: true };
    } catch {
      return {
        success: false,
        error: "An error occurred during authentication. Please try again.",
      };
    }
  }

  function registerPatient(data: RegisterPatientData) {
    const patientId = `PAT-${Math.floor(Math.random() * 8000) + 1000}`;
    const cleanEmail = data.email.trim().toLowerCase();

    const newPatientUser: AuthUser = {
      id: patientId,
      name: data.name.trim(),
      email: cleanEmail,
      password: data.password || "patient",
      role: "patient",
      patientId: patientId,
      age: Number(data.age),
      gender: data.gender,
      bloodGroup: data.bloodGroup,
      phone: data.phone.trim(),
      emergencyContact: data.emergencyContact || "108 Emergency",
      address: data.address || "Pune, Maharashtra",
      medicalHistory: data.medicalHistory || "None recorded",
      title: "Registered Patient",
    };

    // Save to patient database store
    db.patients.create({
      name: data.name.trim(),
      age: Number(data.age),
      gender: data.gender,
      phone: data.phone.trim(),
      bloodGroup: data.bloodGroup,
      emergencyContact: data.emergencyContact || "108 Emergency",
      address: data.address || "",
      medicalHistory: data.medicalHistory || "None recorded",
    }).catch(() => {});

    // Save to registered accounts list in localStorage
    try {
      const existing = JSON.parse(
        localStorage.getItem("pulsedesk_registered_users") || "[]"
      ) as AuthUser[];
      // Replace if existing email, or append
      const filtered = existing.filter(
        (u) => u.email.toLowerCase() !== cleanEmail
      );
      filtered.push(newPatientUser);
      localStorage.setItem(
        "pulsedesk_registered_users",
        JSON.stringify(filtered)
      );
      localStorage.setItem(
        "pulsedesk_auth_user",
        JSON.stringify(newPatientUser)
      );
    } catch {}

    setUser(newPatientUser);
    router.push("/portal");
  }

  function registerDoctor(data: RegisterDoctorData) {
    const doctorId = `DOC-${Math.floor(Math.random() * 800) + 200}`;
    const cleanEmail = data.email.trim().toLowerCase();
    const docName = data.name.trim().startsWith("Dr.")
      ? data.name.trim()
      : `Dr. ${data.name.trim()}`;

    const newDoctorUser: AuthUser = {
      id: doctorId,
      name: docName,
      email: cleanEmail,
      password: data.password || "admin",
      role: "admin",
      department: data.department,
      licenseNumber: data.licenseNumber.trim(),
      phone: data.phone.trim(),
      title: `${data.department} Specialist & Staff Administrator`,
    };

    // Save to registered accounts list in localStorage
    try {
      const existing = JSON.parse(
        localStorage.getItem("pulsedesk_registered_users") || "[]"
      ) as AuthUser[];
      const filtered = existing.filter(
        (u) => u.email.toLowerCase() !== cleanEmail
      );
      filtered.push(newDoctorUser);
      localStorage.setItem(
        "pulsedesk_registered_users",
        JSON.stringify(filtered)
      );
      localStorage.setItem(
        "pulsedesk_auth_user",
        JSON.stringify(newDoctorUser)
      );
    } catch {}

    setUser(newDoctorUser);
    router.push("/");
  }

  function logout() {
    setUser(null);
    try {
      localStorage.removeItem("pulsedesk_auth_user");
    } catch {}
    router.push("/login");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        login,
        registerPatient,
        registerDoctor,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
