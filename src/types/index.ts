export interface SiteSettings {
  siteName: string;
  tagline: string;
  logoUrl: string;
  lightLogoUrl: string;
  darkLogoUrl: string;
  faviconUrl: string;
  metaTitle: string;
  metaDescription: string;
  ogImageUrl: string;
  email: string;
  location: string;
  availability: 'available' | 'limited' | 'unavailable';
  availabilityText: string;
  draftModeEnabled: boolean;
}

export interface HeroContent {
  title: string;
  subtitle: string;
  statement: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  backgroundMode: 'video' | 'image';
  videoUrl: string;
  imageUrl: string;
  videoFallbackUrl: string;
  showLiveVisitors: boolean;
  showFeedbackButton: boolean;
  statsBadgeText: string;
}

export interface CurrentlyBuilding {
  title: string;
  subtitle: string;
  tags: string[];
  progress: number;
  statusText: string;
  link?: string;
}

export interface WorkspaceDashboard {
  title: string;
  badge: string;
  aboutBio: string;
  developerPhilosophy: string;
  currentlyBuilding: CurrentlyBuilding;
  experienceYears: string;
  completedProjectsCount: string;
  happyClientsCount: string;
  codeLinesCount: string;
  mediaUrl: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  username: string;
  url: string;
  icon: string;
  isVisible: boolean;
  order: number;
}

export interface Hobby {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: string;
  order: number;
}

export interface SkillCategory {
  id: string;
  category: string;
  skills: { name: string; level: string; icon?: string }[];
}

export interface ServiceSection {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  type: 'custom' | 'capabilities' | 'features' | 'process' | 'hosting_panels';
  items?: { title: string; description: string; icon?: string }[];
  order: number;
  isVisible: boolean;
}

export interface ServicePlan {
  id: string;
  name: string;
  price: string;
  period?: string;
  currency: string;
  description: string;
  features: string[];
  ctaText: string;
  isFeatured: boolean;
  order: number;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  icon: string;
  bannerImage: string;
  heroIntro: string;
  startingPrice: string;
  featuredProjectIds: string[]; // 2-3 project IDs displayed at top
  sections: ServiceSection[];
  plans: ServicePlan[];
  isPublished: boolean;
  order: number;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: 'Web' | 'Minecraft' | 'Discord' | 'Bots' | 'Other';
  shortDescription: string;
  fullDescription: string;
  technologies: string[];
  status: 'Completed' | 'In Progress' | 'Live';
  liveUrl?: string;
  githubUrl?: string;
  coverImage: string;
  galleryImages: string[];
  challenges?: string;
  results?: string;
  isFeatured: boolean;
  order: number;
}

export interface FeedbackItem {
  id: string;
  name: string;
  role?: string;
  rating: number; // 1 to 5
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  isFeatured: boolean;
  createdAt: string;
}

export interface ContactRequest {
  id: string;
  name: string;
  email: string;
  handle?: string; // Discord / X
  serviceId?: string;
  serviceName?: string;
  budgetRange: string;
  timeline: string;
  message: string;
  status: 'New' | 'Reviewing' | 'Contacted' | 'In Progress' | 'Accepted' | 'Declined' | 'Completed' | 'Rejected';
  internalNotes?: string;
  createdAt: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  isVisible: boolean;
  order: number;
}

export interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  category: 'image' | 'video' | 'logo' | 'other';
  uploadedAt: string;
}

export interface VisitorMetrics {
  totalVisitors: number;
  todayVisitors: number;
  thisWeekVisitors: number;
  thisMonthVisitors: number;
  activeVisitors: number;
  pageViews: Record<string, number>;
  serviceInterest: Record<string, number>;
  lastUpdated: string;
}

export interface DeveloperSkill {
  name: string;
  level: string; // 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
}

export interface DeveloperSocial {
  platform: string;
  username: string;
  url: string;
}

export interface Developer {
  id: string;
  name: string;
  username: string; // slug for url /dashboard/developers/[username]
  role: string;
  shortBio: string;
  fullBio: string;
  profileImage: string;
  coverImage?: string;
  experience: string;
  availability: 'Available' | 'Busy' | 'Working' | 'Away' | 'Unavailable';
  customStatus?: string;
  skills: DeveloperSkill[];
  specializations: string[];
  technologies: string[];
  projectIds: string[]; // Associated project IDs
  socials: DeveloperSocial[];
  isFeatured: boolean;
  isVisible: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface DatabaseSchema {
  siteSettings: SiteSettings;
  heroContent: HeroContent;
  workspaceDashboard: WorkspaceDashboard;
  socialLinks: SocialLink[];
  hobbies: Hobby[];
  skillCategories: SkillCategory[];
  services: Service[];
  projects: Project[];
  feedback: FeedbackItem[];
  contactRequests: ContactRequest[];
  faqs: FaqItem[];
  media: MediaItem[];
  visitorMetrics: VisitorMetrics;
  sessions: { sessionId: string; ipHash: string; lastSeen: number; createdAt: number }[];
  developers: Developer[];
  version: number;
  updatedAt: string;
}
