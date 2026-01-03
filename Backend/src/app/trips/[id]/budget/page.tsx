'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, DollarSign, PieChart, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function TripBudgetPage({ params }: { params: Promise<{ id: string }> }) {
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
          <h1 className="text-xl font-bold text-slate-900">Budget Breakdown</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-emerald-50 border-emerald-100">
            <p className="text-emerald-600 font-medium mb-1">Total Budget</p>
            <h2 className="text-3xl font-bold text-emerald-900">$5,000</h2>
          </Card>
          <Card className="p-6 bg-blue-50 border-blue-100">
            <p className="text-blue-600 font-medium mb-1">Spent so far</p>
            <h2 className="text-3xl font-bold text-blue-900">$1,250</h2>
          </Card>
          <Card className="p-6 bg-slate-50 border-slate-200">
            <p className="text-slate-600 font-medium mb-1">Remaining</p>
            <h2 className="text-3xl font-bold text-slate-900">$3,750</h2>
          </Card>
        </div>

        <Card className="p-8 text-center border-dashed border-2">
          <PieChart className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">Cost analysis coming soon</h3>
          <p className="text-slate-500">Track expenses for flights, accommodation, and activities.</p>
        </Card>
      </main>
    </div>
  );
}

