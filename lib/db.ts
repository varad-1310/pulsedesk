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
import { getSupabaseClient, isSupabaseConfigured } from "./supabase";

// In-memory data store for server runtime and fallback when Supabase is not yet connected
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
  isConfigured: () => isSupabaseConfigured(),

  patients: {
    findMany: async (): Promise<Patient[]> => {
      const sb = getSupabaseClient();
      if (sb) {
        try {
          const { data, error } = await sb
            .from("patients")
            .select("*")
            .order("createdAt", { ascending: false });
          if (!error && data && data.length > 0) return data as Patient[];
        } catch {
          // fall through to in-memory store
        }
      }
      return global.__pulseDeskStore!.patients;
    },
    create: async (data: Omit<Patient, "id" | "createdAt">): Promise<Patient> => {
      const newPatient: Patient = {
        ...data,
        id: `PAT-${1000 + (global.__pulseDeskStore?.patients.length || 0) + 1}`,
        createdAt: new Date().toISOString(),
      };
      const sb = getSupabaseClient();
      if (sb) {
        try {
          const { data: inserted, error } = await sb
            .from("patients")
            .insert(newPatient)
            .select()
            .single();
          if (!error && inserted) {
            global.__pulseDeskStore?.patients.unshift(inserted as Patient);
            return inserted as Patient;
          }
        } catch {
          // fall through
        }
      }
      global.__pulseDeskStore!.patients.unshift(newPatient);
      return newPatient;
    },
    findById: async (id: string): Promise<Patient | undefined> => {
      const sb = getSupabaseClient();
      if (sb) {
        try {
          const { data, error } = await sb
            .from("patients")
            .select("*")
            .eq("id", id)
            .maybeSingle();
          if (!error && data) return data as Patient;
        } catch {
          // fall through
        }
      }
      return global.__pulseDeskStore!.patients.find((p) => p.id === id);
    },
  },

  appointments: {
    findMany: async (): Promise<Appointment[]> => {
      const sb = getSupabaseClient();
      if (sb) {
        try {
          const { data, error } = await sb
            .from("appointments")
            .select("*")
            .order("createdAt", { ascending: false });
          if (!error && data && data.length > 0) return data as Appointment[];
        } catch {
          // fall through
        }
      }
      return global.__pulseDeskStore!.appointments;
    },
    create: async (data: Omit<Appointment, "id" | "createdAt">): Promise<Appointment> => {
      const newAppointment: Appointment = {
        ...data,
        id: `APT-${2000 + (global.__pulseDeskStore?.appointments.length || 0) + 1}`,
        createdAt: new Date().toISOString(),
      };
      const sb = getSupabaseClient();
      if (sb) {
        try {
          const { data: inserted, error } = await sb
            .from("appointments")
            .insert(newAppointment)
            .select()
            .single();
          if (!error && inserted) {
            global.__pulseDeskStore?.appointments.unshift(inserted as Appointment);
            return inserted as Appointment;
          }
        } catch {
          // fall through
        }
      }
      global.__pulseDeskStore!.appointments.unshift(newAppointment);
      return newAppointment;
    },
    updateStatus: async (
      id: string,
      status: Appointment["status"]
    ): Promise<Appointment | undefined> => {
      const sb = getSupabaseClient();
      if (sb) {
        try {
          const { data, error } = await sb
            .from("appointments")
            .update({ status })
            .eq("id", id)
            .select()
            .single();
          if (!error && data) {
            const apt = global.__pulseDeskStore?.appointments.find((a) => a.id === id);
            if (apt) apt.status = status;
            return data as Appointment;
          }
        } catch {
          // fall through
        }
      }
      const apt = global.__pulseDeskStore!.appointments.find((a) => a.id === id);
      if (apt) {
        apt.status = status;
      }
      return apt;
    },
  },

  ambulances: {
    findMany: async (): Promise<Ambulance[]> => {
      const sb = getSupabaseClient();
      if (sb) {
        try {
          const { data, error } = await sb
            .from("ambulances")
            .select("*")
            .order("id", { ascending: true });
          if (!error && data && data.length > 0) return data as Ambulance[];
        } catch {
          // fall through
        }
      }
      return global.__pulseDeskStore!.ambulances;
    },
    updateStatus: async (
      id: string,
      status: Ambulance["status"],
      etaMinutes?: number
    ): Promise<Ambulance | undefined> => {
      const sb = getSupabaseClient();
      if (sb) {
        try {
          const updatePayload: Record<string, unknown> = {
            status,
            lastUpdated: "Just now",
          };
          if (etaMinutes !== undefined) updatePayload.etaMinutes = etaMinutes;
          const { data, error } = await sb
            .from("ambulances")
            .update(updatePayload)
            .eq("id", id)
            .select()
            .single();
          if (!error && data) {
            const amb = global.__pulseDeskStore?.ambulances.find((a) => a.id === id);
            if (amb) {
              amb.status = status;
              if (etaMinutes !== undefined) amb.etaMinutes = etaMinutes;
              amb.lastUpdated = "Just now";
            }
            return data as Ambulance;
          }
        } catch {
          // fall through
        }
      }
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
    findMany: async (): Promise<EmergencyRequest[]> => {
      const sb = getSupabaseClient();
      if (sb) {
        try {
          const { data, error } = await sb
            .from("emergency_requests")
            .select("*")
            .order("requestedAt", { ascending: false });
          if (!error && data && data.length > 0) return data as EmergencyRequest[];
        } catch {
          // fall through
        }
      }
      return global.__pulseDeskStore!.emergencies;
    },
    create: async (
      data: Omit<EmergencyRequest, "id" | "requestedAt">
    ): Promise<EmergencyRequest> => {
      const newEmergency: EmergencyRequest = {
        ...data,
        id: `EMG-${900 + (global.__pulseDeskStore?.emergencies.length || 0) + 1}`,
        requestedAt: new Date().toISOString(),
      };
      const sb = getSupabaseClient();
      if (sb) {
        try {
          const { data: inserted, error } = await sb
            .from("emergency_requests")
            .insert(newEmergency)
            .select()
            .single();
          if (!error && inserted) {
            global.__pulseDeskStore?.emergencies.unshift(inserted as EmergencyRequest);
            return inserted as EmergencyRequest;
          }
        } catch {
          // fall through
        }
      }
      global.__pulseDeskStore!.emergencies.unshift(newEmergency);
      return newEmergency;
    },
    updateStatus: async (
      id: string,
      status: EmergencyRequest["status"],
      ambulanceAssignedId?: string
    ): Promise<EmergencyRequest | undefined> => {
      const sb = getSupabaseClient();
      if (sb) {
        try {
          const updatePayload: Record<string, unknown> = { status };
          if (ambulanceAssignedId) updatePayload.ambulanceAssignedId = ambulanceAssignedId;
          const { data, error } = await sb
            .from("emergency_requests")
            .update(updatePayload)
            .eq("id", id)
            .select()
            .single();
          if (!error && data) {
            const emg = global.__pulseDeskStore?.emergencies.find((e) => e.id === id);
            if (emg) {
              emg.status = status;
              if (ambulanceAssignedId) emg.ambulanceAssignedId = ambulanceAssignedId;
            }
            return data as EmergencyRequest;
          }
        } catch {
          // fall through
        }
      }
      const emg = global.__pulseDeskStore!.emergencies.find((e) => e.id === id);
      if (emg) {
        emg.status = status;
        if (ambulanceAssignedId) emg.ambulanceAssignedId = ambulanceAssignedId;
      }
      return emg;
    },
  },

  bloodStocks: {
    findMany: async (): Promise<BloodStock[]> => {
      const sb = getSupabaseClient();
      if (sb) {
        try {
          const { data, error } = await sb
            .from("blood_stocks")
            .select("*")
            .order("id", { ascending: true });
          if (!error && data && data.length > 0) return data as BloodStock[];
        } catch {
          // fall through
        }
      }
      return global.__pulseDeskStore!.bloodStocks;
    },
    updateUnits: async (id: string, deltaUnits: number): Promise<BloodStock | undefined> => {
      const stock = global.__pulseDeskStore!.bloodStocks.find((b) => b.id === id);
      const newUnits = Math.max(0, (stock?.unitsAvailable || 0) + deltaUnits);
      const minThresh = stock?.minThreshold || 10;
      const newStatus: BloodStock["status"] =
        newUnits <= minThresh / 2
          ? "Critical"
          : newUnits <= minThresh
          ? "Low"
          : "Sufficient";

      const sb = getSupabaseClient();
      if (sb) {
        try {
          const { data, error } = await sb
            .from("blood_stocks")
            .update({ unitsAvailable: newUnits, status: newStatus })
            .eq("id", id)
            .select()
            .single();
          if (!error && data) {
            if (stock) {
              stock.unitsAvailable = newUnits;
              stock.status = newStatus;
            }
            return data as BloodStock;
          }
        } catch {
          // fall through
        }
      }
      if (stock) {
        stock.unitsAvailable = newUnits;
        stock.status = newStatus;
      }
      return stock;
    },
  },

  facilities: {
    findMany: async (): Promise<Facility[]> => {
      const sb = getSupabaseClient();
      if (sb) {
        try {
          const { data, error } = await sb
            .from("facilities")
            .select("*")
            .order("id", { ascending: true });
          if (!error && data && data.length > 0) return data as Facility[];
        } catch {
          // fall through
        }
      }
      return global.__pulseDeskStore!.facilities;
    },
    updateBeds: async (id: string, deltaAvailable: number): Promise<Facility | undefined> => {
      const fac = global.__pulseDeskStore!.facilities.find((f) => f.id === id);
      const newAvailable = Math.max(
        0,
        Math.min(fac?.totalBeds || 100, (fac?.availableBeds || 0) + deltaAvailable)
      );

      const sb = getSupabaseClient();
      if (sb) {
        try {
          const { data, error } = await sb
            .from("facilities")
            .update({ availableBeds: newAvailable })
            .eq("id", id)
            .select()
            .single();
          if (!error && data) {
            if (fac) fac.availableBeds = newAvailable;
            return data as Facility;
          }
        } catch {
          // fall through
        }
      }
      if (fac) {
        fac.availableBeds = newAvailable;
      }
      return fac;
    },
  },
};
