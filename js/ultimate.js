/**
 * VOLTAGE Ultimate - Clean Minimal Design
 */

// Simple particle network
class ParticleNetwork {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null };
        this.count = 60;
        this.maxDistance = 150;
    }

    init() {
        if (!this.canvas) return;
        this.resize();
        this.createParticles();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', e => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.createParticles();
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: 2 + Math.random() * 2
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update particles
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;
        });

        // Draw connections
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < this.maxDistance) {
                    const opacity = (1 - dist / this.maxDistance) * 0.5;
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(0, 255, 255, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }

        // Draw particles
        this.particles.forEach(p => {
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(0, 255, 255, 0.8)';
            this.ctx.fill();
        });

        // Mouse interaction
        if (this.mouse.x && this.mouse.y) {
            this.particles.forEach(p => {
                const dx = this.mouse.x - p.x;
                const dy = this.mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const opacity = (1 - dist / 150) * 0.8;
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(255, 0, 255, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(this.mouse.x, this.mouse.y);
                    this.ctx.lineTo(p.x, p.y);
                    this.ctx.stroke();
                }
            });
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Preloader
class Preloader {
    constructor() {
        this.preloader = document.querySelector('.preloader');
    }

    init() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    if (this.preloader) {
                        this.preloader.classList.add('loaded');
                        document.body.classList.add('loaded');
                    }
                }, 300);
            }
        }, 100);
    }
}

// Navigation
class Navigation {
    init() {
        const navbar = document.querySelector('.navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar?.classList.add('scrolled');
            } else {
                navbar?.classList.remove('scrolled');
            }
        });

        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                target?.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }
}

// Stats counter
class StatsCounter {
    init() {
        const stats = document.querySelectorAll('.stat-number');
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.count) || parseInt(el.textContent) || 100;
                    let current = 0;
                    const increment = target / 50;
                    const counter = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            el.textContent = target + '+';
                            clearInterval(counter);
                        } else {
                            el.textContent = Math.floor(current) + '+';
                        }
                    }, 30);
                    observer.unobserve(el);
                }
            });
        });
        stats.forEach(stat => observer.observe(stat));
    }
}

// Portfolio Filter
class PortfolioFilter {
    init() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const items = document.querySelectorAll('.portfolio-item');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;

                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                items.forEach(item => {
                    const categories = item.dataset.category.split(' ');
                    if (filter === 'all' || categories.includes(filter)) {
                        item.style.display = 'block';
                        item.style.animation = 'fadeIn 0.5s ease forwards';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
}

// Case Study Modal
class CaseStudyModal {
    constructor() {
        this.modal = document.getElementById('caseStudyModal');
        this.projects = {
            'boulevard': {
                title: 'بوليفارد الرياض',
                category: 'نيون & LED',
                year: '2023',
                image: 'images/portfolio/portfolio-1.jpeg',
                description: 'مشروع ضخم لتجربة ألعاب وإضاءات نيون في موسم الرياض، شمل مسارات ضوئية تفاعلية تمتد على مساحات واسعة، جدران نيون بتصاميم فنية فريدة، وتجربة مستقبلية كاملة تجمع بين التقنية والفن.',
                services: ['تصميم وتنفيذ نيون مخصص', 'شاشات LED تفاعلية', 'مسارات ضوئية', 'أنظمة صوت محيطي'],
                challenges: 'تطلب المشروع تنسيقاً دقيقاً مع الجهات الرسمية والتعامل مع ظروف جوية متغيرة، مع الحفاظ على أعلى معايير السلامة والجودة.',
                stats: { area: '5000 م²', duration: '45 يوم', team: '35 فني' }
            },
            'snapchat': {
                title: 'مقر سناب شات',
                category: 'نيون مخصص',
                year: 'الرياض',
                image: 'images/portfolio/portfolio-2.jpeg',
                description: 'تصميم وتنفيذ إضاءات نيون مخصصة لمقر سناب شات الإقليمي في الرياض، تعكس هوية العلامة التجارية بأسلوب عصري ومبتكر مع مساحات ملهمة للموظفين.',
                services: ['نيون مخصص بألوان الهوية', 'ديكور داخلي مبتكر', 'إضاءة محيطية', 'لوحات فنية ضوئية'],
                challenges: 'التحدي الأكبر كان دمج هوية سناب شات الديناميكية مع بيئة عمل احترافية، مع ضمان كفاءة الإضاءة وطول عمرها.',
                stats: { area: '800 م²', duration: '21 يوم', team: '12 فني' }
            },
            'asool': {
                title: 'أصول العقارية',
                category: 'بوث معرض',
                year: '2025',
                image: 'images/portfolio/portfolio-3.jpeg',
                description: 'تصميم معماري متميز لبوث أصول العقارية في معرض العقارات، مع إضاءة ديناميكية وأعمدة مضيئة متناسقة تبرز المشاريع العقارية بشكل احترافي.',
                services: ['تصميم بوث 3D', 'إضاءة معمارية', 'شاشات عرض LED', 'تجهيزات استقبال VIP'],
                challenges: 'تحقيق توازن بين الفخامة والعملية، مع إبراز المشاريع العقارية بتقنيات عرض متطورة.',
                stats: { area: '200 م²', duration: '14 يوم', team: '18 فني' }
            },
            'misk': {
                title: 'مؤسسة مسك',
                category: 'فعالية',
                year: '2022',
                image: 'images/portfolio/portfolio-4.jpeg',
                description: 'تنظيم وتنفيذ فعالية مؤسسة مسك مع هوية بصرية فاخرة، تصميم مميز، وإضاءة متوازنة تبهر الزوّار وتعكس رسالة المؤسسة.',
                services: ['إدارة الفعالية كاملة', 'تصميم الهوية البصرية', 'إضاءة احترافية', 'أنظمة صوت متقدمة'],
                challenges: 'ضمان تجربة زوار استثنائية تتناسب مع مكانة مؤسسة مسك، مع تنسيق كامل لجميع عناصر الفعالية.',
                stats: { area: '1500 م²', duration: '30 يوم', team: '45 فني' }
            },
            'invest-saudi': {
                title: 'استثمر في السعودية',
                category: 'معرض تقني',
                year: '2025',
                image: 'images/portfolio/portfolio-5.jpeg',
                description: 'أعمدة رقمية تفاعلية وشاشات LED متطورة في معرض استثمر في السعودية، بتصميم يمزج التقنية بالحداثة لعرض الفرص الاستثمارية في المملكة.',
                services: ['أعمدة LED رقمية', 'شاشات تفاعلية', 'تصميم بوث تقني', 'محتوى رقمي ديناميكي'],
                challenges: 'دمج أحدث التقنيات التفاعلية مع رسالة واضحة عن الفرص الاستثمارية السعودية.',
                stats: { area: '350 م²', duration: '25 يوم', team: '22 فني' }
            },
            'aramex': {
                title: 'مقر أرامكس الرئيسي',
                category: 'نيون',
                year: 'الرياض',
                image: 'images/portfolio/portfolio-6.jpeg',
                description: 'إضاءات نيون عالية الجودة لمقر أرامكس الرئيسي، بتشكيل محكم ولمعان قوي يعكس ديناميكية العلامة التجارية.',
                services: ['نيون مخصص', 'إضاءة واجهات', 'تصميم لوجو مضيء', 'صيانة دورية'],
                challenges: 'ضمان متانة الإضاءة لسنوات مع الحفاظ على كثافة الإضاءة واللون.',
                stats: { area: '150 م²', duration: '10 أيام', team: '8 فني' }
            },
            'manahel': {
                title: 'مناهل العقارية',
                category: 'بوث معرض',
                year: '2022',
                image: 'images/portfolio/portfolio-7.jpeg',
                description: 'بوث عصري بخطوط هندسية أنيقة وشخصية بصرية قوية تميز العلامة التجارية في معرض العقارات.',
                services: ['تصميم بوث مخصص', 'إضاءة معمارية', 'تجهيزات عرض', 'ديكور داخلي'],
                challenges: 'إبراز الهوية البصرية للشركة مع تحقيق أقصى استفادة من المساحة المتاحة.',
                stats: { area: '120 م²', duration: '12 يوم', team: '14 فني' }
            },
            'road': {
                title: 'Road Accelerator Fund',
                category: 'معرض',
                year: '2024',
                image: 'images/portfolio/portfolio-8.jpeg',
                description: 'هندسة انسيابية مع ألوان راقية ومساحات استقبال احترافية لصندوق رود للاستثمار.',
                services: ['تصميم بوث', 'إضاءة محيطية', 'تجهيزات استقبال', 'شاشات عرض'],
                challenges: 'تصميم مساحة تعكس رؤية الصندوق الاستثمارية بأسلوب عصري.',
                stats: { area: '80 م²', duration: '8 أيام', team: '10 فني' }
            },
            'transnet': {
                title: 'Transnet',
                category: 'معرض',
                year: '2024',
                image: 'images/portfolio/portfolio-9.jpeg',
                description: 'هوية حديثة مع إضاءة دقيقة وواجهات عرض متكاملة لشركة النقل والخدمات اللوجستية.',
                services: ['تصميم بوث', 'واجهات عرض', 'إضاءة LED', 'جرافيك الهوية'],
                challenges: 'إبراز خدمات النقل بطريقة جذابة ومهنية.',
                stats: { area: '100 م²', duration: '10 أيام', team: '12 فني' }
            },
            'aljazea': {
                title: 'الجازع الصناعية',
                category: 'معرض صناعي',
                year: '2021',
                image: 'images/portfolio/portfolio-10.jpeg',
                description: 'تصميم يتناسب مع الهوية الصناعية للشركة مع إبراز المنتجات بوضوح واحترافية.',
                services: ['تصميم بوث صناعي', 'منصات عرض منتجات', 'إضاءة موجهة', 'جرافيك صناعي'],
                challenges: 'عرض المنتجات الصناعية بطريقة تجذب الزوار وتوضح مزاياها.',
                stats: { area: '90 م²', duration: '7 أيام', team: '10 فني' }
            },
            'sab-neon': {
                title: 'البنك الأول - SAB',
                category: 'نيون',
                year: 'الرياض',
                image: 'images/portfolio/portfolio-11.jpeg',
                description: 'نيون عالي الجودة يعكس هوية البنك الأول بأناقة ومهنية.',
                services: ['نيون مخصص', 'لوحات إرشادية مضيئة', 'إضاءة واجهات'],
                challenges: 'تحقيق معايير البنك الصارمة مع الحفاظ على الجمالية.',
                stats: { area: '60 م²', duration: '5 أيام', team: '6 فني' }
            },
            'boulevard-2025': {
                title: 'البوليفارد 2025',
                category: 'نيون & LED',
                year: '2025',
                image: 'images/portfolio/portfolio-12.jpeg',
                description: 'تجربة ألعاب وإضاءات نيون متطورة للموسم الجديد من البوليفارد، مع تقنيات أحدث وتصاميم أكثر إبهاراً.',
                services: ['نيون متطور', 'شاشات LED ضخمة', 'تجارب تفاعلية', 'إضاءة ديناميكية'],
                challenges: 'تجاوز التوقعات من الموسم السابق مع ابتكار تجارب جديدة.',
                stats: { area: '8000 م²', duration: '60 يوم', team: '50 فني' }
            }
        };
    }

    init() {
        if (!this.modal) return;

        // View case study buttons
        document.querySelectorAll('.view-case-study').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const item = btn.closest('.portfolio-item');
                const projectId = item.dataset.project;
                if (this.projects[projectId]) {
                    this.openModal(projectId);
                }
            });
        });

