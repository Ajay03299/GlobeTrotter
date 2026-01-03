import { prisma } from "./prisma";
import { addActivitySchema } from "./schemas";

export async function addActivityToStop(input: unknown) {
  const data = addActivitySchema.parse(input);

  return prisma.tripActivity.create({
    data,
  });
}
