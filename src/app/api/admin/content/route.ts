import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, initDatabase, updateDatabaseAsync } from '@/lib/db';
import { checkAdminSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  const isAuth = await checkAdminSession();
  if (!isAuth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const db = await initDatabase(true);
  return NextResponse.json({
    success: true,
    data: {
      siteSettings: db.siteSettings,
      heroContent: db.heroContent,
      workspaceDashboard: db.workspaceDashboard,
      contactContent: db.contactContent,
      socialLinks: db.socialLinks,
      hobbies: db.hobbies,
      skillCategories: db.skillCategories,
      visitorMetrics: db.visitorMetrics,
      sessions: db.sessions || [],
      version: db.version,
      updatedAt: db.updatedAt,
    },
  });
}

export async function PUT(req: NextRequest) {
  const isAuth = await checkAdminSession();
  if (!isAuth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const payload = await req.json();

    const updatedDb = await updateDatabaseAsync((db) => {
      if (payload.siteSettings) {
        db.siteSettings = { ...db.siteSettings, ...payload.siteSettings };
      }
      if (payload.heroContent) {
        db.heroContent = { ...db.heroContent, ...payload.heroContent };
      }
      if (payload.workspaceDashboard) {
        db.workspaceDashboard = { ...db.workspaceDashboard, ...payload.workspaceDashboard };
      }
      if (payload.contactContent) {
        db.contactContent = { ...(db.contactContent || {}), ...payload.contactContent };
      }
      if (Array.isArray(payload.socialLinks)) {
        db.socialLinks = payload.socialLinks;
      }
      if (Array.isArray(payload.hobbies)) {
        db.hobbies = payload.hobbies;
      }
      if (Array.isArray(payload.skillCategories)) {
        db.skillCategories = payload.skillCategories;
      }
      if (Array.isArray(payload.services)) {
        db.services = payload.services;
      }
      if (Array.isArray(payload.projects)) {
        db.projects = payload.projects;
      }
      if (Array.isArray(payload.developers)) {
        db.developers = payload.developers;
      }
      if (Array.isArray(payload.faqs)) {
        db.faqs = payload.faqs;
      }
      if (payload.visitorMetrics) {
        db.visitorMetrics = { ...db.visitorMetrics, ...payload.visitorMetrics };
      }
      if (Array.isArray(payload.sessions)) {
        db.sessions = payload.sessions;
      }
    });

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/');
      revalidatePath('/services');
      revalidatePath('/works');
      revalidatePath('/contact');
      revalidatePath('/faq');
      revalidatePath('/dashboard');
    } catch {
      // ignore
    }

    return NextResponse.json({
      success: true,
      message: 'Content updated successfully in database',
      version: updatedDb.version,
    });
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json({ success: false, error: 'Failed to update content' }, { status: 500 });
  }
}
