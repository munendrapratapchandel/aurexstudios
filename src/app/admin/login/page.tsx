'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Terminal, Shield, Lock, Mail, ArrowRight, Loader2, KeyRound } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@professorx.works');
  const [password, setPassword] = useState('professorx2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#07080c] px-4 py-12 text-white">
      <div className="cyber-grid absolute inset-0 opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_40%,rgba(56,189,248,0.12),transparent)]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 shadow-xl shadow-sky-500/25">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <h1 className="mt-4 font-mono text-2xl font-bold tracking-tight text-white">
            Professorx Works Admin
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Private Content Management & Telemetry System
          </p>
        </div>

        {/* Login Card */}
        <div className="mt-8 rounded-3xl border border-white/10 bg-[#0e1017]/90 p-8 shadow-2xl backdrop-blur-xl">
          {error && (
            <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
                Admin Email
              </label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@professorx.works"
                  className="w-full rounded-xl border border-white/10 bg-[#141824] py-3 pl-10 pr-4 text-xs text-white outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
                Master Password
              </label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-white/10 bg-[#141824] py-3 pl-10 pr-4 text-xs text-white outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* Quick Demo Hint */}
            <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-3 text-[11px] text-slate-400">
              <span className="font-semibold text-sky-400">Default Credentials Pre-filled:</span>
              <div className="font-mono mt-0.5 text-slate-300">
                admin@professorx.works / professorx2026
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 py-3 text-xs font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:bg-sky-400 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Verifying Authorization...</span>
                </>
              ) : (
                <>
                  <KeyRound className="h-4 w-4" />
                  <span>Authenticate Session</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500">
          <a href="/" className="transition hover:text-sky-400">
            ← Return to public website
          </a>
        </div>
      </div>
    </div>
  );
}
