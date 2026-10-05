import fs from 'fs';
import path from 'path';
import os from 'os';
import { DatabaseSchema, FeedbackItem, ContactRequest, Service, Project, FaqItem, MediaItem, ContactContent } from '@/types';
import { initialDatabaseData, defaultContactContent } from './seed-data';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const REVISIONS_DIR = path.join(os.tmpdir(), 'revisions');
const TMP_DB_FILE = path.join(os.tmpdir(), 'aurex_studio_db.json');

function ensureDirectories() {
  try {
    if (!fs.existsSync(REVISIONS_DIR)) {
      fs.mkdirSync(REVISIONS_DIR, { recursive: true });
    }
  } catch {
    // Read-only serverless environment (e.g. Vercel)
  }
}

// In-memory cache with disk mtime synchronization
let memoryDb: DatabaseSchema | null = null;
let lastSupabaseFetchTime: number = 0;
const CACHE_TTL_MS = 2500; // 2.5s debounce to reuse state during a single page render tree

export function getDatabase(): DatabaseSchema {
  if (memoryDb) {
    return memoryDb;
  }

  // 1. Check /tmp first (persists across same-container runs on Vercel)
  try {
    if (fs.existsSync(TMP_DB_FILE)) {
      const raw = fs.readFileSync(TMP_DB_FILE, 'utf-8');
      memoryDb = JSON.parse(raw);
      return memoryDb!;
    }
  } catch {
    // ignore
  }

  // 2. Check bundled DB_FILE
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      memoryDb = JSON.parse(raw);
      return memoryDb!;
    }
  } catch {
    // ignore
  }

  memoryDb = JSON.parse(JSON.stringify(initialDatabaseData));
  return memoryDb!;
}

// Async database initializer: pulls live master state from Supabase Cloud if configured
export async function initDatabase(force = false): Promise<DatabaseSchema> {
  // Return cached memoryDb if fetched recently and not forced
  if (!force && memoryDb && Date.now() - lastSupabaseFetchTime < CACHE_TTL_MS) {
    return memoryDb;
  }

  try {
    const { isSupabaseConfigured, pullStateFromSupabase } = require('./supabase');
    if (isSupabaseConfigured()) {
      const res = await pullStateFromSupabase();
      if (res.success && res.data) {
        memoryDb = res.data;
        lastSupabaseFetchTime = Date.now();
        try {
          fs.writeFileSync(TMP_DB_FILE, JSON.stringify(res.data, null, 2), 'utf-8');
        } catch {}
        return memoryDb!;
      }
    }
  } catch (err) {
    console.warn('initDatabase cloud sync notice:', err);
  }

  return getDatabase();
}

