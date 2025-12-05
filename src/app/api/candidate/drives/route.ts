import { NextResponse } from "next/server";
import { CandidateService, DriveService } from "@/services";
import { validateCandidateAuth } from "@/lib/auth/candidate-auth";

export async function GET() {
  try {
    const auth = await validateCandidateAuth();

    if ("error" in auth) {
      return auth.error;
    }

    const { candidate } = auth;

    // Get drives for the candidate's institution
    const enrolledDriveRecords = await CandidateService.getEnrolledDrives(
      candidate.id
    );
    const enrolledDrives = enrolledDriveRecords?.map((record) => record.drive);

    const drivesRecords = await DriveService.getDrivesForInstitution(
      candidate.institution_id
    );
    const drives =
      drivesRecords?.filter(
        (drive) =>
          !enrolledDriveRecords.some(
            (enrolled) => enrolled.drive_id === drive.id
          )
      ) || [];

    return NextResponse.json(
      {
        drives,
        enrolledDrives,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/candidate/drives error:", error);
    return NextResponse.json(
      { error: "Failed to fetch drives" },
      { status: 500 }
    );
  }
}
