import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getServiceBySlug, getDatabase, getSiteSettings, getSocialLinks } from '@/lib/db';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { VisitorTracker } from '@/components/VisitorTracker';
import { ContactForm } from '@/components/ContactForm';
import {
  Globe,
  Box,
  MessageSquare,
  Bot,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Layers,
  ShieldCheck,
  Check,
  Server,
  Zap,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: {
    slug: string;
  };
}

export default function ServiceDetailPage({ params }: PageProps) {
  const service = getServiceBySlug(params.slug);
  if (!service) {
    notFound();
  }

  const db = getDatabase();
  const settings = getSiteSettings();
  const socials = getSocialLinks();

  // Find 2-3 relevant projects assigned to this service (Requirement #20 & #23)
  let relevantProjects = db.projects.filter((p) =>
    service.featuredProjectIds?.includes(p.id)
  );

  // Fallback if not specifically linked: find by category
  if (relevantProjects.length === 0) {
    relevantProjects = db.projects
      .filter((p) => p.category.toLowerCase().includes(service.slug.split('-')[0]))
      .slice(0, 3);
  }

  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'globe':
        return <Globe className="h-8 w-8" />;
      case 'box':
        return <Box className="h-8 w-8" />;
      case 'messagesquare':
        return <MessageSquare className="h-8 w-8" />;
      case 'bot':
        return <Bot className="h-8 w-8" />;
      default:
        return <Layers className="h-8 w-8" />;
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
          {/* STEP 1: SERVICE HERO */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-1.5 text-xs font-mono font-semibold tracking-wider text-sky-500 uppercase dark:text-sky-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>SERVICE SPECIFICATION</span>
            </div>

            <div className="mx-auto mt-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-500 dark:bg-sky-500/20">
              {getIcon(service.icon)}
            </div>

            <h1 className="mt-4 font-mono text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
              {service.title}
            </h1>

            <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              {service.shortDescription}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#plans"
                className="rounded-xl bg-sky-500 px-6 py-3 text-xs font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:bg-sky-400"
              >
                View Plans & Pricing
              </a>
              <a
                href="#hire"
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-xs font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 dark:border-white/10 dark:bg-[#0e111a] dark:text-slate-200"
              >
                Request Consultation
              </a>
            </div>
          </div>

          {/* STEP 2: CRITICAL REQUIREMENT #20 — 2-3 RELEVANT PROJECTS PROOF AT THE TOP */}
          {relevantProjects.length > 0 && (
            <div className="mt-20">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-4 dark:border-white/10">
                <div>
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-sky-500">
                    Proof First · Actual Deliverables
                  </span>
                  <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Featured Work in {service.title}
                  </h2>
                </div>
                <Link
                  href="/works"
                  className="text-xs font-semibold text-sky-500 transition hover:underline"
                >
                  View All Projects →
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relevantProjects.map((p) => (
                  <div
                    key={p.id}
                    className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-sky-500/40 hover:shadow-xl dark:border-white/10 dark:bg-[#0e111a]"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-[#151926]">
                      <img
                        src={p.coverImage}
                        alt={p.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 rounded-lg bg-black/60 px-2 py-0.5 font-mono text-[10px] text-white backdrop-blur-md">
                        {p.category}
                      </div>
                      <div className="absolute top-3 right-3 rounded-lg bg-black/60 px-2 py-0.5 text-[10px] font-medium text-emerald-400 backdrop-blur-md">
                        {p.status}
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-base font-bold text-slate-900 transition group-hover:text-sky-500 dark:text-white">
                        {p.title}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-2 dark:text-slate-400">
                        {p.shortDescription}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-1">
                        {p.technologies.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600 dark:bg-[#141824] dark:text-slate-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                        <Link
                          href={`/works/${p.slug}`}
                          className="flex items-center gap-1 text-xs font-semibold text-sky-500"
                        >
                          <span>Inspect Deliverable</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                        {p.liveUrl && (
                          <a
                            href={p.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 transition hover:text-sky-500"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: SERVICE INTRODUCTION & DEEP DIVE */}
          <div className="mt-20 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-[#0e111a] sm:p-12">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Engineering Overview
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
              {service.heroIntro}
            </p>
          </div>

          {/* STEP 4 & 5: DYNAMIC MANUAL SECTIONS (Requirement #24) */}
          <div className="mt-16 space-y-16">
            {service.sections?.filter((s) => s.isVisible).map((sec) => (
              <div
                key={sec.id}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-[#0e111a] sm:p-10"
              >
                <div>
                  {sec.subtitle && (
                    <span className="font-mono text-xs font-semibold uppercase tracking-wider text-sky-500">
                      {sec.subtitle}
                    </span>
                  )}
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {sec.title}
                  </h3>
                  {sec.content && (
                    <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      {sec.content}
                    </p>
                  )}
                </div>

                {sec.items && sec.items.length > 0 && (
                  <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {sec.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5 dark:border-white/5 dark:bg-[#141824]"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/10 text-sky-500">
                            <CheckCircle2 className="h-4 w-4" />
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {item.title}
                          </h4>
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* STEP 9: DYNAMIC PRICING & PLANS (Requirement #29, #30) */}
          <div id="plans" className="mt-24">
            <div className="text-center">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-sky-500">
                Transparent Investment
              </span>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Pricing & Deliverable Tiers
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600 dark:text-slate-400">
                Configured and synchronized directly from the database. No hidden fees.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
              {service.plans?.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative flex flex-col justify-between rounded-3xl border p-8 transition-all ${
                    plan.isFeatured
                      ? 'border-sky-500 bg-white shadow-2xl shadow-sky-500/15 dark:border-sky-500 dark:bg-[#0f1320] lg:-translate-y-2'
                      : 'border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#0e111a]'
                  }`}
                >
                  {plan.isFeatured && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-sky-500 px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-md">
                      Most Popular Tier
                    </div>
                  )}

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {plan.name}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      {plan.description}
                    </p>

                    <div className="mt-6 flex items-baseline gap-2">
                      <span className="font-mono text-4xl font-extrabold text-slate-900 dark:text-white">
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-xs text-slate-500">
                          / {plan.period}
                        </span>
                      )}
                    </div>

                    {/* Features list */}
                    <div className="mt-8 space-y-3">
                      <span className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                        Included Features
                      </span>
                      {plan.features?.map((feat, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                          <Check className="h-4 w-4 shrink-0 text-sky-500 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5">
                    <a
                      href="#hire"
                      className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-xs font-semibold transition ${
                        plan.isFeatured
                          ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25 hover:bg-sky-400'
                          : 'border border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100 dark:border-white/10 dark:bg-[#141824] dark:text-white dark:hover:bg-white/10'
                      }`}
                    >
                      <span>{plan.ctaText || 'Select This Plan'}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* STEP 10: CUSTOM PROJECT QUOTE BANNER (Requirement #31) */}
          <div className="mt-16 rounded-3xl border border-sky-500/30 bg-sky-500/5 p-8 text-center sm:p-10">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
              Need Something Custom?
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-xs text-slate-600 dark:text-slate-300 sm:text-sm">
              Tell me what you&apos;re building and I&apos;ll create a tailored scope, architecture diagram, and milestone estimate.
            </p>
            <a
              href="#hire"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-3 text-xs font-semibold text-white shadow-md shadow-sky-500/20 transition hover:bg-sky-400"
            >
              <span>Request Custom Quote</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* STEP 11: HIRE ME FLOW PREFILLED (Requirement #32) */}
          <div id="hire" className="mt-24">
            <div className="text-center">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-sky-500">
                Kickstart Development
              </span>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Hire Me for {service.title}
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-400">
                Submit your initial requirements below. I will personally review and follow up within 24 hours.
              </p>
            </div>

            <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-slate-200/90 bg-white/70 p-8 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-[#0c0e15]/90 sm:p-10">
              <ContactForm initialService={service.title} />
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
