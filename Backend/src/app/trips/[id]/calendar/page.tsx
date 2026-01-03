'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { getTrip } from '@/lib/api';
import type { Trip, Stop } from '@/types';

interface DayEvent {
  id: string;
  title: string;
  type: string;
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
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return arr;
    for (let dt = new Date(startDate); dt <= endDate; dt.setDate(dt.getDate() + 1)) {
      arr.push(new Date(dt));
    }
    return arr;
  };

  const days = trip.startDate && trip.endDate ? getDaysArray(trip.startDate, trip.endDate) : [];

  // Build calendar data
  const buildCalendarData = (): DayData[] => {
    const stops = trip.stops || [];
    
    // Track which activities have been shown (for activities with specific scheduledAt)
    const shownActivityIds = new Set<string>();
    
    return days.map((day, dayIndex) => {
      const dateStr = day.toISOString().split('T')[0];
      
      // Find which city/stop we're in on this day
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
          const stopStart = new Date(stop.startDate).toISOString().split('T')[0];
          if (dateStr === stopStart) {
            currentCity = stop.city?.name || null;
            currentStop = stop;
            break;
          }
        }
      }

      // If no dates set on stops, distribute evenly
      if (!currentCity && stops.length > 0) {
        const tripDuration = days.length;
        const daysPerStop = Math.ceil(tripDuration / stops.length);
        const stopIndex = Math.min(Math.floor(dayIndex / daysPerStop), stops.length - 1);
        currentCity = stops[stopIndex]?.city?.name || null;
        currentStop = stops[stopIndex] || null;
      }

      const events: DayEvent[] = [];
      
      // First, add activities that have scheduledAt matching this specific date
      stops.forEach(stop => {
        stop.activities?.forEach(ta => {
          if (ta.scheduledAt) {
            const actDate = new Date(ta.scheduledAt).toISOString().split('T')[0];
            if (actDate === dateStr) {
              const time = new Date(ta.scheduledAt).toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
              });
              events.push({
                id: ta.id,
                title: ta.activity?.name || 'Activity',
                type: ta.activity?.type || 'OTHER',
                time
              });
              shownActivityIds.add(ta.id);
            }
          }
        });
      });

      // For the FIRST day of a stop, show activities that don't have a scheduled time
      if (currentStop) {
        const isFirstDayOfStop = (() => {
          if (currentStop.startDate) {
            return new Date(currentStop.startDate).toISOString().split('T')[0] === dateStr;
          }
          // If no dates, check if this is the first day we're distributing to this stop
          const stopIndex = stops.indexOf(currentStop);
          const tripDuration = days.length;
          const daysPerStop = Math.ceil(tripDuration / stops.length);
          const expectedFirstDay = stopIndex * daysPerStop;
          return dayIndex === expectedFirstDay;
        })();

        if (isFirstDayOfStop) {
          currentStop.activities?.forEach(ta => {
            if (!ta.scheduledAt && !shownActivityIds.has(ta.id)) {
              events.push({
                id: ta.id,
                title: ta.activity?.name || 'Activity',
                type: ta.activity?.type || 'OTHER'
              });
              shownActivityIds.add(ta.id);
            }
          });
        }
      }

      // Sort events: those with times first (sorted by time), then those without
      events.sort((a, b) => {
        if (a.time && b.time) {
          const timeA = new Date(`1970-01-01 ${a.time}`).getTime();
          const timeB = new Date(`1970-01-01 ${b.time}`).getTime();
          return timeA - timeB;
        }
        if (a.time && !b.time) return -1;
        if (!a.time && b.time) return 1;
        return 0;
      });

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
          <div className="space-y-3">
            {calendarData.map((dayData) => {
              const dateStr = dayData.date.toISOString().split('T')[0];
              const hasActivities = dayData.events.length > 0;
              
              return (
                <Card key={dateStr} className={`p-0 overflow-hidden transition-shadow ${hasActivities ? 'hover:shadow-md' : ''}`}>
                  <div className="flex flex-col md:flex-row">
                    {/* Date Column */}
                    <div className={`md:w-36 shrink-0 p-4 flex flex-col justify-center items-center md:items-start border-b md:border-b-0 md:border-r ${hasActivities ? 'bg-sky-50 border-sky-100' : 'bg-slate-50 border-slate-200'}`}>
                      <div className={`text-3xl font-bold ${hasActivities ? 'text-sky-900' : 'text-slate-700'}`}>
                        {dayData.date.getDate()}
                      </div>
                      <div className={`text-sm ${hasActivities ? 'text-sky-700' : 'text-slate-500'}`}>
                        {dayData.date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <div className="text-xs text-slate-400">
                        {dayData.date.toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                    </div>

                    {/* Content Column */}
                    <div className="flex-1 p-4">
                      {/* City Badge - always shown if we have a city */}
                      {dayData.city && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                          <MapPin className="h-3.5 w-3.5" />
                          {dayData.city}
                        </div>
                      )}

                      {/* Activities */}
                      {hasActivities && (
                        <div className="mt-3 space-y-2">
                          {dayData.events.map((event) => (
                            <div key={event.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                              {event.time && (
                                <div className="flex items-center gap-1.5 text-sky-600 min-w-[85px]">
                                  <Clock className="h-3.5 w-3.5" />
                                  <span className="text-sm font-medium">{event.time}</span>
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="font-semibold text-slate-900">{event.title}</div>
                                <div className="text-xs text-slate-500 capitalize">{event.type.toLowerCase()}</div>
                              </div>
                            </div>
                          ))}
                        </div>
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
