import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
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

  const cityData = [
    { name: "Paris", country: "France", slug: "paris-france", lat: 48.8566, lng: 2.3522, costIndex: 85, popularity: 95 },
    { name: "Tokyo", country: "Japan", slug: "tokyo-japan", lat: 35.6762, lng: 139.6503, costIndex: 90, popularity: 92 },
    { name: "New York", country: "USA", slug: "new-york-usa", lat: 40.7128, lng: -74.006, costIndex: 95, popularity: 98 },
    { name: "Barcelona", country: "Spain", slug: "barcelona-spain", lat: 41.3874, lng: 2.1686, costIndex: 75, popularity: 88 },
    { name: "Bangkok", country: "Thailand", slug: "bangkok-thailand", lat: 13.7563, lng: 100.5018, costIndex: 40, popularity: 85 },
    { name: "London", country: "UK", slug: "london-uk", lat: 51.5074, lng: -0.1278, costIndex: 92, popularity: 96 },
    { name: "Dubai", country: "UAE", slug: "dubai-uae", lat: 25.2048, lng: 55.2708, costIndex: 88, popularity: 90 },
    { name: "Rome", country: "Italy", slug: "rome-italy", lat: 41.9028, lng: 12.4964, costIndex: 78, popularity: 93 },
    { name: "Singapore", country: "Singapore", slug: "singapore", lat: 1.3521, lng: 103.8198, costIndex: 94, popularity: 89 },
    { name: "Istanbul", country: "Turkey", slug: "istanbul-turkey", lat: 41.0082, lng: 28.9784, costIndex: 55, popularity: 87 },
    { name: "Sydney", country: "Australia", slug: "sydney-australia", lat: -33.8688, lng: 151.2093, costIndex: 89, popularity: 86 },
    { name: "Seoul", country: "South Korea", slug: "seoul-south-korea", lat: 37.5665, lng: 126.9780, costIndex: 82, popularity: 84 },
    { name: "Amsterdam", country: "Netherlands", slug: "amsterdam-netherlands", lat: 52.3676, lng: 4.9041, costIndex: 80, popularity: 88 },
    { name: "Berlin", country: "Germany", slug: "berlin-germany", lat: 52.5200, lng: 13.4050, costIndex: 76, popularity: 85 },
    { name: "Hong Kong", country: "China", slug: "hong-kong-china", lat: 22.3193, lng: 114.1694, costIndex: 91, popularity: 87 },
    { name: "Los Angeles", country: "USA", slug: "los-angeles-usa", lat: 34.0522, lng: -118.2437, costIndex: 88, popularity: 91 },
    { name: "Mumbai", country: "India", slug: "mumbai-india", lat: 19.0760, lng: 72.8777, costIndex: 45, popularity: 82 },
    { name: "Cape Town", country: "South Africa", slug: "cape-town-south-africa", lat: -33.9249, lng: 18.4241, costIndex: 58, popularity: 80 },
    { name: "Rio de Janeiro", country: "Brazil", slug: "rio-de-janeiro-brazil", lat: -22.9068, lng: -43.1729, costIndex: 60, popularity: 83 },
    { name: "Moscow", country: "Russia", slug: "moscow-russia", lat: 55.7558, lng: 37.6173, costIndex: 65, popularity: 75 },
    { name: "Mexico City", country: "Mexico", slug: "mexico-city-mexico", lat: 19.4326, lng: -99.1332, costIndex: 50, popularity: 78 },
    { name: "Toronto", country: "Canada", slug: "toronto-canada", lat: 43.6510, lng: -79.3470, costIndex: 84, popularity: 81 },
    { name: "San Francisco", country: "USA", slug: "san-francisco-usa", lat: 37.7749, lng: -122.4194, costIndex: 96, popularity: 89 },
    { name: "Kyoto", country: "Japan", slug: "kyoto-japan", lat: 35.0116, lng: 135.7681, costIndex: 83, popularity: 85 },
    { name: "Vienna", country: "Austria", slug: "vienna-austria", lat: 48.2082, lng: 16.3738, costIndex: 79, popularity: 84 },
  ];

  // Create cities
  const cities = await Promise.all(
    cityData.map(c => prisma.city.create({ data: c }))
  );
  console.log("Created 25 cities");

  // Create 5 activities per city
  const activityTypes = ["SIGHTSEEING", "CULTURE", "FOOD", "ADVENTURE", "OTHER"] as const;
  
  const activities = [];
  for (const city of cities) {
    for (let i = 0; i < 5; i++) {
      activities.push(
        prisma.activity.create({
          data: {
            cityId: city.id,
            name: `${city.name} Activity ${i + 1}`,
            description: `Experience the best of ${city.name} - Activity ${i + 1}`,
            type: activityTypes[i % activityTypes.length],
            avgCost: Math.floor(Math.random() * 100) + 10,
            durationMin: [60, 90, 120, 180, 240][Math.floor(Math.random() * 5)],
          },
        })
      );
    }
  }
  
  await Promise.all(activities);
  console.log("Created activities (5 per city)");

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
