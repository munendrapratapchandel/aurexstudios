import React from 'react';
import {
  initDatabase,
  getDevelopers,
  getFeaturedDevelopers,
  getProjects,
  getSiteSettings,
  getSocialLinks,
  getWorkspaceDashboard,
} from '@/lib/db';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { VisitorTracker } from '@/components/VisitorTracker';
import { DashboardClient } from './DashboardClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage() {
  await initDatabase();
  const developers = getDevelopers(true); // Only visible developers
  const featuredDevelopers = getFeaturedDevelopers();
  const projects = getProjects();
  const settings = getSiteSettings();
  const socials = getSocialLinks();
  const workspace = getWorkspaceDashboard();

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
          <DashboardClient
            developers={developers}
            featuredDevelopers={featuredDevelopers}
            projects={projects}
            currentlyBuilding={workspace.currentlyBuilding}
          />
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
