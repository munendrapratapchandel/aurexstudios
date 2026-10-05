'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Developer, Project } from '@/types';
import {
  Users,
  Code2,
  FolderGit2,
  Activity,
  Layers,
  ArrowRight,
  Search,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Cpu,
} from 'lucide-react';

interface DashboardClientProps {
  developers: Developer[];
  featuredDevelopers: Developer[];
  projects: Project[];
  currentlyBuilding?: {
    title: string;
    subtitle: string;
    tags: string[];
    progress: number;
    statusText: string;
    link?: string;
  };
}

export function DashboardClient({
  developers,
  featuredDevelopers,
  projects,
  currentlyBuilding,
}: DashboardClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');

  // Compute dynamic stats
  const totalDevs = developers.length;
  const totalProjects = projects.length;
  const activeDevs = developers.filter(
    (d) => d.availability === 'Available' || d.availability === 'Working'
  ).length;

  const uniqueTechs = useMemo(() => {
    const set = new Set<string>();
    developers.forEach((d) => {
      d.technologies?.forEach((t) => set.add(t));
      d.skills?.forEach((s) => set.add(s.name));
    });
    return set.size;
  }, [developers]);

  // Roles for filter tabs
  const roles = ['All', 'Web', 'Minecraft', 'Discord', 'Architecture'];

  // Filter developers
  const filteredDevelopers = useMemo(() => {
    return developers.filter((dev) => {
      const matchesSearch =
        dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dev.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dev.skills?.some((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        dev.technologies?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        dev.specializations?.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (selectedRole === 'All') return true;
      if (selectedRole === 'Web') {
        return (
          dev.role.toLowerCase().includes('web') ||
          dev.role.toLowerCase().includes('front') ||
          dev.specializations?.some((s) => s.toLowerCase().includes('web'))
        );
      }
      if (selectedRole === 'Minecraft') {
        return (
          dev.role.toLowerCase().includes('minecraft') ||
          dev.specializations?.some((s) => s.toLowerCase().includes('minecraft'))
        );
      }
      if (selectedRole === 'Discord') {
        return (
          dev.role.toLowerCase().includes('discord') ||
          dev.role.toLowerCase().includes('bot') ||
          dev.specializations?.some((s) => s.toLowerCase().includes('discord'))
        );
      }
      if (selectedRole === 'Architecture') {
        return (
          dev.role.toLowerCase().includes('architect') ||
          dev.role.toLowerCase().includes('lead') ||
          dev.role.toLowerCase().includes('systems')
        );
      }
      return true;
    });
  }, [developers, searchQuery, selectedRole]);

  // Find developers working on the active project
  const buildingDevs = useMemo(() => {
    return developers.filter((d) => d.projectIds?.includes('proj-1'));
  }, [developers]);

  const getStatusColor = (status: Developer['availability']) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-500 text-emerald-400 border-emerald-500/20';
      case 'Working':
        return 'bg-sky-500 text-sky-400 border-sky-500/20';
      case 'Busy':
        return 'bg-amber-500 text-amber-400 border-amber-500/20';
      case 'Away':
        return 'bg-orange-500 text-orange-400 border-orange-500/20';
      default:
        return 'bg-slate-500 text-slate-400 border-slate-500/20';
    }
  };

  const getStatusDot = (status: Developer['availability']) => {
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

  return (
    <div className="space-y-20">
      {/* 1. DASHBOARD HERO */}
      <section className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-1.5 text-xs font-mono font-semibold tracking-wider text-sky-500 uppercase dark:text-sky-400">
          <Users className="h-3.5 w-3.5" />
          <span>AUREX STUDIO TALENT DASHBOARD</span>
        </div>

        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
          Meet the Developers Behind <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">Aurex Studio</span>
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 dark:text-slate-300">
          A collective of specialized software engineers, game engine architects, and systems integrators building cutting-edge digital experiences.
        </p>

        {/* Dynamic Telemetry Stats Grid */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-[#0e111a]">
            <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
              <Users className="h-4 w-4 text-sky-500" />
              <span className="text-xs font-mono font-semibold uppercase">Total Developers</span>
            </div>
            <div className="mt-3 font-mono text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
              {totalDevs}
            </div>
            <div className="mt-1 text-[11px] text-slate-500">Engineers & Creators</div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-[#0e111a]">
            <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
              <FolderGit2 className="h-4 w-4 text-indigo-500" />
              <span className="text-xs font-mono font-semibold uppercase">Projects Shipped</span>
            </div>
            <div className="mt-3 font-mono text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
              {totalProjects}
            </div>
            <div className="mt-1 text-[11px] text-slate-500">Production Systems</div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-[#0e111a]">
            <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
              <Activity className="h-4 w-4 text-emerald-500" />
              <span className="text-xs font-mono font-semibold uppercase">Active / Online</span>
            </div>
            <div className="mt-3 font-mono text-3xl font-extrabold text-emerald-500 sm:text-4xl">
              {activeDevs}
            </div>
            <div className="mt-1 text-[11px] text-slate-500">Ready for contracts</div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-[#0e111a]">
            <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
              <Code2 className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-mono font-semibold uppercase">Tech Stack</span>
            </div>
            <div className="mt-3 font-mono text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
              {uniqueTechs}+
            </div>
            <div className="mt-1 text-[11px] text-slate-500">Languages & Tools</div>
          </div>
        </div>
      </section>

      {/* 2. CURRENTLY BUILDING (Requirement #7) */}
      {currentlyBuilding && (
        <section className="relative overflow-hidden rounded-3xl border border-sky-500/20 bg-gradient-to-br from-sky-500/5 via-indigo-500/5 to-transparent p-8 backdrop-blur-md dark:border-white/10 dark:bg-[#0e111a]">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />
          
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between relative z-10">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-sky-400 animate-pulse" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-sky-400">
                  CURRENTLY BUILDING
                </span>
                <span className="rounded-full bg-sky-500/10 border border-sky-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-sky-400">
                  {currentlyBuilding.statusText}
                </span>
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                {currentlyBuilding.title}
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-300">
                {currentlyBuilding.subtitle}
              </p>

              {/* Technologies tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {currentlyBuilding.tags?.map((tag, i) => (
                  <span
                    key={i}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-mono font-medium text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Assigned Developers & Progress */}
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/80 p-5 backdrop-blur-md dark:border-white/10 dark:bg-[#141824]/80 min-w-[280px]">
              <div>
                <div className="flex items-center justify-between text-xs font-mono font-semibold">
                  <span className="text-slate-500 dark:text-slate-400">Platform Milestone</span>
                  <span className="text-sky-500">{currentlyBuilding.progress}%</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 transition-all duration-1000"
                    style={{ width: `${currentlyBuilding.progress}%` }}
                  />
                </div>
              </div>

              {/* Assigned Team */}
              <div>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400 block mb-2">
                  Assigned Team
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2 overflow-hidden">
                    {buildingDevs.map((dev) => (
                      <Link
                        key={dev.id}
                        href={`/dashboard/developers/${dev.username}`}
                        title={`${dev.name} (${dev.role})`}
                        className="transition hover:scale-110 hover:z-10"
                      >
                        <img
                          src={dev.profileImage}
                          alt={dev.name}
                          className="h-9 w-9 rounded-full border-2 border-white object-cover shadow-sm dark:border-[#141824]"
                        />
                      </Link>
                    ))}
                  </div>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    {buildingDevs.length} Developers
                  </span>
                </div>
              </div>

              {currentlyBuilding.link && (
                <Link
                  href={currentlyBuilding.link}
                  className="mt-1 flex items-center justify-center gap-1.5 rounded-xl bg-sky-500 py-2 text-xs font-semibold text-white shadow-md shadow-sky-500/20 transition hover:bg-sky-400"
                >
                  <span>Explore Case Study</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 3. FEATURED DEVELOPERS (Requirement #3) */}
      {featuredDevelopers.length > 0 && (
        <section className="space-y-8">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-500">
                CORE TEAM
              </span>
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Featured Developers
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Lead architects and specialist engineers hand-picked to deliver client flagships.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredDevelopers.map((dev) => (
              <div
                key={dev.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-sky-500/50 hover:shadow-xl hover:shadow-sky-500/5 dark:border-white/10 dark:bg-[#0e111a]"
              >
                <div>
                  {/* Card Header: Avatar & Availability */}
                  <div className="flex items-start justify-between">
                    <div className="relative">
                      <img
                        src={dev.profileImage}
                        alt={dev.name}
                        className="h-20 w-20 rounded-2xl border-2 border-slate-100 object-cover shadow-md dark:border-white/10"
                      />
                      <span
                        className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white dark:border-[#0e111a] ${getStatusDot(
                          dev.availability
                        )}`}
                        title={`Status: ${dev.availability}`}
                      />
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getStatusColor(
                        dev.availability
                      )} bg-opacity-10`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${getStatusDot(dev.availability)}`} />
                      <span>{dev.availability}</span>
                    </span>
                  </div>

                  {/* Dev Name & Role */}
                  <div className="mt-5">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-500 transition-colors dark:text-white">
                      {dev.name}
                    </h3>
                    <p className="text-xs font-semibold text-sky-500 dark:text-sky-400">{dev.role}</p>
                    <p className="mt-3 text-xs text-slate-600 line-clamp-2 dark:text-slate-300">
                      {dev.shortBio}
                    </p>
                  </div>

                  {/* Main Skills */}
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {dev.skills?.slice(0, 3).map((skill, i) => (
                      <span
                        key={i}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:border-white/5 dark:bg-white/5 dark:text-slate-300"
                      >
                        {skill.name}
                      </span>
                    ))}
                    {(dev.skills?.length || 0) > 3 && (
                      <span className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-500 dark:border-white/5 dark:bg-white/5">
                        +{(dev.skills?.length || 0) - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card CTA */}
                <div className="mt-6 pt-5 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500">
                    {dev.projectIds?.length || 0} Projects Shipped
                  </span>
                  <Link
                    href={`/dashboard/developers/${dev.username}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-sky-500 hover:text-sky-600 dark:text-sky-400 dark:hover:text-sky-300 transition"
                  >
                    <span>View Profile</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. ALL DEVELOPERS (Requirement #4) */}
      <section className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-sky-500" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-sky-500">
                TEAM DIRECTORY
              </span>
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Our Developers
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Browse all verified developers, their specializations, and portfolio contributions.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, skill, tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-xs text-slate-900 shadow-sm outline-none transition focus:border-sky-500 dark:border-white/10 dark:bg-[#0e111a] dark:text-white"
            />
          </div>
        </div>

        {/* Role Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRole(r)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                selectedRole === r
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:bg-[#0e111a] dark:text-slate-300 dark:hover:bg-white/5'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Developer Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {filteredDevelopers.length === 0 ? (
            <div className="col-span-full rounded-3xl border border-dashed border-slate-200 p-12 text-center text-slate-500 dark:border-white/10">
              <Users className="mx-auto h-8 w-8 text-slate-400 mb-2" />
              <p className="text-sm">No developers found matching &quot;{searchQuery}&quot;</p>
            </div>
          ) : (
            filteredDevelopers.map((dev) => (
              <div
                key={dev.id}
                className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-sky-500/40 hover:shadow-lg dark:border-white/10 dark:bg-[#0e111a]"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={dev.profileImage}
                        alt={dev.name}
                        className="h-14 w-14 rounded-xl border border-slate-100 object-cover shadow-sm dark:border-white/10"
                      />
                      <span
                        className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-[#0e111a] ${getStatusDot(
                          dev.availability
                        )}`}
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-sky-500 transition-colors dark:text-white">
                        {dev.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {dev.role}
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-slate-600 line-clamp-2 dark:text-slate-300">
                    {dev.shortBio}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1">
                    {dev.skills?.slice(0, 3).map((sk, i) => (
                      <span
                        key={i}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:bg-white/5 dark:text-slate-300"
                      >
                        {sk.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500">
                    {dev.experience} exp
                  </span>
                  <Link
                    href={`/dashboard/developers/${dev.username}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-sky-500 hover:text-sky-600 dark:text-sky-400 dark:hover:text-sky-300"
                  >
                    <span>View Profile</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
