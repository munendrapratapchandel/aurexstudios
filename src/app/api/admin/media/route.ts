import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, initDatabase, updateDatabaseAsync } from '@/lib/db';
import { checkAdminSession } from '@/lib/auth';
import { MediaItem } from '@/types';
import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

function ensureUploadDir() {
  try {
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
  } catch {
    // Read-only serverless environment
  }
}

export async function GET() {
  const isAuth = await checkAdminSession();
  if (!isAuth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const db = await initDatabase(true);
  return NextResponse.json({ success: true, media: db.media });
}

export async function POST(req: NextRequest) {
  const isAuth = await checkAdminSession();
  if (!isAuth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    ensureUploadDir();
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const category = (formData.get('category') as string) || 'image';

    if (!file) {
      return NextResponse.json({ success: false, error: 'File is required' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${Date.now()}-${cleanName}`;
    const filePath = path.join(UPLOADS_DIR, filename);

    // Attempt local write if disk is writable
    try {
      fs.writeFileSync(filePath, buffer);
    } catch {
      // Serverless read-only disk
    }

    // If uploading a favicon, also mirror it to root public/favicon.ico and src/app/favicon.ico (if writable)
    if (file.name.toLowerCase().endsWith('.ico') || category === 'favicon' || file.name.toLowerCase().includes('favicon')) {
      try {
        fs.writeFileSync(path.join(process.cwd(), 'public', 'favicon.ico'), buffer);
        fs.writeFileSync(path.join(process.cwd(), 'src', 'app', 'favicon.ico'), buffer);
      } catch {
        // Safe bypass in read-only environment
      }
    }

    let publicUrl = `/uploads/${filename}`;

    // Upload to Supabase Storage if configured (primary reliable cloud CDN)
    try {
      const { isSupabaseConfigured, uploadMediaToSupabase } = require('@/lib/supabase');
      if (isSupabaseConfigured()) {
        const mimeType = file.type || (filename.endsWith('.ico') ? 'image/x-icon' : filename.endsWith('.png') ? 'image/png' : 'application/octet-stream');
        const storageRes = await uploadMediaToSupabase(buffer, filename, mimeType);
        if (storageRes.success && storageRes.url) {
          publicUrl = storageRes.url;
        }
      }
    } catch (storageErr) {
      console.warn('Supabase storage upload notice:', storageErr);
    }

    // Fallback: If on serverless where /uploads/ cannot be served and publicUrl is still relative, use Data URI
    if (publicUrl.startsWith('/uploads/') && buffer.length <= 3 * 1024 * 1024) {
      const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
      if (isServerless) {
        const mimeType = file.type || (filename.endsWith('.ico') ? 'image/x-icon' : 'image/png');
        publicUrl = `data:${mimeType};base64,${buffer.toString('base64')}`;
      }
    }

    const newMedia: MediaItem = {
      id: 'med-' + Date.now(),
      filename,
      originalName: file.name,
      url: publicUrl,
      mimeType: file.type || 'application/octet-stream',
      size: file.size,
      category: (category as any) || (file.type.startsWith('video') ? 'video' : 'image'),
      uploadedAt: new Date().toISOString(),
    };

    await updateDatabaseAsync((db) => {
      if (!db.media) db.media = [];
      db.media.unshift(newMedia);
    });

    try {
      revalidatePath('/', 'layout');
    } catch {}

    return NextResponse.json({ success: true, media: newMedia });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const isAuth = await checkAdminSession();
  if (!isAuth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Media ID required' }, { status: 400 });

    const db = getDatabase();
    const item = db.media.find((m) => m.id === id);

    if (item && item.url.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), 'public', item.url);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch {
          // ignore
        }
      }
    }

    await updateDatabaseAsync((database) => {
      database.media = database.media.filter((m) => m.id !== id);
    });

    try {
      revalidatePath('/', 'layout');
    } catch {}

    return NextResponse.json({ success: true, message: 'Media item deleted' });
  } catch (error) {
    console.error('Delete media error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete media' }, { status: 500 });
  }
}
