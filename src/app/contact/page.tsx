import React from 'react';
import { getSiteSettings, getSocialLinks } from '@/lib/db';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { VisitorTracker } from '@/components/VisitorTracker';
import { ContactForm } from '@/components/ContactForm';
import { Sparkles, MessageSquare, Terminal, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function ContactPage() {
  const settings = getSiteSettings();
  const socials = getSocialLinks();
  const discordLink = socials.find((s) => s.platform.toLowerCase() === 'discord');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-[#07080c] dark:text-white">
      <VisitorTracker />
      <Navbar siteName={settings.siteName} tagline={settings.tagline} />

      <main className="pt-28 pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Left Column */}
            <div className="space-y-6 lg:col-span-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3.5 py-1 text-xs font-mono font-semibold tracking-wider text-sky-500 uppercase dark:text-sky-400">
                <Sparkles className="h-3.5 w-3.5" />
                <span>START A PROJECT</span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
                Let&apos;s Build Something
              </h1>

              <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
                Submit your project goals, scope, and timeline below. Every inquiry is personally reviewed by Professorx with a prompt architectural response within 24 hours.
              </p>

              {/* Engineering Guarantees */}
              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500 dark:bg-sky-500/20">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Clear Scope & Fixed Pricing
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      No surprise fees. You receive a structured milestone outline before work starts.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500 dark:bg-sky-500/20">
                    <Terminal className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Full Source Code & Admin Handover
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      You own 100% of your assets, repos, and administrative dashboards.
                    </p>
                  </div>
                </div>

                {discordLink && (
                  <div className="mt-8 rounded-3xl border border-sky-500/30 bg-sky-500/5 p-6">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-sky-500">
                      <MessageSquare className="h-4 w-4" />
                      <span>Direct Discord Communication</span>
                    </div>
                    <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                      Prefer instant chat over a form? Join the server or DM directly:
                    </p>
                    <a
                      href={discordLink.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-sky-400"
                    >
                      <span>Join Discord ({discordLink.username})</span>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Interactive Form */}
            <div className="rounded-3xl border border-slate-200/90 bg-white/70 p-8 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-[#0c0e15]/90 sm:p-10 lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </div>
      </main>

      <Footer
        siteName={settings.siteName}
        tagline={settings.tagline}
        socials={socials}
        availability={settings.availability}
        availabilityText={settings.availabilityText}
      />
    </div>
  );
}
