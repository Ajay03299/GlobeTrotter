import type { ApiResponse, User, Trip, City, CreateTripInput } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === 'true' || false;

const MOCK_USER: User = {
  id: 'dev-user-1',
  email: 'dev@globetrotter.com',
  name: 'Dev User',
  createdAt: new Date().toISOString(),
};

// Expanded mock data
const MOCK_TRIPS: Trip[] = [
  {
    id: 'trip-1',
    userId: MOCK_USER.id,
    name: 'Summer in Paris',
    description: 'A week long vacation in Paris visiting museums and cafes.',
    startDate: '2026-06-15',
    endDate: '2026-06-22',
    isPublic: false,
    createdAt: new Date().toISOString(),
    stops: [
      {
        id: 'stop-1',
        tripId: 'trip-1',
        cityId: 'city-1',
        city: { id: 'city-1', name: 'Paris', country: 'France', slug: 'paris-france', lat: 48.8566, lng: 2.3522 },
        position: 0,
        startDate: '2026-06-15',
        endDate: '2026-06-22',
        activities: [
          { id: 'act-1', stopId: 'stop-1', activityId: 'a1', activity: { id: 'a1', name: 'Eiffel Tower', type: 'SIGHTSEEING', avgCost: 30 } },
          { id: 'act-2', stopId: 'stop-1', activityId: 'a2', activity: { id: 'a2', name: 'Louvre Museum', type: 'CULTURE', avgCost: 20 } }
        ]
      }
    ]
  },
  {
    id: 'trip-2',
    userId: MOCK_USER.id,
    name: 'Japan Adventure',
    description: 'Exploring Tokyo, Kyoto and Osaka.',
    startDate: '2026-09-10',
    endDate: '2026-09-20',
    isPublic: true,
    createdAt: new Date().toISOString(),
    stops: [
      {
        id: 'stop-2',
        tripId: 'trip-2',
        cityId: 'city-2',
        city: { id: 'city-2', name: 'Tokyo', country: 'Japan', slug: 'tokyo-japan', lat: 35.6762, lng: 139.6503 },
        position: 0,
        startDate: '2026-09-10',
        endDate: '2026-09-14',
      },
      {
        id: 'stop-3',
        tripId: 'trip-2',
        cityId: 'city-3',
        city: { id: 'city-3', name: 'Kyoto', country: 'Japan', slug: 'kyoto-japan', lat: 35.0116, lng: 135.7681 },
        position: 1,
        startDate: '2026-09-14',
        endDate: '2026-09-17',
      }
    ]
  }
];

async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  if (DEV_MODE) await new Promise((resolve) => setTimeout(resolve, 300));

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...options?.headers },
    });
    return await res.json();
  } catch (error) {
    if (DEV_MODE) console.warn(`[DEV] API call to ${endpoint} failed`);
    return { ok: false, error: { message: 'Network error', details: error } };
  }
}

export async function signup(name: string, email: string, password: string) {
  if (DEV_MODE) return { ok: true, data: { ...MOCK_USER, name, email } };
  return apiRequest<User>('/api/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password }) });
}

export async function login(email: string, password: string) {
  if (DEV_MODE) return { ok: true, data: { ...MOCK_USER, email } };
  return apiRequest<User>('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
}

export async function getMe() {
  if (DEV_MODE) return { ok: true, data: MOCK_USER };
  return apiRequest<User>('/api/auth/me');
}

export async function logout() {
  if (DEV_MODE) return { ok: true };
  return apiRequest<void>('/api/auth/logout', { method: 'POST' });
}

export async function getTrips() {
  if (DEV_MODE) return { ok: true, data: MOCK_TRIPS };
  return apiRequest<Trip[]>('/api/trips');
}

export async function getTrip(id: string) {
  if (DEV_MODE) {
    const trip = MOCK_TRIPS.find(t => t.id === id);
    return { ok: !!trip, data: trip || null };
  }
  return apiRequest<Trip>(`/api/trips/${id}`);
}

export async function createTrip(data: CreateTripInput) {
  if (DEV_MODE) {
    const newTrip: Trip = {
      id: `trip-${Date.now()}`,
      userId: MOCK_USER.id,
      ...data,
      isPublic: false,
      createdAt: new Date().toISOString(),
      stops: [],
    };
    MOCK_TRIPS.unshift(newTrip);
    return { ok: true, data: newTrip };
  }
  return apiRequest<Trip>('/api/trips', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateTrip(id: string, data: Partial<CreateTripInput>) {
  if (DEV_MODE) return { ok: true, data: null };
  return apiRequest<Trip>(`/api/trips/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteTrip(id: string) {
  if (DEV_MODE) return { ok: true };
  return apiRequest<void>(`/api/trips/${id}`, { method: 'DELETE' });
}

export async function getCities(search?: string) {
  if (DEV_MODE) {
    const mockCities: City[] = [
      { id: 'city-1', name: 'Paris', country: 'France', slug: 'paris-france', lat: 48.8566, lng: 2.3522, costIndex: 4, popularity: 95 },
      { id: 'city-2', name: 'Tokyo', country: 'Japan', slug: 'tokyo-japan', lat: 35.6762, lng: 139.6503, costIndex: 4, popularity: 92 },
      { id: 'city-3', name: 'New York', country: 'USA', slug: 'new-york-usa', lat: 40.7128, lng: -74.006, costIndex: 5, popularity: 98 },
      { id: 'city-4', name: 'Bali', country: 'Indonesia', slug: 'bali-indonesia', lat: -8.4095, lng: 115.1889, costIndex: 2, popularity: 90 },
      { id: 'city-5', name: 'Santorini', country: 'Greece', slug: 'santorini-greece', lat: 36.3932, lng: 25.4615, costIndex: 4, popularity: 88 },
      { id: 'city-6', name: 'Kyoto', country: 'Japan', slug: 'kyoto-japan', lat: 35.0116, lng: 135.7681, costIndex: 4, popularity: 85 },
    ];
    
    const filtered = search
      ? mockCities.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.country.toLowerCase().includes(search.toLowerCase()))
      : mockCities;

    return { ok: true, data: filtered };
  }
  const params = search ? `?q=${encodeURIComponent(search)}` : '';
  return apiRequest<City[]>(`/api/cities${params}`);
}

export async function getCity(id: string) {
  if (DEV_MODE) return { ok: true, data: null };
  return apiRequest<City>(`/api/cities/${id}`);
}
