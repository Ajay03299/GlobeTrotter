'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plane, Eye, EyeOff, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const requirements = [
    { met: password.length >= 8, text: 'At least 8 characters' },
    { met: /[a-zA-Z]/.test(password), text: 'Contains a letter' },
    { met: /[0-9]/.test(password), text: 'Contains a number' },
  ];

  const isPasswordValid = requirements[0].met && requirements[1].met;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!isPasswordValid) {
      setError('Please meet all password requirements');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (data.ok) {
        router.push('/dashboard');
      } else {
        setError(data.error?.message || 'Could not create account');
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
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80"
          alt="Tropical beach paradise"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/80 via-teal-500/60 to-emerald-600/80" />
        
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
              Start your journey today
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Join thousands of travelers who plan their dream vacations with GlobeTrotter.
            </p>
          </div>
          
          {/* Footer */}
          <p className="text-white/60 text-sm">
            © 2026 GlobeTrotter. Explore the world.
          </p>
        </div>
      </div>

      {/* Right - Signup Form */}
      <div className="flex flex-col bg-white">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center gap-3 p-6 border-b border-slate-200">
          <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center">
            <Plane className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900">GlobeTrotter</span>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-slate-50 lg:bg-white">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center lg:text-left mb-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Create your account
              </h2>
              <p className="text-lg text-slate-500">
                Start planning your dream trips
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
                label="Full name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                autoComplete="name"
              />

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
                    placeholder="Create a strong password"
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-10 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                {/* Password Requirements */}
                {password.length > 0 && (
                  <div className="mt-4 p-4 bg-slate-100 rounded-xl space-y-2">
                    {requirements.map((req, i) => (
                      <div key={i} className={`flex items-center gap-3 ${req.met ? 'text-emerald-600' : 'text-slate-400'}`}>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${req.met ? 'bg-emerald-100' : 'bg-slate-200'}`}>
                          {req.met ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        </div>
                        <span className="text-sm font-medium">{req.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button 
                type="submit" 
                size="lg" 
                fullWidth 
                isLoading={loading}
                disabled={password.length > 0 && !isPasswordValid}
              >
                Create account
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-slate-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-slate-50 lg:bg-white text-slate-500 text-sm">
                  Already have an account?
                </span>
              </div>
            </div>

            {/* Sign In Link */}
            <Link href="/login">
              <Button variant="secondary" size="lg" fullWidth>
                Sign in instead
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
