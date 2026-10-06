import { NextRequest, NextResponse } from 'next/server';
import {
  getVisitorMetrics,
  getVisitorSessions,
  resetVisitorMetrics,
  updateVisitorMetrics,
  deleteVisitorSession,
  clearVisitorSessions,
  recordVisitor,
  updateDatabaseAsync,
  getDatabase,
  initDatabase,
} from '@/lib/db';
import { checkAdminSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  const isAuth = await checkAdminSession();
  if (!isAuth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  await initDatabase(true);
  const metrics = getVisitorMetrics();
  const sessions = getVisitorSessions();

  return NextResponse.json({
    success: true,
    metrics,
    sessions,
  });
}

export async function POST(req: NextRequest) {
  const isAuth = await checkAdminSession();
  if (!isAuth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const action = body.action;

    if (action === 'reset-all') {
      await updateDatabaseAsync(() => {
        resetVisitorMetrics();
      });
    } else if (action === 'reset-today') {
      await updateDatabaseAsync(() => {
        updateVisitorMetrics({ todayVisitors: 0 });
      });
    } else if (action === 'set-base') {
      const count = parseInt(body.totalVisitors, 10);
      if (!isNaN(count) && count >= 0) {
        await updateDatabaseAsync(() => {
          updateVisitorMetrics({ totalVisitors: count });
        });
      }
    } else if (action === 'delete-session') {
      if (body.sessionId) {
        await updateDatabaseAsync(() => {
          deleteVisitorSession(body.sessionId);
        });
      }
    } else if (action === 'clear-sessions') {
      await updateDatabaseAsync(() => {
        clearVisitorSessions();
      });
    } else if (action === 'simulate-ping') {
      const simSession = 'sim_' + Math.random().toString(36).substring(2, 9);
      recordVisitor(simSession, body.path || '/', 'sim_preview_ip');
    } else if (action === 'toggle-public') {
      await updateDatabaseAsync((db) => {
        db.heroContent.showLiveVisitors = Boolean(body.showLiveVisitors);
      });
    } else {
      return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
    }

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/');
    } catch {
      // ignore
    }

    const updatedMetrics = getVisitorMetrics();
    const updatedSessions = getVisitorSessions();

    return NextResponse.json({
      success: true,
      message: 'Visitor action processed successfully',
      metrics: updatedMetrics,
      sessions: updatedSessions,
    });
  } catch (error: any) {
    console.error('Admin visitor management error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Visitor management failed' },
      { status: 500 }
    );
  }
}
