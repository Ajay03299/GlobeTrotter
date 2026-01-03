'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Plus, MapPin, Calendar, Trash2, Check, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { CitySearch } from '@/components/trips/CitySearch';
import MapView from '@/components/maps/MapView';
import { createTrip, getActivities, getCities, getMe } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import type { City, Activity } from '@/types';
import Link from 'next/link';

// ==========================================
// TYPES
// ==========================================

interface SelectedActivity extends Activity {
  tempId: string; // unique id for frontend list
  scheduledAt?: string;
}

interface TripStop {
  tempId: string;
  city: City;
  startDate?: string;
  endDate?: string;
  activities: SelectedActivity[];
}

interface TripData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  stops: TripStop[];
}

// ==========================================
// CITY SELECTOR COMPONENT
// ==========================================

function CitySelector({ onSelect, onCancel }: { onSelect: (city: City) => void; onCancel: () => void }) {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState<string>("");

  useEffect(() => {
    async function fetchCities() {
      setLoading(true);
      try {
        const res = await getCities(); // Fetch default list
        if (res.ok && res.data) {
          setCities(res.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchCities();
  }, []);

  const handleSelect = () => {
    const city = cities.find(c => c.id === selectedCityId);
    if (city) {
      onSelect(city);
    }
  };

  if (loading) return <div className="text-center py-4"><Loader2 className="h-6 w-6 animate-spin mx-auto text-sky-600" /></div>;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Select a Destination</label>
        <select 
          className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-sky-500"
          value={selectedCityId}
          onChange={(e) => setSelectedCityId(e.target.value)}
        >
          <option value="">-- Choose a city --</option>
          {cities.map(city => (
            <option key={city.id} value={city.id}>
              {city.name}, {city.country}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSelect} disabled={!selectedCityId}>Add City</Button>
      </div>
    </div>
  );
}

// ==========================================
// ACTIVITY SELECTOR COMPONENT
// ==========================================

function ActivitySelector({ cityId, onSelect, onCancel }: { cityId: string; onSelect: (act: Activity) => void; onCancel: () => void }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<string>("");

  useEffect(() => {
    async function fetchActivities() {
      setLoading(true);
      try {
        const res = await getActivities(cityId);
        if (res.ok && res.data) {
          setActivities(res.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    if (cityId) fetchActivities();
  }, [cityId]);

  const handleAdd = () => {
    const act = activities.find(a => a.id === selectedActivityId);
    if (act) {
      onSelect(act);
    }
  };

  if (loading) return <div className="text-center py-4 text-sm text-slate-500">Loading activities...</div>;
  if (activities.length === 0) return <div className="text-center py-4 text-sm text-slate-500">No activities found for this city.</div>;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Select an Activity</label>
        <select
          className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-sky-500"
          value={selectedActivityId}
          onChange={(e) => setSelectedActivityId(e.target.value)}
        >
          <option value="">-- Choose an activity --</option>
          {activities.map(act => (
            <option key={act.id} value={act.id}>
              {act.name} ({act.type}) - ${act.avgCost}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={onCancel} size="sm">Cancel</Button>
        <Button onClick={handleAdd} disabled={!selectedActivityId} size="sm">Add Activity</Button>
      </div>
    </div>
  );
}

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================

export default function CreateTripPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [data, setData] = useState<TripData>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    stops: []
  });

  // Check auth on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await getMe();
        if (!res.ok) {
          router.push('/login');
          return;
        }

        // Check for pre-selected city from query params
        const cityId = searchParams.get('city');
        if (cityId) {
          try {
            const citiesRes = await getCities();
            if (citiesRes.ok && citiesRes.data) {
              const selectedCity = citiesRes.data.find(c => c.id === cityId);
              if (selectedCity) {
                setData(prev => ({
                  ...prev,
                  stops: [{ tempId: Math.random().toString(36), city: selectedCity, activities: [] }]
                }));
              }
            }
          } catch (e) {
            console.error('Failed to load city:', e);
          }
        }

        setLoading(false);
      } catch (e) {
        console.error(e);
        router.push('/login');
      }
    }
    checkAuth();
  }, [router, searchParams]);

  // --- Step 1 Handlers ---
  const canProceedStep1 = data.name && data.startDate && data.endDate;

  // --- Step 2 Handlers ---
  const [showCitySearch, setShowCitySearch] = useState(false);
  const [activeCityForActivity, setActiveCityForActivity] = useState<string | null>(null);

  const addCity = (city: City) => {
    setData(prev => ({
      ...prev,
      stops: [...prev.stops, { tempId: Math.random().toString(36), city, activities: [] }]
    }));
    setShowCitySearch(false);
  };

  const removeCity = (stopTempId: string) => {
    setData(prev => ({
      ...prev,
      stops: prev.stops.filter(s => s.tempId !== stopTempId)
    }));
  };

  const addActivity = (stopTempId: string, activity: Activity) => {
    setData(prev => ({
      ...prev,
      stops: prev.stops.map(s => {
        if (s.tempId === stopTempId) {
          // Check if already added
          if (s.activities.some(a => a.id === activity.id)) return s;
          return {
            ...s,
            activities: [...s.activities, { ...activity, tempId: Math.random().toString(36) }]
          };
        }
        return s;
      })
    }));
    setActiveCityForActivity(null);
  };

  const removeActivity = (stopTempId: string, activityTempId: string) => {
    setData(prev => ({
      ...prev,
      stops: prev.stops.map(s => {
        if (s.tempId === stopTempId) {
          return {
            ...s,
            activities: s.activities.filter(a => a.tempId !== activityTempId)
          };
        }
        return s;
      })
    }));
  };

  const updateStopDate = (stopTempId: string, field: 'startDate' | 'endDate', value: string) => {
    setData(prev => ({
      ...prev,
      stops: prev.stops.map(s => {
        if (s.tempId === stopTempId) {
          return { ...s, [field]: value };
        }
        return s;
      })
    }));
  };

  const updateActivityTime = (stopTempId: string, activityTempId: string, time: string) => {
    setData(prev => ({
      ...prev,
      stops: prev.stops.map(s => {
        if (s.tempId === stopTempId) {
          return {
            ...s,
            activities: s.activities.map(a => 
              a.tempId === activityTempId ? { ...a, scheduledAt: time } : a
            )
          };
        }
        return s;
      })
    }));
  };

  // --- Submit Handler ---
  async function handleSubmit() {
    if (submitting) return;
    setSubmitting(true);
    try {
      const payload = {
        name: data.name,
        description: data.description,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
        stops: data.stops.map((stop, index) => ({
          cityId: stop.city.id,
          position: index,
          startDate: stop.startDate ? new Date(stop.startDate).toISOString() : undefined,
          endDate: stop.endDate ? new Date(stop.endDate).toISOString() : undefined,
          activities: stop.activities.map((act, actIndex) => ({
            activityId: act.id,
            position: actIndex,
            scheduledAt: act.scheduledAt ? new Date(act.scheduledAt).toISOString() : undefined
          }))
        }))
      };

      const res = await createTrip(payload);
      if (res.ok && res.data) {
        router.push(`/trips/${res.data.id}`);
      } else {
        alert('Failed to create trip');
      }
    } catch (e) {
      console.error(e);
      alert('An error occurred');
    } finally {
      setSubmitting(false);
    }
  }

  // --- Map Data for Steps 2 & 3 ---
  const mapLocations = data.stops.map((stop, idx) => ({
    id: stop.tempId,
    name: stop.city.name,
    lat: stop.city.lat,
    lng: stop.city.lng,
    description: `Stop ${idx + 1}`
  }));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  // ==========================================
  // RENDER STEP 1: DETAILS
  // ==========================================
  if (step === 1) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/dashboard" className="inline-flex items-center text-slate-500 hover:text-slate-900 mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Link>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Create New Trip</h1>
          <p className="text-slate-500">Start by giving your trip a name and dates.</p>
        </div>

        <Card className="p-8 space-y-6">
          <Input 
            label="Trip Name" 
            placeholder="e.g. European Summer"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Start Date</label>
              <input 
                type="date"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-sky-500 focus:outline-none transition-colors"
                value={data.startDate}
                onChange={(e) => setData({ ...data, startDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">End Date</label>
              <input 
                type="date"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-sky-500 focus:outline-none transition-colors"
                value={data.endDate}
                onChange={(e) => setData({ ...data, endDate: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
            <textarea 
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-sky-500 focus:outline-none transition-colors min-h-[100px]"
              placeholder="What's the plan?"
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={() => setStep(2)} disabled={!canProceedStep1}>
              Next: Build Itinerary <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // ==========================================
  // RENDER STEP 2: ITINERARY BUILDER
  // ==========================================
  if (step === 2) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <h1 className="text-xl font-bold text-slate-900">Build Itinerary</h1>
          </div>
          <Button onClick={() => setStep(3)} disabled={data.stops.length === 0}>
            Preview Trip <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </header>

        <div className="flex-1 grid lg:grid-cols-2 overflow-hidden h-[calc(100vh-73px)]">
          {/* Left: Form Area */}
          <div className="overflow-y-auto p-6 space-y-6 bg-slate-50">
            {data.stops.map((stop, index) => (
              <Card key={stop.tempId} className="p-5 relative group">
                <button 
                  onClick={() => removeCity(stop.tempId)}
                  className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{stop.city.name}</h3>
                    <p className="text-sm text-slate-500">{stop.city.country}</p>
                  </div>
                </div>

                {/* Dates Selection */}
                <div className="mb-4 grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">Arrival</label>
                    <input 
                      type="date" 
                      className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 focus:border-sky-500 focus:outline-none"
                      value={stop.startDate || ''}
                      onChange={(e) => updateStopDate(stop.tempId, 'startDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">Departure</label>
                    <input 
                      type="date" 
                      className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 focus:border-sky-500 focus:outline-none"
                      value={stop.endDate || ''}
                      onChange={(e) => updateStopDate(stop.tempId, 'endDate', e.target.value)}
                    />
                  </div>
                </div>

                {/* Activities List */}
                <div className="space-y-3 pl-11">
                  {stop.activities.map((act) => (
                    <div key={act.tempId} className="p-3 bg-white border border-slate-100 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-medium text-slate-900">{act.name}</div>
                          <div className="text-xs text-slate-500">{act.type} • {act.durationMin}m</div>
                        </div>
                        <button onClick={() => removeActivity(stop.tempId, act.tempId)} className="text-slate-300 hover:text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex gap-2">
                         <input 
                            type="datetime-local"
                            className="text-xs w-full px-2 py-1 rounded border border-slate-200 focus:border-sky-500 focus:outline-none"
                            placeholder="Schedule time"
                            value={act.scheduledAt || ''}
                            onChange={(e) => updateActivityTime(stop.tempId, act.tempId, e.target.value)}
                         />
                      </div>
                    </div>
                  ))}

                  {activeCityForActivity === stop.tempId ? (
                    <div className="bg-white p-4 border border-slate-200 rounded-lg animate-in fade-in zoom-in-95 duration-200">
                      <ActivitySelector 
                        cityId={stop.city.id} 
                        onSelect={(act) => addActivity(stop.tempId, act)} 
                        onCancel={() => setActiveCityForActivity(null)}
                      />
                    </div>
                  ) : (
                    <Button variant="ghost" size="sm" className="text-sky-600 hover:text-sky-700 hover:bg-sky-50" onClick={() => setActiveCityForActivity(stop.tempId)}>
                      <Plus className="h-4 w-4 mr-2" /> Add Activity
                    </Button>
                  )}
                </div>
              </Card>
            ))}

            {showCitySearch ? (
              <Card className="p-6 animate-in fade-in slide-in-from-bottom-4">
                <CitySelector 
                  onSelect={addCity} 
                  onCancel={() => setShowCitySearch(false)}
                />
              </Card>
            ) : (
              <Button variant="secondary" className="w-full py-8 border-2 border-dashed bg-transparent hover:bg-slate-50 text-slate-500 hover:text-slate-900" onClick={() => setShowCitySearch(true)}>
                <Plus className="h-5 w-5 mr-2" /> Add City
              </Button>
            )}
          </div>

          {/* Right: Map Area */}
          <div className="h-full relative border-l border-slate-200">
            <MapView locations={mapLocations} showPath={true} className="h-full w-full" />
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER STEP 3: PREVIEW
  // ==========================================
  if (step === 3) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link href="#" onClick={() => setStep(2)} className="inline-flex items-center text-slate-500 hover:text-slate-900 mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Itinerary
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header Preview */}
          <div className="p-8 border-b border-slate-200 bg-slate-50">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{data.name}</h1>
            <div className="flex gap-4 text-slate-600 text-sm">
              <span className="flex items-center"><Calendar className="h-4 w-4 mr-2" /> {formatDate(data.startDate)} — {formatDate(data.endDate)}</span>
              <span className="flex items-center"><MapPin className="h-4 w-4 mr-2" /> {data.stops.length} Cities</span>
            </div>
            {data.description && <p className="mt-4 text-slate-600">{data.description}</p>}
          </div>

          {/* Itinerary Preview */}
          <div className="p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Itinerary Summary</h2>
            <div className="space-y-8">
              {data.stops.map((stop, idx) => (
                <div key={stop.tempId} className="relative pl-8 border-l-2 border-slate-200 last:border-0">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-sky-500 border-4 border-white shadow-sm" />
                  <div className="mb-6">
                    <h3 className="font-bold text-lg text-slate-900">{stop.city.name}, {stop.city.country}</h3>
                    {(stop.startDate || stop.endDate) && (
                      <p className="text-sm text-slate-500 mb-2">
                        {stop.startDate ? formatDate(stop.startDate) : 'TBD'} — {stop.endDate ? formatDate(stop.endDate) : 'TBD'}
                      </p>
                    )}
                    {stop.activities.length > 0 && (
                      <div className="mt-3 grid gap-2">
                        {stop.activities.map(act => (
                          <div key={act.tempId} className="bg-slate-50 p-3 rounded-lg flex justify-between items-center text-sm">
                            <span className="font-medium text-slate-700">{act.name}</span>
                            <span className="text-slate-500">{act.type}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-8 bg-slate-50 border-t border-slate-200 flex justify-end gap-4">
            <Button size="lg" onClick={handleSubmit} isLoading={submitting}>
              {submitting ? 'Creating...' : 'Confirm & Create Trip'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
