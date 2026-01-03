import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.tripActivity.deleteMany();
  await prisma.tripActivity.deleteMany();
  await prisma.costItem.deleteMany();
  await prisma.publicShare.deleteMany();
  await prisma.stop.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.city.deleteMany();
  await prisma.user.deleteMany();

  console.log("Cleared existing data");

  // Create users
  const user1 = await prisma.user.create({
    data: {
      email: "john@example.com",
      name: "John Doe",
      password: await bcryptjs.hash("password123", 10),
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "jane@example.com",
      name: "Jane Smith",
      password: await bcryptjs.hash("password123", 10),
    },
  });

  console.log("Created users");

  // Create cities
  const cities = await Promise.all([
    prisma.city.create({
      data: {
        name: "Paris",
        country: "France",
        slug: "paris-france",
        lat: 48.8566,
        lng: 2.3522,
        costIndex: 85,
        popularity: 95,
      },
    }),
    prisma.city.create({
      data: {
        name: "Tokyo",
        country: "Japan",
        slug: "tokyo-japan",
        lat: 35.6762,
        lng: 139.6503,
        costIndex: 90,
        popularity: 92,
      },
    }),
    prisma.city.create({
      data: {
        name: "New York",
        country: "USA",
        slug: "new-york-usa",
        lat: 40.7128,
        lng: -74.006,
        costIndex: 95,
        popularity: 98,
      },
    }),
    prisma.city.create({
      data: {
        name: "Barcelona",
        country: "Spain",
        slug: "barcelona-spain",
        lat: 41.3874,
        lng: 2.1686,
        costIndex: 75,
        popularity: 88,
      },
    }),
    prisma.city.create({
      data: {
        name: "Bangkok",
        country: "Thailand",
        slug: "bangkok-thailand",
        lat: 13.7563,
        lng: 100.5018,
        costIndex: 40,
        popularity: 85,
      },
    }),
  ]);

  console.log("Created cities");

  // Create activities
  const activities = await Promise.all([
    prisma.activity.create({
      data: {
        cityId: cities[0].id,
        name: "Eiffel Tower Visit",
        description: "Visit the iconic Eiffel Tower",
        type: "SIGHTSEEING",
        avgCost: 25,
        durationMin: 120,
      },
    }),
    prisma.activity.create({
      data: {
        cityId: cities[0].id,
        name: "Louvre Museum",
        description: "Explore the world's largest art museum",
        type: "CULTURE",
        avgCost: 20,
        durationMin: 240,
      },
    }),
    prisma.activity.create({
      data: {
        cityId: cities[1].id,
        name: "Senso-ji Temple",
        description: "Visit the famous Buddhist temple",
        type: "CULTURE",
        avgCost: 5,
        durationMin: 90,
      },
    }),
    prisma.activity.create({
      data: {
        cityId: cities[1].id,
        name: "Sushi Making Class",
        description: "Learn to make traditional sushi",
        type: "FOOD",
        avgCost: 80,
        durationMin: 180,
      },
    }),
    prisma.activity.create({
      data: {
        cityId: cities[2].id,
        name: "Statue of Liberty",
        description: "Visit the iconic statue",
        type: "SIGHTSEEING",
        avgCost: 20,
        durationMin: 180,
      },
    }),
    prisma.activity.create({
      data: {
        cityId: cities[2].id,
        name: "Broadway Show",
        description: "Watch a Broadway musical",
        type: "CULTURE",
        avgCost: 120,
        durationMin: 180,
      },
    }),
    prisma.activity.create({
      data: {
        cityId: cities[3].id,
        name: "Sagrada Familia",
        description: "Visit Gaudí's masterpiece",
        type: "CULTURE",
        avgCost: 30,
        durationMin: 120,
      },
    }),
    prisma.activity.create({
      data: {
        cityId: cities[4].id,
        name: "Thai Massage",
        description: "Experience traditional Thai massage",
        type: "OTHER",
        avgCost: 10,
        durationMin: 90,
      },
    }),
  ]);

  console.log("Created activities");

  // Create a trip for user1
  const trip1 = await prisma.trip.create({
    data: {
      userId: user1.id,
      name: "European Adventure",
      description: "A wonderful journey through Europe",
      startDate: new Date("2024-06-01"),
      endDate: new Date("2024-06-15"),
      isPublic: true,
    },
  });

  // Create stops for trip1
  const stop1 = await prisma.stop.create({
    data: {
      tripId: trip1.id,
      cityId: cities[0].id,
      startDate: new Date("2024-06-01"),
      endDate: new Date("2024-06-05"),
      position: 1,
      notes: "Enjoying the city of lights",
    },
  });

  const stop2 = await prisma.stop.create({
    data: {
      tripId: trip1.id,
      cityId: cities[3].id,
      startDate: new Date("2024-06-05"),
      endDate: new Date("2024-06-10"),
      position: 2,
      notes: "Exploring Gaudí's architecture",
    },
  });

  // Add activities to stops
  await prisma.tripActivity.create({
    data: {
      stopId: stop1.id,
      activityId: activities[0].id,
      scheduledAt: new Date("2024-06-02"),
      position: 1,
    },
  });

  await prisma.tripActivity.create({
    data: {
      stopId: stop1.id,
      activityId: activities[1].id,
      scheduledAt: new Date("2024-06-03"),
      position: 2,
    },
  });

  await prisma.tripActivity.create({
    data: {
      stopId: stop2.id,
      activityId: activities[6].id,
      scheduledAt: new Date("2024-06-06"),
      position: 1,
    },
  });

  // Add cost items
  await prisma.costItem.create({
    data: {
      tripId: trip1.id,
      stopId: stop1.id,
      category: "STAY",
      amount: 150,
      currency: "EUR",
      description: "Hotel in Paris",
    },
  });

  await prisma.costItem.create({
    data: {
      tripId: trip1.id,
      stopId: stop1.id,
      category: "ACTIVITY",
      amount: 25,
      currency: "EUR",
      description: "Eiffel Tower ticket",
    },
  });

  // Create public share for trip1
  await prisma.publicShare.create({
    data: {
      tripId: trip1.id,
      slug: "european-adventure-2024",
    },
  });

  console.log("Created trip and related data");

  // Create a trip for user2
  const trip2 = await prisma.trip.create({
    data: {
      userId: user2.id,
      name: "Asian Explorer",
      description: "Exploring the wonders of Asia",
      startDate: new Date("2024-07-01"),
      endDate: new Date("2024-07-20"),
      isPublic: false,
    },
  });

  const stop3 = await prisma.stop.create({
    data: {
      tripId: trip2.id,
      cityId: cities[1].id,
      startDate: new Date("2024-07-01"),
      endDate: new Date("2024-07-10"),
      position: 1,
      notes: "Traditional and modern Tokyo",
    },
  });

  const stop4 = await prisma.stop.create({
    data: {
      tripId: trip2.id,
      cityId: cities[4].id,
      startDate: new Date("2024-07-10"),
      endDate: new Date("2024-07-20"),
      position: 2,
      notes: "Relaxation in Thailand",
    },
  });

  await prisma.tripActivity.create({
    data: {
      stopId: stop3.id,
      activityId: activities[2].id,
      scheduledAt: new Date("2024-07-02"),
      position: 1,
    },
  });

  await prisma.tripActivity.create({
    data: {
      stopId: stop3.id,
      activityId: activities[3].id,
      scheduledAt: new Date("2024-07-04"),
      position: 2,
    },
  });

  await prisma.tripActivity.create({
    data: {
      stopId: stop4.id,
      activityId: activities[7].id,
      scheduledAt: new Date("2024-07-12"),
      position: 1,
    },
  });

  await prisma.costItem.create({
    data: {
      tripId: trip2.id,
      stopId: stop3.id,
      category: "STAY",
      amount: 100,
      currency: "JPY",
      description: "Hotel in Tokyo",
    },
  });

  console.log("Created second trip and related data");

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
