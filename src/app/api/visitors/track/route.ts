import { NextRequest, NextResponse } from 'next/server';
import { recordVisitor, getVisitorMetrics } from '@/lib/db';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const pathName = body.path || '/';

    // Retrieve or generate persistent session ID
    let sessionId = req.cookies.get('px_session_id')?.value;
    const isNewSession = !sessionId;

    if (!sessionId) {
      sessionId = 'sess_' + crypto.randomBytes(16).toString('hex');
    }

    // IP Hash for pseudo-anonymized tracking
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const ipHash = crypto.createHash('md5').update(ip).digest('hex').substring(0, 12);

    recordVisitor(sessionId, pathName, ipHash);
    const metrics = getVisitorMetrics();

    const response = NextResponse.json({
      success: true,
      totalVisitors: metrics.totalVisitors,
      activeVisitors: metrics.activeVisitors,
      todayVisitors: metrics.todayVisitors,
    });

    if (isNewSession) {
      response.cookies.set('px_session_id', sessionId, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
      });
    }

    return response;
  } catch (error) {
    console.error('Visitor tracking error:', error);
    return NextResponse.json({ success: false, error: 'Tracking error' }, { status: 500 });
  }
}
