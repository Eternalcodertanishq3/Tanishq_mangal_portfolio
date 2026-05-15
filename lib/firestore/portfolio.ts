import { db } from '../firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  writeBatch,
  serverTimestamp,
  Timestamp,
  onSnapshot,
  type DocumentData,
  type QuerySnapshot,
} from 'firebase/firestore';
import type {
  PortfolioConfig,
  SkillCategory,
  Project,
  Experience,
  Education,
  Certification,
  SocialLink,
  ContactSubmission,
  SEOSettings,
  ContactFormSettings,
  AnalyticsSettings,
} from '@/types/portfolio';

// ===== PORTFOLIO CONFIG =====
export async function getPortfolioConfig(): Promise<PortfolioConfig | null> {
  const docRef = doc(db, 'portfolio', 'config');
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as PortfolioConfig) : null;
}

export async function updatePortfolioConfig(data: Partial<PortfolioConfig>): Promise<void> {
  const docRef = doc(db, 'portfolio', 'config');
  await setDoc(docRef, data, { merge: true });
}

export function onPortfolioConfigChange(callback: (config: PortfolioConfig | null) => void) {
  return onSnapshot(doc(db, 'portfolio', 'config'), (snap) => {
    callback(snap.exists() ? (snap.data() as PortfolioConfig) : null);
  });
}

// ===== SKILLS =====
export async function getSkills(): Promise<SkillCategory[]> {
  const q = query(collection(db, 'portfolio', 'skills', 'categories'), orderBy('sortOrder'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as SkillCategory));
}

export async function updateSkill(id: string, data: Partial<SkillCategory>): Promise<void> {
  await updateDoc(doc(db, 'portfolio', 'skills', 'categories', id), data as DocumentData);
}

export async function addSkillCategory(data: Omit<SkillCategory, 'id'>): Promise<string> {
  const ref = doc(collection(db, 'portfolio', 'skills', 'categories'));
  await setDoc(ref, data);
  return ref.id;
}

export async function deleteSkillCategory(id: string): Promise<void> {
  await deleteDoc(doc(db, 'portfolio', 'skills', 'categories', id));
}

export async function reorderSkills(items: { id: string; sortOrder: number }[]): Promise<void> {
  const batch = writeBatch(db);
  items.forEach(({ id, sortOrder }) => {
    batch.update(doc(db, 'portfolio', 'skills', 'categories', id), { sortOrder });
  });
  await batch.commit();
}

// ===== PROJECTS =====
export async function getProjects(includeDeleted = false): Promise<Project[]> {
  let q;
  if (includeDeleted) {
    q = query(collection(db, 'portfolio', 'projects', 'items'), orderBy('sortOrder'));
  } else {
    q = query(
      collection(db, 'portfolio', 'projects', 'items'),
      where('deletedAt', '==', null),
      orderBy('sortOrder')
    );
  }
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project));
}

export async function getVisibleProjects(): Promise<Project[]> {
  const q = query(
    collection(db, 'portfolio', 'projects', 'items'),
    where('deletedAt', '==', null),
    where('isVisible', '==', true),
    orderBy('sortOrder')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project));
}

