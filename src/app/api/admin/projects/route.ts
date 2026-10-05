import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, updateDatabase } from '@/lib/db';
import { checkAdminSession } from '@/lib/auth';
import { Project } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const isAuth = await checkAdminSession();
  if (!isAuth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const db = getDatabase();
  return NextResponse.json({ success: true, projects: db.projects });
}

export async function POST(req: NextRequest) {
  const isAuth = await checkAdminSession();
  if (!isAuth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const body: Partial<Project> = await req.json();
    if (!body.title || !body.slug) {
      return NextResponse.json({ success: false, error: 'Title and slug required' }, { status: 400 });
    }

    const newProject: Project = {
      id: 'proj-' + Date.now(),
      slug: body.slug.trim().toLowerCase(),
      title: body.title.trim(),
      category: body.category || 'Web',
      shortDescription: body.shortDescription || '',
      fullDescription: body.fullDescription || '',
      technologies: body.technologies || [],
      status: body.status || 'Live',
      liveUrl: body.liveUrl || '',
      githubUrl: body.githubUrl || '',
      coverImage: body.coverImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      galleryImages: body.galleryImages || [],
      challenges: body.challenges || '',
      results: body.results || '',
      isFeatured: body.isFeatured !== undefined ? body.isFeatured : false,
      order: body.order || 99,
    };

    updateDatabase((db) => {
      if (!db.projects) db.projects = [];
      db.projects.push(newProject);
    });

    return NextResponse.json({ success: true, project: newProject });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ success: false, error: 'Failed to create project' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const isAuth = await checkAdminSession();
  if (!isAuth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const updatedProject: Project = await req.json();
    if (!updatedProject.id) {
      return NextResponse.json({ success: false, error: 'Project ID required' }, { status: 400 });
    }

    updateDatabase((db) => {
      const idx = db.projects.findIndex((p) => p.id === updatedProject.id);
      if (idx !== -1) {
        db.projects[idx] = { ...db.projects[idx], ...updatedProject };
      }
    });

    return NextResponse.json({ success: true, project: updatedProject });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ success: false, error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const isAuth = await checkAdminSession();
  if (!isAuth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Project ID required' }, { status: 400 });

    updateDatabase((db) => {
      db.projects = db.projects.filter((p) => p.id !== id);
    });

    return NextResponse.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete project' }, { status: 500 });
  }
}
