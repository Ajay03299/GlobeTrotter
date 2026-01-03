import { createTrip } from "./db/trips";
import { prisma } from "./db/prisma";

async function run() {
  // Find or create a test user
  let user = await prisma.user.findUnique({
    where: { email: "test@example.com" },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: "test@example.com",
        password: "hashedpassword123",
        name: "Test User",
      },
    });
    console.log("Created user:", user);
  } else {
    console.log("Using existing user:", user);
  }

  // Now create a trip for this user
  const trip = await createTrip({
    userId: user.id,
    name: "My Zod Powered Trip",
  });

  console.log("Created trip:", trip);
}

run();
