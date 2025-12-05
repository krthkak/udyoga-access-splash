import { NextResponse } from "next/server";
import { validateCandidateAuth } from "@/lib/auth/candidate-auth";
import { ActivityService, CandidateService } from "@/services";

export async function GET() {
  try {
    const auth = await validateCandidateAuth();

    if ("error" in auth) {
      return auth.error;
    }

    const { candidate } = auth;

    const enrolledActivitiesRecords =
      await CandidateService.getEnrolledActivities(candidate.id);
    const enrolledActivities = enrolledActivitiesRecords?.map(
      (record) => record.activity
    );

    const activitiesRecords = await ActivityService.getActivitiesForInstitution(
      candidate.institution_id
    );
    const activities = activitiesRecords.filter((activity) => {
      return enrolledActivitiesRecords.every(
        (enrolled) => enrolled.activity_id !== activity.id
      );
    });

    return NextResponse.json(
      {
        activities,
        enrolledActivities,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/candidate/activities error:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}
