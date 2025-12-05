import { NextResponse } from "next/server";
import { validateAdminAuth } from "@/lib/auth/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await validateAdminAuth();
    if (session.error) return session.error;

    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ message: "id required" }, { status: 400 });
    }

    const instActivity = await prisma.institutionActivity.findUnique({
      where: { id },
    });

    if (!instActivity) {
      return NextResponse.json({ message: "not found" }, { status: 404 });
    }

    return NextResponse.json(
      { institutionActivity: instActivity },
      { status: 200 }
    );
  } catch (err) {
    console.error(
      "Error in GET /api/admin/institution/institution_activity:",
      err
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await validateAdminAuth();
    if (session.error) return session.error;

    const body = await req.json();
    const { action, id, basePrice, allowedSem, cgpa, status } = body;

    if (!action) {
      return NextResponse.json({ message: "action required" }, { status: 400 });
    }

    if (action === "update") {
      if (!id)
        return NextResponse.json({ message: "id required" }, { status: 400 });

      const data: any = {};
      if (basePrice !== undefined) data.baseprice = basePrice;
      if (allowedSem !== undefined) data.allowed_sem = allowedSem;
      if (cgpa !== undefined) data.cgpa_greater_than = cgpa;
      if (status !== undefined) data.status = status;

      const updated = await prisma.institutionActivity.update({
        where: { id },
        data,
      });

      return NextResponse.json(
        { message: "success", institutionActivity: updated },
        { status: 200 }
      );
    }

    return NextResponse.json({ message: "invalid action" }, { status: 400 });
  } catch (err) {
    console.error(
      "Error in POST /api/admin/institution/institution_activity:",
      err
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
