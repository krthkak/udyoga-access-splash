import { validateAdminAuth } from "@/lib/auth/admin-auth";
import { validator } from "@/lib/validation";
import { ActivityService, DriveService } from "@/services";
import { AudienceTypeService } from "@/services/audienceType.service";
import { DepartmentService } from "@/services/department.service";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await validateAdminAuth();
    if (data.error) {
      return data.error;
    }
    const { id } = params;

    const drive = await DriveService.getDriveWithDetails(id);
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

    if (!drive) {
      return NextResponse.json(
        { error: "Failed to fetch drive data" },
        { status: 500 }
      );
    }

    const driveStages = drive.drive_activities
      .filter((da) => da.type === "STAGE")
      .map((activity) => activity.activity_id);

    const drivePre_requisites = drive.drive_activities
      .filter((da) => da.type === "PREREQUISITE")
      .map((activity) => activity.activity_id);

    // Add them as variables in the drive object
    const driveWithStages = {
      ...drive,
      stages: driveStages,
      pre_requisites: drivePre_requisites,
    };

    return NextResponse.json(
      { drive: driveWithStages, appliesTo, stages, preRequisites, departments },
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
  try {
    const session = await validateAdminAuth();

    if (session.error) {
      return session.error;
    }

    const body = await req.json();
    const d = validator.validate("drive.create.fe", body);
    if (!d.success) {
      console.error(
        "Validation failed for drive.create.fe (update):",
        d.error.issues,
        "payload:",
        body
      );
      return NextResponse.json(
        { message: "validation failed", issues: d.error.issues },
        { status: 400 }
      );
    }

    const isModified = await DriveService.createOrUpdate({
      name: body.name,
      allowed_sem: body.allowedSem,
      applies: body.appliesTo,
      available_positions: body.availablePositions,
      baseprice: body.basePrice,
      cgpa_greater_than: body.cgpa,
      documents: body.files,
      company_name: body.companyName,
      image: body.image,
      keypoints: body.keyPoints,
      pre_requisities: body.preRequisites,
      requirements: body.requirements,
      stages: body.stages,
      company_details: body.description,
      status: body.status ?? "active",
      tag: body.tag,
      id: body.id,
      bg_color: body.bgColor,
      departments: body.departments,
    });

    if (!isModified)
      return NextResponse.json(
        { message: "Something went wrong!" },
        { status: 400 }
      );

    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (err) {
    console.error("Error fetching onboarding data:", err);
    return NextResponse.json(
      { error: "Failed to fetch activities data" },
      { status: 500 }
    );
  }
}
