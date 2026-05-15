# 🚀 MASTER PROMPT: Full-Stack CMS Portfolio with Firebase, Netlify & Super Admin Dashboard

> **For:** Tanishq Mangal's 3D Interactive Portfolio  
> **Stack:** Next.js 14 · Firebase · Netlify · Google Auth  
> **Version:** 2.0 — Enhanced UI/UX + Full CMS + Advanced Admin  

---

## 📌 PROJECT OVERVIEW

Transform an existing static HTML/CSS/JS portfolio website into a production-grade, full-stack CMS-powered application. The system has two completely separate surfaces:

1. **Public Portfolio Page (`/`)** — Visually upgraded version of the current site. All content is pulled dynamically from Firebase Firestore. The Three.js WebGL black hole animation, custom GLSL shaders, and GSAP scroll storytelling must be preserved with zero visual regression, and the overall UI/UX must be significantly enhanced.

2. **Super Admin Dashboard (`/admin`)** — A private, Google Sign-In protected control panel where the admin (Tanishq) can manage every piece of content on the public site, view deep analytics, manage contacts, and control the site's appearance — all without ever touching code.

The current site's core tech: Three.js (WebGL), GLSL shaders (accretion disk + relativistic jets), GSAP ScrollTrigger, Tailwind CSS. All of it must be ported exactly and built upon.

---

## 🧱 TECH STACK

| Layer | Technology | Reason |
|---|---|---|
| Frontend Framework | Next.js 14 (App Router) | SSR, API routes, performance |
| Language | TypeScript | Type safety throughout |
| Styling | Tailwind CSS + Framer Motion | Utility-first + smooth animations |
| 3D / WebGL | Three.js (ported exactly) | Core visual identity |
| Scroll Animation | GSAP + ScrollTrigger (ported exactly) | Core UX |
| Database | Firebase Firestore | Real-time, scalable NoSQL |
| Auth | Firebase Auth (Google Sign-In only) | Secure, zero-friction admin login |
| File Storage | Firebase Storage | Resume PDF, project images |
| Backend Logic | Firebase Cloud Functions (Node.js) | Contact email, analytics aggregation |
| Email | Nodemailer via Cloud Function | Contact form → admin inbox |
| Analytics | Custom (Firestore) + Firebase Analytics | Visitor tracking, section heatmaps |
| Hosting (Frontend) | Netlify | CD from GitHub, edge functions |
| Hosting (Backend) | Firebase (Functions + Firestore + Storage) | Full Google infrastructure |
| Charts | Recharts | Admin analytics visualizations |
| Drag & Drop | @dnd-kit/sortable | Reorder content in admin |
| Rich Text | TipTap Editor | Project/experience descriptions |
| Toast Notifications | react-hot-toast | Admin feedback |
| State / Data Fetching | TanStack Query (React Query) | Cache, refetch, optimistic UI |
| Icons | Lucide React | Consistent icon system |

---

## 🎨 ENHANCED PUBLIC PORTFOLIO UI/UX SPEC

> The current site is good but needs elevation. Apply every enhancement below while keeping the black hole as the centerpiece.

### Global Enhancements

- **Typography Upgrade:** Keep Space Grotesk for headings. Upgrade body font to **Outfit** (from Bunny Fonts). Add a subtle letter-spacing animation on the hero name using GSAP on load.
- **Cursor:** Replace default cursor with a custom dot cursor (small orange circle `#ff9a24`, 8px) that smoothly follows the mouse with a slight lag (lerp). On hoverable elements, the dot expands to 32px with a hollow ring style.
- **Smooth Scroll:** Replace native scroll with Lenis smooth scroll library for buttery page scrolling.
- **Page Load Sequence:** 
  1. Preloader shows with a pulsing "TM" logo and an animated progress bar (fake, 0→100% in 1.8s)
  2. Black hole fades in with a dramatic scale-up from 0.3 to 1.0
  3. Hero text animates in word by word using GSAP SplitText (or manual span splitting)
  4. Scroll hint indicator pulses at bottom of hero
- **Color Palette Enhancement:** Keep the existing variables but add:
  - `--accent-blue: #4f9eff` (for skill tags, secondary highlights)
  - `--surface-card: rgba(12, 12, 28, 0.85)` (richer card backgrounds)
  - Subtle animated gradient border on hovered content boxes (orange → blue → orange loop)
