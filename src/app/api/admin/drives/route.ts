import { validateAdminAuth } from "@/lib/auth/admin-auth";
import { validator } from "@/lib/validation";
import { DriveService } from "@/services";
import { NextResponse } from "next/server";

export async function GET() {
  return new Response(JSON.stringify({ error: "Not implemented" }), {
    status: 501,
    headers: { "content-type": "application/json" },
  });
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
        "Validation failed for drive.create.fe:",
        d.error.issues,
        "payload:",
        body
      );
      // Return structured issues to help debugging invalid UUIDs (issue.path/ message)
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
      description: body.description,
      documents: body.files,
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
      { message: "Failed to fetch activities data" },
      { status: 500 }
    );
  }
}
