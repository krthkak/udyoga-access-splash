import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { CandidateService } from "@/services";

/**
 * Validates candidate authentication and retrieves candidate profile
 * Returns candidate object if valid, or NextResponse error if invalid
 */
export async function validateCandidateAuth() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const userId = session.user.id;
  const role = session.user.role;

  if (role !== "candidate") {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 403 }),
    };
  }

  // Get candidate by user_id
  const candidate = await CandidateService.getByUserId(userId);

  if (!candidate) {
    return {
      error: NextResponse.json(
        { error: "Candidate profile not found" },
        { status: 404 }
      ),
    };
  }

  return {
    candidate,
    userId,
    session,
  };
}

/**
 * Validates session for onboarding users (may not have candidate profile yet)
 * Returns userId and session if valid, or NextResponse error if invalid
 */
export async function validateOnboardingAuth() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const userId = session.user.id;
  const role = session.user.role;
  const status = session.user.status;

  if (role !== "candidate" || status !== "onboarding") {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return {
    userId,
    session,
    status,
  };
}
