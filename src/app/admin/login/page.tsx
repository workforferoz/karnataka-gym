'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, Lock, User, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('from') || '/admin';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Authentication failed. Please check your credentials.');
        setLoading(false);
        return;
      }

      // Successful login -> Navigate to admin panel
      router.push(redirectPath);
      router.refresh();
    } catch {
      setError('Network communication error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="p-8 rounded-3xl bg-[#0F1420] border-2 border-[#1E273A] shadow-2xl space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex p-3 rounded-2xl bg-[#141A28] border border-[#242F46] text-[#E5A93C] shadow-inner">
          <ShieldCheck className="w-8 h-8 text-[#E5A93C]" />
        </div>
        <div>
          <h1 className="text-xl font-black text-white tracking-wide">
            KARNATAKA <span className="text-[#E5A93C]">GYM</span> ADMIN
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Restricted Operations & Content Management System
          </p>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-start gap-2.5 animate-in fade-in duration-150">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 block">
            Admin Username
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              required
              autoFocus
              autoComplete="username"
              className="w-full pl-10 pr-4 py-3 bg-[#141A28] border border-[#242F46] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A93C] transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 block">
            Security Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter security password"
              required
              autoComplete="current-password"
              className="w-full pl-10 pr-10 py-3 bg-[#141A28] border border-[#242F46] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A93C] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 bg-[#E5A93C] hover:bg-[#F59E0B] disabled:opacity-50 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#E5A93C]/20 cursor-pointer flex items-center justify-center gap-2 mt-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>Verifying Credentials...</span>
            </>
          ) : (
            <span>Access Admin Panel</span>
          )}
        </button>
      </form>

      {/* Security Notice */}
      <div className="pt-2 border-t border-[#1E273A] text-center">
        <p className="text-[11px] text-slate-400">
          Only authorized gym administrators can access this console. All sessions are cryptographically signed and monitored.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden bg-[#07090E]">
      {/* Background Lighting */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-radial from-[#E5A93C]/10 via-transparent to-transparent blur-3xl pointer-events-none select-none"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md space-y-6">
        {/* Return to website */}
        <div className="flex items-center justify-between text-xs">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Public Website</span>
          </Link>
          <span className="text-[10px] font-black uppercase text-[#E5A93C] tracking-widest bg-[#E5A93C]/10 border border-[#E5A93C]/30 px-2 py-0.5 rounded-full">
            Admin Auth
          </span>
        </div>

        <Suspense
          fallback={
            <div className="p-12 rounded-3xl bg-[#0F1420] border-2 border-[#1E273A] text-center">
              <span className="w-6 h-6 border-2 border-[#E5A93C] border-t-transparent rounded-full animate-spin inline-block" />
            </div>
          }
        >
          <AdminLoginForm />
        </Suspense>
      </div>
    </div>
  );
}
