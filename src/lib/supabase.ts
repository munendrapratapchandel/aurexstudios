import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { DatabaseSchema, ContactRequest, FeedbackItem } from '@/types';
import fs from 'fs';
import path from 'path';

export interface SupabaseConnectionStatus {
  isConfigured: boolean;
  isConnected: boolean;
  url: string;
  hasAnonKey: boolean;
  hasServiceKey: boolean;
  bucket: string;
  message: string;
  details?: {
    siteDataTable: boolean;
    inquiriesTable: boolean;
    feedbackTable: boolean;
    storageBucket: boolean;
  };
}

import os from 'os';

// Retrieve credentials from environment variables or local fallback config
export function getSupabaseCredentials() {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const envAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
  const envServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || '';
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'aurex-media';

  // Check /tmp first (written during runtime on serverless), then data/supabase.json
  let fileConfig: { url?: string; anonKey?: string; serviceRoleKey?: string; bucket?: string } = {};
  const tmpConfigPath = path.join(os.tmpdir(), 'supabase.json');
  const bundledConfigPath = path.join(process.cwd(), 'data', 'supabase.json');

  try {
    if (fs.existsSync(tmpConfigPath)) {
      fileConfig = JSON.parse(fs.readFileSync(tmpConfigPath, 'utf-8'));
    } else if (fs.existsSync(bundledConfigPath)) {
      fileConfig = JSON.parse(fs.readFileSync(bundledConfigPath, 'utf-8'));
    }
  } catch (err) {
    // ignore
  }

  const url = (envUrl || fileConfig.url || '').trim();
  const anonKey = (envAnonKey || fileConfig.anonKey || '').trim();
  const serviceRoleKey = (envServiceKey || fileConfig.serviceRoleKey || '').trim();
  const storageBucket = (fileConfig.bucket || bucket || 'aurex-media').trim();

  return {
    url,
    anonKey,
    serviceRoleKey,
    storageBucket,
    isConfigured: Boolean(url && (anonKey || serviceRoleKey)),
  };
}

export function isSupabaseConfigured(): boolean {
  const { isConfigured } = getSupabaseCredentials();
  return isConfigured;
}

// Client for public / browser actions
let cachedPublicClient: SupabaseClient | null = null;
export function getSupabaseClient(): SupabaseClient | null {
  const creds = getSupabaseCredentials();
  if (!creds.isConfigured) return null;

  const key = creds.anonKey || creds.serviceRoleKey;
  if (!key || !creds.url) return null;

  if (!cachedPublicClient) {
    cachedPublicClient = createClient(creds.url, key, {
      auth: { persistSession: false },
    });
  }
  return cachedPublicClient;
}

// Client for administrative backend actions (bypasses RLS with service_role if available)
let cachedAdminClient: SupabaseClient | null = null;
export function getSupabaseAdminClient(): SupabaseClient | null {
  const creds = getSupabaseCredentials();
  if (!creds.isConfigured) return null;

  const key = creds.serviceRoleKey || creds.anonKey;
  if (!key || !creds.url) return null;

  if (!cachedAdminClient) {
    cachedAdminClient = createClient(creds.url, key, {
      auth: { persistSession: false },
    });
  }
  return cachedAdminClient;
}

