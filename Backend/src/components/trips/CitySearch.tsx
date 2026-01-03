'use client';

import { useState } from 'react';
import { Search, MapPin, Plus } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { getCities } from '@/lib/api';
import type { City } from '@/types';
import Link from 'next/link';

interface CitySearchProps {
  onSelect?: (city: City) => void;
  compact?: boolean;
}

export function CitySearch({ onSelect, compact = false }: CitySearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);
    
    try {
      const res = await getCities(query);
      if (res.ok && res.data) {
        setResults(res.data);
      } else {
        setResults([]);
      }
    } catch {
      setResults([]);
    }
    
    setLoading(false);
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Input 
            placeholder="Search destinations (e.g. Paris, Tokyo)..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
        </div>
        <Button type="submit" isLoading={loading}>
          Search
        </Button>
      </form>

      {/* Results */}
      {hasSearched && (
        <div className="mt-4 space-y-3">
          {results.length === 0 ? (
            <p className="text-center text-slate-500 py-4">No destinations found.</p>
          ) : (
            results.map((city) => (
              <Card key={city.id} className="p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-sky-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{city.name}</h3>
                    <p className="text-sm text-slate-500">{city.country}</p>
                  </div>
                </div>
                
                {onSelect ? (
                  <Button size="sm" variant="secondary" onClick={() => onSelect(city)}>
                    Select
                  </Button>
                ) : (
                  <Link href={`/trips/new?city=${city.id}`}>
                    <Button size="sm" variant="secondary">
                      <Plus className="h-4 w-4" />
                      Plan Trip
                    </Button>
                  </Link>
                )}
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}


