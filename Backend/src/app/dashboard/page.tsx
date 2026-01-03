'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plane, Plus, LogOut, Compass, Calendar, ArrowRight, Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Button } from '@/components/ui/Button';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { CitySearch } from '@/components/trips/CitySearch';
import MapView from '@/components/maps/MapView';
import { getMe, getTrips, logout, getCities } from '@/lib/api';
import type { User, Trip, City } from '@/types';
import { formatDate } from '@/lib/utils';

// City images mapping
const CITY_IMAGES: Record<string, string> = {
  'Paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
  'Tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80',
  'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80',
  'London': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80',
  'Rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80',
  'Barcelona': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=600&q=80',
  'Dubai': 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Bangkok': 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=600&q=80',
  'Singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=600&q=80',
  'Sydney': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80',
  'Amsterdam': 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=600&q=80',
  'Istanbul': 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=600&q=80',
  'Seoul': 'https://images.unsplash.com/photo-1534274867514-d5b47ef89ed7?auto=format&fit=crop&w=600&q=80',
  'Berlin': 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=600&q=80',
  'Hong Kong': 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?auto=format&fit=crop&w=600&q=80',
  'Los Angeles': 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?auto=format&fit=crop&w=600&q=80',
  'Mumbai': 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=600&q=80',
  'Cape Town': 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=600&q=80',
  'Rio de Janeiro': 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=600&q=80',
  'Vienna': 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=600&q=80',
  'Kyoto': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
  'Mexico City': 'https://images.unsplash.com/photo-1518659526054-e8b8a0bf3f84?auto=format&fit=crop&w=600&q=80',
  'San Francisco': 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=600&q=80',
  'Toronto': 'https://images.unsplash.com/photo-1517090504586-fde19ea6066f?auto=format&fit=crop&w=600&q=80',
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Destinations carousel
  const destinationsAutoplay = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })
  );
  const [destinationsRef, destinationsApi] = useEmblaCarousel(
    { loop: true, align: 'start', skipSnaps: false },
    [destinationsAutoplay.current]
  );

  // Trips carousel
  const [tripsRef, tripsApi] = useEmblaCarousel(
    { loop: false, align: 'start', containScroll: 'trimSnaps' }
  );
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onTripsSelect = useCallback(() => {
    if (!tripsApi) return;
    setCanScrollPrev(tripsApi.canScrollPrev());
    setCanScrollNext(tripsApi.canScrollNext());
  }, [tripsApi]);

  useEffect(() => {
    if (!tripsApi) return;
    onTripsSelect();
    tripsApi.on('select', onTripsSelect);
    tripsApi.on('reInit', onTripsSelect);
  }, [tripsApi, onTripsSelect]);

  useEffect(() => {
    async function loadData() {
      // Auth check
      let currentUser = null;
      try {
        const res = await getMe();
        if (res.ok && res.data) currentUser = res.data;
      } catch {}

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

      // Load cities for Popular Destinations
      try {
        const res = await getCities();
        if (res.ok && res.data) {
          setCities(res.data);
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

  const scrollDestinations = (direction: 'next' | 'prev') => {
    if (!destinationsApi) return;
    destinationsAutoplay.current?.reset();
    if (direction === 'next') {
      destinationsApi.scrollNext();
    } else {
      destinationsApi.scrollPrev();
    }
  };

  const scrollTrips = (direction: 'next' | 'prev') => {
    if (!tripsApi) return;
    if (direction === 'next') {
      tripsApi.scrollNext();
    } else {
      tripsApi.scrollPrev();
    }
  };

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
              {user?.name || 'User'}
            </span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={async () => {
                await logout();
                router.push('/login');
              }}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-12">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Hello, {user?.name?.split(' ')[0]}! 
          </h1>
          <p className="text-slate-500 mt-1">Ready for your next adventure?</p>
        </div>

        {/* 1. Upcoming Trips Section - Now a Carousel */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-sky-500" />
              Upcoming Trips
            </h2>
            <div className="flex items-center gap-2">
              {trips.length > 0 && (
                <>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full"
                    onClick={() => scrollTrips('prev')}
                    disabled={!canScrollPrev}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full"
                    onClick={() => scrollTrips('next')}
                    disabled={!canScrollNext}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                  <Link href="/trips/new">
                    <Button size="sm">
                      <Plus className="h-4 w-4" /> New Trip
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {trips.length > 0 ? (
            <div className="overflow-hidden" ref={tripsRef}>
              <div className="flex gap-6">
                {trips.map((trip) => (
                  <div key={trip.id} className="flex-shrink-0 w-[320px] md:w-[380px]">
                    <Link href={`/trips/${trip.id}`}>
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
                  </div>
                ))}
              </div>
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
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-slate-50 to-transparent pointer-events-none z-10" />
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none z-10" />

            <div ref={destinationsRef} className="overflow-hidden">
              <div className="flex gap-4 pb-4">
                {cities.slice(0, 12).map((city) => (
                  <DestinationCard 
                    key={city.id} 
                    cityId={city.id}
                    city={city.name} 
                    country={city.country} 
                    image={CITY_IMAGES[city.name] || DEFAULT_IMAGE} 
                  />
                ))}
              </div>
            </div>

            <div className="pointer-events-none absolute inset-y-0 left-2 flex items-center z-20">
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full shadow-sm bg-white/90 hover:bg-white pointer-events-auto"
                aria-label="Previous destinations"
                onClick={() => scrollDestinations('prev')}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center z-20">
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full shadow-sm bg-white/90 hover:bg-white pointer-events-auto"
                aria-label="Next destinations"
                onClick={() => scrollDestinations('next')}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
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
          
          <Card className="overflow-hidden p-0 h-[400px] border-2 border-slate-200 relative">
            {visitedLocations.length > 0 ? (
              <MapView 
                locations={visitedLocations} 
                className="h-full w-full rounded-none"
                zoom={visitedLocations.length > 0 ? 3 : 2}
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-sky-50 to-indigo-50">
                <div className="text-center">
                  <Globe className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">Your trips will appear on the map</p>
                </div>
              </div>
            )}
          </Card>
        </section>
      </main>
    </div>
  );
}

function DestinationCard({ cityId, city, country, image }: { cityId: string; city: string; country: string; image: string }) {
  return (
    <Link href={`/trips/new?city=${cityId}`}>
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
    </Link>
  );
}
