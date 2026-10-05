import React from 'react';
import Link from 'next/link';
import { getServices, getSiteSettings, getSocialLinks } from '@/lib/db';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { VisitorTracker } from '@/components/VisitorTracker';
import { Globe, Box, MessageSquare, Bot, ArrowRight, CheckCircle2, Sparkles, Layers } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function ServicesPage() {
  const services = getServices();
  const settings = getSiteSettings();
  const socials = getSocialLinks();

  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'globe':
        return <Globe className="h-6 w-6" />;
      case 'box':
        return <Box className="h-6 w-6" />;
      case 'messagesquare':
        return <MessageSquare className="h-6 w-6" />;
      case 'bot':
        return <Bot className="h-6 w-6" />;
      default:
        return <Layers className="h-6 w-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-[#07080c] dark:text-white">
      <VisitorTracker />
      <Navbar
        siteName={settings.siteName}
        tagline={settings.tagline}
        logoUrl={settings.logoUrl}
        lightLogoUrl={settings.lightLogoUrl}
        darkLogoUrl={settings.darkLogoUrl}
      />

      <main className="pt-28 pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page Hero */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3.5 py-1 text-xs font-mono font-semibold tracking-wider text-sky-500 uppercase dark:text-sky-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>SERVICES & SPECIALIZATIONS</span>
            </div>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
              Engineering Disciplines
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 dark:text-slate-300">
              Transparent specifications, verified proof-of-work, and database-backed dynamic plans. Select a discipline to inspect relevant projects and plans.
            </p>
          </div>

          {/* Services Detailed Grid */}
          <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-2">
            {services.map((service) => (
              <div
                key={service.id}
                className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-sky-500/40 hover:shadow-2xl dark:border-white/10 dark:bg-[#0e111a]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-500 transition-colors group-hover:bg-sky-500 group-hover:text-white dark:bg-sky-500/20">
                      {getIcon(service.icon)}
                    </div>
                    {service.startingPrice && (
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1 font-mono text-xs font-semibold text-slate-700 dark:border-white/5 dark:bg-[#151926] dark:text-slate-300">
                        Plans from {service.startingPrice}
                      </span>
                    )}
                  </div>

                  <h2 className="mt-6 text-2xl font-bold text-slate-900 transition-colors group-hover:text-sky-500 dark:text-white">
                    {service.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {service.heroIntro}
                  </p>

                  {/* Highlights from service sections */}
                  {service.sections?.[0]?.items && (
                    <div className="mt-6 space-y-2.5 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-white/5 dark:bg-[#141824]">
                      <span className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                        Key Deliverables
                      </span>
                      {service.sections[0].items.slice(0, 4).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-sky-500" />
                          <span>{item.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    Includes {service.plans?.length || 3} curated pricing tiers
                  </span>
                  <Link
                    href={`/services/${service.slug}`}
                    className="flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-sky-500/20 transition hover:bg-sky-400"
                  >
                    <span>View Service & Proof</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Need Custom Scope Banner */}
          <div className="mt-20 rounded-3xl border border-sky-500/30 bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-sky-500/10 p-10 text-center">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Need A Custom Architecture?
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600 dark:text-slate-300">
              Have a multi-ecosystem project combining web portals, Minecraft server synchronization, and custom Discord bot commands? Let&apos;s build a bespoke proposal.
            </p>
            <div className="mt-6">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:bg-sky-400"
              >
                <span>Request Custom Project Scope</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer
        siteName={settings.siteName}
        tagline={settings.tagline}
        logoUrl={settings.logoUrl}
        socials={socials}
        availability={settings.availability}
        availabilityText={settings.availabilityText}
      />
    </div>
  );
}
