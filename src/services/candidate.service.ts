import { prisma } from "@/lib/prisma";
import {
  Gender,
  EnrollmentStatus,
  ActivityCategory,
  DriveActivityType,
} from "@prisma/client";
import { includes } from "zod";

export class CandidateService {
  static async getAll() {
    return prisma.candidate.findMany({
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            role: true,
            status: true,
          },
        },
        institution: {
          select: {
            id: true,
            name: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      cacheStrategy: {
        swr: 60,
        ttl: 60,
      },
    });
  }

  /**
   * Fetch a candidate by id including user, institution, and department relations.
   */
  static async getById(id: string) {
    return prisma.candidate.findUnique({
      where: { id },
      include: {
        user: true,
        institution: true,
        department: true,
      },
    });
  }

  /**
   * Fetch a candidate by user id including user, institution and department.
   */
  static async getByUserId(userId: string) {
    return prisma.candidate.findFirst({
      where: { user_id: userId },
      include: {
        user: true,
        institution: true,
        department: true,
      },
      cacheStrategy: {
        swr: 60,
        ttl: 60,
      },
    });
  }

  /**
   * Find a user by email and return their first candidate record plus the user object, or null.
   */
  static async getByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        candidates: {
          include: {
            institution: true,
            department: true,
          },
        },
      },
    });

    if (!user || user.candidates.length === 0) {
      return null;
    }

    return {
      ...user.candidates[0],
      user,
    };
  }

  /**
   * Create a minimal user and placeholder candidate (used before onboarding); returns both.
   */
  static async createWithEmail(email: string) {
    return prisma.$transaction(async (tx: any) => {
      // Create user with minimal data
      const user = await tx.user.create({
        data: {
          email,
          first_name: "", // Will be updated during onboarding
          last_name: "", // Will be updated during onboarding
          type: "candidate",
          status: "unverified",
        },
      });

      // Create candidate record with placeholder data
      const candidate = await tx.candidate.create({
        data: {
          user_id: user.id,
          student_id: "", // Will be updated during onboarding
          age: 0, // Will be updated during onboarding
          gender: Gender.others, // Will be updated during onboarding
          institution_id: "", // Will be updated during onboarding
          department_id: "", // Will be updated during onboarding
          semester: 0, // Will be updated during onboarding
        },
        include: {
          user: true,
          institution: true,
          department: true,
        },
      });

      return { user, candidate };
    });
  }

  /**
   * Create a candidate record and include related user, institution and department.
   */
  static async create(data: {
    user_id: string;
    student_id: string;
    age: number;
    gender: Gender;
    institution_id: string;
    department_id: string;
    semester: number;
    bio?: string;
    cgpa?: number;
    hobbies?: string[];
  }) {
    return prisma.candidate.create({
      data,
      include: {
        user: true,
        institution: true,
        department: true,
      },
    });
  }

  /**
   * Update candidate fields by id.
   */
  static async update(
    id: string,
    data: Partial<{
      student_id: string;
      age: number;
      gender: Gender;
      institution_id: string;
      department_id: string;
      semester: number;
      bio: string;
      resume: string;
      additional_documents: string[];
      cgpa: number;
      hobbies: string[];
      certifications: string[];
    }>
  ) {
    return prisma.candidate.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a candidate by id.
   */
  static async delete(id: string) {
    return prisma.candidate.delete({
      where: { id },
    });
  }

  /**
   * Find a candidate by student_id including related user, institution and department.
   */
  static async getByStudentId(studentId: string) {
    return prisma.candidate.findFirst({
      where: { student_id: studentId },
      include: {
        user: true,
        institution: true,
        department: true,
      },
      cacheStrategy: {
        swr: 60,
        ttl: 60,
      },
    });
  }

  /**
   * Complete onboarding by updating the user and nested candidate fields atomically.
   */
  static async completeOnboarding(data: {
    userId: string;
    studentId: string;
    firstName: string;
    lastName: string;
    age: number;
    gender: Gender;
    semester: number;
    institutionId: string;
    departmentId: string;
  }) {
    return prisma.user.update({
      where: { id: data.userId },
      data: {
        first_name: data.firstName,
        last_name: data.lastName,
        status: "completed",
        candidates: {
          update: {
            where: { student_id: data.studentId },
            data: {
              age: data.age,
              gender: data.gender,
              semester: data.semester,
              institution_id: data.institutionId,
              department_id: data.departmentId,
            },
          },
        },
      },
    });
  }

  /**
   * Update user and create a candidate record in the same update (onboarding flow).
   */
  static async createWithOnboarding(data: {
    userId: string;
    studentId: string;
    firstName: string;
    lastName: string;
    age: number;
    gender: Gender;
    semester: number;
    institutionId: string;
    departmentId: string;
  }) {
    return prisma.user.update({
      where: { id: data.userId },
      data: {
        first_name: data.firstName,
        last_name: data.lastName,
        status: "completed",
        candidates: {
          create: {
            age: data.age,
            gender: data.gender,
            student_id: data.studentId,
            semester: data.semester,
            institution_id: data.institutionId,
            department_id: data.departmentId,
          },
        },
      },
    });
  }

  /**
   * Fetch the user and their candidate profile by user id.
   */
  static async getProfileByUserId(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) return null;

    const candidate = await prisma.candidate.findUnique({
      where: { user_id: user.id },
    });

    return { user, candidate };
  }

  /**
   * Update both user and candidate records in a transaction (profile update).
   */
  static async updateProfile(data: {
    userId: string;
    candidateId: string;
    firstName: string;
    lastName: string;
    age: number;
    gender: Gender;
    studentId: string;
    semester: number;
    institutionId: string;
    departmentId: string;
    bio?: string;
    cgpa?: number;
    resume?: string;
    additionalDocuments?: string[];
  }) {
    return prisma.$transaction([
      prisma.user.update({
        where: { id: data.userId },
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
        },
      }),
      prisma.candidate.update({
        where: { id: data.candidateId },
        data: {
          age: data.age,
          gender: data.gender,
          student_id: data.studentId,
          semester: data.semester,
          institution_id: data.institutionId,
          department_id: data.departmentId,
          bio: data.bio,
          cgpa: data.cgpa,
          resume: data.resume,
          additional_documents: data.additionalDocuments,
        },
      }),
    ]);
  }

  /**
   * Get enrolled drives for a candidate
   */
  static async getEnrolledDrives(candidateId: string) {
    return prisma.candidateDrive.findMany({
      where: {
        candidate_id: candidateId,
      },
      include: {
        drive: {
          include: {
            drive_activities: {
              include: {
                activity: true,
              },
            },
            _count: { select: { candidate_drives: true } },
          },
        },
      },
      orderBy: {
        application_date: "desc",
      },
      cacheStrategy: {
        swr: 60,
        ttl: 60,
      },
    });
  }

  /**
   * Get enrolled activities for a candidate
   */
  static async getEnrolledActivities(candidateId: string) {
    return prisma.candidateActivity.findMany({
      where: {
        candidate_id: candidateId,
      },
      include: {
        activity: {
          include: {
            _count: { select: { candidate_activities: true } },
          },
        },
        drive: true,
      },
      orderBy: {
        enrollment_date: "desc",
      },
      cacheStrategy: {
        swr: 60,
        ttl: 60,
      },
    });
  }

  /**
   * Enroll a candidate in an activity.
   * Idempotent: if a candidate_activity already exists for the pair, return it.
   */
  static async enrollInActivity(
    candidateId: string,
    activityId: string,
    opts?: { driveId?: string }
  ) {
    // Check if already enrolled
    const existing = await prisma.candidateActivity.findUnique({
      where: {
        candidate_id_activity_id: {
          candidate_id: candidateId,
          activity_id: activityId,
        },
      },
    });

    if (existing) return existing;

    // Create new enrollment
    return prisma.candidateActivity.create({
      data: {
        candidate_id: candidateId,
        activity_id: activityId,
        drive_id: opts?.driveId ?? null,
        enrollment_date: new Date(),
        enrollment_status: EnrollmentStatus.enrolled,
      },
    });
  }

  /**
   * Fetch a single candidate_activity (composite key) including activity and drive.
   */
  static async getCandidateActivity(candidateId: string, activityId: string) {
    return prisma.candidateActivity.findUnique({
      where: {
        candidate_id_activity_id: {
          candidate_id: candidateId,
          activity_id: activityId,
        },
      },
    });
  }

  /**
   * Enroll a candidate in a drive; create candidate_drive and candidate_activity rows (transactional).
   * Ensures idempotency (creates missing candidate_activity rows with skipDuplicates).
   */
  static async enrollInDrive(candidateId: string, driveId: string) {
    // Check if already enrolled
    const existing = await prisma.candidateDrive.findUnique({
      where: {
        candidate_id_drive_id: {
          candidate_id: candidateId,
          drive_id: driveId,
        },
      },
      include: {
        drive: {
          include: {
            drive_activities: true,
          },
        },
      },
    });

    if (existing) {
      // Ensure candidate_activity rows exist for any drive activities (idempotent)
      const activities = existing.drive?.drive_activities || [];
      if (activities.length > 0) {
        await prisma.candidateActivity.createMany({
          data: activities.map((da: any) => ({
            candidate_id: candidateId,
            activity_id: da.activity_id,
            drive_id: driveId,
            enrollment_date: new Date(),
            enrollment_status: EnrollmentStatus.enrolled,
          })),
          skipDuplicates: true,
        });
      }

      return existing;
    }

    // Enroll in drive and create candidate_activity rows for drive activities in a transaction
    const driveWithActivities = await prisma.drive.findUnique({
      where: { id: driveId },
      include: { drive_activities: true },
    });
    // Check prerequisites: all drive_activities of type PREREQUISITE must be completed by candidate
    const prereqActivities = (
      driveWithActivities?.drive_activities || []
    ).filter((da: any) => String(da.type) === DriveActivityType.PREREQUISITE);
    if (prereqActivities.length > 0) {
      const prereqIds = prereqActivities.map((da: any) => da.activity_id);
      const completed = await prisma.candidateActivity.findMany({
        where: {
          candidate_id: candidateId,
          activity_id: { in: prereqIds },
          enrollment_status: EnrollmentStatus.completed,
        },
        select: { activity_id: true },
        cacheStrategy: {
          swr: 60,
          ttl: 60,
        },
      });
      const completedIds = new Set(completed.map((c: any) => c.activity_id));
      const missing = prereqIds.filter((id: string) => !completedIds.has(id));
      if (missing.length > 0) {
        // load activity names for the missing ids so the client can show friendly names
        const missingActivities = await prisma.activity.findMany({
          where: { id: { in: missing } },
          select: { id: true, name: true },
          cacheStrategy: {
            swr: 60,
            ttl: 60,
          },
        });

        // return a structured error so the route can return a 400 with details
        return {
          error: "prerequisite_not_completed",
          missing: missingActivities,
          message:
            "You must complete prerequisite activities before enrolling in this drive.",
        };
      }
    }

    const activityRows = (driveWithActivities?.drive_activities || []).map(
      (da: any) => ({
        candidate_id: candidateId,
        activity_id: da.activity_id,
        drive_id: driveId,
        enrollment_date: new Date(),
        enrollment_status: EnrollmentStatus.enrolled,
      })
    );

    const result = await prisma.$transaction(async (tx) => {
      const cd = await tx.candidateDrive.create({
        data: {
          candidate_id: candidateId,
          drive_id: driveId,
          enrollment_status: EnrollmentStatus.enrolled,
        },
      });

      let candidate_activities = null;
      if (activityRows.length > 0) {
        // createMany with skipDuplicates to avoid unique constraint errors
        candidate_activities = await tx.candidateActivity.createMany({
          data: activityRows,
          skipDuplicates: true,
        });
      }

      return { driveId, candidate_drive: cd, candidate_activities };
    });

    return result;
  }

  /**
   * Check if a candidate is enrolled in a drive
   */
  static async isEnrolledInDrive(candidateId: string, driveId: string) {
    const rec = await prisma.candidateDrive.findUnique({
      where: {
        candidate_id_drive_id: {
          candidate_id: candidateId,
          drive_id: driveId,
        },
      },
    });

    return !!rec;
  }

  /**
   * Fetch a candidate_drive (composite key) including drive.drive_activities.activity,
   * and fetch candidate_activity rows for the candidate + drive (each includes activity).
   */
  static async getCandidateDrive(candidateId: string, driveId: string) {
    const candidateDrive = await prisma.candidateDrive.findUnique({
      where: {
        candidate_id_drive_id: {
          candidate_id: candidateId,
          drive_id: driveId,
        },
      },
      include: {
        drive: {
          include: {
            drive_activities: {
              include: {
                activity: true,
              },
            },
          },
        },
      },
    });

    if (!candidateDrive) return null;

    const candidateActivities = await prisma.candidateActivity.findMany({
      where: {
        candidate_id: candidateId,
        drive_id: driveId,
      },
      include: {
        activity: true,
      },
      cacheStrategy: {
        swr: 60,
        ttl: 60,
      },
    });

    return {
      candidate_drive: candidateDrive,
      candidate_activities: candidateActivities,
    };
  }
}
