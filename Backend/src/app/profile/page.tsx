'use client';

import Link from 'next/link';
import { ArrowLeft, User, Mail, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" /> Dashboard
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-slate-900">My Profile</h1>
          </div>
          <Link href="/settings">
            <Button variant="ghost" size="sm">
              <SettingsIcon className="h-4 w-4 mr-2" /> Settings
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <Card className="p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-sky-100 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-sky-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Dev User</h2>
              <p className="text-slate-500">Travel Enthusiast</p>
            </div>
          </div>

          <form className="space-y-6">
            <div className="grid gap-6">
              <Input label="Display Name" defaultValue="Dev User" />
              <Input label="Email Address" defaultValue="dev@globetrotter.com" disabled />
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Bio</label>
                <textarea 
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-sky-500 outline-none"
                  rows={4}
                  placeholder="Tell us about your travel style..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button variant="secondary">Cancel</Button>
              <Button>Save Changes</Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}

