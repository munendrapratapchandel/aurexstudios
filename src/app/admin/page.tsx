import React from 'react';
import { redirect } from 'next/navigation';
import { checkAdminSession } from '@/lib/auth';
import { getDatabase, initDatabase } from '@/lib/db';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const isAuth = await checkAdminSession();
  if (!isAuth) {
    redirect('/admin/login');
  }

  const db = await initDatabase(true);

  return <AdminDashboard initialData={db} />;
}
