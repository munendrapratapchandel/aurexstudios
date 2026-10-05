import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, updateDatabase } from '@/lib/db';
import { checkAdminSession } from '@/lib/auth';
import { Developer } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const isAuth = await checkAdminSession();
  if (!isAuth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const db = getDatabase();
  const developers = (db.developers || []).sort((a, b) => a.displayOrder - b.displayOrder);
  return NextResponse.json({ success: true, developers });
}

export async function POST(req: NextRequest) {
  const isAuth = await checkAdminSession();
  if (!isAuth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const body: Partial<Developer> = await req.json();
    if (!body.name || !body.username) {
      return NextResponse.json({ success: false, error: 'Name and username required' }, { status: 400 });
    }

    const cleanUsername = body.username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const db = getDatabase();
    if ((db.developers || []).some((d) => d.username.toLowerCase() === cleanUsername)) {
      return NextResponse.json({ success: false, error: 'Username already in use' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const newDeveloper: Developer = {
      id: 'dev-' + Date.now(),
      name: body.name.trim(),
      username: cleanUsername,
      role: body.role?.trim() || 'Software Engineer',
      shortBio: body.shortBio?.trim() || '',
      fullBio: body.fullBio?.trim() || '',
      profileImage: body.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      coverImage: body.coverImage || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1400&q=80',
      experience: body.experience?.trim() || '3+ Years',
      availability: body.availability || 'Available',
      customStatus: body.customStatus?.trim() || '',
      skills: Array.isArray(body.skills) ? body.skills : [],
      specializations: Array.isArray(body.specializations) ? body.specializations : [],
      technologies: Array.isArray(body.technologies) ? body.technologies : [],
      projectIds: Array.isArray(body.projectIds) ? body.projectIds : [],
      socials: Array.isArray(body.socials) ? body.socials : [],
      isFeatured: body.isFeatured !== undefined ? !!body.isFeatured : false,
      isVisible: body.isVisible !== undefined ? !!body.isVisible : true,
      displayOrder: body.displayOrder !== undefined ? Number(body.displayOrder) : (db.developers?.length || 0) + 1,
      createdAt: now,
      updatedAt: now,
    };

    updateDatabase((d) => {
      if (!d.developers) d.developers = [];
      d.developers.push(newDeveloper);
    });

    return NextResponse.json({ success: true, developer: newDeveloper });
  } catch (error) {
    console.error('Error creating developer:', error);
    return NextResponse.json({ success: false, error: 'Failed to create developer' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const isAuth = await checkAdminSession();
  if (!isAuth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const body: Partial<Developer> = await req.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Developer ID required' }, { status: 400 });
    }

    let updatedDev: Developer | null = null;
    const now = new Date().toISOString();

    updateDatabase((db) => {
      if (!db.developers) db.developers = [];
      const idx = db.developers.findIndex((d) => d.id === body.id);
      if (idx !== -1) {
        // If username changed, check uniqueness
        if (body.username && body.username.toLowerCase() !== db.developers[idx].username.toLowerCase()) {
          const cleanUsername = body.username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
          const exists = db.developers.some((d) => d.id !== body.id && d.username.toLowerCase() === cleanUsername);
          if (!exists) {
            body.username = cleanUsername;
          } else {
            delete body.username; // keep original if conflict
          }
        }

        db.developers[idx] = {
          ...db.developers[idx],
          ...body,
          updatedAt: now,
        };
        updatedDev = db.developers[idx];
      }
    });

    if (!updatedDev) {
      return NextResponse.json({ success: false, error: 'Developer not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, developer: updatedDev });
  } catch (error) {
    console.error('Error updating developer:', error);
    return NextResponse.json({ success: false, error: 'Failed to update developer' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const isAuth = await checkAdminSession();
  if (!isAuth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Developer ID required' }, { status: 400 });

    updateDatabase((db) => {
      if (!db.developers) db.developers = [];
      db.developers = db.developers.filter((d) => d.id !== id);
    });

    return NextResponse.json({ success: true, message: 'Developer deleted' });
  } catch (error) {
    console.error('Error deleting developer:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete developer' }, { status: 500 });
  }
}
