'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Mail, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { getMe, logout } from '@/lib/api';
import type { User as UserType } from '@/types';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await getMe();
        if (res.ok && res.data) {
          setUser(res.data);
        } else {
          router.push('/login');
        }
      } catch (e) {
        console.error(e);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  if (!user) {
    return <div className="p-12 text-center">Failed to load profile</div>;
  }
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
              <h2 className="text-2xl font-bold text-slate-900">{user?.name || 'User'}</h2>
              <p className="text-slate-500">Travel Enthusiast</p>
              <div className="flex gap-3 mt-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={async () => {
                    await logout();
                    router.push('/login');
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </Button>
              </div>
            </div>
          </div>

          <form className="space-y-6">
            <div className="grid gap-6">
              <Input label="Display Name" defaultValue={user?.name || ''} />
              <Input label="Email Address" defaultValue={user?.email || ''} disabled />
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