- **Noise Texture Overlay:** Add a very subtle CSS grain/noise texture (SVG filter) over the entire page to add depth. Opacity ~3%.

### Hero Section

- The name "TANISHQ MANGAL" should animate in with a **glitch effect** on initial load (brief horizontal offset flicker, ~0.3s, then stabilizes).
- Add a **typewriter effect** for the subtitle that cycles through 3 roles: `"Creative Technologist"` → `"Full Stack Developer"` → `"AI Engineer"` in a loop using a custom hook.
- Add floating particles around the hero text (separate from the background stars) — small orange sparks using a lightweight canvas overlay.
- The "Scroll to begin the journey" text should have an animated down-arrow chevron bouncing continuously.

### Content Box Enhancement

- Increase the glassmorphism effect: `backdrop-filter: blur(20px)`, stronger border with gradient: `border-image: linear-gradient(135deg, rgba(255,154,36,0.4), rgba(79,158,255,0.2)) 1`
- Add a **scan line animation** on content boxes when they enter viewport — a thin orange line sweeps from top to bottom once on entry.
- Content boxes should have a very subtle inner glow: `box-shadow: inset 0 1px 0 rgba(255,154,36,0.15), 0 20px 60px rgba(0,0,0,0.6)`

### Skills Section

- Skill tags should have a **hover ripple effect** and show a faint icon if a mapping exists (e.g., React → React logo SVG in gray behind the tag).
- Categories should have animated underlines.
- On section entry, skills should stagger-animate in from the right, one by one, with 30ms between each.

### Projects Section

- Project cards get a full redesign: add a blurred background preview of the project image behind each card (very low opacity, ~8%), revealed on hover.
- Cards have a **tilt effect** on mouse move (max ±8deg, using `perspective: 1000px` and JS mouse tracking).
- A glowing border trace animation plays on card hover (border draws itself clockwise).
- Project modal gets a **side-drawer** treatment on desktop (slides in from right, takes 50% of screen width), keeps the current modal on mobile.

### Experience & Certifications

- Replace timeline dot with a **pulsing animated ring** (concentric circles expanding outward, like a sonar ping).
- Hovering an experience card should show a subtle **company logo placeholder** (initials in a circle) on the left.

### Contact Section

- The "Get In Touch" button should have a **magnetic effect** — it pulls toward the mouse when the cursor is within 100px radius.
- Social icons should have individual **bounce-in animations** staggered on section entry.
- Add a subtle ambient glow behind the contact section (blurred orange blob, CSS radial gradient, low opacity).

### Footer

- Add a minimal footer below the contact section: copyright, a "Built with Three.js + Next.js" credit, and a back-to-top button that scrolls smoothly to hero.

### Performance Requirements

- Lighthouse score ≥ 90 on Performance, Accessibility, SEO.
- Three.js loaded via `next/dynamic` with `ssr: false`.
- All images use `next/image` with proper `width`/`height` and `loading="lazy"`.
- GSAP and Lenis initialized client-side only.
- Preconnect links for Bunny Fonts, Firebase.

---

## 🔥 FIREBASE ARCHITECTURE

### Firestore Collections

```
/portfolio
  /config          ← Single doc: hero title, subtitle, about text, resume URL, theme settings
  /skills          ← Array of { category, items[], sortOrder }
  /projects        ← Collection of project docs (see schema below)
  /experience      ← Collection of experience docs
  /education       ← Single doc
  /certifications  ← Collection of cert docs
  /socials         ← Collection of social link docs

/analytics
  /pageviews       ← Collection: { sessionId, path, referrer, country, city, device, timestamp }
  /sectionViews    ← Collection: { sessionId, section, timeSpentSeconds, timestamp }
  /dailyAggregates ← Collection: { date (YYYY-MM-DD), totalViews, uniqueSessions, deviceBreakdown{}, topSections{}, countries{} }

/contacts
  /submissions     ← Collection: { name, email, message, timestamp, isRead, isStarred, isArchived }

/admin
  /authorizedUsers ← Collection: { email, role: "superadmin", addedAt }
```

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Public read on portfolio content
    match /portfolio/{document=**} {
      allow read: if true;
      allow write: if isAuthorizedAdmin();
    }
    
    // Analytics: public write (for tracking), admin read
    match /analytics/{document=**} {
      allow create: if true;
      allow read, update, delete: if isAuthorizedAdmin();
    }
    
    // Contacts: public create only, admin full access
    match /contacts/{document=**} {
      allow create: if true;
      allow read, update, delete: if isAuthorizedAdmin();
    }
    
    // Admin collection: admin only
    match /admin/{document=**} {
      allow read, write: if isAuthorizedAdmin();
    }
    
    function isAuthorizedAdmin() {
      return request.auth != null &&
        exists(/databases/$(database)/documents/admin/authorizedUsers/$(request.auth.uid));
    }
  }
}
```

### Firebase Storage Structure

```
/resume/
  tanishq-mangal-resume.pdf    ← Public read, admin write only

