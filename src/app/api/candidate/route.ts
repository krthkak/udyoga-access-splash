import { NextResponse } from "next/server";
import { CandidateService, ActivityService, DriveService } from "@/services";
import { z } from "zod";
import { validateCandidateAuth } from "@/lib/auth/candidate-auth";

// Validation schema for POST request
const createCandidateSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export async function GET() {
  try {
    const auth = await validateCandidateAuth();

    if ("error" in auth) {
      return auth.error;
    }

    const { candidate } = auth;

    // // Only verified candidates can view activities/drives
    // if (candidate.status !== "verified") {
    //   return NextResponse.json(
    //     { error: "Candidate profile not verified" },
    //     { status: 403 }
    //   );
    // }

    // Get enrolled drives and activities
    const enrolledDrives = await CandidateService.getEnrolledDrives(
      candidate.id
    );
    const enrolledActivities = await CandidateService.getEnrolledActivities(
      candidate.id
    );

    // If the candidate has at least one enrolled activity or drive, only show enrolled items
    if (
      (Array.isArray(enrolledDrives) && enrolledDrives.length > 0) ||
      (Array.isArray(enrolledActivities) && enrolledActivities.length > 0)
    ) {
      return NextResponse.json(
        {
          success: true,
          enrolled_drives: enrolledDrives,
          enrolled_activities: enrolledActivities,
        },
        { status: 200 }
      );
    }

    // Otherwise, show public or institution-allowed activities/drives
    const institutionId =
      (candidate as any).institution_id ||
      (candidate as any).institution?.id ||
      "";

    const availableActivities =
      await ActivityService.getActivitiesForInstitution(institutionId);
    const availableDrives = await DriveService.getDrivesForInstitution(
      institutionId
    );

    return NextResponse.json(
      {
        success: true,
        enrolled_drives: enrolledDrives,
        enrolled_activities: enrolledActivities,
        available_drives: availableDrives,
        available_activities: availableActivities,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/candidate error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch candidate enrollments",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/candidate
 * Create or retrieve user and candidate by email
 * This endpoint is idempotent - returns existing records if found
 */
export async function POST(req: Request) {
  try {
    // Parse and validate request body
    const body = await req.json();
    const validationResult = createCandidateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { email } = validationResult.data;

    // Check if user already exists
    const existingCandidate = await CandidateService.getByEmail(email);

    if (existingCandidate) {
      return NextResponse.json(
        {
          success: true,
          user_id: existingCandidate.user.id,
          candidate_id: existingCandidate.id,
          user: existingCandidate.user,
          candidate: existingCandidate,
          message: "User already exists",
          is_new: false,
        },
        { status: 200 }
      );
    }

    // Create new user and candidate
    const result = await CandidateService.createWithEmail(email);

    return NextResponse.json(
      {
        success: true,
        user_id: result.user.id,
        candidate_id: result.candidate.id,
        user: result.user,
        candidate: result.candidate,
        message: "User and candidate created successfully",
        is_new: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating candidate:", error);

    // Handle unique constraint violations
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        {
          error: "User with this email already exists",
          message: error.message,
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to create candidate",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
