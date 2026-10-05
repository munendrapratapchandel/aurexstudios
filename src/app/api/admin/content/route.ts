import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, updateDatabase } from '@/lib/db';
import { checkAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const isAuth = await checkAdminSession();
  if (!isAuth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const db = getDatabase();
  return NextResponse.json({
    success: true,
    data: {
      siteSettings: db.siteSettings,
      heroContent: db.heroContent,
      workspaceDashboard: db.workspaceDashboard,
      socialLinks: db.socialLinks,
      hobbies: db.hobbies,
      skillCategories: db.skillCategories,
      visitorMetrics: db.visitorMetrics,
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

    const updatedDb = updateDatabase((db) => {
      if (payload.siteSettings) {
        db.siteSettings = { ...db.siteSettings, ...payload.siteSettings };
      }
      if (payload.heroContent) {
        db.heroContent = { ...db.heroContent, ...payload.heroContent };
      }
      if (payload.workspaceDashboard) {
        db.workspaceDashboard = { ...db.workspaceDashboard, ...payload.workspaceDashboard };
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
    });

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