/projects/
  {projectId}/
    image-1.{ext}
    image-2.{ext}

/assets/
  og-image.png
```

### Cloud Functions

```
functions/
  src/
    onContactSubmit.ts    ← Triggered on new /contacts doc → send email via Nodemailer
    aggregateAnalytics.ts ← Scheduled (every midnight) → aggregate daily stats into /analytics/dailyAggregates
    onAdminSignIn.ts      ← HTTP: verify Google ID token → check allowlist → return custom claims
    deleteAnalytics.ts    ← HTTP (admin only): clear all analytics data
```

---

## 📊 FIRESTORE DOCUMENT SCHEMAS

### Project Document

```typescript
interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;          // HTML string from TipTap
  technologies: string[];
  imageUrl: string;             // Firebase Storage URL
  imageUrl2?: string;           // Optional second image
  liveUrl: string;
  sourceUrl: string;
  sortOrder: number;
  isVisible: boolean;
  isFeatured: boolean;          // Shows "Featured" badge on card
  createdAt: Timestamp;
  updatedAt: Timestamp;
  deletedAt?: Timestamp;        // Soft delete
}
```

### Experience Document

```typescript
interface Experience {
  id: string;
  company: string;
  location: string;
  position: string;
  duration: string;
  achievements: string[];
  companyLogoUrl?: string;
  sortOrder: number;
  isVisible: boolean;
  deletedAt?: Timestamp;
}
```

### Analytics Pageview Document

```typescript
interface PageView {
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
```

---

## 🔐 AUTHENTICATION FLOW

1. Admin visits `/admin` → middleware checks Firebase session cookie → if missing, redirect to `/admin/login`
2. `/admin/login` shows a centered page with only one button: **"Sign in with Google"**
3. On Google Sign-In success: Firebase Auth returns user object → call Cloud Function `onAdminSignIn` with ID token → function checks if `user.email` is in the `admin/authorizedUsers` allowlist → if yes, set custom claim `{ role: 'superadmin' }` → if no, sign out and show "Unauthorized" error
4. On success, set a Firebase session cookie (via `firebase-admin` in a Next.js API route) with 5-day expiry
5. Middleware (`middleware.ts`) reads the session cookie on every `/admin/**` request and verifies it server-side using `firebase-admin`
6. The first authorized Google account is seeded during initial setup via a script

---

## 🎛️ SUPER ADMIN DASHBOARD — FULL SPEC

### Layout

```
┌─────────────────────────────────────────────────────────┐
│  TOPBAR: [≡ TM Admin]  [Last saved: 2 min ago]  [👁 Preview] [🔔 3] [Avatar ▾] │
├──────────┬──────────────────────────────────────────────┤
│          │                                              │
│ SIDEBAR  │            MAIN CONTENT AREA                │
│          │                                              │
│ 📊 Analytics         (changes based on nav)            │
│ ✏️  Content ▾                                          │
│   ↳ Hero & About                                       │
│   ↳ Skills                                             │
│   ↳ Projects                                           │
│   ↳ Experience                                         │
│   ↳ Education                                          │
│   ↳ Certifications                                     │
│   ↳ Socials                                            │
│ 📄 Resume                                              │
│ 📬 Inbox (3)                                           │
│ 🎨 Appearance                                          │
│ 🔧 Site Settings                                       │
│ 🔒 Security                                            │
│ ⚙️  Admin Settings                                     │
│                                                         │
└──────────┴──────────────────────────────────────────────┘
```

---

### PAGE 1: 📊 Analytics Dashboard

This is the default landing page after login. It must feel like a premium SaaS analytics tool.

#### Top KPI Cards Row (live, auto-refresh every 30s via Firestore onSnapshot)

| Card | Value | Subtext |
|---|---|---|
| 👁 Total Visitors | Unique sessions all-time | +X% vs last month |
| 📅 Today | Unique sessions today | vs yesterday |
| 📆 This Week | Unique sessions this week | vs last week |
| 🌍 Countries | Unique countries reached | Top: [country] |
| 📬 Unread Messages | Unread contact submissions | X new today |
| ⏱ Avg Session Time | Avg seconds across all sessions | — |

#### Charts Row 1

- **Line Chart (full width):** Daily unique visitors over last 30 days. Toggle buttons: 7D / 30D / 90D / All Time. Animated line drawing on load. Tooltip shows date + count.

#### Charts Row 2 (3 columns)

- **Donut Chart:** Device breakdown — Mobile / Desktop / Tablet with percentages
- **Bar Chart:** Top 6 most-viewed sections (About, Skills, Projects, etc.)
- **Donut Chart:** Top 5 browsers (Chrome, Safari, Firefox, etc.)

#### Charts Row 3 (2 columns)

- **Top Countries Table:** Rank, flag emoji, country name, visitor count, percentage bar
- **Referrers Table:** Direct, LinkedIn, GitHub, Google, Other — with counts

#### Live Visitors

- A real-time counter showing sessions active in the last 5 minutes (query `pageviews` where `timestamp > now - 5min`)
- Small live feed below it: "👤 Someone from 🇮🇳 India viewed Projects • 2s ago"

#### Recent Activity Feed

- Timeline of last 20 pageview events: timestamp, country flag, device icon, section/page

---

### PAGE 2: ✏️ Hero & About

Two-panel layout: editor on left, live preview mockup on right (updates as you type, debounced 500ms).

**Fields:**
- Hero Title (text input, max 40 chars, character counter)
- Hero Subtitle (text input, max 60 chars) — feeds the typewriter cycle
- Additional subtitles for typewriter (add up to 5 lines, drag to reorder)
- About Paragraph (TipTap rich text editor — bold, italic, links only. No headings.)
- CTA Button Label (default: "Download Resume")

**Actions:** Save Changes (saves to Firestore), Discard Changes

---

### PAGE 3: 🛠️ Skills

**Layout:** Two-panel. Left = editor, Right = live preview of skills section.

**Features:**
- List of skill categories with expand/collapse
- Each category: editable name, drag-to-reorder skills within category, add new skill (tag input), delete skill (× button)
- Drag-to-reorder categories themselves (dnd-kit)
- "Add Category" button at bottom
- Delete category with confirmation (type category name to confirm)
- "Reset to Default" button (restores original seeded data, double-confirm required)

---

### PAGE 4: 📁 Projects

**Layout:** Grid of project management cards + "Add New Project" button (top right)

**Project Management Card:**
```
┌────────────────────────────────────┐
│ [Thumbnail]  Productr              │
│              Full Stack E-commerce │
│ ● Visible  ★ Featured             │
│ [Edit] [Duplicate] [↕] [🗑]       │
└────────────────────────────────────┘
```

**Edit/Create Project — Full-Screen Drawer (slides from right)**

Fields:
- Title (text)
- Subtitle (text)
- Description (TipTap editor — full formatting: bold, italic, lists, links, code)
- Technologies (tag input — press Enter or comma to add, click × to remove, drag to reorder)
- Primary Image (drag & drop zone + click to upload → Firebase Storage → shows preview with crop option)
- Secondary Image (optional, same as above)
- Live URL (text, validated as URL)
- Source Code URL (text, validated as URL)
- Is Visible toggle
- Is Featured toggle (featured projects shown with a badge and appear first)
- Sort Order (auto-managed by drag, but manual number input also available)

**Bulk Actions:** Select multiple → Bulk Delete / Bulk Toggle Visibility

---

### PAGE 5: 💼 Experience

**Layout:** Timeline list view.

**Features:**
- Drag-to-reorder experiences
- Each item shows: position, company, duration, visibility toggle, edit/delete
- Edit drawer fields: Position, Company, Location, Duration, Achievements (dynamic list — add/remove/reorder bullet points), Company Logo URL (optional), Is Visible toggle
- "Add Experience" button
- Delete with confirmation modal

---

### PAGE 6: 🎓 Education

**Simple single-record editor:**
- Degree (text)
- Institution Name (text)
- Location (text)
- Timeline / Expected Date (text)
- GPA/Score (optional)
- Save button

---

### PAGE 7: 🏆 Certifications

- List with drag-to-reorder, visibility toggle, edit, delete
- Edit fields: Certification Name, Issuing Organization, Issue Date (date picker), Expiry Date (optional, date picker), Credential ID (optional), Credential URL (optional — shown as a badge link on public site)

---

### PAGE 8: 🔗 Socials

- List of social links
- Each: Platform Name, URL, Icon (choose from preset list: LinkedIn, GitHub, Twitter/X, Instagram, YouTube, Dev.to, Medium, LeetCode, CodeForces — each has a built-in SVG) or paste custom SVG
- Drag to reorder, visibility toggle, delete
- The public site renders socials in the order set here

---

### PAGE 9: 📄 Resume

- Shows current resume: filename, upload date, file size, "View PDF" button, "Download" button
- "Upload New Resume" — drag & drop zone — uploads to Firebase Storage at `/resume/tanishq-mangal-resume.pdf` (overwrites). Shows upload progress bar.
- Warning: "Uploading a new file will replace the current resume on the live site immediately."

---

### PAGE 10: 📬 Inbox

**Full email-client-style UI for contact form submissions.**

Left panel: list of messages (unread shown in bold, read shown normal)

Each list item shows:
- Sender name
- Email
- Message preview (first 80 chars)
- Timestamp (relative: "2h ago")
- Unread indicator dot
- Star indicator

Right panel (clicking a message):
- Full name, email, timestamp
- Full message body
- Action buttons: Mark as Read/Unread, Star/Unstar, Archive, Delete (with confirm)
- "Reply via Email" button (opens `mailto:` link pre-filled)

Top bar filters: All | Unread | Starred | Archived

Bulk actions: Select all → Mark read / Archive / Delete

Real-time: new messages appear instantly via Firestore `onSnapshot`.

Notification badge on sidebar "Inbox" item shows unread count.

---

### PAGE 11: 🎨 Appearance

**Live Theme Editor** — changes update the public site in real-time via Firestore.

Sections:
- **Colors:** Color pickers for `--primary-glow` (default `#ff9a24`), `--secondary-glow` (default `#4f46e5`), `--bg-color`, `--text-primary`, `--text-secondary`. Live preview panel on right.
- **Typography:** Font size scale (S/M/L/XL), line height toggle (comfortable/compact)
- **Black Hole Settings:** Sliders for bloom intensity (0.5 → 2.0), disk rotation speed (0.1 → 2.0), jet opacity (0 → 1.0), star count (5000 → 30000)
- **Maintenance Mode:** Toggle — when on, public site shows a beautiful "Coming Soon" full-screen page with animated black hole still running and a custom message editable here
- **Custom CSS:** CodeMirror editor for injecting custom CSS into the public site (advanced)

---

### PAGE 12: 🔧 Site Settings

- **SEO:** Page title, meta description, OG image upload, OG title, OG description, keywords
- **Open Graph / Social Sharing:** Preview mockup of how the link looks when shared on LinkedIn, Twitter, Facebook
- **Favicon:** Upload custom favicon (stored in Firebase Storage, reference in `<head>`)
- **Analytics Settings:** Toggle analytics collection on/off, reset session for testing, view raw last 10 events
- **Contact Form:** Toggle contact form on/off, custom auto-reply message (sent via Cloud Function when form submitted), notification email address

---

### PAGE 13: 🔒 Security

- **Authorized Admins:** List of Google accounts authorized to access the admin panel. Add by email, remove with confirm. (First account is seeded via script.)
- **Session Log:** Table of last 20 admin login events: timestamp, Google account, IP, browser, country.
- **Active Sessions:** List of currently active admin sessions with "Revoke" button per session.
- **Danger Zone:**
  - Clear All Analytics Data (type "DELETE ANALYTICS" to confirm)
  - Clear All Contact Submissions (type "DELETE CONTACTS" to confirm)
  - Force Sign Out All Sessions

---

### PAGE 14: ⚙️ Admin Settings

- Admin display name (shown in topbar)
- Admin profile photo (shown in topbar avatar, overrides Google photo)
- Dashboard theme: Dark (default) / Darker / Midnight Blue
- Notification preferences: email on new contact submission (toggle), browser push notifications (toggle)
- "Sign Out" button

---

## 🧭 ANALYTICS TRACKING (CLIENT-SIDE SCRIPT)

Create `/lib/analytics.ts` that is imported into the public page's root layout. On every visit:

```typescript
// On page load
1. Check sessionStorage for 'portfolioSessionId'
   - If not found: generate UUID, store it, fetch ip-api.com/json once, cache result in sessionStorage
2. Write to Firestore /analytics/pageviews:
   { sessionId, path: '/', referrer: document.referrer, country, city, deviceType, browser, os, timestamp }

// Section tracking
3. Set up IntersectionObserver on each scroll-section
   - On section enter: record startTime = Date.now()
   - On section exit: write to /analytics/sectionViews:
     { sessionId, section: sectionId, timeSpentSeconds: (Date.now()-startTime)/1000, timestamp }
```

GDPR compliance:
- No cookies used
- sessionStorage only (cleared on browser close)
- No PII stored except what user voluntarily provides in contact form
- ip-api.com used only for country/city (no account needed for less than 45 req/min)

---

## 📬 CONTACT FORM CLOUD FUNCTION

```typescript
// functions/src/onContactSubmit.ts
// Firestore onCreate trigger on /contacts/submissions/{docId}

export const onContactSubmit = functions.firestore
  .document('contacts/submissions/{docId}')
  .onCreate(async (snap) => {
    const data = snap.data();
    
    // Send email via Nodemailer (Gmail SMTP or any SMTP)
    const transporter = nodemailer.createTransport({ /* SMTP config from env */ });
    
    await transporter.sendMail({
      from: '"Portfolio Contact" <noreply@yourdomain.com>',
      to: process.env.ADMIN_EMAIL,
      subject: `New Portfolio Message from ${data.name}`,
      html: `
        <h2>New Message from Your Portfolio</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
        <hr/>
        <p><small>Received at ${data.timestamp.toDate().toISOString()}</small></p>
      `
    });
  });
