import { prisma } from "@/lib/prisma";
import { InstitutionStatus } from "@prisma/client";

export class InstitutionService {
  /**
   * Fetch institutions (id,name,city,state,status,contact info) optionally filtering to verified only.
   */
  static async getAll(includeUnverified = false) {
    return prisma.institution.findMany({
      select: {
        id: true,
        name: true,
        city: true,
        state: true,
        status: true,
        contact_person: true,
        contact_phone_details: true,
        updated_date: true,
      },
      where: includeUnverified
        ? undefined
        : {
            status: InstitutionStatus.verified,
          },
      orderBy: {
        name: "asc",
      },
      cacheStrategy: {
        swr: 60,
        ttl: 60,
      },
    });
  }

  /**
   * Fetch institutions with counts (drives, candidates, activities); optional verified filter.
   */
  static async getAllByCount(includeUnverified = false) {
    return prisma.institution.findMany({
      select: {
        id: true,
        name: true,
        city: true,
        state: true,
        status: true,
        contact_person: true,
        contact_phone_details: true,
        updated_date: true,
        // counts
        _count: {
          select: {
            institution_drives: true, // number of drives
            candidates: true, // number of students
            institution_activities: true,
          },
        },
      },
      where: includeUnverified
        ? undefined
        : {
            status: InstitutionStatus.verified,
          },
      orderBy: {
        name: "asc",
      },
      cacheStrategy: {
        swr: 60,
        ttl: 60,
      },
    });
  }

  /**
   * Fetch an institution by id including institution_activities and institution_drives.
   */
  static async getById(id: string) {
    return prisma.institution.findUnique({
      where: { id },
      include: {
        institution_activities: true,
        institution_drives: true,
      },
    });
  }

  /**
   * Create an institution record.
   */
  static async create(data: {
    name: string;
    city: string;
    state: string;
    status?: InstitutionStatus;
    contact_person?: string;
    contact_phone_details?: string;
  }) {
    return prisma.institution.create({
      data,
    });
  }

  /**
   * Update institution fields by id.
   */
  static async update(
    id: string,
    data: Partial<{
      name: string;
      city: string;
      state: string;
      status: InstitutionStatus;
    }>
  ) {
    return prisma.institution.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete an institution by id.
   */
  static async delete(id: string) {
    return prisma.institution.delete({
      where: { id },
    });
  }

  /**
   * Mark an institution as verified.
   */
  static async verify(id: string) {
    return this.update(id, { status: InstitutionStatus.verified });
  }

  /**
   * Get an institution by id if provided, otherwise create a new unverified institution with the given name.
   */
  static async getOrCreate(data: { id?: string; name: string }) {
    if (data.id) {
      const existing = await this.getById(data.id);
      if (existing) return existing;
    }

    // Create new institution with default values
    return this.create({
      name: data.name,
      city: "",
      state: "",
      status: InstitutionStatus.unverified,
    });
  }

  static async getCollegeAdminDetails(institutionId: string) {
    // 1️⃣ Number of drives by institution
    const drivesCount = await prisma.institutionDrive.count({
      where: { institution_id: institutionId },
    });

    // 2️⃣ Number of activities by institution
    const activitiesCount = await prisma.institutionActivity.count({
      where: { institution_id: institutionId },
    });

    // 3️⃣ Candidates grouped by department, split by verified/unverified
    const candidatesByDept = await prisma.department.findMany({
      where: {
        candidates: {
          some: {
            institution_id: institutionId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        candidates: {
          select: {
            id: true,
            status: true,
            user_id: true,
          },
        },
      },
      cacheStrategy: {
        swr: 60,
        ttl: 60,
      },
    });

    const candidateStats = candidatesByDept.map((dept) => {
      const total = dept.candidates.length;
      const verified = dept.candidates.filter(
        (c) => c.status === "verified"
      ).length;
      const unverified = dept.candidates.filter(
        (c) => c.status === "unverified"
      ).length;
      const usersLinked = dept.candidates.map((c) => c.user_id).length;

      return {
        departmentId: dept.id,
        departmentName: dept.name,
        totalCandidates: total,
        verifiedCandidates: verified,
        unverifiedCandidates: unverified,
        usersLinked: usersLinked,
      };
    });

    // 4️⃣ List of unverified students
    const unverifiedStudents = await prisma.candidate.findMany({
      where: {
        institution_id: institutionId,
        status: "unverified",
      },
      select: {
        id: true,
        student_id: true,
        user_id: true,
        semester: true,
        department_id: true,
        department: true,
        user: { select: { email: true, first_name: true, last_name: true } },
      },
      cacheStrategy: {
        swr: 60,
        ttl: 60,
      },
    });

    return {
      drivesCount,
      activitiesCount,
      candidateStats,
      unverifiedStudents,
    };
  }
}
