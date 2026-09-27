export type Patient = {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone: string;
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  emergencyContact: string;
  address?: string;
  medicalHistory?: string;
  createdAt: string;
};

export type AppointmentStatus =
  | "Scheduled"
  | "Waiting"
  | "In Consultation"
  | "Completed"
  | "Cancelled";

export type AppointmentPriority = "Normal" | "Urgent" | "Follow-up";

export type Appointment = {
  id: string;
  patientId?: string;
  patientName: string;
  phone: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  purpose: string;
  status: AppointmentStatus;
  priority: AppointmentPriority;
  notes?: string;
  createdAt: string;
};

export type AmbulanceStatus =
  | "Available"
  | "Dispatched"
  | "On Route"
  | "Maintenance";

export type AmbulanceType =
  | "Advanced Life Support (ALS)"
  | "Basic Life Support (BLS)"
  | "Patient Transport";

export type Ambulance = {
  id: string;
  vehicleNumber: string;
  type: AmbulanceType;
  driverName: string;
  driverPhone: string;
  status: AmbulanceStatus;
  currentLocation: string;
  baseHospital: string;
  fuelLevel: number; // percentage
  etaMinutes?: number;
  lastUpdated: string;
};

export type EmergencySeverity = "Critical" | "Severe" | "Moderate";

export type EmergencyStatus =
  | "Pending"
  | "Dispatched"
  | "Arrived"
  | "Resolved";

export type EmergencyRequest = {
  id: string;
  patientName: string;
  contact: string;
  emergencyType: string;
  severity: EmergencySeverity;
  location: string;
  ambulanceAssignedId?: string;
  status: EmergencyStatus;
  requestedAt: string;
  notes?: string;
};

export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

export type BloodStockStatus = "Sufficient" | "Low" | "Critical";

export type BloodStock = {
  id: string;
  bloodGroup: BloodGroup;
  unitsAvailable: number;
  status: BloodStockStatus;
  hospitalName: string;
  lastDonationDate: string;
  minThreshold: number;
};

export type FacilityType =
  | "Hospital"
  | "Clinic"
  | "ICU Center"
  | "Diagnostic Lab"
  | "Blood Bank";

export type Facility = {
  id: string;
  name: string;
  type: FacilityType;
  totalBeds: number;
  availableBeds: number;
  icuBeds: number;
  availableIcu: number;
  address: string;
  phone: string;
  emergencyServices: boolean;
  rating: number;
  operatingHours: string;
};

export type DashboardStats = {
  activeEmergencies: number;
  todayAppointments: number;
  totalPatients: number;
  availableAmbulances: number;
  criticalBloodUnits: number;
  availableBeds: number;
};

export type UserRole = "admin" | "patient";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  phone?: string;
  patientId?: string;
  age?: number;
  gender?: "Male" | "Female" | "Other";
  bloodGroup?: BloodGroup;
  emergencyContact?: string;
  address?: string;
  medicalHistory?: string;
  department?: string;
  licenseNumber?: string;
  avatar?: string;
  title?: string;
};

export type RegisterPatientData = {
  name: string;
  email: string;
  password?: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone: string;
  bloodGroup: BloodGroup;
  emergencyContact: string;
  address?: string;
  medicalHistory?: string;
};

export type RegisterDoctorData = {
  name: string;
  email: string;
  password?: string;
  phone: string;
  department: string;
  licenseNumber: string;
  hospitalName?: string;
};

