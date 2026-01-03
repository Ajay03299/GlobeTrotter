import { prisma } from "./prisma";
import { createTripSchema, tripIdSchema } from "./schemas";

export async function createTrip(input: unknown) {
  const data = createTripSchema.parse(input);

  return prisma.trip.create({
    data,
  });
}

export async function getTripById(input: unknown) {
  const { tripId } = tripIdSchema.parse(input);

  return prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      stops: {
        orderBy: { position: "asc" },
        include: {
          city: true,
          activities: {
            include: { activity: true },
            orderBy: { position: "asc" },
          },
        },
      },
      costItems: true,
    },
  });
}

export async function getUserTrips(userId: string) {
  return prisma.trip.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateTrip(tripId: string, input: unknown) {
  const data = createTripSchema.partial().parse(input);

  return prisma.trip.update({
    where: { id: tripId },
    data,
  });
}

export async function deleteTrip(tripId: string) {
  return prisma.trip.delete({
    where: { id: tripId },
  });
}

export async function toggleTripPublic(tripId: string) {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    select: { isPublic: true },
  });

  return prisma.trip.update({
    where: { id: tripId },
    data: { isPublic: !trip?.isPublic },
  });
}
