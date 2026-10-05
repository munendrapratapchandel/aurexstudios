'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  WorkspaceDashboard as WorkspaceDashboardType,
  SocialLink,
  Hobby,
  SkillCategory,
  Project,
} from '@/types';
import {
  Terminal,
  User,
  FolderGit2,
  Heart,
  Cpu,
  Share2,
  ExternalLink,
  Check,
  Copy,
  ArrowRight,
  Code2,
  Flame,
  Sparkles,
  Layers,
  Clock,
  ShieldCheck,
  MessageSquare,
  Box,
  Headphones,
  Server,
} from 'lucide-react';
import { DiscordIcon, InstagramIcon, TwitterIcon, GithubIcon } from '../SocialIcons';

interface WorkspaceDashboardProps {
  dashboard: WorkspaceDashboardType;
  socials: SocialLink[];
  hobbies: Hobby[];
  skills: SkillCategory[];
  featuredProjects: Project[];
}

export function WorkspaceDashboard({
  dashboard,
  socials,
  hobbies,
  skills,
  featuredProjects,
}: WorkspaceDashboardProps) {
  const [activeTab, setActiveTab] = useState<'about' | 'works' | 'hobbies' | 'skills' | 'socials'>('about');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getHobbyIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'box':
        return <Box className="h-5 w-5" />;
      case 'headphones':
        return <Headphones className="h-5 w-5" />;
      case 'sparkles':
        return <Sparkles className="h-5 w-5" />;
      case 'server':
        return <Server className="h-5 w-5" />;
      default:
        return <Heart className="h-5 w-5" />;
    }
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'discord':
        return <DiscordIcon className="h-5 w-5" />;
      case 'instagram':
        return <InstagramIcon className="h-5 w-5" />;
      case 'twitter':
      case 'x':
      case 'x (twitter)':
        return <TwitterIcon className="h-4 w-4" />;
      case 'github':
        return <GithubIcon className="h-5 w-5" />;
      default:
        return <Share2 className="h-5 w-5" />;
    }
  };

  return (
    <section id="workspace" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3.5 py-1 text-xs font-mono font-semibold tracking-wider text-sky-500 uppercase dark:text-sky-400">
            <Terminal className="h-3.5 w-3.5" />
            <span>{dashboard.badge || 'WORKSPACE COCKPIT'}</span>
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl">
            {dashboard.title || 'Explore My Workspace'}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 dark:text-slate-400">
            An interactive look inside my engineering discipline, active build pipelines, selected hobbies, and ecosystem.
          </p>
        </div>

        {/* The Digital Cockpit Dashboard Frame */}
        <div className="mt-14 overflow-hidden rounded-3xl border border-slate-200/90 bg-white/80 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-[#0c0e15]/90">
          {/* Top Terminal Status Bar */}
          <div className="flex flex-wrap items-center justify-between border-b border-slate-200/80 bg-slate-100/60 px-6 py-4 dark:border-white/10 dark:bg-[#08090e]/80">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">
                {dashboard.terminalPrompt || 'aurex@workspace:~$'}
              </span>
            </div>

            {/* Navigation tabs inside the interactive dashboard */}
            <div className="mt-2 flex flex-wrap items-center gap-1.5 sm:mt-0">
              {[
                { id: 'about', label: dashboard.tabLabels?.about || 'About', icon: User },
                { id: 'works', label: dashboard.tabLabels?.works || 'Works Spotlight', icon: FolderGit2 },
                { id: 'hobbies', label: dashboard.tabLabels?.hobbies || 'Hobbies', icon: Heart },
                { id: 'skills', label: dashboard.tabLabels?.skills || 'Experience & Stack', icon: Cpu },
                { id: 'socials', label: dashboard.tabLabels?.socials || 'Socials', icon: Share2 },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                        : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Cockpit Body */}
          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {/* TAB 1: ABOUT */}
              {activeTab === 'about' && (
                <motion.div
                  key="about"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 gap-8 lg:grid-cols-3"
                >
                  <div className="space-y-6 lg:col-span-2">
                    <div>
                      <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        {dashboard.aboutTitle || 'About Aurex Studio'}
                      </h3>
                      <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                        {dashboard.aboutBio}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-5">
                      <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-sky-500 dark:text-sky-400">
                        <Sparkles className="h-4 w-4" />
                        <span>{dashboard.philosophyBadge || 'Core Engineering Philosophy'}</span>
                      </div>
                      <p className="mt-2 text-sm italic leading-relaxed text-slate-700 dark:text-slate-300">
                        &quot;{dashboard.developerPhilosophy}&quot;
                      </p>
                    </div>

                    {/* Stats Matrix */}
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-center dark:border-white/5 dark:bg-[#11141e]">
                        <div className="font-mono text-2xl font-bold text-sky-500">
                          {dashboard.experienceYears || '6+ Years'}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {dashboard.experienceLabel || 'Experience'}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-center dark:border-white/5 dark:bg-[#11141e]">
                        <div className="font-mono text-2xl font-bold text-sky-500">
                          {dashboard.completedProjectsCount || '85+'}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {dashboard.completedProjectsLabel || 'Builds Shipped'}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-center dark:border-white/5 dark:bg-[#11141e]">
                        <div className="font-mono text-2xl font-bold text-sky-500">
                          {dashboard.happyClientsCount || '60+'}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {dashboard.happyClientsLabel || 'Global Clients'}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-center dark:border-white/5 dark:bg-[#11141e]">
                        <div className="font-mono text-2xl font-bold text-sky-500">
                          {dashboard.codeLinesCount || '500k+'}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {dashboard.codeLinesLabel || 'Lines Written'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Currently Building Widget */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 dark:border-white/10 dark:bg-[#10131d]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Flame className="h-4 w-4 text-amber-500" />
                        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
                          {dashboard.currentlyBuilding?.badgeLabel || 'Currently Building'}
                        </span>
                      </div>
                      <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-500">
                        {dashboard.currentlyBuilding?.statusText || 'Active Alpha'}
                      </span>
                    </div>

                    <h4 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                      {dashboard.currentlyBuilding?.title}
                    </h4>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      {dashboard.currentlyBuilding?.subtitle}
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-5">
                      <div className="flex justify-between text-xs font-medium text-slate-500">
                        <span>{dashboard.currentlyBuilding?.progressLabel || 'Milestone Progress'}</span>
                        <span>{dashboard.currentlyBuilding?.progress ?? 90}%</span>
                      </div>
                      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${dashboard.currentlyBuilding?.progress ?? 90}%` }}
                          transition={{ duration: 1 }}
                          className="h-full bg-gradient-to-r from-sky-500 to-indigo-500"
                        />
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {(dashboard.currentlyBuilding?.tags || []).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-mono text-[11px] text-slate-700 shadow-sm dark:border-white/5 dark:bg-[#151926] dark:text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10">
                      <Link
                        href={dashboard.currentlyBuilding?.ctaLink || '/contact'}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 py-2.5 text-xs font-semibold text-white transition hover:bg-sky-400"
                      >
                        <span>{dashboard.currentlyBuilding?.ctaText || 'Collaborate On A Build'}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: WORKS SPOTLIGHT */}
              {activeTab === 'works' && (
                <motion.div
                  key="works"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        Selected Works Spotlight
                      </h3>
                      <p className="text-xs text-slate-500">
                        Verified client deliverables and production platforms.
                      </p>
                    </div>
                    <Link
                      href="/works"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-500 transition hover:underline"
                    >
                      <span>View All Projects</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {featuredProjects.slice(0, 3).map((p) => (
                      <div
                        key={p.id}
                        className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/50 p-5 transition-all hover:-translate-y-1 hover:border-sky-500/50 hover:shadow-xl dark:border-white/10 dark:bg-[#11141e]"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="rounded-md bg-sky-500/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-sky-500 dark:text-sky-400">
                              {p.category}
                            </span>
                            <span className="flex items-center gap-1 text-[11px] text-emerald-500 font-medium">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              {p.status}
                            </span>
                          </div>

                          <h4 className="mt-3 text-base font-bold text-slate-900 transition-colors group-hover:text-sky-500 dark:text-white">
                            {p.title}
                          </h4>
                          <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-2 dark:text-slate-400">
                            {p.shortDescription}
                          </p>
                        </div>

                        <div className="mt-5 pt-4 border-t border-slate-200/60 dark:border-white/5">
                          <div className="flex flex-wrap gap-1 mb-3">
                            {p.technologies.slice(0, 3).map((tech) => (
                              <span
                                key={tech}
                                className="rounded bg-white px-1.5 py-0.5 text-[10px] text-slate-600 dark:bg-[#1a1f2e] dark:text-slate-300"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>

                          <Link
                            href={`/works/${p.slug}`}
                            className="flex items-center justify-between text-xs font-semibold text-sky-500 transition group-hover:text-sky-400"
                          >
                            <span>Inspect Project Details</span>
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* TAB 3: HOBBIES */}
              {activeTab === 'hobbies' && (
                <motion.div
                  key="hobbies"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      Selected Hobbies & Personal Pursuits
                    </h3>
                    <p className="text-xs text-slate-500">
                      When I am not executing client deliverables, here is what fuels my engineering curiosity.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {hobbies.map((h) => (
                      <div
                        key={h.id}
                        className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 transition-all hover:border-sky-500/40 dark:border-white/10 dark:bg-[#11141e]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500 dark:bg-sky-500/20">
                            {getHobbyIcon(h.icon)}
                          </div>
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                              {h.category}
                            </span>
                            <h4 className="text-base font-bold text-slate-900 dark:text-white">
                              {h.name}
                            </h4>
                          </div>
                        </div>
                        <p className="mt-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                          {h.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* TAB 4: SKILLS & EXPERIENCE */}
              {activeTab === 'skills' && (
                <motion.div
                  key="skills"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      Technical Competencies & Stack
                    </h3>
                    <p className="text-xs text-slate-500">
                      Production technologies and frameworks deployed across client architectures.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {skills.map((category) => (
                      <div
                        key={category.id}
                        className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 dark:border-white/10 dark:bg-[#11141e]"
                      >
                        <h4 className="text-sm font-bold text-sky-500 dark:text-sky-400">
                          {category.category}
                        </h4>
                        <div className="mt-4 space-y-2.5">
                          {category.skills.map((sk) => (
                            <div
                              key={sk.name}
                              className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-white px-3 py-2 text-xs dark:border-white/5 dark:bg-[#151926]"
                            >
                              <span className="font-medium text-slate-800 dark:text-slate-200">
                                {sk.name}
                              </span>
                              <span className="rounded bg-sky-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-sky-600 dark:text-sky-400">
                                {sk.level}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* TAB 5: SOCIALS */}
              {activeTab === 'socials' && (
                <motion.div
                  key="socials"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      Verified Social & Community Handles
                    </h3>
                    <p className="text-xs text-slate-500">
                      Reach out directly on your platform of choice. Admin managed.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {socials.map((s) => (
                      <div
                        key={s.id}
                        className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/50 p-5 transition-all hover:border-sky-500/50 dark:border-white/10 dark:bg-[#11141e]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500 dark:bg-sky-500/20">
                            {getSocialIcon(s.platform)}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900 dark:text-white">
                              {s.platform}
                            </div>
                            <div className="font-mono text-xs text-slate-500 dark:text-slate-400">
                              {s.username}
                            </div>
                          </div>
                        </div>

                        <div className="mt-5 flex items-center gap-2 pt-3 border-t border-slate-200/60 dark:border-white/5">
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-sky-500/10 py-2 text-xs font-semibold text-sky-600 transition hover:bg-sky-500 hover:text-white dark:text-sky-400"
                          >
                            <span>Open</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>

                          <button
                            onClick={() => copyToClipboard(s.username, s.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-sky-500 hover:text-sky-500 dark:border-white/10 dark:bg-[#151926] dark:text-slate-300"
                            title="Copy username"
                          >
                            {copiedId === s.id ? (
                              <Check className="h-3.5 w-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
