import { db } from '../firebase';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import type { PageView, SectionView, DailyAggregate } from '@/types/analytics';
import { v4 as uuidv4 } from 'uuid';

// ===== SESSION MANAGEMENT =====
function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let sessionId = sessionStorage.getItem('portfolioSessionId');
  if (!sessionId) {
    sessionId = uuidv4();
    sessionStorage.setItem('portfolioSessionId', sessionId);
  }
  return sessionId;
}

function getDeviceType(): 'mobile' | 'desktop' | 'tablet' {
  if (typeof window === 'undefined') return 'desktop';
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

function getBrowser(): string {
  if (typeof window === 'undefined') return 'unknown';
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('SamsungBrowser')) return 'Samsung';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
  if (ua.includes('Trident')) return 'IE';
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  return 'Other';
}

function getOS(): string {
  if (typeof window === 'undefined') return 'unknown';
  const ua = navigator.userAgent;
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Mac')) return 'macOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  return 'Other';
}

interface GeoData {
  country: string;
  city: string;
}

async function getGeoData(): Promise<GeoData> {
  if (typeof window === 'undefined') return { country: 'Unknown', city: 'Unknown' };

  const cached = sessionStorage.getItem('portfolioGeoData');
  if (cached) return JSON.parse(cached);

  try {
    const res = await fetch('http://ip-api.com/json/?fields=country,city');
    const data = await res.json();
    const geoData = { country: data.country || 'Unknown', city: data.city || 'Unknown' };
    sessionStorage.setItem('portfolioGeoData', JSON.stringify(geoData));
    return geoData;
  } catch {
    return { country: 'Unknown', city: 'Unknown' };
  }
}

// ===== TRACK PAGE VIEW =====
export async function trackPageView(path: string = '/'): Promise<void> {
  try {
    const sessionId = getSessionId();
    const geo = await getGeoData();
    const ref = doc(collection(db, 'analytics', 'pageviews', 'items'));
    await setDoc(ref, {
      sessionId,
      path,
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      country: geo.country,
      city: geo.city,
      deviceType: getDeviceType(),
      browser: getBrowser(),
      os: getOS(),
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    console.warn('Analytics tracking error:', err);
  }
}

// ===== TRACK SECTION VIEW =====
export async function trackSectionView(section: string, timeSpentSeconds: number): Promise<void> {
  try {
    const sessionId = getSessionId();
    const ref = doc(collection(db, 'analytics', 'sectionViews', 'items'));
    await setDoc(ref, {
      sessionId,
      section,
      timeSpentSeconds,
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    console.warn('Section tracking error:', err);
  }
}

// ===== ADMIN: READ ANALYTICS =====
export async function getPageViews(limitCount: number = 100): Promise<PageView[]> {
  const q = query(
    collection(db, 'analytics', 'pageviews', 'items'),
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as PageView));
}

export async function getRecentPageViews(count: number = 20): Promise<PageView[]> {
  return getPageViews(count);
}

export async function getDailyAggregates(days: number = 30): Promise<DailyAggregate[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startStr = startDate.toISOString().split('T')[0];

  const q = query(
    collection(db, 'analytics', 'dailyAggregates', 'items'),
    where('date', '>=', startStr),
    orderBy('date', 'asc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as DailyAggregate));
}

export function onPageViewsChange(callback: (views: PageView[]) => void, limitCount: number = 20) {
  const q = query(
    collection(db, 'analytics', 'pageviews', 'items'),
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as PageView)));
  });
}

export async function getLiveVisitorCount(): Promise<number> {
  const fiveMinAgo = Timestamp.fromDate(new Date(Date.now() - 5 * 60 * 1000));
  const q = query(
    collection(db, 'analytics', 'pageviews', 'items'),
    where('timestamp', '>=', fiveMinAgo)
  );
  const snap = await getDocs(q);
  const uniqueSessions = new Set(snap.docs.map((d) => d.data().sessionId));
  return uniqueSessions.size;
}

// ===== SECTION TRACKING OBSERVER =====
export function setupSectionObserver(): () => void {
  if (typeof window === 'undefined') return () => {};

  const sectionTimers: Record<string, number> = {};

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const sectionId = entry.target.id;
        if (entry.isIntersecting) {
          sectionTimers[sectionId] = Date.now();
        } else if (sectionTimers[sectionId]) {
          const timeSpent = (Date.now() - sectionTimers[sectionId]) / 1000;
          if (timeSpent > 1) {
            trackSectionView(sectionId, timeSpent);
          }
          delete sectionTimers[sectionId];
        }
      });
    },
    { threshold: 0.3 }
  );

  document.querySelectorAll('.scroll-section').forEach((section) => {
    observer.observe(section);
  });

  return () => observer.disconnect();
}
