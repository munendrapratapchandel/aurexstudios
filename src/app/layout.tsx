import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { getSiteSettings, initDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export async function generateMetadata(): Promise<Metadata> {
  await initDatabase();
  const settings = getSiteSettings();
  const title = settings.metaTitle || `${settings.siteName} — Digital Workspace`;
  const description = settings.metaDescription || settings.tagline || 'Digital development workspace, portfolio & services platform of Aurex Studio.';
  const ogImage = settings.ogImageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';

  return {
    title,
    description,
    icons: {
      icon: settings.faviconUrl || '/favicon.ico',
      shortcut: settings.faviconUrl || '/favicon.ico',
      apple: settings.faviconUrl || '/favicon.ico',
    },
    openGraph: {
      title,
      description,
      siteName: settings.siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: settings.siteName,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await initDatabase();
  const settings = getSiteSettings();
  const title = settings.metaTitle || `${settings.siteName} — Digital Workspace`;
  const description = settings.metaDescription || settings.tagline || 'Digital development workspace, portfolio & services platform of Aurex Studio.';
  const ogImage = settings.ogImageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';
  const favicon = settings.faviconUrl || '/favicon.ico';
  const faviconType = favicon.endsWith('.png')
    ? 'image/png'
    : favicon.endsWith('.svg')
    ? 'image/svg+xml'
    : 'image/x-icon';

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href={favicon} type={faviconType} sizes="any" />
        <link rel="shortcut icon" href={favicon} type={faviconType} />
        <link rel="apple-touch-icon" href={favicon} />
        {/* Discord, Twitter & Social Embed Scraper Tags */}
        <meta property="og:site_name" content={settings.siteName} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="theme-color" content="#0ea5e9" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
