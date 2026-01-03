import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

// Set DATABASE_URL for seed script
process.env.DATABASE_URL = process.env.DATABASE_URL || "file:./prisma/dev.db";

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

  // 25 Cities with real data
  const citiesWithActivities = [
    {
      city: { name: "Paris", country: "France", slug: "paris-france", lat: 48.8566, lng: 2.3522, costIndex: 85, popularity: 95 },
      activities: [
        { name: "Eiffel Tower Visit", type: "SIGHTSEEING", avgCost: 28, durationMin: 120, description: "Iconic iron lattice tower with stunning city views" },
        { name: "Louvre Museum", type: "CULTURE", avgCost: 17, durationMin: 240, description: "World's largest art museum, home to the Mona Lisa" },
        { name: "Seine River Cruise", type: "SIGHTSEEING", avgCost: 15, durationMin: 90, description: "Scenic boat tour along the Seine River" },
        { name: "French Cooking Class", type: "FOOD", avgCost: 85, durationMin: 180, description: "Learn authentic French cuisine from local chefs" },
        { name: "Montmartre Walking Tour", type: "CULTURE", avgCost: 25, durationMin: 150, description: "Explore the artistic bohemian district" },
      ]
    },
    {
      city: { name: "Tokyo", country: "Japan", slug: "tokyo-japan", lat: 35.6762, lng: 139.6503, costIndex: 90, popularity: 92 },
      activities: [
        { name: "Shibuya Crossing Experience", type: "SIGHTSEEING", avgCost: 0, durationMin: 30, description: "World's busiest pedestrian crossing" },
        { name: "Tsukiji Outer Market Tour", type: "FOOD", avgCost: 45, durationMin: 180, description: "Fresh sushi and street food paradise" },
        { name: "Senso-ji Temple Visit", type: "CULTURE", avgCost: 0, durationMin: 90, description: "Tokyo's oldest Buddhist temple" },
        { name: "Sushi Making Class", type: "FOOD", avgCost: 95, durationMin: 120, description: "Master the art of sushi with expert chefs" },
        { name: "TeamLab Borderless", type: "CULTURE", avgCost: 32, durationMin: 180, description: "Immersive digital art museum experience" },
      ]
    },
    {
      city: { name: "New York", country: "USA", slug: "new-york-usa", lat: 40.7128, lng: -74.006, costIndex: 95, popularity: 98 },
      activities: [
        { name: "Statue of Liberty Tour", type: "SIGHTSEEING", avgCost: 24, durationMin: 240, description: "Visit America's iconic symbol of freedom" },
        { name: "Broadway Show", type: "CULTURE", avgCost: 150, durationMin: 180, description: "World-class theatrical performances" },
        { name: "Central Park Bike Tour", type: "ADVENTURE", avgCost: 45, durationMin: 120, description: "Explore Manhattan's green oasis on two wheels" },
        { name: "Empire State Building", type: "SIGHTSEEING", avgCost: 44, durationMin: 90, description: "Observation deck with panoramic views" },
        { name: "Brooklyn Food Tour", type: "FOOD", avgCost: 75, durationMin: 180, description: "Sample diverse cuisines across Brooklyn" },
      ]
    },
    {
      city: { name: "London", country: "UK", slug: "london-uk", lat: 51.5074, lng: -0.1278, costIndex: 92, popularity: 96 },
      activities: [
        { name: "Tower of London", type: "CULTURE", avgCost: 33, durationMin: 180, description: "Historic castle and home of the Crown Jewels" },
        { name: "British Museum", type: "CULTURE", avgCost: 0, durationMin: 240, description: "World history under one roof" },
        { name: "Thames River Cruise", type: "SIGHTSEEING", avgCost: 18, durationMin: 60, description: "See London landmarks from the water" },
        { name: "West End Musical", type: "CULTURE", avgCost: 85, durationMin: 180, description: "London's famous theatre district" },
        { name: "Borough Market Food Tour", type: "FOOD", avgCost: 55, durationMin: 150, description: "London's most famous food market" },
      ]
    },
    {
      city: { name: "Rome", country: "Italy", slug: "rome-italy", lat: 41.9028, lng: 12.4964, costIndex: 78, popularity: 93 },
      activities: [
        { name: "Colosseum Tour", type: "CULTURE", avgCost: 18, durationMin: 180, description: "Explore ancient Rome's gladiator arena" },
        { name: "Vatican Museums & Sistine Chapel", type: "CULTURE", avgCost: 26, durationMin: 240, description: "Michelangelo's masterpiece ceiling" },
        { name: "Trastevere Food Walk", type: "FOOD", avgCost: 65, durationMin: 180, description: "Authentic Roman cuisine in charming streets" },
        { name: "Trevi Fountain & Spanish Steps", type: "SIGHTSEEING", avgCost: 0, durationMin: 90, description: "Rome's most beautiful landmarks" },
        { name: "Pasta Making Class", type: "FOOD", avgCost: 70, durationMin: 150, description: "Learn to make pasta like a Roman nonna" },
      ]
    },
    {
      city: { name: "Barcelona", country: "Spain", slug: "barcelona-spain", lat: 41.3874, lng: 2.1686, costIndex: 75, popularity: 88 },
      activities: [
        { name: "Sagrada Familia", type: "CULTURE", avgCost: 26, durationMin: 120, description: "Gaudí's unfinished masterpiece basilica" },
        { name: "Park Güell", type: "SIGHTSEEING", avgCost: 10, durationMin: 120, description: "Whimsical park with mosaic art" },
        { name: "La Boqueria Market", type: "FOOD", avgCost: 30, durationMin: 90, description: "Famous food market on Las Ramblas" },
        { name: "Gothic Quarter Walk", type: "CULTURE", avgCost: 0, durationMin: 120, description: "Medieval streets and hidden plazas" },
        { name: "Tapas & Wine Tour", type: "FOOD", avgCost: 75, durationMin: 180, description: "Authentic Spanish tapas crawl" },
      ]
    },
    {
      city: { name: "Dubai", country: "UAE", slug: "dubai-uae", lat: 25.2048, lng: 55.2708, costIndex: 88, popularity: 90 },
      activities: [
        { name: "Burj Khalifa Observation", type: "SIGHTSEEING", avgCost: 45, durationMin: 90, description: "World's tallest building observation deck" },
        { name: "Desert Safari", type: "ADVENTURE", avgCost: 65, durationMin: 360, description: "Dune bashing, camels, and BBQ dinner" },
        { name: "Dubai Mall & Fountain Show", type: "SIGHTSEEING", avgCost: 0, durationMin: 180, description: "World's largest mall and water show" },
        { name: "Old Dubai Souks", type: "CULTURE", avgCost: 0, durationMin: 150, description: "Traditional gold and spice markets" },
        { name: "Dhow Cruise Dinner", type: "FOOD", avgCost: 55, durationMin: 120, description: "Traditional boat dinner cruise" },
      ]
    },
    {
      city: { name: "Bangkok", country: "Thailand", slug: "bangkok-thailand", lat: 13.7563, lng: 100.5018, costIndex: 40, popularity: 85 },
      activities: [
        { name: "Grand Palace & Wat Phra Kaew", type: "CULTURE", avgCost: 15, durationMin: 180, description: "Thailand's most sacred temple" },
        { name: "Floating Market Tour", type: "CULTURE", avgCost: 25, durationMin: 240, description: "Traditional canal-side markets" },
        { name: "Street Food Night Tour", type: "FOOD", avgCost: 35, durationMin: 180, description: "Sample Bangkok's famous street food" },
        { name: "Thai Cooking Class", type: "FOOD", avgCost: 40, durationMin: 180, description: "Learn pad thai and green curry" },
        { name: "Wat Arun Temple", type: "CULTURE", avgCost: 3, durationMin: 90, description: "Temple of Dawn on the river" },
      ]
    },
    {
      city: { name: "Singapore", country: "Singapore", slug: "singapore", lat: 1.3521, lng: 103.8198, costIndex: 94, popularity: 89 },
      activities: [
        { name: "Gardens by the Bay", type: "SIGHTSEEING", avgCost: 23, durationMin: 180, description: "Futuristic nature park with Supertrees" },
        { name: "Marina Bay Sands SkyPark", type: "SIGHTSEEING", avgCost: 26, durationMin: 60, description: "Infinity pool views over Singapore" },
        { name: "Hawker Center Food Tour", type: "FOOD", avgCost: 25, durationMin: 180, description: "Michelin-starred street food" },
        { name: "Sentosa Island", type: "ADVENTURE", avgCost: 50, durationMin: 360, description: "Beach resort and attractions" },
        { name: "Chinatown Heritage Walk", type: "CULTURE", avgCost: 0, durationMin: 120, description: "Explore Singapore's cultural roots" },
      ]
    },
    {
      city: { name: "Sydney", country: "Australia", slug: "sydney-australia", lat: -33.8688, lng: 151.2093, costIndex: 89, popularity: 86 },
      activities: [
        { name: "Sydney Opera House Tour", type: "CULTURE", avgCost: 43, durationMin: 90, description: "Iconic architectural masterpiece" },
        { name: "Bondi to Coogee Walk", type: "ADVENTURE", avgCost: 0, durationMin: 180, description: "Stunning coastal cliff walk" },
        { name: "Harbour Bridge Climb", type: "ADVENTURE", avgCost: 280, durationMin: 210, description: "Climb Sydney's famous bridge" },
        { name: "Sydney Fish Market", type: "FOOD", avgCost: 35, durationMin: 120, description: "Fresh seafood at the world's 3rd largest fish market" },
        { name: "Taronga Zoo Ferry", type: "SIGHTSEEING", avgCost: 52, durationMin: 240, description: "Zoo with harbour views" },
      ]
    },
    {
      city: { name: "Amsterdam", country: "Netherlands", slug: "amsterdam-netherlands", lat: 52.3676, lng: 4.9041, costIndex: 80, popularity: 88 },
      activities: [
        { name: "Anne Frank House", type: "CULTURE", avgCost: 16, durationMin: 90, description: "WWII historic hiding place" },
        { name: "Van Gogh Museum", type: "CULTURE", avgCost: 22, durationMin: 150, description: "World's largest Van Gogh collection" },
        { name: "Canal Cruise", type: "SIGHTSEEING", avgCost: 18, durationMin: 75, description: "Explore Amsterdam's famous canals" },
        { name: "Jordaan District Walk", type: "CULTURE", avgCost: 0, durationMin: 120, description: "Charming neighborhood with boutiques" },
        { name: "Dutch Cheese & Food Tour", type: "FOOD", avgCost: 65, durationMin: 180, description: "Sample gouda, stroopwafels and more" },
      ]
    },
    {
      city: { name: "Istanbul", country: "Turkey", slug: "istanbul-turkey", lat: 41.0082, lng: 28.9784, costIndex: 55, popularity: 87 },
      activities: [
        { name: "Hagia Sophia", type: "CULTURE", avgCost: 25, durationMin: 120, description: "Ancient cathedral turned mosque" },
        { name: "Blue Mosque", type: "CULTURE", avgCost: 0, durationMin: 60, description: "Stunning 17th-century mosque" },
        { name: "Grand Bazaar Shopping", type: "CULTURE", avgCost: 0, durationMin: 180, description: "One of world's oldest covered markets" },
        { name: "Bosphorus Cruise", type: "SIGHTSEEING", avgCost: 20, durationMin: 120, description: "Cruise between Europe and Asia" },
        { name: "Turkish Breakfast Experience", type: "FOOD", avgCost: 25, durationMin: 90, description: "Traditional multi-course breakfast" },
      ]
    },
    {
      city: { name: "Seoul", country: "South Korea", slug: "seoul-south-korea", lat: 37.5665, lng: 126.9780, costIndex: 82, popularity: 84 },
      activities: [
        { name: "Gyeongbokgung Palace", type: "CULTURE", avgCost: 3, durationMin: 150, description: "Grand Joseon dynasty palace" },
        { name: "Korean BBQ Experience", type: "FOOD", avgCost: 35, durationMin: 120, description: "Authentic grill-at-table dining" },
        { name: "Bukchon Hanok Village", type: "CULTURE", avgCost: 0, durationMin: 120, description: "Traditional Korean houses" },
        { name: "DMZ Tour", type: "CULTURE", avgCost: 80, durationMin: 480, description: "Visit the Korean border zone" },
        { name: "K-Pop Experience", type: "CULTURE", avgCost: 45, durationMin: 180, description: "Learn K-pop dance and culture" },
      ]
    },
    {
      city: { name: "Berlin", country: "Germany", slug: "berlin-germany", lat: 52.5200, lng: 13.4050, costIndex: 76, popularity: 85 },
      activities: [
        { name: "Brandenburg Gate", type: "SIGHTSEEING", avgCost: 0, durationMin: 30, description: "Symbol of German reunification" },
        { name: "Berlin Wall Memorial", type: "CULTURE", avgCost: 0, durationMin: 120, description: "Cold War history preserved" },
        { name: "Museum Island", type: "CULTURE", avgCost: 22, durationMin: 240, description: "Five world-class museums" },
        { name: "Street Art Tour", type: "CULTURE", avgCost: 15, durationMin: 180, description: "Explore Berlin's urban art scene" },
        { name: "Currywurst & Beer Tour", type: "FOOD", avgCost: 45, durationMin: 180, description: "Berlin's iconic street food" },
      ]
    },
    {
      city: { name: "Hong Kong", country: "China", slug: "hong-kong-china", lat: 22.3193, lng: 114.1694, costIndex: 91, popularity: 87 },
      activities: [
        { name: "Victoria Peak Tram", type: "SIGHTSEEING", avgCost: 12, durationMin: 120, description: "Iconic views of Hong Kong skyline" },
        { name: "Star Ferry Ride", type: "SIGHTSEEING", avgCost: 1, durationMin: 15, description: "Cross Victoria Harbour" },
        { name: "Dim Sum Breakfast", type: "FOOD", avgCost: 25, durationMin: 90, description: "Traditional Cantonese cuisine" },
        { name: "Temple Street Night Market", type: "CULTURE", avgCost: 0, durationMin: 150, description: "Bustling night market experience" },
        { name: "Big Buddha & Ngong Ping", type: "CULTURE", avgCost: 25, durationMin: 240, description: "Giant Buddha statue on Lantau Island" },
      ]
    },
    {
      city: { name: "Los Angeles", country: "USA", slug: "los-angeles-usa", lat: 34.0522, lng: -118.2437, costIndex: 88, popularity: 91 },
      activities: [
        { name: "Hollywood Sign Hike", type: "ADVENTURE", avgCost: 0, durationMin: 180, description: "Hike to the iconic sign" },
        { name: "Universal Studios", type: "ADVENTURE", avgCost: 139, durationMin: 480, description: "Movie magic theme park" },
        { name: "Santa Monica Pier", type: "SIGHTSEEING", avgCost: 0, durationMin: 180, description: "Iconic beachfront amusement pier" },
        { name: "Getty Museum", type: "CULTURE", avgCost: 0, durationMin: 240, description: "World-class art with LA views" },
        { name: "LA Food Truck Tour", type: "FOOD", avgCost: 65, durationMin: 180, description: "Sample LA's diverse food truck scene" },
      ]
    },
    {
      city: { name: "Mumbai", country: "India", slug: "mumbai-india", lat: 19.0760, lng: 72.8777, costIndex: 45, popularity: 82 },
      activities: [
        { name: "Gateway of India", type: "SIGHTSEEING", avgCost: 0, durationMin: 60, description: "Mumbai's iconic waterfront monument" },
        { name: "Dharavi Slum Tour", type: "CULTURE", avgCost: 15, durationMin: 180, description: "Insight into community life" },
        { name: "Street Food Walk", type: "FOOD", avgCost: 20, durationMin: 180, description: "Vada pav, pani puri and more" },
        { name: "Elephanta Caves", type: "CULTURE", avgCost: 10, durationMin: 300, description: "Ancient rock-cut temples" },
        { name: "Bollywood Studio Tour", type: "CULTURE", avgCost: 35, durationMin: 240, description: "Behind the scenes of Indian cinema" },
      ]
    },
    {
      city: { name: "Cape Town", country: "South Africa", slug: "cape-town-south-africa", lat: -33.9249, lng: 18.4241, costIndex: 58, popularity: 80 },
      activities: [
        { name: "Table Mountain Cable Car", type: "SIGHTSEEING", avgCost: 25, durationMin: 180, description: "Iconic flat-topped mountain" },
        { name: "Robben Island Tour", type: "CULTURE", avgCost: 55, durationMin: 240, description: "Where Mandela was imprisoned" },
        { name: "Cape Winelands Tour", type: "FOOD", avgCost: 75, durationMin: 480, description: "Wine tasting in scenic valleys" },
        { name: "Boulders Beach Penguins", type: "SIGHTSEEING", avgCost: 10, durationMin: 120, description: "African penguin colony" },
        { name: "Bo-Kaap Walking Tour", type: "CULTURE", avgCost: 20, durationMin: 120, description: "Colorful Cape Malay quarter" },
      ]
    },
    {
      city: { name: "Rio de Janeiro", country: "Brazil", slug: "rio-de-janeiro-brazil", lat: -22.9068, lng: -43.1729, costIndex: 60, popularity: 83 },
      activities: [
        { name: "Christ the Redeemer", type: "SIGHTSEEING", avgCost: 22, durationMin: 180, description: "Iconic statue atop Corcovado" },
        { name: "Sugarloaf Mountain", type: "SIGHTSEEING", avgCost: 35, durationMin: 180, description: "Cable car to panoramic views" },
        { name: "Copacabana Beach", type: "ADVENTURE", avgCost: 0, durationMin: 240, description: "Famous crescent beach" },
        { name: "Favela Tour", type: "CULTURE", avgCost: 35, durationMin: 180, description: "Community-led walking tour" },
        { name: "Brazilian BBQ Experience", type: "FOOD", avgCost: 45, durationMin: 150, description: "Authentic churrascaria dining" },
      ]
    },
    {
      city: { name: "Vienna", country: "Austria", slug: "vienna-austria", lat: 48.2082, lng: 16.3738, costIndex: 79, popularity: 84 },
      activities: [
        { name: "Schönbrunn Palace", type: "CULTURE", avgCost: 22, durationMin: 240, description: "Habsburg imperial summer residence" },
        { name: "Vienna State Opera", type: "CULTURE", avgCost: 100, durationMin: 180, description: "World-renowned opera house" },
        { name: "Coffee House Experience", type: "FOOD", avgCost: 15, durationMin: 90, description: "Traditional Viennese café culture" },
        { name: "St. Stephen's Cathedral", type: "SIGHTSEEING", avgCost: 6, durationMin: 60, description: "Gothic masterpiece in city center" },
        { name: "Naschmarkt Food Walk", type: "FOOD", avgCost: 40, durationMin: 150, description: "Vienna's most famous market" },
      ]
    },
    {
      city: { name: "Kyoto", country: "Japan", slug: "kyoto-japan", lat: 35.0116, lng: 135.7681, costIndex: 83, popularity: 85 },
      activities: [
        { name: "Fushimi Inari Shrine", type: "CULTURE", avgCost: 0, durationMin: 180, description: "Thousands of vermillion torii gates" },
        { name: "Arashiyama Bamboo Grove", type: "SIGHTSEEING", avgCost: 0, durationMin: 120, description: "Ethereal bamboo forest walk" },
        { name: "Traditional Tea Ceremony", type: "CULTURE", avgCost: 45, durationMin: 90, description: "Authentic Japanese tea ritual" },
        { name: "Geisha District Walk", type: "CULTURE", avgCost: 0, durationMin: 150, description: "Historic Gion neighborhood" },
        { name: "Kaiseki Dinner", type: "FOOD", avgCost: 120, durationMin: 150, description: "Traditional multi-course cuisine" },
      ]
    },
    {
      city: { name: "Mexico City", country: "Mexico", slug: "mexico-city-mexico", lat: 19.4326, lng: -99.1332, costIndex: 50, popularity: 78 },
      activities: [
        { name: "Teotihuacan Pyramids", type: "CULTURE", avgCost: 20, durationMin: 360, description: "Ancient Aztec pyramids" },
        { name: "Frida Kahlo Museum", type: "CULTURE", avgCost: 15, durationMin: 150, description: "Artist's colorful home" },
        { name: "Xochimilco Floating Gardens", type: "SIGHTSEEING", avgCost: 25, durationMin: 240, description: "Colorful trajinera boat ride" },
        { name: "Street Tacos Tour", type: "FOOD", avgCost: 35, durationMin: 180, description: "Sample authentic Mexican tacos" },
        { name: "Chapultepec Castle", type: "CULTURE", avgCost: 5, durationMin: 180, description: "Historic hilltop castle" },
      ]
    },
    {
      city: { name: "San Francisco", country: "USA", slug: "san-francisco-usa", lat: 37.7749, lng: -122.4194, costIndex: 96, popularity: 89 },
      activities: [
        { name: "Golden Gate Bridge Walk", type: "SIGHTSEEING", avgCost: 0, durationMin: 90, description: "Walk across the iconic bridge" },
        { name: "Alcatraz Island Tour", type: "CULTURE", avgCost: 41, durationMin: 180, description: "Tour the infamous prison island" },
        { name: "Cable Car Ride", type: "SIGHTSEEING", avgCost: 8, durationMin: 30, description: "Iconic San Francisco experience" },
        { name: "Chinatown Walking Tour", type: "CULTURE", avgCost: 30, durationMin: 150, description: "Oldest Chinatown in North America" },
        { name: "Fisherman's Wharf & Seafood", type: "FOOD", avgCost: 45, durationMin: 180, description: "Fresh seafood and sea lions" },
      ]
    },
    {
      city: { name: "Toronto", country: "Canada", slug: "toronto-canada", lat: 43.6510, lng: -79.3470, costIndex: 84, popularity: 81 },
      activities: [
        { name: "CN Tower EdgeWalk", type: "ADVENTURE", avgCost: 225, durationMin: 90, description: "Walk on the edge of the tower" },
        { name: "Royal Ontario Museum", type: "CULTURE", avgCost: 23, durationMin: 240, description: "World cultures and natural history" },
        { name: "Kensington Market", type: "FOOD", avgCost: 0, durationMin: 180, description: "Bohemian neighborhood and food" },
        { name: "Distillery District", type: "CULTURE", avgCost: 0, durationMin: 120, description: "Victorian industrial charm" },
        { name: "Niagara Falls Day Trip", type: "SIGHTSEEING", avgCost: 85, durationMin: 600, description: "Iconic waterfall excursion" },
      ]
    },
  ];

  // Create cities and their activities
  for (const item of citiesWithActivities) {
    const city = await prisma.city.create({
      data: item.city
    });
    
    for (const act of item.activities) {
      await prisma.activity.create({
          data: {
            cityId: city.id,
          name: act.name,
          description: act.description,
          type: act.type as any,
          avgCost: act.avgCost,
          durationMin: act.durationMin,
        }
      });
    }
  }

  console.log("Created 25 cities with 5 activities each (125 activities total)");

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