```

---

## 📁 PROJECT FOLDER STRUCTURE

```
/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                    ← Public portfolio (SSR, data from Firestore)
│   │   ├── layout.tsx                  ← Includes analytics script, fonts, meta
│   │   └── maintenance/page.tsx        ← Maintenance mode page
│   │
│   ├── admin/
│   │   ├── login/page.tsx              ← Google Sign-In only
│   │   ├── layout.tsx                  ← Auth guard + sidebar layout
│   │   ├── page.tsx                    ← Analytics dashboard
│   │   ├── hero/page.tsx
│   │   ├── skills/page.tsx
│   │   ├── projects/page.tsx
│   │   ├── experience/page.tsx
│   │   ├── education/page.tsx
│   │   ├── certifications/page.tsx
│   │   ├── socials/page.tsx
│   │   ├── resume/page.tsx
│   │   ├── inbox/page.tsx
│   │   ├── appearance/page.tsx
│   │   ├── site-settings/page.tsx
│   │   ├── security/page.tsx
│   │   └── settings/page.tsx
│   │
│   └── api/
│       ├── auth/session/route.ts       ← Set/verify Firebase session cookie
│       ├── auth/logout/route.ts
│       └── analytics/aggregate/route.ts
│
├── components/
│   ├── public/
│   │   ├── BlackHoleScene.tsx          ← Three.js (dynamic, ssr:false)
│   │   ├── HeroSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── SkillsSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   ├── ExperienceSection.tsx
│   │   ├── EducationSection.tsx
│   │   ├── CertificationsSection.tsx
│   │   ├── ContactSection.tsx
│   │   ├── CustomCursor.tsx
│   │   ├── ScanLineReveal.tsx
│   │   ├── MagneticButton.tsx
│   │   ├── ProjectDrawer.tsx
│   │   └── TypewriterText.tsx
│   │
│   ├── admin/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Topbar.tsx
│   │   │   └── NotificationBell.tsx
│   │   ├── analytics/
│   │   │   ├── KPICard.tsx
│   │   │   ├── VisitorLineChart.tsx
│   │   │   ├── DeviceDonutChart.tsx
│   │   │   ├── SectionBarChart.tsx
│   │   │   ├── CountriesTable.tsx
│   │   │   └── LiveFeed.tsx
│   │   ├── content/
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── ProjectDrawer.tsx
│   │   │   ├── ExperienceCard.tsx
│   │   │   ├── SortableList.tsx        ← dnd-kit wrapper
│   │   │   └── TipTapEditor.tsx
│   │   ├── inbox/
│   │   │   ├── MessageList.tsx
│   │   │   └── MessageDetail.tsx
│   │   └── appearance/
│   │       ├── ColorPicker.tsx
│   │       └── BlackHoleControls.tsx
│   │
│   └── shared/
│       ├── Modal.tsx
│       ├── ConfirmDialog.tsx
│       ├── ImageUploader.tsx
│       ├── TagInput.tsx
│       └── LoadingSpinner.tsx
│
├── lib/
│   ├── firebase.ts                     ← Client SDK init
│   ├── firebase-admin.ts               ← Admin SDK init (server only)
│   ├── firestore/
│   │   ├── portfolio.ts                ← Read/write portfolio data
│   │   ├── analytics.ts                ← Write analytics events
│   │   └── contacts.ts                 ← Write/read contacts
│   ├── analytics.ts                    ← Client-side tracking script
│   └── utils.ts
│
├── hooks/
│   ├── useFirestore.ts
│   ├── useAnalytics.ts
│   └── useAuth.ts
│
├── types/
│   ├── portfolio.ts
│   ├── analytics.ts
│   └── admin.ts
│
├── middleware.ts                        ← Firebase session cookie verification
│
├── functions/                           ← Firebase Cloud Functions
│   ├── src/
│   │   ├── index.ts
│   │   ├── onContactSubmit.ts
│   │   ├── aggregateAnalytics.ts
│   │   └── onAdminSignIn.ts
│   └── package.json
│
├── scripts/
│   └── seed.ts                         ← One-time: populate Firestore from portfolioData
│
├── public/
│   └── assets/
│
├── .env.local
├── netlify.toml
└── firebase.json
```

---

## ⚙️ ENVIRONMENT VARIABLES

```bash
# Firebase Client (public — safe to expose)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# Firebase Admin (server only — NEVER expose to client)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

