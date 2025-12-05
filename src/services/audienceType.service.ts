import { prisma } from "@/lib/prisma";

export class AudienceTypeService {
  /**
   * Fetch all audience types and return them mapped to { value: id, label: name } for UI selects.
   */
  static async getAll() {
    return (
      await prisma.audienceType.findMany({
        cacheStrategy: {
          swr: 60,
          ttl: 60,
        },
      })
    ).map((audienceType) => ({
      value: audienceType.id,
      label: audienceType.name,
    }));
  }
}
