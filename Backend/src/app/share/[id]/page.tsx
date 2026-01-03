'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { Copy, Check, Globe, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { getTrip } from '@/lib/api';
import type { Trip } from '@/types';
import { formatDate } from '@/lib/utils';
import MapView from '@/components/maps/MapView';

export default function SharedTripPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const tripId = resolvedParams.id;
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

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

  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) return <div className="p-12 text-center">Loading trip...</div>;
  if (!trip) return <div className="p-12 text-center">Trip not found or is private.</div>;

  const mapLocations = trip.stops?.map(stop => ({
    id: stop.id,
    name: stop.city?.name || 'Stop',
    lat: stop.city?.lat || 0,
    lng: stop.city?.lng || 0,
    description: `Stop #${stop.position + 1}`
  })) || [];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <Globe className="h-6 w-6 text-sky-500" />
              <h1 className="text-xl font-bold text-slate-900">GlobeTrotter</h1>
            </Link>
          </div>
          <Link href="/signup">
            <Button>Create Your Own Trip</Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">{trip.name}</h1>
            <p className="text-lg text-slate-500 flex items-center gap-2">
               <Calendar className="h-4 w-4" /> 
               {formatDate(trip.startDate || '')} — {formatDate(trip.endDate || '')}
            </p>
          </div>
          <Button variant="secondary" onClick={copyLink}>
            {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            {copied ? 'Copied!' : 'Share Trip'}
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                {trip.description && (
                    <Card className="p-6">
                        <h3 className="font-bold text-slate-900 mb-2">About this trip</h3>
                        <p className="text-slate-600 leading-relaxed">{trip.description}</p>
                    </Card>
                )}

                <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Itinerary</h2>
                    <div className="space-y-6">
                        {trip.stops?.map((stop) => (
                            <div key={stop.id} className="relative pl-8 border-l-2 border-slate-200 last:border-0">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-sky-500 border-4 border-white shadow-sm" />
                                <div className="mb-6">
                                    <h3 className="font-bold text-lg text-slate-900">{stop.city?.name}, {stop.city?.country}</h3>
                                    
                                    {stop.activities && stop.activities.length > 0 && (
                                        <div className="mt-3 space-y-2">
                                            {stop.activities.map((act) => (
                                                <div key={act.id} className="p-3 bg-white border border-slate-100 rounded-lg flex justify-between items-center">
                                                    <span className="font-medium text-slate-700">{act.activity?.name}</span>
                                                    <span className="text-xs text-slate-500">{act.activity?.type}</span>
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

            <div className="lg:col-span-1">
                <div className="sticky top-24">
                    <Card className="p-0 overflow-hidden h-[400px]">
                        <MapView locations={mapLocations} zoom={4} className="h-full w-full" showPath={true} />
                    </Card>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}

