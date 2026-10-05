import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, initDatabase, updateDatabaseAsync } from '@/lib/db';
import { checkAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const isAuth = await checkAdminSession();
  if (!isAuth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const db = await initDatabase(true);
  return NextResponse.json({ success: true, requests: db.contactRequests });
}

export async function PUT(req: NextRequest) {
  const isAuth = await checkAdminSession();
  if (!isAuth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const { id, status, internalNotes } = await req.json();
    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

    await updateDatabaseAsync((db) => {
      const item = db.contactRequests.find((r) => r.id === id);
      if (item) {
        if (status !== undefined) item.status = status;
        if (internalNotes !== undefined) item.internalNotes = internalNotes;
      }
    });

    return NextResponse.json({ success: true, message: 'Request status updated' });
  } catch (error) {
    console.error('Error updating request:', error);
    return NextResponse.json({ success: false, error: 'Failed to update request' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const isAuth = await checkAdminSession();
  if (!isAuth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

    await updateDatabaseAsync((db) => {
      db.contactRequests = db.contactRequests.filter((r) => r.id !== id);
    });

    return NextResponse.json({ success: true, message: 'Request deleted' });
  } catch (error) {
    console.error('Error deleting request:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete request' }, { status: 500 });
  }
}
