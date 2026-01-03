'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Save, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

export default function EditTripPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const tripId = resolvedParams.id;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/trips/${tripId}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" /> Cancel
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-slate-900">Itinerary Builder</h1>
          </div>
          <Button onClick={() => router.push(`/trips/${tripId}`)}>
            <Save className="h-4 w-4 mr-2" /> Save Changes
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 flex gap-8">
        <div className="flex-1 space-y-6">
          <Card className="p-6 border-dashed border-2 flex items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-50 transition-colors h-32">
            <div className="text-center">
              <Plus className="h-8 w-8 mx-auto mb-2 text-slate-400" />
              <span className="font-medium">Add Stop / Activity</span>
            </div>
          </Card>
          
          {[1, 2].map((day) => (
            <Card key={day} className="p-6">
              <h3 className="font-bold text-lg mb-4 text-slate-900">Day {day}</h3>
              <div className="space-y-3">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-medium">Activity {day}</div>
                  <div className="text-sm text-slate-500">10:00 AM - 12:00 PM</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="w-80 space-y-6">
          <Card className="p-4 bg-sky-50 border-sky-100">
            <h4 className="font-bold text-sky-900 mb-2">Builder Tips</h4>
            <p className="text-sm text-sky-700">Drag and drop activities to reorder them.</p>
          </Card>
        </div>
      </main>
    </div>
  );
}

