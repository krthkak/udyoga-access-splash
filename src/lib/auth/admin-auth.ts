import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserService } from "@/services";

/**
 * Validates admin authentication
 * Returns admin object if valid, or NextResponse error if invalid
 */
export async function validateAdminAuth() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const role = session.user.role;
  const id = session.user.id;

  if (role !== "admin") {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  // Get candidate by user_id
  const admin = await UserService.getByIdAdmin(id);

  if (!admin) {
    return {
      error: NextResponse.json({ error: "Admin not found" }, { status: 404 }),
    };
  }

  return {
    admin,
    id,
    session,
  };
}
