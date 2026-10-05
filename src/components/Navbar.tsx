'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';
import { Sun, Moon, Menu, X, Shield, Terminal } from 'lucide-react';

interface NavbarProps {
  siteName?: string;
  tagline?: string;
  logoUrl?: string;
}

export function Navbar({ siteName = 'Aurex Studio', tagline }: NavbarProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // HARD REQUIREMENT #2: Strictly only these 5 public navigation items!
  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Works', href: '/works' },
    { label: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/85 py-3 shadow-md backdrop-blur-md dark:bg-[#07080c]/85 dark:border-b dark:border-white/10'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/20 transition-transform group-hover:scale-105">
            <Terminal className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-bold tracking-tight text-slate-900 transition-colors group-hover:text-sky-500 dark:text-white">
                {siteName}
              </span>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
            </div>
            <p className="hidden text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 sm:block">
              {tagline || 'Development · Design · Digital Experiences'}
            </p>
          </div>
        </Link>

        {/* Desktop Navigation: ONLY Home, Services, FAQ, Works, Contact */}
        <nav className="hidden items-center gap-1 rounded-full border border-slate-200/80 bg-white/70 p-1.5 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-[#0d1017]/70 md:flex">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side: Light / Dark Mode Toggle + Subtle Admin Portal Link */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleTheme}
            aria-label="Toggle Light / Dark theme"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100 hover:text-sky-500 dark:border-white/10 dark:bg-[#0f1118] dark:text-slate-200 dark:hover:bg-white/5 dark:hover:text-sky-400"
          >
            {theme === 'dark' ? (
              <Sun className="h-4.5 w-4.5 text-amber-400 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="h-4.5 w-4.5 text-sky-600 transition-transform hover:-rotate-12" />
            )}
          </button>

          {/* Quick Admin Access */}
          <Link
            href="/admin"
            title="Professorx Admin Panel"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/60 bg-transparent text-slate-400 transition hover:border-slate-300 hover:text-slate-700 dark:border-white/5 dark:text-slate-500 dark:hover:border-white/20 dark:hover:text-white"
          >
            <Shield className="h-4 w-4" />
          </Link>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 dark:border-white/10 dark:bg-[#0f1118] dark:text-white md:hidden"
            aria-label="Open Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white/95 px-4 pt-3 pb-6 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-[#08090d]/95 md:hidden">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-xl px-4 py-3 text-base font-medium transition ${
                    active
                      ? 'bg-sky-500 text-white'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
