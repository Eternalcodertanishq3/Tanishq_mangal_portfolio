import { Timestamp } from 'firebase/firestore';

export interface PageView {
  id?: string;
  sessionId: string;
  path: string;
  referrer: string;
  userAgent: string;
  country: string;
  city: string;
  deviceType: 'mobile' | 'desktop' | 'tablet';
  browser: string;
  os: string;
  timestamp: Timestamp;
}

export interface SectionView {
  id?: string;
  sessionId: string;
  section: string;
  timeSpentSeconds: number;
  timestamp: Timestamp;
}

export interface DailyAggregate {
  id?: string;
  date: string; // YYYY-MM-DD
  totalViews: number;
  uniqueSessions: number;
  deviceBreakdown: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  topSections: Record<string, number>;
  countries: Record<string, number>;
  browsers: Record<string, number>;
  referrers: Record<string, number>;
}

export interface KPIData {
  totalVisitors: number;
  todayVisitors: number;
  weekVisitors: number;
  uniqueCountries: number;
  unreadMessages: number;
  avgSessionTime: number;
  totalVisitorsChange: number;
  todayVisitorsChange: number;
  weekVisitorsChange: number;
  topCountry: string;
  newMessagesToday: number;
}

export type TimeRange = '7D' | '30D' | '90D' | 'ALL';
