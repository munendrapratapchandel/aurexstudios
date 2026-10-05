import React from 'react';
import { getSiteSettings, getSocialLinks, getContactContent, initDatabase } from '@/lib/db';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { VisitorTracker } from '@/components/VisitorTracker';
import { ContactForm } from '@/components/ContactForm';
import {
  Sparkles,
  MessageSquare,
  Terminal,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Zap,
  Mail,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ContactPage() {
  await initDatabase();
  const settings = getSiteSettings();
  const socials = getSocialLinks();
  const contactContent = getContactContent();
  const discordLink = socials.find((s) => s.platform.toLowerCase() === 'discord');

  const getGuaranteeIcon = (iconName?: string) => {
    switch (iconName?.toLowerCase()) {
      case 'terminal':
        return <Terminal className="h-5 w-5" />;
      case 'shield':
      case 'shieldcheck':
        return <ShieldCheck className="h-5 w-5" />;
      case 'clock':
        return <Clock className="h-5 w-5" />;
      case 'zap':
        return <Zap className="h-5 w-5" />;
      case 'sparkles':
        return <Sparkles className="h-5 w-5" />;
      default:
        return <CheckCircle2 className="h-5 w-5" />;
    }
  };

  const discordUrl = contactContent.directDiscordUrl || discordLink?.url || 'https://discord.gg/aurex';
  const discordUser = contactContent.directDiscordUsername || discordLink?.username || 'aurex.studio';
  const discordBtnText = contactContent.directDiscordButtonText || (discordUser ? `Join Discord (${discordUser})` : 'Join Discord Server');

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
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Left Column */}
            <div className="space-y-6 lg:col-span-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3.5 py-1 text-xs font-mono font-semibold tracking-wider text-sky-500 uppercase dark:text-sky-400">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{contactContent.badge || 'START A PROJECT'}</span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
                {contactContent.title || "Let's Build Something"}
              </h1>

              <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
                {contactContent.description ||
                  'Submit your project goals, scope, and timeline below. Every inquiry is personally reviewed by the Aurex Studio team with a prompt architectural response within 24 hours.'}
              </p>

              {contactContent.responseTimeText && (
                <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{contactContent.responseTimeText}</span>
                </div>
              )}

              {/* Engineering Guarantees */}
              <div className="space-y-4 pt-4">
                {(contactContent.guarantees || []).map((guarantee) => (
                  <div key={guarantee.id} className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500 dark:bg-sky-500/20">
                      {getGuaranteeIcon(guarantee.icon)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {guarantee.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {guarantee.description}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Direct Discord Channel Card */}
                {discordUrl && (
                  <div className="mt-8 rounded-3xl border border-sky-500/30 bg-sky-500/5 p-6">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-sky-500">
                      <MessageSquare className="h-4 w-4" />
                      <span>{contactContent.directDiscordTitle || 'Direct Discord Communication'}</span>
                    </div>
                    <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                      {contactContent.directDiscordDesc ||
                        'Prefer instant chat over a form? Join the server or DM directly:'}
                    </p>
                    <a
                      href={discordUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-sky-400 shadow-md shadow-sky-500/20"
                    >
                      <span>{discordBtnText}</span>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Interactive Form */}
            <div className="rounded-3xl border border-slate-200/90 bg-white/70 p-8 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-[#0c0e15]/90 sm:p-10 lg:col-span-7">
              <ContactForm content={contactContent} />
            </div>
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
