// =========================
// ENUMS (match Prisma schema)
// =========================
export type ActivityType =
  | 'SIGHTSEEING'
  | 'FOOD'
  | 'ADVENTURE'
  | 'CULTURE'
  | 'TRANSPORT'
  | 'OTHER';

export type CostCategory =
  | 'TRANSPORT'
  | 'STAY'
  | 'ACTIVITY'
  | 'MEAL'
  | 'OTHER';

// =========================
// USER & AUTH
// =========================
export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  createdAt?: string;
}

// =========================
// CITY
// =========================
export interface City {
  id: string;
  name: string;
  country: string;
  slug: string;
  lat: number;
  lng: number;
  costIndex?: number;
  popularity?: number;
}

// =========================
// ACTIVITY
// =========================
export interface Activity {
  id: string;
  cityId?: string;
  city?: City;
  name: string;
  description?: string;
  type: ActivityType;
  avgCost?: number;
  durationMin?: number;
}

// =========================
// TRIP ACTIVITY
// =========================
export interface TripActivity {
  id: string;
  stopId: string;
  activityId: string;
  activity?: Activity;
  scheduledAt?: string;
  position?: number;
  notes?: string;
}

// =========================
// COST ITEM
// =========================
export interface CostItem {
  id: string;
  tripId?: string;
  stopId?: string;
  category: CostCategory;
  amount: number;
  currency: string;
  description?: string;
  createdAt: string;
}

// =========================
// STOP
// =========================
export interface Stop {
  id: string;
  tripId: string;
  cityId: string;
  city?: City;
  startDate?: string;
  endDate?: string;
  position: number;
  notes?: string;
  activities?: TripActivity[];
  costItems?: CostItem[];
}

// =========================
// TRIP
// =========================
export interface Trip {
  id: string;
  userId: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  coverPhoto?: string;
  isPublic: boolean;
  stops?: Stop[];
  costItems?: CostItem[];
  createdAt: string;
}

// =========================
// INPUT TYPES
// =========================
export interface CreateTripInput {
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  stops?: {
    cityId: string;
    position: number;
    activities?: {
      activityId: string;
      position?: number;
    }[];
  }[];
}

// =========================
// API RESPONSE
// =========================
export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: {
    message: string;
    details?: unknown;
  };
}
