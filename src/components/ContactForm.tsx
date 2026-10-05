'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

import { ContactContent } from '@/types';

interface ContactFormProps {
  initialService?: string;
  content?: ContactContent;
}

export function ContactForm({ initialService, content }: ContactFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [handle, setHandle] = useState('');
  const servicesList = content?.servicesList?.length ? content.servicesList : [
    'Web Development',
    'Minecraft Development',
    'Discord Development',
    'Discord Bot Development',
    'Custom Platform',
  ];

  const budgetTiers = content?.budgetTiers?.length ? content.budgetTiers : [
    '< ₹10,000',
    '₹10,000 – ₹25,000',
    '₹25,000 – ₹50,000',
    '₹50,000+',
    'Flexible Scope',
  ];

  const timelineOptions = content?.timelineOptions?.length ? content.timelineOptions : [
    'Urgent (< 1 Week)',
    '2–3 Weeks',
    '1 Month',
    'Flexible Timeline',
  ];

  const [selectedService, setSelectedService] = useState(initialService || servicesList[0] || 'Web Development');
  const [budget, setBudget] = useState(budgetTiers[0] || '₹15,000 – ₹35,000');
  const [timeline, setTimeline] = useState(timelineOptions[1] || '2–3 Weeks');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill out all required fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          handle: handle.trim(),
          serviceName: selectedService,
          budgetRange: budget,
          timeline,
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit inquiry.');
      }

      setSubmitted(true);
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please reach out via Discord directly.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-10 text-center dark:border-emerald-500/20 dark:bg-emerald-500/5">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h3 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white">
          {content?.formSuccessTitle || 'Inquiry Successfully Sent!'}
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm text-slate-600 dark:text-slate-300">
          {content?.formSuccessMessage || 'Thank you for reaching out. The team will personally review your project scope and follow up within 24 hours.'}
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setMessage('');
          }}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-500">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Row 1: Name and Email */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Your Name <span className="text-sky-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Alex Vance"
            className="mt-1.5 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-white/10 dark:bg-[#0e111a] dark:text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Email Address <span className="text-sky-500">*</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alex@domain.com"
            className="mt-1.5 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-white/10 dark:bg-[#0e111a] dark:text-white"
          />
        </div>
      </div>

      {/* Row 2: Discord/X Handle */}
      <div>
        <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Discord Tag or X Handle (Recommended for fast communication)
        </label>
        <input
          type="text"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder="e.g. alex#1234 or @alex_vance"
          className="mt-1.5 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-white/10 dark:bg-[#0e111a] dark:text-white"
        />
      </div>

      {/* Row 3: Select Service */}
      <div>
        <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Primary Service
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {servicesList.map((srv) => (
            <button
              key={srv}
              type="button"
              onClick={() => setSelectedService(srv)}
              className={`rounded-xl px-4 py-2 text-xs font-medium transition-all ${
                selectedService === srv
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                  : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-white/10 dark:bg-[#0e111a] dark:text-slate-300 dark:hover:border-white/20'
              }`}
            >
              {srv}
            </button>
          ))}
        </div>
      </div>

      {/* Row 4: Budget Range */}
      <div>
        <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Target Budget Range
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {budgetTiers.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBudget(b)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all ${
                budget === b
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-white/10 dark:bg-[#0e111a] dark:text-slate-300 dark:hover:border-white/20'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Row 5: Timeline */}
      <div>
        <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Target Timeline
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {timelineOptions.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTimeline(t)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all ${
                timeline === t
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-700 dark:border-white/10 dark:bg-[#0e111a] dark:text-slate-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Row 6: Project Scope Message */}
      <div>
        <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Project Brief & Deliverable Requirements <span className="text-sky-500">*</span>
        </label>
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe what you want built, your goal, reference links, specific features or mechanics, and any other relevant context..."
          className="mt-1.5 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-white/10 dark:bg-[#0e111a] dark:text-white"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-500 py-4 text-sm font-semibold text-white shadow-xl shadow-sky-500/25 transition hover:bg-sky-400 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Transmitting Inquiry...</span>
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            <span>Submit Project Inquiry</span>
          </>
        )}
      </button>
    </form>
  );
}
