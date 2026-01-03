'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, DollarSign, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { getTrip } from '@/lib/api';
import type { Trip } from '@/types';

export default function TripBudgetPage({ params }: { params: Promise<{ id: string }> }) {
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

  if (loading) return <div className="p-12 text-center">Loading budget details...</div>;
  if (!trip) return <div className="p-12 text-center">Trip not found</div>;

  // Calculate total cost from all activities in the trip
  const activityBreakdown: { name: string; city: string; cost: number }[] = [];
  let totalCost = 0;

  trip.stops?.forEach(stop => {
    stop.activities?.forEach(ta => {
      const cost = ta.activity?.avgCost || 0;
      totalCost += cost;
      activityBreakdown.push({
        name: ta.activity?.name || 'Unknown Activity',
        city: stop.city?.name || 'Unknown City',
        cost
      });
    });
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link href={`/trips/${tripId}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Trip
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-slate-900">Trip Cost</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        
        {/* Total Cost Card */}
        <Card className="p-8 bg-gradient-to-br from-sky-500 to-sky-600 text-white text-center">
          <p className="text-sky-100 font-medium mb-2 text-lg">Total Estimated Cost</p>
          <h2 className="text-5xl font-bold flex items-center justify-center gap-2">
            <span className="text-3xl text-sky-200">$</span>
            {totalCost.toLocaleString()}
          </h2>
          <p className="text-sky-100 mt-2 text-sm">{activityBreakdown.length} activities across {trip.stops?.length || 0} cities</p>
        </Card>

        {/* Activity Breakdown */}
        <Card className="p-6">
          <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-sky-500" /> Activity Cost Breakdown
          </h3>
          
          {activityBreakdown.length > 0 ? (
            <div className="space-y-3">
              {activityBreakdown.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {item.city}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 text-lg">${item.cost.toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl border-dashed border-2 border-slate-200">
              <p>No activities added to this trip yet.</p>
              <p className="text-sm mt-1">Add activities to see the cost breakdown.</p>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
