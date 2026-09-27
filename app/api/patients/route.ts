import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const patients = await db.patients.findMany();
    return NextResponse.json({ success: true, data: patients });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch patients" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, age, gender, phone, bloodGroup, emergencyContact, address, medicalHistory } =
      body;

    if (!name || !age || !phone || !bloodGroup) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newPatient = await db.patients.create({
      name,
      age: Number(age),
      gender: gender || "Other",
      phone,
      bloodGroup,
      emergencyContact: emergencyContact || "",
      address: address || "",
      medicalHistory: medicalHistory || "",
    });

    return NextResponse.json({ success: true, data: newPatient }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create patient record" },
      { status: 500 }
    );
  }
}
