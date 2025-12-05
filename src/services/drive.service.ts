//To Do: optimise the count fetching for drives

import { prisma } from "@/lib/prisma";
import { Prisma, EntityStatus, Drive, DriveActivityType } from "@prisma/client";

export class DriveService {
  /**
   * Fetch drives (id, name, available_positions, company_details, requirements, documents, applies, updated_date)
   * Optionally filters by status.
   */
  static async getAll(status?: EntityStatus) {
    const where: Prisma.DriveWhereInput = status ? { status } : {};

    return prisma.drive.findMany({
      where,
      select: {
        id: true,
        name: true,
        available_positions: true,
        company_details: true,
        requirements: true,
        documents: true,
        applies: true,
        updated_date: true,
        _count: {
          select: {
            candidate_drives: true,
          },
        },
      },
      orderBy: {
        updated_date: "desc",
      },
      cacheStrategy: {
        swr: 60,
        ttl: 60,
      },
    });
  }

  /**
   * Fetch a drive by id including its drive_activities and institution_drives.
   */
  static async getById(id: string) {
    return prisma.drive.findUnique({
      where: { id },
      include: {
        drive_activities: true,
        institution_drives: true,
      },
    });
  }

  /**
   * Create a new drive record.
   */
  static async create(data: Prisma.DriveCreateInput) {
    return prisma.drive.create({
      data,
    });
  }

