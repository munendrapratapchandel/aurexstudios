import { NextResponse } from 'next/server';
import { getVisitorMetrics } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const metrics = getVisitorMetrics();
    return NextResponse.json({
      success: true,
      metrics,
    });
  } catch (error) {
    console.error('Visitor stats error:', error);
    return NextResponse.json({ success: false, error: 'Stats error' }, { status: 500 });
  }
}
