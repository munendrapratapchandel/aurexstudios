'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Service } from '@/types';
import { Globe, Box, MessageSquare, Bot, ArrowRight, Layers, Sparkles } from 'lucide-react';

interface ServicesSectionProps {
  services: Service[];
}

export function ServicesSection({ services }: ServicesSectionProps) {
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
    <section className="relative py-24 bg-slate-50/50 dark:bg-[#07090f]/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3.5 py-1 text-xs font-mono font-semibold tracking-wider text-sky-500 uppercase dark:text-sky-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>CORE CAPABILITIES</span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Development & Engineering Services
            </h2>
            <p className="mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-400">
              High-performance solutions designed and engineered around your exact project requirements.
            </p>
          </div>

          <Link
            href="/services"
            className="group flex items-center gap-2 text-sm font-semibold text-sky-500 transition hover:text-sky-400"
          >
            <span>Compare All Plans & Details</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Services Grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-sky-500/40 hover:shadow-2xl hover:shadow-sky-500/10 dark:border-white/10 dark:bg-[#0e111a]"
            >
              <div>
                {/* Top: Icon + Starting price badge */}
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-500 transition-colors group-hover:bg-sky-500 group-hover:text-white dark:bg-sky-500/20">
                    {getIcon(service.icon)}
                  </div>
                  {service.startingPrice && (
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-mono text-xs font-semibold text-slate-700 dark:border-white/5 dark:bg-[#151926] dark:text-slate-300">
                      From {service.startingPrice}
                    </span>
                  )}
                </div>

                {/* Title & Short Description */}
                <h3 className="mt-6 text-xl font-bold tracking-tight text-slate-900 transition-colors group-hover:text-sky-500 dark:text-white">
                  {service.title}
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-slate-600 line-clamp-3 dark:text-slate-400">
                  {service.shortDescription}
                </p>

                {/* Quick Capabilities Highlights */}
                {service.sections?.[0]?.items && (
                  <div className="mt-5 space-y-1.5 border-t border-slate-100 pt-4 dark:border-white/5">
                    {service.sections[0].items.slice(0, 3).map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400"
                      >
                        <span className="h-1 w-1 rounded-full bg-sky-500" />
                        <span className="truncate">{item.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom CTA: View Service */}
              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-white/5">
                <Link
                  href={`/services/${service.slug}`}
                  className="flex w-full items-center justify-between rounded-xl bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-800 transition-all group-hover:bg-sky-500 group-hover:text-white dark:bg-[#141824] dark:text-slate-200"
                >
                  <span>View Service & Proof</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
