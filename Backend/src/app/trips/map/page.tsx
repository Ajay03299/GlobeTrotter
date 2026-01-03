'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import MapView from '@/components/maps/MapView';
import { Button } from '@/components/ui/Button';

export default function FullMapPage() {
  // Mock locations for now
  const locations = [
    { id: '1', name: 'Paris', lat: 48.8566, lng: 2.3522, description: 'Visited June 2025' },
    { id: '2', name: 'Tokyo', lat: 35.6762, lng: 139.6503, description: 'Upcoming Trip' },
    { id: '3', name: 'New York', lat: 40.7128, lng: -74.0060, description: 'Visited 2024' },
  ];

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between shrink-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-slate-900">Global Map</h1>
        </div>
        <div className="text-sm text-slate-500">
          {locations.length} places pinned
        </div>
      </header>
      
      <div className="flex-1 relative bg-slate-100">
        <MapView 
          locations={locations} 
          className="h-full w-full"
          zoom={3}
        />
      </div>
    </div>
  );
}

