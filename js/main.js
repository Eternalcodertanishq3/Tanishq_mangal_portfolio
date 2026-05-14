document.addEventListener('DOMContentLoaded', () => {
    // --- DYNAMIC CONTENT ---
    const portfolioData = {
        about: "High-performance Full Stack Developer and AI Engineer with expertise in building scalable distributed systems, offline-first mobile architectures, and privacy-preserving AI. Proven track record of reducing API latency by 63% and deploying enterprise-grade security (RLS, Homomorphic Encryption). Passionate about combining TypeScript, Node.js, and Python to deliver secure, production-ready solutions.",
        skills: {
            "Languages": ["JavaScript (ES6+)", "TypeScript", "Python", "Java", "SQL", "C++"],
            "Frontend & Mobile": ["React Native", "Expo", "Next.js", "React.js", "Redux", "Tailwind CSS", "HTML5", "Figma", "Three.js", "WebGL", "Shader"],
            "Backend": ["Node.js", "Express.js", "Socket.IO", "Spring Boot", "Microservices"],
            "Database": ["PostgreSQL", "MongoDB", "Redis", "Supabase", "Google Firebase"],
            "Cloud & DevOps": ["AWS (EC2, S3)", "Docker", "GitHub Actions (CI/CD)", "Linux", "Nginx"],
            "AI & Security": ["Opacus", "Paillier", "Scikit-learn", "Pandas"],
            "Soft Skills": ["Agile Methodology", "Strategic Problem Solving", "Technical Leadership", "Collaboration"]
        },
        socials: [
            { name: "LinkedIn", url: "https://www.linkedin.com/in/tanishq-mangal-7a2683254", icon: `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>` },
            { name: "GitHub", url: "https://github.com/Eternalcodertanishq3", icon: `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>` }
        ],
        education: {
            school: "Parul University Vadodara, Gujarat",
            degree: "Bachelor of Technology in Computer Science Engineering",
            expected: "Expected: May 2026"
        },
        experience: [
            {
                company: "Avinya Biomedical",
                location: "Vadodara, India",
                position: "Web Developer Intern",
                duration: "June 2025 – Sept 2025",
                achievements: [
                    "Engineered a high-traffic biomedical platform using Next.js and Firebase, adopting a serverless architecture to ensure high availability for scalable user loads.",
                    "Reduced API response latency from 220ms to 80ms (63% improvement) by implementing rigorous Load Balancing strategies and optimizing PostgreSQL queries.",
                    "Streamlined CI/CD pipelines via GitHub Actions, saving the engineering team 5+ hours of manual QA work weekly.",
                    "Improved system observability by integrating Grafana and Prometheus, increasing proactive issue detection rates by 60% and ensuring 99.9% system uptime."
                ]
            }
        ],
        certifications: [
            { name: "AWS Certified Cloud Practitioner", issuer: "Amazon Web Services" },
            { name: "Back End Development and APIs", issuer: "freeCodeCamp" },
            { name: "Postman Student Expert", issuer: "Postman" }
        ],
        projects: [
            {
                id: 'productr',
                title: 'Productr',
                subtitle: 'Full Stack E-commerce Dashboard',
                description: '<ul class="list-disc pl-5"><li>Built a pixel-perfect, responsive inventory management system with secure OTP Authentication and role-based access control.</li><li>Engineered an interactive Analytics Dashboard using Recharts to visualize real-time asset valuation and category distribution.</li><li>Optimized performance using Skeleton Loaders and Lazy Loading, achieving instant page transitions on a Vercel/Monorepo architecture.</li><li>Secured backend API with Helmet and rate-limiting to prevent DDoS attacks.</li></ul>',
                technologies: ['MERN Stack', 'Tailwind CSS', 'Recharts', 'Vercel', 'OTP Auth'],
                imageUrl: './images/productr-dashboard.png',
                images: ['./images/productr-main.png', './images/productr-dashboard.png'],
                liveUrl: 'https://productr-ten.vercel.app/login',
                sourceUrl: 'https://github.com/Eternalcodertanishq3/Productr'
            },
            {
                id: 'ghost-protocol',
                title: 'Ghost Protocol',
                subtitle: 'Privacy-Preserving Federated Learning',
                description: '<ul class="list-disc pl-5"><li>Devised a cryptographically secure decentralized learning system using 2048-bit Paillier Homomorphic Encryption, enabling 100% real private computation with zero simulations.</li><li>Attained 70%+ model accuracy on fully encrypted data while implementing Differential Privacy (DP-SGD) with a strict privacy budget of ε = 2.51.</li><li>Directed real-time federated aggregation of 2,700+ neural network parameters across 3 hospital nodes, proving feasibility of secure multi-party computation (SMPC) in healthcare-grade environments.</li></ul>',
                technologies: ['Python', 'Opacus', 'Paillier', 'Federated Learning', 'SMPC'],
                imageUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070&auto=format&fit=crop',
                liveUrl: '#',
                sourceUrl: 'https://github.com/Eternalcodertanishq3/ghost-protocol'
            },
            {
                id: 'ride-sharing',
                title: 'Scalable Ride-Sharing',
                subtitle: 'Backend System',
                description: '<ul class="list-disc pl-5"><li>Built a scalable microservices architecture utilizing Redis Geohashing for real-time location tracking, optimizing driver-rider matching latency by 40%.</li><li>Implemented bi-directional communication using Socket.IO to support concurrent connections and managed horizontal scaling on AWS EC2 to handle traffic spikes.</li></ul>',
                technologies: ['Node.js', 'Redis', 'Socket.IO', 'AWS EC2', 'Microservices'],
                imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop',
                liveUrl: '#',
                sourceUrl: '#'
            },
            {
                id: 'flowforce',
                title: 'FlowForce',
                subtitle: 'Offline-First Workforce OS',
                description: '<ul class="list-disc pl-5"><li>Architected an offline-first mobile platform using React Native and Expo, implementing a custom sync queue with privacy-preserving conflict resolution.</li><li>Built "NanoBrain", a local Naive Bayes AI model for on-device intent classification, enabling voice commands without server revenue or data leakage.</li><li>Implemented enterprise-grade security using Row-Level Security (RLS) and device integrity checks, enforcing strict access controls and audit logging.</li></ul>',
                technologies: ['React Native', 'Expo', 'Naive Bayes', 'RLS', 'Offline-First'],
                imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=2070&auto=format&fit=crop',
                liveUrl: '#',
                sourceUrl: '#'
            },
            {
                id: 'resume-analyzer',
                title: 'AI Resume Analyzer',
                subtitle: 'ATS-Grade Parsing Engine',
                description: '<ul class="list-disc pl-5"><li>Led the development of an ATS-grade resume parsing engine achieving 96% accuracy in entity extraction.</li><li>Utilized BERT-based keyword matching using Hugging Face Transformers to intelligently score resumes against job descriptions, reducing manual screening time by 70%.</li></ul>',
                technologies: ['Python', 'NLP', 'BERT', 'Hugging Face', 'React'],
                imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop',
                liveUrl: '#',
                sourceUrl: '#'
            },
            {
                id: 'ecommerce',
                title: 'E-Commerce Platform',
                subtitle: 'Full-Stack Web App',
                description: '<ul class="list-disc pl-5"><li>Launched a robust e-commerce platform integrated with Supabase for backend services and secure authentication.</li><li>Improved page load speed by 35% via optimized API queries, lazy loading, and efficient state management with Redux.</li><li>Deployed a fully automated CI/CD pipeline using GitHub Actions and Vercel for seamless updates.</li></ul>',
                technologies: ['React', 'Supabase', 'Redux', 'CI/CD', 'Vercel'],
                imageUrl: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2070&auto=format&fit=crop',
                liveUrl: '#',
                sourceUrl: '#'
            },
            {
                id: '3d-portfolio',
                title: 'This 3D Portfolio',
                subtitle: 'Interactive Scrollytelling Website',
                description: 'Created a fully interactive portfolio experience using WebGL and Three.js. Features a cinematic, scroll-driven 3D animation of a realistic black hole with custom GLSL shaders, a dynamic content management system, and a responsive UI. The goal was to build a memorable and engaging site to showcase technical and creative skills.',
                technologies: ['Three.js', 'WebGL', 'GLSL', 'GSAP', 'JavaScript'],
                imageUrl: 'https://images.unsplash.com/photo-1614728263952-84ea256ec346?q=80&w=1974&auto=format&fit=crop',
                liveUrl: 'https://tanishq-creates.netlify.app/',
                sourceUrl: '#'
            }
        ]
    };

    // --- GLOBAL VARIABLES ---
    const canvasContainer = document.getElementById('webgl-canvas-container');
    const preloader = document.getElementById('preloader');
    let scene, camera, renderer, composer, clock;
    let blackHoleGroup, disk, diskMaterial, jetMaterial, backgroundParticles;
    const mouse = new THREE.Vector2();

    function init() {
        populateContent();
        setupThreeJS();
        createSceneObjects();
        setupScrollAnimations();
        setupUIEventListeners();
        animate();
    }
    init();

    function populateContent() {
        document.getElementById('about-text').textContent = portfolioData.about;

        const skillsContainer = document.getElementById('skills-container');
        skillsContainer.innerHTML = '';

        // Handle categorized skills
        for (const [category, skills] of Object.entries(portfolioData.skills)) {
            let categoryHTML = `
                <div class="w-full text-right mb-4">
                    <h4 class="text-orange-300/80 font-bold mb-2 uppercase tracking-wider text-sm">${category}</h4>
                    <div class="flex flex-wrap justify-end gap-2">
            `;

            skills.forEach(skill => {
                categoryHTML += `<span class="bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-700 text-sm hover:border-orange-400 transition-colors cursor-default">${skill}</span>`;
            });

            categoryHTML += `</div></div>`;
            skillsContainer.innerHTML += categoryHTML;
        }

        const projectsContainer = document.getElementById('projects-container');
        projectsContainer.innerHTML = '';
        portfolioData.projects.forEach(project => {
            projectsContainer.innerHTML += `
                <div class="project-card" data-project-id="${project.id}">
                    <h3 class="text-2xl font-bold text-orange-400 mb-2">${project.title}</h3>
                    <p class="text-gray-400">${project.subtitle}</p>
                </div>`;
        });

        // Populate Experience as Cards
        const experienceContainer = document.getElementById('experience-container');
        experienceContainer.innerHTML = '';
        portfolioData.experience.forEach((job, index) => {
            experienceContainer.innerHTML += `
                <div class="experience-card border-l-2 border-orange-400 pl-6" data-job-index="${index}">
                    <h3 class="text-2xl font-bold text-orange-400 mb-2">${job.position}</h3>
                    <p class="text-gray-400 text-lg">${job.company}</p>
                </div>`;
        });

        // Populate Education
        document.getElementById('education-degree').textContent = portfolioData.education.degree;
        document.getElementById('education-school').textContent = portfolioData.education.school;
        document.getElementById('education-expected').textContent = portfolioData.education.expected;

        // Populate Certifications as Cards
        const certificationsContainer = document.getElementById('certifications-container');
        certificationsContainer.innerHTML = '';
        portfolioData.certifications.forEach((cert, index) => {
            certificationsContainer.innerHTML += `
                <div class="certification-card border-l-2 border-orange-400 pl-6" data-cert-index="${index}">
                    <h3 class="text-xl font-bold text-orange-400 mb-2">${cert.name}</h3>
                    <p class="text-gray-500 text-sm">${cert.issuer}</p>
                </div>`;
        });

        const socialsContainer = document.getElementById('socials-container');
        socialsContainer.innerHTML = '';
        portfolioData.socials.forEach(social => {
            socialsContainer.innerHTML += `<a href="${social.url}" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-white transition-colors h-8 w-8">${social.icon}</a>`;
        });
    }

    function setupThreeJS() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 15);

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        canvasContainer.appendChild(renderer.domElement);

        composer = new THREE.EffectComposer(renderer);
        composer.addPass(new THREE.RenderPass(scene, camera));

        const bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.2, 0.8, 0.5);
        composer.addPass(bloomPass);

        clock = new THREE.Clock();
    }

    function createSceneObjects() {
        blackHoleGroup = new THREE.Group();

        const sphere = new THREE.Mesh(new THREE.SphereGeometry(1.8, 64, 64), new THREE.MeshBasicMaterial({ color: 0x000000 }));
        blackHoleGroup.add(sphere);

        diskMaterial = new THREE.ShaderMaterial({
            vertexShader: document.getElementById('diskVertexShader').textContent,
            fragmentShader: document.getElementById('diskFragmentShader').textContent,
            uniforms: { u_time: { value: 0.0 } },
            transparent: true,
            side: THREE.DoubleSide
        });
        // Use Torus for thickness
        // Radius=4, Tube=2 -> Inner=2, Outer=6 matching previous Ring
        disk = new THREE.Mesh(new THREE.TorusGeometry(4.0, 2.0, 64, 200), diskMaterial);
        disk.rotation.x = -Math.PI / 2;
        disk.scale.z = 0.1; // Flatten to make it a thick disk, not a donut
        blackHoleGroup.add(disk);

        jetMaterial = new THREE.ShaderMaterial({
            vertexShader: document.getElementById('jetVertexShader').textContent,
            fragmentShader: document.getElementById('jetFragmentShader').textContent,
            uniforms: { u_time: { value: 0.0 } },
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide
        });
        const flowGeometry = new THREE.CylinderGeometry(2.0, 0.1, 20, 32, 20, true); // Top=Wide, Bottom=Narrow
        flowGeometry.translate(0, 10, 0); // Translate so bottom (narrow) is at Y=0

        const topJet = new THREE.Mesh(flowGeometry, jetMaterial);
        topJet.position.y = 0;

        const bottomJet = new THREE.Mesh(flowGeometry, jetMaterial);
        bottomJet.rotation.x = Math.PI; // Flip it so it goes downwards
        bottomJet.position.y = 0;

        blackHoleGroup.add(topJet, bottomJet);

        scene.add(blackHoleGroup);

        const particleCount = 20000;
        const positions = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3 + 0] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
        }
        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particleMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, transparent: true, opacity: 0.5 });
        backgroundParticles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(backgroundParticles);
    }

    // --- NEWLY ADDED PARTICLE BURST FUNCTION ---
    function triggerParticleEjection() {
        const ejectionCount = 1000;
        const positions = new Float32Array(ejectionCount * 3);
        const velocities = new Float32Array(ejectionCount * 3);

        // Start particles from the edge of the disk
        const startRadius = 2.5;

        for (let i = 0; i < ejectionCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            positions[i * 3] = Math.cos(angle) * startRadius;
            positions[i * 3 + 1] = 0;
            positions[i * 3 + 2] = Math.sin(angle) * startRadius;

            const speed = Math.random() * 0.2 + 0.1;
            velocities[i * 3 + 0] = Math.cos(angle) * speed;
            velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.1; // Reduced vertical spread
            velocities[i * 3 + 2] = Math.sin(angle) * speed;
        }

        const ejectionGeometry = new THREE.BufferGeometry();
        ejectionGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const ejectionMaterial = new THREE.PointsMaterial({
            color: '#ffddaa',
            size: 0.1,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 1.0
        });

        const ejectionSystem = new THREE.Points(ejectionGeometry, ejectionMaterial);
        ejectionSystem.rotation.x = -Math.PI / 2; // Match disk rotation
        blackHoleGroup.add(ejectionSystem);

        gsap.to(ejectionSystem.material, {
            opacity: 0,
            duration: 2,
            delay: 1,
            ease: "power2.in",
            onComplete: () => {
                blackHoleGroup.remove(ejectionSystem);
                ejectionGeometry.dispose();
                ejectionMaterial.dispose();
            }
        });

        gsap.to(ejectionSystem.geometry.attributes.position.array, {
            duration: 3,
            ease: "power2.out",
            onUpdate: function () {
                const positions = this.targets()[0];
                for (let i = 0; i < ejectionCount; i++) {
                    positions[i * 3] += velocities[i * 3];
                    positions[i * 3 + 1] += velocities[i * 3 + 1];
                    positions[i * 3 + 2] += velocities[i * 3 + 2];
                }
                ejectionSystem.geometry.attributes.position.needsUpdate = true;
            }
        });
    }

    function setupScrollAnimations() {
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#scroll-content",
                start: "top top",
                end: "bottom bottom",
                scrub: 1.5
            }
        });

        tl.to(blackHoleGroup.rotation, { x: 0.5, y: Math.PI / 2 }, "start")
            .to(camera.position, { z: 12 }, "start");

        tl.to(camera.position, { z: 20, x: -5, y: 1 }, "about")
            .to(blackHoleGroup.rotation, { x: 0.8, y: Math.PI }, "about");

        tl.to(camera.position, { z: 22, x: 8, y: -2 }, "skills")
            .to(blackHoleGroup.rotation, { y: Math.PI * 1.5 }, "skills");

        tl.to(camera.position, { z: 18, x: 0, y: 0 }, "projects")
            .to(blackHoleGroup.rotation, { x: 0.2, y: Math.PI * 2 }, "projects");

        tl.to(camera.position, { z: 15, x: 0, y: 0 }, "contact")
            .to(blackHoleGroup.scale, { x: 1.2, y: 1.2, z: 1.2 }, "contact");

        // --- NEWLY ADDED SCROLL TRIGGER FOR THE BURST EFFECT ---
        ScrollTrigger.create({
            trigger: "#projects-section",
            start: "top center",
            onEnter: () => triggerParticleEjection(),
            onEnterBack: () => triggerParticleEjection()
        });

        document.querySelectorAll('.scroll-section').forEach((section) => {
            const content = section.querySelector('.content-box, .max-w-6xl');
            if (content) {
                gsap.fromTo(content, { opacity: 0, y: 100 }, {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 70%',
                        end: 'top 40%',
                        scrub: 1
                    },
                    opacity: 1,
                    y: 0
                });
            }
        });
    }

    function setupUIEventListeners() {
        let lastScrollY = window.scrollY;
        const header = document.getElementById('header');
        window.addEventListener('scroll', () => {
            if (window.scrollY > lastScrollY && window.scrollY > 100) { header.style.top = '-100px'; }
            else { header.style.top = '0'; }
            lastScrollY = window.scrollY;
        });

        const hamburgerBtn = document.getElementById('hamburger-btn');
        const mobileNavMenu = document.getElementById('mobile-nav-menu');
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('open');
            mobileNavMenu.classList.toggle('open');
        });

        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                gsap.to(window, { duration: 1.5, scrollTo: link.getAttribute('href'), ease: 'power2.inOut' });
                if (mobileNavMenu.classList.contains('open')) {
                    hamburgerBtn.classList.remove('open');
                    mobileNavMenu.classList.remove('open');
                }
            });
            if (link.dataset.section) {
                ScrollTrigger.create({ trigger: `#${link.dataset.section}`, start: "top center", end: "bottom center", onToggle: self => self.isActive ? link.classList.add('active') : link.classList.remove('active') });
            }
        });

        const projectModal = document.getElementById('project-modal');
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', () => {
                const project = portfolioData.projects.find(p => p.id === card.dataset.projectId);
                if (project) {
                    document.getElementById('modal-project-title').textContent = project.title;
                    document.getElementById('modal-project-description').innerHTML = project.description;
                    
                    // Handle multiple images or single image
                    const images = project.images || [project.imageUrl];
                    document.getElementById('modal-project-image').src = images[0];
                    
                    // Show second image if available
                    const secondImageElement = document.getElementById('modal-project-image-2');
                    if (images.length > 1) {
                        secondImageElement.src = images[1];
                        secondImageElement.classList.remove('hidden');
                    } else {
                        secondImageElement.classList.add('hidden');
                    }
                    
                    const techContainer = document.getElementById('modal-project-tech');
                    techContainer.innerHTML = '';
                    project.technologies.forEach(tech => { techContainer.innerHTML += `<span class="bg-gray-700/50 px-3 py-1 rounded-md text-orange-300">${tech}</span>`; });
                    const linksContainer = document.getElementById('modal-project-links');
                    linksContainer.innerHTML = '';
                    if (project.liveUrl && project.liveUrl !== '#') linksContainer.innerHTML += `<a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="project-link-btn primary">Live Demo</a>`;
                    if (project.sourceUrl && project.sourceUrl !== '#') linksContainer.innerHTML += `<a href="${project.sourceUrl}" target="_blank" rel="noopener noreferrer" class="project-link-btn secondary">Source Code</a>`;
                    projectModal.classList.add('active');
                }
            });
        });
        document.getElementById('close-project-modal-btn').addEventListener('click', () => projectModal.classList.remove('active'));
        projectModal.addEventListener('click', (e) => { if (e.target === projectModal) projectModal.classList.remove('active'); });

        // Experience Modal Handlers
        const experienceModal = document.getElementById('experience-modal');
        document.querySelectorAll('.experience-card').forEach(card => {
            card.addEventListener('click', () => {
                const jobIndex = parseInt(card.dataset.jobIndex);
                const job = portfolioData.experience[jobIndex];
                if (job) {
                    document.getElementById('modal-experience-position').textContent = job.position;
                    document.getElementById('modal-experience-company').textContent = job.company;
                    document.getElementById('modal-experience-duration').textContent = job.duration;
                    const achievementsContainer = document.getElementById('modal-experience-achievements');
                    achievementsContainer.innerHTML = '';
                    job.achievements.forEach(achievement => {
                        achievementsContainer.innerHTML += `<li class="text-gray-300">${achievement}</li>`;
                    });
                    experienceModal.classList.remove('closing');
                    experienceModal.classList.add('active');
                }
            });
        });
        const closeExperienceModal = () => {
            experienceModal.classList.add('closing');
            setTimeout(() => {
                experienceModal.classList.remove('active');
                experienceModal.classList.remove('closing');
            }, 500);
        };
        document.getElementById('close-experience-modal-btn').addEventListener('click', closeExperienceModal);
        experienceModal.addEventListener('click', (e) => { if (e.target === experienceModal) closeExperienceModal(); });

        // Certifications Modal Handlers
        const certificationsModal = document.getElementById('certifications-modal');
        document.querySelectorAll('.certification-card').forEach(card => {
            card.addEventListener('click', () => {
                const certIndex = parseInt(card.dataset.certIndex);
                const cert = portfolioData.certifications[certIndex];
                if (cert) {
                    document.getElementById('modal-cert-name').textContent = cert.name;
                    document.getElementById('modal-cert-issuer').textContent = cert.issuer;
                    certificationsModal.classList.remove('closing');
                    certificationsModal.classList.add('active');
                }
            });
        });
        const closeCertificationsModal = () => {
            certificationsModal.classList.add('closing');
            setTimeout(() => {
                certificationsModal.classList.remove('active');
                certificationsModal.classList.remove('closing');
            }, 500);
        };
        document.getElementById('close-certifications-modal-btn').addEventListener('click', closeCertificationsModal);
        certificationsModal.addEventListener('click', (e) => { if (e.target === certificationsModal) closeCertificationsModal(); });

        const contactModal = document.getElementById('contact-modal');
        const contactForm = document.getElementById('contact-form');
        const formContainer = document.getElementById('form-container');
        const successMessageContainer = document.getElementById('success-message-container');
        document.getElementById('get-in-touch-btn').addEventListener('click', () => { contactModal.classList.add('active'); });
        const closeContactModal = () => {
            contactModal.classList.remove('active');
            setTimeout(() => {
                formContainer.classList.remove('hidden');
                successMessageContainer.classList.add('hidden');
                contactForm.reset();
            }, 400);
        };
        document.getElementById('close-contact-modal-btn').addEventListener('click', closeContactModal);
        contactModal.addEventListener('click', (e) => { if (e.target === contactModal) closeContactModal(); });
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(new FormData(e.target)).toString() })
                .then(() => {
                    formContainer.classList.add('hidden');
                    successMessageContainer.classList.remove('hidden');
                })
                .catch(() => alert("Error submitting form."));
        });

        preloader.style.opacity = '0';
        setTimeout(() => preloader.style.display = 'none', 800);
    }

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        diskMaterial.uniforms.u_time.value = elapsedTime;
        jetMaterial.uniforms.u_time.value = elapsedTime;
        backgroundParticles.rotation.y -= 0.0001;
        diskMaterial.uniforms.u_time.value = elapsedTime;
        jetMaterial.uniforms.u_time.value = elapsedTime;
        backgroundParticles.rotation.y -= 0.0001;
        if (disk) disk.rotation.z -= 0.01; // Faster disk spin
        // Spin the jets if they are in the group
        // The jets are children of blackHoleGroup. Let's rotate the individual jets around Y axis of group?
        // Actually, jets are cones pointing up/down. Rotating them on their Y axis (height axis) might look like spinning.
        // Assuming they were added to blackHoleGroup.
        // Let's rely on Shader for the "flow" speed (which I increased to 8.0) and rotate the disk faster.
        // Creating a "pulsar" effect usually implies the beam sweeps, but here it's a fixed vertical jet. 
        // "Spinning with more speed" likely refers to the texture speed I updated in shader.
        // I will just update the disk rotation to be slightly faster as requested "realism in disk".

        if (window.innerWidth > 768) {
            camera.position.x += (mouse.x * 2 - camera.position.x) * 0.02;
            camera.position.y += (-mouse.y * 2 - camera.position.y) * 0.02;
        }
        camera.lookAt(scene.position);

        composer.render();
    }

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);
    });

    window.addEventListener('mousemove', (e) => {
        mouse.x = (e.clientX / window.innerWidth) - 0.5;
        mouse.y = (e.clientY / window.innerHeight) - 0.5;
    });
});
