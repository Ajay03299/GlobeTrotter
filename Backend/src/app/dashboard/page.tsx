'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plane, Plus, LogOut, Compass, MapPin, Calendar, ArrowRight, Globe } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { CitySearch } from '@/components/trips/CitySearch';
import MapView from '@/components/maps/MapView';
import { getMe, getTrips } from '@/lib/api';
import type { User, Trip } from '@/types';
import { formatDate } from '@/lib/utils';

// ⚠️ DEV MODE
const SKIP_AUTH = true;

const MOCK_USER: User = {
  id: 'dev-user',
  email: 'dev@globetrotter.com',
  name: 'Dev User',
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      // Auth check
      let currentUser = null;
      if (SKIP_AUTH) {
        currentUser = MOCK_USER;
      } else {
        try {
          const res = await getMe();
          if (res.ok && res.data) currentUser = res.data;
        } catch {}
      }

      if (!currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);

      // Load trips
      try {
        const res = await getTrips();
        if (res.ok && res.data) {
          setTrips(res.data);
        }
      } catch {}

      setLoading(false);
    }
    loadData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  // Calculate map locations from trips
  const visitedLocations = trips.flatMap(t => 
    t.stops?.map(s => ({
      id: s.id,
      name: s.city?.name || 'Unknown',
      lat: s.city?.lat || 0,
      lng: s.city?.lng || 0,
      description: `Visited on ${t.name}`
    })) || []
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-sky-500 p-1.5 rounded-lg">
              <Plane className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">GlobeTrotter</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 hidden sm:block">
              {user?.name}
            </span>
            <Button variant="ghost" size="sm">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-12">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Hello, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-slate-500 mt-1">Ready for your next adventure?</p>
        </div>

        {/* 1. Upcoming Trips Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-sky-500" />
              Upcoming Trips
            </h2>
            {trips.length > 0 && (
              <Link href="/trips/new">
                <Button size="sm">
                  <Plus className="h-4 w-4" /> New Trip
                </Button>
              </Link>
            )}
          </div>

          {trips.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip) => (
                <Link key={trip.id} href={`/trips/${trip.id}`}>
                  <Card variant="bordered" className="hover:shadow-md transition-shadow cursor-pointer group h-full">
                    <div className="h-32 bg-slate-100 rounded-t-xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-indigo-500 opacity-20 group-hover:opacity-30 transition-opacity" />
                      <div className="absolute bottom-4 left-4">
                        <h3 className="text-lg font-bold text-slate-900">{trip.name}</h3>
                        <p className="text-sm text-slate-600">{formatDate(trip.startDate || '')}</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                        {trip.description || 'No description provided.'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {trip.stops?.slice(0, 3).map((stop) => (
                          <span key={stop.id} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-medium">
                            {stop.city?.name}
                          </span>
                        ))}
                        {(trip.stops?.length || 0) > 3 && (
                          <span className="text-xs text-slate-400 self-center">
                            +{ (trip.stops?.length || 0) - 3 } more
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center border-dashed border-2 bg-slate-50/50">
              <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plane className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No upcoming trips</h3>
              <p className="text-slate-500 mb-6">You haven't planned any trips yet.</p>
              <Link href="/trips/new">
                <Button>
                  <Plus className="h-4 w-4" /> Plan a Trip
                </Button>
              </Link>
            </Card>
          )}
        </section>

        {/* 2. Popular Destinations + Search */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Compass className="h-5 w-5 text-sky-500" />
            <h2 className="text-xl font-bold text-slate-900">Popular Destinations</h2>
          </div>
          
          {/* Search Bar */}
          <div className="mb-8 max-w-2xl">
            <Card className="p-6 bg-gradient-to-r from-sky-50 to-indigo-50 border-sky-100">
              <h3 className="font-semibold text-slate-900 mb-2">Where to next?</h3>
              <CitySearch />
            </Card>
          </div>

          {/* Horizontal Scrolling Gallery */}
          <div className="relative">
            <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide -mx-6 px-6 sm:mx-0 sm:px-0">
              <DestinationCard city="Paris" country="France" image="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80" />
              <DestinationCard city="Tokyo" country="Japan" image="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80" />
              <DestinationCard city="New York" country="USA" image="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80" />
              <DestinationCard city="Bali" country="Indonesia" image="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80" />
              <DestinationCard city="Santorini" country="Greece" image="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80" />
              <DestinationCard city="London" country="UK" image="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80" />
              <DestinationCard city="Rome" country="Italy" image="https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80" />
              <DestinationCard city="Dubai" country="UAE" image="https://images.unsplash.com/photo-1512453979798-5ea936a7fe11?auto=format&fit=crop&w=600&q=80" />
            </div>
          </div>
        </section>

        {/* 3. Your Trips Map (Bottom) */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-sky-500" />
              <h2 className="text-xl font-bold text-slate-900">Your Travel Map</h2>
            </div>
            <Link href="/trips/map">
              <Button variant="ghost" size="sm">
                View Full Map <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <Card className="overflow-hidden p-0 h-[400px] border-2 border-slate-200">
            <MapView locations={visitedLocations} />
          </Card>
        </section>
      </main>
    </div>
  );
}

function DestinationCard({ city, country, image }: { city: string; country: string; image: string }) {
  return (
    <div className="group relative rounded-xl overflow-hidden aspect-[3/4] min-w-[200px] sm:min-w-[240px] cursor-pointer snap-start flex-shrink-0">
      <img src={image} alt={city} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      <div className="absolute bottom-3 left-3 text-white">
        <h4 className="font-bold text-lg">{city}</h4>
        <p className="text-sm opacity-90">{country}</p>
      </div>
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button size="sm" className="bg-white/90 text-slate-900 hover:bg-white h-8 text-xs">
          Plan Trip
        </Button>
      </div>
    </div>
  );
}
