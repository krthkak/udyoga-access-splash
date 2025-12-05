import { NextResponse } from "next/server";
import { DriveService, CandidateService } from "@/services";
import { validateCandidateAuth } from "@/lib/auth/candidate-auth";

export async function GET(
  req: Request,
  context: { params: Promise<{ drive_id: string }> }
) {
  try {
    const auth = await validateCandidateAuth();

    if ("error" in auth) {
      return auth.error;
    }

    const { candidate } = auth;
    const { drive_id } = await context.params;
    const driveId = drive_id;

    // Get drive with all related details
    const drive = await DriveService.getDriveWithDetails(driveId);

    if (!drive) {
      return NextResponse.json({ error: "Drive not found" }, { status: 404 });
    }

    // Check if drive is public
    const isPublic = await DriveService.isPublicDrive(driveId);

    // Find institution-specific drive record
    const institutionDrive = drive.institution_drives.find(
      (idrive: any) => idrive.institution_id === candidate.institution_id
    );

    if (!isPublic && !institutionDrive) {
      return NextResponse.json(
        { error: "Drive not available for your institution" },
        { status: 403 }
      );
    }

    // Flatten institution_drive fields into root level
    const driveResponse = { ...drive };
    if (institutionDrive) {
      driveResponse.baseprice = institutionDrive.baseprice;
      driveResponse.allowed_sem = institutionDrive.allowed_sem;
      driveResponse.cgpa_greater_than = institutionDrive.cgpa_greater_than;
      driveResponse.institution_drives = null!;
    }

    // Get enrolled record (if any) for this candidate and drive
    const candidateDriveResult = await CandidateService.getCandidateDrive(
      candidate.id,
      driveId
    );

    if (candidateDriveResult) {
      return NextResponse.json(
        {
          drive: driveResponse,
          candidate_drive: candidateDriveResult.candidate_drive,
          candidate_activities: candidateDriveResult.candidate_activities,
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ drive: driveResponse }, { status: 200 });
  } catch (error) {
    console.error("GET /api/candidate/drives/[drive_id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch drive details" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  context: { params: Promise<{ drive_id: string }> }
) {
  try {
    const auth = await validateCandidateAuth();

    if ("error" in auth) {
      return auth.error;
    }

    const { candidate } = auth;
    const { drive_id } = await context.params;

    // Check if the candidate is already enrolled in the drive
    const isEnrolled = await CandidateService.isEnrolledInDrive(
      candidate.id,
      drive_id
    );

    if (isEnrolled) {
      return NextResponse.json(
        { error: "Candidate is already enrolled in this drive" },
        { status: 400 }
      );
    }

    // Enroll candidate and return the enrolled drive + candidate_activity records

    const enrollResult = await CandidateService.enrollInDrive(
      candidate.id,
      drive_id
    );

    // If prerequisites are not completed, enrollResult will contain an error object
    if (
      enrollResult &&
      typeof enrollResult === "object" &&
      (enrollResult as any).error === "prerequisite_not_completed"
    ) {
      return NextResponse.json(
        {
          error: (enrollResult as any).message,
          missing: (enrollResult as any).missing,
        },
        { status: 403 }
      );
    }

    const candidateDriveResult = await CandidateService.getCandidateDrive(
      candidate.id,
      drive_id
    );

    return NextResponse.json(
      {
        drive_id,
        candidate_drive: candidateDriveResult?.candidate_drive ?? null,
        candidate_activities: candidateDriveResult?.candidate_activities ?? [],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Error processing POST /api/candidate/drives/[drive_id]:",
      error
    );
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
