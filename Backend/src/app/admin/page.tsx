'use client';

import Link from 'next/link';
import { ArrowLeft, BarChart, Users, Map, Activity } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to App
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Admin Console</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Total Users" value="1,234" icon={<Users className="h-6 w-6" />} color="blue" />
          <StatsCard title="Trips Created" value="856" icon={<Map className="h-6 w-6" />} color="emerald" />
          <StatsCard title="Active Now" value="42" icon={<Activity className="h-6 w-6" />} color="amber" />
          <StatsCard title="Revenue" value="$12k" icon={<BarChart className="h-6 w-6" />} color="violet" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <h3 className="font-bold text-slate-900 mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold">U{i}</div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">User created a new trip</p>
                      <p className="text-xs text-slate-500">2 minutes ago</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-slate-900 mb-6">Top Destinations</h3>
            <div className="space-y-4">
              {['Paris', 'Tokyo', 'New York', 'London', 'Bali'].map((city, i) => (
                <div key={city} className="flex items-center gap-4">
                  <span className="text-slate-400 font-mono w-4">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-slate-900">{city}</span>
                      <span className="text-xs text-slate-500">{90 - i * 10}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-sky-500 rounded-full" style={{ width: `${90 - i * 10}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

function StatsCard({ title, value, icon, color }: { title: string, value: string, icon: React.ReactNode, color: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    violet: 'bg-violet-50 text-violet-600',
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colors[color]}`}>{icon}</div>
      </div>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      <p className="text-sm text-slate-500">{title}</p>
    </Card>
  );
}
