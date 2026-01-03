import { createTrip } from "./db/trips";
import { prisma } from "./db/prisma";

async function run() {
  // Create a test user first
  const user = await prisma.user.create({
    data: {
      email: "test@example.com",
      password: "hashedpassword123",
      name: "Test User",
    },
  });

  console.log("Created user:", user);

  // Now create a trip for this user
  const trip = await createTrip({
    userId: user.id,
    name: "My Zod Powered Trip",
  });

  console.log("Created trip:", trip);
}

run();
