import { NextResponse } from 'next/server';
import { getApprovedFeedback } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const feedback = getApprovedFeedback();
    return NextResponse.json({ success: true, feedback });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch feedback' }, { status: 500 });
  }
}
