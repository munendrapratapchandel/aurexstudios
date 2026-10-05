import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProjectBySlug, getSiteSettings, getSocialLinks } from '@/lib/db';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { VisitorTracker } from '@/components/VisitorTracker';
import {
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Layers,
  Sparkles,
} from 'lucide-react';
import { GithubIcon } from '@/components/SocialIcons';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: {
    slug: string;
  };
}

export default function ProjectDetailPage({ params }: PageProps) {
  const project = getProjectBySlug(params.slug);
  if (!project) {
    notFound();
  }

  const settings = getSiteSettings();
  const socials = getSocialLinks();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-[#07080c] dark:text-white">
      <VisitorTracker />
      <Navbar siteName={settings.siteName} tagline={settings.tagline} />

      <main className="pt-28 pb-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <Link
            href="/works"
            className="inline-flex items-center gap-2 rounded-xl text-xs font-semibold text-slate-500 transition hover:text-sky-500 dark:text-slate-400"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to all works</span>
          </Link>

          {/* Project Header */}
          <div className="mt-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-sky-500/10 px-3 py-1 font-mono text-xs font-semibold text-sky-500 dark:bg-sky-500/20">
                {project.category}
              </span>
              <span className="rounded-lg bg-emerald-500/10 px-3 py-1 font-mono text-xs font-semibold text-emerald-500">
                Status: {project.status}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              {project.title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
              {project.shortDescription}
            </p>

            {/* Links */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-sky-500/25 transition hover:bg-sky-400"
                >
                  <span>Launch Live Project</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 dark:border-white/10 dark:bg-[#0e111a] dark:text-slate-200"
                >
                  <GithubIcon className="h-4 w-4" />
                  <span>View Repository</span>
                </a>
              )}
              <Link
                href="/contact"
                className="flex items-center gap-2 rounded-xl border border-sky-500/30 bg-sky-500/10 px-5 py-2.5 text-xs font-semibold text-sky-500 transition hover:bg-sky-500 hover:text-white dark:text-sky-400"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Hire For Similar Project</span>
              </Link>
            </div>
          </div>

          {/* Main Cover Image */}
          <div className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-[#0e111a]">
            <img
              src={project.coverImage}
              alt={project.title}
              className="w-full object-cover"
            />
          </div>

          {/* Deep Content Sections */}
          <div className="mt-14 space-y-12">
            {/* Overview / What was built */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-[#0e111a] sm:p-10">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                What Was Built & Technical Scope
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {project.fullDescription}
              </p>

              {/* Technologies */}
              <div className="mt-8">
                <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
                  Technologies Deployed
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.technologies.map((t) => (
                    <span
                      key={t}
                      className="rounded-xl border border-slate-200/80 bg-slate-50 px-3.5 py-1.5 font-mono text-xs text-slate-800 dark:border-white/5 dark:bg-[#141824] dark:text-slate-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Challenges & Solutions */}
            {project.challenges && (
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-[#0e111a] sm:p-10">
                <div className="flex items-center gap-2.5 text-amber-500">
                  <AlertCircle className="h-5 w-5" />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Technical Challenges
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {project.challenges}
                </p>
              </div>
            )}

            {/* Final Results & Client Impact */}
            {project.results && (
              <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-8 dark:border-emerald-500/10 sm:p-10">
                <div className="flex items-center gap-2.5 text-emerald-500">
                  <TrendingUp className="h-5 w-5" />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Deliverable Result & Production Impact
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {project.results}
                </p>
              </div>
            )}

            {/* Gallery Screenshots */}
            {project.galleryImages && project.galleryImages.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Project Gallery & Visuals
                </h3>
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {project.galleryImages.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#0e111a]"
                    >
                      <img
                        src={imgUrl}
                        alt={`${project.title} screenshot ${idx + 1}`}
                        className="w-full object-cover transition duration-300 hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
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
