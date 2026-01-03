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

export async function getTripCosts(tripId: string) {
  return prisma.costItem.findMany({
    where: { tripId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getStopCosts(stopId: string) {
  return prisma.costItem.findMany({
    where: { stopId },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateCost(costId: string, input: unknown) {
  const data = addCostSchema.partial().parse(input);

  return prisma.costItem.update({
    where: { id: costId },
    data,
  });
}

export async function deleteCost(costId: string) {
  return prisma.costItem.delete({
    where: { id: costId },
  });
}
