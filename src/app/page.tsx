import React from 'react';
import {
  getHeroContent,
  getSiteSettings,
  getWorkspaceDashboard,
  getSocialLinks,
  getHobbies,
  getSkillCategories,
  getServices,
  getFeaturedProjects,
  getApprovedFeedback,
  getVisitorMetrics,
  getContactContent,
} from '@/lib/db';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { WorkspaceDashboard } from '@/components/home/WorkspaceDashboard';
import { ServicesSection } from '@/components/home/ServicesSection';
import { FeaturedWorksSection } from '@/components/home/FeaturedWorksSection';
import { CapabilitiesSection } from '@/components/home/CapabilitiesSection';
import { FeedbackSection } from '@/components/home/FeedbackSection';
import { ContactSection } from '@/components/home/ContactSection';
import { VisitorTracker } from '@/components/VisitorTracker';

// Revalidate on every request so admin changes are immediately reflected live!
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function HomePage() {
  const hero = getHeroContent();
  const settings = getSiteSettings();
  const dashboard = getWorkspaceDashboard();
  const socials = getSocialLinks();
  const hobbies = getHobbies();
  const skills = getSkillCategories();
  const services = getServices();
  const featuredProjects = getFeaturedProjects();
  const feedback = getApprovedFeedback();
  const visitorMetrics = getVisitorMetrics();
  const contactContent = getContactContent();

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

      <main>
        {/* 1. Hero Section with Video/Image option & Live Visitors */}
        <HeroSection
          hero={hero}
          settings={settings}
          visitorMetrics={visitorMetrics}
        />

        {/* 2. Interactive Workspace Dashboard */}
        <WorkspaceDashboard
          dashboard={dashboard}
          socials={socials}
          hobbies={hobbies}
          skills={skills}
          featuredProjects={featuredProjects}
        />

        {/* 3. Services Section */}
        <ServicesSection services={services} />

        {/* 4. Featured Works */}
        <FeaturedWorksSection projects={featuredProjects} />

        {/* 5. What I Can Build / Capabilities */}
        <CapabilitiesSection />

        {/* 6. Visitor Reviews & Feedback */}
        <FeedbackSection feedbackList={feedback} />

        {/* 7. Contact / "Let's Build Something" */}
        <ContactSection socials={socials} content={contactContent} />
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
