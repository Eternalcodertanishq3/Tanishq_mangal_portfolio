import { Timestamp } from 'firebase/firestore';

export interface PortfolioConfig {
  heroTitle: string;
  heroSubtitle: string;
  typewriterRoles: string[];
  aboutText: string;
  ctaButtonLabel: string;
  resumeUrl: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  // Theme settings
  primaryGlow: string;
  secondaryGlow: string;
  bgColor: string;
  textPrimary: string;
  textSecondary: string;
  // Black hole settings
  bloomIntensity: number;
  diskRotationSpeed: number;
  jetOpacity: number;
  starCount: number;
  // Typography
  fontSizeScale: 'sm' | 'md' | 'lg' | 'xl';
  lineHeight: 'comfortable' | 'compact';
  // Custom CSS
  customCSS: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  items: string[];
  sortOrder: number;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  imageUrl2?: string;
  liveUrl: string;
  sourceUrl: string;
  sortOrder: number;
  isVisible: boolean;
  isFeatured: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  deletedAt?: Timestamp | null;
}

export interface Experience {
  id: string;
  company: string;
  location: string;
  position: string;
  duration: string;
  achievements: string[];
  companyLogoUrl?: string;
  sortOrder: number;
  isVisible: boolean;
  deletedAt?: Timestamp | null;
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  timeline: string;
  gpa?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate?: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  sortOrder: number;
  isVisible: boolean;
  deletedAt?: Timestamp | null;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  sortOrder: number;
  isVisible: boolean;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: Timestamp;
  isRead: boolean;
  isStarred: boolean;
  isArchived: boolean;
}

// SEO Settings
export interface SEOSettings {
  pageTitle: string;
  metaDescription: string;
  ogImageUrl: string;
  ogTitle: string;
  ogDescription: string;
  keywords: string;
  faviconUrl: string;
}

// Contact form settings
export interface ContactFormSettings {
  enabled: boolean;
  autoReplyMessage: string;
  notificationEmail: string;
}

// Analytics toggle
export interface AnalyticsSettings {
  enabled: boolean;
}
