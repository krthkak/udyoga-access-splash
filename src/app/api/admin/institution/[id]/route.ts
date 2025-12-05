import { NextResponse } from "next/server";
import { ActivityService, DriveService, InstitutionService } from "@/services";
import { validateAdminAuth } from "@/lib/auth/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await validateAdminAuth();

    if (session.error) {
      return session.error;
    }
    const { id } = params;

    const institutionAudience = await prisma.audienceType.findFirst({
      where: { name: "Institution" },
    });

    const institution = await InstitutionService.getById(id);
    const activities = (
      await ActivityService.getAllActiveIndependentActivities()
    )
      .filter((activity) =>
        activity.applies.includes(institutionAudience?.id || "")
      )
      ?.map((activity) => ({ label: activity.name, value: activity.id }));

    const drives = (await DriveService.getAll())
      .filter((drive) => drive.applies.includes(institutionAudience?.id || ""))
      .map((drive) => ({
        label: drive.name,
        value: drive.id,
      }));

    return NextResponse.json(
      { institution, activities, drives },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching institution data:", err);
    return NextResponse.json(
      { message: "Failed to fetch institution data" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await validateAdminAuth();
    if (session.error) return session.error;

    const institutionId = params.id;

    if (!institutionId) {
      return NextResponse.json(
        { message: "Institution ID is required" },
        { status: 400 }
      );
    }

    const data = await req.json();

    if (!data.action) {
      return NextResponse.json(
        { message: "Action is required" },
        { status: 400 }
      );
    }

    let result;

    switch (data.action) {
      case "addActivity":
        if (!data?.activityId)
          return NextResponse.json(
            { message: "activityId required" },
            { status: 400 }
          );

        // Duplicate check
        const existingActivity = await prisma.institutionActivity.findFirst({
          where: {
            institution_id: institutionId,
            activity_id: data.activityId,
          },
        });

        if (existingActivity) {
          return NextResponse.json(
            { message: "Activity already added to this institution" },
            { status: 400 }
          );
        }

        result = await prisma.institutionActivity.create({
          data: {
            institution_id: institutionId,
            activity_id: data.activityId,
            baseprice: data.basePrice,
            allowed_sem: data.allowedSem,
            cgpa_greater_than: data.cgpa,
            status: data.status ?? "active",
          },
        });
        break;

      case "addDrive":
        if (!data?.driveId)
          return NextResponse.json(
            { message: "driveId required" },
            { status: 400 }
          );

        // Duplicate check
        const existingDrive = await prisma.institutionDrive.findFirst({
          where: {
            institution_id: institutionId,
            drive_id: data.driveId,
          },
        });

        if (existingDrive) {
          return NextResponse.json(
            { message: "Drive already added to this institution" },
            { status: 400 }
          );
        }

        result = await prisma.institutionDrive.create({
          data: {
            institution_id: institutionId,
            drive_id: data.driveId,
            baseprice: data.basePrice,
            allowed_sem: data.allowedSem,
            cgpa_greater_than: data.cgpa,
            status: data.status ?? "active",
          },
        });
        break;

      case "editInstitution":
        if (!data)
          return NextResponse.json(
            { message: "No data to update" },
            { status: 400 }
          );
        result = await prisma.institution.update({
          where: { id: institutionId },
          data: data.upsert_data,
        });
        break;

      default:
        return NextResponse.json(
          { message: "Invalid action" },
          { status: 400 }
        );
    }

    return NextResponse.json({ message: "success", result });
  } catch (err) {
    console.error("Error in POST /api/admin/institution/[id]:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