# Email
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
ADMIN_EMAIL=

# Site
NEXT_PUBLIC_SITE_URL=https://tanishq-creates.netlify.app
```

---

## 🚀 NETLIFY CONFIGURATION

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "20"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
```

---

## 📋 IMPLEMENTATION PHASES

### Phase 1 — Foundation (Days 1–2)
- [ ] Set up Next.js 14 + TypeScript project
- [ ] Configure Firebase (Firestore, Auth, Storage, Functions)
- [ ] Write Firestore security rules
- [ ] Write and run seed script (`/scripts/seed.ts`) to populate all tables from existing `portfolioData`
- [ ] Set up Firebase Admin SDK in Next.js API routes
- [ ] Implement Google Sign-In + session cookie auth middleware
- [ ] Deploy skeleton to Netlify, verify env vars

### Phase 2 — Public Portfolio Port (Days 3–5)
- [ ] Port Three.js scene (BlackHoleScene.tsx) with `next/dynamic ssr:false`
- [ ] Port all GLSL shaders exactly
- [ ] Port GSAP ScrollTrigger timeline exactly
- [ ] Replace all hardcoded data with Firestore SSR fetches
- [ ] Implement Lenis smooth scroll
- [ ] Implement custom cursor component
- [ ] Hero: glitch animation, typewriter effect, GSAP word-by-word reveal
- [ ] Content boxes: scan line reveal, gradient border, enhanced glassmorphism
- [ ] Skills: stagger animation, hover ripple
- [ ] Projects: tilt effect, border trace animation, side-drawer modal
- [ ] Experience: sonar pulse timeline dots
- [ ] Contact: magnetic button, ambient glow
- [ ] Footer component
- [ ] Analytics tracking script
- [ ] Contact form → Firestore → Cloud Function → email

