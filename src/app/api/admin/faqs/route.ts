import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, initDatabase, updateDatabaseAsync } from '@/lib/db';
import { checkAdminSession } from '@/lib/auth';
import { FaqItem } from '@/types';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  const isAuth = await checkAdminSession();
  if (!isAuth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const db = await initDatabase(true);
  return NextResponse.json({ success: true, faqs: db.faqs });
}

export async function POST(req: NextRequest) {
  const isAuth = await checkAdminSession();
  if (!isAuth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const body: Partial<FaqItem> = await req.json();
    if (!body.question || !body.answer) {
      return NextResponse.json({ success: false, error: 'Question and answer required' }, { status: 400 });
    }

    const newFaq: FaqItem = {
      id: 'faq-' + Date.now(),
      question: body.question.trim(),
      answer: body.answer.trim(),
      category: body.category || 'General',
      isVisible: body.isVisible !== undefined ? body.isVisible : true,
      order: body.order || 99,
    };

    await updateDatabaseAsync((db) => {
      if (!db.faqs) db.faqs = [];
      db.faqs.push(newFaq);
    });

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/faq');
    } catch {}

    return NextResponse.json({ success: true, faq: newFaq });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    return NextResponse.json({ success: false, error: 'Failed to create FAQ' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const isAuth = await checkAdminSession();
  if (!isAuth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const updatedFaq: FaqItem = await req.json();
    if (!updatedFaq.id) {
      return NextResponse.json({ success: false, error: 'FAQ ID required' }, { status: 400 });
    }

    await updateDatabaseAsync((db) => {
      const idx = db.faqs.findIndex((f) => f.id === updatedFaq.id);
      if (idx !== -1) {
        db.faqs[idx] = { ...db.faqs[idx], ...updatedFaq };
      }
    });

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/faq');
    } catch {}

    return NextResponse.json({ success: true, faq: updatedFaq });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    return NextResponse.json({ success: false, error: 'Failed to update FAQ' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const isAuth = await checkAdminSession();
  if (!isAuth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'FAQ ID required' }, { status: 400 });

    await updateDatabaseAsync((db) => {
      db.faqs = db.faqs.filter((f) => f.id !== id);
    });

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/faq');
    } catch {}

    return NextResponse.json({ success: true, message: 'FAQ deleted' });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete FAQ' }, { status: 500 });
  }
}