// Test live connection to Supabase and report table availability
export async function testSupabaseConnection(): Promise<SupabaseConnectionStatus> {
  const creds = getSupabaseCredentials();

  if (!creds.isConfigured) {
    return {
      isConfigured: false,
      isConnected: false,
      url: creds.url,
      hasAnonKey: Boolean(creds.anonKey),
      hasServiceKey: Boolean(creds.serviceRoleKey),
      bucket: creds.storageBucket,
      message: 'Supabase credentials are not configured yet. Add them in Admin Settings or .env.local.',
    };
  }

  const client = getSupabaseAdminClient();
  if (!client) {
    return {
      isConfigured: true,
      isConnected: false,
      url: creds.url,
      hasAnonKey: Boolean(creds.anonKey),
      hasServiceKey: Boolean(creds.serviceRoleKey),
      bucket: creds.storageBucket,
      message: 'Could not initialize Supabase client with provided URL and Keys.',
    };
  }

  const details = {
    siteDataTable: false,
    inquiriesTable: false,
    feedbackTable: false,
    storageBucket: false,
  };

  try {
    // 1. Test site_data table
    const { error: siteDataErr } = await client
      .from('site_data')
      .select('key')
      .limit(1);
    details.siteDataTable = !siteDataErr;

    // 2. Test inquiries table
    const { error: inqErr } = await client
      .from('inquiries')
      .select('id')
      .limit(1);
    details.inquiriesTable = !inqErr;

    // 3. Test feedback table
    const { error: fbErr } = await client
      .from('feedback')
      .select('id')
      .limit(1);
    details.feedbackTable = !fbErr;

    // 4. Test storage bucket
    try {
      const { data: buckets } = await client.storage.listBuckets();
      if (buckets && buckets.some((b) => b.name === creds.storageBucket || b.id === creds.storageBucket)) {
        details.storageBucket = true;
      } else {
        // Automatically create bucket if missing
        const { error: createErr } = await client.storage.createBucket(creds.storageBucket, { public: true });
        if (!createErr) {
          details.storageBucket = true;
        }
      }
    } catch {
      // storage test optional
    }

    const isConnected = details.siteDataTable || details.inquiriesTable || details.feedbackTable;

    let message = 'Successfully connected to Supabase!';
    if (!isConnected) {
      message = 'Connected to Supabase endpoint, but tables were not found. Please run the SQL schema in Supabase SQL Editor.';
    } else if (!details.inquiriesTable || !details.feedbackTable) {
      message = 'Connected to Supabase! Run the inquiries & feedback SQL script below in SQL Editor to activate dedicated tables.';
    }

    return {
      isConfigured: true,
      isConnected,
      url: creds.url,
      hasAnonKey: Boolean(creds.anonKey),
      hasServiceKey: Boolean(creds.serviceRoleKey),
      bucket: creds.storageBucket,
      message,
      details,
    };
  } catch (err: any) {
    return {
      isConfigured: true,
      isConnected: false,
      url: creds.url,
      hasAnonKey: Boolean(creds.anonKey),
      hasServiceKey: Boolean(creds.serviceRoleKey),
      bucket: creds.storageBucket,
      message: `Connection failed: ${err.message || 'Unknown network error'}`,
      details,
    };
  }
}

// Push entire database state to Supabase
export async function pushFullStateToSupabase(db: DatabaseSchema): Promise<{ success: boolean; message: string }> {
  const client = getSupabaseAdminClient();
  if (!client) {
    return { success: false, message: 'Supabase is not configured' };
  }

  try {
    // 1. Sync master document to site_data
    const { error: siteErr } = await client.from('site_data').upsert(
      {
        key: 'master_state',
        data: db,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'key' }
    );

    if (siteErr) {
      console.error('Supabase site_data upsert error:', siteErr);
      return { success: false, message: `Failed to sync master state: ${siteErr.message}` };
    }

    // 2. Also sync dedicated inquiries table if any
    if (db.contactRequests && db.contactRequests.length > 0) {
      try {
        const formattedInquiries = db.contactRequests.map((cr) => ({
          id: cr.id,
          name: cr.name,
          email: cr.email,
          handle: cr.handle || '',
          service_id: cr.serviceId || '',
          service_name: cr.serviceName || '',
          budget_range: cr.budgetRange || '',
          timeline: cr.timeline || '',
          message: cr.message,
          status: cr.status || 'New',
          created_at: cr.createdAt || new Date().toISOString(),
        }));

        await client.from('inquiries').upsert(formattedInquiries, { onConflict: 'id' });
      } catch (inqErr) {
        console.warn('Optional inquiries table sync notice:', inqErr);
      }
    }

    // 3. Also sync dedicated feedback table if any
    if (db.feedback && db.feedback.length > 0) {
      try {
        const formattedFeedback = db.feedback.map((fb) => ({
          id: fb.id,
          name: fb.name,
          role: fb.role || 'Client',
          rating: fb.rating,
          comment: fb.comment,
          status: fb.status || 'pending',
          is_featured: Boolean(fb.isFeatured),
          created_at: fb.createdAt || new Date().toISOString(),
        }));

        await client.from('feedback').upsert(formattedFeedback, { onConflict: 'id' });
      } catch (fbErr) {
        console.warn('Optional feedback table sync notice:', fbErr);
      }
    }


    return { success: true, message: 'Successfully synced all data to Supabase Cloud!' };
  } catch (err: any) {
    console.error('Error syncing to Supabase:', err);
    return { success: false, message: err.message || 'Error syncing data to Supabase' };
  }
}

