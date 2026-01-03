import { prisma } from "./prisma";
import { addActivitySchema } from "./schemas";

export async function addActivityToStop(input: unknown) {
  const data = addActivitySchema.parse(input);

  return prisma.tripActivity.create({
    data,
  });
}

export async function updateActivity(activityId: string, input: unknown) {
  const data = addActivitySchema.partial().parse(input);

  return prisma.tripActivity.update({
    where: { id: activityId },
    data,
  });
}

export async function deleteActivity(activityId: string) {
  return prisma.tripActivity.delete({
    where: { id: activityId },
  });
}

export async function getStopActivities(stopId: string) {
  return prisma.tripActivity.findMany({
    where: { stopId },
    include: { activity: true },
    orderBy: { position: "asc" },
  });
}

export async function reorderActivities(
  stopId: string,
  orderedActivityIds: string[]
) {
  return prisma.$transaction(
    orderedActivityIds.map((id, index) =>
      prisma.tripActivity.update({
        where: { id },
        data: { position: index },
      })
    )
  );
}