export async function addProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ref = doc(collection(db, 'portfolio', 'projects', 'items'));
  await setDoc(ref, {
    ...data,
    deletedAt: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateProject(id: string, data: Partial<Project>): Promise<void> {
  await updateDoc(doc(db, 'portfolio', 'projects', 'items', id), {
    ...data,
    updatedAt: serverTimestamp(),
  } as DocumentData);
}

export async function softDeleteProject(id: string): Promise<void> {
  await updateDoc(doc(db, 'portfolio', 'projects', 'items', id), {
    deletedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function reorderProjects(items: { id: string; sortOrder: number }[]): Promise<void> {
  const batch = writeBatch(db);
  items.forEach(({ id, sortOrder }) => {
    batch.update(doc(db, 'portfolio', 'projects', 'items', id), { sortOrder, updatedAt: serverTimestamp() });
  });
  await batch.commit();
}

// ===== EXPERIENCE =====
export async function getExperiences(includeDeleted = false): Promise<Experience[]> {
  let q;
  if (includeDeleted) {
    q = query(collection(db, 'portfolio', 'experience', 'items'), orderBy('sortOrder'));
  } else {
    q = query(
      collection(db, 'portfolio', 'experience', 'items'),
      where('deletedAt', '==', null),
      orderBy('sortOrder')
    );
  }
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Experience));
}

export async function addExperience(data: Omit<Experience, 'id'>): Promise<string> {
  const ref = doc(collection(db, 'portfolio', 'experience', 'items'));
  await setDoc(ref, { ...data, deletedAt: null });
  return ref.id;
}

export async function updateExperience(id: string, data: Partial<Experience>): Promise<void> {
  await updateDoc(doc(db, 'portfolio', 'experience', 'items', id), data as DocumentData);
}

export async function softDeleteExperience(id: string): Promise<void> {
  await updateDoc(doc(db, 'portfolio', 'experience', 'items', id), {
    deletedAt: serverTimestamp(),
  });
}

// ===== EDUCATION =====
export async function getEducation(): Promise<Education | null> {
  const docSnap = await getDoc(doc(db, 'portfolio', 'education'));
  return docSnap.exists() ? (docSnap.data() as Education) : null;
}

export async function updateEducation(data: Education): Promise<void> {
  await setDoc(doc(db, 'portfolio', 'education'), data);
}

// ===== CERTIFICATIONS =====
export async function getCertifications(includeDeleted = false): Promise<Certification[]> {
  let q;
  if (includeDeleted) {
    q = query(collection(db, 'portfolio', 'certifications', 'items'), orderBy('sortOrder'));
  } else {
    q = query(
      collection(db, 'portfolio', 'certifications', 'items'),
      where('deletedAt', '==', null),
      orderBy('sortOrder')
    );
  }
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Certification));
}

export async function addCertification(data: Omit<Certification, 'id'>): Promise<string> {
  const ref = doc(collection(db, 'portfolio', 'certifications', 'items'));
  await setDoc(ref, { ...data, deletedAt: null });
  return ref.id;
}

export async function updateCertification(id: string, data: Partial<Certification>): Promise<void> {
  await updateDoc(doc(db, 'portfolio', 'certifications', 'items', id), data as DocumentData);
}

export async function softDeleteCertification(id: string): Promise<void> {
  await updateDoc(doc(db, 'portfolio', 'certifications', 'items', id), {
    deletedAt: serverTimestamp(),
  });
}

// ===== SOCIALS =====
export async function getSocials(): Promise<SocialLink[]> {
  const q = query(collection(db, 'portfolio', 'socials', 'items'), orderBy('sortOrder'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as SocialLink));
}

export async function addSocial(data: Omit<SocialLink, 'id'>): Promise<string> {
  const ref = doc(collection(db, 'portfolio', 'socials', 'items'));
  await setDoc(ref, data);
  return ref.id;
}

export async function updateSocial(id: string, data: Partial<SocialLink>): Promise<void> {
  await updateDoc(doc(db, 'portfolio', 'socials', 'items', id), data as DocumentData);
}

export async function deleteSocial(id: string): Promise<void> {
  await deleteDoc(doc(db, 'portfolio', 'socials', 'items', id));
}

// ===== CONTACTS =====
export async function getContacts(filter: 'all' | 'unread' | 'starred' | 'archived' = 'all'): Promise<ContactSubmission[]> {
  let q;
  switch (filter) {
    case 'unread':
      q = query(collection(db, 'contacts', 'submissions', 'items'), where('isRead', '==', false), orderBy('timestamp', 'desc'));
      break;
    case 'starred':
      q = query(collection(db, 'contacts', 'submissions', 'items'), where('isStarred', '==', true), orderBy('timestamp', 'desc'));
      break;
    case 'archived':
      q = query(collection(db, 'contacts', 'submissions', 'items'), where('isArchived', '==', true), orderBy('timestamp', 'desc'));
      break;
    default:
      q = query(collection(db, 'contacts', 'submissions', 'items'), where('isArchived', '==', false), orderBy('timestamp', 'desc'));
  }
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ContactSubmission));
}

export async function submitContact(data: { name: string; email: string; message: string }): Promise<string> {
  const ref = doc(collection(db, 'contacts', 'submissions', 'items'));
  await setDoc(ref, {
    ...data,
    timestamp: serverTimestamp(),
    isRead: false,
    isStarred: false,
    isArchived: false,
  });
  return ref.id;
}

export async function updateContact(id: string, data: Partial<ContactSubmission>): Promise<void> {
  await updateDoc(doc(db, 'contacts', 'submissions', 'items', id), data as DocumentData);
}

export async function deleteContact(id: string): Promise<void> {
  await deleteDoc(doc(db, 'contacts', 'submissions', 'items', id));
}

export function onContactsChange(callback: (contacts: ContactSubmission[]) => void) {
  const q = query(collection(db, 'contacts', 'submissions', 'items'), orderBy('timestamp', 'desc'));
  return onSnapshot(q, (snap: QuerySnapshot) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ContactSubmission)));
  });
}

