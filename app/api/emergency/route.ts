import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { EmergencyStatus, EmergencySeverity } from "@/lib/types";

export async function GET() {
  try {
    const emergencies = await db.emergencies.findMany();
    return NextResponse.json({ success: true, data: emergencies });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch emergency requests" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { patientName, contact, emergencyType, severity, location, notes } =
      body;

    if (!patientName || !contact || !emergencyType || !location) {
      return NextResponse.json(
        { success: false, error: "Missing required emergency fields" },
        { status: 400 }
      );
    }

    const newEmergency = await db.emergencies.create({
      patientName,
      contact,
      emergencyType,
      severity: (severity as EmergencySeverity) || "Critical",
      location,
      status: "Pending",
      notes: notes || "",
    });

    return NextResponse.json(
      { success: true, data: newEmergency },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create emergency request" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status, ambulanceAssignedId } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "Missing id or status" },
        { status: 400 }
      );
    }

    const updated = await db.emergencies.updateStatus(
      id,
      status as EmergencyStatus,
      ambulanceAssignedId
    );
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update emergency request" },
      { status: 500 }
    );
  }
}
