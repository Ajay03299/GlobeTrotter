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
