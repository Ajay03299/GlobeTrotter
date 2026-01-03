'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function TripCalendarPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const tripId = resolvedParams.id;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link href={`/trips/${tripId}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Trip
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-slate-900">Trip Calendar</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <Card className="p-12 text-center border-dashed border-2 h-[500px] flex flex-col items-center justify-center">
          <CalendarIcon className="h-16 w-16 text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">Timeline View</h3>
          <p className="text-slate-500">Drag and drop activities to organize your schedule.</p>
        </Card>
      </main>
    </div>
  );
}

