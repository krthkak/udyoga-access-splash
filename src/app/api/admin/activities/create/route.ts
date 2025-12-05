import { validateAdminAuth } from "@/lib/auth/admin-auth";
import { AudienceTypeService } from "@/services/audienceType.service";
import { DepartmentService } from "@/services/department.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await validateAdminAuth();
    if (data.error) {
      return data.error;
    }

    const appliesTo = await AudienceTypeService.getAll();
    const departments = (await DepartmentService.getAll()).map((d) => ({
      label: d.name,
      value: d.id,
    }));

    return NextResponse.json({ appliesTo, departments }, { status: 200 });
  } catch (error) {
    console.error("Error fetching activity data:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity data" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  return new Response(JSON.stringify({ error: "Not implemented" }), {
    status: 501,
    headers: { "content-type": "application/json" },
  });
}