### Phase 3 — Admin Dashboard (Days 6–12)
- [ ] Admin layout (sidebar + topbar)
- [ ] Analytics dashboard (all charts, KPIs, live feed)
- [ ] Hero & About editor
- [ ] Skills editor (dnd-kit)
- [ ] Projects editor (drawer + image upload)
- [ ] Experience editor
- [ ] Education editor
- [ ] Certifications editor
- [ ] Socials editor
- [ ] Resume upload page
- [ ] Inbox (full email client UI)
- [ ] Appearance / Theme Editor
- [ ] Site Settings (SEO, OG)
- [ ] Security (authorized users, session log)
- [ ] Admin settings

### Phase 4 — Polish & Deploy (Days 13–14)
- [ ] End-to-end test all admin CRUD operations
- [ ] Lighthouse audit → fix any score below 90
- [ ] Test Three.js on Safari and Firefox
- [ ] Test mobile responsiveness (public + admin)
- [ ] Set all Netlify env vars, Firebase env vars for Functions
- [ ] Deploy Cloud Functions (`firebase deploy --only functions`)
- [ ] Final deploy + smoke test on live URL

---

## 🧠 KEY IMPLEMENTATION NOTES

1. **Three.js SSR:** Always wrap `BlackHoleScene` with `dynamic(() => import('./BlackHoleScene'), { ssr: false })`. The WebGL canvas cannot render on the server.

