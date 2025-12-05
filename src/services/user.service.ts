import { prisma } from "@/lib/prisma";

export class UserService {
  /**
   * Fetch a user by id including related candidates.
   */
  static async getById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        candidates: true,
      },
    });
  }

  /**
   * Fetch a user by admin.
   */
  static async getByIdAdmin(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Fetch a user by college-admin.
   */
  static async getByIdCollegeAdmin(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Fetch a user by email including related candidates.
   */
  static async getByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        candidates: true,
      },
    });
  }

  /**
   * Create a new user record.
   */
  static async create(data: {
    email: string;
    first_name?: string;
    last_name?: string;
    role?: string;
    status?: string;
    name?: string;
    image?: string;
  }) {
    return prisma.user.create({
      data,
    });
  }

  /**
   * Update user fields by id.
   */
  static async update(
    id: string,
    data: Partial<{
      first_name: string;
      last_name: string;
      name: string;
      email: string;
      role: string;
      status: string;
      image: string;
    }>
  ) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a user by id.
   */
  static async delete(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  }
}
