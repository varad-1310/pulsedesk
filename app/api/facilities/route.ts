import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const facilities = await db.facilities.findMany();
    return NextResponse.json({ success: true, data: facilities });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch healthcare facilities" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, deltaAvailable } = body;

    if (!id || deltaAvailable === undefined) {
      return NextResponse.json(
        { success: false, error: "Missing id or deltaAvailable" },
        { status: 400 }
      );
    }

    const updated = await db.facilities.updateBeds(id, Number(deltaAvailable));
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update facility bed counts" },
      { status: 500 }
    );
  }
}
