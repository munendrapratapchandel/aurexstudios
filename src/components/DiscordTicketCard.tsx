'use client';

import React from 'react';
import { DiscordTicketCardConfig } from '@/types';
import { Zap, MessageSquare, ArrowRight, CheckCircle2, ShieldCheck, Clock, ExternalLink } from 'lucide-react';

interface DiscordTicketCardProps {
  config?: DiscordTicketCardConfig;
  fallbackUrl?: string;
  className?: string;
}

export function DiscordTicketCard({ config, fallbackUrl, className = '' }: DiscordTicketCardProps) {
  // If explicitly disabled in CMS, don't render
  if (config && config.enabled === false) {
    return null;
  }

  const badge = config?.badge || '⚡ FAST-TRACK YOUR PROJECT';
  const title = config?.title || 'Need a Faster Project Build? Join Discord & Create a Ticket';
  const description =
    config?.description ||
    'Skip email delays and inquiry queues. Join our official Discord server, open a private project ticket, and collaborate directly with our lead developers for instant scoping and expedited delivery.';
  const discordUrl = config?.discordUrl || fallbackUrl || 'https://discord.gg/aurex';
  const buttonText = config?.buttonText || 'Join Discord & Open Ticket';
  const responseTime = config?.responseTime || '< 15 Mins Response';
  const features =
    config?.features && config.features.length > 0
      ? config.features
      : [
          'Instant 1-on-1 access to lead developers',
          'Private dedicated ticket channel for your build',
          'Real-time sprint updates & interactive previews',
          'Priority delivery queue for urgent builds',
        ];

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-[#5865F2]/40 bg-gradient-to-br from-[#5865F2]/15 via-[#0e111a] to-[#08090f] p-6 sm:p-8 shadow-2xl shadow-[#5865F2]/10 transition-all hover:border-[#5865F2]/60 ${className}`}
    >
      {/* Background glow effects */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#5865F2]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />

      <div className="relative z-10 space-y-5">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#5865F2]/40 bg-[#5865F2]/15 px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider text-[#9ba6ff]">
            <Zap className="h-3.5 w-3.5 text-[#5865F2] fill-[#5865F2]" />
            <span>{badge}</span>
          </div>

          {responseTime && (
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span>{responseTime}</span>
            </div>
          )}
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
            {title}
          </h3>
          <p className="text-sm leading-relaxed text-slate-300">
            {description}
          </p>
        </div>

        {/* Features / Perks Grid */}
        {features.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2 text-xs text-slate-200"
              >
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-[#5865F2]/20 text-[#8894FF]">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                <span className="font-medium">{feat}</span>
              </div>
            ))}
          </div>
        )}

        {/* Action Button & Note */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <a
            href={discordUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[#5865F2] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#5865F2]/25 transition hover:bg-[#4752c4] hover:shadow-xl hover:shadow-[#5865F2]/35"
          >
            {/* Discord SVG icon */}
            <svg
              className="h-5 w-5 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            <span>{buttonText}</span>
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </a>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock className="h-3.5 w-3.5 text-sky-400" />
            <span>Direct tickets handled directly by lead developers</span>
          </div>
        </div>
      </div>
    </div>
  );
}