// Pull latest state from Supabase
export async function pullStateFromSupabase(): Promise<{ success: boolean; data?: DatabaseSchema; message: string }> {
  const client = getSupabaseAdminClient();
  if (!client) {
    return { success: false, message: 'Supabase is not configured' };
  }

  try {
    const fetchPromise = client
      .from('site_data')
      .select('data')
      .eq('key', 'master_state')
      .single();

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Supabase request timed out (3.5s)')), 3500)
    );

    const { data, error } = (await Promise.race([fetchPromise, timeoutPromise])) as any;

    if (error || !data?.data) {
      return { success: false, message: error ? error.message : 'No master data record found in Supabase' };
    }

    return { success: true, data: data.data as DatabaseSchema, message: 'Successfully pulled data from Supabase!' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to pull from Supabase' };
  }
}

// Push a single new inquiry to Supabase
export async function pushInquiryToSupabase(request: ContactRequest): Promise<boolean> {
  const client = getSupabaseAdminClient();
  if (!client) return false;

  try {
    const { error } = await client.from('inquiries').insert([
      {
        id: request.id,
        name: request.name,
        email: request.email,
        handle: request.handle || '',
        service_id: request.serviceId || '',
        service_name: request.serviceName || '',
        budget_range: request.budgetRange || '',
        timeline: request.timeline || '',
        message: request.message,
        status: request.status || 'New',
        created_at: request.createdAt,
      },
    ]);
    if (error) {
      console.warn('Could not insert inquiry into Supabase inquiries table:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Error pushing inquiry to Supabase:', err);
    return false;
  }
}

// Push feedback directly to Supabase
export async function pushFeedbackToSupabase(feedback: FeedbackItem): Promise<boolean> {
  const client = getSupabaseAdminClient();
  if (!client) return false;

  try {
    const { error } = await client.from('feedback').insert([
      {
        id: feedback.id,
        name: feedback.name,
        role: feedback.role || 'Visitor',
        rating: feedback.rating,
        comment: feedback.comment,
        status: feedback.status || 'pending',
        is_featured: Boolean(feedback.isFeatured),
        created_at: feedback.createdAt,
      },
    ]);
    if (error) {
      console.warn('Could not insert feedback into Supabase feedback table:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Error pushing feedback to Supabase:', err);
    return false;
  }
}

// Upload media file directly to Supabase Storage
export async function uploadMediaToSupabase(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  const client = getSupabaseAdminClient();
  const creds = getSupabaseCredentials();

  if (!client || !creds.isConfigured) {
    return { success: false, error: 'Supabase is not configured' };
  }

  try {
    const bucket = creds.storageBucket || 'aurex-media';

    // Ensure bucket exists or attempt upload
    const { error: uploadError } = await client.storage.from(bucket).upload(filename, buffer, {
      contentType,
      upsert: true,
    });

    if (uploadError) {
      return { success: false, error: uploadError.message };
    }

    const { data: publicUrlData } = client.storage.from(bucket).getPublicUrl(filename);
    if (!publicUrlData || !publicUrlData.publicUrl) {
      return { success: false, error: 'Could not obtain public URL for uploaded asset' };
    }

    return { success: true, url: publicUrlData.publicUrl };
  } catch (err: any) {
    return { success: false, error: err.message || 'Storage upload error' };
  }
}
