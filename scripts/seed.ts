/**
 * Seed Script: Populates Firestore with initial portfolio data
 * Run with: npx tsx scripts/seed.ts
 * 
 * Requires FIREBASE_ADMIN_* env vars in .env.local
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load env vars
config({ path: resolve(process.cwd(), '.env.local') });

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey,
  }),
});

const db = getFirestore(app);

async function seed() {
  console.log('🌱 Starting seed...\n');

  // ===== PORTFOLIO CONFIG =====
  console.log('📝 Seeding portfolio config...');
  await db.doc('portfolio/config').set({
    heroTitle: 'TANISHQ MANGAL',
    heroSubtitle: 'Creative Technologist & Developer',
    typewriterRoles: [
      'Creative Technologist',
      'Full Stack Developer',
      'AI Engineer',
    ],
    aboutText: "High-performance Full Stack Developer and AI Engineer with expertise in building scalable distributed systems, offline-first mobile architectures, and privacy-preserving AI. Proven track record of reducing API latency by 63% and deploying enterprise-grade security (RLS, Homomorphic Encryption). Passionate about combining TypeScript, Node.js, and Python to deliver secure, production-ready solutions.",
    ctaButtonLabel: 'Download Resume',
    resumeUrl: '',
    maintenanceMode: false,
    maintenanceMessage: 'We\'ll be back soon! Something exciting is brewing.',
    primaryGlow: '#ff9a24',
    secondaryGlow: '#4f46e5',
    bgColor: '#000005',
    textPrimary: '#e5e7eb',
    textSecondary: '#9ca3af',
    bloomIntensity: 1.2,
    diskRotationSpeed: 0.5,
    jetOpacity: 1.0,
    starCount: 20000,
    fontSizeScale: 'md',
    lineHeight: 'comfortable',
    customCSS: '',
  });

  // ===== SKILLS =====
  console.log('🛠️  Seeding skills...');
  const skills = [
    { name: 'Languages', items: ['JavaScript (ES6+)', 'TypeScript', 'Python', 'Java', 'SQL', 'C++'], sortOrder: 0 },
    { name: 'Frontend & Mobile', items: ['React Native', 'Expo', 'Next.js', 'React.js', 'Redux', 'Tailwind CSS', 'HTML5', 'Figma', 'Three.js', 'WebGL', 'Shader'], sortOrder: 1 },
    { name: 'Backend', items: ['Node.js', 'Express.js', 'Socket.IO', 'Spring Boot', 'Microservices'], sortOrder: 2 },
    { name: 'Database', items: ['PostgreSQL', 'MongoDB', 'Redis', 'Supabase', 'Google Firebase'], sortOrder: 3 },
    { name: 'Cloud & DevOps', items: ['AWS (EC2, S3)', 'Docker', 'GitHub Actions (CI/CD)', 'Linux', 'Nginx'], sortOrder: 4 },
    { name: 'AI & Security', items: ['Opacus', 'Paillier', 'Scikit-learn', 'Pandas'], sortOrder: 5 },
    { name: 'Soft Skills', items: ['Agile Methodology', 'Strategic Problem Solving', 'Technical Leadership', 'Collaboration'], sortOrder: 6 },
  ];

  for (const skill of skills) {
    const ref = db.collection('portfolio/skills/categories').doc();
    await ref.set(skill);
  }

  // ===== PROJECTS =====
  console.log('📁 Seeding projects...');
  const projects = [
    {
      title: 'Productr',
      subtitle: 'Full Stack E-commerce Dashboard',
      description: '<ul><li>Built a pixel-perfect, responsive inventory management system with secure OTP Authentication and role-based access control.</li><li>Engineered an interactive Analytics Dashboard using Recharts to visualize real-time asset valuation and category distribution.</li><li>Optimized performance using Skeleton Loaders and Lazy Loading, achieving instant page transitions on a Vercel/Monorepo architecture.</li><li>Secured backend API with Helmet and rate-limiting to prevent DDoS attacks.</li></ul>',
      technologies: ['MERN Stack', 'Tailwind CSS', 'Recharts', 'Vercel', 'OTP Auth'],
      imageUrl: '/images/productr-dashboard.png',
      imageUrl2: '/images/productr-main.png',
      liveUrl: 'https://productr-ten.vercel.app/login',
      sourceUrl: 'https://github.com/Eternalcodertanishq3/Productr',
      sortOrder: 0,
      isVisible: true,
      isFeatured: true,
      deletedAt: null,
    },
    {
      title: 'Ghost Protocol',
      subtitle: 'Privacy-Preserving Federated Learning',
      description: '<ul><li>Devised a cryptographically secure decentralized learning system using 2048-bit Paillier Homomorphic Encryption, enabling 100% real private computation with zero simulations.</li><li>Attained 70%+ model accuracy on fully encrypted data while implementing Differential Privacy (DP-SGD) with a strict privacy budget of ε = 2.51.</li><li>Directed real-time federated aggregation of 2,700+ neural network parameters across 3 hospital nodes, proving feasibility of secure multi-party computation (SMPC) in healthcare-grade environments.</li></ul>',
      technologies: ['Python', 'Opacus', 'Paillier', 'Federated Learning', 'SMPC'],
      imageUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070&auto=format&fit=crop',
      liveUrl: '#',
      sourceUrl: 'https://github.com/Eternalcodertanishq3/ghost-protocol',
      sortOrder: 1,
      isVisible: true,
      isFeatured: false,
      deletedAt: null,
    },
    {
      title: 'Scalable Ride-Sharing',
      subtitle: 'Backend System',
      description: '<ul><li>Built a scalable microservices architecture utilizing Redis Geohashing for real-time location tracking, optimizing driver-rider matching latency by 40%.</li><li>Implemented bi-directional communication using Socket.IO to support concurrent connections and managed horizontal scaling on AWS EC2 to handle traffic spikes.</li></ul>',
      technologies: ['Node.js', 'Redis', 'Socket.IO', 'AWS EC2', 'Microservices'],
      imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop',
      liveUrl: '#',
      sourceUrl: '#',
      sortOrder: 2,
      isVisible: true,
      isFeatured: false,
      deletedAt: null,
    },
    {
      title: 'FlowForce',
      subtitle: 'Offline-First Workforce OS',
      description: '<ul><li>Architected an offline-first mobile platform using React Native and Expo, implementing a custom sync queue with privacy-preserving conflict resolution.</li><li>Built "NanoBrain", a local Naive Bayes AI model for on-device intent classification, enabling voice commands without server revenue or data leakage.</li><li>Implemented enterprise-grade security using Row-Level Security (RLS) and device integrity checks, enforcing strict access controls and audit logging.</li></ul>',
      technologies: ['React Native', 'Expo', 'Naive Bayes', 'RLS', 'Offline-First'],
      imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=2070&auto=format&fit=crop',
      liveUrl: '#',
      sourceUrl: '#',
      sortOrder: 3,
      isVisible: true,
      isFeatured: false,
      deletedAt: null,
    },
    {
      title: 'AI Resume Analyzer',
      subtitle: 'ATS-Grade Parsing Engine',
      description: '<ul><li>Led the development of an ATS-grade resume parsing engine achieving 96% accuracy in entity extraction.</li><li>Utilized BERT-based keyword matching using Hugging Face Transformers to intelligently score resumes against job descriptions, reducing manual screening time by 70%.</li></ul>',
      technologies: ['Python', 'NLP', 'BERT', 'Hugging Face', 'React'],
      imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop',
      liveUrl: '#',
      sourceUrl: '#',
      sortOrder: 4,
      isVisible: true,
      isFeatured: false,
      deletedAt: null,
    },
    {
      title: 'E-Commerce Platform',
      subtitle: 'Full-Stack Web App',
      description: '<ul><li>Launched a robust e-commerce platform integrated with Supabase for backend services and secure authentication.</li><li>Improved page load speed by 35% via optimized API queries, lazy loading, and efficient state management with Redux.</li><li>Deployed a fully automated CI/CD pipeline using GitHub Actions and Vercel for seamless updates.</li></ul>',
      technologies: ['React', 'Supabase', 'Redux', 'CI/CD', 'Vercel'],
      imageUrl: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2070&auto=format&fit=crop',
      liveUrl: '#',
      sourceUrl: '#',
      sortOrder: 5,
      isVisible: true,
      isFeatured: false,
      deletedAt: null,
    },
    {
      title: 'This 3D Portfolio',
      subtitle: 'Interactive Scrollytelling Website',
      description: 'Created a fully interactive portfolio experience using WebGL and Three.js. Features a cinematic, scroll-driven 3D animation of a realistic black hole with custom GLSL shaders, a dynamic content management system, and a responsive UI.',
      technologies: ['Three.js', 'WebGL', 'GLSL', 'GSAP', 'JavaScript'],
      imageUrl: 'https://images.unsplash.com/photo-1614728263952-84ea256ec346?q=80&w=1974&auto=format&fit=crop',
      liveUrl: 'https://tanishq-creates.netlify.app/',
      sourceUrl: '#',
      sortOrder: 6,
      isVisible: true,
      isFeatured: false,
      deletedAt: null,
    },
  ];

  for (const project of projects) {
    const ref = db.collection('portfolio/projects/items').doc();
    await ref.set({
      ...project,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // ===== EXPERIENCE =====
  console.log('💼 Seeding experience...');
  const experience = [
    {
      company: 'Avinya Biomedical',
      location: 'Vadodara, India',
      position: 'Web Developer Intern',
      duration: 'June 2025 – Sept 2025',
      achievements: [
        'Engineered a high-traffic biomedical platform using Next.js and Firebase, adopting a serverless architecture to ensure high availability for scalable user loads.',
        'Reduced API response latency from 220ms to 80ms (63% improvement) by implementing rigorous Load Balancing strategies and optimizing PostgreSQL queries.',
        'Streamlined CI/CD pipelines via GitHub Actions, saving the engineering team 5+ hours of manual QA work weekly.',
        'Improved system observability by integrating Grafana and Prometheus, increasing proactive issue detection rates by 60% and ensuring 99.9% system uptime.',
      ],
      sortOrder: 0,
      isVisible: true,
      deletedAt: null,
    },
  ];

  for (const exp of experience) {
    const ref = db.collection('portfolio/experience/items').doc();
    await ref.set(exp);
  }

  // ===== EDUCATION =====
  console.log('🎓 Seeding education...');
  await db.doc('portfolio/education').set({
    degree: 'Bachelor of Technology in Computer Science Engineering',
    institution: 'Parul University Vadodara, Gujarat',
    location: 'Vadodara, Gujarat, India',
    timeline: 'Expected: May 2026',
    gpa: '',
  });

  // ===== CERTIFICATIONS =====
  console.log('🏆 Seeding certifications...');
  const certifications = [
    { name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', sortOrder: 0, isVisible: true, deletedAt: null },
    { name: 'Back End Development and APIs', issuer: 'freeCodeCamp', sortOrder: 1, isVisible: true, deletedAt: null },
    { name: 'Postman Student Expert', issuer: 'Postman', sortOrder: 2, isVisible: true, deletedAt: null },
  ];

  for (const cert of certifications) {
    const ref = db.collection('portfolio/certifications/items').doc();
    await ref.set(cert);
  }

  // ===== SOCIALS =====
  console.log('🔗 Seeding socials...');
  const socials = [
    {
      platform: 'LinkedIn',
      url: 'https://www.linkedin.com/in/tanishq-mangal-7a2683254',
      icon: 'linkedin',
      sortOrder: 0,
      isVisible: true,
    },
    {
      platform: 'GitHub',
      url: 'https://github.com/Eternalcodertanishq3',
      icon: 'github',
      sortOrder: 1,
      isVisible: true,
    },
  ];

  for (const social of socials) {
    const ref = db.collection('portfolio/socials/items').doc();
    await ref.set(social);
  }

  // ===== SEO =====
  console.log('🔍 Seeding SEO settings...');
  await db.doc('portfolio/seo').set({
    pageTitle: 'Tanishq Mangal | 3D Interactive Portfolio',
    metaDescription: 'Explore the interactive 3D portfolio of Tanishq Mangal, a creative technologist specializing in WebGL, Three.js, and immersive web experiences.',
    ogImageUrl: 'https://images.unsplash.com/photo-1614728263952-84ea256ec346?q=80&w=1200&auto=format&fit=crop',
    ogTitle: 'Tanishq Mangal | 3D Interactive Portfolio',
    ogDescription: 'A cinematic, scroll-driven portfolio featuring a real-time 3D black hole.',
    keywords: 'Tanishq Mangal, Portfolio, Black Hole, WebGL, Three.js, GSAP, Interactive, Creative Developer',
    faviconUrl: '',
  });

  // ===== CONTACT FORM SETTINGS =====
  await db.doc('portfolio/contactFormSettings').set({
    enabled: true,
    autoReplyMessage: 'Thank you for reaching out! I will get back to you shortly.',
    notificationEmail: '',
  });

  // ===== ANALYTICS SETTINGS =====
  await db.doc('portfolio/analyticsSettings').set({
    enabled: true,
  });

  // ===== ADMIN: Authorized Users seed placeholder =====
  // NOTE: You need to add your Google account UID here after first sign-in
  console.log('🔒 Seeding admin structure...');
  // Placeholder - user will add their UID after first Google sign-in

  console.log('\n✅ Seed complete! All portfolio data has been populated.');
  console.log('⚠️  Remember to add your admin UID to admin/authorizedUsers after first sign-in.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
