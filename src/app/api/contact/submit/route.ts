import { NextRequest, NextResponse } from 'next/server';
import { updateDatabase } from '@/lib/db';
import { ContactRequest } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, handle, serviceId, serviceName, budgetRange, timeline, message } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Valid email is required' }, { status: 400 });
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ success: false, error: 'Project description is required' }, { status: 400 });
    }

    const newRequest: ContactRequest = {
      id: 'cr-' + Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      handle: handle ? String(handle).trim() : '',
      serviceId: serviceId || '',
      serviceName: serviceName || 'General Inquiry',
      budgetRange: budgetRange || 'Flexible',
      timeline: timeline || 'Standard (2-3 weeks)',
      message: message.trim(),
      status: 'New',
      createdAt: new Date().toISOString(),
    };

    updateDatabase((db) => {
      if (!db.contactRequests) db.contactRequests = [];
      db.contactRequests.unshift(newRequest);
    });

    // Mirror directly to Supabase inquiries table if configured
    try {
      const { pushInquiryToSupabase } = require('@/lib/supabase');
      pushInquiryToSupabase(newRequest).catch((e: any) => console.warn('Supabase inquiry push warning:', e));
    } catch {
      // Non-blocking
    }

    return NextResponse.json({
      success: true,
      message: 'Your project inquiry has been received! The Aurex Studio team will review your scope and reach out within 24 hours.',
      requestId: newRequest.id,
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
