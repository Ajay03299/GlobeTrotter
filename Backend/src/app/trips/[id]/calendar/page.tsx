'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { getTrip } from '@/lib/api';
import type { Trip, Stop } from '@/types';

interface DayEvent {
  id: string;
  title: string;
  type: string;
  city: string;
  time?: string;
}

interface DayData {
  date: Date;
  city: string | null;
  events: DayEvent[];
}

export default function TripCalendarPage({ params }: { params: Promise<{ id: string }> }) {
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

  if (loading) return <div className="p-12 text-center">Loading calendar...</div>;
  if (!trip) return <div className="p-12 text-center">Trip not found</div>;

  // Generate days between start and end date
  const getDaysArray = (start: string, end: string): Date[] => {
    const arr: Date[] = [];
    const startDate = new Date(start);
    const endDate = new Date(end);
    for (let dt = new Date(startDate); dt <= endDate; dt.setDate(dt.getDate() + 1)) {
      arr.push(new Date(dt));
    }
    return arr;
  };

  const days = trip.startDate && trip.endDate ? getDaysArray(trip.startDate, trip.endDate) : [];

  // Build calendar data: for each day, figure out what city we're in and what activities are scheduled
  const buildCalendarData = (): DayData[] => {
    const stops = trip.stops || [];
    
    return days.map(day => {
      const dateStr = day.toISOString().split('T')[0];
      
      // Find which city we're in on this day
      let currentCity: string | null = null;
      let currentStop: Stop | null = null;
      
      for (const stop of stops) {
        if (stop.startDate && stop.endDate) {
          const stopStart = new Date(stop.startDate).toISOString().split('T')[0];
          const stopEnd = new Date(stop.endDate).toISOString().split('T')[0];
          if (dateStr >= stopStart && dateStr <= stopEnd) {
            currentCity = stop.city?.name || null;
            currentStop = stop;
            break;
          }
        } else if (stop.startDate) {
          // Only start date, assume single day
          const stopStart = new Date(stop.startDate).toISOString().split('T')[0];
          if (dateStr === stopStart) {
            currentCity = stop.city?.name || null;
            currentStop = stop;
            break;
          }
        }
      }

      // If no dates set on stops, distribute evenly or fallback
      if (!currentCity && stops.length > 0) {
        // Try to infer city from stop position based on trip duration
        const tripDuration = days.length;
        const daysPerStop = Math.ceil(tripDuration / stops.length);
        const dayIndex = days.findIndex(d => d.toISOString().split('T')[0] === dateStr);
        const stopIndex = Math.min(Math.floor(dayIndex / daysPerStop), stops.length - 1);
        currentCity = stops[stopIndex]?.city?.name || null;
        currentStop = stops[stopIndex] || null;
      }

      // Get activities for this day
      const events: DayEvent[] = [];
      
      // Check activities with scheduledAt matching this date
      stops.forEach(stop => {
        stop.activities?.forEach(ta => {
          if (ta.scheduledAt) {
            const actDate = new Date(ta.scheduledAt).toISOString().split('T')[0];
            if (actDate === dateStr) {
              const time = new Date(ta.scheduledAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
              events.push({
                id: ta.id,
                title: ta.activity?.name || 'Activity',
                type: ta.activity?.type || 'OTHER',
                city: stop.city?.name || 'Unknown',
                time
              });
            }
          }
        });
      });

      // If we're in a city and there are activities without dates, show them for that stop
      if (currentStop && events.length === 0) {
        currentStop.activities?.forEach(ta => {
          if (!ta.scheduledAt) {
            events.push({
              id: ta.id,
              title: ta.activity?.name || 'Activity',
              type: ta.activity?.type || 'OTHER',
              city: currentStop!.city?.name || 'Unknown'
            });
          }
        });
      }

      return { date: day, city: currentCity, events };
    });
  };

  const calendarData = buildCalendarData();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link href={`/trips/${tripId}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Trip
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-slate-900">Trip Calendar</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {days.length === 0 ? (
          <Card className="p-12 text-center">
            <Calendar className="h-12 w-12 mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500">No dates set for this trip.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {calendarData.map((dayData, idx) => {
              const dateStr = dayData.date.toISOString().split('T')[0];
              return (
                <Card key={dateStr} className="p-0 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row">
                    {/* Date Column */}
                    <div className="md:w-40 shrink-0 bg-slate-100 p-4 flex flex-col justify-center items-center md:items-start border-b md:border-b-0 md:border-r border-slate-200">
                      <div className="text-3xl font-bold text-slate-900">
                        {dayData.date.getDate()}
                      </div>
                      <div className="text-sm text-slate-600">
                        {dayData.date.toLocaleDateString('en-US', { weekday: 'long' })}
                      </div>
                      <div className="text-xs text-slate-400">
                        {dayData.date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </div>
                    </div>

                    {/* Content Column */}
                    <div className="flex-1 p-4">
                      {/* City Badge */}
                      {dayData.city && (
                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm font-medium mb-3">
                          <MapPin className="h-3 w-3" />
                          {dayData.city}
                        </div>
                      )}

                      {/* Activities */}
                      {dayData.events.length > 0 ? (
                        <div className="space-y-2">
                          {dayData.events.map((event) => (
                            <div key={event.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                              {event.time && (
                                <span className="text-xs font-mono text-slate-400 min-w-[70px]">
                                  {event.time}
                                </span>
                              )}
                              <div className="flex-1">
                                <div className="font-semibold text-slate-900">{event.title}</div>
                                <div className="text-xs text-slate-500">{event.type}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-400 italic text-sm">No activities scheduled</p>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
