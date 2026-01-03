import { prisma } from "./prisma";
import { createActivityMasterSchema } from "./schemas";

export async function searchActivities(query: string, cityId?: string) {
  return prisma.activity.findMany({
    where: {
      AND: [
        cityId ? { cityId } : {},
        {
          OR: [
            { name: { contains: query } },
            { description: { contains: query } },
          ],
        },
      ],
    },
    include: {
      city: true,
    },
    take: 20,
  });
}

export async function getActivityById(activityId: string) {
  return prisma.activity.findUnique({
    where: { id: activityId },
    include: {
      city: true,
    },
  });
}

export async function createActivityMaster(input: unknown) {
  const data = createActivityMasterSchema.parse(input);

  return prisma.activity.create({
    data,
  });
}

export async function getActivitiesByCity(cityId: string) {
  return prisma.activity.findMany({
    where: { cityId },
    orderBy: { name: "asc" },
  });
}

export async function getActivitiesByType(type: string, cityId?: string) {
  return prisma.activity.findMany({
    where: {
      type: type as any,
      ...(cityId ? { cityId } : {}),
    },
    orderBy: { name: "asc" },
  });
}