        // Close modal
        this.modal.querySelector('.modal-close').addEventListener('click', () => {
            this.closeModal();
        });

        this.modal.querySelector('.modal-backdrop').addEventListener('click', () => {
            this.closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });
    }

    openModal(projectId) {
        const project = this.projects[projectId];

        this.modal.querySelector('.case-category').textContent = project.category;
        this.modal.querySelector('.case-title').textContent = project.title;
        this.modal.querySelector('.case-year').textContent = project.year;
        this.modal.querySelector('.case-study-image img').src = project.image;
        this.modal.querySelector('.case-description').textContent = project.description;

        const servicesList = this.modal.querySelector('.case-services');
        servicesList.innerHTML = project.services.map(s => `<li>${s}</li>`).join('');

        this.modal.querySelector('.case-challenges').textContent = project.challenges;

        const stats = this.modal.querySelectorAll('.case-stat .stat-value');
        stats[0].textContent = project.stats.area;
        stats[1].textContent = project.stats.duration;
        stats[2].textContent = project.stats.team;

        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new Preloader().init();
    new ParticleNetwork().init();
    new Navigation().init();
    new StatsCounter().init();
    new PortfolioFilter().init();
    new CaseStudyModal().init();
});

// Add fadeIn animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

console.log('⚡ VOLTAGE Ultimate Loaded - Enhanced Portfolio Edition');

// ========================================
// ULTIMATE GALLERY SYSTEM - 343+ Images
// ========================================

class UltimateGallery {
    constructor(config = {}) {
        // Support both old single gallery and new dual gallery setup
        this.galleryId = config.galleryId || 'ultimateGallery';
        this.loadMoreBtnId = config.loadMoreBtnId || 'loadMoreBtn';
        this.remainingCountId = config.remainingCountId || 'remainingCount';
        this.categoryFilter = config.categoryFilter || 'all'; // 'neon', 'events', or 'all'

        this.gallery = document.getElementById(this.galleryId);
        this.loadMoreBtn = document.getElementById(this.loadMoreBtnId);
        this.remainingCount = document.getElementById(this.remainingCountId);
        this.progressBar = document.getElementById('progressBar');
        this.progressText = document.getElementById('progressText');
        this.galleryLoading = document.getElementById('galleryLoading');
        this.searchInput = document.getElementById('gallerySearch');
        this.lightbox = document.getElementById('premiumLightbox');

        this.currentFilter = 'all';
        this.currentSubcategory = null;
        this.currentView = 'grid';
        this.itemsPerPage = 12;
        this.currentPage = 0;
        this.filteredImages = [];
        this.allImages = [];
        this.currentLightboxIndex = 0;
        this.slideshowInterval = null;
        this.isZoomed = false;

        // Build image database
        this.buildImageDatabase();
    }

