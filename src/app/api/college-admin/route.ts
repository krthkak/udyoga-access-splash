import { validateCollegeAdminAuth } from "@/lib/auth/college-admin-auth";
import { InstitutionService } from "@/services";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await validateCollegeAdminAuth();
    if (data.error) {
      return data.error;
    }

    const res = await InstitutionService.getCollegeAdminDetails(
      data.institutionId!
    );

    return NextResponse.json({ ...res }, { status: 200 });
  } catch (error) {
    console.error("Error fetching activity data:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity data" },
      { status: 500 }
    );
  }
}
