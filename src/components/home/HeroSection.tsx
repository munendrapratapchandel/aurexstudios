'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HeroContent, SiteSettings, VisitorMetrics } from '@/types';
import { ArrowRight, MessageSquarePlus, Sparkles, Terminal, Activity, Users } from 'lucide-react';
import { FeedbackModal } from '../FeedbackModal';

interface HeroSectionProps {
  hero: HeroContent;
  settings: SiteSettings;
  visitorMetrics: VisitorMetrics;
}

export function HeroSection({ hero, settings, visitorMetrics }: HeroSectionProps) {
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const isVideoMode = hero.backgroundMode === 'video' && !videoError && Boolean(hero.videoUrl);

  return (
    <section className="relative flex min-h-[92vh] w-full items-center justify-center overflow-hidden pt-24 pb-16">
      {/* Background Layer: Video OR Image with Fallback */}
      <div className="absolute inset-0 z-0">
        {isVideoMode ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={hero.videoFallbackUrl || hero.imageUrl}
            onError={() => setVideoError(true)}
            className="h-full w-full object-cover object-center opacity-40 filter brightness-75 transition-opacity duration-1000"
          >
            <source src={hero.videoUrl} type="video/mp4" />
          </video>
        ) : (
          <div
            className="h-full w-full bg-cover bg-center bg-no-repeat transition-transform duration-1000"
            style={{
              backgroundImage: `url(${hero.imageUrl || hero.videoFallbackUrl})`,
            }}
          />
        )}

        {/* Cinematic dark & gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#07080c]/80 via-[#07080c]/85 to-[#07080c]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(56,189,248,0.18),transparent)]" />
        <div className="cyber-grid absolute inset-0 opacity-25" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        {/* Availability / System Pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-1.5 backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-400"></span>
          </span>
          <span className="text-xs font-medium tracking-wide text-sky-400">
            {settings.availabilityText || 'Available for development & client builds'}
          </span>
        </motion.div>

        {/* Large Professorx Works Brand & Statement */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-6 font-mono text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl"
        >
          <span className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            {hero.title || 'Professorx Works'}
          </span>
        </motion.h1>

        {/* Subtitle / Positioning statement */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mx-auto mt-5 max-w-2xl text-lg font-normal leading-relaxed text-slate-300 sm:text-xl md:text-2xl"
        >
          {hero.statement || 'Building digital experiences across Web, Minecraft & Discord.'}
        </motion.p>

        {/* Buttons CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href={hero.primaryCtaLink || '#workspace'}
            className="group flex items-center gap-2.5 rounded-xl bg-sky-500 px-7 py-3.5 text-base font-semibold text-white shadow-xl shadow-sky-500/25 transition-all hover:bg-sky-400 hover:shadow-sky-500/35"
          >
            <span>{hero.primaryCtaText || 'Explore My Work'}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>

          <Link
            href={hero.secondaryCtaLink || '/contact'}
            className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-7 py-3.5 text-base font-semibold text-white backdrop-blur-md transition hover:border-white/30 hover:bg-white/10"
          >
            <Sparkles className="h-4 w-4 text-sky-400" />
            <span>{hero.secondaryCtaText || 'Hire Me'}</span>
          </Link>
        </motion.div>

        {/* Live Visitor Counter & Give Feedback Controls */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4 pt-4 sm:gap-6"
        >
          {/* Real-time Session Visitor Counter */}
          {hero.showLiveVisitors && (
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-xs font-medium text-slate-300 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span className="font-mono font-semibold text-white">
                {visitorMetrics.totalVisitors.toLocaleString()}
              </span>
              <span className="text-slate-400">{hero.statsBadgeText || 'Visitors'}</span>
              <span className="mx-1 text-slate-600">|</span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                <Activity className="h-3 w-3" />
                {visitorMetrics.activeVisitors} online
              </span>
            </div>
          )}

          {/* Give Feedback Button (Opens modal without account requirement) */}
          {hero.showFeedbackButton && (
            <button
              onClick={() => setFeedbackModalOpen(true)}
              className="group flex items-center gap-2 rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-2 text-xs font-semibold text-sky-300 backdrop-blur-md transition hover:border-sky-500/60 hover:bg-sky-500/20 hover:text-white"
            >
              <MessageSquarePlus className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
              <span>Give Feedback</span>
            </button>
          )}
        </motion.div>
      </div>

      {/* Feedback Modal trigger */}
      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
      />
    </section>
  );
}
