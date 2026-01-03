'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plane, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.ok) {
        router.push('/dashboard');
      } else {
        setError(data.error?.message || 'Invalid email or password');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left - Hero Image */}
      <div className="hidden lg:block relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1920&q=80"
          alt="Airplane wing above clouds"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-sky-600/80 via-sky-500/60 to-indigo-600/80" />
        
        <div className="relative z-10 h-full flex flex-col justify-between p-12">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Plane className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">GlobeTrotter</span>
          </div>
          
          {/* Tagline */}
          <div className="max-w-lg">
            <h1 className="text-5xl font-bold text-white leading-tight mb-6">
              Your next adventure awaits
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Plan trips, discover destinations, and create unforgettable memories with our intuitive travel planner.
            </p>
          </div>
          
          {/* Footer */}
          <p className="text-white/60 text-sm">
            © 2026 GlobeTrotter. Explore the world.
          </p>
        </div>
      </div>

      {/* Right - Login Form */}
      <div className="flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center gap-3 p-6 border-b border-slate-200">
          <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center">
            <Plane className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900">GlobeTrotter</span>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center lg:text-left mb-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Welcome back
              </h2>
              <p className="text-lg text-slate-500">
                Sign in to your account to continue
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                autoComplete="email"
              />

              <div>
                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-10 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-2 border-slate-300 text-sky-500 focus:ring-sky-500 focus:ring-offset-0" 
                  />
                  <span className="text-sm text-slate-600">Remember me</span>
                </label>
                <a href="#" className="text-sm font-semibold text-sky-600 hover:text-sky-700">
                  Forgot password?
                </a>
              </div>

              <Button type="submit" size="lg" fullWidth isLoading={loading}>
                Sign in
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-slate-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-slate-500 text-sm">
                  New to GlobeTrotter?
                </span>
              </div>
            </div>

            {/* Sign Up Link */}
            <Link href="/signup">
              <Button variant="secondary" size="lg" fullWidth>
                Create an account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
