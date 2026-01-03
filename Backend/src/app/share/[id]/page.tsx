'use client';

import { use } from 'react';
import Link from 'next/link';
import { Copy, Check, Globe } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useState } from 'react';

export default function SharedTripPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const tripId = resolvedParams.id;
  const [copied, setCopied] = useState(false);

  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe className="h-6 w-6 text-sky-500" />
            <h1 className="text-xl font-bold text-slate-900">GlobeTrotter</h1>
          </div>
          <Link href="/signup">
            <Button>Create Your Own Trip</Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Summer in Paris</h1>
            <p className="text-lg text-slate-500">Curated by Dev User</p>
          </div>
          <Button variant="secondary" onClick={copyLink}>
            {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            {copied ? 'Copied!' : 'Share'}
          </Button>
        </div>

        <Card className="p-8">
          <div className="text-center py-12">
            <p className="text-slate-500">This is a public view of the itinerary.</p>
          </div>
        </Card>
      </main>
    </div>
  );
}

