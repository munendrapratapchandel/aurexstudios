import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, initDatabase, updateDatabaseAsync } from '@/lib/db';
import { checkAdminSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';
import os from 'os';

export const dynamic = 'force-dynamic';

const TMP_REVISIONS_DIR = path.join(os.tmpdir(), 'revisions');
const DATA_REVISIONS_DIR = path.join(process.cwd(), 'data', 'revisions');

function getRevisionsDir(): string {
  if (fs.existsSync(TMP_REVISIONS_DIR)) return TMP_REVISIONS_DIR;
  if (fs.existsSync(DATA_REVISIONS_DIR)) return DATA_REVISIONS_DIR;
  return TMP_REVISIONS_DIR;
}

export async function GET() {
  const isAuth = await checkAdminSession();
  if (!isAuth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const revisionsDir = getRevisionsDir();
    if (!fs.existsSync(revisionsDir)) {
      return NextResponse.json({ success: true, revisions: [] });
    }

    const files = fs.readdirSync(revisionsDir);
    const revisions = files
      .filter((f) => f.endsWith('.json'))
      .map((filename) => {
        const stats = fs.statSync(path.join(revisionsDir, filename));
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

    let targetFile = path.join(TMP_REVISIONS_DIR, filename);
    if (!fs.existsSync(targetFile)) {
      targetFile = path.join(DATA_REVISIONS_DIR, filename);
    }

    if (!fs.existsSync(targetFile)) {
      return NextResponse.json({ success: false, error: 'Revision file not found' }, { status: 404 });
    }

    const raw = fs.readFileSync(targetFile, 'utf-8');
    const restoredData = JSON.parse(raw);

    await updateDatabaseAsync((db) => {
      Object.assign(db, restoredData);
      db.updatedAt = new Date().toISOString();
    });

    try {
      revalidatePath('/', 'layout');
    } catch {}

    return NextResponse.json({
      success: true,
      message: `Successfully rolled back to snapshot ${filename}`,
    });
  } catch (error) {
    console.error('Error restoring revision:', error);
    return NextResponse.json({ success: false, error: 'Failed to restore revision' }, { status: 500 });
  }
}
