import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getDeveloperByUsername,
  getProjects,
  getSiteSettings,
  getSocialLinks,
} from '@/lib/db';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { VisitorTracker } from '@/components/VisitorTracker';
import {
  ArrowLeft,
  ExternalLink,
  FolderGit2,
  CheckCircle2,
  Star,
  Sparkles,
  Calendar,
  Layers,
  Code2,
  Mail,
  Send,
} from 'lucide-react';
import { DiscordIcon, InstagramIcon, TwitterIcon, GithubIcon } from '@/components/SocialIcons';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface DeveloperProfilePageProps {
  params: {
    username: string;
  };
}

export default function DeveloperProfilePage({ params }: DeveloperProfilePageProps) {
  const { username } = params;
  const developer = getDeveloperByUsername(username);

  if (!developer || !developer.isVisible) {
    notFound();
  }

  const settings = getSiteSettings();
  const socials = getSocialLinks();
  const allProjects = getProjects();

  // Find projects connected to this developer
  const connectedProjects = allProjects.filter((p) =>
    developer.projectIds?.includes(p.id)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Working':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
      case 'Busy':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Away':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-400';
      case 'Working':
        return 'bg-sky-400';
      case 'Busy':
        return 'bg-amber-400';
      case 'Away':
        return 'bg-orange-400';
      default:
        return 'bg-slate-400';
    }
  };

  const getSkillPercent = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 35;
      case 'intermediate':
        return 65;
      case 'advanced':
        return 88;
      case 'expert':
        return 100;
      default:
        return 80;
    }
  };

  const renderSocialIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('discord')) return <DiscordIcon className="h-4 w-4" />;
    if (p.includes('instagram')) return <InstagramIcon className="h-4 w-4" />;
    if (p.includes('twitter') || p.includes('x')) return <TwitterIcon className="h-4 w-4" />;
    if (p.includes('github')) return <GithubIcon className="h-4 w-4" />;
    return <ExternalLink className="h-4 w-4" />;
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

      <main className="pt-24 pb-24">
        {/* Top Back Navigation */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-[#0e111a] dark:text-slate-300 dark:hover:bg-white/5"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* PROFILE HEADER & COVER BANNER */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#0e111a]">
            {/* Cover Image */}
            <div className="relative h-60 w-full overflow-hidden bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 sm:h-80">
              {developer.coverImage ? (
                <img
                  src={developer.coverImage}
                  alt={`${developer.name} banner`}
                  className="h-full w-full object-cover opacity-75"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-sky-600/30 via-indigo-600/30 to-[#0e111a]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent dark:from-[#0e111a] dark:via-[#0e111a]/40 dark:to-transparent" />
            </div>

            {/* Profile Info Row */}
            <div className="relative -mt-20 px-6 pb-8 sm:-mt-24 sm:px-10">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                {/* Large Avatar & Name */}
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
                  <div className="relative h-32 w-32 shrink-0 sm:h-40 sm:w-40">
                    <img
                      src={developer.profileImage}
                      alt={developer.name}
                      className="h-full w-full rounded-3xl border-4 border-white object-cover shadow-2xl dark:border-[#0e111a] bg-slate-100 dark:bg-[#141824]"
                    />
                    <span
                      className={`absolute bottom-2 right-2 h-6 w-6 rounded-full border-4 border-white dark:border-[#0e111a] ${getStatusDot(
                        developer.availability
                      )}`}
                      title={`Status: ${developer.availability}`}
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                        {developer.name}
                      </h1>
                      {developer.isFeatured && (
                        <span className="flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 text-xs font-bold text-amber-500">
                          <Star className="h-3 w-3 fill-amber-500" />
                          <span>Featured</span>
                        </span>
                      )}
                    </div>
                    <p className="text-base font-semibold text-sky-500 dark:text-sky-400">
                      {developer.role}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 pt-1">
                      <span>@{developer.username}</span>
                      <span>•</span>
                      <span>{developer.experience} Experience</span>
                      <span>•</span>
                      <span className="text-slate-400">Aurex Studio</span>
                    </div>
                  </div>
                </div>

                {/* Right Header: Status Pill & Action */}
                <div className="flex flex-wrap items-center gap-3">
                  <div
                    className={`inline-flex items-center gap-2 rounded-2xl border px-3.5 py-2 text-xs font-semibold ${getStatusColor(
                      developer.availability
                    )}`}
                  >
                    <span className={`h-2 w-2 rounded-full animate-pulse ${getStatusDot(developer.availability)}`} />
                    <span>{developer.availability}</span>
                  </div>

                  <Link
                    href={`/contact?subject=Work%20with%20${encodeURIComponent(developer.name)}`}
                    className="inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:bg-sky-400"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Contact / Hire</span>
                  </Link>
                </div>
              </div>

              {/* Custom Status Bar */}
              {developer.customStatus && (
                <div className="mt-6 rounded-2xl border border-sky-500/20 bg-sky-500/5 p-4 text-xs dark:border-white/5 dark:bg-white/5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-sky-400 shrink-0" />
                    <span className="font-mono text-slate-500 dark:text-slate-400">Current Focus:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {developer.customStatus}
                    </span>
                  </div>
                </div>
              )}

              {/* Social Profiles Row */}
              {developer.socials && developer.socials.length > 0 && (
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  {developer.socials.map((soc, i) => (
                    <a
                      key={i}
                      href={soc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 hover:text-sky-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-sky-400"
                    >
                      {renderSocialIcon(soc.platform)}
                      <span>{soc.platform}: {soc.username}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* MAIN PROFILE BODY GRID */}
          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
            {/* LEFT 2 COLUMNS: About, Skills, Tech Stack */}
            <div className="space-y-10 lg:col-span-2">
              {/* 1. About / Detailed Bio */}
              <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-[#0e111a]">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-sky-500" />
                  <span>About {developer.name}</span>
                </h2>
                <div className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300 space-y-4 whitespace-pre-line">
                  {developer.fullBio || developer.shortBio}
                </div>
              </section>

              {/* 2. Skills & Competencies */}
              {developer.skills && developer.skills.length > 0 && (
                <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-[#0e111a]">
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                    <span>Technical Skills & Proficiency</span>
                  </h2>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Demonstrated production competence and tooling depth.
                  </p>

                  <div className="mt-6 space-y-5">
                    {developer.skills.map((skill, i) => {
                      const pct = getSkillPercent(skill.level);
                      return (
                        <div key={i} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {skill.name}
                            </span>
                            <span className="font-mono text-slate-500 dark:text-slate-400">
                              {skill.level} ({pct}%)
                            </span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-600"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* 3. Connected Projects */}
              <section className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                    <FolderGit2 className="h-5 w-5 text-indigo-500" />
                    <span>Projects & Production Deliverables</span>
                  </h2>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Systems architected or engineered by {developer.name}.
                  </p>
                </div>

                {connectedProjects.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-slate-200 p-8 text-center text-slate-500 dark:border-white/10">
                    <FolderGit2 className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                    <p className="text-sm">No standalone portfolio case studies linked yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {connectedProjects.map((proj) => (
                      <div
                        key={proj.id}
                        className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-sky-500/50 hover:shadow-xl dark:border-white/10 dark:bg-[#0e111a]"
                      >
                        <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                          <img
                            src={proj.coverImage}
                            alt={proj.title}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                          <div className="absolute top-3 left-3">
                            <span className="rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-mono font-bold text-sky-400">
                              {proj.category}
                            </span>
                          </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-500 transition-colors dark:text-white">
                              {proj.title}
                            </h3>
                            <p className="mt-2 text-xs text-slate-600 line-clamp-2 dark:text-slate-300">
                              {proj.shortDescription}
                            </p>
                          </div>

                          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              {proj.technologies?.slice(0, 2).map((t, idx) => (
                                <span
                                  key={idx}
                                  className="rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 dark:bg-white/5 dark:text-slate-400"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>

                            <Link
                              href={`/works/${proj.slug}`}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-sky-500 hover:text-sky-600 dark:text-sky-400 dark:hover:text-sky-300"
                            >
                              <span>View Work</span>
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* RIGHT COLUMN: Specializations, Technologies, Fast Stats */}
            <div className="space-y-6">
              {/* Specializations Card */}
              {developer.specializations && developer.specializations.length > 0 && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#0e111a]">
                  <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-400">
                    Specializations
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {developer.specializations.map((spec, i) => (
                      <span
                        key={i}
                        className="rounded-xl border border-sky-500/20 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Technologies Card */}
              {developer.technologies && developer.technologies.length > 0 && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#0e111a]">
                  <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-400">
                    Technologies Stack
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {developer.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-mono font-medium text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Hire Developer Card */}
              <div className="rounded-3xl border border-sky-500/20 bg-gradient-to-br from-sky-500/10 to-indigo-500/10 p-6 shadow-sm dark:border-white/10 dark:bg-[#0e111a]">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Collaborate with {developer.name}
                </h3>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Need custom architecture or engineering for your project? Reach out to schedule a consultation with the Aurex Studio team.
                </p>

                <Link
                  href={`/contact?subject=Hire%20${encodeURIComponent(developer.name)}`}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-500 py-3 text-xs font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:bg-sky-400"
                >
                  <Send className="h-4 w-4" />
                  <span>Start Project Consultation</span>
                </Link>
              </div>
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
