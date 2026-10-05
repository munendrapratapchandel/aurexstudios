'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DatabaseSchema, Service, Project, FeedbackItem, ContactRequest, FaqItem, MediaItem, ServiceSection, ServicePlan } from '@/types';
import {
  LayoutDashboard,
  Home,
  Layers,
  FolderGit2,
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
    | 'services'
    | 'works'
    | 'feedback'
    | 'requests'
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

  // Editing state for FAQs
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [isNewFaq, setIsNewFaq] = useState(false);

  // Media upload state
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Revisions list
  const [revisions, setRevisions] = useState<any[]>([]);

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
      showToast('Request status updated!');
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
                  Professorx Works
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
              { id: 'services', label: 'Services & Plans', icon: Layers },
              { id: 'works', label: 'Works Portfolio', icon: FolderGit2 },
              { id: 'feedback', label: 'Feedback Moderation', icon: MessageSquare, badge: data.feedback?.filter((f) => f.status === 'pending').length },
              { id: 'requests', label: 'Client Inquiries', icon: Inbox, badge: data.contactRequests?.filter((r) => r.status === 'New').length },
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
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Client Inquiries & Project Requests
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Direct inquiries from the Contact form and Hire Me buttons.
              </p>
            </div>

            <div className="space-y-4">
              {data.contactRequests?.map((req) => (
                <div
                  key={req.id}
                  className="rounded-3xl border border-white/10 bg-[#0e111a] p-6 space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3">
                    <div>
                      <span className="font-bold text-base text-white">{req.name}</span>
                      <span className="text-xs text-slate-400 ml-3">
                        <a href={`mailto:${req.email}`} className="hover:underline text-sky-400">
                          {req.email}
                        </a>
                      </span>
                      {req.handle && (
                        <span className="text-xs text-slate-400 ml-3 font-mono">
                          Tag: {req.handle}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-400 font-mono">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </span>

                      {/* Status Selector */}
                      <select
                        value={req.status}
                        onChange={(e) =>
                          handleUpdateRequestStatus(req.id, e.target.value as any)
                        }
                        className="rounded-xl border border-white/10 bg-[#161a28] px-3 py-1.5 text-xs font-semibold text-white outline-none focus:border-sky-500"
                      >
                        <option value="New">New</option>
                        <option value="Reviewing">Reviewing</option>
                        <option value="Contacted">Contacted</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Rejected">Rejected</option>
                      </select>

                      <button
                        onClick={() => handleDeleteRequest(req.id)}
                        className="text-red-400 hover:text-red-300 p-1"
                        title="Delete Inquiry"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
                    <div>
                      <span className="text-slate-500 font-mono">Service:</span>
                      <span className="ml-2 font-semibold text-white">{req.serviceName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-mono">Budget:</span>
                      <span className="ml-2 font-semibold text-white">{req.budgetRange}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-mono">Timeline:</span>
                      <span className="ml-2 font-semibold text-white">{req.timeline}</span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-[#141824] p-4 text-xs text-slate-200 leading-relaxed">
                    <span className="block text-[10px] font-mono uppercase text-slate-500 mb-1">
                      Project Brief:
                    </span>
                    {req.message}
                  </div>
                </div>
              ))}

              {(!data.contactRequests || data.contactRequests.length === 0) && (
                <div className="rounded-3xl border border-dashed border-white/10 p-12 text-center text-xs text-slate-500">
                  No project inquiries received yet.
                </div>
              )}
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
                Site metadata, logos, availability text, and draft/live mode.
              </p>
            </div>

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
