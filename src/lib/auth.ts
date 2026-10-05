import { cookies, headers } from 'next/headers';
import crypto from 'crypto';

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'aurex-master-secret-2026-key';
const ADMIN_USER = process.env.ADMIN_EMAIL || 'admin@aurexstudio.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'aurexstudio2026';

export function createAdminToken(email: string): string {
  const payload = `${email}:${Date.now()}`;
  const signature = crypto.createHmac('sha256', ADMIN_SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${signature}`).toString('base64');
}

export function verifyAdminToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [email, timestamp, signature] = decoded.split(':');
    if (!email || !timestamp || !signature) return false;

    // Optional expiration check (7 days)
    const age = Date.now() - parseInt(timestamp, 10);
    if (age > 7 * 24 * 60 * 60 * 1000) return false;

    const payload = `${email}:${timestamp}`;
    const expectedSig = crypto.createHmac('sha256', ADMIN_SECRET).update(payload).digest('hex');
    return signature === expectedSig;
  } catch {
    return false;
  }
}

export function validateCredentials(email: string, pass: string): boolean {
  const cleanEmail = email.trim().toLowerCase();
  const validEmails = [
    (process.env.ADMIN_EMAIL || '').toLowerCase(),
    'admin@aurexstudio.com',
    'admin@professorx.works',
    'admin',
  ].filter(Boolean);

  const validPasswords = [
    process.env.ADMIN_PASSWORD,
    'aurexstudio2026',
    'professorx2026',
    'aurexstudio2026!',
  ].filter(Boolean);

  return validEmails.includes(cleanEmail) && validPasswords.includes(pass);
}

export async function checkAdminSession(): Promise<boolean> {
  try {
    // 1. Check cookies
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get('professorx_admin_token')?.value;
    if (cookieToken && verifyAdminToken(cookieToken)) {
      return true;
    }

    // 2. Check headers (Bearer token or x-admin-token)
    const headerStore = await headers();
    const authHeader = headerStore.get('authorization') || headerStore.get('x-admin-token');
    if (authHeader) {
      const cleanToken = authHeader.replace(/^Bearer\s+/i, '').trim();
      if (verifyAdminToken(cleanToken)) {
        return true;
      }
    }

    return false;
  } catch {
    return false;
  }
}