2. **Firestore Reads on Public Page:** Use React Server Components for initial data fetch (no loading spinners for content). The static content (about, skills, projects) is fetched server-side. Only analytics tracking is client-side.

3. **Real-time in Admin:** Use `onSnapshot` listeners (Firestore) in admin analytics components. Clean up listeners in `useEffect` return functions.

4. **Image Uploads:** Always generate a thumbnail version on upload (use Firebase Extensions: "Resize Images") so project card thumbnails load fast.

5. **dnd-kit Persistence:** After a drag-and-drop reorder in admin, immediately update `sortOrder` fields in Firestore for all affected documents in a batch write.

6. **Session Cookie Security:** The Firebase session cookie must be `HttpOnly`, `Secure`, `SameSite=Strict`. Set it via a Next.js API route using `firebase-admin`'s `createSessionCookie`.

7. **Maintenance Mode:** Public page's root layout checks Firestore `/portfolio/config.maintenanceMode`. If `true`, render `<MaintenancePage />` instead of the normal content. Admin is unaffected.

8. **Soft Deletes:** Never hard-delete projects or experience entries. Set `deletedAt: serverTimestamp()` and filter `where('deletedAt', '==', null)` in all public queries.

9. **Custom Cursor:** Disable on touch devices (`window.matchMedia('(pointer: coarse)')`). Use `useRef` + `requestAnimationFrame` for smooth lerp — never update cursor position directly in a mouse event handler (causes jank).

