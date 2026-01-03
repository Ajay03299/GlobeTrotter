import { prisma } from "./prisma";
import { createStopSchema } from "./schemas";

export async function addStop(input: unknown) {
  const data = createStopSchema.parse(input);

  return prisma.stop.create({
    data,
  });
}

export async function reorderStops(
  tripId: string,
  orderedStopIds: string[]
) {
  return prisma.$transaction(
    orderedStopIds.map((id, index) =>
      prisma.stop.update({
        where: { id },
        data: { position: index },
      })
    )
  );
}

export async function updateStop(stopId: string, input: unknown) {
  const data = createStopSchema.partial().parse(input);

  return prisma.stop.update({
    where: { id: stopId },
    data,
  });
}

export async function deleteStop(stopId: string) {
  return prisma.stop.delete({
    where: { id: stopId },
  });
}

export async function getTripStops(tripId: string) {
  return prisma.stop.findMany({
    where: { tripId },
    include: {
      city: true,
      activities: {
        include: { activity: true },
        orderBy: { position: "asc" },
      },
    },
    orderBy: { position: "asc" },
  });
}
