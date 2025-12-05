import { prisma } from "@/lib/prisma";
import { Activity, ActivityCategory } from "@prisma/client";
import { Decimal, DecimalJsLike } from "@prisma/client/runtime/library";

export class ActivityService {
  /**
   * Fetch activities available to an institution: merges institution-scoped activities
   * (with allowed_sem/cgpa/is_required/baseprice overrides) with public activities.
   */
  static async getActivitiesForInstitution(institutionId: string) {
    // Get the Public audience type ID
    const publicAudience = await prisma.audienceType.findFirst({
      where: { name: "Public" },
    });

    // Fetch institution-specific activities
    const institutionActivities = await prisma.institutionActivity.findMany({
      where: {
        institution_id: institutionId,
      },
      include: {
        activity: {
          select: {
            id: true,
            name: true,
            description: true,
            status: true,
            updated_date: true,
            tag: true,
            bg_color: true,
            _count: { select: { candidate_activities: true } },
          },
        },
      },
      orderBy: {
        created_date: "desc",
      },
      cacheStrategy: {
        swr: 60,
        ttl: 60,
      },
    });

    // Fetch public activities (not already included via institution)
    const institutionActivityIds = institutionActivities.map(
      (ia) => ia.activity_id
    );

    const publicActivities = publicAudience
      ? await prisma.activity.findMany({
          where: {
            applies: {
              has: publicAudience.id,
            },
            id: {
              notIn: institutionActivityIds, // Exclude already included institution activities
            },
            status: "active", // Only show active public activities
          },
          orderBy: {
            created_date: "desc",
          },
          select: {
            id: true,
            name: true,
            status: true,
            description: true,
            updated_date: true,
            tag: true,
            bg_color: true,
            _count: { select: { candidate_activities: true } },
          },
          cacheStrategy: {
            swr: 60,
            ttl: 60,
          },
        })
      : [];

    // Map institution activities with metadata
    const institutionMapped = institutionActivities.map((ia: any) => ({
      ...ia.activity,
      institution_activity_id: ia.id,
      allowed_sem: ia.allowed_sem,
      cgpa_greater_than: ia.cgpa_greater_than,
      is_required: ia.is_required,
      baseprice: ia.baseprice ?? ia.activity.baseprice,
      // enrolled_count: ia.activity.candidate_activities.length,
      // candidate_activities: null,
    }));

    // Map public activities without institution-specific metadata
    const publicMapped = publicActivities.map((activity: any) => ({
      ...activity,
      institution_activity_id: null,
      allowed_sem: null,
      cgpa_greater_than: null,
      is_required: false,
      baseprice: activity.baseprice,
      // enrolled_count: activity.candidate_activities.length,
      // candidate_activities: null,
    }));

    // Combine and return
    return [...institutionMapped, ...publicMapped];
  }

  /**
   * Fetch a single activity with relations: drive_activities (with drive),
   * institution_activities (with institution), candidate_activities, and payments.
   */
  static async getActivityWithDetails(activityId: string) {
    return prisma.activity.findUnique({
      where: { id: activityId },
      include: {
        drive_activities: {
          include: {
            drive: true,
          },
        },
        institution_activities: {
          include: {
            institution: true,
          },
        },
        candidate_activities: true,
        departments: true,
      },
    });
  }

  /**
   * Fetch a single activity
   */
  static async getActivity(activityId: string) {
    return prisma.activity.findUnique({
      where: { id: activityId },
      include: {
        institution_activities: true,
        departments: true,
      },
    });
  }

  /**
   * Fetch compact list of all activities (id, name, status, updated_date) with count of enrollments.
   */
  static async getAllActivities() {
    return prisma.activity.findMany({
      select: {
        id: true,
        name: true,
        status: true,
        updated_date: true,
        category: true,
        applies: true,
        _count: { select: { candidate_activities: true } },
      },
      cacheStrategy: {
        swr: 60,
        ttl: 60,
      },
    });
  }

  /**
   * Fetch compact list of all active independent activities (id, name, status, updated_date) with count of enrollments.
   */
  static async getAllActiveIndependentActivities() {
    return prisma.activity.findMany({
      where: {
        status: "active",
        category: { not: ActivityCategory.PartOfDrive },
      },
      select: {
        id: true,
        name: true,
        status: true,
        updated_date: true,
        applies: true,
        _count: { select: { candidate_activities: true } },
      },
      cacheStrategy: {
        swr: 60,
        ttl: 60,
      },
    });
  }

  /**
   * Fetch activities usable as prerequisites (types: course, seminar) with counts.
   */
  static async getAllActivitiesForPreRequisites() {
    return prisma.activity.findMany({
      where: { OR: [{ type: "course" }, { type: "seminar" }] },
      select: {
        id: true,
        name: true,
        status: true,
        updated_date: true,
        _count: { select: { candidate_activities: true } },
      },
      cacheStrategy: {
        swr: 60,
        ttl: 60,
      },
    });
  }

  /**
   * Fetch activities used in stages (types: interview, GD) with counts.
   */
  static async getAllActivitiesForStages() {
    return prisma.activity.findMany({
      where: { OR: [{ type: "interview" }, { type: "GD" }] },
      select: {
        id: true,
        name: true,
        status: true,
        updated_date: true,
        _count: { select: { candidate_activities: true } },
      },
      cacheStrategy: {
        swr: 60,
        ttl: 60,
      },
    });
  }
  /**
   * Return true if the activity's applies array includes the Public audience id.
   */
  static async isPublicActivity(activityId: string): Promise<boolean> {
    const publicAudience = await prisma.audienceType.findFirst({
      where: { name: "Public" },
    });

    if (!publicAudience) {
      return false;
    }

    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      select: { applies: true },
    });

    return activity?.applies.includes(publicAudience.id) ?? false;
  }

  /**
   * Create or update an activity record. Returns true on success.
   */
  static async createOrUpdate(
    data: Partial<Activity> & { departments?: string[] }
  ): Promise<boolean> {
    try {
      if (data.id) {
        // Update existing activity
        await prisma.activity.update({
          where: { id: data.id },
          data: {
            name: data.name,
            type: data.type,
            category: data.category,
            tag: data.tag,
            internal_name: data.internal_name,
            bg_color: data.bg_color,
            description: data.description,
            details: data.details,
            keypoints: data.keypoints,
            cgpa_greater_than: data.cgpa_greater_than,
            allowed_sem: data.allowed_sem,
            documents: data.documents,
            image: data.image,
            baseprice: data.baseprice,
            applies: data.applies,
            departments: data.departments
              ? {
                  set: [], // remove old relations
                  connect: data.departments.map((id) => ({ id })),
                }
              : undefined,
            external_url: data.external_url,
          },
        });
      } else {
        // Create new activity
        await prisma.activity.create({
          data: {
            name: data.name!,
            type: data.type!,
            category: data.category,
            tag: data.tag,
            internal_name: data.internal_name!,
            bg_color: data.bg_color,
            description: data.description!,
            details: data.details ?? "",
            keypoints: data.keypoints,
            cgpa_greater_than: data.cgpa_greater_than,
            allowed_sem: data.allowed_sem,
            documents: data.documents || [],
            image: data.image ?? "",
            baseprice: data.baseprice as
              | string
              | number
              | Decimal
              | DecimalJsLike,
            applies: data.applies || [],
            departments: data.departments
              ? {
                  connect: data.departments.map((id) => ({ id })),
                }
              : undefined,
            external_url: data.external_url,
          },
        });
      }
      return true;
    } catch (error) {
      console.error("Error in createOrUpdate:", error);
      return false;
    }
  }
}
