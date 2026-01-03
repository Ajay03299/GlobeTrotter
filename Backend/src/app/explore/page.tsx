'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CitySearch } from '@/components/trips/CitySearch';

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" /> Dashboard
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-slate-900">Explore Destinations</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Where do you want to go?</h2>
          <p className="text-slate-500 mb-8">Discover new places and start planning your next adventure.</p>
          
          <Card className="p-2 shadow-lg">
            <CitySearch />
          </Card>
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-6">Popular Right Now</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {['Paris', 'Tokyo', 'Bali', 'New York', 'London', 'Rome'].map((city) => (
              <Card key={city} className="p-4 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-sky-600" />
                  </div>
                  <span className="font-semibold text-slate-900">{city}</span>
                </div>
                <Link href={`/trips/new?city=${city}`}>
                  <Button size="sm" variant="ghost">
                    <Plus className="h-4 w-4" />
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