export async function getUnreadCount(): Promise<number> {
  const q = query(
    collection(db, 'contacts', 'submissions', 'items'),
    where('isRead', '==', false),
    where('isArchived', '==', false)
  );
  const snap = await getDocs(q);
  return snap.size;
}

// ===== SEO SETTINGS =====
export async function getSEOSettings(): Promise<SEOSettings | null> {
  const docSnap = await getDoc(doc(db, 'portfolio', 'seo'));
  return docSnap.exists() ? (docSnap.data() as SEOSettings) : null;
}

export async function updateSEOSettings(data: Partial<SEOSettings>): Promise<void> {
  await setDoc(doc(db, 'portfolio', 'seo'), data, { merge: true });
}

// ===== CONTACT FORM SETTINGS =====
export async function getContactFormSettings(): Promise<ContactFormSettings | null> {
  const docSnap = await getDoc(doc(db, 'portfolio', 'contactFormSettings'));
  return docSnap.exists() ? (docSnap.data() as ContactFormSettings) : null;
}

export async function updateContactFormSettings(data: Partial<ContactFormSettings>): Promise<void> {
  await setDoc(doc(db, 'portfolio', 'contactFormSettings'), data, { merge: true });
}

// ===== ANALYTICS SETTINGS =====
export async function getAnalyticsSettings(): Promise<AnalyticsSettings | null> {
  const docSnap = await getDoc(doc(db, 'portfolio', 'analyticsSettings'));
  return docSnap.exists() ? (docSnap.data() as AnalyticsSettings) : null;
}

export async function updateAnalyticsSettings(data: Partial<AnalyticsSettings>): Promise<void> {
  await setDoc(doc(db, 'portfolio', 'analyticsSettings'), data, { merge: true });
}

// ===== SEED DATA =====
export async function seedInitialData(): Promise<void> {
  const batch = writeBatch(db);

  // Portfolio Config
  batch.set(doc(db, 'portfolio', 'config'), {
    aboutText: "High-performance Full Stack Developer and AI Engineer with expertise in building scalable distributed systems, offline-first mobile architectures, and privacy-preserving AI. Proven track record of reducing API latency by 63% and deploying enterprise-grade security.",
    typewriterRoles: ['Creative Technologist', 'Full Stack Developer', 'AI Engineer'],
    primaryColor: '#ff9a24',
    secondaryColor: '#00ffff'
  });

  // Skills
  const skills = [
    { name: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'GSAP', 'Three.js'], sortOrder: 0 },
    { name: 'Backend', items: ['Node.js', 'Express', 'Firebase', 'PostgreSQL', 'Prisma', 'GraphQL'], sortOrder: 1 },
    { name: 'Mobile', items: ['React Native', 'Flutter', 'Expo', 'SwiftUI'], sortOrder: 2 },
    { name: 'Tools', items: ['Git', 'Docker', 'AWS', 'Figma', 'Postman', 'Vercel'], sortOrder: 3 }
  ];
  skills.forEach(skill => {
    const ref = doc(collection(db, 'portfolio', 'skills', 'categories'));
    batch.set(ref, skill);
  });

  // Projects
  const projects = [
    { 
      title: 'Aether Browser', 
      subtitle: 'Next-gen Privacy Browser', 
      technologies: ['C++', 'Qt', 'Chromium'], 
      description: 'A privacy-focused web browser built for speed and security.', 
      liveUrl: '#', 
      sourceUrl: '#', 
      isFeatured: true, 
      isVisible: true,
      sortOrder: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      deletedAt: null
    },
    { 
      title: 'NicheSphere', 
      subtitle: 'Event Discovery Platform', 
      technologies: ['Flutter', 'Firebase', 'Dart'], 
      description: 'Find local niche events based on your specific interests.', 
      liveUrl: '#', 
      sourceUrl: '#', 
      isFeatured: true, 
      isVisible: true,
      sortOrder: 1,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      deletedAt: null
    }
  ];
  projects.forEach(project => {
    const ref = doc(collection(db, 'portfolio', 'projects', 'items'));
    batch.set(ref, project);
  });

  // Socials
  const socials = [
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/tanishq-mangal-7a2683254', icon: 'linkedin', isVisible: true, sortOrder: 0 },
    { platform: 'GitHub', url: 'https://github.com/Eternalcodertanishq3', icon: 'github', isVisible: true, sortOrder: 1 },
    { platform: 'Twitter', url: 'https://twitter.com/tanishq_mangal', icon: 'twitter', isVisible: true, sortOrder: 2 }
  ];
  socials.forEach(social => {
    const ref = doc(collection(db, 'portfolio', 'socials', 'items'));
    batch.set(ref, social);
  });

  await batch.commit();
}
