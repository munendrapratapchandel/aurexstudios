import { NextRequest, NextResponse } from 'next/server';
import { updateDatabase, getDatabase } from '@/lib/db';
import { FeedbackItem } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, rating, comment, role } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });
    }

    if (!comment || typeof comment !== 'string' || comment.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'Feedback text is required' }, { status: 400 });
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return NextResponse.json({ success: false, error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    const newItem: FeedbackItem = {
      id: 'fb-' + Date.now(),
      name: name.trim(),
      role: role ? String(role).trim() : 'Verified Visitor',
      rating: numRating,
      comment: comment.trim(),
      status: 'pending', // Moderation safety rule #12
      isFeatured: false,
      createdAt: new Date().toISOString(),
    };

    updateDatabase((db) => {
      if (!db.feedback) db.feedback = [];
      db.feedback.unshift(newItem);
    });

    // Mirror to Supabase feedback table if configured
    try {
      const { pushFeedbackToSupabase } = require('@/lib/supabase');
      pushFeedbackToSupabase(newItem).catch((e: any) => console.warn('Supabase feedback push warning:', e));
    } catch {
      // Non-blocking
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for your feedback! It will appear publicly once approved by Aurex Studio.',
      feedback: newItem,
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
