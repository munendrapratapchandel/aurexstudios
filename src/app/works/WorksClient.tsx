'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '@/types';
import { ArrowRight, ExternalLink, Sparkles, Filter, Search } from 'lucide-react';

interface WorksClientProps {
  initialProjects: Project[];
}

export function WorksClient({ initialProjects }: WorksClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Web', 'Minecraft', 'Discord', 'Bots'];

  const filteredProjects = initialProjects.filter((p) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      p.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesQuery =
      searchQuery.trim() === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesQuery;
  });

  return (
    <div>
      {/* Category Filter & Search Bar */}
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        {/* Category Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-5 py-2.5 text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                  : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-white/10 dark:bg-[#0e111a] dark:text-slate-300 dark:hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects or stack..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-white/10 dark:bg-[#0e111a] dark:text-white"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <motion.div layout className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filteredProjects.map((project) => (
            <motion.div
              layout
              key={project.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-2 hover:border-sky-500/40 hover:shadow-2xl dark:border-white/10 dark:bg-[#0e111a]"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-[#151926]">
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 rounded-lg bg-black/60 px-2.5 py-1 font-mono text-[11px] font-semibold text-white backdrop-blur-md">
                  {project.category}
                </div>
                <div className="absolute top-4 right-4 rounded-lg bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-emerald-400 backdrop-blur-md">
                  {project.status}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-sky-500 dark:text-white">
                  {project.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-3 dark:text-slate-400">
                  {project.shortDescription}
                </p>

                {/* Tech Tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.technologies.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-slate-200/80 bg-slate-50 px-2 py-0.5 font-mono text-[10px] text-slate-600 dark:border-white/5 dark:bg-[#141824] dark:text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                  <Link
                    href={`/works/${project.slug}`}
                    className="flex items-center gap-1.5 text-xs font-semibold text-sky-500 transition group-hover:text-sky-400"
                  >
                    <span>View Project</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-sky-500 hover:text-sky-500 dark:border-white/10 dark:text-slate-400"
                      title="Open Live Preview"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredProjects.length === 0 && (
        <div className="mt-16 rounded-3xl border border-dashed border-slate-200 p-12 text-center dark:border-white/10">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No projects matched your criteria.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="mt-4 rounded-xl bg-sky-500 px-4 py-2 text-xs font-semibold text-white"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