  /**
   * Update drive fields for a given id.
   */
  static async update(id: string, data: Prisma.DriveUpdateInput) {
    return prisma.drive.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a drive by id.
   */
  static async delete(id: string) {
    return prisma.drive.delete({
      where: { id },
    });
  }

  /**
   * Fetch drives filtered to EntityStatus.active.
   */
  static async getActive() {
    return this.getAll(EntityStatus.active);
  }

  /**
   * Fetch drives filtered to EntityStatus.pending.
   */
  static async getPending() {
    return this.getAll(EntityStatus.pending);
  }

  /**
   * Fetch drives available to an institution: merges institution-scoped drives
   * (with allowed_sem/cgpa/is_required metadata) with public drives.
   */
  static async getDrivesForInstitution(institutionId: string) {
    // Get the Public audience type ID
    const publicAudience = await prisma.audienceType.findFirst({
      where: { name: "Public" },
    });

    // Fetch institution-specific drives
    const institutionDrives = await prisma.institutionDrive.findMany({
      where: {
        institution_id: institutionId,
        status: EntityStatus.active,
      },
      include: {
        drive: {
          select: {
            id: true,
            name: true,
            available_positions: true,
            company_details: true,
            requirements: true,
            company_name: true,
            documents: true,
            applies: true,
            updated_date: true,
            bg_color: true,
            _count: {
              select: {
                candidate_drives: true,
              },
            },
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

    // Fetch public drives (not already included via institution)
    const institutionDriveIds = institutionDrives.map((id) => id.drive_id);

    const publicDrives = publicAudience
      ? await prisma.drive.findMany({
          where: {
            applies: {
              has: publicAudience.id,
            },
            id: {
              notIn: institutionDriveIds, // Exclude already included institution drives
            },
            status: EntityStatus.active, // Only show active public drives
          },
          orderBy: {
            created_date: "desc",
          },
          select: {
            id: true,
            name: true,
            available_positions: true,
            company_details: true,
            requirements: true,
            documents: true,
            applies: true,
            bg_color: true,
            updated_date: true,
            _count: {
              select: {
                candidate_drives: true,
              },
            },
          },
          cacheStrategy: {
            swr: 60,
            ttl: 60,
          },
        })
      : [];

    // Map institution drives with metadata
    const institutionMapped = institutionDrives.map(
      (institutionDrive: any) => ({
        ...institutionDrive.drive,
        institution_drive_id: institutionDrive.id,
        allowed_sem: institutionDrive.allowed_sem,
        cgpa_greater_than: institutionDrive.cgpa_greater_than,
        is_required: institutionDrive.is_required,
      })
    );

    // Map public drives without institution-specific metadata
    const publicMapped = publicDrives.map((drive: any) => ({
      ...drive,
      institution_drive_id: null,
      allowed_sem: null,
      cgpa_greater_than: null,
      is_required: false,
    }));

    // Combine and return
    const combined = [...institutionMapped, ...publicMapped];

    // Attach global enrollment counts for drives
    if (combined.length > 0) {
      const driveIds = combined.map((d: any) => d.id).filter(Boolean);

      const counts = await prisma.candidateDrive.groupBy({
        by: ["drive_id"],
        where: {
          drive_id: { in: driveIds },
        },
        _count: { _all: true },
      });

      const countsMap: Record<string, number> = {};
      counts.forEach((c: any) => {
        countsMap[c.drive_id] = c._count?._all ?? 0;
      });

      return combined.map((item: any) => ({
        ...item,
        enrolled_count: countsMap[item.id] ?? 0,
      }));
    }

    return combined;
  }

  /**
   * Fetch a drive with detailed relations: drive_activities (with activity),
   * institution_drives (with institution), candidate_drives, candidate_activities, and payments.
   */
  static async getDriveWithDetails(driveId: string) {
    return prisma.drive.findUnique({
      where: { id: driveId },
      include: {
        drive_activities: {
          include: {
            activity: true,
          },
        },
        institution_drives: {
          include: {
            institution: true,
          },
        },
        candidate_drives: true,
        candidate_activities: true,
        departments: true,
      },
    });
  }

  /**
   * Return true if the drive's applies array includes the Public audience id.
   */
  static async isPublicDrive(driveId: string): Promise<boolean> {
    const publicAudience = await prisma.audienceType.findFirst({
      where: { name: "Public" },
    });

    if (!publicAudience) {
      return false;
    }

    const drive = await prisma.drive.findUnique({
      where: { id: driveId },
      select: { applies: true },
    });

    return drive?.applies.includes(publicAudience.id) ?? false;
  }

  /**
   * Create or update a drive record. Returns true on success.
   */
  static async createOrUpdate(
    data: Partial<Drive> & {
      departments?: string[];
      stages?: string[]; // array of activity IDs
      pre_requisities?: string[]; // array of activity IDs
    }
  ): Promise<boolean> {
    try {
      if (data.id) {
        // Update existing drive
        await prisma.drive.update({
          where: { id: data.id },
          data: {
            name: data.name,
            description: data.description,
            available_positions: data.available_positions,
            company_details: data.company_details,
            requirements: data.requirements,
            company_name: data.company_name,
            keypoints: data.keypoints || [],
            image: data.image ?? "",
            documents: data.documents || [],
            baseprice: data.baseprice as any,
            applies: data.applies || [],
            tag: data.tag,
            allowed_sem: data.allowed_sem,
            cgpa_greater_than: data.cgpa_greater_than,
            status: data.status,
            updated_date: new Date(),
            bg_color: data.bg_color,

            // Update Departments
            departments: data.departments
              ? {
                  set: [], // remove existing relations
                  connect: data.departments.map((id) => ({ id })),
                }
              : undefined,

            // Update Stages & Pre-requisites using DriveActivity
            drive_activities: {
              deleteMany: {}, // remove old links
              create: [
                ...(data.stages?.map((activityId) => ({
                  activity: { connect: { id: activityId } },
                  type: DriveActivityType.STAGE,
                  baseprice: 0,
                })) || []),
                ...(data.pre_requisities?.map((activityId) => ({
                  activity: { connect: { id: activityId } },
                  type: DriveActivityType.PREREQUISITE,
                  baseprice: 0,
                })) || []),
              ],
            },
          },
        });
      } else {
        // Create new drive
        await prisma.drive.create({
          data: {
            name: data.name!,
            description: data.description!,
            available_positions: data.available_positions!,
            company_details: data.company_details!,
            requirements: data.requirements!,
            company_name: data.company_name,
            keypoints: data.keypoints || [],
            image: data.image ?? "",
            documents: data.documents || [],
            baseprice: data.baseprice as any,
            applies: data.applies || [],
            tag: data.tag,
            allowed_sem: data.allowed_sem,
            cgpa_greater_than: data.cgpa_greater_than,
            status: data.status || "pending",
            bg_color: data.bg_color,

            // Connect departments
            departments: data.departments
              ? {
                  connect: data.departments.map((id) => ({ id })),
                }
              : undefined,

            // Create stages & pre-requisites using DriveActivity
            drive_activities: {
              create: [
                ...(data.stages?.map((activityId) => ({
                  activity: { connect: { id: activityId } },
                  type: DriveActivityType.STAGE,
                  baseprice: 0,
                })) || []),
                ...(data.pre_requisities?.map((activityId) => ({
                  activity: { connect: { id: activityId } },
                  type: DriveActivityType.PREREQUISITE,
                  baseprice: 0,
                })) || []),
              ],
            },
          },
        });
      }

      return true;
    } catch (error) {
      console.error("Error in createOrUpdate Drive:", error);
      return false;
    }
  }
}
