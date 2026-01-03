import { prisma } from "./prisma";
import { createCitySchema } from "./schemas";

export async function searchCities(query: string) {
  return prisma.city.findMany({
    where: {
      OR: [
        { name: { contains: query } },
        { country: { contains: query } },
      ],
    },
    orderBy: [
      { popularity: "desc" },
      { name: "asc" },
    ],
    take: 20,
  });
}

export async function getCityById(cityId: string) {
  return prisma.city.findUnique({
    where: { id: cityId },
    include: {
      activities: true,
    },
  });
}

export async function getCityBySlug(slug: string) {
  return prisma.city.findUnique({
    where: { slug },
    include: {
      activities: true,
    },
  });
}

export async function createCity(input: unknown) {
  const data = createCitySchema.parse(input);

  return prisma.city.create({
    data,
  });
}

export async function getPopularCities(limit: number = 10) {
  return prisma.city.findMany({
    orderBy: { popularity: "desc" },
    take: limit,
  });
}
