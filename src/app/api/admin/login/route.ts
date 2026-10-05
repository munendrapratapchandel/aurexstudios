import { NextRequest, NextResponse } from 'next/server';
import { validateCredentials, createAdminToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password required' }, { status: 400 });
    }

    if (!validateCredentials(email, password)) {
      return NextResponse.json({ success: false, error: 'Invalid admin credentials' }, { status: 401 });
    }

    const token = createAdminToken(email);
    const response = NextResponse.json({
      success: true,
      message: 'Admin authentication successful',
      token,
    });

    response.cookies.set('professorx_admin_token', token, {
      httpOnly: true,
      secure: false, // Allows testing on local HTTP connections
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ success: false, error: 'Internal login error' }, { status: 500 });
  }
}
