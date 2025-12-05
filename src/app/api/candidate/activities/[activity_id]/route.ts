import { NextResponse } from "next/server";
import { validateCandidateAuth } from "@/lib/auth/candidate-auth";
import { ActivityService } from "@/services";
import { CandidateService } from "@/services/candidate.service";

export async function GET(
  req: Request,
  context: { params: Promise<{ activity_id: string }> }
) {
  try {
    const auth = await validateCandidateAuth();

    if ("error" in auth) {
      return auth.error;
    }

    const { candidate } = auth;
    const { activity_id } = await context.params;
    const activityId = activity_id;

    const activity = await ActivityService.getActivity(activityId);

    if (!activity) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 }
      );
    }

    // Check if activity is public
    const isPublic = await ActivityService.isPublicActivity(activityId);

    // Verify availability: either public OR available for candidate's institution
    const institutionActivity = activity.institution_activities.find(
      (ia: any) => ia.institution_id === candidate.institution_id
    );

    if (!isPublic && !institutionActivity) {
      return NextResponse.json(
        { error: "Activity not available for your institution" },
        { status: 403 }
      );
    }

    // Flatten the institution activity fields into root level
    const activityResponse = { ...activity };

    // Check if candidate has an enrollment record for this activity
    const candidateActivity = await CandidateService.getCandidateActivity(
      candidate.id,
      activityId
    );

    if (institutionActivity) {
      // Override/add fields from institution_activity
      activityResponse.baseprice = institutionActivity.baseprice;
      activityResponse.allowed_sem = institutionActivity.allowed_sem;
      activityResponse.cgpa_greater_than =
        institutionActivity.cgpa_greater_than;
      activityResponse.institution_activities = null!;
    }

    if (!candidateActivity) {
      activityResponse.external_url = "";
    }

    if (candidateActivity) {
      return NextResponse.json(
        { activity: activityResponse, candidate_activity: candidateActivity },
        { status: 200 }
      );
    }

    return NextResponse.json({ activity: activityResponse }, { status: 200 });
  } catch (error) {
    console.error("GET /api/candidate/activities/[activity_id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity details" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  context: { params: Promise<{ activity_id: string }> }
) {
  try {
    const auth = await validateCandidateAuth();

    if ("error" in auth) {
      return auth.error;
    }

    const { candidate } = auth;
    const { activity_id } = await context.params;

    const activity = await ActivityService.getActivity(activity_id);

    if (!activity) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 }
      );
    }

    // Check if activity is public
    const isPublic = await ActivityService.isPublicActivity(activity_id);

    // Verify availability: either public OR available for candidate's institution
    const isAvailableForInstitution = activity.institution_activities.some(
      (ia: any) => ia.institution_id === candidate.institution_id
    );

    if (!isPublic && !isAvailableForInstitution) {
      return NextResponse.json(
        { error: "Activity not available for your institution" },
        { status: 403 }
      );
    }

    // Create enrollment (idempotent)
    const enrollment = await CandidateService.enrollInActivity(
      candidate.id,
      activity_id,
      {}
    );

    return NextResponse.json({ enrollment }, { status: 201 });
  } catch (error) {
    console.error("POST /api/candidate/activities/[activity_id] error:", error);
    return NextResponse.json(
      { error: "Failed to enroll in activity" },
      { status: 500 }
    );
  }
}
