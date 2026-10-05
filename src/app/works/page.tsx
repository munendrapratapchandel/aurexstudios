import React from 'react';
import { getProjects, getSiteSettings, getSocialLinks, initDatabase } from '@/lib/db';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { VisitorTracker } from '@/components/VisitorTracker';
import { WorksClient } from './WorksClient';
import { FolderGit2 } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function WorksPage() {
  await initDatabase();
  const projects = getProjects();
  const settings = getSiteSettings();
  const socials = getSocialLinks();

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

      <main className="pt-28 pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3.5 py-1 text-xs font-mono font-semibold tracking-wider text-sky-500 uppercase dark:text-sky-400">
              <FolderGit2 className="h-3.5 w-3.5" />
              <span>DELIVERABLES & ARCHITECTURE</span>
            </div>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
              Works & Production Case Studies
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 dark:text-slate-300">
              An archive of completed client systems, custom Minecraft networks, automated Discord bots, and web platforms.
            </p>
          </div>

          <div className="mt-14">
            <WorksClient initialProjects={projects} />
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
