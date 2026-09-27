import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { AppointmentStatus } from "@/lib/types";

export async function GET() {
  try {
    const appointments = await db.appointments.findMany();
    return NextResponse.json({ success: true, data: appointments });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      patientName,
      phone,
      doctorName,
      department,
      date,
      time,
      purpose,
      priority,
      notes,
    } = body;

    if (!patientName || !phone || !doctorName || !date || !time) {
      return NextResponse.json(
        { success: false, error: "Missing required appointment fields" },
        { status: 400 }
      );
    }

    const newAppointment = await db.appointments.create({
      patientName,
      phone,
      doctorName,
      department: department || "General Medicine",
      date,
      time,
      purpose: purpose || "General Consultation",
      status: "Scheduled",
      priority: priority || "Normal",
      notes: notes || "",
    });

    return NextResponse.json(
      { success: true, data: newAppointment },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "Missing id or status" },
        { status: 400 }
      );
    }

    const updated = await db.appointments.updateStatus(
      id,
      status as AppointmentStatus
    );
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update appointment status" },
      { status: 500 }
    );
  }
}
