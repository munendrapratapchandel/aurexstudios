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
  return {
    title: `${settings.siteName} — ${settings.tagline}`,
    description: settings.metaDescription,
    icons: {
      icon: settings.faviconUrl || '/favicon.ico',
    },
    openGraph: {
      title: `${settings.siteName} — Digital Workspace`,
      description: settings.metaDescription,
      images: [settings.ogImageUrl],
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
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
