import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, updateDatabase } from '@/lib/db';
import { checkAdminSession } from '@/lib/auth';
import { MediaItem } from '@/types';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

function ensureUploadDir() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

export async function GET() {
  const isAuth = await checkAdminSession();
  if (!isAuth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const db = getDatabase();
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

    fs.writeFileSync(filePath, buffer);

    // If uploading a favicon, also mirror it to root public/favicon.ico and src/app/favicon.ico
    if (file.name.toLowerCase().endsWith('.ico') || category === 'favicon' || file.name.toLowerCase().includes('favicon')) {
      try {
        fs.writeFileSync(path.join(process.cwd(), 'public', 'favicon.ico'), buffer);
        fs.writeFileSync(path.join(process.cwd(), 'src', 'app', 'favicon.ico'), buffer);
      } catch (e) {
        console.error('Failed to sync favicon to root:', e);
      }
    }

    let publicUrl = `/uploads/${filename}`;

    // Upload to Supabase Storage if configured
    try {
      const { isSupabaseConfigured, uploadMediaToSupabase } = require('@/lib/supabase');
      if (isSupabaseConfigured()) {
        const storageRes = await uploadMediaToSupabase(buffer, filename, file.type || 'application/octet-stream');
        if (storageRes.success && storageRes.url) {
          publicUrl = storageRes.url;
        }
      }
    } catch (storageErr) {
      console.warn('Supabase storage upload fallback to local disk:', storageErr);
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

    updateDatabase((db) => {
      if (!db.media) db.media = [];
      db.media.unshift(newMedia);
    });

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

    updateDatabase((database) => {
      database.media = database.media.filter((m) => m.id !== id);
    });

    return NextResponse.json({ success: true, message: 'Media item deleted' });
  } catch (error) {
    console.error('Delete media error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete media' }, { status: 500 });
  }
}