export function updateDatabase(updater: (db: DatabaseSchema) => void): DatabaseSchema {
  ensureDirectories();
  const db = getDatabase();

  // Create backup revision before applying change (safe in os.tmpdir)
  try {
    if (fs.existsSync(REVISIONS_DIR)) {
      const currentVersion = db.version || 1;
      const revisionPath = path.join(REVISIONS_DIR, `rev-${currentVersion}-${Date.now()}.json`);
      fs.writeFileSync(revisionPath, JSON.stringify(db, null, 2), 'utf-8');

      // Clean up old revisions if more than 30 exist
      const files = fs.readdirSync(REVISIONS_DIR);
      if (files.length > 30) {
        files
          .sort()
          .slice(0, files.length - 30)
          .forEach((f) => {
            try {
              fs.unlinkSync(path.join(REVISIONS_DIR, f));
            } catch {
              // ignore
            }
          });
      }
    }
  } catch {
    // Read-only snapshot bypass
  }

  updater(db);
  db.version = (db.version || 1) + 1;
  db.updatedAt = new Date().toISOString();
  lastSupabaseFetchTime = Date.now();

  // Always write to /tmp (guaranteed writable on Vercel and serverless)
  try {
    fs.writeFileSync(TMP_DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch {
    // ignore
  }

  // Write to DB_FILE if filesystem is writable (local dev)
  try {
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch {
    // Read-only disk on Vercel: safely maintained in memoryDb & /tmp & Supabase
  }

  memoryDb = db;
  return db;
}

// Asynchronously updates database AND awaits cloud persistence in Supabase
export async function updateDatabaseAsync(updater: (db: DatabaseSchema) => void): Promise<DatabaseSchema> {
  const db = updateDatabase(updater);

  // Await push to Supabase so serverless function does not terminate before sync completes
  try {
    const { isSupabaseConfigured, pushFullStateToSupabase } = require('./supabase');
    if (isSupabaseConfigured() && db.supabaseConfig?.autoSync !== false) {
      await pushFullStateToSupabase(db);
    }
  } catch (syncErr) {
    console.warn('Supabase update sync notice:', syncErr);
  }

  return db;
}


// Helper getters
export function getSupabaseSettings() {
  const db = getDatabase();
  return db.supabaseConfig || {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    storageBucket: 'aurex-media',
    autoSync: true,
  };
}

export function updateSupabaseSettings(config: Partial<NonNullable<DatabaseSchema['supabaseConfig']>>) {
  return updateDatabase((db) => {
    db.supabaseConfig = {
      ...(db.supabaseConfig || {
        url: '',
        anonKey: '',
        serviceRoleKey: '',
        storageBucket: 'aurex-media',
        autoSync: true,
      }),
      ...config,
    };
  });
}

export function getSiteSettings() {
  return getDatabase().siteSettings;
}

export function getHeroContent() {
  return getDatabase().heroContent;
}

export function getWorkspaceDashboard() {
  return getDatabase().workspaceDashboard;
}

export function getContactContent(): ContactContent {
  const db = getDatabase();
  return db.contactContent || defaultContactContent;
}

export function getSocialLinks() {
  return getDatabase().socialLinks.filter((s) => s.isVisible).sort((a, b) => a.order - b.order);
}

export function getAllSocialLinks() {
  return getDatabase().socialLinks.sort((a, b) => a.order - b.order);
}

export function getHobbies() {
  return getDatabase().hobbies.sort((a, b) => a.order - b.order);
}

export function getSkillCategories() {
  return getDatabase().skillCategories;
}

export function getServices() {
  return getDatabase().services.filter((s) => s.isPublished).sort((a, b) => a.order - b.order);
}

export function getAllServices() {
  return getDatabase().services.sort((a, b) => a.order - b.order);
}

export function getServiceBySlug(slug: string) {
  return getDatabase().services.find((s) => s.slug === slug);
}

export function getProjects(category?: string) {
  let list = getDatabase().projects;
  if (category && category !== 'All') {
    list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }
  return list.sort((a, b) => a.order - b.order);
}

export function getProjectBySlug(slug: string) {
  return getDatabase().projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects() {
  return getDatabase().projects.filter((p) => p.isFeatured).sort((a, b) => a.order - b.order);
}

export function getApprovedFeedback() {
  return getDatabase()
    .feedback.filter((f) => f.status === 'approved')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getAllFeedback() {
  return getDatabase().feedback.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getAllContactRequests() {
  return getDatabase().contactRequests.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getFaqs() {
  return getDatabase().faqs.filter((f) => f.isVisible).sort((a, b) => a.order - b.order);
}

export function getAllFaqs() {
  return getDatabase().faqs.sort((a, b) => a.order - b.order);
}

export function getMedia() {
  return getDatabase().media.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
}

export function getDevelopers(onlyVisible = true) {
  const list = getDatabase().developers || [];
  if (onlyVisible) {
    return list.filter((d) => d.isVisible).sort((a, b) => a.displayOrder - b.displayOrder);
  }
  return list.sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getAllDevelopers() {
  return (getDatabase().developers || []).sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getFeaturedDevelopers() {
  return (getDatabase().developers || [])
    .filter((d) => d.isVisible && d.isFeatured)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getDeveloperByUsername(username: string) {
  return (getDatabase().developers || []).find(
    (d) => d.username.toLowerCase() === username.toLowerCase()
  );
}

export function getVisitorMetrics() {
  const db = getDatabase();
  const now = Date.now();
  // Filter active sessions to those active in the last 5 minutes (300,000ms)
  const activeCount = Math.max(1, db.sessions.filter((s) => now - s.lastSeen < 300000).length);
  return {
    ...db.visitorMetrics,
    activeVisitors: activeCount,
  };
}

// Session-aware visitor tracking
export function recordVisitor(sessionId: string, pathName: string = '/', ipHash: string = '') {
  return updateDatabase((db) => {
    const now = Date.now();
    const existingSession = db.sessions.find((s) => s.sessionId === sessionId);

    // Clean up sessions older than 24 hours
    db.sessions = db.sessions.filter((s) => now - s.lastSeen < 86400000);

    if (!existingSession) {
      // Truly new visitor
      db.sessions.push({
        sessionId,
        ipHash,
        lastSeen: now,
        createdAt: now,
      });
      db.visitorMetrics.totalVisitors += 1;
      db.visitorMetrics.todayVisitors += 1;
      db.visitorMetrics.thisWeekVisitors += 1;
      db.visitorMetrics.thisMonthVisitors += 1;
    } else {
      // Existing visitor activity ping
      existingSession.lastSeen = now;
    }

    // Page view counter
    if (!db.visitorMetrics.pageViews) {
      db.visitorMetrics.pageViews = {};
    }
    db.visitorMetrics.pageViews[pathName] = (db.visitorMetrics.pageViews[pathName] || 0) + 1;

    // Track service interest if path is /services/[slug]
    if (pathName.startsWith('/services/')) {
      const slug = pathName.replace('/services/', '');
      const service = db.services.find((s) => s.slug === slug);
      if (service) {
        if (!db.visitorMetrics.serviceInterest) {
          db.visitorMetrics.serviceInterest = {};
        }
        db.visitorMetrics.serviceInterest[service.title] =
          (db.visitorMetrics.serviceInterest[service.title] || 0) + 1;
      }
    }

    // Calculate active visitors (last 5 min)
    db.visitorMetrics.activeVisitors = Math.max(
      1,
      db.sessions.filter((s) => now - s.lastSeen < 300000).length
    );
    db.visitorMetrics.lastUpdated = new Date().toISOString();
  });
}
