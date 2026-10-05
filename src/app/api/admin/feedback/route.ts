import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, updateDatabase } from '@/lib/db';
import { checkAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const isAuth = await checkAdminSession();
  if (!isAuth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const db = getDatabase();
  return NextResponse.json({ success: true, feedback: db.feedback });
}

export async function PUT(req: NextRequest) {
  const isAuth = await checkAdminSession();
  if (!isAuth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const { id, status, isFeatured } = await req.json();
    if (!id) return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });

    updateDatabase((db) => {
      const item = db.feedback.find((f) => f.id === id);
      if (item) {
        if (status !== undefined) item.status = status;
        if (isFeatured !== undefined) item.isFeatured = isFeatured;
      }
    });

    return NextResponse.json({ success: true, message: 'Feedback updated' });
  } catch (error) {
    console.error('Error updating feedback:', error);
    return NextResponse.json({ success: false, error: 'Failed to update feedback' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const isAuth = await checkAdminSession();
  if (!isAuth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

    updateDatabase((db) => {
      db.feedback = db.feedback.filter((f) => f.id !== id);
    });

    return NextResponse.json({ success: true, message: 'Feedback deleted' });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete feedback' }, { status: 500 });
  }
}
