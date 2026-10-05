import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, updateDatabase } from '@/lib/db';
import { checkAdminSession } from '@/lib/auth';
import { Service } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const isAuth = await checkAdminSession();
  if (!isAuth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const db = getDatabase();
  return NextResponse.json({ success: true, services: db.services });
}

export async function POST(req: NextRequest) {
  const isAuth = await checkAdminSession();
  if (!isAuth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const body: Partial<Service> = await req.json();
    if (!body.title || !body.slug) {
      return NextResponse.json({ success: false, error: 'Title and slug required' }, { status: 400 });
    }

    const newService: Service = {
      id: 'serv-' + Date.now(),
      slug: body.slug.trim().toLowerCase(),
      title: body.title.trim(),
      shortDescription: body.shortDescription || '',
      icon: body.icon || 'Layers',
      bannerImage: body.bannerImage || '',
      heroIntro: body.heroIntro || '',
      startingPrice: body.startingPrice || '₹10,000',
      featuredProjectIds: body.featuredProjectIds || [],
      sections: body.sections || [],
      plans: body.plans || [],
      isPublished: body.isPublished !== undefined ? body.isPublished : true,
      order: body.order || 99,
    };

    updateDatabase((db) => {
      if (!db.services) db.services = [];
      db.services.push(newService);
    });

    return NextResponse.json({ success: true, service: newService });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json({ success: false, error: 'Failed to create service' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const isAuth = await checkAdminSession();
  if (!isAuth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const updatedService: Service = await req.json();
    if (!updatedService.id) {
      return NextResponse.json({ success: false, error: 'Service ID is required' }, { status: 400 });
    }

    updateDatabase((db) => {
      const idx = db.services.findIndex((s) => s.id === updatedService.id);
      if (idx !== -1) {
        db.services[idx] = { ...db.services[idx], ...updatedService };
      }
    });

    return NextResponse.json({ success: true, service: updatedService });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json({ success: false, error: 'Failed to update service' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const isAuth = await checkAdminSession();
  if (!isAuth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Service ID required' }, { status: 400 });
    }

    updateDatabase((db) => {
      db.services = db.services.filter((s) => s.id !== id);
    });

    return NextResponse.json({ success: true, message: 'Service deleted' });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete service' }, { status: 500 });
  }
}
