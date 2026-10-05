import React from 'react';
import { checkAdminSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuth = await checkAdminSession();

  // If not authenticated, we handle it inside page or redirect, but let /admin/login pass
  return <>{children}</>;
}
