import {
  initialPatients,
  initialAppointments,
  initialAmbulances,
  initialEmergencies,
  initialBloodStock,
  initialFacilities,
} from "./data";
import {
  Patient,
  Appointment,
  Ambulance,
  EmergencyRequest,
  BloodStock,
  Facility,
} from "./types";

// In-memory data store for server runtime and fallback when Prisma is not configured
declare global {
  // eslint-disable-next-line no-var
  var __pulseDeskStore: {
    patients: Patient[];
    appointments: Appointment[];
    ambulances: Ambulance[];
    emergencies: EmergencyRequest[];
    bloodStocks: BloodStock[];
    facilities: Facility[];
  } | undefined;
}

if (!global.__pulseDeskStore) {
  global.__pulseDeskStore = {
    patients: [...initialPatients],
    appointments: [...initialAppointments],
    ambulances: [...initialAmbulances],
    emergencies: [...initialEmergencies],
    bloodStocks: [...initialBloodStock],
    facilities: [...initialFacilities],
  };
}

export const db = {
  patients: {
    findMany: async () => global.__pulseDeskStore!.patients,
    create: async (data: Omit<Patient, "id" | "createdAt">) => {
      const newPatient: Patient = {
        ...data,
        id: `PAT-${1000 + global.__pulseDeskStore!.patients.length + 1}`,
        createdAt: new Date().toISOString(),
      };
      global.__pulseDeskStore!.patients.unshift(newPatient);
      return newPatient;
    },
    findById: async (id: string) =>
      global.__pulseDeskStore!.patients.find((p) => p.id === id),
  },

  appointments: {
    findMany: async () => global.__pulseDeskStore!.appointments,
    create: async (data: Omit<Appointment, "id" | "createdAt">) => {
      const newAppointment: Appointment = {
        ...data,
        id: `APT-${2000 + global.__pulseDeskStore!.appointments.length + 1}`,
        createdAt: new Date().toISOString(),
      };
      global.__pulseDeskStore!.appointments.unshift(newAppointment);
      return newAppointment;
    },
    updateStatus: async (id: string, status: Appointment["status"]) => {
      const apt = global.__pulseDeskStore!.appointments.find((a) => a.id === id);
      if (apt) {
        apt.status = status;
      }
      return apt;
    },
  },

  ambulances: {
    findMany: async () => global.__pulseDeskStore!.ambulances,
    updateStatus: async (
      id: string,
      status: Ambulance["status"],
      etaMinutes?: number
    ) => {
      const amb = global.__pulseDeskStore!.ambulances.find((a) => a.id === id);
      if (amb) {
        amb.status = status;
        if (etaMinutes !== undefined) amb.etaMinutes = etaMinutes;
        amb.lastUpdated = "Just now";
      }
      return amb;
    },
  },

  emergencies: {
    findMany: async () => global.__pulseDeskStore!.emergencies,
    create: async (data: Omit<EmergencyRequest, "id" | "requestedAt">) => {
      const newEmergency: EmergencyRequest = {
        ...data,
        id: `EMG-${900 + global.__pulseDeskStore!.emergencies.length + 1}`,
        requestedAt: new Date().toISOString(),
      };
      global.__pulseDeskStore!.emergencies.unshift(newEmergency);
      return newEmergency;
    },
    updateStatus: async (
      id: string,
      status: EmergencyRequest["status"],
      ambulanceAssignedId?: string
    ) => {
      const emg = global.__pulseDeskStore!.emergencies.find((e) => e.id === id);
      if (emg) {
        emg.status = status;
        if (ambulanceAssignedId) emg.ambulanceAssignedId = ambulanceAssignedId;
      }
      return emg;
    },
  },

  bloodStocks: {
    findMany: async () => global.__pulseDeskStore!.bloodStocks,
    updateUnits: async (id: string, deltaUnits: number) => {
      const stock = global.__pulseDeskStore!.bloodStocks.find((b) => b.id === id);
      if (stock) {
        stock.unitsAvailable = Math.max(0, stock.unitsAvailable + deltaUnits);
        if (stock.unitsAvailable <= stock.minThreshold / 2) {
          stock.status = "Critical";
        } else if (stock.unitsAvailable <= stock.minThreshold) {
          stock.status = "Low";
        } else {
          stock.status = "Sufficient";
        }
      }
      return stock;
    },
  },

  facilities: {
    findMany: async () => global.__pulseDeskStore!.facilities,
    updateBeds: async (id: string, deltaAvailable: number) => {
      const fac = global.__pulseDeskStore!.facilities.find((f) => f.id === id);
      if (fac) {
        fac.availableBeds = Math.max(
          0,
          Math.min(fac.totalBeds, fac.availableBeds + deltaAvailable)
        );
      }
      return fac;
    },
  },
};
