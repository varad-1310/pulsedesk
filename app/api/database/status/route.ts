import { NextResponse } from "next/server";
import { isSupabaseConfigured, getSupabaseClient } from "@/lib/supabase";

export async function GET() {
  const configured = isSupabaseConfigured();

  if (!configured) {
    return NextResponse.json({
      connected: false,
      mode: "in-memory",
      message: "Running in active in-memory store. Add Supabase credentials in .env to connect to cloud database.",
      tables: {
        patients: true,
        appointments: true,
        ambulances: true,
        emergencies: true,
        bloodStocks: true,
        facilities: true,
      },
    });
  }

  try {
    const sb = getSupabaseClient();
    if (!sb) {
      throw new Error("Supabase client initialization failed");
    }

    const { error: patientsErr } = await sb.from("patients").select("id").limit(1);

    if (patientsErr) {
      return NextResponse.json({
        connected: false,
        mode: "supabase-pending-migration",
        message: `Connected to Supabase, but tables need to be created. Error: ${patientsErr.message}`,
        error: patientsErr.message,
      });
    }

    return NextResponse.json({
      connected: true,
      mode: "supabase-live",
      message: "Connected to Supabase PostgreSQL database successfully.",
    });
  } catch (err: any) {
    return NextResponse.json({
      connected: false,
      mode: "supabase-error",
      message: err?.message || "Failed to query Supabase",
    });
  }
}
