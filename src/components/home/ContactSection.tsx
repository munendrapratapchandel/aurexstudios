'use client';

import React from 'react';
import { ContactForm } from '../ContactForm';
import { Sparkles, MessageSquare, Terminal, Mail, CheckCircle2 } from 'lucide-react';
import { SocialLink } from '@/types';

interface ContactSectionProps {
  socials: SocialLink[];
}

export function ContactSection({ socials }: ContactSectionProps) {
  const discordLink = socials.find((s) => s.platform.toLowerCase() === 'discord');

  return (
    <section id="contact" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left info column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3.5 py-1 text-xs font-mono font-semibold tracking-wider text-sky-500 uppercase dark:text-sky-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>DIRECT INQUIRIES</span>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Let&apos;s Build Something
            </h2>

            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Whether you are architecting a custom Minecraft network, launching a web flagship, or deploying automated Discord systems, let&apos;s bring it to life with precision.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500 dark:bg-sky-500/20">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Direct Engineering Dialogue
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    You collaborate directly with Professorx. No sales reps, no middlemen.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500 dark:bg-sky-500/20">
                  <Terminal className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Milestone-Driven Execution
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Transparent deliverables, regular progress updates, and test builds.
                  </p>
                </div>
              </div>

              {discordLink && (
                <div className="mt-6 rounded-2xl border border-sky-500/30 bg-sky-500/5 p-5">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-sky-500">
                    <MessageSquare className="h-4 w-4" />
                    <span>Prefer Discord?</span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300">
                    Send a direct message or join the community server:
                  </p>
                  <a
                    href={discordLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-sky-400"
                  >
                    <span>Connect on Discord ({discordLink.username})</span>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Right form column */}
          <div className="rounded-3xl border border-slate-200/90 bg-white/70 p-7 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-[#0c0e15]/90 sm:p-9 lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
