import { validateAdminAuth } from "@/lib/auth/admin-auth";
import { ActivityService } from "@/services";
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
    const stages = (await ActivityService.getAllActivitiesForStages()).map(
      (activity) => ({ label: activity.name, value: activity.id })
    );

    const preRequisites = (
      await ActivityService.getAllActivitiesForPreRequisites()
    ).map((activity) => ({ label: activity.name, value: activity.id }));

    const departments = (await DepartmentService.getAll()).map((d) => ({
      label: d.name,
      value: d.id,
    }));

    return NextResponse.json(
      { appliesTo, stages, preRequisites, departments },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching drive data:", error);
    return NextResponse.json(
      { error: "Failed to fetch drive data" },
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
