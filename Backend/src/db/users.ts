import { prisma } from "./prisma";
import { createUserSchema, updateUserSchema } from "./schemas";

export async function createUser(input: unknown) {
  const data = createUserSchema.parse(input);

  return prisma.user.create({
    data,
  });
}

export async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      createdAt: true,
    },
  });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function updateUser(userId: string, input: unknown) {
  const data = updateUserSchema.parse(input);

  return prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      createdAt: true,
    },
  });
}

export async function deleteUser(userId: string) {
  return prisma.user.delete({
    where: { id: userId },
  });
}
