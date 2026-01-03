# 🌍 GlobeTrotter

A modern travel planning application that helps you organize trips, discover destinations, and manage your travel itinerary with ease.

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwindcss)

## ✨ Features

### 🗺️ Trip Planning
- **Multi-city Itineraries**: Plan trips with multiple destinations
- **Activity Management**: Add activities to each stop with costs and durations
- **Date Scheduling**: Set arrival/departure dates for each city
- **Interactive Maps**: Visualize your trip route with Leaflet maps

### 📅 Calendar View
- **Daily Schedule**: View your trip day-by-day
- **Activity Timing**: Schedule specific times for activities
- **City Tracking**: See which city you're in on each day

### 💰 Budget Tracking
- **Cost Estimation**: Automatic calculation of trip costs from activities
- **Activity Breakdown**: See cost breakdown by activity

### 🌐 Explore & Discover
- **25 Popular Destinations**: Curated cities with 5 activities each
- **City Search**: Find destinations by name or country
- **Destination Cards**: Beautiful image galleries with city previews

### 👥 Sharing
- **Public Trip Sharing**: Share your itinerary with a unique link
- **Trip Preview**: Non-logged-in users can view shared trips

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd GlobeTrotter/Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the Backend directory:
   ```env
   DATABASE_URL="file:./prisma/dev.db"
   JWT_SECRET="your-secret-key-here"
   ```

4. **Initialize the database**
   ```bash
   npx prisma db push
   ```

5. **Seed the database** (optional, adds 25 cities with activities)
   ```bash
   npm run db:seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Demo Accounts

After seeding, you can log in with:
- **Email**: `john@example.com`
- **Password**: `password123`

## 📁 Project Structure

```
Backend/
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── seed.ts            # Database seeding script
│   └── dev.db             # SQLite database
├── src/
│   ├── app/
│   │   ├── (auth)/        # Login & Signup pages
│   │   ├── api/           # API routes
│   │   ├── dashboard/     # Main dashboard
│   │   ├── trips/         # Trip management pages
│   │   │   ├── [id]/      # Trip details, edit, calendar, budget
│   │   │   ├── new/       # Create new trip
│   │   │   └── map/       # Full map view
│   │   ├── share/         # Public trip sharing
│   │   └── explore/       # Discover destinations
│   ├── components/
│   │   ├── maps/          # Map components (Leaflet)
│   │   ├── trips/         # Trip-related components
│   │   └── ui/            # Reusable UI components
│   ├── db/                # Database query functions
│   ├── lib/               # Utilities & API client
│   └── types/             # TypeScript type definitions
└── public/                # Static assets
```

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Database** | SQLite with Prisma ORM |
| **Authentication** | JWT (jose) + HTTP-only cookies |
| **Maps** | Leaflet + React Leaflet |
| **Carousel** | Embla Carousel |
| **Icons** | Lucide React |
| **Date Handling** | date-fns |

## 📝 API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/signup` | POST | Create new account |
| `/api/auth/login` | POST | User login |
| `/api/auth/logout` | POST | User logout |
| `/api/auth/me` | GET | Get current user |
| `/api/trips` | GET | List user's trips |
| `/api/trips` | POST | Create new trip |
| `/api/trips/[id]` | GET | Get trip details |
| `/api/trips/[id]` | PUT | Update trip |
| `/api/trips/[id]` | DELETE | Delete trip |
| `/api/cities` | GET | List/search cities |
| `/api/activities` | GET | Get activities for a city |

## 🎨 Screenshots

### Dashboard
- Welcome section with user greeting
- Upcoming trips carousel
- Popular destinations with search
- Interactive travel map

### Trip Planning
- Step-by-step trip creation
- City selection with map preview
- Activity selection per city
- Date and time scheduling

### Calendar View
- Day-by-day itinerary
- City indicators per day
- Scheduled activities with times

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

---

Built with ❤️ for travelers everywhere
