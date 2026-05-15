import { Timestamp } from 'firebase/firestore';

export interface AuthorizedUser {
  email: string;
  role: 'superadmin';
  addedAt: Timestamp;
  uid?: string;
}

export interface AdminSession {
  id: string;
  email: string;
  ip: string;
  browser: string;
  country: string;
  timestamp: Timestamp;
  isActive: boolean;
}

export interface AdminSettings {
  displayName: string;
  profilePhotoUrl: string;
  dashboardTheme: 'dark' | 'darker' | 'midnight-blue';
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export interface NotificationItem {
  id: string;
  type: 'contact' | 'analytics' | 'security';
  title: string;
  message: string;
  timestamp: Timestamp;
  isRead: boolean;
}
