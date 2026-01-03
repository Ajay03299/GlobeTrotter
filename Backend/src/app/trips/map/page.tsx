'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import MapView from '@/components/maps/MapView';
import { Button } from '@/components/ui/Button';
import { getMe, getTrips } from '@/lib/api';
import type { Trip } from '@/types';

interface MapLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description?: string;
}

export default function FullMapPage() {
  const router = useRouter();
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTripsMap() {
      try {
        // Check auth
        const meRes = await getMe();
        if (!meRes.ok) {
          router.push('/login');
          return;
        }

        // Load trips
        const tripsRes = await getTrips();
        if (tripsRes.ok && tripsRes.data) {
          const mapLocs: MapLocation[] = [];
          tripsRes.data.forEach((trip: Trip) => {
            trip.stops?.forEach((stop, idx) => {
              if (stop.city) {
                mapLocs.push({
                  id: stop.id,
                  name: stop.city.name,
                  lat: stop.city.lat,
                  lng: stop.city.lng,
                  description: `${trip.name} - Stop ${idx + 1}`
                });
              }
            });
          });
          setLocations(mapLocs);
        }
      } catch (e) {
        console.error(e);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    loadTripsMap();
  }, [router]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between shrink-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-slate-900">Global Map</h1>
        </div>
        <div className="text-sm text-slate-500">
          {locations.length} places pinned
        </div>
      </header>
      
      <div className="flex-1 relative bg-slate-100">
        <MapView 
          locations={locations} 
          className="h-full w-full"
          zoom={3}
        />
      </div>
    </div>
  );
}


