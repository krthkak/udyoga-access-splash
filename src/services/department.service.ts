import { prisma } from "@/lib/prisma";

export class DepartmentService {
  /**
   * Fetch all departments (id, name, short_name, full_name).
   */
  static async getAll() {
    return prisma.department.findMany({
      select: {
        id: true,
        name: true,
        short_name: true,
        full_name: true,
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
   * Fetch a department by id.
   */
  static async getById(id: string) {
    return prisma.department.findUnique({
      where: { id },
    });
  }

  /**
   * Create a department record.
   */
  static async create(data: {
    name: string;
    short_name: string;
    full_name: string;
    desc?: string;
  }) {
    return prisma.department.create({
      data,
    });
  }

  /**
   * Update a department by id.
   */
  static async update(
    id: string,
    data: Partial<{
      name: string;
      short_name: string;
      full_name: string;
      desc: string;
    }>
  ) {
    return prisma.department.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a department by id.
   */
  static async delete(id: string) {
    return prisma.department.delete({
      where: { id },
    });
  }
}
