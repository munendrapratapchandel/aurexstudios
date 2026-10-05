'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldAlert, Zap, Cpu, Terminal, Sparkles } from 'lucide-react';

export function CapabilitiesSection() {
  const pillars = [
    {
      title: 'Full-Stack Web Engineering',
      desc: 'Clean Next.js & React architectures with server actions, real-time database reactivity, tailored CMS panels, and sub-second load times.',
      features: ['Modern Next.js 14 App Router', 'Tailwind CSS & Micro-interactions', 'Headless CMS & Custom Admin', 'Zero-downtime Deployments'],
    },
    {
      title: 'Minecraft Networks & Skript',
      desc: 'High-TPS Paper/Purpur/Spigot server tuning, complex Skript gameplay logic, custom resource packs, and multi-server Velocity proxy syncing.',
      features: ['Lag-free 20.0 TPS Engine Tuning', 'Custom Abilities & Economy Loops', 'Bungee / Velocity Proxies', 'Tebex Store Delivery Automation'],
    },
    {
      title: 'Discord Community Architecture',
      desc: 'Enterprise Discord server topologies designed for safety and engagement. Automated verification, anti-raid defenses, and sleek visual layout.',
      features: ['Automated Onboarding Systems', 'Anti-Raid & Verification Gates', 'Reaction Roles & Department Tiers', 'Clean Category Structures'],
    },
    {
      title: 'Custom Discord Bot Engines',
      desc: 'Bespoke Node.js/Discord.js bots. Automated moderation, interactive ticket panels with downloadable HTML transcripts, and database integrations.',
      features: ['Interactive Slash Commands & Modals', 'HTML Ticket Transcripts Engine', 'Database Sync & Web Dashboards', '99.9% Monitored Uptime'],
    },
  ];

  return (
    <section className="relative py-24 bg-slate-50/50 dark:bg-[#07090f]/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3.5 py-1 text-xs font-mono font-semibold tracking-wider text-sky-500 uppercase dark:text-sky-400">
            <Zap className="h-3.5 w-3.5" />
            <span>DISCIPLINE & SCOPE</span>
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            What I Can Build For You
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
            From single-purpose utility bots to enterprise Minecraft networks and high-converting web flagships.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:border-sky-500/40 hover:shadow-xl dark:border-white/10 dark:bg-[#0e111a]"
            >
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {pillar.title}
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {pillar.desc}
              </p>

              <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {pillar.features.map((feat) => (
                  <div key={feat} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-sky-500" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
