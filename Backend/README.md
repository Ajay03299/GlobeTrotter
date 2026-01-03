# GlobeTrotter Backend

Full-stack Next.js application powering the GlobeTrotter travel planning platform.

## Quick Start

```bash
# Install dependencies
npm install

# Set up database
npx prisma db push

# Seed with sample data (25 cities, 125 activities)
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env` file:

```env
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="your-secret-key-change-in-production"
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed database with sample data |

## Database

Using SQLite with Prisma ORM. Schema includes:

- **User** - Authentication & profiles
- **Trip** - User trips with dates & description
- **City** - Destinations with coordinates
- **Stop** - Cities within a trip
- **Activity** - Things to do in a city
- **TripActivity** - Scheduled activities in a stop
- **CostItem** - Budget tracking

## Demo Login

After seeding:
- Email: `john@example.com`
- Password: `password123`

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Prisma + SQLite
- JWT Authentication
- Leaflet Maps
- Embla Carousel
