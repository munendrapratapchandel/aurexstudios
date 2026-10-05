'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Project } from '@/types';
import { ArrowRight, ExternalLink, Code2, Sparkles, FolderGit2 } from 'lucide-react';

interface FeaturedWorksSectionProps {
  projects: Project[];
}

export function FeaturedWorksSection({ projects }: FeaturedWorksSectionProps) {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3.5 py-1 text-xs font-mono font-semibold tracking-wider text-sky-500 uppercase dark:text-sky-400">
              <FolderGit2 className="h-3.5 w-3.5" />
              <span>PRODUCTION PORTFOLIO</span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Featured Client Builds
            </h2>
            <p className="mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-400">
              Real-world systems, web applications, and server infrastructures delivered with precision.
            </p>
          </div>

          <Link
            href="/works"
            className="group flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-800 shadow-sm transition hover:border-sky-500 hover:text-sky-500 dark:border-white/10 dark:bg-[#0f1118] dark:text-slate-200"
          >
            <span>Explore All Works</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Project Cards Grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-sky-500/50 hover:shadow-2xl hover:shadow-sky-500/10 dark:border-white/10 dark:bg-[#0e111a]"
            >
              {/* Media Thumbnail */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-[#151926]">
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-80" />

                {/* Badges on Thumbnail */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="rounded-lg bg-black/60 px-2.5 py-1 font-mono text-[11px] font-semibold text-white backdrop-blur-md">
                    {project.category}
                  </span>
                </div>

                <div className="absolute top-4 right-4">
                  <span className="flex items-center gap-1.5 rounded-lg bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-emerald-400 backdrop-blur-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    {project.status}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-sky-500 dark:text-white">
                  {project.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-2 dark:text-slate-400">
                  {project.shortDescription}
                </p>

                {/* Tech Stack Chips */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-slate-200/80 bg-slate-50 px-2 py-0.5 font-mono text-[10px] text-slate-600 dark:border-white/5 dark:bg-[#141824] dark:text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                  <Link
                    href={`/works/${project.slug}`}
                    className="flex items-center gap-1.5 text-xs font-semibold text-sky-500 transition group-hover:text-sky-400"
                  >
                    <span>View Case Study</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-sky-500 hover:text-sky-500 dark:border-white/10 dark:bg-[#141824] dark:text-slate-300"
                      title="Visit live link"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
