import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { InstitutionService } from "@/services";
import { validateAdminAuth } from "@/lib/auth/admin-auth";

export async function GET() {
  try {
    const session = await validateAdminAuth();

    if (session.error) {
      return session.error;
    }

    const institutions = await InstitutionService.getAll(true);

    return NextResponse.json({ institutions }, { status: 200 });
  } catch (err) {
    console.error("Error fetching institution data:", err);
    return NextResponse.json(
      { error: "Failed to fetch institution data" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await validateAdminAuth();

    if (session.error) {
      return session.error;
    }
    const body = await req.json();

    await InstitutionService.create({
      name: body.name,
      city: body.city,
      status: "verified",
      state: body.state,
      contact_person: body.contactPerson,
      contact_phone_details: body.phone,
    });

    return NextResponse.json({ status: 200 });
  } catch (err) {
    console.error("Error fetching institution data:", err);
    return NextResponse.json(
      { error: "Failed to fetch institution data" },
      { status: 500 }
    );
  }
}
