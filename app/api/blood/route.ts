import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const bloodStocks = await db.bloodStocks.findMany();
    return NextResponse.json({ success: true, data: bloodStocks });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch blood inventory" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, deltaUnits } = body;

    if (!id || deltaUnits === undefined) {
      return NextResponse.json(
        { success: false, error: "Missing id or deltaUnits" },
        { status: 400 }
      );
    }

    const updated = await db.bloodStocks.updateUnits(id, Number(deltaUnits));
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to adjust blood stock" },
      { status: 500 }
    );
  }
}
