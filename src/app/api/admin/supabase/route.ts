import { NextRequest, NextResponse } from 'next/server';
import { checkAdminSession } from '@/lib/auth';
import { getDatabase, updateDatabase, getSupabaseSettings, updateSupabaseSettings } from '@/lib/db';
import {
  testSupabaseConnection,
  pushFullStateToSupabase,
  pullStateFromSupabase,
  getSupabaseCredentials,
} from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  const isAuth = await checkAdminSession();
  if (!isAuth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const creds = getSupabaseCredentials();
    const status = await testSupabaseConnection();
    const settings = getSupabaseSettings();

    // Read SQL schema file content to provide to admin
    let sqlSchema = '';
    try {
      const sqlPath = path.join(process.cwd(), 'supabase', 'schema.sql');
      if (fs.existsSync(sqlPath)) {
        sqlSchema = fs.readFileSync(sqlPath, 'utf-8');
      }
    } catch {
      // ignore
    }

    return NextResponse.json({
      success: true,
      status,
      config: {
        url: creds.url,
        hasAnonKey: Boolean(creds.anonKey),
        anonKeyPreview: creds.anonKey ? `${creds.anonKey.slice(0, 8)}...${creds.anonKey.slice(-6)}` : '',
        hasServiceKey: Boolean(creds.serviceRoleKey),
        serviceKeyPreview: creds.serviceRoleKey ? `${creds.serviceRoleKey.slice(0, 8)}...${creds.serviceRoleKey.slice(-6)}` : '',
        storageBucket: creds.storageBucket,
        autoSync: settings.autoSync ?? true,
      },
      sqlSchema,
    });
  } catch (error: any) {
    console.error('Supabase status error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const isAuth = await checkAdminSession();
  if (!isAuth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action, url, anonKey, serviceRoleKey, storageBucket, autoSync } = body;

    if (action === 'save-config') {
      // Save configuration to data/supabase.json and db.supabaseConfig
      const configPath = path.join(process.cwd(), 'data', 'supabase.json');
      const dataDir = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      const existingCreds = getSupabaseCredentials();

      const newConfig = {
        url: typeof url === 'string' ? url.trim() : existingCreds.url,
        anonKey: typeof anonKey === 'string' && anonKey.trim() ? anonKey.trim() : existingCreds.anonKey,
        serviceRoleKey: typeof serviceRoleKey === 'string' && serviceRoleKey.trim() ? serviceRoleKey.trim() : existingCreds.serviceRoleKey,
        bucket: typeof storageBucket === 'string' && storageBucket.trim() ? storageBucket.trim() : existingCreds.storageBucket,
      };

      fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2), 'utf-8');

      updateSupabaseSettings({
        url: newConfig.url,
        anonKey: newConfig.anonKey,
        serviceRoleKey: newConfig.serviceRoleKey,
        storageBucket: newConfig.bucket,
        autoSync: autoSync ?? true,
      });

      // Test connection with newly saved config
      const status = await testSupabaseConnection();

      return NextResponse.json({
        success: true,
        message: 'Supabase configuration saved successfully!',
        status,
      });
    }

    if (action === 'test') {
      const status = await testSupabaseConnection();
      return NextResponse.json({ success: true, status });
    }

    if (action === 'sync-push') {
      const db = getDatabase();
      const result = await pushFullStateToSupabase(db);
      return NextResponse.json(result);
    }

    if (action === 'sync-pull') {
      const result = await pullStateFromSupabase();
      if (!result.success || !result.data) {
        return NextResponse.json({ success: false, error: result.message }, { status: 400 });
      }

      // Merge / update database
      updateDatabase((db) => {
        Object.assign(db, result.data);
      });

      return NextResponse.json({
        success: true,
        message: 'Successfully pulled and restored data from Supabase Cloud!',
      });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    console.error('Supabase admin action error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
