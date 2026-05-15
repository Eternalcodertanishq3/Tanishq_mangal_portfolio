'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import type * as THREE from 'three';
import TypewriterText from '@/components/public/TypewriterText';
import MagneticButton from '@/components/public/MagneticButton';
import CustomCursor from '@/components/public/CustomCursor';

const BlackHoleScene = dynamic(() => import('@/components/public/BlackHoleScene'), { ssr: false });

import {
  getPortfolioConfig,
  getSkills,
  getVisibleProjects,
  getExperiences,
  getEducation,
  getCertifications,
  getSocials,
  submitContact,
} from '@/lib/firestore/portfolio';
import type { SkillCategory, Project, Experience, Education, Certification, SocialLink } from '@/types/portfolio';

const socialIcons: Record<string, string> = {
  linkedin: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>',
  github: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>',
};

export default function PortfolioPage() {
  const [activeModal, setActiveModal] = useState<'project' | 'experience' | 'contact' | 'certificate' | null>(null);
  const [modalData, setModalData] = useState<Record<string, unknown> | null>(null);
  const [certData, setCertData] = useState<Certification | null>(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSuccess, setContactSuccess] = useState(false);
  const heroRef = useRef<HTMLHeadingElement>(null);

  const [portfolioData, setPortfolioData] = useState({
    about: '',
    typewriterRoles: ['Loading...'],
    skills: [] as SkillCategory[],
    projects: [] as Project[],
    experience: [] as Experience[],
    education: null as Education | null,
    certifications: [] as Certification[],
    socials: [] as SocialLink[],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const fetchPromise = Promise.all([
          getPortfolioConfig(),
          getSkills(),
          getVisibleProjects(),
          getExperiences(false),
          getEducation(),
          getCertifications(false),
          getSocials()
        ]);
        
        // 5 second timeout to prevent infinite loading if Firebase hangs
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Firebase connection timeout')), 5000));
        
        const [
          config,
          skills,
          projects,
          experience,
          education,
          certifications,
          socials
        ] = await Promise.race([fetchPromise, timeoutPromise]) as any;

        if (isMounted) {
          setPortfolioData({
            about: config?.aboutText || '',
            typewriterRoles: config?.typewriterRoles?.length ? config.typewriterRoles : ['Creative Technologist', 'Full Stack Developer', 'AI Engineer'],
            skills: skills || [],
            projects: projects || [],
            experience: experience || [],
            education: education || null,
            certifications: certifications || [],
            socials: socials || [],
          });
        }
      } catch (err) {
        console.warn("Failed to fetch portfolio data, using fallback. Reason:", err instanceof Error ? err.message : String(err));
        if (isMounted) {
          setPortfolioData({
            about: "High-performance Full Stack Developer and AI Engineer with expertise in building scalable distributed systems, offline-first mobile architectures, and privacy-preserving AI. Proven track record of reducing API latency by 63% and deploying enterprise-grade security.",
            typewriterRoles: ['Creative Technologist', 'Full Stack Developer', 'AI Engineer'],
            skills: [{ id: '1', name: 'Core', items: ['TypeScript', 'Node.js', 'Next.js', 'React Native', 'Firebase', 'AWS'], sortOrder: 0 }] as any as SkillCategory[],
            projects: [{ id: '1', title: 'Productr', subtitle: 'Full Stack Dashboard', technologies: ['MERN Stack', 'Tailwind'], description: 'Built an inventory management system.', liveUrl: '#', sourceUrl: '#', isFeatured: true, sortOrder: 0, isVisible: true }] as any as Project[],
            experience: [{ id: '1', company: 'Avinya Biomedical', location: 'India', position: 'Web Developer Intern', duration: 'June 2025 – Sept 2025', achievements: ['Engineered biomedical platform using Next.js and Firebase.'], isVisible: true, sortOrder: 0 }] as any as Experience[],
            education: { degree: 'B.Tech in Computer Science', institution: 'Parul University', location: '', timeline: 'Expected: May 2026', gpa: '' },
            certifications: [{ id: '1', name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', isVisible: true, sortOrder: 0 }] as any as Certification[],
            socials: [{ id: '1', platform: 'LinkedIn', url: 'https://linkedin.com/in/tanishq-mangal-7a2683254', icon: 'linkedin', isVisible: true, sortOrder: 0 }] as any as SocialLink[],
          });
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  // Refresh ScrollTrigger when data is loaded to account for height changes
  useEffect(() => {
    const refreshST = async () => {
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      ScrollTrigger.refresh();
    };
    if (!isLoading) {
      setTimeout(refreshST, 500); // Give React time to paint
    }
  }, [portfolioData, isLoading]);
  // Initialize GSAP scroll animations
  useEffect(() => {
    if (isLoading) return;

    let gsapModule: typeof import('gsap') | null = null;
    let ScrollTriggerMod: unknown = null;
    let ScrollToMod: unknown = null;
    let isCancelled = false;

    const initGSAP = async () => {
      gsapModule = await import('gsap');
      const st = await import('gsap/ScrollTrigger');
      const sp = await import('gsap/ScrollToPlugin');
      ScrollTriggerMod = st.ScrollTrigger;
      ScrollToMod = sp.ScrollToPlugin;
      gsapModule.gsap.registerPlugin(ScrollTriggerMod as never, ScrollToMod as never);

      // Section reveal animations
      document.querySelectorAll('.scroll-section').forEach((section) => {
        const content = section.querySelector('.content-box, .max-w-6xl');
        if (content && gsapModule) {
          gsapModule.gsap.fromTo(content, { opacity: 0, y: 100 }, {
            scrollTrigger: { trigger: section, start: 'top 70%', end: 'top 40%', scrub: 1 },
            opacity: 1, y: 0,
          });
        }
      });

      // Glitch effect on hero title
      if (heroRef.current && gsapModule) {
        gsapModule.gsap.fromTo(heroRef.current, { x: -5, opacity: 0.7 }, {
          x: 0, opacity: 1, duration: 0.3, repeat: 3, yoyo: true,
          onComplete: () => { if (heroRef.current) heroRef.current.style.transform = 'none'; },
        });
      }

      const checkAndInitBlackHole = () => {
        if (isCancelled) return;
        const bhGroup = (window as unknown as Record<string, unknown>).__blackHoleGroup as any;
        const cam = (window as unknown as Record<string, unknown>).__camera as any;

        if (!bhGroup || !cam) {
          setTimeout(checkAndInitBlackHole, 200);
          return;
        }

        const tl = gsapModule!.gsap.timeline({
          scrollTrigger: { trigger: '#scroll-content', start: 'top top', end: 'bottom bottom', scrub: 1.5 },
        });
        tl.to(bhGroup.rotation, { x: 0.5, y: Math.PI / 2 }, 'start')
          .to(cam.position, { z: 12 }, 'start');
        tl.to(cam.position, { z: 20, x: -5, y: 1 }, 'about')
          .to(bhGroup.rotation, { x: 0.8, y: Math.PI }, 'about');
        tl.to(cam.position, { z: 22, x: 8, y: -2 }, 'skills')
          .to(bhGroup.rotation, { y: Math.PI * 1.5 }, 'skills');
        tl.to(cam.position, { z: 18, x: 0, y: 0 }, 'projects')
          .to(bhGroup.rotation, { x: 0.2, y: Math.PI * 2 }, 'projects');
        tl.to(cam.position, { z: 15, x: 0, y: 0 }, 'contact')
          .to(bhGroup.scale, { x: 1.2, y: 1.2, z: 1.2 }, 'contact');

        if (ScrollTriggerMod) {
          (ScrollTriggerMod as any).refresh();
        }
      };

      checkAndInitBlackHole();
    };

    const timer = setTimeout(initGSAP, 300);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [isLoading]);

  // Smooth scroll for nav links
  const scrollTo = async (target: string) => {
    const gsapModule = await import('gsap');
    const sp = await import('gsap/ScrollToPlugin');
    gsapModule.gsap.registerPlugin(sp.ScrollToPlugin);
    gsapModule.gsap.to(window, { duration: 1.5, scrollTo: target, ease: 'power2.inOut' });
  };

  const openProjectModal = (project: Project) => {
    setModalData(project as unknown as Record<string, unknown>);
    setActiveModal('project');
  };

  const openExperienceModal = (job: Experience) => {
    setModalData(job as unknown as Record<string, unknown>);
    setActiveModal('experience');
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Submit to Firestore (existing logic)
      await submitContact(contactForm);
      
      // 2. Submit to Netlify (new logic for free email notifications)
      const encode = (data: Record<string, string>) => {
        return Object.keys(data)
          .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
          .join("&");
      };

      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({ 
          "form-name": "contact", 
          ...contactForm 
        })
      });

      setContactSuccess(true);
    } catch (error) {
      console.error('Error submitting contact', error);
    }
  };

  return (
    <>
      <CustomCursor />
      <BlackHoleScene />

      {/* Preloader */}
      {isLoading && (
        <div id="preloader" className="fixed inset-0 flex justify-center items-center z-9999 transition-opacity duration-800 bg-(--bg-color)">
          <div className="font-heading text-2xl tracking-[0.2em] text-(--primary-glow)">ESTABLISHING CONNECTION...</div>
        </div>
      )}

      {/* Header */}
      <header id="header" className="fixed top-0 left-0 right-0 z-100 px-8 py-6 bg-gradient-to-b from-black/90 via-black/50 to-transparent pointer-events-none">
        <nav className="max-w-7xl mx-auto flex justify-between items-center pointer-events-auto">
          <a onClick={() => scrollTo('#hero-section')} className="text-2xl font-bold cursor-pointer font-heading text-(--primary-glow) drop-shadow-[0_0_10px_rgba(255,154,36,0.8)]">TM</a>
          <div className="hidden md:flex gap-10">
            {['About', 'Skills', 'Projects', 'Experience', 'Education', 'Certifications', 'Contact'].map((item) => (
              <a key={item} onClick={() => scrollTo(`#${item.toLowerCase()}-section`)} className="text-gray-200 hover:text-white hover:text-(--primary-glow) transition-colors cursor-pointer text-sm font-semibold tracking-wider uppercase" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 4px 16px rgba(0,0,0,0.8)' }}>{item}</a>
            ))}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main id="scroll-content" className="relative z-10">
        {/* Hero */}
        <section id="hero-section" className="scroll-section justify-center text-center h-screen flex items-center">
          <div className="relative z-10 px-4">
            <h1 ref={heroRef} className="text-6xl md:text-[7rem] font-black tracking-tighter font-heading text-white" style={{ textShadow: '0 8px 40px rgba(0,0,0,0.9), 0 2px 10px rgba(0,0,0,0.8)' }}>TANISHQ MANGAL</h1>
            <p className="text-xl md:text-3xl mt-4 text-(--primary-glow) font-bold" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.8)' }}>
              <TypewriterText texts={portfolioData.typewriterRoles} />
            </p>
            <p className="text-lg text-gray-200 mt-16 animate-pulse flex items-center justify-center gap-2 font-medium" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.9)' }}>
              Scroll to begin the journey
              <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
            </p>
          </div>
        </section>

        {/* About */}
        <section id="about-section" className="scroll-section justify-start">
          <div className="content-box">
            <h2 className="text-4xl font-bold mb-4 font-heading">About Me</h2>
            <p className="text-gray-300 leading-relaxed text-lg mb-8">{portfolioData.about}</p>
            <a href="/Tanishq Mangal - Resume.pdf" target="_blank" className="inline-block font-semibold px-6 py-3 rounded-full border-2 transition-all hover:shadow-lg border-(--primary-glow) text-(--primary-glow)">Download Resume</a>
          </div>
        </section>

        {/* Skills */}
        <section id="skills-section" className="scroll-section justify-end">
          <div className="content-box text-right">
            <h2 className="text-4xl font-bold mb-6 font-heading">Core Competencies</h2>
            <div className="flex flex-wrap justify-end gap-3 text-lg">
              {portfolioData.skills.map((cat) => (
                <div key={cat.id} className="w-full text-right mb-4">
                  <h4 className="text-orange-300/80 font-bold mb-2 uppercase tracking-wider text-sm">{cat.name}</h4>
                  <div className="flex flex-wrap justify-end gap-2">
                    {cat.items?.map((skill) => (
                      <span key={skill} className="bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-700 text-sm hover:border-orange-400 transition-colors cursor-default">{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects */}
        <section id="projects-section" className="scroll-section justify-center flex-col">
          <div className="w-full max-w-6xl mx-auto">
            <h2 className="text-5xl font-bold mb-12 text-center font-heading">Featured Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolioData.projects.map((project) => (
                <div key={project.id} onClick={() => openProjectModal(project)} className="project-card bg-[rgba(10,10,25,0.9)] border border-orange-400/30 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-2.5 hover:bg-[rgba(20,20,40,0.95)] relative overflow-hidden group">
                  {project.isFeatured && <span className="absolute top-3 right-3 bg-orange-500/20 text-orange-400 text-xs px-2 py-1 rounded-full border border-orange-400/30">Featured</span>}
                  <h3 className="text-2xl font-bold text-orange-400 mb-2 font-heading">{project.title}</h3>
                  <p className="text-gray-400">{project.subtitle}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {project.technologies?.slice(0, 3).map((t) => <span key={t} className="text-xs bg-gray-700/50 px-2 py-0.5 rounded text-gray-300">{t}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience */}
        <section id="experience-section" className="scroll-section justify-start">
          <div className="content-box">
            <h2 className="text-4xl font-bold mb-8 font-heading">Professional Experience</h2>
            <div className="space-y-8">
              {portfolioData.experience.map((job, i) => (
                <div key={i} onClick={() => openExperienceModal(job)} className="experience-card border-l-2 border-orange-400 pl-6 cursor-pointer transition-all hover:translate-x-2.5 relative">
                  <div className="absolute left-[-7px] top-0 w-3 h-3 bg-orange-400 rounded-full shadow-[0_0_15px_var(--primary-glow)]" />
                  <h3 className="text-2xl font-bold text-orange-400 mb-2 font-heading">{job.position}</h3>
                  <p className="text-gray-400 text-lg">{job.company}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Education */}
        <section id="education-section" className="scroll-section justify-end">
          <div className="content-box">
            <h2 className="text-4xl font-bold mb-8 font-heading">Education</h2>
            {portfolioData.education && (
              <div className="border-l-2 border-orange-400 pl-6">
                <h3 className="text-2xl font-bold text-orange-400 mb-2">{portfolioData.education.degree}</h3>
                <p className="text-gray-400 text-lg">{portfolioData.education.institution}</p>
                <p className="text-gray-500 text-sm mt-2">{portfolioData.education.timeline}</p>
              </div>
            )}
          </div>
        </section>

        {/* Certifications */}
        <section id="certifications-section" className="scroll-section justify-start">
          <div className="content-box">
            <h2 className="text-4xl font-bold mb-8 font-heading">Certifications</h2>
            {portfolioData.certifications.map((cert, i) => (
              <div key={i} className="certification-card pl-6 mb-6 bg-[rgba(15,15,35,0.8)] rounded-lg p-4 border-l-[3px] border-orange-400 cursor-default transition-all hover:translate-x-2.5 hover:bg-[rgba(25,25,50,0.95)]">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-orange-400 mb-1">{cert.name}</h3>
                    <p className="text-gray-500 text-sm">{cert.issuer}</p>
                  </div>
                  {cert.credentialUrl && (
                    <button 
                      onClick={() => {
                        setCertData(cert);
                        setActiveModal('certificate');
                      }}
                      className="text-xs bg-orange-500/10 text-orange-400 px-3 py-1.5 rounded-full border border-orange-400/30 hover:bg-orange-500 hover:text-white transition-all font-semibold"
                    >
                      View Certificate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact-section" className="scroll-section justify-center text-center relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="w-96 h-96 bg-orange-500/5 rounded-full blur-[100px]" /></div>
          <div className="content-box text-center relative">
            <h2 className="text-5xl font-bold mb-4 font-heading">Let&apos;s Create Together</h2>
            <p className="text-lg text-gray-300 mb-8">Open to new opportunities and collaborations.</p>
            <MagneticButton onClick={() => setActiveModal('contact')} className="bg-orange-600 hover:bg-orange-500 text-white font-semibold px-8 py-4 rounded-full text-lg transition-colors shadow-lg shadow-orange-500/50">
              Get In Touch
            </MagneticButton>
            <div className="flex justify-center gap-8 mt-12">
              {portfolioData.socials.map((s) => (
                <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.platform} title={s.platform} className="text-gray-400 hover:text-white transition-colors h-8 w-8" dangerouslySetInnerHTML={{ __html: socialIcons[s.icon?.toLowerCase()] || socialIcons.linkedin }} />
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 text-gray-500 text-sm relative z-10">
          <p>© {new Date().getFullYear()} Tanishq Mangal. All rights reserved.</p>
          <p className="mt-1">Built with Three.js + Next.js</p>
          <button onClick={() => scrollTo('#hero-section')} className="mt-3 text-orange-400 hover:text-orange-300 transition-colors text-sm">↑ Back to top</button>
        </footer>
      </main>

      {/* Project Modal */}
      {activeModal === 'project' && modalData && (
        <div className="modal-backdrop active" onClick={(e) => e.target === e.currentTarget && setActiveModal(null)}>
          <div className="modal-content">
            <button onClick={() => setActiveModal(null)} className="modal-close-btn">&times;</button>
            <h2 className="text-4xl font-bold mb-2 font-heading">{modalData.title as string}</h2>
            <div className="text-lg text-gray-300 mb-6" dangerouslySetInnerHTML={{ __html: modalData.description as string }} />
            <h3 className="text-2xl font-bold mb-3">Technologies:</h3>
            <div className="flex flex-wrap gap-3 mb-8">
              {(modalData.technologies as string[])?.map((t) => <span key={t} className="bg-gray-700/50 px-3 py-1 rounded-md text-orange-300">{t}</span>)}
            </div>
            <div className="flex flex-wrap gap-4">
              {modalData.liveUrl !== '#' && <a href={modalData.liveUrl as string} target="_blank" rel="noopener noreferrer" className="project-link-btn primary">Live Demo</a>}
              {modalData.sourceUrl !== '#' && <a href={modalData.sourceUrl as string} target="_blank" rel="noopener noreferrer" className="project-link-btn secondary">Source Code</a>}
            </div>
          </div>
        </div>
      )}

      {/* Experience Modal */}
      {activeModal === 'experience' && modalData && (
        <div className="modal-backdrop active" onClick={(e) => e.target === e.currentTarget && setActiveModal(null)}>
          <div className="modal-content">
            <button onClick={() => setActiveModal(null)} className="modal-close-btn">&times;</button>
            <h2 className="text-4xl font-bold mb-2 font-heading">{modalData.position as string}</h2>
            <p className="text-2xl text-orange-400 mb-2">{modalData.company as string}</p>
            <p className="text-gray-400 mb-6">{modalData.duration as string}</p>
            <h3 className="text-2xl font-bold mb-4">Key Achievements:</h3>
            <ul className="list-disc list-inside space-y-3 text-gray-300">
              {(modalData.achievements as string[])?.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {activeModal === 'contact' && (
        <div className="modal-backdrop active" onClick={(e) => e.target === e.currentTarget && setActiveModal(null)}>
          <div className="modal-content max-w-[600px]">
            <button onClick={() => setActiveModal(null)} className="modal-close-btn">&times;</button>
            {!contactSuccess ? (
              <div>
                <h2 className="text-4xl font-bold mb-6 text-center font-heading">Contact Me</h2>
                {/* Hidden form for Netlify crawler to detect the form name and fields */}
                <form name="contact" data-netlify="true" hidden>
                  <input type="text" name="name" />
                  <input type="email" name="email" />
                  <textarea name="message"></textarea>
                </form>
                
                <form onSubmit={handleContactSubmit} data-netlify="true" name="contact">
                  <input type="hidden" name="form-name" value="contact" />
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-400 mb-2">Name</label>
                    <input id="name" name="name" title="Name" placeholder="Your Name" type="text" required className="contact-input" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-400 mb-2">Email</label>
                    <input id="email" name="email" title="Email" placeholder="Your Email" type="email" required className="contact-input" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-gray-400 mb-2">Message</label>
                    <textarea id="message" name="message" title="Message" placeholder="Your Message" rows={4} required className="contact-input" value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} />
                  </div>
                  <button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 text-white font-semibold px-8 py-3 rounded-lg text-lg transition-all shadow-lg shadow-orange-500/50">Send Message</button>
                </form>
              </div>
            ) : (
              <div className="flex flex-col items-center py-12">
                <svg className="w-16 h-16 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <h2 className="text-4xl font-bold mb-4 font-heading">Thank You!</h2>
                <p className="text-lg text-gray-300">Your message has been sent.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {activeModal === 'certificate' && certData && (
        <div className="modal-backdrop active" onClick={(e) => e.target === e.currentTarget && setActiveModal(null)}>
          <div className="modal-content max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col">
            <button onClick={() => setActiveModal(null)} className="modal-close-btn">&times;</button>
            <h2 className="text-3xl font-bold mb-4 font-heading text-orange-400">{certData.name}</h2>
            <div className="flex-1 overflow-auto bg-black/40 rounded-xl p-2 min-h-[500px] flex items-center justify-center">
              {certData.credentialUrl?.startsWith('data:application/pdf') ? (
                <iframe src={certData.credentialUrl} title={certData.name} className="w-full h-full border-none rounded-lg" style={{ height: '70vh' }} />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={certData.credentialUrl} alt={certData.name} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
              )}
            </div>
            {certData.credentialUrl?.startsWith('http') && (
              <div className="mt-4 text-center">
                <a href={certData.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline text-sm">Open original in new tab ↗</a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
