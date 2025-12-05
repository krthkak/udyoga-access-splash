import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserService } from "@/services";
import { prisma } from "../prisma";

/**
 * Validates admin authentication
 * Returns admin object if valid, or NextResponse error if invalid
 */
export async function validateCollegeAdminAuth() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const role = session.user.role;
  const id = session.user.id;

  if (role !== "college-admin") {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  // Get candidate by user_id
  const collegeAdmin = await UserService.getByIdCollegeAdmin(id);

  if (!collegeAdmin) {
    return {
      error: NextResponse.json({ error: "Admin not found" }, { status: 404 }),
    };
  }

  const collegeAdminRecord = await prisma.collegeAdmin.findUnique({
    where: { email: collegeAdmin.email! },
  });

  const institutionId = collegeAdminRecord?.institution_id;

  return {
    collegeAdmin,
    id,
    session,
    institutionId,
  };
}
