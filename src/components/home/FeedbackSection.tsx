'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FeedbackItem } from '@/types';
import { Star, MessageSquarePlus, Quote, CheckCircle } from 'lucide-react';
import { FeedbackModal } from '../FeedbackModal';

interface FeedbackSectionProps {
  feedbackList: FeedbackItem[];
}

export function FeedbackSection({ feedbackList }: FeedbackSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3.5 py-1 text-xs font-mono font-semibold tracking-wider text-sky-500 uppercase dark:text-sky-400">
            <Quote className="h-3.5 w-3.5" />
            <span>COMMUNITY & CLIENT REVIEWS</span>
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Verified Feedback
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600 dark:text-slate-400">
            Real feedback from server owners, game studios, community leaders, and founders.
          </p>
        </div>

        {/* Feedback Cards */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {feedbackList.slice(0, 4).map((fb, index) => (
            <motion.div
              key={fb.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-sky-500/40 hover:shadow-lg dark:border-white/10 dark:bg-[#0e111a]"
            >
              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: fb.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Comment */}
                <p className="mt-4 text-xs leading-relaxed text-slate-600 italic line-clamp-4 dark:text-slate-300">
                  &quot;{fb.comment}&quot;
                </p>
              </div>

              {/* Author & Role */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500/10 font-mono text-xs font-bold text-sky-500">
                    {fb.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {fb.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {fb.role || 'Verified Client'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA to Give Feedback */}
        <div className="mt-12 text-center">
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2.5 rounded-xl border border-sky-500/30 bg-sky-500/10 px-6 py-3 text-xs font-semibold text-sky-600 transition hover:bg-sky-500 hover:text-white dark:text-sky-300 dark:hover:bg-sky-500/20"
          >
            <MessageSquarePlus className="h-4 w-4" />
            <span>Leave Your Feedback</span>
          </button>
        </div>
      </div>

      <FeedbackModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}