10. **Magnetic Button:** Implement using `mousemove` event on a parent element with a 100px radius check. Use GSAP `gsap.to(buttonRef.current, { x, y, duration: 0.3 })` for smooth pull. Reset to `x:0, y:0` on `mouseleave`.

---

## ✅ DEFINITION OF DONE

The project is complete when:

- [ ] Public portfolio is live on Netlify, visually enhanced vs current site
- [ ] All content on public site is driven 100% from Firestore (zero hardcoded data)
- [ ] Admin dashboard is accessible at `/admin` and protected by Google Sign-In allowlist
- [ ] All 14 admin sections are fully functional
- [ ] Analytics are being tracked and displayed in real-time in admin
- [ ] Contact form submissions arrive in admin inbox AND in admin's email inbox
- [ ] Resume upload works and updates the live download link instantly
- [ ] Appearance changes (colors, BH settings) reflect on public site within 5 seconds
- [ ] Lighthouse: Performance ≥ 90, Accessibility ≥ 90, SEO ≥ 95
- [ ] No TypeScript errors (`tsc --noEmit` passes clean)
- [ ] Mobile responsive on both public and admin surfaces
- [ ] Three.js animation works on Chrome, Safari, Firefox, and mobile browsers

---

*Generated for Tanishq Mangal Portfolio v2.0 — May 2026*
