import React from 'react';
import Link from 'next/link';
import { Terminal, Shield, MessageSquare, Heart } from 'lucide-react';
import { SocialLink } from '@/types';
import { DiscordIcon, InstagramIcon, TwitterIcon, GithubIcon } from './SocialIcons';

interface FooterProps {
  siteName?: string;
  tagline?: string;
  logoUrl?: string;
  socials?: SocialLink[];
  availability?: string;
  availabilityText?: string;
}

export function Footer({
  siteName = 'Aurex Studio',
  tagline,
  logoUrl,
  socials = [],
  availability = 'available',
  availabilityText = 'Currently accepting new client projects',
}: FooterProps) {
  const getIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'discord':
        return <DiscordIcon className="h-4 w-4" />;
      case 'instagram':
        return <InstagramIcon className="h-4 w-4" />;
      case 'twitter':
      case 'x':
      case 'x (twitter)':
        return <TwitterIcon className="h-3.5 w-3.5" />;
      case 'github':
        return <GithubIcon className="h-4 w-4" />;
      default:
        return <Terminal className="h-4 w-4" />;
    }
  };

  return (
    <footer className="relative border-t border-slate-200/80 bg-slate-50/50 py-16 dark:border-white/10 dark:bg-[#06070a]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Column 1: Brand & Positioning */}
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5">
              {logoUrl ? (
                <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-slate-200/60 bg-white p-1 shadow-md dark:border-white/10 dark:bg-[#0e1017]">
                  <img src={logoUrl} alt={siteName} className="max-h-full max-w-full object-contain" />
                </div>
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500 text-white shadow-md shadow-sky-500/25">
                  <Terminal className="h-4.5 w-4.5" />
                </div>
              )}
              <span className="font-mono text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                {siteName}
              </span>
            </Link>
            <p className="max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {tagline}. High-caliber craftsmanship across modern web platforms, Minecraft server networks, and Discord automation ecosystems.
            </p>

            {/* Availability Badge */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm dark:border-white/10 dark:bg-[#0e1017] dark:text-slate-300">
              <span
                className={`h-2 w-2 rounded-full ${
                  availability === 'available'
                    ? 'bg-emerald-500'
                    : availability === 'limited'
                    ? 'bg-amber-500'
                    : 'bg-red-500'
                }`}
              />
              <span>{availabilityText}</span>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Navigation
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/" className="transition hover:text-sky-500">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="transition hover:text-sky-500">
                  Services & Pricing
                </Link>
              </li>
              <li>
                <Link href="/works" className="transition hover:text-sky-500">
                  Works & Projects
                </Link>
              </li>
              <li>
                <Link href="/faq" className="transition hover:text-sky-500">
                  FAQ & Support
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition hover:text-sky-500">
                  Contact / Hire Me
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Connect & Admin */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Connect
            </h4>
            <div className="mt-4 flex flex-wrap gap-2">
              {socials.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-sky-500 hover:text-sky-500 dark:border-white/10 dark:bg-[#0f1118] dark:text-slate-400 dark:hover:border-sky-400 dark:hover:text-sky-400"
                  title={`${s.platform} (${s.username})`}
                >
                  {getIcon(s.platform)}
                </a>
              ))}
            </div>
            <div className="mt-6">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 transition hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-400"
              >
                <Shield className="h-3.5 w-3.5" />
                <span>Admin Workspace</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between border-t border-slate-200/60 pt-8 text-xs text-slate-500 dark:border-white/5 dark:text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
          <p className="mt-2 flex items-center gap-1 sm:mt-0">
            Engineered with Next.js 14 & Motion
          </p>
        </div>
      </div>
    </footer>
  );
}
