'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, MoreVertical, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { getTrips, getMe } from '@/lib/api';
import type { Trip } from '@/types';
import { formatDate } from '@/lib/utils';

export default function MyTripsPage() {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Check auth
        const meRes = await getMe();
        if (!meRes.ok) {
          router.push('/login');
          return;
        }

        // Load trips
        const res = await getTrips();
        if (res.ok && res.data) {
          setTrips(res.data);
        }
      } catch (e) {
        console.error(e);
        router.push('/login');
      } finally {
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

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" /> Dashboard
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-slate-900">My Trips</h1>
          </div>
          <Link href="/trips/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" /> New Trip
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-12">Loading trips...</div>
        ) : trips.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <Card key={trip.id} variant="bordered" className="hover:shadow-md transition-all group">
                <Link href={`/trips/${trip.id}`}>
                  <div className="h-40 bg-slate-200 rounded-t-xl relative overflow-hidden">
                    {/* Placeholder gradient until we have real cover photos */}
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-indigo-500 opacity-80 group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="font-bold text-lg truncate">{trip.name}</h3>
                      <div className="flex items-center gap-2 text-sm opacity-90">
                        <Calendar className="h-3 w-3" />
                        {formatDate(trip.startDate || '')}
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                      <MapPin className="h-4 w-4 text-sky-500" />
                      {trip.stops?.length || 0} stops
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`text-xs px-2 py-1 rounded-full ${trip.isPublic ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                        {trip.isPublic ? 'Public' : 'Private'}
                      </span>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-2">No trips yet</h3>
            <p className="text-slate-500 mb-6">Create your first itinerary to get started.</p>
            <Link href="/trips/new">
              <Button>Create Trip</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

