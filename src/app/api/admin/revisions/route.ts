import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, updateDatabase } from '@/lib/db';
import { checkAdminSession } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const REVISIONS_DIR = path.join(process.cwd(), 'data', 'revisions');

export async function GET() {
  const isAuth = await checkAdminSession();
  if (!isAuth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    if (!fs.existsSync(REVISIONS_DIR)) {
      return NextResponse.json({ success: true, revisions: [] });
    }

    const files = fs.readdirSync(REVISIONS_DIR);
    const revisions = files
      .filter((f) => f.endsWith('.json'))
      .map((filename) => {
        const stats = fs.statSync(path.join(REVISIONS_DIR, filename));
        const parts = filename.replace('.json', '').split('-');
        const version = parts[1] || '1';
        return {
          filename,
          version: parseInt(version, 10),
          createdAt: stats.mtime.toISOString(),
          size: stats.size,
        };
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ success: true, revisions });
  } catch (error) {
    console.error('Error fetching revisions:', error);
    return NextResponse.json({ success: false, error: 'Failed to list revisions' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const isAuth = await checkAdminSession();
  if (!isAuth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const { filename } = await req.json();
    if (!filename) return NextResponse.json({ success: false, error: 'Filename is required' }, { status: 400 });

    const targetFile = path.join(REVISIONS_DIR, filename);
    if (!fs.existsSync(targetFile)) {
      return NextResponse.json({ success: false, error: 'Revision file not found' }, { status: 404 });
    }

    const raw = fs.readFileSync(targetFile, 'utf-8');
    const restoredData = JSON.parse(raw);

    updateDatabase((db) => {
      Object.assign(db, restoredData);
      db.updatedAt = new Date().toISOString();
    });

    return NextResponse.json({
      success: true,
      message: `Successfully rolled back to snapshot ${filename}`,
    });
  } catch (error) {
    console.error('Error restoring revision:', error);
    return NextResponse.json({ success: false, error: 'Failed to restore revision' }, { status: 500 });
  }
}
