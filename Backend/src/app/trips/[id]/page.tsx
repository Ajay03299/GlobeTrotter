'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, Edit, Share2, DollarSign, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import MapView from '@/components/maps/MapView';
import { getTrip } from '@/lib/api';
import type { Trip } from '@/types';
import { formatDate } from '@/lib/utils';

export default function TripDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params using React.use()
  const resolvedParams = use(params);
  const tripId = resolvedParams.id;

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrip() {
      try {
        const res = await getTrip(tripId);
        if (res.ok && res.data) {
          setTrip(res.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadTrip();
  }, [tripId]);

  if (loading) return <div className="p-12 text-center">Loading trip details...</div>;
  if (!trip) return <div className="p-12 text-center">Trip not found</div>;

  const mapLocations = trip.stops?.map(stop => ({
    id: stop.id,
    name: stop.city?.name || 'Stop',
    lat: stop.city?.lat || 0,
    lng: stop.city?.lng || 0,
    description: `Stop #${stop.position + 1}`
  })) || [];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/trips">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-slate-900 truncate max-w-md">{trip.name}</h1>
          </div>
          <div className="flex gap-2">
            <Link href={`/trips/${trip.id}/edit`}>
              <Button variant="secondary" size="sm">
                  <Edit className="h-4 w-4 mr-2" /> Edit
              </Button>
            </Link>
            <Link href={`/share/${trip.id}`}>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full grid lg:grid-cols-3 gap-8">
        {/* Left Column: Itinerary & Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Trip Info Card */}
          <Card className="p-6">
            <div className="flex flex-wrap gap-6 mb-6">
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="h-5 w-5 text-sky-500" />
                <span>{formatDate(trip.startDate || '')} — {formatDate(trip.endDate || '')}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="h-5 w-5 text-sky-500" />
                <span>{trip.stops?.length || 0} Destinations</span>
              </div>
            </div>
            <p className="text-slate-600 leading-relaxed">
              {trip.description || 'No description provided.'}
            </p>
            
            <div className="mt-6 flex gap-3">
              <Link href={`/trips/${trip.id}/budget`}>
                <Button variant="secondary" size="sm">
                  <DollarSign className="h-4 w-4 mr-2" /> Budget
                </Button>
              </Link>
              <Link href={`/trips/${trip.id}/calendar`}>
                <Button variant="secondary" size="sm">
                  <CalendarDays className="h-4 w-4 mr-2" /> Calendar
                </Button>
              </Link>
            </div>
          </Card>

          {/* Itinerary Timeline */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Itinerary</h2>
            <div className="space-y-6">
              {trip.stops?.map((stop, index) => (
                <div key={stop.id} className="relative pl-8 border-l-2 border-slate-200 last:border-0">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-sky-500 border-4 border-white shadow-sm" />
                  <div className="mb-6">
                    <h3 className="font-bold text-lg text-slate-900">{stop.city?.name}, {stop.city?.country}</h3>
                    {(stop.startDate || stop.endDate) && (
                      <p className="text-sm text-slate-500 mb-3">
                        {stop.startDate && stop.endDate 
                          ? `${formatDate(stop.startDate)} — ${formatDate(stop.endDate)}`
                          : stop.startDate 
                            ? formatDate(stop.startDate) 
                            : formatDate(stop.endDate)}
                      </p>
                    )}
                    
                    {/* Activities List */}
                    {stop.activities && stop.activities.length > 0 && (
                      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
                        {stop.activities.map((act) => (
                          <div key={act.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                            <span className="font-medium text-slate-700">{act.activity?.name}</span>
                            <span className="text-xs px-2 py-1 bg-white rounded border border-slate-200 text-slate-500">
                              {act.activity?.type}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Map */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <Card className="p-0 overflow-hidden h-[400px] lg:h-[calc(100vh-8rem)]">
              <MapView locations={mapLocations} zoom={4} className="h-full w-full" showPath={true} />
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

