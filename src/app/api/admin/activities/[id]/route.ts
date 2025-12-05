import { validateAdminAuth } from "@/lib/auth/admin-auth";
import { validator } from "@/lib/validation";
import { ActivityService } from "@/services";
import { AudienceTypeService } from "@/services/audienceType.service";
import { DepartmentService } from "@/services/department.service";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const data = await validateAdminAuth();
    if (data.error) {
      return data.error;
    }
    const { id } = await params;

    const activity = await ActivityService.getActivityWithDetails(id);
    const appliesTo = await AudienceTypeService.getAll();
    const departments = (await DepartmentService.getAll()).map((d) => ({
      label: d.name,
      value: d.id,
    }));

    return NextResponse.json(
      { activity, appliesTo, departments },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching activity data:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity data" },
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
    const d = validator.validate("activity.create.fe", body);
    if (!d.success) {
      return NextResponse.json(
        { message: d.error.issues.join(", ") },
        { status: 400 }
      );
    }

    const departments = Array.isArray(body.departments)
      ? body.departments.map((d: any) =>
          d?.value != null ? String(d.value).trim() : String(d).trim()
        )
      : [];

    const isModified = await ActivityService.createOrUpdate({
      name: body.name,
      type: body.type ?? "course",
      category: body.category,
      tag: body.tag,
      internal_name: body.internalName,
      bg_color: body.bgColor,
      description: body.description,
      details: body.details,
      cgpa_greater_than: body.cgpa ? Number(body.cgpa) : null,
      documents: body.files,
      image: body.image ?? "",
      baseprice: body.basePrice,
      external_url: body.external_url,
      allowed_sem: body.allowedSem?.value ?? null,
      applies: body.appliesTo?.map((applies: any) => applies.value) ?? [],
      departments,
      keypoints: body?.keyPoints.map((point: any) => point.text) ?? [],
      status: body.status ?? "active",
      id: body.id,
    });

    if (!isModified)
      return NextResponse.json(
        { message: "Something went wrong!" },
        { status: 400 }
      );

    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (err) {
    console.error("Error fetching activity data:", err);
    return NextResponse.json(
      { error: "Failed to fetch activities data" },
      { status: 500 }
    );
  }
}