    buildImageDatabase() {
        // Use gallery-data.js if available, otherwise use fallback
        if (typeof projectImages !== 'undefined' && typeof projectMeta !== 'undefined') {
            this.allImages = [];
            for (const [projectKey, images] of Object.entries(projectImages)) {
                const meta = projectMeta[projectKey] || { nameAr: projectKey, nameEn: projectKey, category: 'neon' };

                // Filter by category if specified
                const isNeonCategory = meta.category === 'neon' || meta.category === 'coffee' || meta.category === 'games' || meta.category === 'national';
                const isEventsCategory = meta.category === 'events';

                // Skip if category filter doesn't match
                if (this.categoryFilter === 'neon' && !isNeonCategory) continue;
                if (this.categoryFilter === 'events' && !isEventsCategory) continue;

                images.forEach((src, index) => {
                    this.allImages.push({
                        src: src,
                        category: meta.category,
                        subcategory: projectKey,
                        title: meta.nameEn,
                        titleAr: meta.nameAr,
                        featured: index === 0 // First image of each project is featured
                    });
                });
            }
        } else {
            // Fallback - use relative paths to Images folder
            this.allImages = [
                // EVENTS - ZAHID
                { src: 'images/Event Project/شركة مصنع الزاهد/شركة_مصنع_الزاهد_1.png', category: 'events', subcategory: 'zahid', title: 'Al-Zahid Factory', titleAr: 'شركة مصنع الزاهد', featured: true },
            { src: 'images/projects/events/zahid/5922304811204284590.jpg', category: 'events', subcategory: 'zahid', title: 'مصنع الزاهد', titleAr: 'شركة مصنع الزاهد' },
            { src: 'images/projects/events/zahid/5922304811204284591.jpg', category: 'events', subcategory: 'zahid', title: 'مصنع الزاهد', titleAr: 'شركة مصنع الزاهد' },
            { src: 'images/projects/events/zahid/5922304811204284592.jpg', category: 'events', subcategory: 'zahid', title: 'مصنع الزاهد', titleAr: 'شركة مصنع الزاهد' },
            { src: 'images/projects/events/zahid/5922304811204284593.jpg', category: 'events', subcategory: 'zahid', title: 'مصنع الزاهد', titleAr: 'شركة مصنع الزاهد' },
            { src: 'images/projects/events/zahid/5922304811204284594.jpg', category: 'events', subcategory: 'zahid', title: 'مصنع الزاهد', titleAr: 'شركة مصنع الزاهد' },
            { src: 'images/projects/events/zahid/5922304811204284595.jpg', category: 'events', subcategory: 'zahid', title: 'مصنع الزاهد', titleAr: 'شركة مصنع الزاهد' },
            { src: 'images/projects/events/zahid/5922304811204284596.jpg', category: 'events', subcategory: 'zahid', title: 'مصنع الزاهد', titleAr: 'شركة مصنع الزاهد' },
            { src: 'images/projects/events/zahid/5922304811204284597.jpg', category: 'events', subcategory: 'zahid', title: 'مصنع الزاهد', titleAr: 'شركة مصنع الزاهد' },
            { src: 'images/projects/events/zahid/5922304811204284598.jpg', category: 'events', subcategory: 'zahid', title: 'مصنع الزاهد', titleAr: 'شركة مصنع الزاهد' },
            { src: 'images/projects/events/zahid/5922304811204284599.jpg', category: 'events', subcategory: 'zahid', title: 'مصنع الزاهد', titleAr: 'شركة مصنع الزاهد' },
            { src: 'images/projects/events/zahid/5922304811204284600.jpg', category: 'events', subcategory: 'zahid', title: 'مصنع الزاهد', titleAr: 'شركة مصنع الزاهد' },
            { src: 'images/projects/events/zahid/Alzahid.png', category: 'events', subcategory: 'zahid', title: 'مصنع الزاهد', titleAr: 'شركة مصنع الزاهد', featured: true },
            { src: 'images/projects/events/zahid/WhatsApp Image 2025-12-13 at 9.33.41 AM.jpeg', category: 'events', subcategory: 'zahid', title: 'مصنع الزاهد', titleAr: 'شركة مصنع الزاهد' },
            { src: 'images/projects/events/zahid/WhatsApp Image 2025-12-13 at 9.33.42 AM.jpeg', category: 'events', subcategory: 'zahid', title: 'مصنع الزاهد', titleAr: 'شركة مصنع الزاهد' },
            { src: 'images/projects/events/zahid/WhatsApp Image 2025-12-13 at 9.33.43 AM.jpeg', category: 'events', subcategory: 'zahid', title: 'مصنع الزاهد', titleAr: 'شركة مصنع الزاهد' },
            { src: 'images/projects/events/zahid/WhatsApp Image 2025-12-13 at 9.33.44 AM.jpeg', category: 'events', subcategory: 'zahid', title: 'مصنع الزاهد', titleAr: 'شركة مصنع الزاهد' },

            // EVENTS - SABAHAT (7 images)
            { src: 'images/projects/events/sabahat/WhatsApp Image 2025-12-20 at 12.36.42 PM.jpeg', category: 'events', subcategory: 'sabahat', title: 'صباحات', titleAr: 'فعالية صباحات', featured: true },
            { src: 'images/projects/events/sabahat/WhatsApp Image 2025-12-20 at 12.37.46 PM.jpeg', category: 'events', subcategory: 'sabahat', title: 'صباحات', titleAr: 'فعالية صباحات' },
            { src: 'images/projects/events/sabahat/ChatGPT Image 20 ديسمبر 2025، 12_45_24 م.png', category: 'events', subcategory: 'sabahat', title: 'صباحات', titleAr: 'فعالية صباحات' },
            { src: 'images/projects/events/sabahat/ChatGPT Image 20 ديسمبر 2025، 12_47_11 م.png', category: 'events', subcategory: 'sabahat', title: 'صباحات', titleAr: 'فعالية صباحات' },
            { src: 'images/projects/events/sabahat/ChatGPT Image 20 ديسمبر 2025، 12_49_51 م.png', category: 'events', subcategory: 'sabahat', title: 'صباحات', titleAr: 'فعالية صباحات' },
            { src: 'images/projects/events/sabahat/ChatGPT Image 20 ديسمبر 2025، 12_55_18 م.png', category: 'events', subcategory: 'sabahat', title: 'صباحات', titleAr: 'فعالية صباحات' },

            // EVENTS - BOOTH PICTURES (23 images)
            { src: 'images/projects/events/booth-pictures/38a7bca4385fbc9c231b7dcd8e38b554.jpg', category: 'events', subcategory: 'booth', title: 'تصاميم البوثات', titleAr: 'بوثات عصرية', featured: true },
            { src: 'images/projects/events/booth-pictures/9cd5ef41d7704f0f519d04d780c19e7b.jpg', category: 'events', subcategory: 'booth', title: 'بوثات', titleAr: 'بوثات احترافية' },
            { src: 'images/projects/events/booth-pictures/2ce12bc9b42bf9477b5f2fcc5e6dbf20.jpg', category: 'events', subcategory: 'booth', title: 'بوثات', titleAr: 'بوثات احترافية' },
            { src: 'images/projects/events/booth-pictures/651f773713422d65a1edd45fe481eeeb.jpg', category: 'events', subcategory: 'booth', title: 'بوثات', titleAr: 'بوثات احترافية' },
            { src: 'images/projects/events/booth-pictures/f959a6ec835e92a5c886744ff1db41a8.jpg', category: 'events', subcategory: 'booth', title: 'بوثات', titleAr: 'بوثات احترافية' },
            { src: 'images/projects/events/booth-pictures/00e79c27569b86d31b124dc542042852.jpg', category: 'events', subcategory: 'booth', title: 'بوثات', titleAr: 'بوثات احترافية' },
            { src: 'images/projects/events/booth-pictures/ac37b3af2e55c616f7346aa9f4cc0231.jpg', category: 'events', subcategory: 'booth', title: 'بوثات', titleAr: 'بوثات احترافية' },
            { src: 'images/projects/events/booth-pictures/fdbcf3c0a9a0b08a97a01335aa4cf724.jpg', category: 'events', subcategory: 'booth', title: 'بوثات', titleAr: 'بوثات احترافية' },
            { src: 'images/projects/events/booth-pictures/c25d0d8a182f81b9ebf89f8dc03c2f3e.jpg', category: 'events', subcategory: 'booth', title: 'بوثات', titleAr: 'بوثات احترافية' },
            { src: 'images/projects/events/booth-pictures/da353d9b128ade256d32f695fb0f354e.jpg', category: 'events', subcategory: 'booth', title: 'بوثات', titleAr: 'بوثات احترافية' },
            { src: 'images/projects/events/booth-pictures/3e1596dd2cbd28be7940da25c088d3d2.jpg', category: 'events', subcategory: 'booth', title: 'بوثات', titleAr: 'بوثات احترافية' },
            { src: 'images/projects/events/booth-pictures/a24ef8d02225480862f577cbd33eed59.jpg', category: 'events', subcategory: 'booth', title: 'بوثات', titleAr: 'بوثات احترافية' },
            { src: 'images/projects/events/booth-pictures/effcd8d821c9d5cf1acd854f198a529c.jpg', category: 'events', subcategory: 'booth', title: 'بوثات', titleAr: 'بوثات احترافية' },
            { src: 'images/projects/events/booth-pictures/b7ee734f4c83db48921f0c90af1352d4.jpg', category: 'events', subcategory: 'booth', title: 'بوثات', titleAr: 'بوثات احترافية' },
            { src: 'images/projects/events/booth-pictures/1132b4dcc866b37bbde694e43a5a0f25.jpg', category: 'events', subcategory: 'booth', title: 'بوثات', titleAr: 'بوثات احترافية' },
            { src: 'images/projects/events/booth-pictures/6525acc686e65bbe21e10d23822c9b85.jpg', category: 'events', subcategory: 'booth', title: 'بوثات', titleAr: 'بوثات احترافية' },
            { src: 'images/projects/events/booth-pictures/WhatsApp Image 2025-12-08 at 6.57.44 PM.jpeg', category: 'events', subcategory: 'booth', title: 'بوثات', titleAr: 'بوثات احترافية' },
            { src: 'images/projects/events/booth-pictures/WhatsApp Image 2025-12-08 at 6.57.45 PM.jpeg', category: 'events', subcategory: 'booth', title: 'بوثات', titleAr: 'بوثات احترافية' },
            { src: 'images/projects/events/booth-pictures/WhatsApp Image 2025-12-06 at 12.22.31 PM.jpeg', category: 'events', subcategory: 'booth', title: 'بوثات', titleAr: 'بوثات احترافية' },

            // EVENTS - NAJEZ (7 images)
            { src: 'images/projects/events/najez/5913614756629646477 (1).jpg', category: 'events', subcategory: 'najez', title: 'ناجز', titleAr: 'منصة ناجز', featured: true },
            { src: 'images/projects/events/najez/5913614756629646478.jpg', category: 'events', subcategory: 'najez', title: 'ناجز', titleAr: 'منصة ناجز' },
            { src: 'images/projects/events/najez/5913614756629646479.jpg', category: 'events', subcategory: 'najez', title: 'ناجز', titleAr: 'منصة ناجز' },
            { src: 'images/projects/events/najez/5913614756629646481.jpg', category: 'events', subcategory: 'najez', title: 'ناجز', titleAr: 'منصة ناجز' },
            { src: 'images/projects/events/najez/5913614756629646482.jpg', category: 'events', subcategory: 'najez', title: 'ناجز', titleAr: 'منصة ناجز' },
            { src: 'images/projects/events/najez/5913614756629646483.jpg', category: 'events', subcategory: 'najez', title: 'ناجز', titleAr: 'منصة ناجز' },
            { src: 'images/projects/events/najez/5913614756629646484.jpg', category: 'events', subcategory: 'najez', title: 'ناجز', titleAr: 'منصة ناجز' },

            // EVENTS - ASOOL (28 images)
            { src: 'images/projects/events/asool/5956063941341858129.jpg', category: 'events', subcategory: 'asool', title: 'أصول العقارية', titleAr: 'شركة أصول العقارية', featured: true },
            { src: 'images/projects/events/asool/5906488263420528757.jpg', category: 'events', subcategory: 'asool', title: 'أصول العقارية', titleAr: 'شركة أصول العقارية' },
            { src: 'images/projects/events/asool/5908740063234213671 (1).jpg', category: 'events', subcategory: 'asool', title: 'أصول العقارية', titleAr: 'شركة أصول العقارية' },
            { src: 'images/projects/events/asool/5908740063234213672 (1).jpg', category: 'events', subcategory: 'asool', title: 'أصول العقارية', titleAr: 'شركة أصول العقارية' },
            { src: 'images/projects/events/asool/5908740063234213673.jpg', category: 'events', subcategory: 'asool', title: 'أصول العقارية', titleAr: 'شركة أصول العقارية' },
            { src: 'images/projects/events/asool/5908740063234213674 (1).jpg', category: 'events', subcategory: 'asool', title: 'أصول العقارية', titleAr: 'شركة أصول العقارية' },
            { src: 'images/projects/events/asool/5908740063234213675 (1).jpg', category: 'events', subcategory: 'asool', title: 'أصول العقارية', titleAr: 'شركة أصول العقارية' },
            { src: 'images/projects/events/asool/5908740063234213676.jpg', category: 'events', subcategory: 'asool', title: 'أصول العقارية', titleAr: 'شركة أصول العقارية' },
            { src: 'images/projects/events/asool/5908740063234213677.jpg', category: 'events', subcategory: 'asool', title: 'أصول العقارية', titleAr: 'شركة أصول العقارية' },
            { src: 'images/projects/events/asool/5956063941341858131.jpg', category: 'events', subcategory: 'asool', title: 'أصول العقارية', titleAr: 'شركة أصول العقارية' },
            { src: 'images/projects/events/asool/5956063941341858135.jpg', category: 'events', subcategory: 'asool', title: 'أصول العقارية', titleAr: 'شركة أصول العقارية' },
            { src: 'images/projects/events/asool/6005908707554216579.jpg', category: 'events', subcategory: 'asool', title: 'أصول العقارية', titleAr: 'شركة أصول العقارية' },
            { src: 'images/projects/events/asool/6005908707554216580.jpg', category: 'events', subcategory: 'asool', title: 'أصول العقارية', titleAr: 'شركة أصول العقارية' },
            { src: 'images/projects/events/asool/6005908707554216581.jpg', category: 'events', subcategory: 'asool', title: 'أصول العقارية', titleAr: 'شركة أصول العقارية' },
            { src: 'images/projects/events/asool/WhatsApp Image 2025-11-02 at 8.57.31 PM.jpeg', category: 'events', subcategory: 'asool', title: 'أصول العقارية', titleAr: 'شركة أصول العقارية' },
            { src: 'images/projects/events/asool/WhatsApp Image 2025-11-10 at 12.20.23 PM.jpeg', category: 'events', subcategory: 'asool', title: 'أصول العقارية', titleAr: 'شركة أصول العقارية' },
            { src: 'images/projects/events/asool/WhatsApp Image 2025-11-10 at 12.20.39 PM.jpeg', category: 'events', subcategory: 'asool', title: 'أصول العقارية', titleAr: 'شركة أصول العقارية' },
            { src: 'images/projects/events/asool/WhatsApp Image 2025-11-10 at 12.20.55 PM.jpeg', category: 'events', subcategory: 'asool', title: 'أصول العقارية', titleAr: 'شركة أصول العقارية' },

            // EVENTS - TAWAL (2 images)
            { src: 'images/projects/events/tawal/58451455.png', category: 'events', subcategory: 'tawal', title: 'تاول كوم', titleAr: 'شركة تاول كوم', featured: true },
            { src: 'images/projects/events/tawal/58476544.png', category: 'events', subcategory: 'tawal', title: 'تاول كوم', titleAr: 'شركة تاول كوم' },

            // NEON - BOULEVARD (21 images)
            { src: 'images/projects/neon/boulevard/5922293163252976673.jpg', category: 'neon', subcategory: 'boulevard', title: 'بوليفارد الرياض', titleAr: 'بوليفارد الرياض', featured: true },
            { src: 'images/projects/neon/boulevard/5922293163252976674.jpg', category: 'neon', subcategory: 'boulevard', title: 'بوليفارد الرياض', titleAr: 'بوليفارد الرياض' },
            { src: 'images/projects/neon/boulevard/5922293163252976675.jpg', category: 'neon', subcategory: 'boulevard', title: 'بوليفارد الرياض', titleAr: 'بوليفارد الرياض' },
            { src: 'images/projects/neon/boulevard/5922293163252976676.jpg', category: 'neon', subcategory: 'boulevard', title: 'بوليفارد الرياض', titleAr: 'بوليفارد الرياض' },
            { src: 'images/projects/neon/boulevard/5922293163252976662.jpg', category: 'neon', subcategory: 'boulevard', title: 'بوليفارد الرياض', titleAr: 'بوليفارد الرياض' },
            { src: 'images/projects/neon/boulevard/photo1703403285.jpeg', category: 'neon', subcategory: 'boulevard', title: 'بوليفارد الرياض', titleAr: 'بوليفارد الرياض' },
            { src: 'images/projects/neon/boulevard/photo1703403285 (1).jpeg', category: 'neon', subcategory: 'boulevard', title: 'بوليفارد الرياض', titleAr: 'بوليفارد الرياض' },
            { src: 'images/projects/neon/boulevard/photo1703403285 (2).jpeg', category: 'neon', subcategory: 'boulevard', title: 'بوليفارد الرياض', titleAr: 'بوليفارد الرياض' },
            { src: 'images/projects/neon/boulevard/photo1703403285 (20).jpeg', category: 'neon', subcategory: 'boulevard', title: 'بوليفارد الرياض', titleAr: 'بوليفارد الرياض' },
            { src: 'images/projects/neon/boulevard/photo1703403285 (21).jpeg', category: 'neon', subcategory: 'boulevard', title: 'بوليفارد الرياض', titleAr: 'بوليفارد الرياض' },
            { src: 'images/projects/neon/boulevard/photo1703403285 (22).jpeg', category: 'neon', subcategory: 'boulevard', title: 'بوليفارد الرياض', titleAr: 'بوليفارد الرياض' },
            { src: 'images/projects/neon/boulevard/photo1703403285 (24).jpeg', category: 'neon', subcategory: 'boulevard', title: 'بوليفارد الرياض', titleAr: 'بوليفارد الرياض' },
            { src: 'images/projects/neon/boulevard/photo1703403285 (25).jpeg', category: 'neon', subcategory: 'boulevard', title: 'بوليفارد الرياض', titleAr: 'بوليفارد الرياض' },
            { src: 'images/projects/neon/boulevard/photo1703403285 (26).jpeg', category: 'neon', subcategory: 'boulevard', title: 'بوليفارد الرياض', titleAr: 'بوليفارد الرياض' },
            { src: 'images/projects/neon/boulevard/photo1703403285 (27).jpeg', category: 'neon', subcategory: 'boulevard', title: 'بوليفارد الرياض', titleAr: 'بوليفارد الرياض' },
            { src: 'images/projects/neon/boulevard/photo1703403285 (28).jpeg', category: 'neon', subcategory: 'boulevard', title: 'بوليفارد الرياض', titleAr: 'بوليفارد الرياض' },
            { src: 'images/projects/neon/boulevard/photo1703403285 (29).jpeg', category: 'neon', subcategory: 'boulevard', title: 'بوليفارد الرياض', titleAr: 'بوليفارد الرياض' },
            { src: 'images/projects/neon/boulevard/photo1703403285 (30).jpeg', category: 'neon', subcategory: 'boulevard', title: 'بوليفارد الرياض', titleAr: 'بوليفارد الرياض' },
            { src: 'images/projects/neon/boulevard/WhatsApp Image 2023-11-19 at 7.53.37 PM (1).jpeg', category: 'neon', subcategory: 'boulevard', title: 'بوليفارد الرياض', titleAr: 'بوليفارد الرياض' },
            { src: 'images/projects/neon/boulevard/WhatsApp Image 2023-11-19 at 7.53.37 PM (2).jpeg', category: 'neon', subcategory: 'boulevard', title: 'بوليفارد الرياض', titleAr: 'بوليفارد الرياض' },

            // NEON - ARAMEX (14 images)
            { src: 'images/projects/neon/aramex/1.1.png', category: 'neon', subcategory: 'aramex', title: 'أرامكس', titleAr: 'مقر أرامكس الرئيسي', featured: true },
            { src: 'images/projects/neon/aramex/1.2.png', category: 'neon', subcategory: 'aramex', title: 'أرامكس', titleAr: 'مقر أرامكس الرئيسي' },
            { src: 'images/projects/neon/aramex/1.3.png', category: 'neon', subcategory: 'aramex', title: 'أرامكس', titleAr: 'مقر أرامكس الرئيسي' },
            { src: 'images/projects/neon/aramex/1.4.png', category: 'neon', subcategory: 'aramex', title: 'أرامكس', titleAr: 'مقر أرامكس الرئيسي' },
            { src: 'images/projects/neon/aramex/1.5.png', category: 'neon', subcategory: 'aramex', title: 'أرامكس', titleAr: 'مقر أرامكس الرئيسي' },
            { src: 'images/projects/neon/aramex/5839185069330253243.jpg', category: 'neon', subcategory: 'aramex', title: 'أرامكس', titleAr: 'مقر أرامكس الرئيسي' },
            { src: 'images/projects/neon/aramex/5839185069330253244.jpg', category: 'neon', subcategory: 'aramex', title: 'أرامكس', titleAr: 'مقر أرامكس الرئيسي' },
            { src: 'images/projects/neon/aramex/5839185069330253245.jpg', category: 'neon', subcategory: 'aramex', title: 'أرامكس', titleAr: 'مقر أرامكس الرئيسي' },
            { src: 'images/projects/neon/aramex/5839185069330253246.jpg', category: 'neon', subcategory: 'aramex', title: 'أرامكس', titleAr: 'مقر أرامكس الرئيسي' },
            { src: 'images/projects/neon/aramex/5839185069330253247.jpg', category: 'neon', subcategory: 'aramex', title: 'أرامكس', titleAr: 'مقر أرامكس الرئيسي' },
            { src: 'images/projects/neon/aramex/photo1700726390.jpeg', category: 'neon', subcategory: 'aramex', title: 'أرامكس', titleAr: 'مقر أرامكس الرئيسي' },
            { src: 'images/projects/neon/aramex/photo1700726390 (1).jpeg', category: 'neon', subcategory: 'aramex', title: 'أرامكس', titleAr: 'مقر أرامكس الرئيسي' },
            { src: 'images/projects/neon/aramex/photo1703403285 (7).jpeg', category: 'neon', subcategory: 'aramex', title: 'أرامكس', titleAr: 'مقر أرامكس الرئيسي' },
            { src: 'images/projects/neon/aramex/photo1704184693.jpeg', category: 'neon', subcategory: 'aramex', title: 'أرامكس', titleAr: 'مقر أرامكس الرئيسي' },

            // NEON - GAMES (114 images - showing key ones)
            { src: 'images/projects/neon/games/Gamer Neon Sign, Game Controller Led Sign, Game Player Led Light, Gaming Neon Light, Game Controller Room Wall Decor, Arcade Studio Led Sign.jpeg', category: 'games', subcategory: 'games', title: 'ألعاب نيون', titleAr: 'نيون ألعاب', featured: true },
            { src: 'images/projects/neon/games/Dragon Ball Goku Neon Sign - Energize Your Space.jpeg', category: 'games', subcategory: 'anime', title: 'دراغون بول', titleAr: 'نيون أنيمي' },
            { src: 'images/projects/neon/games/Naruto Uzumaki Naruto Neon Sign - Illuminate Your Ninja Way.jpeg', category: 'games', subcategory: 'anime', title: 'ناروتو', titleAr: 'نيون أنيمي' },
            { src: 'images/projects/neon/games/Game Controller Neon Sign, Controller Led Sign, Game Player Led Light, Gamer Neon Light, Gaming Room Wall Decor, Arcade Neon Sign, Best Gift.jpeg', category: 'games', subcategory: 'games', title: 'كنترولر', titleAr: 'نيون ألعاب' },
            { src: 'images/projects/neon/games/Football Fire neon sign - 250cm.jpeg', category: 'games', subcategory: 'sports', title: 'كرة قدم', titleAr: 'نيون رياضي' },
            { src: 'images/projects/neon/games/Basketball Hoop Neon Sign, Basketball Ball Neon Light, Basketball Player LED Sign, Basket Ball LED Light, Sport Fan Club Room Wall Decor.jpeg', category: 'games', subcategory: 'sports', title: 'كرة سلة', titleAr: 'نيون رياضي' },
            { src: 'images/projects/neon/games/Cycling Neon Sign, Biker Led Sign, Bicycle Led Light, Mountain Bike Neon Light, Bicycle Racing Wall Art Light, Cyclist Home Wall Decor.jpeg', category: 'games', subcategory: 'sports', title: 'دراجات', titleAr: 'نيون رياضي' },
            { src: 'images/projects/neon/games/Car Neon Sign, Luxury Car Led Sign, Sport Car Led Light, Racing Car Neon Light, Driver Room Wall Decor, Racer Neon Light, Man Cave Led Light.jpeg', category: 'games', subcategory: 'cars', title: 'سيارات', titleAr: 'نيون سيارات' },
            { src: 'images/projects/neon/games/Lamborghini Aventador SV Neon Sign - 90cm (3ft) _ Purple _ Cut to Shape.jpeg', category: 'games', subcategory: 'cars', title: 'لامبورغيني', titleAr: 'نيون سيارات' },
            { src: 'images/projects/neon/games/Climbing Spider-Man Neon Sign.jpeg', category: 'games', subcategory: 'characters', title: 'سبايدرمان', titleAr: 'نيون شخصيات' },
            { src: 'images/projects/neon/games/FC Barcelona Neon Sign - Midi.jpeg', category: 'games', subcategory: 'sports', title: 'برشلونة', titleAr: 'نيون رياضي' },
            { src: 'images/projects/neon/games/Goku Dragonball Z Lighted Decor.jpeg', category: 'games', subcategory: 'anime', title: 'غوكو', titleAr: 'نيون أنيمي' },
            { src: 'images/projects/neon/games/Neon Game Sign Game Zone Neon Sign Led Light.jpeg', category: 'games', subcategory: 'games', title: 'منطقة الألعاب', titleAr: 'نيون ألعاب' },
            { src: 'images/projects/neon/games/Playstation logo - LED Neon skilt - 50x40cm _ Yellow.jpeg', category: 'games', subcategory: 'games', title: 'بلايستيشن', titleAr: 'نيون ألعاب' },
            { src: 'images/projects/neon/games/HD Fortnite Blue Neon Logo PNG.jpeg', category: 'games', subcategory: 'games', title: 'فورتنايت', titleAr: 'نيون ألعاب' },
            { src: 'images/projects/neon/games/Gamer Heartbeat LED Neon Sign _ Best Gaming Room Decor - 36 x 12 in _ Blue.jpeg', category: 'games', subcategory: 'games', title: 'نبض اللاعب', titleAr: 'نيون ألعاب' },
            { src: 'images/projects/neon/games/Illuminate Your Space with Messi Neon Brilliance ⚽✨.jpeg', category: 'games', subcategory: 'sports', title: 'ميسي', titleAr: 'نيون رياضي' },
            { src: 'images/projects/neon/games/gojo satoru —Jujutsu Kaisen.jpeg', category: 'games', subcategory: 'anime', title: 'جوجو', titleAr: 'نيون أنيمي' },
            { src: 'images/projects/neon/games/Shoyo Hinata V1 LED Light.jpeg', category: 'games', subcategory: 'anime', title: 'هيناتا', titleAr: 'نيون أنيمي' },
            { src: 'images/projects/neon/games/Motorcyclist neon Sign, Christmas gift, Motorbike Neon Sign, Biker Led Sign, Game Room Wall Decor, Dirt Bike Racer Neon Light,Motorcycle led.jpeg', category: 'games', subcategory: 'cars', title: 'دراجة نارية', titleAr: 'نيون سيارات' },
            { src: 'images/projects/neon/games/Solitaire Neon Sign, Poker Cards Led Light, Casino Neon Light, Casino Logo Open Welcome Neon Sign, Casino Bar Club Neon Light Wall Decor.jpeg', category: 'games', subcategory: 'games', title: 'ورق لعب', titleAr: 'نيون ألعاب' },
            { src: 'images/projects/neon/games/Dripping Game Controller Neon Sign, Dripping Controller Led Sign, Game Player Led Light, Gamer Neon Light, Gaming Room Wall Decor, Best Gift.jpeg', category: 'games', subcategory: 'games', title: 'كنترولر', titleAr: 'نيون ألعاب' },
            { src: 'images/projects/neon/games/Neonflex logo csgo.jpeg', category: 'games', subcategory: 'games', title: 'CSGO', titleAr: 'نيون ألعاب' },
            { src: 'images/projects/neon/games/download.jpeg', category: 'games', subcategory: 'games', title: 'نيون ألعاب', titleAr: 'نيون ألعاب' },
            { src: 'images/projects/neon/games/download (1).jpeg', category: 'games', subcategory: 'games', title: 'نيون ألعاب', titleAr: 'نيون ألعاب' },
            { src: 'images/projects/neon/games/download (3).jpeg', category: 'games', subcategory: 'games', title: 'نيون ألعاب', titleAr: 'نيون ألعاب' },
            { src: 'images/projects/neon/games/download (4).jpeg', category: 'games', subcategory: 'games', title: 'نيون ألعاب', titleAr: 'نيون ألعاب' },
            { src: 'images/projects/neon/games/download (6).jpeg', category: 'games', subcategory: 'games', title: 'نيون ألعاب', titleAr: 'نيون ألعاب' },
            { src: 'images/projects/neon/games/download (7).jpeg', category: 'games', subcategory: 'games', title: 'نيون ألعاب', titleAr: 'نيون ألعاب' },
            { src: 'images/projects/neon/games/download (8).jpeg', category: 'games', subcategory: 'games', title: 'نيون ألعاب', titleAr: 'نيون ألعاب' },

            // NEON - SNAPCHAT (11 images)
            { src: 'images/projects/neon/snapchat/5922293163252976664.jpg', category: 'neon', subcategory: 'snapchat', title: 'سناب شات', titleAr: 'مقر سناب شات', featured: true },
            { src: 'images/projects/neon/snapchat/5922293163252976666.jpg', category: 'neon', subcategory: 'snapchat', title: 'سناب شات', titleAr: 'مقر سناب شات' },
            { src: 'images/projects/neon/snapchat/5922293163252976667.jpg', category: 'neon', subcategory: 'snapchat', title: 'سناب شات', titleAr: 'مقر سناب شات' },
            { src: 'images/projects/neon/snapchat/5895411916426298955.jpg', category: 'neon', subcategory: 'snapchat', title: 'سناب شات', titleAr: 'مقر سناب شات' },
            { src: 'images/projects/neon/snapchat/5895411916426298956.jpg', category: 'neon', subcategory: 'snapchat', title: 'سناب شات', titleAr: 'مقر سناب شات' },
            { src: 'images/projects/neon/snapchat/5895411916426298959.jpg', category: 'neon', subcategory: 'snapchat', title: 'سناب شات', titleAr: 'مقر سناب شات' },
            { src: 'images/projects/neon/snapchat/5895411916426298962.jpg', category: 'neon', subcategory: 'snapchat', title: 'سناب شات', titleAr: 'مقر سناب شات' },
            { src: 'images/projects/neon/snapchat/5895411916426298963.jpg', category: 'neon', subcategory: 'snapchat', title: 'سناب شات', titleAr: 'مقر سناب شات' },
            { src: 'images/projects/neon/snapchat/WhatsApp Image 2024-10-28 at 6.25.57 PM.jpeg', category: 'neon', subcategory: 'snapchat', title: 'سناب شات', titleAr: 'مقر سناب شات' },
            { src: 'images/projects/neon/snapchat/WhatsApp Image 2024-10-28 at 6.25.58 PM.jpeg', category: 'neon', subcategory: 'snapchat', title: 'سناب شات', titleAr: 'مقر سناب شات' },
            { src: 'images/projects/neon/snapchat/WhatsApp Image 2024-10-28 at 6.25.58 PM (1).jpeg', category: 'neon', subcategory: 'snapchat', title: 'سناب شات', titleAr: 'مقر سناب شات' },

            // NEON - COFFEE (18 images)
            { src: 'images/projects/neon/coffee/photo1700726522.jpeg', category: 'coffee', subcategory: 'coffee', title: 'نيون مقاهي', titleAr: 'نيون المقاهي', featured: true },
            { src: 'images/projects/neon/coffee/photo1700726522 (1).jpeg', category: 'coffee', subcategory: 'coffee', title: 'نيون مقاهي', titleAr: 'نيون المقاهي' },
            { src: 'images/projects/neon/coffee/photo1700726522 (3).jpeg', category: 'coffee', subcategory: 'coffee', title: 'نيون مقاهي', titleAr: 'نيون المقاهي' },
            { src: 'images/projects/neon/coffee/Fun Neon Teapot Stone Coaster.jpeg', category: 'coffee', subcategory: 'coffee', title: 'إبريق شاي', titleAr: 'نيون المقاهي' },
            { src: 'images/projects/neon/coffee/Tea Time Neon Sign, DIY Neon Sign, Room Decor, Neon Sign Ideas.jpeg', category: 'coffee', subcategory: 'coffee', title: 'وقت الشاي', titleAr: 'نيون المقاهي' },
            { src: 'images/projects/neon/coffee/neon blue teapot _ bule azul neon.jpeg', category: 'coffee', subcategory: 'coffee', title: 'إبريق أزرق', titleAr: 'نيون المقاهي' },
            { src: 'images/projects/neon/coffee/Coffee neon banner cup sign on wall vector image on VectorStock.jpg', category: 'coffee', subcategory: 'coffee', title: 'قهوة', titleAr: 'نيون المقاهي' },
            { src: 'images/projects/neon/coffee/Bubble Tea Neon Sign, Boba Tea Neon Light, Milk Tea Led Sign, Tea Drink Led Light, Nursery Room Wall Decor, Cafe Neon Light, Coffee Led Sign.jpeg', category: 'coffee', subcategory: 'coffee', title: 'بوبا تي', titleAr: 'نيون المقاهي' },
            { src: 'images/projects/neon/coffee/Croissant and coffee neon sign, breakfast led neon sign, bakery neon lights, baking light up sign, cafe decor, cup of tea sign.jpg', category: 'coffee', subcategory: 'coffee', title: 'كرواسون', titleAr: 'نيون المقاهي' },
            { src: 'images/projects/neon/coffee/Croissant neon light icon.jpg', category: 'coffee', subcategory: 'coffee', title: 'كرواسون', titleAr: 'نيون المقاهي' },
            { src: 'images/projects/neon/coffee/Churros neon sign, cup of tea with churro led neon, coffee with bakery led light, custom fried dough light sign, churros shop decor.jpg', category: 'coffee', subcategory: 'coffee', title: 'تشوروز', titleAr: 'نيون المقاهي' },
            { src: 'images/projects/neon/coffee/Custom Neon Signs _ Customized Led Neon Lights - NeonGrand.jpg', category: 'coffee', subcategory: 'coffee', title: 'نيون مخصص', titleAr: 'نيون المقاهي' },
            { src: 'images/projects/neon/coffee/Tea pot and tea glass ledneon - 100 cm _ Warm White.jpeg', category: 'coffee', subcategory: 'coffee', title: 'إبريق وكوب', titleAr: 'نيون المقاهي' },
            { src: 'images/projects/neon/coffee/WhatsApp Image 2023-11-12 at 3.43.27 PM.jpeg', category: 'coffee', subcategory: 'coffee', title: 'نيون مقاهي', titleAr: 'نيون المقاهي' },

            // NEON - NATIONAL (15 images)
            { src: 'images/projects/neon/national/5922293163252976670.jpg', category: 'national', subcategory: 'national', title: 'اليوم الوطني', titleAr: 'اليوم الوطني السعودي', featured: true },
            { src: 'images/projects/neon/national/5922293163252976671.jpg', category: 'national', subcategory: 'national', title: 'اليوم الوطني', titleAr: 'اليوم الوطني السعودي' },
            { src: 'images/projects/neon/national/5922293163252976672.jpg', category: 'national', subcategory: 'national', title: 'اليوم الوطني', titleAr: 'اليوم الوطني السعودي' },
            { src: 'images/projects/neon/national/5922293163252976689.jpg', category: 'national', subcategory: 'national', title: 'اليوم الوطني', titleAr: 'اليوم الوطني السعودي' },
            { src: 'images/projects/neon/national/5922293163252976690.jpg', category: 'national', subcategory: 'national', title: 'اليوم الوطني', titleAr: 'اليوم الوطني السعودي' },
            { src: 'images/projects/neon/national/5922293163252976691.jpg', category: 'national', subcategory: 'national', title: 'اليوم الوطني', titleAr: 'اليوم الوطني السعودي' },
            { src: 'images/projects/neon/national/5922293163252976693.jpg', category: 'national', subcategory: 'national', title: 'اليوم الوطني', titleAr: 'اليوم الوطني السعودي' },
            { src: 'images/projects/neon/national/5922293163252976694.jpg', category: 'national', subcategory: 'national', title: 'اليوم الوطني', titleAr: 'اليوم الوطني السعودي' },
            { src: 'images/projects/neon/national/5947220891442203726 (1).jpg', category: 'national', subcategory: 'national', title: 'اليوم الوطني', titleAr: 'اليوم الوطني السعودي' },
            { src: 'images/projects/neon/national/5947220891442203727 (1).jpg', category: 'national', subcategory: 'national', title: 'اليوم الوطني', titleAr: 'اليوم الوطني السعودي' },
            { src: 'images/projects/neon/national/5947220891442203728 (1).jpg', category: 'national', subcategory: 'national', title: 'اليوم الوطني', titleAr: 'اليوم الوطني السعودي' },
            { src: 'images/projects/neon/national/5947220891442203729.jpg', category: 'national', subcategory: 'national', title: 'اليوم الوطني', titleAr: 'اليوم الوطني السعودي' },
            { src: 'images/projects/neon/national/5947220891442203730 (1).jpg', category: 'national', subcategory: 'national', title: 'اليوم الوطني', titleAr: 'اليوم الوطني السعودي' },
            { src: 'images/projects/neon/national/5947220891442203731 (1).jpg', category: 'national', subcategory: 'national', title: 'اليوم الوطني', titleAr: 'اليوم الوطني السعودي' },

            // NEON - JAMEIA (9 images)
            { src: 'images/projects/neon/jameia/5924573395746409183.jpg', category: 'neon', subcategory: 'jameia', title: 'جمعية', titleAr: 'جمعية خيرية', featured: true },
            { src: 'images/projects/neon/jameia/5924573395746409179 (1).jpg', category: 'neon', subcategory: 'jameia', title: 'جمعية', titleAr: 'جمعية خيرية' },
            { src: 'images/projects/neon/jameia/5924573395746409180 (1).jpg', category: 'neon', subcategory: 'jameia', title: 'جمعية', titleAr: 'جمعية خيرية' },
            { src: 'images/projects/neon/jameia/5924573395746409181 (1).jpg', category: 'neon', subcategory: 'jameia', title: 'جمعية', titleAr: 'جمعية خيرية' },
            { src: 'images/projects/neon/jameia/5924573395746409182.jpg', category: 'neon', subcategory: 'jameia', title: 'جمعية', titleAr: 'جمعية خيرية' },
            { src: 'images/projects/neon/jameia/5924573395746409184.jpg', category: 'neon', subcategory: 'jameia', title: 'جمعية', titleAr: 'جمعية خيرية' },
            { src: 'images/projects/neon/jameia/5924573395746409185 (1).jpg', category: 'neon', subcategory: 'jameia', title: 'جمعية', titleAr: 'جمعية خيرية' },
            { src: 'images/projects/neon/jameia/5924573395746409186 (1).jpg', category: 'neon', subcategory: 'jameia', title: 'جمعية', titleAr: 'جمعية خيرية' },
            { src: 'images/projects/neon/jameia/WhatsApp Image 2025-11-15 at 3.20.22 PM.jpeg', category: 'neon', subcategory: 'jameia', title: 'جمعية', titleAr: 'جمعية خيرية' },

            // NEON - SHAWARMA (9 images)
            { src: 'images/projects/neon/shawarma/5812213825762609017.jpg', category: 'neon', subcategory: 'shawarma', title: 'شاورما ناهس', titleAr: 'شاورما ناهس', featured: true },
            { src: 'images/projects/neon/shawarma/5812213825762609012.jpg', category: 'neon', subcategory: 'shawarma', title: 'شاورما ناهس', titleAr: 'شاورما ناهس' },
            { src: 'images/projects/neon/shawarma/5812213825762609013.jpg', category: 'neon', subcategory: 'shawarma', title: 'شاورما ناهس', titleAr: 'شاورما ناهس' },
            { src: 'images/projects/neon/shawarma/5812213825762609018.jpg', category: 'neon', subcategory: 'shawarma', title: 'شاورما ناهس', titleAr: 'شاورما ناهس' },
            { src: 'images/projects/neon/shawarma/5812213825762609021.jpg', category: 'neon', subcategory: 'shawarma', title: 'شاورما ناهس', titleAr: 'شاورما ناهس' },
            { src: 'images/projects/neon/shawarma/5812213825762609022.jpg', category: 'neon', subcategory: 'shawarma', title: 'شاورما ناهس', titleAr: 'شاورما ناهس' },
            { src: 'images/projects/neon/shawarma/5863817406852484093.jpg', category: 'neon', subcategory: 'shawarma', title: 'شاورما ناهس', titleAr: 'شاورما ناهس' },
            { src: 'images/projects/neon/shawarma/5863817406852484095.jpg', category: 'neon', subcategory: 'shawarma', title: 'شاورما ناهس', titleAr: 'شاورما ناهس' },
            { src: 'images/projects/neon/shawarma/5902344487563282516.jpg', category: 'neon', subcategory: 'shawarma', title: 'شاورما ناهس', titleAr: 'شاورما ناهس' },

            // NEON - CASE CLOSED (8 images)
            { src: 'images/projects/neon/case-closed/2.1.png', category: 'neon', subcategory: 'case-closed', title: 'Case Closed', titleAr: 'كيس كلوزد', featured: true },
            { src: 'images/projects/neon/case-closed/2.2.png', category: 'neon', subcategory: 'case-closed', title: 'Case Closed', titleAr: 'كيس كلوزد' },
            { src: 'images/projects/neon/case-closed/2.3.png', category: 'neon', subcategory: 'case-closed', title: 'Case Closed', titleAr: 'كيس كلوزد' },
            { src: 'images/projects/neon/case-closed/2.4.png', category: 'neon', subcategory: 'case-closed', title: 'Case Closed', titleAr: 'كيس كلوزد' },
            { src: 'images/projects/neon/case-closed/2.5.png', category: 'neon', subcategory: 'case-closed', title: 'Case Closed', titleAr: 'كيس كلوزد' },
            { src: 'images/projects/neon/case-closed/2.6.png', category: 'neon', subcategory: 'case-closed', title: 'Case Closed', titleAr: 'كيس كلوزد' },
            { src: 'images/projects/neon/case-closed/2.7.png', category: 'neon', subcategory: 'case-closed', title: 'Case Closed', titleAr: 'كيس كلوزد' },
            { src: 'images/projects/neon/case-closed/2.8.png', category: 'neon', subcategory: 'case-closed', title: 'Case Closed', titleAr: 'كيس كلوزد' },

            // NEON - RAMADAN (7 images)
            { src: 'images/projects/neon/ramadan/5915536982124119488.jpg', category: 'national', subcategory: 'ramadan', title: 'رمضان', titleAr: 'تصاميم رمضان', featured: true },
            { src: 'images/projects/neon/ramadan/5915536982124119481.jpg', category: 'national', subcategory: 'ramadan', title: 'رمضان', titleAr: 'تصاميم رمضان' },
            { src: 'images/projects/neon/ramadan/5915536982124119482.jpg', category: 'national', subcategory: 'ramadan', title: 'رمضان', titleAr: 'تصاميم رمضان' },
            { src: 'images/projects/neon/ramadan/5915536982124119483.jpg', category: 'national', subcategory: 'ramadan', title: 'رمضان', titleAr: 'تصاميم رمضان' },
            { src: 'images/projects/neon/ramadan/5915536982124119484.jpg', category: 'national', subcategory: 'ramadan', title: 'رمضان', titleAr: 'تصاميم رمضان' },
            { src: 'images/projects/neon/ramadan/5915536982124119485.jpg', category: 'national', subcategory: 'ramadan', title: 'رمضان', titleAr: 'تصاميم رمضان' },
            { src: 'images/projects/neon/ramadan/5915536982124119487.jpg', category: 'national', subcategory: 'ramadan', title: 'رمضان', titleAr: 'تصاميم رمضان' },

            // NEON - GENERAL (6 images)
            { src: 'images/projects/neon/general/5859369607440221181.jpg', category: 'neon', subcategory: 'general', title: 'نيون عام', titleAr: 'تصاميم متنوعة', featured: true },
            { src: 'images/projects/neon/general/5859369607440221182.jpg', category: 'neon', subcategory: 'general', title: 'نيون عام', titleAr: 'تصاميم متنوعة' },
            { src: 'images/projects/neon/general/5859369607440221183.jpg', category: 'neon', subcategory: 'general', title: 'نيون عام', titleAr: 'تصاميم متنوعة' },
            { src: 'images/projects/neon/general/Fire Neon Sign Flame Led Light - Red _ 27 x 29.jpeg', category: 'neon', subcategory: 'general', title: 'نار', titleAr: 'تصاميم متنوعة' },
            { src: 'images/projects/neon/general/p1 2024-06-10 at 12.37.23 PM.jpeg', category: 'neon', subcategory: 'general', title: 'نيون عام', titleAr: 'تصاميم متنوعة' },
            { src: 'images/projects/neon/general/P32024-06-10 at 12.37.31 PM (1).jpeg', category: 'neon', subcategory: 'general', title: 'نيون عام', titleAr: 'تصاميم متنوعة' },

            // NEON - BOWLING (5 images)
            { src: 'images/projects/neon/bowling/5922293163252976682.jpg', category: 'neon', subcategory: 'bowling', title: 'بولينج', titleAr: 'صالة بولينج', featured: true },
            { src: 'images/projects/neon/bowling/5922293163252976683.jpg', category: 'neon', subcategory: 'bowling', title: 'بولينج', titleAr: 'صالة بولينج' },
            { src: 'images/projects/neon/bowling/5922293163252976684.jpg', category: 'neon', subcategory: 'bowling', title: 'بولينج', titleAr: 'صالة بولينج' },
            { src: 'images/projects/neon/bowling/5922293163252976685.jpg', category: 'neon', subcategory: 'bowling', title: 'بولينج', titleAr: 'صالة بولينج' },
            { src: 'images/projects/neon/bowling/5922293163252976686.jpg', category: 'neon', subcategory: 'bowling', title: 'بولينج', titleAr: 'صالة بولينج' },

            // NEON - NOUQ (3 images)
            { src: 'images/projects/neon/nouq/5922293163252976720 (1).jpg', category: 'neon', subcategory: 'nouq', title: 'نوق', titleAr: 'شركة نوق', featured: true },
            { src: 'images/projects/neon/nouq/5922293163252976721 (1).jpg', category: 'neon', subcategory: 'nouq', title: 'نوق', titleAr: 'شركة نوق' },
            { src: 'images/projects/neon/nouq/5922293163252976722 (1).jpg', category: 'neon', subcategory: 'nouq', title: 'نوق', titleAr: 'شركة نوق' },

            // NEON - ENTRANCE (3 images)
            { src: 'images/projects/neon/entrance/WhatsApp Image 2024-09-15 at 3.13.30 AM.jpeg', category: 'neon', subcategory: 'entrance', title: 'مداخل', titleAr: 'مداخل ضوئية', featured: true },
            { src: 'images/projects/neon/entrance/WhatsApp Image 2024-09-15 at 3.13.30 AM (1).jpeg', category: 'neon', subcategory: 'entrance', title: 'مداخل', titleAr: 'مداخل ضوئية' },
            { src: 'images/projects/neon/entrance/WhatsApp Image 2024-09-15 at 3.13.30 AM (4).jpeg', category: 'neon', subcategory: 'entrance', title: 'مداخل', titleAr: 'مداخل ضوئية' },

                // NEON - WINK BURGER
                { src: 'images/Neon Project/WINK BURGER/wink_burger_1.jpg', category: 'neon', subcategory: 'wink-burger', title: 'Wink Burger', titleAr: 'وينك برجر', featured: true },
                { src: 'images/Neon Project/WINK BURGER/wink_burger_2.jpg', category: 'neon', subcategory: 'wink-burger', title: 'Wink Burger', titleAr: 'وينك برجر' }
            ];
        }

        // Shuffle for variety
        this.shuffleArray(this.allImages);

        // Put featured items first
        this.allImages.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

        this.filteredImages = [...this.allImages];
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    init() {
        if (!this.gallery) return;

        this.setupFilters();
        this.setupViewToggle();
        this.setupSearch();
        this.setupLoadMore();
        this.setupLightbox();
        this.setupLazyLoading();

        // Initial render
        setTimeout(() => {
            this.renderGallery();
            if (this.galleryLoading) this.galleryLoading.classList.add('hidden');
        }, 500);
    }

    setupFilters() {
        // Main filter tabs
        document.querySelectorAll('.filter-tab').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.filter;
                this.currentPage = 0;
                this.filterImages();
                this.renderGallery();
            });
        });

        // Stat pills
        document.querySelectorAll('.stat-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                const filter = pill.dataset.filter;
                this.currentFilter = filter;
                this.currentPage = 0;
                document.querySelectorAll('.filter-tab').forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.filter === filter);
                });
                this.filterImages();
                this.renderGallery();
            });
        });
    }

    setupViewToggle() {
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentView = btn.dataset.view;
                this.gallery.dataset.view = this.currentView;
            });
        });
    }

    setupSearch() {
        if (!this.searchInput) return;

        let debounceTimer;
        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                this.searchQuery = e.target.value.toLowerCase();
                this.currentPage = 0;
                this.filterImages();
                this.renderGallery();
            }, 300);
        });
    }

    filterImages() {
        this.filteredImages = this.allImages.filter(img => {
            // Category filter
            if (this.currentFilter !== 'all' && img.category !== this.currentFilter) {
                return false;
            }

            // Search filter
            if (this.searchQuery) {
                const searchText = `${img.title} ${img.titleAr} ${img.category} ${img.subcategory}`.toLowerCase();
                if (!searchText.includes(this.searchQuery)) {
                    return false;
                }
            }

            return true;
        });
    }

    setupLoadMore() {
        if (!this.loadMoreBtn) return;

        this.loadMoreBtn.addEventListener('click', () => {
            this.loadMoreBtn.classList.add('loading');
            setTimeout(() => {
                this.currentPage++;
                this.renderGallery(true);
                this.loadMoreBtn.classList.remove('loading');
            }, 500);
        });
    }

    renderGallery(append = false) {
        const startIndex = 0;
        const endIndex = (this.currentPage + 1) * this.itemsPerPage;
        const imagesToShow = this.filteredImages.slice(startIndex, endIndex);

        if (!append) {
            this.gallery.innerHTML = '';
        }

        const startRender = append ? this.currentPage * this.itemsPerPage : 0;

        imagesToShow.slice(startRender).forEach((img, index) => {
            const item = this.createGalleryItem(img, startRender + index);
            this.gallery.appendChild(item);

            // Stagger animation
            setTimeout(() => {
                item.classList.add('visible');
            }, index * 50);
        });

        // Update progress
        this.updateProgress(imagesToShow.length);

        // Update load more button
        if (endIndex >= this.filteredImages.length) {
            this.loadMoreBtn.classList.add('hidden');
        } else {
            this.loadMoreBtn.classList.remove('hidden');
            const remaining = this.filteredImages.length - endIndex;
            this.remainingCount.textContent = `(${remaining})`;
        }
    }

    createGalleryItem(img, index) {
        const item = document.createElement('div');
        item.className = `gallery-item${img.featured ? ' featured' : ''}`;
        item.dataset.index = index;
        item.dataset.category = img.category;

        // Get folder name for display
        const folderName = this.getCategoryName(img.category);

        item.innerHTML = `
            <div class="item-image">
                <img data-src="${img.src}" alt="${img.titleAr}" loading="lazy">
            </div>
            <div class="item-overlay">
                <span class="item-category">${folderName}</span>
                <h4 class="item-title">${img.titleAr}</h4>
                <span class="item-folder">${img.subcategory}</span>
            </div>
            <div class="view-btn-overlay">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35M11 8v6M8 11h6"/>
                </svg>
            </div>
        `;

        // Click to open lightbox
        item.addEventListener('click', () => {
            this.openLightbox(index);
        });

        // 3D tilt effect
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = '';
        });

        return item;
    }

    getCategoryName(category) {
        const names = {
            'events': 'فعاليات',
            'neon': 'نيون',
            'games': 'ألعاب',
            'coffee': 'مقاهي',
            'national': 'مناسبات'
        };
        return names[category] || category;
    }

    updateProgress(shown) {
        const total = this.filteredImages.length;
        const percentage = (shown / total) * 100;

        if (this.progressBar) {
            this.progressBar.style.setProperty('--progress', `${percentage}%`);
        }
        if (this.progressText) {
            this.progressText.textContent = `${shown} / ${total}`;
        }
    }

    setupLazyLoading() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        }, { rootMargin: '100px' });

        // Observe all lazy images
        const checkImages = () => {
            document.querySelectorAll('.gallery-item img[data-src]').forEach(img => {
                observer.observe(img);
            });
        };

        checkImages();

        // Re-check when new items are added
        const galleryObserver = new MutationObserver(checkImages);
        if (this.gallery) {
            galleryObserver.observe(this.gallery, { childList: true });
        }
    }

    setupLightbox() {
        if (!this.lightbox) return;

        const closeBtn = document.getElementById('lightboxClose');
        const prevBtn = document.getElementById('lightboxPrev');
        const nextBtn = document.getElementById('lightboxNext');
        const backdrop = this.lightbox.querySelector('.lightbox-backdrop');
        const zoomBtn = document.getElementById('zoomBtn');
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        const slideshowBtn = document.getElementById('slideshowBtn');

        closeBtn?.addEventListener('click', () => this.closeLightbox());
        backdrop?.addEventListener('click', () => this.closeLightbox());
        prevBtn?.addEventListener('click', () => this.navigateLightbox(-1));
        nextBtn?.addEventListener('click', () => this.navigateLightbox(1));

        zoomBtn?.addEventListener('click', () => this.toggleZoom());
        fullscreenBtn?.addEventListener('click', () => this.toggleFullscreen());
        slideshowBtn?.addEventListener('click', () => this.toggleSlideshow());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.lightbox.classList.contains('active')) return;

            switch (e.key) {
                case 'Escape': this.closeLightbox(); break;
                case 'ArrowLeft': this.navigateLightbox(1); break;
                case 'ArrowRight': this.navigateLightbox(-1); break;
                case ' ': e.preventDefault(); this.toggleSlideshow(); break;
            }
        });
    }

    openLightbox(index) {
        this.currentLightboxIndex = index;
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.updateLightboxImage();
        this.renderThumbnails();
    }

    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
        this.stopSlideshow();
        this.isZoomed = false;
        document.getElementById('lightboxImage')?.classList.remove('zoomed');
    }

    navigateLightbox(direction) {
        this.currentLightboxIndex += direction;

        if (this.currentLightboxIndex < 0) {
            this.currentLightboxIndex = this.filteredImages.length - 1;
        } else if (this.currentLightboxIndex >= this.filteredImages.length) {
            this.currentLightboxIndex = 0;
        }

        this.updateLightboxImage();
    }

    updateLightboxImage() {
        const img = this.filteredImages[this.currentLightboxIndex];
        if (!img) return;

        const lightboxImg = document.getElementById('lightboxImage');
        const loader = this.lightbox.querySelector('.lightbox-loader');
        const title = document.getElementById('lightboxTitle');
        const category = document.getElementById('lightboxCategory');
        const indexEl = document.getElementById('lightboxIndex');
        const folder = document.getElementById('lightboxFolder');

        loader?.classList.remove('hidden');
        lightboxImg.classList.remove('zoomed');
        this.isZoomed = false;

        lightboxImg.onload = () => {
            loader?.classList.add('hidden');
        };

        lightboxImg.src = img.src;
        lightboxImg.alt = img.titleAr;

        if (title) title.textContent = img.titleAr;
        if (category) category.textContent = this.getCategoryName(img.category);
        if (indexEl) indexEl.textContent = `${this.currentLightboxIndex + 1} / ${this.filteredImages.length}`;
        if (folder) folder.textContent = img.subcategory;

        // Update active thumbnail
        document.querySelectorAll('.thumb-item').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === this.currentLightboxIndex);
        });
    }

    renderThumbnails() {
        const container = document.getElementById('lightboxThumbnails');
        if (!container) return;

        container.innerHTML = '';

        // Show limited thumbnails around current
        const range = 10;
        const start = Math.max(0, this.currentLightboxIndex - range);
        const end = Math.min(this.filteredImages.length, this.currentLightboxIndex + range);

        for (let i = start; i < end; i++) {
            const img = this.filteredImages[i];
            const thumb = document.createElement('div');
            thumb.className = `thumb-item${i === this.currentLightboxIndex ? ' active' : ''}`;
            thumb.innerHTML = `<img src="${img.src}" alt="${img.titleAr}">`;
            thumb.addEventListener('click', () => {
                this.currentLightboxIndex = i;
                this.updateLightboxImage();
            });
            container.appendChild(thumb);
        }
    }

    toggleZoom() {
        const img = document.getElementById('lightboxImage');
        this.isZoomed = !this.isZoomed;
        img?.classList.toggle('zoomed', this.isZoomed);
        document.getElementById('zoomBtn')?.classList.toggle('active', this.isZoomed);
    }

    toggleFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            this.lightbox.requestFullscreen?.();
        }
    }

    toggleSlideshow() {
        const btn = document.getElementById('slideshowBtn');

        if (this.slideshowInterval) {
            this.stopSlideshow();
            btn?.classList.remove('active');
        } else {
            this.slideshowInterval = setInterval(() => {
                this.navigateLightbox(1);
            }, 3000);
            btn?.classList.add('active');
        }
    }

    stopSlideshow() {
        if (this.slideshowInterval) {
            clearInterval(this.slideshowInterval);
            this.slideshowInterval = null;
        }
    }
}

// Initialize Ultimate Galleries (Neon + Events)
document.addEventListener('DOMContentLoaded', () => {
    // Check if we have the new dual gallery setup
    const neonGallery = document.getElementById('neonGallery');
    const eventsGallery = document.getElementById('eventsGallery');

    if (neonGallery && eventsGallery) {
        // New dual gallery setup
        console.log('Initializing dual galleries: Neon + Events');
        new UltimateGallery({
            galleryId: 'neonGallery',
            loadMoreBtnId: 'loadMoreNeonBtn',
            remainingCountId: 'remainingNeonCount',
            categoryFilter: 'neon'
        }).init();

        new UltimateGallery({
            galleryId: 'eventsGallery',
            loadMoreBtnId: 'loadMoreEventsBtn',
            remainingCountId: 'remainingEventsCount',
            categoryFilter: 'events'
        }).init();
    } else {
        // Fallback to single gallery
        new UltimateGallery().init();
    }
});

console.log('Gallery System Loaded - Dual Gallery Mode Ready');
