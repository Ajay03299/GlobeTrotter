import { prisma } from "./prisma";

export async function createPublicShare(tripId: string, slug?: string) {
  // Generate a slug if not provided
  const shareSlug = slug || generateSlug();

  return prisma.publicShare.create({
    data: {
      tripId,
      slug: shareSlug,
    },
  });
}

export async function getPublicShare(slug: string) {
  return prisma.publicShare.findUnique({
    where: { slug },
    include: {
      trip: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
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
      },
    },
  });
}

export async function deletePublicShare(tripId: string) {
  return prisma.publicShare.delete({
    where: { tripId },
  });
}

export async function getTripPublicShare(tripId: string) {
  return prisma.publicShare.findUnique({
    where: { tripId },
  });
}

// Helper to generate a random slug
function generateSlug(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let slug = "";
  for (let i = 0; i < 8; i++) {
    slug += chars[Math.floor(Math.random() * chars.length)];
  }
  return slug;
}
