import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { AmbulanceStatus } from "@/lib/types";

export async function GET() {
  try {
    const ambulances = await db.ambulances.findMany();
    return NextResponse.json({ success: true, data: ambulances });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch ambulance fleet" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status, etaMinutes } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "Missing id or status" },
        { status: 400 }
      );
    }

    const updated = await db.ambulances.updateStatus(
      id,
      status as AmbulanceStatus,
      etaMinutes
    );
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update ambulance" },
      { status: 500 }
    );
  }
}
