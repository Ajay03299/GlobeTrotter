'use client';

import Link from 'next/link';
import { ArrowLeft, Bell, Lock, Globe, Moon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link href="/profile">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" /> Profile
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-slate-900">Settings</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12 space-y-6">
        <Card className="divide-y divide-slate-100">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-slate-100 rounded-lg"><Bell className="h-5 w-5 text-slate-600" /></div>
              <div>
                <h3 className="font-semibold text-slate-900">Notifications</h3>
                <p className="text-sm text-slate-500">Manage your email alerts</p>
              </div>
            </div>
            <div className="relative inline-block w-12 h-6 rounded-full bg-slate-200 cursor-pointer">
              <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform" />
            </div>
          </div>

          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-slate-100 rounded-lg"><Lock className="h-5 w-5 text-slate-600" /></div>
              <div>
                <h3 className="font-semibold text-slate-900">Privacy</h3>
                <p className="text-sm text-slate-500">Control who sees your trips</p>
              </div>
            </div>
            <Button variant="secondary" size="sm">Manage</Button>
          </div>

          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-slate-100 rounded-lg"><Globe className="h-5 w-5 text-slate-600" /></div>
              <div>
                <h3 className="font-semibold text-slate-900">Language</h3>
                <p className="text-sm text-slate-500">English (US)</p>
              </div>
            </div>
            <Button variant="secondary" size="sm">Change</Button>
          </div>
        </Card>

        <Card className="p-6 border-red-100 bg-red-50/50">
          <h3 className="font-bold text-red-700 mb-2">Danger Zone</h3>
          <p className="text-red-600 text-sm mb-4">Once you delete your account, there is no going back.</p>
          <Button variant="danger" size="sm">Delete Account</Button>
        </Card>
      </main>
    </div>
  );
}


