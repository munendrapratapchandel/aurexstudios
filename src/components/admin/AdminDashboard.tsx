'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  DatabaseSchema,
  Service,
  Project,
  FeedbackItem,
  ContactRequest,
  FaqItem,
  MediaItem,
  ServiceSection,
  ServicePlan,
  Developer,
  DeveloperSkill,
  DeveloperSocial,
  ContactContent,
  ContactGuarantee,
} from '@/types';
import {
  LayoutDashboard,
  Home,
  Layers,
  FolderGit2,
  Users,
  MessageSquare,
  Inbox,
  HelpCircle,
  Share2,
  Image,
  BarChart3,
  Settings,
  History,
  LogOut,
  ExternalLink,
  Save,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Star,
  Activity,
  Upload,
  Copy,
  Check,
  Eye,
  AlertCircle,
  Video,
  Sparkles,
  ShieldCheck,
  Edit,
  ArrowUpRight,
  TrendingUp,
  Terminal,
  Flame,
  Cpu,
  Heart,
  Clock,
  Zap,
  Mail,
  Sliders,
} from 'lucide-react';

interface AdminDashboardProps {
  initialData: DatabaseSchema;
}

export function AdminDashboard({ initialData }: AdminDashboardProps) {
  const router = useRouter();
  const [data, setData] = useState<DatabaseSchema>(initialData);
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'home'
    | 'workspace'
    | 'services'
    | 'works'
    | 'developers'
    | 'feedback'
    | 'requests'
    | 'contact'
    | 'faqs'
    | 'socials'
    | 'media'
    | 'analytics'
    | 'settings'
    | 'revisions'
  >('overview');

  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Editing state for Services
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isNewService, setIsNewService] = useState(false);

  // Editing state for Projects
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isNewProject, setIsNewProject] = useState(false);

  // Editing state for Developers
  const [editingDeveloper, setEditingDeveloper] = useState<Developer | null>(null);
  const [isNewDeveloper, setIsNewDeveloper] = useState(false);
  const [uploadingDevPhoto, setUploadingDevPhoto] = useState(false);
  const [uploadingDevCover, setUploadingDevCover] = useState(false);

  // Editing state for FAQs
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [isNewFaq, setIsNewFaq] = useState(false);

  // Media upload state
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Revisions list
  const [revisions, setRevisions] = useState<any[]>([]);

  // Client inquiries filter
  const [requestFilter, setRequestFilter] = useState<'All' | 'New' | 'Accepted' | 'Declined' | 'In Progress'>('All');

  // Favicon & Logo upload states
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingLightLogo, setUploadingLightLogo] = useState(false);
  const [uploadingDarkLogo, setUploadingDarkLogo] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  // 1. Generic Content Save (Home, Settings, Socials, etc.)
  const saveContentChanges = async (partial: Partial<DatabaseSchema>) => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partial),
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.error);

      setData((prev) => ({
        ...prev,
        ...partial,
        version: result.version || prev.version + 1,
      }));
      showToast('Changes saved to database successfully!');
    } catch (err: any) {
      alert('Error saving changes: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // 2. Services Management
  const handleSaveService = async (serviceToSave: Service) => {
    setSaving(true);
    try {
      const method = isNewService ? 'POST' : 'PUT';
      const res = await fetch('/api/admin/services', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceToSave),
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.error);

      if (isNewService) {
        setData((prev) => ({ ...prev, services: [...prev.services, result.service] }));
      } else {
        setData((prev) => ({
          ...prev,
          services: prev.services.map((s) => (s.id === serviceToSave.id ? serviceToSave : s)),
        }));
      }

      setEditingService(null);
      setIsNewService(false);
      showToast('Service saved successfully!');
    } catch (err: any) {
      alert('Error saving service: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      const res = await fetch(`/api/admin/services?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete service');
      setData((prev) => ({
        ...prev,
        services: prev.services.filter((s) => s.id !== id),
      }));
      showToast('Service deleted');
    } catch (err: any) {
      alert(err.message);
    }
  };

  // 3. Projects Management
  const handleSaveProject = async (projectToSave: Project) => {
    setSaving(true);
    try {
      const method = isNewProject ? 'POST' : 'PUT';
      const res = await fetch('/api/admin/projects', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectToSave),
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.error);

      if (isNewProject) {
        setData((prev) => ({ ...prev, projects: [...prev.projects, result.project] }));
      } else {
        setData((prev) => ({
          ...prev,
          projects: prev.projects.map((p) => (p.id === projectToSave.id ? projectToSave : p)),
        }));
      }

      setEditingProject(null);
      setIsNewProject(false);
      showToast('Project saved successfully!');
    } catch (err: any) {
      alert('Error saving project: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete project');
      setData((prev) => ({
        ...prev,
        projects: prev.projects.filter((p) => p.id !== id),
      }));
      showToast('Project deleted');
    } catch (err: any) {
      alert(err.message);
    }
  };

  // 3b. Developers Management
  const handleSaveDeveloper = async (dev: Developer) => {
    setSaving(true);
    try {
      const method = isNewDeveloper ? 'POST' : 'PUT';
      const res = await fetch('/api/admin/developers', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dev),
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.error || 'Failed to save developer');

      setData((prev) => {
        const existing = prev.developers || [];
        if (isNewDeveloper) {
          return { ...prev, developers: [...existing, result.developer] };
        }
        return {
          ...prev,
          developers: existing.map((d) => (d.id === result.developer.id ? result.developer : d)),
        };
      });

      setEditingDeveloper(null);
      showToast(isNewDeveloper ? 'Developer profile created!' : 'Developer profile updated!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleDeveloperFeatured = async (dev: Developer) => {
    try {
      const updated = { ...dev, isFeatured: !dev.isFeatured };
      const res = await fetch('/api/admin/developers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error('Failed to update developer');
      setData((prev) => ({
        ...prev,
        developers: (prev.developers || []).map((d) => (d.id === dev.id ? updated : d)),
      }));
      showToast(updated.isFeatured ? `${dev.name} is now Featured!` : `${dev.name} unfeatured`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleToggleDeveloperVisible = async (dev: Developer) => {
    try {
      const updated = { ...dev, isVisible: !dev.isVisible };
      const res = await fetch('/api/admin/developers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error('Failed to update developer');
      setData((prev) => ({
        ...prev,
        developers: (prev.developers || []).map((d) => (d.id === dev.id ? updated : d)),
      }));
      showToast(updated.isVisible ? `${dev.name} is now Public` : `${dev.name} hidden from public`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteDeveloper = async (id: string) => {
    if (!confirm('Are you sure you want to delete this developer profile?')) return;
    try {
      const res = await fetch(`/api/admin/developers?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete developer');
      setData((prev) => ({
        ...prev,
        developers: (prev.developers || []).filter((d) => d.id !== id),
      }));
      showToast('Developer profile deleted');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDevPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, isCover = false) => {
    const file = e.target.files?.[0];
    if (!file || !editingDeveloper) return;
    if (isCover) setUploadingDevCover(true);
    else setUploadingDevPhoto(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', 'image');

    try {
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.error);

      if (isCover) {
        setEditingDeveloper({ ...editingDeveloper, coverImage: result.media.url });
      } else {
        setEditingDeveloper({ ...editingDeveloper, profileImage: result.media.url });
      }

      setData((prev) => ({
        ...prev,
        media: [result.media, ...(prev.media || [])],
      }));
      showToast(`${isCover ? 'Cover banner' : 'Profile photo'} uploaded and updated!`);
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    } finally {
      if (isCover) setUploadingDevCover(false);
      else setUploadingDevPhoto(false);
      e.target.value = '';
    }
  };

  // 3c. Site Assets Upload (Favicon & System Logos)
  const handleSiteAssetUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'faviconUrl' | 'logoUrl' | 'lightLogoUrl' | 'darkLogoUrl'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (field === 'faviconUrl') setUploadingFavicon(true);
    else if (field === 'logoUrl') setUploadingLogo(true);
    else if (field === 'lightLogoUrl') setUploadingLightLogo(true);
    else if (field === 'darkLogoUrl') setUploadingDarkLogo(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', 'image');

    try {
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.error);

      const updatedSettings = {
        ...data.siteSettings,
        [field]: result.media.url,
      };

      setData((prev) => ({
        ...prev,
        siteSettings: updatedSettings,
        media: [result.media, ...(prev.media || [])],
      }));

      // Automatically persist to database!
      await saveContentChanges({ siteSettings: updatedSettings });
      showToast(`${field === 'faviconUrl' ? 'Favicon' : 'Logo'} uploaded and updated!`);
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    } finally {
      if (field === 'faviconUrl') setUploadingFavicon(false);
      else if (field === 'logoUrl') setUploadingLogo(false);
      else if (field === 'lightLogoUrl') setUploadingLightLogo(false);
      else if (field === 'darkLogoUrl') setUploadingDarkLogo(false);
      e.target.value = '';
    }
  };

  // 4. Feedback Moderation
  const handleUpdateFeedbackStatus = async (
    id: string,
    status?: 'pending' | 'approved' | 'rejected',
    isFeatured?: boolean
  ) => {
    try {
      const res = await fetch('/api/admin/feedback', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, isFeatured }),
      });
      if (!res.ok) throw new Error('Failed to update feedback');

      setData((prev) => ({
        ...prev,
        feedback: prev.feedback.map((f) => {
          if (f.id === id) {
            return {
              ...f,
              ...(status !== undefined ? { status } : {}),
              ...(isFeatured !== undefined ? { isFeatured } : {}),
            };
          }
          return f;
        }),
      }));
      showToast('Feedback status updated!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteFeedback = async (id: string) => {
    if (!confirm('Delete this feedback entry?')) return;
    try {
      const res = await fetch(`/api/admin/feedback?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setData((prev) => ({
        ...prev,
        feedback: prev.feedback.filter((f) => f.id !== id),
      }));
      showToast('Feedback deleted');
    } catch (err: any) {
      alert(err.message);
    }
  };

  // 5. Contact Requests Management
  const handleUpdateRequestStatus = async (
    id: string,
    status: ContactRequest['status'],
    internalNotes?: string
  ) => {
    try {
      const res = await fetch('/api/admin/requests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, internalNotes }),
      });
      if (!res.ok) throw new Error('Failed to update request');

      setData((prev) => ({
        ...prev,
        contactRequests: prev.contactRequests.map((r) => {
          if (r.id === id) {
            return {
              ...r,
              status,
              ...(internalNotes !== undefined ? { internalNotes } : {}),
            };
          }
          return r;
        }),
      }));
      showToast(
        status === 'Accepted'
          ? 'Inquiry marked as Accepted!'
          : status === 'Declined'
          ? 'Inquiry marked as Declined'
          : 'Request status updated!'
      );
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteRequest = async (id: string) => {
    if (!confirm('Delete this inquiry?')) return;
    try {
      const res = await fetch(`/api/admin/requests?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setData((prev) => ({
        ...prev,
        contactRequests: prev.contactRequests.filter((r) => r.id !== id),
      }));
      showToast('Request deleted');
    } catch (err: any) {
      alert(err.message);
    }
  };

  // 6. Media Upload & Delete
  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMedia(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', file.type.startsWith('video') ? 'video' : 'image');

    try {
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.error);

      setData((prev) => ({
        ...prev,
        media: [result.media, ...(prev.media || [])],
      }));
      showToast('Media uploaded to server!');
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploadingMedia(false);
      e.target.value = '';
    }
  };

  const handleDeleteMedia = async (id: string) => {
    if (!confirm('Delete this media file?')) return;
    try {
      const res = await fetch(`/api/admin/media?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete media');
      setData((prev) => ({
        ...prev,
        media: prev.media.filter((m) => m.id !== id),
      }));
      showToast('Media file deleted');
    } catch (err: any) {
      alert(err.message);
    }
  };

  // 7. Load & Restore Revisions
  const loadRevisions = async () => {
    try {
      const res = await fetch('/api/admin/revisions');
      const result = await res.json();
      if (res.ok && result.success) {
        setRevisions(result.revisions);
      }
    } catch {
      // silent
    }
  };

  const handleRollback = async (filename: string) => {
    if (!confirm(`Are you sure you want to rollback to revision snapshot ${filename}?`)) return;
    try {
      const res = await fetch('/api/admin/revisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.error);

      alert('Rollback successful! The page will now reload.');
      window.location.reload();
    } catch (err: any) {
      alert('Rollback failed: ' + err.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#07080c] font-sans text-slate-100">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-[#0e111a] px-5 py-3 text-xs font-semibold text-emerald-400 shadow-2xl">
          <CheckCircle className="h-4 w-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 border-r border-white/10 bg-[#090b10] flex flex-col justify-between shrink-0">
        <div>
          {/* Admin Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500 text-white shadow-lg shadow-sky-500/20">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h1 className="font-mono text-sm font-bold text-white tracking-tight">
                  Aurex Studio
                </h1>
                <span className="font-mono text-[10px] text-sky-400 font-semibold tracking-wider">
                  MASTER CMS v2.4
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'home', label: 'Home & Hero CMS', icon: Home },
              { id: 'workspace', label: 'Workspace Cockpit', icon: Terminal },
              { id: 'services', label: 'Services & Plans', icon: Layers },
              { id: 'works', label: 'Works Portfolio', icon: FolderGit2 },
              { id: 'developers', label: 'Developers & Team', icon: Users, badge: data.developers?.length },
              { id: 'feedback', label: 'Feedback Moderation', icon: MessageSquare, badge: data.feedback?.filter((f) => f.status === 'pending').length },
              { id: 'requests', label: 'Client Inquiries', icon: Inbox, badge: data.contactRequests?.filter((r) => r.status === 'New').length },
              { id: 'contact', label: 'Contact Section', icon: MessageSquare },
              { id: 'faqs', label: 'FAQ Manager', icon: HelpCircle },
              { id: 'socials', label: 'Socials & Hobbies', icon: Share2 },
              { id: 'media', label: 'Media Library', icon: Image },
              { id: 'analytics', label: 'Visitor Telemetry', icon: BarChart3 },
              { id: 'settings', label: 'Branding & SEO', icon: Settings },
              { id: 'revisions', label: 'Version Revisions', icon: History },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    if (item.id === 'revisions') loadRevisions();
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25 font-semibold'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                  {Boolean(item.badge) && (
                    <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-xl border border-white/10 bg-[#121520] px-3.5 py-2.5 text-xs font-semibold text-slate-300 hover:text-white hover:border-white/20 transition"
          >
            <span>View Public Site</span>
            <ExternalLink className="h-3.5 w-3.5 text-sky-400" />
          </a>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[#07080c]/85 px-8 py-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-wider text-slate-500">
              Active Section:
            </span>
            <span className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              {activeTab}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Live active visitors pill */}
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#0e111a] px-3.5 py-1.5 text-xs text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono font-bold text-white">
                {data.visitorMetrics.totalVisitors.toLocaleString()}
              </span>
              <span className="text-slate-500">Total</span>
              <span className="text-slate-600">|</span>
              <span className="text-emerald-400 font-mono">
                {data.visitorMetrics.activeVisitors} live
              </span>
            </div>

            {/* Quick Availability selector */}
            <select
              value={data.siteSettings.availability}
              onChange={(e) => {
                const val = e.target.value as any;
                saveContentChanges({
                  siteSettings: {
                    ...data.siteSettings,
                    availability: val,
                    availabilityText:
                      val === 'available'
                        ? 'Currently accepting client projects'
                        : val === 'limited'
                        ? 'Limited project slots available'
                        : 'Currently booked / unavailable',
                  },
                });
              }}
              className="rounded-xl border border-white/10 bg-[#121520] px-3 py-1.5 text-xs font-medium text-slate-200 outline-none focus:border-sky-500"
            >
              <option value="available">● Available</option>
              <option value="limited">● Limited Slots</option>
              <option value="unavailable">● Unavailable</option>
            </select>
          </div>
        </header>

        {/* TAB 1: OVERVIEW DASHBOARD */}
        {activeTab === 'overview' && (
          <div className="p-8 space-y-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                System Overview
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Live metrics, pending actions, and system health status.
              </p>
            </div>

            {/* Metrics Cards Grid (Requirement #43) */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
              <div className="rounded-2xl border border-white/10 bg-[#0e111a] p-5">
                <span className="text-xs text-slate-400 font-medium">Total Visitors</span>
                <div className="mt-2 font-mono text-3xl font-extrabold text-white">
                  {data.visitorMetrics.totalVisitors.toLocaleString()}
                </div>
                <div className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>+{data.visitorMetrics.todayVisitors} today</span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0e111a] p-5">
                <span className="text-xs text-slate-400 font-medium">Live / Active Online</span>
                <div className="mt-2 font-mono text-3xl font-extrabold text-emerald-400">
                  {data.visitorMetrics.activeVisitors}
                </div>
                <div className="mt-2 text-[11px] text-slate-500">Last 5 min heartbeat</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0e111a] p-5">
                <span className="text-xs text-slate-400 font-medium">Active Services</span>
                <div className="mt-2 font-mono text-3xl font-extrabold text-sky-400">
                  {data.services?.length || 0}
                </div>
                <div className="mt-2 text-[11px] text-slate-500">With dynamic pricing</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0e111a] p-5">
                <span className="text-xs text-slate-400 font-medium">Published Projects</span>
                <div className="mt-2 font-mono text-3xl font-extrabold text-indigo-400">
                  {data.projects?.length || 0}
                </div>
                <div className="mt-2 text-[11px] text-slate-500">In public portfolio</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0e111a] p-5">
                <span className="text-xs text-slate-400 font-medium">Pending Feedback</span>
                <div className="mt-2 font-mono text-3xl font-extrabold text-amber-400">
                  {data.feedback?.filter((f) => f.status === 'pending').length || 0}
                </div>
                <div className="mt-2 text-[11px] text-slate-500">Awaiting moderation</div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-[#0e111a] p-6 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-sky-400" />
                  <span>Hero Background Mode Quick Switch</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Toggle between Background Video and Static Image mode. The public homepage updates immediately.
                </p>

                <div className="flex items-center gap-4 pt-2">
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name="heroBgModeQuick"
                      checked={data.heroContent.backgroundMode === 'video'}
                      onChange={() => {
                        saveContentChanges({
                          heroContent: { ...data.heroContent, backgroundMode: 'video' },
                        });
                      }}
                      className="text-sky-500 focus:ring-sky-500"
                    />
                    <span>Video Mode</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name="heroBgModeQuick"
                      checked={data.heroContent.backgroundMode === 'image'}
                      onChange={() => {
                        saveContentChanges({
                          heroContent: { ...data.heroContent, backgroundMode: 'image' },
                        });
                      }}
                      className="text-sky-500 focus:ring-sky-500"
                    />
                    <span>Image Mode</span>
                  </label>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#0e111a] p-6 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Inbox className="h-4 w-4 text-sky-400" />
                  <span>Recent Inquiries</span>
                </h3>
                <div className="space-y-2">
                  {data.contactRequests?.slice(0, 3).map((req) => (
                    <div
                      key={req.id}
                      className="flex items-center justify-between rounded-xl border border-white/5 bg-[#141824] p-3 text-xs"
                    >
                      <div>
                        <span className="font-bold text-white">{req.name}</span>
                        <span className="text-slate-400 ml-2">({req.serviceName})</span>
                      </div>
                      <span className="rounded bg-sky-500/10 px-2 py-0.5 text-[10px] text-sky-400 font-semibold">
                        {req.status}
                      </span>
                    </div>
                  ))}
                  {(!data.contactRequests || data.contactRequests.length === 0) && (
                    <p className="text-xs text-slate-500">No client requests yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HOME & HERO CMS */}
        {activeTab === 'home' && (
          <div className="p-8 max-w-4xl space-y-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Home & Hero CMS
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Manage hero text, background media (Video / Image), CTAs, and Workspace cockpit content.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0e111a] p-8 space-y-6">
              <h3 className="text-base font-bold text-sky-400 font-mono">
                1. Hero Typography & Headings
              </h3>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                    Hero Title
                  </label>
                  <input
                    type="text"
                    value={data.heroContent.title}
                    onChange={(e) =>
                      setData({
                        ...data,
                        heroContent: { ...data.heroContent, title: e.target.value },
                      })
                    }
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                    Hero Subtitle
                  </label>
                  <input
                    type="text"
                    value={data.heroContent.subtitle}
                    onChange={(e) =>
                      setData({
                        ...data,
                        heroContent: { ...data.heroContent, subtitle: e.target.value },
                      })
                    }
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                  Positioning Statement
                </label>
                <textarea
                  rows={2}
                  value={data.heroContent.statement}
                  onChange={(e) =>
                    setData({
                      ...data,
                      heroContent: { ...data.heroContent, statement: e.target.value },
                    })
                  }
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                />
              </div>

              <h3 className="text-base font-bold text-sky-400 font-mono pt-4 border-t border-white/10">
                2. Hero Background Mode (Requirement #5 & #8)
              </h3>

              {/* Background Mode Radio */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                  <input
                    type="radio"
                    name="heroBgMode"
                    value="video"
                    checked={data.heroContent.backgroundMode === 'video'}
                    onChange={() =>
                      setData({
                        ...data,
                        heroContent: { ...data.heroContent, backgroundMode: 'video' },
                      })
                    }
                    className="text-sky-500 focus:ring-sky-500"
                  />
                  <span>Option A — Background Video</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                  <input
                    type="radio"
                    name="heroBgMode"
                    value="image"
                    checked={data.heroContent.backgroundMode === 'image'}
                    onChange={() =>
                      setData({
                        ...data,
                        heroContent: { ...data.heroContent, backgroundMode: 'image' },
                      })
                    }
                    className="text-sky-500 focus:ring-sky-500"
                  />
                  <span>Option B — Background Image</span>
                </label>
              </div>

              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                    Video URL (MP4 / WebM)
                  </label>
                  <input
                    type="text"
                    value={data.heroContent.videoUrl}
                    onChange={(e) =>
                      setData({
                        ...data,
                        heroContent: { ...data.heroContent, videoUrl: e.target.value },
                      })
                    }
                    placeholder="https://... or /uploads/..."
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                    Image URL (For Image Mode)
                  </label>
                  <input
                    type="text"
                    value={data.heroContent.imageUrl}
                    onChange={(e) =>
                      setData({
                        ...data,
                        heroContent: { ...data.heroContent, imageUrl: e.target.value },
                      })
                    }
                    placeholder="https://... or /uploads/..."
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                    Video Fallback / Poster Image URL (If video fails or while loading)
                  </label>
                  <input
                    type="text"
                    value={data.heroContent.videoFallbackUrl}
                    onChange={(e) =>
                      setData({
                        ...data,
                        heroContent: { ...data.heroContent, videoFallbackUrl: e.target.value },
                      })
                    }
                    placeholder="https://... or /uploads/..."
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <h3 className="text-base font-bold text-sky-400 font-mono pt-4 border-t border-white/10">
                3. Workspace Dashboard CMS (Requirement #14 & #16)
              </h3>

              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                  About Bio
                </label>
                <textarea
                  rows={4}
                  value={data.workspaceDashboard.aboutBio}
                  onChange={(e) =>
                    setData({
                      ...data,
                      workspaceDashboard: { ...data.workspaceDashboard, aboutBio: e.target.value },
                    })
                  }
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                    Currently Building Title
                  </label>
                  <input
                    type="text"
                    value={data.workspaceDashboard.currentlyBuilding.title}
                    onChange={(e) =>
                      setData({
                        ...data,
                        workspaceDashboard: {
                          ...data.workspaceDashboard,
                          currentlyBuilding: {
                            ...data.workspaceDashboard.currentlyBuilding,
                            title: e.target.value,
                          },
                        },
                      })
                    }
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                    Progress Percentage (0–100)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={data.workspaceDashboard.currentlyBuilding.progress}
                    onChange={(e) =>
                      setData({
                        ...data,
                        workspaceDashboard: {
                          ...data.workspaceDashboard,
                          currentlyBuilding: {
                            ...data.workspaceDashboard.currentlyBuilding,
                            progress: parseInt(e.target.value, 10) || 0,
                          },
                        },
                      })
                    }
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    saveContentChanges({
                      heroContent: data.heroContent,
                      workspaceDashboard: data.workspaceDashboard,
                    })
                  }
                  className="flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-3 text-xs font-semibold text-white shadow-lg shadow-sky-500/25 hover:bg-sky-400 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{saving ? 'Writing to Database...' : 'Save Home & Dashboard to Database'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB: WORKSPACE COCKPIT CMS (Master Access to Every Detail from Image) */}
        {activeTab === 'workspace' && (
          <div className="p-8 max-w-5xl space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
                    <Terminal className="h-3.5 w-3.5" />
                  </span>
                  <h2 className="text-2xl font-bold tracking-tight text-white">
                    Workspace Cockpit CMS
                  </h2>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Full granular control to edit every line, terminal prompt, tabs, stats, philosophy, and Currently Building engine.
                </p>
              </div>

              <button
                type="button"
                disabled={saving}
                onClick={() =>
                  saveContentChanges({
                    workspaceDashboard: data.workspaceDashboard,
                  })
                }
                className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-sky-500/25 hover:bg-sky-400 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{saving ? 'Writing Changes...' : 'Save Cockpit Changes'}</span>
              </button>
            </div>

            {/* LIVE PREVIEW BANNER */}
            <div className="rounded-3xl border border-sky-500/20 bg-gradient-to-r from-sky-500/5 via-[#0e111a] to-indigo-500/5 p-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <span className="font-mono text-xs text-sky-400 font-semibold">
                    {data.workspaceDashboard?.terminalPrompt || 'aurex@workspace:~$'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="rounded-lg bg-sky-500/20 px-2 py-0.5 text-[10px] text-sky-300 font-medium">
                    {data.workspaceDashboard?.tabLabels?.about || 'About'}
                  </span>
                  <span className="rounded-lg bg-white/5 px-2 py-0.5 text-[10px] text-slate-400">
                    {data.workspaceDashboard?.tabLabels?.works || 'Works Spotlight'}
                  </span>
                  <span className="rounded-lg bg-white/5 px-2 py-0.5 text-[10px] text-slate-400">
                    {data.workspaceDashboard?.tabLabels?.hobbies || 'Hobbies'}
                  </span>
                  <span className="rounded-lg bg-white/5 px-2 py-0.5 text-[10px] text-slate-400">
                    {data.workspaceDashboard?.tabLabels?.skills || 'Experience & Stack'}
                  </span>
                  <span className="rounded-lg bg-white/5 px-2 py-0.5 text-[10px] text-slate-400">
                    {data.workspaceDashboard?.tabLabels?.socials || 'Socials'}
                  </span>
                </div>
              </div>

              <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="md:col-span-2 space-y-2">
                  <div className="font-bold text-white text-sm">
                    {data.workspaceDashboard?.aboutTitle || 'About Aurex Studio'}
                  </div>
                  <p className="text-slate-400 line-clamp-2">
                    {data.workspaceDashboard?.aboutBio}
                  </p>
                  <div className="flex items-center gap-2 pt-2">
                    <span className="font-mono font-bold text-sky-400">
                      {data.workspaceDashboard?.experienceYears || '6+ Years'}
                    </span>
                    <span className="text-slate-500">
                      {data.workspaceDashboard?.experienceLabel || 'Experience'}
                    </span>
                    <span className="text-slate-700">|</span>
                    <span className="font-mono font-bold text-sky-400">
                      {data.workspaceDashboard?.completedProjectsCount || '85+'}
                    </span>
                    <span className="text-slate-500">
                      {data.workspaceDashboard?.completedProjectsLabel || 'Builds Shipped'}
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/5 bg-[#141824] p-3 space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                    {data.workspaceDashboard?.currentlyBuilding?.badgeLabel || 'CURRENTLY BUILDING'}
                  </span>
                  <div className="font-semibold text-white text-xs truncate">
                    {data.workspaceDashboard?.currentlyBuilding?.title}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {data.workspaceDashboard?.currentlyBuilding?.progressLabel || 'Milestone Progress'}:{' '}
                    <span className="text-sky-400 font-mono font-bold">
                      {data.workspaceDashboard?.currentlyBuilding?.progress ?? 94}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 1. TERMINAL STATUS BAR & SHELL PROMPT */}
            <div className="rounded-3xl border border-white/10 bg-[#0e111a] p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-sky-400 font-mono uppercase tracking-wider flex items-center gap-2">
                  <Terminal className="h-4 w-4" />
                  <span>1. Terminal Top Bar & Tabs</span>
                </h3>
                <span className="text-[11px] text-slate-500 font-mono">Header Section</span>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                  Shell Terminal Prompt Text
                </label>
                <input
                  type="text"
                  value={data.workspaceDashboard?.terminalPrompt || 'aurex@workspace:~$'}
                  onChange={(e) =>
                    setData({
                      ...data,
                      workspaceDashboard: {
                        ...data.workspaceDashboard,
                        terminalPrompt: e.target.value,
                      },
                    })
                  }
                  placeholder="aurex@workspace:~$"
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white font-mono outline-none focus:border-sky-500"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Displayed next to the Mac traffic light dots on the cockpit header.
                </p>
              </div>

              {/* 5 Tab Titles */}
              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-slate-400 mb-2">
                  Cockpit Tab Names (Custom Labels)
                </label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  <div>
                    <span className="block text-[11px] text-slate-500 font-mono">Tab 1: About</span>
                    <input
                      type="text"
                      value={data.workspaceDashboard?.tabLabels?.about ?? 'About'}
                      onChange={(e) =>
                        setData({
                          ...data,
                          workspaceDashboard: {
                            ...data.workspaceDashboard,
                            tabLabels: {
                              ...data.workspaceDashboard?.tabLabels,
                              about: e.target.value,
                            },
                          },
                        })
                      }
                      className="mt-1 w-full rounded-xl border border-white/10 bg-[#141824] p-2.5 text-xs text-white outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <span className="block text-[11px] text-slate-500 font-mono">Tab 2: Works</span>
                    <input
                      type="text"
                      value={data.workspaceDashboard?.tabLabels?.works ?? 'Works Spotlight'}
                      onChange={(e) =>
                        setData({
                          ...data,
                          workspaceDashboard: {
                            ...data.workspaceDashboard,
                            tabLabels: {
                              ...data.workspaceDashboard?.tabLabels,
                              works: e.target.value,
                            },
                          },
                        })
                      }
                      className="mt-1 w-full rounded-xl border border-white/10 bg-[#141824] p-2.5 text-xs text-white outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <span className="block text-[11px] text-slate-500 font-mono">Tab 3: Hobbies</span>
                    <input
                      type="text"
                      value={data.workspaceDashboard?.tabLabels?.hobbies ?? 'Hobbies'}
                      onChange={(e) =>
                        setData({
                          ...data,
                          workspaceDashboard: {
                            ...data.workspaceDashboard,
                            tabLabels: {
                              ...data.workspaceDashboard?.tabLabels,
                              hobbies: e.target.value,
                            },
                          },
                        })
                      }
                      className="mt-1 w-full rounded-xl border border-white/10 bg-[#141824] p-2.5 text-xs text-white outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <span className="block text-[11px] text-slate-500 font-mono">Tab 4: Skills</span>
                    <input
                      type="text"
                      value={data.workspaceDashboard?.tabLabels?.skills ?? 'Experience & Stack'}
                      onChange={(e) =>
                        setData({
                          ...data,
                          workspaceDashboard: {
                            ...data.workspaceDashboard,
                            tabLabels: {
                              ...data.workspaceDashboard?.tabLabels,
                              skills: e.target.value,
                            },
                          },
                        })
                      }
                      className="mt-1 w-full rounded-xl border border-white/10 bg-[#141824] p-2.5 text-xs text-white outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <span className="block text-[11px] text-slate-500 font-mono">Tab 5: Socials</span>
                    <input
                      type="text"
                      value={data.workspaceDashboard?.tabLabels?.socials ?? 'Socials'}
                      onChange={(e) =>
                        setData({
                          ...data,
                          workspaceDashboard: {
                            ...data.workspaceDashboard,
                            tabLabels: {
                              ...data.workspaceDashboard?.tabLabels,
                              socials: e.target.value,
                            },
                          },
                        })
                      }
                      className="mt-1 w-full rounded-xl border border-white/10 bg-[#141824] p-2.5 text-xs text-white outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. COCKPIT SECTION TITLE & BADGE */}
            <div className="rounded-3xl border border-white/10 bg-[#0e111a] p-6 sm:p-8 space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-sky-400 font-mono uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span>2. Section Heading & Intro</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                    Badge Pill Text
                  </label>
                  <input
                    type="text"
                    value={data.workspaceDashboard?.badge || 'WORKSPACE COCKPIT'}
                    onChange={(e) =>
                      setData({
                        ...data,
                        workspaceDashboard: { ...data.workspaceDashboard, badge: e.target.value },
                      })
                    }
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                    Main Heading Title
                  </label>
                  <input
                    type="text"
                    value={data.workspaceDashboard?.title || 'Explore Aurex Studio Workspace'}
                    onChange={(e) =>
                      setData({
                        ...data,
                        workspaceDashboard: { ...data.workspaceDashboard, title: e.target.value },
                      })
                    }
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                  Subtitle / Description
                </label>
                <textarea
                  rows={2}
                  value={data.workspaceDashboard?.subtitle || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      workspaceDashboard: { ...data.workspaceDashboard, subtitle: e.target.value },
                    })
                  }
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                  placeholder="An interactive look inside my engineering discipline, active build pipelines..."
                />
              </div>
            </div>

            {/* 3. ABOUT TAB CONTENT (LEFT COLUMN OF IMAGE) */}
            <div className="rounded-3xl border border-white/10 bg-[#0e111a] p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-sky-400 font-mono uppercase tracking-wider flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>3. About Aurex Studio (Tab 1 Left Column)</span>
                </h3>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                  About Heading
                </label>
                <input
                  type="text"
                  value={data.workspaceDashboard?.aboutTitle || 'About Aurex Studio'}
                  onChange={(e) =>
                    setData({
                      ...data,
                      workspaceDashboard: { ...data.workspaceDashboard, aboutTitle: e.target.value },
                    })
                  }
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                  Bio Paragraph / Studio Description
                </label>
                <textarea
                  rows={4}
                  value={data.workspaceDashboard?.aboutBio || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      workspaceDashboard: { ...data.workspaceDashboard, aboutBio: e.target.value },
                    })
                  }
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 pt-2">
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                    Philosophy Badge Label
                  </label>
                  <input
                    type="text"
                    value={data.workspaceDashboard?.philosophyBadge || 'CORE ENGINEERING PHILOSOPHY'}
                    onChange={(e) =>
                      setData({
                        ...data,
                        workspaceDashboard: {
                          ...data.workspaceDashboard,
                          philosophyBadge: e.target.value,
                        },
                      })
                    }
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                    Philosophy Quote
                  </label>
                  <textarea
                    rows={2}
                    value={data.workspaceDashboard?.developerPhilosophy || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        workspaceDashboard: {
                          ...data.workspaceDashboard,
                          developerPhilosophy: e.target.value,
                        },
                      })
                    }
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500 italic"
                  />
                </div>
              </div>
            </div>

            {/* 4. STAT COUNTERS MATRIX (ALL 4 CARDS: VALUE & LABEL) */}
            <div className="rounded-3xl border border-white/10 bg-[#0e111a] p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-sky-400 font-mono uppercase tracking-wider flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>4. Metric Stat Cards (Value & Label)</span>
                </h3>
                <span className="text-[11px] text-slate-500 font-mono">4 Dashboard Counters</span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Stat 1 */}
                <div className="rounded-2xl border border-white/5 bg-[#141824] p-4 space-y-3">
                  <span className="text-[10px] font-mono uppercase text-sky-400 block font-bold">
                    Stat Card #1
                  </span>
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-slate-500">Value</label>
                    <input
                      type="text"
                      value={data.workspaceDashboard?.experienceYears || '6+ Years'}
                      onChange={(e) =>
                        setData({
                          ...data,
                          workspaceDashboard: {
                            ...data.workspaceDashboard,
                            experienceYears: e.target.value,
                          },
                        })
                      }
                      className="mt-1 w-full rounded-xl border border-white/10 bg-[#1b2030] p-2.5 text-xs text-white font-mono font-bold outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-slate-500">Label</label>
                    <input
                      type="text"
                      value={data.workspaceDashboard?.experienceLabel || 'Experience'}
                      onChange={(e) =>
                        setData({
                          ...data,
                          workspaceDashboard: {
                            ...data.workspaceDashboard,
                            experienceLabel: e.target.value,
                          },
                        })
                      }
                      className="mt-1 w-full rounded-xl border border-white/10 bg-[#1b2030] p-2.5 text-xs text-slate-300 outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                {/* Stat 2 */}
                <div className="rounded-2xl border border-white/5 bg-[#141824] p-4 space-y-3">
                  <span className="text-[10px] font-mono uppercase text-sky-400 block font-bold">
                    Stat Card #2
                  </span>
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-slate-500">Value</label>
                    <input
                      type="text"
                      value={data.workspaceDashboard?.completedProjectsCount || '85+'}
                      onChange={(e) =>
                        setData({
                          ...data,
                          workspaceDashboard: {
                            ...data.workspaceDashboard,
                            completedProjectsCount: e.target.value,
                          },
                        })
                      }
                      className="mt-1 w-full rounded-xl border border-white/10 bg-[#1b2030] p-2.5 text-xs text-white font-mono font-bold outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-slate-500">Label</label>
                    <input
                      type="text"
                      value={data.workspaceDashboard?.completedProjectsLabel || 'Builds Shipped'}
                      onChange={(e) =>
                        setData({
                          ...data,
                          workspaceDashboard: {
                            ...data.workspaceDashboard,
                            completedProjectsLabel: e.target.value,
                          },
                        })
                      }
                      className="mt-1 w-full rounded-xl border border-white/10 bg-[#1b2030] p-2.5 text-xs text-slate-300 outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                {/* Stat 3 */}
                <div className="rounded-2xl border border-white/5 bg-[#141824] p-4 space-y-3">
                  <span className="text-[10px] font-mono uppercase text-sky-400 block font-bold">
                    Stat Card #3
                  </span>
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-slate-500">Value</label>
                    <input
                      type="text"
                      value={data.workspaceDashboard?.happyClientsCount || '60+'}
                      onChange={(e) =>
                        setData({
                          ...data,
                          workspaceDashboard: {
                            ...data.workspaceDashboard,
                            happyClientsCount: e.target.value,
                          },
                        })
                      }
                      className="mt-1 w-full rounded-xl border border-white/10 bg-[#1b2030] p-2.5 text-xs text-white font-mono font-bold outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-slate-500">Label</label>
                    <input
                      type="text"
                      value={data.workspaceDashboard?.happyClientsLabel || 'Global Clients'}
                      onChange={(e) =>
                        setData({
                          ...data,
                          workspaceDashboard: {
                            ...data.workspaceDashboard,
                            happyClientsLabel: e.target.value,
                          },
                        })
                      }
                      className="mt-1 w-full rounded-xl border border-white/10 bg-[#1b2030] p-2.5 text-xs text-slate-300 outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                {/* Stat 4 */}
                <div className="rounded-2xl border border-white/5 bg-[#141824] p-4 space-y-3">
                  <span className="text-[10px] font-mono uppercase text-sky-400 block font-bold">
                    Stat Card #4
                  </span>
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-slate-500">Value</label>
                    <input
                      type="text"
                      value={data.workspaceDashboard?.codeLinesCount || '500k+'}
                      onChange={(e) =>
                        setData({
                          ...data,
                          workspaceDashboard: {
                            ...data.workspaceDashboard,
                            codeLinesCount: e.target.value,
                          },
                        })
                      }
                      className="mt-1 w-full rounded-xl border border-white/10 bg-[#1b2030] p-2.5 text-xs text-white font-mono font-bold outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-slate-500">Label</label>
                    <input
                      type="text"
                      value={data.workspaceDashboard?.codeLinesLabel || 'Lines Written'}
                      onChange={(e) =>
                        setData({
                          ...data,
                          workspaceDashboard: {
                            ...data.workspaceDashboard,
                            codeLinesLabel: e.target.value,
                          },
                        })
                      }
                      className="mt-1 w-full rounded-xl border border-white/10 bg-[#1b2030] p-2.5 text-xs text-slate-300 outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 5. CURRENTLY BUILDING WIDGET (RIGHT COLUMN OF IMAGE) */}
            <div className="rounded-3xl border border-white/10 bg-[#0e111a] p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-sky-400 font-mono uppercase tracking-wider flex items-center gap-2">
                  <Flame className="h-4 w-4 text-amber-500" />
                  <span>5. Currently Building Engine (Right Card)</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                    Section Tag / Header Label
                  </label>
                  <input
                    type="text"
                    value={data.workspaceDashboard?.currentlyBuilding?.badgeLabel || 'CURRENTLY BUILDING'}
                    onChange={(e) =>
                      setData({
                        ...data,
                        workspaceDashboard: {
                          ...data.workspaceDashboard,
                          currentlyBuilding: {
                            ...data.workspaceDashboard.currentlyBuilding,
                            badgeLabel: e.target.value,
                          },
                        },
                      })
                    }
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                    Status Badge Text
                  </label>
                  <input
                    type="text"
                    value={data.workspaceDashboard?.currentlyBuilding?.statusText || 'Active Production Release'}
                    onChange={(e) =>
                      setData({
                        ...data,
                        workspaceDashboard: {
                          ...data.workspaceDashboard,
                          currentlyBuilding: {
                            ...data.workspaceDashboard.currentlyBuilding,
                            statusText: e.target.value,
                          },
                        },
                      })
                    }
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                  Project Title
                </label>
                <input
                  type="text"
                  value={data.workspaceDashboard?.currentlyBuilding?.title || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      workspaceDashboard: {
                        ...data.workspaceDashboard,
                        currentlyBuilding: {
                          ...data.workspaceDashboard.currentlyBuilding,
                          title: e.target.value,
                        },
                      },
                    })
                  }
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                  Project Description / Subtitle
                </label>
                <textarea
                  rows={3}
                  value={data.workspaceDashboard?.currentlyBuilding?.subtitle || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      workspaceDashboard: {
                        ...data.workspaceDashboard,
                        currentlyBuilding: {
                          ...data.workspaceDashboard.currentlyBuilding,
                          subtitle: e.target.value,
                        },
                      },
                    })
                  }
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                    Progress Bar Label
                  </label>
                  <input
                    type="text"
                    value={data.workspaceDashboard?.currentlyBuilding?.progressLabel || 'Milestone Progress'}
                    onChange={(e) =>
                      setData({
                        ...data,
                        workspaceDashboard: {
                          ...data.workspaceDashboard,
                          currentlyBuilding: {
                            ...data.workspaceDashboard.currentlyBuilding,
                            progressLabel: e.target.value,
                          },
                        },
                      })
                    }
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                      Milestone Progress ({data.workspaceDashboard?.currentlyBuilding?.progress ?? 94}%)
                    </label>
                  </div>
                  <div className="mt-2 flex items-center gap-4">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={data.workspaceDashboard?.currentlyBuilding?.progress ?? 94}
                      onChange={(e) =>
                        setData({
                          ...data,
                          workspaceDashboard: {
                            ...data.workspaceDashboard,
                            currentlyBuilding: {
                              ...data.workspaceDashboard.currentlyBuilding,
                              progress: parseInt(e.target.value, 10) || 0,
                            },
                          },
                        })
                      }
                      className="w-full accent-sky-500 cursor-pointer"
                    />
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={data.workspaceDashboard?.currentlyBuilding?.progress ?? 94}
                      onChange={(e) =>
                        setData({
                          ...data,
                          workspaceDashboard: {
                            ...data.workspaceDashboard,
                            currentlyBuilding: {
                              ...data.workspaceDashboard.currentlyBuilding,
                              progress: parseInt(e.target.value, 10) || 0,
                            },
                          },
                        })
                      }
                      className="w-16 rounded-xl border border-white/10 bg-[#141824] p-2 text-center text-xs text-white font-mono outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                  Tech Stack Tags (Comma Separated)
                </label>
                <input
                  type="text"
                  value={(data.workspaceDashboard?.currentlyBuilding?.tags || []).join(', ')}
                  onChange={(e) =>
                    setData({
                      ...data,
                      workspaceDashboard: {
                        ...data.workspaceDashboard,
                        currentlyBuilding: {
                          ...data.workspaceDashboard.currentlyBuilding,
                          tags: e.target.value
                            .split(',')
                            .map((t) => t.trim())
                            .filter(Boolean),
                        },
                      },
                    })
                  }
                  placeholder="Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Supabase"
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 pt-2">
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={data.workspaceDashboard?.currentlyBuilding?.ctaText || 'Collaborate On A Build'}
                    onChange={(e) =>
                      setData({
                        ...data,
                        workspaceDashboard: {
                          ...data.workspaceDashboard,
                          currentlyBuilding: {
                            ...data.workspaceDashboard.currentlyBuilding,
                            ctaText: e.target.value,
                          },
                        },
                      })
                    }
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                    CTA Button Link
                  </label>
                  <input
                    type="text"
                    value={data.workspaceDashboard?.currentlyBuilding?.ctaLink || '/contact'}
                    onChange={(e) =>
                      setData({
                        ...data,
                        workspaceDashboard: {
                          ...data.workspaceDashboard,
                          currentlyBuilding: {
                            ...data.workspaceDashboard.currentlyBuilding,
                            ctaLink: e.target.value,
                          },
                        },
                      })
                    }
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Save Bar */}
            <div className="flex justify-end pt-4">
              <button
                type="button"
                disabled={saving}
                onClick={() =>
                  saveContentChanges({
                    workspaceDashboard: data.workspaceDashboard,
                  })
                }
                className="flex items-center gap-2 rounded-xl bg-sky-500 px-8 py-3.5 text-xs font-semibold text-white shadow-lg shadow-sky-500/25 hover:bg-sky-400 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{saving ? 'Saving to Database...' : 'Save Workspace Cockpit to Database'}</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: SERVICES & PLANS CMS (Requirement #20, #24, #29, #30) */}
        {activeTab === 'services' && (
          <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  Services & Pricing CMS
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Full control over disciplines, 2–3 featured project proof links, custom sections builder, and pricing plans.
                </p>
              </div>

              {!editingService && (
                <button
                  onClick={() => {
                    setIsNewService(true);
                    setEditingService({
                      id: 'serv-' + Date.now(),
                      slug: 'new-service',
                      title: 'New Service',
                      shortDescription: 'Description of this new service.',
                      icon: 'Layers',
                      bannerImage: '',
                      heroIntro: 'Detailed engineering overview for this service.',
                      startingPrice: '₹10,000',
                      featuredProjectIds: [],
                      sections: [],
                      plans: [],
                      isPublished: true,
                      order: (data.services?.length || 0) + 1,
                    });
                  }}
                  className="flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-xs font-semibold text-white hover:bg-sky-400"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New Service</span>
                </button>
              )}
            </div>

            {/* If currently editing a service */}
            {editingService ? (
              <div className="rounded-3xl border border-white/10 bg-[#0e111a] p-8 space-y-8 max-w-4xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h3 className="text-lg font-bold text-white">
                    {isNewService ? 'Create Service' : `Editing: ${editingService.title}`}
                  </h3>
                  <button
                    onClick={() => setEditingService(null)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>

                {/* Core metadata */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                      Service Title
                    </label>
                    <input
                      type="text"
                      value={editingService.title}
                      onChange={(e) =>
                        setEditingService({ ...editingService, title: e.target.value })
                      }
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      value={editingService.slug}
                      onChange={(e) =>
                        setEditingService({ ...editingService, slug: e.target.value })
                      }
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                      Starting Price (e.g. ₹10,000)
                    </label>
                    <input
                      type="text"
                      value={editingService.startingPrice}
                      onChange={(e) =>
                        setEditingService({ ...editingService, startingPrice: e.target.value })
                      }
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                      Icon Name (Globe, Box, MessageSquare, Bot, Layers)
                    </label>
                    <input
                      type="text"
                      value={editingService.icon}
                      onChange={(e) =>
                        setEditingService({ ...editingService, icon: e.target.value })
                      }
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                    Short Description
                  </label>
                  <textarea
                    rows={2}
                    value={editingService.shortDescription}
                    onChange={(e) =>
                      setEditingService({ ...editingService, shortDescription: e.target.value })
                    }
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                    Detailed Hero Introduction
                  </label>
                  <textarea
                    rows={3}
                    value={editingService.heroIntro}
                    onChange={(e) =>
                      setEditingService({ ...editingService, heroIntro: e.target.value })
                    }
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                  />
                </div>

                {/* FEATURED PROJECTS SELECTOR (Requirement #20 & #23) */}
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <h4 className="text-sm font-bold text-sky-400 font-mono">
                    2–3 Featured Projects (Show proof first at top of service page)
                  </h4>
                  <p className="text-xs text-slate-400">
                    Select which portfolio projects appear immediately at the top of this service page:
                  </p>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {data.projects.map((proj) => {
                      const isSelected = editingService.featuredProjectIds?.includes(proj.id);
                      return (
                        <label
                          key={proj.id}
                          className={`flex items-center gap-3 rounded-xl border p-3 text-xs cursor-pointer transition ${
                            isSelected
                              ? 'border-sky-500 bg-sky-500/10 text-white font-medium'
                              : 'border-white/10 bg-[#121520] text-slate-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              const curr = editingService.featuredProjectIds || [];
                              if (e.target.checked) {
                                setEditingService({
                                  ...editingService,
                                  featuredProjectIds: [...curr, proj.id],
                                });
                              } else {
                                setEditingService({
                                  ...editingService,
                                  featuredProjectIds: curr.filter((id) => id !== proj.id),
                                });
                              }
                            }}
                            className="rounded text-sky-500 focus:ring-sky-500"
                          />
                          <span>
                            {proj.title} <span className="text-slate-500">({proj.category})</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* MANUAL SERVICE SECTIONS BUILDER (Requirement #24) */}
                <div className="pt-4 border-t border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-sky-400 font-mono">
                        Manual Content Sections Builder
                      </h4>
                      <p className="text-xs text-slate-400">
                        Add, edit, or reorder custom content sections (e.g. &quot;What I Can Build&quot;, &quot;Hosting &amp; Panels&quot;).
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const newSection: ServiceSection = {
                          id: 'sec-' + Date.now(),
                          title: 'New Custom Section',
                          subtitle: 'Section Subtitle',
                          content: 'Section description text.',
                          type: 'custom',
                          items: [],
                          order: (editingService.sections?.length || 0) + 1,
                          isVisible: true,
                        };
                        setEditingService({
                          ...editingService,
                          sections: [...(editingService.sections || []), newSection],
                        });
                      }}
                      className="flex items-center gap-1.5 rounded-lg border border-sky-500/30 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-400 hover:bg-sky-500/20"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Section</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {editingService.sections?.map((sec, sIdx) => (
                      <div
                        key={sec.id}
                        className="rounded-2xl border border-white/10 bg-[#121520] p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={sec.title}
                            onChange={(e) => {
                              const updated = [...editingService.sections];
                              updated[sIdx].title = e.target.value;
                              setEditingService({ ...editingService, sections: updated });
                            }}
                            className="font-bold text-sm bg-transparent border-b border-white/20 pb-1 text-white outline-none focus:border-sky-500"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = editingService.sections.filter((_, i) => i !== sIdx);
                              setEditingService({ ...editingService, sections: updated });
                            }}
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <input
                          type="text"
                          value={sec.subtitle || ''}
                          placeholder="Subtitle (e.g. Key Features)"
                          onChange={(e) => {
                            const updated = [...editingService.sections];
                            updated[sIdx].subtitle = e.target.value;
                            setEditingService({ ...editingService, sections: updated });
                          }}
                          className="w-full rounded-lg border border-white/5 bg-[#161a28] p-2 text-xs text-white"
                        />

                        <textarea
                          rows={2}
                          value={sec.content || ''}
                          placeholder="Content paragraph"
                          onChange={(e) => {
                            const updated = [...editingService.sections];
                            updated[sIdx].content = e.target.value;
                            setEditingService({ ...editingService, sections: updated });
                          }}
                          className="w-full rounded-lg border border-white/5 bg-[#161a28] p-2 text-xs text-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* PRICING PLANS BUILDER (Requirement #29 & #30) */}
                <div className="pt-4 border-t border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-sky-400 font-mono">
                        Pricing Plans Builder (100% Dynamic Database-Backed)
                      </h4>
                      <p className="text-xs text-slate-400">
                        Add, edit prices, currency, features, and popularity badges.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const newPlan: ServicePlan = {
                          id: 'plan-' + Date.now(),
                          name: 'Custom Tier',
                          price: '₹15,000',
                          period: 'One-time',
                          currency: 'INR',
                          description: 'Scope and timeline.',
                          features: ['Feature 1', 'Feature 2', 'Support'],
                          ctaText: 'Choose Tier',
                          isFeatured: false,
                          order: (editingService.plans?.length || 0) + 1,
                        };
                        setEditingService({
                          ...editingService,
                          plans: [...(editingService.plans || []), newPlan],
                        });
                      }}
                      className="flex items-center gap-1.5 rounded-lg border border-sky-500/30 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-400 hover:bg-sky-500/20"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Plan</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {editingService.plans?.map((plan, pIdx) => (
                      <div
                        key={plan.id}
                        className="rounded-2xl border border-white/10 bg-[#121520] p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={plan.name}
                            onChange={(e) => {
                              const updated = [...editingService.plans];
                              updated[pIdx].name = e.target.value;
                              setEditingService({ ...editingService, plans: updated });
                            }}
                            className="font-bold text-sm bg-transparent border-b border-white/20 pb-0.5 text-white outline-none focus:border-sky-500"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = editingService.plans.filter((_, i) => i !== pIdx);
                              setEditingService({ ...editingService, plans: updated });
                            }}
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-slate-400">Price Display</label>
                            <input
                              type="text"
                              value={plan.price}
                              onChange={(e) => {
                                const updated = [...editingService.plans];
                                updated[pIdx].price = e.target.value;
                                setEditingService({ ...editingService, plans: updated });
                              }}
                              className="w-full rounded-lg border border-white/5 bg-[#161a28] p-2 text-xs text-white font-mono"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400">Billing Period</label>
                            <input
                              type="text"
                              value={plan.period || ''}
                              onChange={(e) => {
                                const updated = [...editingService.plans];
                                updated[pIdx].period = e.target.value;
                                setEditingService({ ...editingService, plans: updated });
                              }}
                              className="w-full rounded-lg border border-white/5 bg-[#161a28] p-2 text-xs text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-400">Features (one per line)</label>
                          <textarea
                            rows={3}
                            value={plan.features?.join('\n') || ''}
                            onChange={(e) => {
                              const updated = [...editingService.plans];
                              updated[pIdx].features = e.target.value.split('\n').filter(Boolean);
                              setEditingService({ ...editingService, plans: updated });
                            }}
                            className="w-full rounded-lg border border-white/5 bg-[#161a28] p-2 text-xs text-white font-mono"
                          />
                        </div>

                        <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={plan.isFeatured}
                            onChange={(e) => {
                              const updated = [...editingService.plans];
                              updated[pIdx].isFeatured = e.target.checked;
                              setEditingService({ ...editingService, plans: updated });
                            }}
                            className="rounded text-sky-500"
                          />
                          <span>Highlight as Popular Tier</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setEditingService(null)}
                    className="rounded-xl px-5 py-2.5 text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => handleSaveService(editingService)}
                    className="flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-2.5 text-xs font-semibold text-white shadow-lg shadow-sky-500/25 hover:bg-sky-400"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Service to Database</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Services List */
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {data.services?.map((serv) => (
                  <div
                    key={serv.id}
                    className="rounded-3xl border border-white/10 bg-[#0e111a] p-6 space-y-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded-lg bg-sky-500/10 px-2 py-0.5 font-mono text-[11px] text-sky-400">
                          {serv.slug}
                        </span>
                        <span className="font-mono text-xs font-semibold text-slate-300">
                          From {serv.startingPrice}
                        </span>
                      </div>

                      <h3 className="mt-4 text-lg font-bold text-white">{serv.title}</h3>
                      <p className="mt-2 text-xs text-slate-400 line-clamp-2">
                        {serv.shortDescription}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-slate-400">
                        <span>{serv.plans?.length || 0} Pricing Plans</span>
                        <span>•</span>
                        <span>{serv.sections?.length || 0} Custom Sections</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                      <button
                        onClick={() => {
                          setIsNewService(false);
                          setEditingService(serv);
                        }}
                        className="flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        <span>Edit Service & Plans</span>
                      </button>

                      <button
                        onClick={() => handleDeleteService(serv.id)}
                        className="text-red-400 hover:text-red-300 p-1"
                        title="Delete Service"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: WORKS PORTFOLIO CMS */}
        {activeTab === 'works' && (
          <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  Works Portfolio CMS
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Manage projects, case studies, technologies, and deployment URLs.
                </p>
              </div>

              {!editingProject && (
                <button
                  onClick={() => {
                    setIsNewProject(true);
                    setEditingProject({
                      id: 'proj-' + Date.now(),
                      slug: 'new-project',
                      title: 'New Project Title',
                      category: 'Web',
                      shortDescription: 'Short project summary.',
                      fullDescription: 'Comprehensive architectural case study.',
                      technologies: ['Next.js 14', 'TypeScript'],
                      status: 'Live',
                      liveUrl: '',
                      githubUrl: '',
                      coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
                      galleryImages: [],
                      challenges: '',
                      results: '',
                      isFeatured: false,
                      order: (data.projects?.length || 0) + 1,
                    });
                  }}
                  className="flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-xs font-semibold text-white hover:bg-sky-400"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Project</span>
                </button>
              )}
            </div>

            {editingProject ? (
              <div className="rounded-3xl border border-white/10 bg-[#0e111a] p-8 space-y-6 max-w-4xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h3 className="text-lg font-bold text-white">
                    {isNewProject ? 'Create Project' : `Editing: ${editingProject.title}`}
                  </h3>
                  <button
                    onClick={() => setEditingProject(null)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                      Title
                    </label>
                    <input
                      type="text"
                      value={editingProject.title}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, title: e.target.value })
                      }
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                      Slug
                    </label>
                    <input
                      type="text"
                      value={editingProject.slug}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, slug: e.target.value })
                      }
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                      Category
                    </label>
                    <select
                      value={editingProject.category}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, category: e.target.value as any })
                      }
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white"
                    >
                      <option value="Web">Web</option>
                      <option value="Minecraft">Minecraft</option>
                      <option value="Discord">Discord</option>
                      <option value="Bots">Bots</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                    Short Description
                  </label>
                  <textarea
                    rows={2}
                    value={editingProject.shortDescription}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, shortDescription: e.target.value })
                    }
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                    Full Architecture Description
                  </label>
                  <textarea
                    rows={4}
                    value={editingProject.fullDescription}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, fullDescription: e.target.value })
                    }
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                      Tech Stack (comma separated)
                    </label>
                    <input
                      type="text"
                      value={editingProject.technologies?.join(', ') || ''}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          technologies: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                        })
                      }
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                      Cover Image URL
                    </label>
                    <input
                      type="text"
                      value={editingProject.coverImage}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, coverImage: e.target.value })
                      }
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                      Live Project URL
                    </label>
                    <input
                      type="text"
                      value={editingProject.liveUrl || ''}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, liveUrl: e.target.value })
                      }
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                      GitHub URL
                    </label>
                    <input
                      type="text"
                      value={editingProject.githubUrl || ''}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, githubUrl: e.target.value })
                      }
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                      Technical Challenges
                    </label>
                    <textarea
                      rows={2}
                      value={editingProject.challenges || ''}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, challenges: e.target.value })
                      }
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                      Deliverable Results
                    </label>
                    <textarea
                      rows={2}
                      value={editingProject.results || ''}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, results: e.target.value })
                      }
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProject.isFeatured}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, isFeatured: e.target.checked })
                      }
                      className="rounded text-sky-500"
                    />
                    <span>Show on Homepage Featured Works</span>
                  </label>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingProject(null)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => handleSaveProject(editingProject)}
                      className="flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-2.5 text-xs font-semibold text-white hover:bg-sky-400"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save Project</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {data.projects?.map((proj) => (
                  <div
                    key={proj.id}
                    className="rounded-3xl border border-white/10 bg-[#0e111a] p-6 space-y-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded-md bg-sky-500/10 px-2 py-0.5 font-mono text-[11px] text-sky-400 font-semibold">
                          {proj.category}
                        </span>
                        <span className="text-[11px] text-emerald-400">{proj.status}</span>
                      </div>

                      <h3 className="mt-3 text-base font-bold text-white">{proj.title}</h3>
                      <p className="mt-2 text-xs text-slate-400 line-clamp-2">
                        {proj.shortDescription}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                      <button
                        onClick={() => {
                          setIsNewProject(false);
                          setEditingProject(proj);
                        }}
                        className="flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        <span>Edit Project</span>
                      </button>

                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="text-red-400 hover:text-red-300 p-1"
                        title="Delete Project"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4b: DEVELOPERS & TEAM MANAGEMENT */}
        {activeTab === 'developers' && (
          <div className="p-8 space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  Developers & Team Management
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Manage Aurex Studio developer profiles, skills, availability, and project assignments.
                </p>
                <div className="mt-3 flex items-center gap-3 text-xs">
                  <span className="rounded-full bg-white/5 px-3 py-1 text-slate-300">
                    Total: <strong className="text-white font-mono">{data.developers?.length || 0}</strong>
                  </span>
                  <span className="rounded-full bg-amber-500/10 px-3 py-1 text-amber-400 border border-amber-500/20">
                    Featured: <strong className="font-mono">{data.developers?.filter((d) => d.isFeatured && d.isVisible).length || 0}</strong>
                  </span>
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-400 border border-emerald-500/20">
                    Public: <strong className="font-mono">{data.developers?.filter((d) => d.isVisible).length || 0}</strong>
                  </span>
                </div>
              </div>

              {!editingDeveloper && (
                <button
                  onClick={() => {
                    setIsNewDeveloper(true);
                    setEditingDeveloper({
                      id: 'dev-' + Date.now(),
                      name: '',
                      username: '',
                      role: 'Full Stack Developer',
                      shortBio: '',
                      fullBio: '',
                      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
                      coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1400&q=80',
                      experience: '3+ Years',
                      availability: 'Available',
                      customStatus: 'Available for new client contracts',
                      skills: [
                        { name: 'TypeScript', level: 'Advanced' },
                        { name: 'React', level: 'Advanced' },
                        { name: 'Next.js', level: 'Advanced' },
                      ],
                      specializations: ['Web Development', 'UI/UX Engineering'],
                      technologies: ['TypeScript', 'Next.js', 'React', 'Tailwind CSS'],
                      projectIds: [],
                      socials: [
                        { platform: 'GitHub', username: '', url: 'https://github.com' },
                        { platform: 'Discord', username: '', url: 'https://discord.com' },
                      ],
                      isFeatured: false,
                      isVisible: true,
                      displayOrder: (data.developers?.length || 0) + 1,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                    });
                  }}
                  className="flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
                >
                  <Plus className="h-4 w-4" />
                  <span>+ Add Developer</span>
                </button>
              )}
            </div>

            {/* EDIT / CREATE DEVELOPER MODAL/PANEL */}
            {editingDeveloper ? (
              <div className="rounded-3xl border border-white/10 bg-[#0e111a] p-8 space-y-8 max-w-4xl shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Users className="h-5 w-5 text-sky-400" />
                      <span>{isNewDeveloper ? 'Add New Developer' : `Edit Developer: ${editingDeveloper.name}`}</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Enter personal, technical, and assignment details. Changes reflect live on /dashboard.
                    </p>
                  </div>
                  <button
                    onClick={() => setEditingDeveloper(null)}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10"
                  >
                    Cancel
                  </button>
                </div>

                {/* Section 1: Basic Information */}
                <div className="space-y-4">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
                    <span>1. Basic Profile Information</span>
                  </h4>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Alex Vance"
                        value={editingDeveloper.name}
                        onChange={(e) => setEditingDeveloper({ ...editingDeveloper, name: e.target.value })}
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                        Username / URL Slug *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. alex"
                        value={editingDeveloper.username}
                        onChange={(e) => setEditingDeveloper({ ...editingDeveloper, username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '-') })}
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500 font-mono"
                      />
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        URL: /dashboard/developers/{editingDeveloper.username || 'username'}
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                        Professional Role *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Full Stack Developer"
                        value={editingDeveloper.role}
                        onChange={(e) => setEditingDeveloper({ ...editingDeveloper, role: e.target.value })}
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                        Experience
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 5+ Years"
                        value={editingDeveloper.experience}
                        onChange={(e) => setEditingDeveloper({ ...editingDeveloper, experience: e.target.value })}
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                        Short Bio (Shown on cards)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Building modern web applications and fluid digital experiences."
                        value={editingDeveloper.shortBio}
                        onChange={(e) => setEditingDeveloper({ ...editingDeveloper, shortBio: e.target.value })}
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                      Full Bio / About Developer
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Comprehensive overview of experience, engineering philosophy, and domain capabilities..."
                      value={editingDeveloper.fullBio}
                      onChange={(e) => setEditingDeveloper({ ...editingDeveloper, fullBio: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                {/* Section 2: Photo & Cover Management (Admin Upload) */}
                <div className="space-y-4 border-t border-white/10 pt-6">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400">
                    2. Photo & Banner Management (Admin Upload)
                  </h4>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {/* Profile Photo */}
                    <div className="rounded-2xl border border-white/10 bg-[#141824]/50 p-4 space-y-3">
                      <span className="block text-xs font-mono font-semibold uppercase text-slate-300">
                        Profile Photo
                      </span>
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-white/10 bg-[#090b10] shrink-0">
                          {editingDeveloper.profileImage ? (
                            <img
                              src={editingDeveloper.profileImage}
                              alt="Avatar Preview"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
                              No Pic
                            </div>
                          )}
                        </div>
                        <div className="space-y-2 flex-1">
                          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-sky-500/10 px-3 py-1.5 text-xs font-medium text-sky-400 border border-sky-500/20 hover:bg-sky-500/20">
                            <Upload className="h-3.5 w-3.5" />
                            <span>{uploadingDevPhoto ? 'Uploading...' : 'Upload Photo'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              disabled={uploadingDevPhoto}
                              onChange={(e) => handleDevPhotoUpload(e, false)}
                              className="hidden"
                            />
                          </label>
                          <input
                            type="text"
                            placeholder="Or enter direct image URL"
                            value={editingDeveloper.profileImage}
                            onChange={(e) => setEditingDeveloper({ ...editingDeveloper, profileImage: e.target.value })}
                            className="w-full rounded-xl border border-white/10 bg-[#0e111a] p-2 text-xs text-white outline-none focus:border-sky-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Cover Banner */}
                    <div className="rounded-2xl border border-white/10 bg-[#141824]/50 p-4 space-y-3">
                      <span className="block text-xs font-mono font-semibold uppercase text-slate-300">
                        Cover Banner Image
                      </span>
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-24 overflow-hidden rounded-xl border border-white/10 bg-[#090b10] shrink-0">
                          {editingDeveloper.coverImage ? (
                            <img
                              src={editingDeveloper.coverImage}
                              alt="Cover Preview"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
                              No Cover
                            </div>
                          )}
                        </div>
                        <div className="space-y-2 flex-1">
                          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20">
                            <Upload className="h-3.5 w-3.5" />
                            <span>{uploadingDevCover ? 'Uploading...' : 'Upload Cover'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              disabled={uploadingDevCover}
                              onChange={(e) => handleDevPhotoUpload(e, true)}
                              className="hidden"
                            />
                          </label>
                          <input
                            type="text"
                            placeholder="Or enter direct image URL"
                            value={editingDeveloper.coverImage || ''}
                            onChange={(e) => setEditingDeveloper({ ...editingDeveloper, coverImage: e.target.value })}
                            className="w-full rounded-xl border border-white/10 bg-[#0e111a] p-2 text-xs text-white outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3: Status & Availability */}
                <div className="space-y-4 border-t border-white/10 pt-6">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400">
                    3. Live Status & Availability
                  </h4>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                        Availability Status
                      </label>
                      <select
                        value={editingDeveloper.availability}
                        onChange={(e) => setEditingDeveloper({ ...editingDeveloper, availability: e.target.value as any })}
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                      >
                        <option value="Available">● Available (Green)</option>
                        <option value="Working">● Working (Sky)</option>
                        <option value="Busy">● Busy (Amber)</option>
                        <option value="Away">● Away (Orange)</option>
                        <option value="Unavailable">● Unavailable (Slate)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                        Custom Activity Status
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Working on Aurex Studio v2"
                        value={editingDeveloper.customStatus || ''}
                        onChange={(e) => setEditingDeveloper({ ...editingDeveloper, customStatus: e.target.value })}
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 4: Skills & Competency Levels */}
                <div className="space-y-4 border-t border-white/10 pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400">
                        4. Skills & Competency Levels
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Add technical skills with proficiency ratings (Beginner, Intermediate, Advanced, Expert).
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const current = editingDeveloper.skills || [];
                        setEditingDeveloper({
                          ...editingDeveloper,
                          skills: [...current, { name: '', level: 'Advanced' }],
                        });
                      }}
                      className="flex items-center gap-1 rounded-lg bg-sky-500/10 px-2.5 py-1 text-xs font-semibold text-sky-400 hover:bg-sky-500/20"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Skill</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {editingDeveloper.skills?.map((sk, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <input
                          type="text"
                          placeholder="Skill name (e.g. React, Next.js, Java)"
                          value={sk.name}
                          onChange={(e) => {
                            const updated = [...(editingDeveloper.skills || [])];
                            updated[idx].name = e.target.value;
                            setEditingDeveloper({ ...editingDeveloper, skills: updated });
                          }}
                          className="flex-1 rounded-xl border border-white/10 bg-[#141824] p-2.5 text-xs text-white outline-none focus:border-sky-500"
                        />
                        <select
                          value={sk.level}
                          onChange={(e) => {
                            const updated = [...(editingDeveloper.skills || [])];
                            updated[idx].level = e.target.value;
                            setEditingDeveloper({ ...editingDeveloper, skills: updated });
                          }}
                          className="w-36 rounded-xl border border-white/10 bg-[#141824] p-2.5 text-xs text-white outline-none focus:border-sky-500 font-mono"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Expert">Expert</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = editingDeveloper.skills?.filter((_, i) => i !== idx);
                            setEditingDeveloper({ ...editingDeveloper, skills: updated });
                          }}
                          className="rounded-lg p-2 text-red-400 hover:bg-red-500/10 transition"
                          title="Remove skill"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 5: Specializations & Technologies */}
                <div className="space-y-4 border-t border-white/10 pt-6">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400">
                    5. Specializations & Technologies
                  </h4>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                        Specializations (comma separated)
                      </label>
                      <input
                        type="text"
                        placeholder="Web Development, UI/UX, Minecraft Plugins"
                        value={editingDeveloper.specializations?.join(', ') || ''}
                        onChange={(e) =>
                          setEditingDeveloper({
                            ...editingDeveloper,
                            specializations: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                          })
                        }
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                      />
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {editingDeveloper.specializations?.map((spec, i) => (
                          <span key={i} className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-slate-300">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                        Technologies Stack (comma separated)
                      </label>
                      <input
                        type="text"
                        placeholder="Next.js, TypeScript, Java, Docker, PostgreSQL"
                        value={editingDeveloper.technologies?.join(', ') || ''}
                        onChange={(e) =>
                          setEditingDeveloper({
                            ...editingDeveloper,
                            technologies: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                          })
                        }
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                      />
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {editingDeveloper.technologies?.map((tech, i) => (
                          <span key={i} className="rounded-md bg-sky-500/10 px-2 py-0.5 text-[10px] text-sky-400 font-mono">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 6: Connected Projects (Relational Connection) */}
                <div className="space-y-4 border-t border-white/10 pt-6">
                  <div>
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400">
                      6. Developer → Project Connection (Relational Mapping)
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Check the portfolio projects this developer engineered or contributed to. These will automatically appear in their public profile with links to the full case study.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {data.projects?.map((proj) => {
                      const isConnected = editingDeveloper.projectIds?.includes(proj.id);
                      return (
                        <label
                          key={proj.id}
                          className={`flex items-start gap-3 rounded-2xl border p-3.5 cursor-pointer transition ${
                            isConnected
                              ? 'border-sky-500/50 bg-sky-500/10 text-white'
                              : 'border-white/10 bg-[#141824]/40 text-slate-300 hover:border-white/20'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isConnected}
                            onChange={(e) => {
                              const current = editingDeveloper.projectIds || [];
                              const updated = e.target.checked
                                ? [...current, proj.id]
                                : current.filter((id) => id !== proj.id);
                              setEditingDeveloper({ ...editingDeveloper, projectIds: updated });
                            }}
                            className="mt-0.5 rounded text-sky-500 focus:ring-sky-500"
                          />
                          <div className="text-xs">
                            <span className="font-semibold block">{proj.title}</span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {proj.category} • /{proj.slug}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Section 7: Social Profiles */}
                <div className="space-y-4 border-t border-white/10 pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400">
                        7. Social Profiles
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        GitHub, X, Discord, LinkedIn, Instagram, or personal website links.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const current = editingDeveloper.socials || [];
                        setEditingDeveloper({
                          ...editingDeveloper,
                          socials: [...current, { platform: 'GitHub', username: '', url: 'https://' }],
                        });
                      }}
                      className="flex items-center gap-1 rounded-lg bg-sky-500/10 px-2.5 py-1 text-xs font-semibold text-sky-400 hover:bg-sky-500/20"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Social</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {editingDeveloper.socials?.map((soc, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <select
                          value={soc.platform}
                          onChange={(e) => {
                            const updated = [...(editingDeveloper.socials || [])];
                            updated[idx].platform = e.target.value;
                            setEditingDeveloper({ ...editingDeveloper, socials: updated });
                          }}
                          className="w-32 rounded-xl border border-white/10 bg-[#141824] p-2.5 text-xs text-white outline-none focus:border-sky-500"
                        >
                          <option value="GitHub">GitHub</option>
                          <option value="X">X (Twitter)</option>
                          <option value="Discord">Discord</option>
                          <option value="LinkedIn">LinkedIn</option>
                          <option value="Instagram">Instagram</option>
                          <option value="Website">Website</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Handle/Username (e.g. alex_dev)"
                          value={soc.username}
                          onChange={(e) => {
                            const updated = [...(editingDeveloper.socials || [])];
                            updated[idx].username = e.target.value;
                            setEditingDeveloper({ ...editingDeveloper, socials: updated });
                          }}
                          className="w-40 rounded-xl border border-white/10 bg-[#141824] p-2.5 text-xs text-white outline-none focus:border-sky-500"
                        />
                        <input
                          type="text"
                          placeholder="URL (e.g. https://github.com/alex_dev)"
                          value={soc.url}
                          onChange={(e) => {
                            const updated = [...(editingDeveloper.socials || [])];
                            updated[idx].url = e.target.value;
                            setEditingDeveloper({ ...editingDeveloper, socials: updated });
                          }}
                          className="flex-1 rounded-xl border border-white/10 bg-[#141824] p-2.5 text-xs text-white outline-none focus:border-sky-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = editingDeveloper.socials?.filter((_, i) => i !== idx);
                            setEditingDeveloper({ ...editingDeveloper, socials: updated });
                          }}
                          className="rounded-lg p-2 text-red-400 hover:bg-red-500/10 transition"
                          title="Remove social"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 8: Display & Visibility Settings */}
                <div className="space-y-4 border-t border-white/10 pt-6">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400">
                    8. Display Settings
                  </h4>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#141824]/40 p-4 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingDeveloper.isFeatured}
                        onChange={(e) => setEditingDeveloper({ ...editingDeveloper, isFeatured: e.target.checked })}
                        className="rounded text-amber-500 focus:ring-amber-500"
                      />
                      <div>
                        <span className="block text-xs font-bold text-white">Featured Developer</span>
                        <span className="text-[10px] text-slate-400">Showcases in Top Featured row on /dashboard</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#141824]/40 p-4 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingDeveloper.isVisible}
                        onChange={(e) => setEditingDeveloper({ ...editingDeveloper, isVisible: e.target.checked })}
                        className="rounded text-emerald-500 focus:ring-emerald-500"
                      />
                      <div>
                        <span className="block text-xs font-bold text-white">Publicly Visible</span>
                        <span className="text-[10px] text-slate-400">Uncheck to hide profile without deleting</span>
                      </div>
                    </label>

                    <div>
                      <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                        Display Order
                      </label>
                      <input
                        type="number"
                        value={editingDeveloper.displayOrder}
                        onChange={(e) => setEditingDeveloper({ ...editingDeveloper, displayOrder: parseInt(e.target.value) || 1 })}
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="border-t border-white/10 pt-6 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingDeveloper(null)}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => handleSaveDeveloper(editingDeveloper)}
                    className="flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-2.5 text-xs font-semibold text-white shadow-lg shadow-sky-500/25 hover:bg-sky-400 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    <span>{saving ? 'Saving...' : 'Save Developer'}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* DEVELOPERS LIST CARDS */
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {(!data.developers || data.developers.length === 0) && (
                  <div className="col-span-full rounded-3xl border border-dashed border-white/10 p-12 text-center text-slate-400">
                    <Users className="mx-auto h-8 w-8 text-slate-600 mb-2" />
                    <p className="text-sm">No developers configured yet.</p>
                  </div>
                )}

                {data.developers?.map((dev) => (
                  <div
                    key={dev.id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#0e111a] transition hover:border-white/20 hover:shadow-2xl hover:shadow-sky-500/5"
                  >
                    {/* Top cover banner */}
                    <div className="relative h-28 w-full bg-[#141824] overflow-hidden">
                      {dev.coverImage ? (
                        <img
                          src={dev.coverImage}
                          alt={dev.name}
                          className="h-full w-full object-cover opacity-60 group-hover:opacity-80 transition duration-500"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-r from-sky-900/40 via-indigo-900/40 to-slate-900" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0e111a] via-transparent to-transparent" />

                      {/* Featured & Visible status badges on banner */}
                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        {dev.isFeatured && (
                          <span className="flex items-center gap-1 rounded-full bg-amber-500/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-black shadow-md">
                            <Star className="h-2.5 w-2.5 fill-black" />
                            <span>Featured</span>
                          </span>
                        )}
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold backdrop-blur-md ${
                            dev.isVisible
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {dev.isVisible ? 'Public' : 'Hidden'}
                        </span>
                      </div>

                      <div className="absolute top-3 left-3">
                        <span className="rounded-md bg-black/60 px-2 py-0.5 font-mono text-[10px] text-slate-300">
                          #{dev.displayOrder}
                        </span>
                      </div>
                    </div>

                    {/* Developer Info Card Body */}
                    <div className="px-6 pb-6 pt-0 space-y-4 relative flex-1 flex flex-col justify-between">
                      <div>
                        {/* Avatar protruding over banner */}
                        <div className="-mt-12 mb-3 relative inline-block">
                          <img
                            src={dev.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
                            alt={dev.name}
                            className="h-20 w-20 rounded-2xl border-4 border-[#0e111a] object-cover shadow-xl bg-[#141824]"
                          />
                          <span
                            className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-[#0e111a] ${
                              dev.availability === 'Available'
                                ? 'bg-emerald-500'
                                : dev.availability === 'Working'
                                ? 'bg-sky-400'
                                : dev.availability === 'Busy'
                                ? 'bg-amber-400'
                                : 'bg-slate-500'
                            }`}
                            title={`Status: ${dev.availability}`}
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-white group-hover:text-sky-400 transition-colors">
                              {dev.name}
                            </h3>
                            <span className="font-mono text-[10px] text-slate-400">
                              @{dev.username}
                            </span>
                          </div>
                          <p className="text-xs text-sky-400 font-medium">{dev.role}</p>
                        </div>

                        {/* Custom status / availability note */}
                        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-300">
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              dev.availability === 'Available'
                                ? 'bg-emerald-400 animate-pulse'
                                : dev.availability === 'Working'
                                ? 'bg-sky-400'
                                : dev.availability === 'Busy'
                                ? 'bg-amber-400'
                                : 'bg-slate-400'
                            }`}
                          />
                          <span className="font-semibold text-white">{dev.availability}:</span>
                          <span className="truncate text-slate-400">{dev.customStatus || dev.shortBio}</span>
                        </div>

                        {/* Main skills tags */}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {dev.skills?.slice(0, 3).map((sk, i) => (
                            <span
                              key={i}
                              className="rounded-lg bg-white/5 px-2 py-0.5 text-[10px] font-medium text-slate-300"
                            >
                              {sk.name} <span className="text-slate-500 font-mono">({sk.level.slice(0, 3)})</span>
                            </span>
                          ))}
                          {(dev.skills?.length || 0) > 3 && (
                            <span className="rounded-lg bg-white/5 px-1.5 py-0.5 text-[10px] text-slate-500">
                              +{(dev.skills?.length || 0) - 3}
                            </span>
                          )}
                        </div>

                        {/* Connected projects snippet */}
                        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                          <span>{dev.projectIds?.length || 0} Connected Projects</span>
                          <span>{dev.experience}</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setIsNewDeveloper(false);
                              setEditingDeveloper(dev);
                            }}
                            className="flex items-center gap-1 rounded-lg bg-sky-500/10 px-2.5 py-1 text-xs font-semibold text-sky-400 hover:bg-sky-500/20"
                            title="Edit Profile"
                          >
                            <Edit className="h-3.5 w-3.5" />
                            <span>Edit</span>
                          </button>

                          <a
                            href={`/dashboard/developers/${dev.username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 rounded-lg bg-white/5 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:bg-white/10"
                            title="Preview Public Profile"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>View</span>
                          </a>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleToggleDeveloperFeatured(dev)}
                            className={`p-1.5 rounded-lg transition ${
                              dev.isFeatured
                                ? 'text-amber-400 bg-amber-400/10 hover:bg-amber-400/20'
                                : 'text-slate-500 hover:text-amber-400 hover:bg-white/5'
                            }`}
                            title={dev.isFeatured ? 'Unfeature Developer' : 'Feature Developer'}
                          >
                            <Star className={`h-4 w-4 ${dev.isFeatured ? 'fill-amber-400' : ''}`} />
                          </button>

                          <button
                            onClick={() => handleToggleDeveloperVisible(dev)}
                            className={`p-1.5 rounded-lg transition ${
                              dev.isVisible
                                ? 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20'
                                : 'text-slate-500 hover:text-emerald-400 hover:bg-white/5'
                            }`}
                            title={dev.isVisible ? 'Hide from public' : 'Make visible to public'}
                          >
                            <Activity className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteDeveloper(dev.id)}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition"
                            title="Delete Developer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: FEEDBACK MODERATION (Requirement #12 & #54) */}
        {activeTab === 'feedback' && (
          <div className="p-8 space-y-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Feedback Moderation
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Visitor reviews submitted from the homepage. Reviews remain hidden until you click Approve.
              </p>
            </div>

            <div className="space-y-4">
              {data.feedback?.map((fb) => (
                <div
                  key={fb.id}
                  className="rounded-3xl border border-white/10 bg-[#0e111a] p-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
                >
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm text-white">{fb.name}</span>
                      <span className="text-xs text-slate-400">({fb.role || 'Visitor'})</span>
                      <div className="flex items-center gap-0.5 ml-2">
                        {Array.from({ length: fb.rating }).map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${
                          fb.status === 'approved'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : fb.status === 'pending'
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}
                      >
                        {fb.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 italic">&quot;{fb.comment}&quot;</p>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Submitted: {new Date(fb.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {/* Moderation Controls */}
                  <div className="flex items-center gap-2">
                    {fb.status !== 'approved' && (
                      <button
                        onClick={() => handleUpdateFeedbackStatus(fb.id, 'approved')}
                        className="rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-400"
                      >
                        Approve
                      </button>
                    )}

                    {fb.status !== 'rejected' && (
                      <button
                        onClick={() => handleUpdateFeedbackStatus(fb.id, 'rejected')}
                        className="rounded-xl border border-white/10 bg-[#161a28] px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white"
                      >
                        Reject
                      </button>
                    )}

                    <button
                      onClick={() => handleUpdateFeedbackStatus(fb.id, undefined, !fb.isFeatured)}
                      className={`rounded-xl p-2 transition ${
                        fb.isFeatured
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'text-slate-500 hover:text-white'
                      }`}
                      title="Toggle Featured"
                    >
                      <Star className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteFeedback(fb.id)}
                      className="p-2 text-red-400 hover:text-red-300"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              {(!data.feedback || data.feedback.length === 0) && (
                <div className="rounded-3xl border border-dashed border-white/10 p-12 text-center text-xs text-slate-500">
                  No feedback submissions recorded yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: CLIENT INQUIRIES CRM (Requirement #55) */}
        {activeTab === 'requests' && (
          <div className="p-8 space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  Client Inquiries & Project Requests
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Review direct inquiries from the Contact form and Accept or Decline incoming proposals.
                </p>
              </div>

              {/* Quick Summary Counts */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-white/5 px-3 py-1 text-slate-300">
                  Total: <strong className="text-white font-mono">{data.contactRequests?.length || 0}</strong>
                </span>
                <span className="rounded-full bg-sky-500/10 px-3 py-1 text-sky-400 border border-sky-500/20">
                  New: <strong className="font-mono">{data.contactRequests?.filter((r) => r.status === 'New').length || 0}</strong>
                </span>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-400 border border-emerald-500/20">
                  Accepted: <strong className="font-mono">{data.contactRequests?.filter((r) => r.status === 'Accepted').length || 0}</strong>
                </span>
                <span className="rounded-full bg-red-500/10 px-3 py-1 text-red-400 border border-red-500/20">
                  Declined: <strong className="font-mono">{data.contactRequests?.filter((r) => r.status === 'Declined').length || 0}</strong>
                </span>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
              {(['All', 'New', 'Accepted', 'Declined', 'In Progress'] as const).map((filter) => {
                const count =
                  filter === 'All'
                    ? data.contactRequests?.length || 0
                    : data.contactRequests?.filter((r) => r.status === filter).length || 0;
                const isActive = requestFilter === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => setRequestFilter(filter)}
                    className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                      isActive
                        ? filter === 'Accepted'
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                          : filter === 'Declined'
                          ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                          : 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                        : 'border border-white/10 bg-[#0e111a] text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{filter}</span>
                    <span className="ml-1.5 font-mono text-[11px] opacity-75">({count})</span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-4">
              {data.contactRequests
                ?.filter((req) => (requestFilter === 'All' ? true : req.status === requestFilter))
                .map((req) => (
                  <div
                    key={req.id}
                    className={`rounded-3xl border bg-[#0e111a] p-6 space-y-4 transition ${
                      req.status === 'Accepted'
                        ? 'border-emerald-500/30 shadow-lg shadow-emerald-500/5'
                        : req.status === 'Declined'
                        ? 'border-red-500/20 opacity-80'
                        : 'border-white/10'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-base text-white">{req.name}</span>
                          {/* Status Badge */}
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              req.status === 'Accepted'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : req.status === 'Declined'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : req.status === 'New'
                                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                                : req.status === 'In Progress'
                                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                                : req.status === 'Reviewing'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                            }`}
                          >
                            {req.status === 'Accepted' && <CheckCircle className="h-3 w-3" />}
                            {req.status === 'Declined' && <XCircle className="h-3 w-3" />}
                            <span>{req.status}</span>
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                          <a href={`mailto:${req.email}`} className="hover:underline text-sky-400">
                            {req.email}
                          </a>
                          {req.handle && (
                            <span className="font-mono text-slate-400">
                              Tag: {req.handle}
                            </span>
                          )}
                          <span className="font-mono text-[11px] text-slate-500">
                            Received: {new Date(req.createdAt).toLocaleDateString()} {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>

                      {/* Quick Accept & Decline Actions + Status Dropdown */}
                      <div className="flex flex-wrap items-center gap-2">
                        {/* One-click Accept Button */}
                        <button
                          onClick={() => handleUpdateRequestStatus(req.id, 'Accepted')}
                          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                            req.status === 'Accepted'
                              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25 ring-2 ring-emerald-400'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white'
                          }`}
                          title="Accept this inquiry"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          <span>{req.status === 'Accepted' ? 'Accepted' : 'Accept'}</span>
                        </button>

                        {/* One-click Decline Button */}
                        <button
                          onClick={() => handleUpdateRequestStatus(req.id, 'Declined')}
                          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                            req.status === 'Declined'
                              ? 'bg-red-500 text-white shadow-md shadow-red-500/25 ring-2 ring-red-400'
                              : 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white'
                          }`}
                          title="Decline this inquiry"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          <span>{req.status === 'Declined' ? 'Declined' : 'Decline'}</span>
                        </button>

                        {/* Status Dropdown */}
                        <select
                          value={req.status}
                          onChange={(e) =>
                            handleUpdateRequestStatus(req.id, e.target.value as any)
                          }
                          className="rounded-xl border border-white/10 bg-[#161a28] px-3 py-2 text-xs font-semibold text-white outline-none focus:border-sky-500 font-mono"
                        >
                          <option value="New">● New</option>
                          <option value="Reviewing">● Reviewing</option>
                          <option value="Accepted">✓ Accepted</option>
                          <option value="Declined">✕ Declined</option>
                          <option value="In Progress">● In Progress</option>
                          <option value="Contacted">● Contacted</option>
                          <option value="Completed">● Completed</option>
                          <option value="Rejected">● Rejected</option>
                        </select>

                        {/* Email Reply */}
                        <a
                          href={`mailto:${req.email}?subject=Regarding%20Your%20Inquiry%20-%20Aurex%20Studio`}
                          className="rounded-xl border border-white/10 bg-[#161a28] px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition"
                          title="Reply via Email"
                        >
                          Reply
                        </a>

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteRequest(req.id)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition"
                          title="Delete Inquiry"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Service, Budget, Timeline details */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
                      <div className="rounded-2xl border border-white/5 bg-[#141824] p-3">
                        <span className="text-slate-500 font-mono block text-[10px] uppercase">Service Requested:</span>
                        <span className="mt-0.5 font-semibold text-white block">{req.serviceName || 'Custom Consultation'}</span>
                      </div>
                      <div className="rounded-2xl border border-white/5 bg-[#141824] p-3">
                        <span className="text-slate-500 font-mono block text-[10px] uppercase">Budget Range:</span>
                        <span className="mt-0.5 font-semibold text-white block">{req.budgetRange || 'Flexible'}</span>
                      </div>
                      <div className="rounded-2xl border border-white/5 bg-[#141824] p-3">
                        <span className="text-slate-500 font-mono block text-[10px] uppercase">Timeline:</span>
                        <span className="mt-0.5 font-semibold text-white block">{req.timeline || 'Flexible'}</span>
                      </div>
                    </div>

                    {/* Project Brief */}
                    <div className="rounded-2xl border border-white/5 bg-[#141824] p-4 text-xs text-slate-200 leading-relaxed">
                      <span className="block text-[10px] font-mono uppercase text-slate-500 mb-1">
                        Project Brief:
                      </span>
                      {req.message}
                    </div>

                    {/* Internal Notes / Follow-up field */}
                    <div className="pt-2 border-t border-white/5 flex flex-col gap-2">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span>Internal Notes & Follow-up:</span>
                        {req.internalNotes && (
                          <span className="text-[10px] text-emerald-400">Saved</span>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="Add an internal note or reason for accept/decline (press Enter or click away to save)..."
                        defaultValue={req.internalNotes || ''}
                        onBlur={(e) => {
                          if (e.target.value !== (req.internalNotes || '')) {
                            handleUpdateRequestStatus(req.id, req.status, e.target.value);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleUpdateRequestStatus(req.id, req.status, (e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).blur();
                          }
                        }}
                        className="w-full rounded-xl border border-white/10 bg-[#090b10] p-2.5 text-xs text-slate-300 placeholder:text-slate-600 outline-none focus:border-sky-500 font-mono"
                      />
                    </div>
                  </div>
                ))}

              {(!data.contactRequests ||
                data.contactRequests.filter((req) => (requestFilter === 'All' ? true : req.status === requestFilter)).length === 0) && (
                <div className="rounded-3xl border border-dashed border-white/10 p-12 text-center text-xs text-slate-500">
                  No inquiries found matching current filter &quot;{requestFilter}&quot;.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: CONTACT SECTION & INQUIRIES CMS */}
        {activeTab === 'contact' && (
          <div className="p-8 max-w-5xl space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
                    <MessageSquare className="h-3.5 w-3.5" />
                  </span>
                  <h2 className="text-2xl font-bold tracking-tight text-white">
                    Contact Section & Inquiries CMS
                  </h2>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Manage contact page headings, guarantee badges, direct Discord and Email channels, form dropdown tiers, and confirmation messaging.
                </p>
              </div>

              <button
                type="button"
                disabled={saving}
                onClick={() =>
                  saveContentChanges({
                    contactContent: data.contactContent,
                  })
                }
                className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-sky-500/25 hover:bg-sky-400 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{saving ? 'Writing Changes...' : 'Save Contact Section'}</span>
              </button>
            </div>

            {/* 1. HEADER & INTRO */}
            <div className="rounded-3xl border border-white/10 bg-[#0e111a] p-6 sm:p-8 space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-sky-400 font-mono uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span>1. Contact Heading & Intro</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                    Badge Pill Text
                  </label>
                  <input
                    type="text"
                    value={data.contactContent?.badge || 'START A PROJECT'}
                    onChange={(e) =>
                      setData({
                        ...data,
                        contactContent: {
                          ...(data.contactContent || ({} as any)),
                          badge: e.target.value,
                        },
                      })
                    }
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                    Main Title
                  </label>
                  <input
                    type="text"
                    value={data.contactContent?.title || "Let's Build Something"}
                    onChange={(e) =>
                      setData({
                        ...data,
                        contactContent: {
                          ...(data.contactContent || ({} as any)),
                          title: e.target.value,
                        },
                      })
                    }
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                  Description Paragraph
                </label>
                <textarea
                  rows={3}
                  value={data.contactContent?.description || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      contactContent: {
                        ...(data.contactContent || ({} as any)),
                        description: e.target.value,
                      },
                    })
                  }
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                  Response Time Badge / Notice
                </label>
                <input
                  type="text"
                  value={data.contactContent?.responseTimeText || 'Replies typically within 24 hours'}
                  onChange={(e) =>
                    setData({
                      ...data,
                      contactContent: {
                        ...(data.contactContent || ({} as any)),
                        responseTimeText: e.target.value,
                      },
                    })
                  }
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* 2. GUARANTEES & VALUE CARDS */}
            <div className="rounded-3xl border border-white/10 bg-[#0e111a] p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-sky-400 font-mono uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  <span>2. Value Proposition & Guarantee Cards</span>
                </h3>

                <button
                  type="button"
                  onClick={() => {
                    const newG: ContactGuarantee = {
                      id: 'g-' + Date.now(),
                      title: 'Guaranteed Scope',
                      description: 'Milestone-based delivery with regular progress updates and test builds.',
                      icon: 'CheckCircle2',
                    };
                    setData({
                      ...data,
                      contactContent: {
                        ...(data.contactContent || ({} as any)),
                        guarantees: [...(data.contactContent?.guarantees || []), newG],
                      },
                    });
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-400 hover:bg-sky-500 hover:text-white transition"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Guarantee Card</span>
                </button>
              </div>

              <div className="space-y-4">
                {(data.contactContent?.guarantees || []).map((g, idx) => (
                  <div
                    key={g.id || idx}
                    className="rounded-2xl border border-white/5 bg-[#141824] p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-slate-500 font-semibold">
                        Card #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setData({
                            ...data,
                            contactContent: {
                              ...(data.contactContent || ({} as any)),
                              guarantees: (data.contactContent?.guarantees || []).filter(
                                (_, i) => i !== idx
                              ),
                            },
                          });
                        }}
                        className="text-red-400 hover:text-red-300 p-1 rounded-lg hover:bg-red-500/10 transition"
                        title="Remove Card"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-mono uppercase text-slate-500">
                          Title
                        </label>
                        <input
                          type="text"
                          value={g.title}
                          onChange={(e) => {
                            const updated = [...(data.contactContent?.guarantees || [])];
                            updated[idx] = { ...updated[idx], title: e.target.value };
                            setData({
                              ...data,
                              contactContent: {
                                ...(data.contactContent || ({} as any)),
                                guarantees: updated,
                              },
                            });
                          }}
                          className="mt-1 w-full rounded-xl border border-white/10 bg-[#1b2030] p-2.5 text-xs text-white outline-none focus:border-sky-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase text-slate-500">
                          Icon
                        </label>
                        <select
                          value={g.icon || 'CheckCircle2'}
                          onChange={(e) => {
                            const updated = [...(data.contactContent?.guarantees || [])];
                            updated[idx] = { ...updated[idx], icon: e.target.value };
                            setData({
                              ...data,
                              contactContent: {
                                ...(data.contactContent || ({} as any)),
                                guarantees: updated,
                              },
                            });
                          }}
                          className="mt-1 w-full rounded-xl border border-white/10 bg-[#1b2030] p-2.5 text-xs text-white outline-none focus:border-sky-500"
                        >
                          <option value="CheckCircle2">CheckCircle2</option>
                          <option value="Terminal">Terminal</option>
                          <option value="ShieldCheck">ShieldCheck</option>
                          <option value="Clock">Clock</option>
                          <option value="Zap">Zap</option>
                          <option value="Sparkles">Sparkles</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase text-slate-500">
                        Description
                      </label>
                      <input
                        type="text"
                        value={g.description}
                        onChange={(e) => {
                          const updated = [...(data.contactContent?.guarantees || [])];
                          updated[idx] = { ...updated[idx], description: e.target.value };
                          setData({
                            ...data,
                            contactContent: {
                              ...(data.contactContent || ({} as any)),
                              guarantees: updated,
                            },
                          });
                        }}
                        className="mt-1 w-full rounded-xl border border-white/10 bg-[#1b2030] p-2.5 text-xs text-white outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. DIRECT CHANNELS (DISCORD & EMAIL) */}
            <div className="rounded-3xl border border-white/10 bg-[#0e111a] p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-sky-400 font-mono uppercase tracking-wider flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>3. Direct Communication Channels</span>
                </h3>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                  Direct Email
                </label>
                <input
                  type="email"
                  value={data.contactContent?.directEmail || data.siteSettings.email || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      contactContent: {
                        ...(data.contactContent || ({} as any)),
                        directEmail: e.target.value,
                      },
                    })
                  }
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                />
              </div>

              <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-5 space-y-4">
                <div className="font-mono text-xs font-bold text-sky-400 uppercase">
                  Discord Callout Box
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                      Box Title
                    </label>
                    <input
                      type="text"
                      value={data.contactContent?.directDiscordTitle || 'Direct Discord Communication'}
                      onChange={(e) =>
                        setData({
                          ...data,
                          contactContent: {
                            ...(data.contactContent || ({} as any)),
                            directDiscordTitle: e.target.value,
                          },
                        })
                      }
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={data.contactContent?.directDiscordButtonText || 'Join Discord'}
                      onChange={(e) =>
                        setData({
                          ...data,
                          contactContent: {
                            ...(data.contactContent || ({} as any)),
                            directDiscordButtonText: e.target.value,
                          },
                        })
                      }
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                    Box Description
                  </label>
                  <input
                    type="text"
                    value={data.contactContent?.directDiscordDesc || 'Prefer instant chat over a form? Join the server or DM directly:'}
                    onChange={(e) =>
                      setData({
                        ...data,
                        contactContent: {
                          ...(data.contactContent || ({} as any)),
                          directDiscordDesc: e.target.value,
                        },
                      })
                    }
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                      Discord Handle / Username
                    </label>
                    <input
                      type="text"
                      value={data.contactContent?.directDiscordUsername || 'aurex.studio'}
                      onChange={(e) =>
                        setData({
                          ...data,
                          contactContent: {
                            ...(data.contactContent || ({} as any)),
                            directDiscordUsername: e.target.value,
                          },
                        })
                      }
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                      Discord Server / Invite URL
                    </label>
                    <input
                      type="text"
                      value={data.contactContent?.directDiscordUrl || 'https://discord.gg/aurex'}
                      onChange={(e) =>
                        setData({
                          ...data,
                          contactContent: {
                            ...(data.contactContent || ({} as any)),
                            directDiscordUrl: e.target.value,
                          },
                        })
                      }
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 4. FORM OPTIONS & DROPDOWNS */}
            <div className="rounded-3xl border border-white/10 bg-[#0e111a] p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-sky-400 font-mono uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="h-4 w-4" />
                  <span>4. Inquiry Form Dropdown Options</span>
                </h3>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                  Project Types / Services Options (Comma Separated)
                </label>
                <input
                  type="text"
                  value={(data.contactContent?.servicesList || []).join(', ')}
                  onChange={(e) =>
                    setData({
                      ...data,
                      contactContent: {
                        ...(data.contactContent || ({} as any)),
                        servicesList: e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean),
                      },
                    })
                  }
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                  Budget Tiers Options (Comma Separated)
                </label>
                <input
                  type="text"
                  value={(data.contactContent?.budgetTiers || []).join(', ')}
                  onChange={(e) =>
                    setData({
                      ...data,
                      contactContent: {
                        ...(data.contactContent || ({} as any)),
                        budgetTiers: e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean),
                      },
                    })
                  }
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                  Timeline Options (Comma Separated)
                </label>
                <input
                  type="text"
                  value={(data.contactContent?.timelineOptions || []).join(', ')}
                  onChange={(e) =>
                    setData({
                      ...data,
                      contactContent: {
                        ...(data.contactContent || ({} as any)),
                        timelineOptions: e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean),
                      },
                    })
                  }
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* 5. SUCCESS CONFIRMATION COPY */}
            <div className="rounded-3xl border border-white/10 bg-[#0e111a] p-6 sm:p-8 space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-sky-400 font-mono uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>5. Form Submission Success Screen</span>
                </h3>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                  Success Heading
                </label>
                <input
                  type="text"
                  value={data.contactContent?.formSuccessTitle || 'Inquiry Received!'}
                  onChange={(e) =>
                    setData({
                      ...data,
                      contactContent: {
                        ...(data.contactContent || ({} as any)),
                        formSuccessTitle: e.target.value,
                      },
                    })
                  }
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                  Success Description Message
                </label>
                <textarea
                  rows={2}
                  value={data.contactContent?.formSuccessMessage || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      contactContent: {
                        ...(data.contactContent || ({} as any)),
                        formSuccessMessage: e.target.value,
                      },
                    })
                  }
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* Bottom Save Bar */}
            <div className="flex justify-end pt-4">
              <button
                type="button"
                disabled={saving}
                onClick={() =>
                  saveContentChanges({
                    contactContent: data.contactContent,
                  })
                }
                className="flex items-center gap-2 rounded-xl bg-sky-500 px-8 py-3.5 text-xs font-semibold text-white shadow-lg shadow-sky-500/25 hover:bg-sky-400 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{saving ? 'Saving to Database...' : 'Save Contact Section to Database'}</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 7: FAQ MANAGER */}
        {activeTab === 'faqs' && (
          <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">FAQ Manager</h2>
                <p className="mt-1 text-xs text-slate-400">
                  Add, edit, and organize frequently asked questions.
                </p>
              </div>

              {!editingFaq && (
                <button
                  onClick={() => {
                    setIsNewFaq(true);
                    setEditingFaq({
                      id: 'faq-' + Date.now(),
                      question: 'New Question?',
                      answer: 'Detailed explanation.',
                      category: 'General',
                      isVisible: true,
                      order: (data.faqs?.length || 0) + 1,
                    });
                  }}
                  className="flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-400"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add FAQ</span>
                </button>
              )}
            </div>

            {editingFaq ? (
              <div className="rounded-3xl border border-white/10 bg-[#0e111a] p-8 space-y-4 max-w-2xl">
                <h3 className="font-bold text-white text-base">
                  {isNewFaq ? 'Create FAQ' : 'Edit FAQ'}
                </h3>
                <div>
                  <label className="text-xs text-slate-400 font-mono">Category</label>
                  <input
                    type="text"
                    value={editingFaq.category}
                    onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-mono">Question</label>
                  <input
                    type="text"
                    value={editingFaq.question}
                    onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-mono">Answer</label>
                  <textarea
                    rows={4}
                    value={editingFaq.answer}
                    onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white mt-1"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-3">
                  <button
                    onClick={() => setEditingFaq(null)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      const method = isNewFaq ? 'POST' : 'PUT';
                      await fetch('/api/admin/faqs', {
                        method,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(editingFaq),
                      });
                      if (isNewFaq) {
                        setData((prev) => ({ ...prev, faqs: [...prev.faqs, editingFaq] }));
                      } else {
                        setData((prev) => ({
                          ...prev,
                          faqs: prev.faqs.map((f) => (f.id === editingFaq.id ? editingFaq : f)),
                        }));
                      }
                      setEditingFaq(null);
                      showToast('FAQ saved');
                    }}
                    className="rounded-xl bg-sky-500 px-5 py-2.5 text-xs font-semibold text-white"
                  >
                    Save FAQ
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {data.faqs?.map((faq) => (
                  <div
                    key={faq.id}
                    className="rounded-2xl border border-white/10 bg-[#0e111a] p-5 flex items-start justify-between"
                  >
                    <div className="space-y-1 max-w-2xl">
                      <span className="font-mono text-[10px] text-sky-400 uppercase font-semibold">
                        {faq.category}
                      </span>
                      <h4 className="font-bold text-sm text-white">{faq.question}</h4>
                      <p className="text-xs text-slate-400 mt-1">{faq.answer}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setIsNewFaq(false);
                          setEditingFaq(faq);
                        }}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={async () => {
                          if (!confirm('Delete FAQ?')) return;
                          await fetch(`/api/admin/faqs?id=${faq.id}`, { method: 'DELETE' });
                          setData((prev) => ({
                            ...prev,
                            faqs: prev.faqs.filter((f) => f.id !== faq.id),
                          }));
                          showToast('FAQ deleted');
                        }}
                        className="p-1 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 8: SOCIALS & HOBBIES */}
        {activeTab === 'socials' && (
          <div className="p-8 max-w-4xl space-y-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Social Profiles & Hobbies
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Update social channels (Discord, Instagram, X, GitHub) and personal hobbies shown in the Workspace dashboard.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0e111a] p-8 space-y-6">
              <h3 className="text-base font-bold text-sky-400 font-mono">Social Platforms</h3>
              <div className="space-y-4">
                {data.socialLinks?.map((soc, idx) => (
                  <div
                    key={soc.id}
                    className="grid grid-cols-1 gap-4 sm:grid-cols-3 rounded-2xl border border-white/5 bg-[#141824] p-4"
                  >
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-mono">Platform</label>
                      <input
                        type="text"
                        value={soc.platform}
                        onChange={(e) => {
                          const updated = [...data.socialLinks];
                          updated[idx].platform = e.target.value;
                          setData({ ...data, socialLinks: updated });
                        }}
                        className="w-full rounded-lg border border-white/10 bg-[#181c2c] p-2 text-xs text-white mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-mono">Username</label>
                      <input
                        type="text"
                        value={soc.username}
                        onChange={(e) => {
                          const updated = [...data.socialLinks];
                          updated[idx].username = e.target.value;
                          setData({ ...data, socialLinks: updated });
                        }}
                        className="w-full rounded-lg border border-white/10 bg-[#181c2c] p-2 text-xs text-white mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-mono">Target URL</label>
                      <input
                        type="text"
                        value={soc.url}
                        onChange={(e) => {
                          const updated = [...data.socialLinks];
                          updated[idx].url = e.target.value;
                          setData({ ...data, socialLinks: updated });
                        }}
                        className="w-full rounded-lg border border-white/10 bg-[#181c2c] p-2 text-xs text-white mt-1"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => saveContentChanges({ socialLinks: data.socialLinks })}
                  className="rounded-xl bg-sky-500 px-6 py-2.5 text-xs font-semibold text-white hover:bg-sky-400"
                >
                  Save Socials
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: MEDIA MANAGER (Requirement #46) */}
        {activeTab === 'media' && (
          <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">Media Manager</h2>
                <p className="mt-1 text-xs text-slate-400">
                  Upload images, videos, posters, and assets directly to the server.
                </p>
              </div>

              <label className="flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-xs font-semibold text-white hover:bg-sky-400 cursor-pointer">
                <Upload className="h-4 w-4" />
                <span>{uploadingMedia ? 'Uploading...' : 'Upload File'}</span>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleMediaUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {data.media?.map((m) => (
                <div
                  key={m.id}
                  className="rounded-2xl border border-white/10 bg-[#0e111a] overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative aspect-video bg-[#141824] flex items-center justify-center overflow-hidden">
                    {m.category === 'video' ? (
                      <video src={m.url} className="h-full w-full object-cover" controls={false} />
                    ) : (
                      <img src={m.url} alt={m.filename} className="h-full w-full object-cover" />
                    )}
                    <span className="absolute top-2 left-2 rounded bg-black/70 px-2 py-0.5 text-[10px] font-mono text-white">
                      {m.category}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <p className="text-xs font-bold text-white truncate" title={m.originalName}>
                      {m.originalName}
                    </p>
                    <p className="font-mono text-[10px] text-slate-400 truncate">{m.url}</p>

                    <div className="pt-2 flex items-center justify-between border-t border-white/5">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(m.url);
                          setCopiedUrl(m.id);
                          setTimeout(() => setCopiedUrl(null), 2000);
                        }}
                        className="flex items-center gap-1 text-[11px] font-semibold text-sky-400 hover:text-sky-300"
                      >
                        {copiedUrl === m.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        <span>{copiedUrl === m.id ? 'Copied' : 'Copy URL'}</span>
                      </button>

                      <button
                        onClick={() => handleDeleteMedia(m.id)}
                        className="text-red-400 hover:text-red-300 p-1"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 10: ANALYTICS & TELEMETRY (Requirement #53) */}
        {activeTab === 'analytics' && (
          <div className="p-8 space-y-8 max-w-4xl">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Visitor Telemetry & Analytics
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Session-aware tracking adhering to anti-inflation visitor logic.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-[#0e111a] p-4 text-center">
                <span className="text-xs text-slate-400">Total Visits</span>
                <div className="font-mono text-2xl font-bold text-white mt-1">
                  {data.visitorMetrics.totalVisitors}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0e111a] p-4 text-center">
                <span className="text-xs text-slate-400">Today</span>
                <div className="font-mono text-2xl font-bold text-sky-400 mt-1">
                  {data.visitorMetrics.todayVisitors}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0e111a] p-4 text-center">
                <span className="text-xs text-slate-400">This Week</span>
                <div className="font-mono text-2xl font-bold text-indigo-400 mt-1">
                  {data.visitorMetrics.thisWeekVisitors}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0e111a] p-4 text-center">
                <span className="text-xs text-slate-400">Active Online</span>
                <div className="font-mono text-2xl font-bold text-emerald-400 mt-1">
                  {data.visitorMetrics.activeVisitors}
                </div>
              </div>
            </div>

            {/* Popular Pages & Service Interest */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-[#0e111a] p-6 space-y-4">
                <h3 className="font-bold text-sm text-white">Popular Pages (Hits)</h3>
                <div className="space-y-2">
                  {Object.entries(data.visitorMetrics.pageViews || {}).map(([path, hits]) => (
                    <div
                      key={path}
                      className="flex items-center justify-between text-xs py-1.5 border-b border-white/5"
                    >
                      <span className="font-mono text-slate-300">{path}</span>
                      <span className="font-mono font-bold text-sky-400">{hits}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#0e111a] p-6 space-y-4">
                <h3 className="font-bold text-sm text-white">Service Interest Breakdown</h3>
                <div className="space-y-2">
                  {Object.entries(data.visitorMetrics.serviceInterest || {}).map(([serv, count]) => (
                    <div
                      key={serv}
                      className="flex items-center justify-between text-xs py-1.5 border-b border-white/5"
                    >
                      <span className="text-slate-300">{serv}</span>
                      <span className="font-mono font-bold text-emerald-400">{count} inquiries</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 11: SETTINGS & BRANDING (Requirement #47 & #56) */}
        {activeTab === 'settings' && (
          <div className="p-8 max-w-4xl space-y-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Branding & SEO Settings
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Manage website favicon, brand logos, site metadata, and availability settings.
              </p>
            </div>

            {/* BRAND ASSETS: FAVICON & SYSTEM LOGOS (Dedicated Upload System) */}
            <div className="rounded-3xl border border-sky-500/25 bg-gradient-to-br from-sky-500/10 via-[#0e111a] to-[#0e111a] p-8 space-y-6 shadow-xl">
              <div className="border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-sky-400" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-sky-400">
                    BRAND ASSETS & SYSTEM MEDIA
                  </span>
                </div>
                <h3 className="mt-1 text-lg font-bold text-white">
                  Favicon & System Logo Upload
                </h3>
                <p className="mt-0.5 text-xs text-slate-400">
                  Upload your browser tab icon and website logos. Uploaded files automatically update and apply across the entire site immediately.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* 1. Favicon Card */}
                <div className="rounded-2xl border border-white/10 bg-[#141824]/60 p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="block text-xs font-mono font-bold uppercase text-slate-300">
                        Browser Favicon *
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Tab icon (ICO, PNG, SVG, WebP)
                      </span>
                    </div>
                    {/* Favicon Preview */}
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-[#090b10] p-2 shadow-inner shrink-0">
                      {data.siteSettings.faviconUrl ? (
                        <img
                          src={data.siteSettings.faviconUrl}
                          alt="Favicon Preview"
                          className="h-8 w-8 object-contain"
                        />
                      ) : (
                        <span className="text-[10px] text-slate-500 font-mono">No Icon</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-sky-500/20 hover:bg-sky-400 transition">
                      <Upload className="h-3.5 w-3.5" />
                      <span>{uploadingFavicon ? 'Uploading...' : 'Upload Favicon'}</span>
                      <input
                        type="file"
                        accept="image/*,.ico"
                        disabled={uploadingFavicon}
                        onChange={(e) => handleSiteAssetUpload(e, 'faviconUrl')}
                        className="hidden"
                      />
                    </label>
                    {data.siteSettings.faviconUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = { ...data.siteSettings, faviconUrl: '' };
                          setData({ ...data, siteSettings: updated });
                          saveContentChanges({ siteSettings: updated });
                        }}
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1">
                      Direct Favicon URL
                    </label>
                    <input
                      type="text"
                      placeholder="/favicon.ico or https://..."
                      value={data.siteSettings.faviconUrl || ''}
                      onChange={(e) =>
                        setData({
                          ...data,
                          siteSettings: { ...data.siteSettings, faviconUrl: e.target.value },
                        })
                      }
                      className="w-full rounded-xl border border-white/10 bg-[#090b10] p-2.5 text-xs text-white outline-none focus:border-sky-500 font-mono"
                    />
                  </div>
                </div>

                {/* 2. Main Logo Card */}
                <div className="rounded-2xl border border-white/10 bg-[#141824]/60 p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="block text-xs font-mono font-bold uppercase text-slate-300">
                        Main Website Logo *
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Navbar & Footer brand icon/logo
                      </span>
                    </div>
                    {/* Main Logo Preview */}
                    <div className="relative flex h-14 w-24 items-center justify-center rounded-2xl border border-white/10 bg-[#090b10] p-2 shadow-inner shrink-0">
                      {data.siteSettings.logoUrl ? (
                        <img
                          src={data.siteSettings.logoUrl}
                          alt="Logo Preview"
                          className="max-h-9 max-w-full object-contain"
                        />
                      ) : (
                        <span className="text-[10px] text-slate-500 font-mono">No Logo</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-400 transition">
                      <Upload className="h-3.5 w-3.5" />
                      <span>{uploadingLogo ? 'Uploading...' : 'Upload Logo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingLogo}
                        onChange={(e) => handleSiteAssetUpload(e, 'logoUrl')}
                        className="hidden"
                      />
                    </label>
                    {data.siteSettings.logoUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = { ...data.siteSettings, logoUrl: '' };
                          setData({ ...data, siteSettings: updated });
                          saveContentChanges({ siteSettings: updated });
                        }}
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1">
                      Direct Logo URL
                    </label>
                    <input
                      type="text"
                      placeholder="/media/logo.svg or https://..."
                      value={data.siteSettings.logoUrl || ''}
                      onChange={(e) =>
                        setData({
                          ...data,
                          siteSettings: { ...data.siteSettings, logoUrl: e.target.value },
                        })
                      }
                      className="w-full rounded-xl border border-white/10 bg-[#090b10] p-2.5 text-xs text-white outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>

                {/* 3. Light Theme Logo */}
                <div className="rounded-2xl border border-white/10 bg-[#141824]/40 p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="block text-xs font-mono font-bold uppercase text-slate-300">
                        Light Theme Logo (Optional)
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Shown when user selects Light Mode
                      </span>
                    </div>
                    {/* Light Logo Preview (on white container) */}
                    <div className="relative flex h-14 w-24 items-center justify-center rounded-2xl border border-slate-300 bg-white p-2 shadow-sm shrink-0">
                      {data.siteSettings.lightLogoUrl ? (
                        <img
                          src={data.siteSettings.lightLogoUrl}
                          alt="Light Logo"
                          className="max-h-9 max-w-full object-contain"
                        />
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono">Default</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white/10 border border-white/15 px-3.5 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/20 transition">
                      <Upload className="h-3 w-3" />
                      <span>{uploadingLightLogo ? 'Uploading...' : 'Upload Light Logo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingLightLogo}
                        onChange={(e) => handleSiteAssetUpload(e, 'lightLogoUrl')}
                        className="hidden"
                      />
                    </label>
                    {data.siteSettings.lightLogoUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = { ...data.siteSettings, lightLogoUrl: '' };
                          setData({ ...data, siteSettings: updated });
                          saveContentChanges({ siteSettings: updated });
                        }}
                        className="text-xs text-red-400 hover:underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Light mode logo URL"
                      value={data.siteSettings.lightLogoUrl || ''}
                      onChange={(e) =>
                        setData({
                          ...data,
                          siteSettings: { ...data.siteSettings, lightLogoUrl: e.target.value },
                        })
                      }
                      className="w-full rounded-xl border border-white/10 bg-[#090b10] p-2 text-xs text-white outline-none focus:border-sky-500 font-mono"
                    />
                  </div>
                </div>

                {/* 4. Dark Theme Logo */}
                <div className="rounded-2xl border border-white/10 bg-[#141824]/40 p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="block text-xs font-mono font-bold uppercase text-slate-300">
                        Dark Theme Logo (Optional)
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Shown when user selects Dark Mode
                      </span>
                    </div>
                    {/* Dark Logo Preview (on dark container) */}
                    <div className="relative flex h-14 w-24 items-center justify-center rounded-2xl border border-white/10 bg-[#07080c] p-2 shadow-sm shrink-0">
                      {data.siteSettings.darkLogoUrl ? (
                        <img
                          src={data.siteSettings.darkLogoUrl}
                          alt="Dark Logo"
                          className="max-h-9 max-w-full object-contain"
                        />
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono">Default</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white/10 border border-white/15 px-3.5 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/20 transition">
                      <Upload className="h-3 w-3" />
                      <span>{uploadingDarkLogo ? 'Uploading...' : 'Upload Dark Logo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingDarkLogo}
                        onChange={(e) => handleSiteAssetUpload(e, 'darkLogoUrl')}
                        className="hidden"
                      />
                    </label>
                    {data.siteSettings.darkLogoUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = { ...data.siteSettings, darkLogoUrl: '' };
                          setData({ ...data, siteSettings: updated });
                          saveContentChanges({ siteSettings: updated });
                        }}
                        className="text-xs text-red-400 hover:underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Dark mode logo URL"
                      value={data.siteSettings.darkLogoUrl || ''}
                      onChange={(e) =>
                        setData({
                          ...data,
                          siteSettings: { ...data.siteSettings, darkLogoUrl: e.target.value },
                        })
                      }
                      className="w-full rounded-xl border border-white/10 bg-[#090b10] p-2 text-xs text-white outline-none focus:border-sky-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* General Site & SEO Details */}
            <div className="rounded-3xl border border-white/10 bg-[#0e111a] p-8 space-y-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={data.siteSettings.siteName}
                    onChange={(e) =>
                      setData({
                        ...data,
                        siteSettings: { ...data.siteSettings, siteName: e.target.value },
                      })
                    }
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                    Brand Tagline
                  </label>
                  <input
                    type="text"
                    value={data.siteSettings.tagline}
                    onChange={(e) =>
                      setData({
                        ...data,
                        siteSettings: { ...data.siteSettings, tagline: e.target.value },
                      })
                    }
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                  Availability Subtitle Text
                </label>
                <input
                  type="text"
                  value={data.siteSettings.availabilityText}
                  onChange={(e) =>
                    setData({
                      ...data,
                      siteSettings: { ...data.siteSettings, availabilityText: e.target.value },
                    })
                  }
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                    SEO Meta Title
                  </label>
                  <input
                    type="text"
                    value={data.siteSettings.metaTitle}
                    onChange={(e) =>
                      setData({
                        ...data,
                        siteSettings: { ...data.siteSettings, metaTitle: e.target.value },
                      })
                    }
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={data.siteSettings.email}
                    onChange={(e) =>
                      setData({
                        ...data,
                        siteSettings: { ...data.siteSettings, email: e.target.value },
                      })
                    }
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-slate-400">
                  SEO Meta Description
                </label>
                <textarea
                  rows={2}
                  value={data.siteSettings.metaDescription}
                  onChange={(e) =>
                    setData({
                      ...data,
                      siteSettings: { ...data.siteSettings, metaDescription: e.target.value },
                    })
                  }
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141824] p-3 text-xs text-white"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => saveContentChanges({ siteSettings: data.siteSettings })}
                  className="rounded-xl bg-sky-500 px-6 py-2.5 text-xs font-semibold text-white hover:bg-sky-400"
                >
                  Save Settings & SEO
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 12: VERSION SAFETY & REVISIONS (Requirement #51) */}
        {activeTab === 'revisions' && (
          <div className="p-8 max-w-4xl space-y-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Version Safety & Revisions
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Every administrative commit generates a safe snapshot backup in &apos;data/revisions/&apos;. You can roll back anytime.
              </p>
            </div>

            <div className="space-y-3">
              {revisions.map((rev) => (
                <div
                  key={rev.filename}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0e111a] p-4 text-xs"
                >
                  <div className="space-y-1">
                    <span className="font-mono font-bold text-white">
                      Snapshot Version {rev.version}
                    </span>
                    <span className="text-slate-500 block font-mono text-[11px]">
                      {rev.filename} • {new Date(rev.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => handleRollback(rev.filename)}
                    className="rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-2 text-xs font-semibold text-sky-400 hover:bg-sky-500 hover:text-white transition"
                  >
                    Restore This Snapshot
                  </button>
                </div>
              ))}

              {revisions.length === 0 && (
                <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-xs text-slate-500">
                  No previous backup snapshots recorded yet.
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
