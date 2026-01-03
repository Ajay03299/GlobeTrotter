import { prisma } from "./prisma";
import { addCostSchema } from "./schemas";

export async function addCost(input: unknown) {
  const data = addCostSchema.parse(input);

  return prisma.costItem.create({
    data,
  });
}

export async function getTripCostSummary(tripId: string) {
  return prisma.costItem.groupBy({
    by: ["category"],
    where: { tripId },
    _sum: { amount: true },
  });
}
