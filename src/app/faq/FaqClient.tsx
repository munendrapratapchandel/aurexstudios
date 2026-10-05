'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaqItem } from '@/types';
import { ChevronDown, Search, HelpCircle } from 'lucide-react';

interface FaqClientProps {
  initialFaqs: FaqItem[];
}

export function FaqClient({ initialFaqs }: FaqClientProps) {
  const [openIds, setOpenIds] = useState<string[]>([initialFaqs[0]?.id || '']);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', ...Array.from(new Set(initialFaqs.map((f) => f.category)))];

  const toggle = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = initialFaqs.filter((f) => {
    const matchesCategory =
      activeCategory === 'All' || f.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesQuery =
      searchQuery.trim() === '' ||
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="mx-auto max-w-4xl">
      {/* Category filter & Search */}
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                  : 'border border-slate-200 bg-white text-slate-700 dark:border-white/10 dark:bg-[#0e111a] dark:text-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs text-slate-900 outline-none transition focus:border-sky-500 dark:border-white/10 dark:bg-[#0e111a] dark:text-white"
          />
        </div>
      </div>

      {/* Accordion */}
      <div className="mt-10 space-y-4">
        {filteredFaqs.map((faq) => {
          const isOpen = openIds.includes(faq.id);
          return (
            <div
              key={faq.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 dark:border-white/10 dark:bg-[#0e111a]"
            >
              <button
                onClick={() => toggle(faq.id)}
                className="flex w-full items-center justify-between p-6 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-lg bg-sky-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-sky-500 dark:bg-sky-500/20">
                    {faq.category}
                  </span>
                  <span className="text-base font-bold text-slate-900 dark:text-white">
                    {faq.question}
                  </span>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-sky-500' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="border-t border-slate-100 px-6 pt-4 pb-6 text-sm leading-relaxed text-slate-600 dark:border-white/5 dark:text-slate-300">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {filteredFaqs.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-500 dark:border-white/10">
            No frequently asked questions matched your search query.
          </div>
        )}
      </div>
    </div>
  );
}
