import React from 'react';
import { redirect } from 'next/navigation';
import { checkAdminSession } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const isAuth = await checkAdminSession();
  if (!isAuth) {
    redirect('/admin/login');
  }

  const db = getDatabase();

  return <AdminDashboard initialData={db} />;
}
