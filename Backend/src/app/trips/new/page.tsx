'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Calendar, FileText, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { CitySearch } from '@/components/trips/CitySearch';
import { createTrip } from '@/lib/api';
import Link from 'next/link';
import type { City } from '@/types';

function CreateTripForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCityId = searchParams.get('city');

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [tripName, setTripName] = useState('');
  const [dates, setDates] = useState({ start: '', end: '' });
  const [description, setDescription] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCity || !tripName || !dates.start || !dates.end) return;

    setLoading(true);
    
    try {
      const res = await createTrip({
        name: tripName,
        description,
        startDate: new Date(dates.start).toISOString(),
        endDate: new Date(dates.end).toISOString(),
      });

      if (res.ok) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error(error);
    }
    
    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link href="/dashboard" className="inline-flex items-center text-slate-500 hover:text-slate-900 mb-8">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
      </Link>

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Create New Trip</h1>
        <p className="text-slate-500">Let's start planning your next adventure.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {/* Step 1: Destination */}
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center shrink-0">
                <span className="font-bold text-sky-600">1</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-1">Where are you going?</h3>
                <p className="text-slate-500 mb-4 text-sm">Search for a city to start your itinerary.</p>
                
                {selectedCity ? (
                  <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <div>
                      <h4 className="font-bold text-slate-900">{selectedCity.name}</h4>
                      <p className="text-sm text-slate-500">{selectedCity.country}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedCity(null)}>
                      Change
                    </Button>
                  </div>
                ) : (
                  <CitySearch onSelect={setSelectedCity} />
                )}
              </div>
            </div>
          </Card>

          {/* Step 2: Trip Details */}
          {selectedCity && (
            <Card className="p-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="font-bold text-sky-600">2</span>
                </div>
                <div className="flex-1 space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Trip Details</h3>
                    <p className="text-slate-500 mb-4 text-sm">Give your trip a name and dates.</p>
                  </div>

                  <Input 
                    label="Trip Name" 
                    placeholder={`e.g. Summer in ${selectedCity.name}`}
                    value={tripName}
                    onChange={(e) => setTripName(e.target.value)}
                    required
                  />

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Start Date</label>
                      <input 
                        type="date" 
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-sky-500 focus:outline-none transition-colors"
                        value={dates.start}
                        onChange={(e) => setDates({...dates, start: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">End Date</label>
                      <input 
                        type="date" 
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-sky-500 focus:outline-none transition-colors"
                        value={dates.end}
                        onChange={(e) => setDates({...dates, end: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Description (Optional)</label>
                    <textarea 
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-sky-500 focus:outline-none transition-colors min-h-[100px]"
                      placeholder="What's this trip about?"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Submit Button */}
          {selectedCity && (
            <div className="flex justify-end pt-4 animate-in fade-in duration-500">
              <Button type="submit" size="lg" isLoading={loading}>
                Create Trip
              </Button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default function CreateTripPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading...</div>}>
      <CreateTripForm />
    </Suspense>
  );
}

