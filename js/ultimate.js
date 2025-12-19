/**
 * VOLTAGE Ultimate - Premium Animation Engine
 * Neon Glow | Conference Booth | Wooden Utilities | LED Dynamic Effects
 */

// ============================================================
// CONFIGURATION
// ============================================================
const CONFIG = {
    particles: {
        count: 60,  // Fewer but larger neon bulbs
        colors: [
            { main: '#00ffff', glow: '#00ffff', name: 'cyan' },
            { main: '#ff00ff', glow: '#ff00ff', name: 'magenta' },
            { main: '#00ff88', glow: '#00ff88', name: 'green' },
            { main: '#ffff00', glow: '#ffff00', name: 'yellow' },
            { main: '#ff6600', glow: '#ff4400', name: 'orange' },
            { main: '#ff0066', glow: '#ff0066', name: 'pink' }
        ],
        minSize: 8,
        maxSize: 25,  // Much larger for bulb effect
        speed: 0.3,   // Slower, more floating
        connectionDistance: 200,
        mouseInfluence: 150,
        glowIntensity: 1.5,
        flickerChance: 0.02
    },
    cursor: {
        size: 20,
        trailLength: 8,
        trailDelay: 50
    },
    animations: {
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out'
    }
};

// ============================================================
// PRELOADER
// ============================================================
class Preloader {
    constructor() {
        this.preloader = document.querySelector('.preloader');
        this.progress = document.querySelector('.preloader-progress');
        this.percentage = document.querySelector('.preloader-percentage');
        this.loaded = 0;
        this.total = 100;
    }

    init() {
        this.simulateLoading();
    }

    simulateLoading() {
        const interval = setInterval(() => {
            this.loaded += Math.random() * 15;
            if (this.loaded >= 100) {
                this.loaded = 100;
                clearInterval(interval);
                this.complete();
            }
            this.updateProgress();
        }, 100);
    }

    updateProgress() {
        const percent = Math.floor(this.loaded);
        if (this.progress) {
            this.progress.style.width = `${percent}%`;
        }
        if (this.percentage) {
            this.percentage.textContent = `${percent}%`;
        }
    }

    complete() {
        setTimeout(() => {
            if (this.preloader) {
                this.preloader.classList.add('loaded');
                document.body.classList.add('loaded');

                // Initialize main animations after preloader
                setTimeout(() => {
                    this.preloader.style.display = 'none';
                    initMainAnimations();
                }, 800);
            }
        }, 500);
    }
}

// ============================================================
// CUSTOM CURSOR
// ============================================================
class CustomCursor {
    constructor() {
        this.cursor = document.querySelector('.cursor');
        this.cursorDot = document.querySelector('.cursor-dot');
        this.cursorOutline = document.querySelector('.cursor-outline');
        this.cursorGlow = document.querySelector('.cursor-glow');
        this.trails = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.cursorX = 0;
        this.cursorY = 0;
    }

    init() {
        if (!this.cursor) return;

        // Create trail elements
        for (let i = 0; i < CONFIG.cursor.trailLength; i++) {
            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            trail.style.cssText = `
                position: fixed;
                width: ${8 - i * 0.5}px;
                height: ${8 - i * 0.5}px;
                background: linear-gradient(135deg, var(--neon-cyan), var(--neon-magenta));
                border-radius: 50%;
                pointer-events: none;
                z-index: 9998;
                opacity: ${1 - i * 0.1};
                transform: translate(-50%, -50%);
                transition: transform 0.1s ease;
            `;
            document.body.appendChild(trail);
            this.trails.push({ element: trail, x: 0, y: 0 });
        }

        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('mouseenter', () => this.show());
        document.addEventListener('mouseleave', () => this.hide());

        // Add hover effects for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .portfolio-item, .service-card, .btn');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => this.expand());
            el.addEventListener('mouseleave', () => this.shrink());
        });

        this.animate();
    }

    onMouseMove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
    }

    animate() {
        // Smooth cursor following
        this.cursorX += (this.mouseX - this.cursorX) * 0.15;
        this.cursorY += (this.mouseY - this.cursorY) * 0.15;

        if (this.cursorDot) {
            this.cursorDot.style.left = `${this.mouseX}px`;
            this.cursorDot.style.top = `${this.mouseY}px`;
        }

        if (this.cursorOutline) {
            this.cursorOutline.style.left = `${this.cursorX}px`;
            this.cursorOutline.style.top = `${this.cursorY}px`;
        }

        if (this.cursorGlow) {
            this.cursorGlow.style.left = `${this.cursorX}px`;
            this.cursorGlow.style.top = `${this.cursorY}px`;
        }

        // Update trails
        this.trails.forEach((trail, index) => {
            const delay = (index + 1) * 0.08;
            trail.x += (this.mouseX - trail.x) * (0.15 - delay * 0.01);
            trail.y += (this.mouseY - trail.y) * (0.15 - delay * 0.01);
            trail.element.style.left = `${trail.x}px`;
            trail.element.style.top = `${trail.y}px`;
        });

        requestAnimationFrame(() => this.animate());
    }

    show() {
        if (this.cursor) this.cursor.style.opacity = '1';
        this.trails.forEach(trail => trail.element.style.opacity = '1');
    }

    hide() {
        if (this.cursor) this.cursor.style.opacity = '0';
        this.trails.forEach(trail => trail.element.style.opacity = '0');
    }

    expand() {
        if (this.cursorOutline) {
            this.cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            this.cursorOutline.style.borderColor = 'var(--neon-magenta)';
        }
        if (this.cursorGlow) {
            this.cursorGlow.style.transform = 'translate(-50%, -50%) scale(1.5)';
        }
    }

    shrink() {
        if (this.cursorOutline) {
            this.cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            this.cursorOutline.style.borderColor = 'var(--neon-cyan)';
        }
        if (this.cursorGlow) {
            this.cursorGlow.style.transform = 'translate(-50%, -50%) scale(1)';
        }
    }
}

// ============================================================
// PARTICLE SYSTEM (LED Effect)
// ============================================================
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null };
        this.animationId = null;
    }

    init() {
        if (!this.canvas) return;

        this.resize();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < CONFIG.particles.count; i++) {
            this.particles.push(new Particle(this.canvas, CONFIG.particles));
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        this.particles.forEach((particle, index) => {
            particle.update(this.mouse);
            particle.draw(this.ctx);

            // Connect nearby bulbs with neon wire effect
            for (let j = index + 1; j < this.particles.length; j++) {
                const other = this.particles[j];
                const dx = particle.x - other.x;
                const dy = particle.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < CONFIG.particles.connectionDistance) {
                    const opacity = (1 - distance / CONFIG.particles.connectionDistance) * 0.6;

                    // Create gradient wire between bulbs
                    const gradient = this.ctx.createLinearGradient(
                        particle.x, particle.y,
                        other.x, other.y
                    );

                    // Use colors from both connected bulbs
                    const color1 = particle.mainColor || '#00ffff';
                    const color2 = other.mainColor || '#ff00ff';

                    gradient.addColorStop(0, color1);
                    gradient.addColorStop(0.5, `rgba(255, 255, 255, ${opacity})`);
                    gradient.addColorStop(1, color2);

                    // Outer glow for wire
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.3})`;
                    this.ctx.lineWidth = 4;
                    this.ctx.lineCap = 'round';
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.stroke();

                    // Inner wire
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = gradient;
                    this.ctx.lineWidth = 2;
                    this.ctx.lineCap = 'round';
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.stroke();

                    // Core bright line
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.8})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.stroke();
                }
            }
        });

        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

class NeonBulb {
    constructor(canvas, config) {
        this.canvas = canvas;
        this.config = config;
        this.reset();
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.size = this.config.minSize + Math.random() * (this.config.maxSize - this.config.minSize);
        this.baseSize = this.size;
        this.speedX = (Math.random() - 0.5) * this.config.speed;
        this.speedY = (Math.random() - 0.5) * this.config.speed;

        // Color with glow properties
        const colorData = this.config.colors[Math.floor(Math.random() * this.config.colors.length)];
        this.mainColor = colorData.main;
        this.glowColor = colorData.glow;
        this.colorName = colorData.name;

        // Animation properties
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.015 + Math.random() * 0.015;
        this.flickerState = 1;
        this.flickerTarget = 1;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.01;

        // Bulb shape variation
        this.bulbType = Math.floor(Math.random() * 3); // 0: round, 1: oval, 2: tube
        this.aspectRatio = this.bulbType === 1 ? 0.6 + Math.random() * 0.3 : 1;
    }

    update(mouse) {
        // Smooth floating movement
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;

        // Pulse effect - breathing glow
        this.pulse += this.pulseSpeed;
        const pulseFactor = 0.15;
        this.size = this.baseSize * (1 + Math.sin(this.pulse) * pulseFactor);

        // Neon flicker effect
        if (Math.random() < this.config.flickerChance) {
            this.flickerTarget = 0.3 + Math.random() * 0.4;
            setTimeout(() => {
                this.flickerTarget = 1;
            }, 50 + Math.random() * 100);
        }
        this.flickerState += (this.flickerTarget - this.flickerState) * 0.3;

        // Mouse interaction - bulbs brighten near cursor
        if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.config.mouseInfluence) {
                const force = (this.config.mouseInfluence - distance) / this.config.mouseInfluence;
                // Gentle repulsion
                this.x -= dx * force * 0.015;
                this.y -= dy * force * 0.015;
                // Brighten on approach
                this.size = this.baseSize * (1 + force * 0.5);
            }
        }

        // Boundary check with smooth bounce
        if (this.x < this.size || this.x > this.canvas.width - this.size) {
            this.speedX *= -0.8;
            this.x = Math.max(this.size, Math.min(this.canvas.width - this.size, this.x));
        }
        if (this.y < this.size || this.y > this.canvas.height - this.size) {
            this.speedY *= -0.8;
            this.y = Math.max(this.size, Math.min(this.canvas.height - this.size, this.y));
        }
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 255, g: 255, b: 255 };
    }

    draw(ctx) {
        const rgb = this.hexToRgb(this.mainColor);
        const glowRgb = this.hexToRgb(this.glowColor);
        const intensity = this.flickerState * this.config.glowIntensity;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // === OUTER GLOW (Neon gas effect) ===
        const outerGlowSize = this.size * 4;
        const outerGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, outerGlowSize);
        outerGradient.addColorStop(0, `rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, ${0.4 * intensity})`);
        outerGradient.addColorStop(0.3, `rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, ${0.2 * intensity})`);
        outerGradient.addColorStop(0.6, `rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, ${0.08 * intensity})`);
        outerGradient.addColorStop(1, 'transparent');

        ctx.fillStyle = outerGradient;
        ctx.beginPath();
        ctx.ellipse(0, 0, outerGlowSize, outerGlowSize * this.aspectRatio, 0, 0, Math.PI * 2);
        ctx.fill();

        // === MIDDLE GLOW (Intense neon) ===
        const midGlowSize = this.size * 2.2;
        const midGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, midGlowSize);
        midGradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.8 * intensity})`);
        midGradient.addColorStop(0.4, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.4 * intensity})`);
        midGradient.addColorStop(0.7, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.15 * intensity})`);
        midGradient.addColorStop(1, 'transparent');

        ctx.fillStyle = midGradient;
        ctx.beginPath();
        ctx.ellipse(0, 0, midGlowSize, midGlowSize * this.aspectRatio, 0, 0, Math.PI * 2);
        ctx.fill();

        // === GLASS BULB (Semi-transparent shell) ===
        const bulbGradient = ctx.createRadialGradient(
            -this.size * 0.3, -this.size * 0.3, 0,
            0, 0, this.size
        );
        bulbGradient.addColorStop(0, `rgba(255, 255, 255, ${0.3 * intensity})`);
        bulbGradient.addColorStop(0.3, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.2 * intensity})`);
        bulbGradient.addColorStop(0.7, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.4 * intensity})`);
        bulbGradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.1 * intensity})`);

        ctx.fillStyle = bulbGradient;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size * this.aspectRatio, 0, 0, Math.PI * 2);
        ctx.fill();

        // === GLASS OUTLINE ===
        ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.6 * intensity})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size * this.aspectRatio, 0, 0, Math.PI * 2);
        ctx.stroke();

        // === FILAMENT CORE (Bright center) ===
        const coreSize = this.size * 0.4;
        const coreGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, coreSize);
        coreGradient.addColorStop(0, `rgba(255, 255, 255, ${1 * intensity})`);
        coreGradient.addColorStop(0.3, `rgba(255, 255, 255, ${0.9 * intensity})`);
        coreGradient.addColorStop(0.6, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.8 * intensity})`);
        coreGradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.3 * intensity})`);

        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(0, 0, coreSize, 0, Math.PI * 2);
        ctx.fill();

        // === GLASS REFLECTION (Highlight) ===
        const reflectGradient = ctx.createRadialGradient(
            -this.size * 0.35, -this.size * 0.35, 0,
            -this.size * 0.2, -this.size * 0.2, this.size * 0.4
        );
        reflectGradient.addColorStop(0, `rgba(255, 255, 255, ${0.5 * intensity})`);
        reflectGradient.addColorStop(0.5, `rgba(255, 255, 255, ${0.2 * intensity})`);
        reflectGradient.addColorStop(1, 'transparent');

        ctx.fillStyle = reflectGradient;
        ctx.beginPath();
        ctx.ellipse(-this.size * 0.25, -this.size * 0.25, this.size * 0.3, this.size * 0.2, -0.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

// Alias for compatibility
const Particle = NeonBulb;

// ============================================================
// FLOATING NEON ELEMENTS
// ============================================================
class FloatingElements {
    constructor() {
        this.container = document.querySelector('.floating-elements');
        this.elements = [];
    }

    init() {
        if (!this.container) {
            this.createContainer();
        }
        this.createElements();
        this.animate();
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'floating-elements';
        document.body.appendChild(this.container);
    }

    createElements() {
        const shapes = ['circle', 'square', 'triangle', 'hexagon'];
        const colors = ['var(--neon-cyan)', 'var(--neon-magenta)', 'var(--neon-green)', 'var(--neon-orange)'];

        for (let i = 0; i < 15; i++) {
            const element = document.createElement('div');
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = 20 + Math.random() * 60;

            element.className = `floating-shape floating-${shape}`;
            element.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                border: 2px solid ${color};
                opacity: ${0.1 + Math.random() * 0.3};
                animation: float-${i % 3} ${15 + Math.random() * 20}s infinite ease-in-out;
                animation-delay: ${Math.random() * -20}s;
                filter: drop-shadow(0 0 10px ${color});
            `;

            if (shape === 'circle') {
                element.style.borderRadius = '50%';
            } else if (shape === 'triangle') {
                element.style.width = '0';
                element.style.height = '0';
                element.style.border = 'none';
                element.style.borderLeft = `${size/2}px solid transparent`;
                element.style.borderRight = `${size/2}px solid transparent`;
                element.style.borderBottom = `${size}px solid ${color}`;
            } else if (shape === 'hexagon') {
                element.style.clipPath = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';
            }

            this.container.appendChild(element);
            this.elements.push({
                element,
                x: parseFloat(element.style.left),
                y: parseFloat(element.style.top),
                speedX: (Math.random() - 0.5) * 0.02,
                speedY: (Math.random() - 0.5) * 0.02
            });
        }
    }

    animate() {
        this.elements.forEach(item => {
            item.x += item.speedX;
            item.y += item.speedY;

            if (item.x < -10 || item.x > 110) item.speedX *= -1;
            if (item.y < -10 || item.y > 110) item.speedY *= -1;

            item.element.style.left = `${item.x}%`;
            item.element.style.top = `${item.y}%`;
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ============================================================
// SCROLL ANIMATIONS (GSAP)
// ============================================================
class ScrollAnimations {
    constructor() {
        this.sections = document.querySelectorAll('section');
    }

    init() {
        if (typeof gsap === 'undefined') {
            console.warn('GSAP not loaded');
            return;
        }

        // Register ScrollTrigger if available
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        this.animateNavbar();
        this.animateHero();
        this.animateSections();
        this.animateCards();
        this.animateStats();
        this.animateTimeline();
        this.animateMarquee();
    }

    animateNavbar() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    animateHero() {
        const heroContent = document.querySelector('.hero-content');
        if (!heroContent) return;

        gsap.from('.hero-title', {
            duration: 1.2,
            y: 100,
            opacity: 0,
            ease: 'power4.out'
        });

        gsap.from('.hero-subtitle', {
            duration: 1.2,
            y: 80,
            opacity: 0,
            delay: 0.2,
            ease: 'power4.out'
        });

        gsap.from('.hero-description', {
            duration: 1.2,
            y: 60,
            opacity: 0,
            delay: 0.4,
            ease: 'power4.out'
        });

        gsap.from('.hero-cta', {
            duration: 1.2,
            y: 40,
            opacity: 0,
            delay: 0.6,
            ease: 'power4.out'
        });

        gsap.from('.hero-stats .stat-item', {
            duration: 0.8,
            y: 30,
            opacity: 0,
            stagger: 0.15,
            delay: 0.8,
            ease: 'power3.out'
        });
    }

    animateSections() {
        if (typeof ScrollTrigger === 'undefined') return;

        gsap.utils.toArray('.section-header').forEach(header => {
            gsap.from(header, {
                scrollTrigger: {
                    trigger: header,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                duration: 1,
                y: 50,
                opacity: 0,
                ease: 'power3.out'
            });
        });
    }

    animateCards() {
        if (typeof ScrollTrigger === 'undefined') return;

        // Service cards
        gsap.utils.toArray('.service-card').forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                duration: 0.8,
                y: 80,
                opacity: 0,
                delay: index * 0.1,
                ease: 'power3.out'
            });
        });

        // Portfolio items
        gsap.utils.toArray('.portfolio-item').forEach((item, index) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                duration: 0.8,
                scale: 0.8,
                opacity: 0,
                delay: index * 0.1,
                ease: 'power3.out'
            });
        });

        // About cards
        gsap.utils.toArray('.about-card').forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                duration: 0.8,
                x: index % 2 === 0 ? -50 : 50,
                opacity: 0,
                ease: 'power3.out'
            });
        });
    }

    animateStats() {
        const stats = document.querySelectorAll('.stat-number');

        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target')) || parseInt(stat.textContent);
            stat.setAttribute('data-target', target);

            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.create({
                    trigger: stat,
                    start: 'top 80%',
                    onEnter: () => this.countUp(stat, target),
                    once: true
                });
            } else {
                // Fallback without ScrollTrigger
                setTimeout(() => this.countUp(stat, target), 1000);
            }
        });
    }

    countUp(element, target) {
        let current = 0;
        const increment = target / 60;
        const suffix = element.textContent.includes('+') ? '+' : '';

        const updateCount = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current) + suffix;
                requestAnimationFrame(updateCount);
            } else {
                element.textContent = target + suffix;
            }
        };

        updateCount();
    }

    animateTimeline() {
        if (typeof ScrollTrigger === 'undefined') return;

        gsap.utils.toArray('.timeline-item').forEach((item, index) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                duration: 0.8,
                x: index % 2 === 0 ? -100 : 100,
                opacity: 0,
                ease: 'power3.out'
            });
        });
    }

    animateMarquee() {
        const marquee = document.querySelector('.marquee-content');
        if (!marquee) return;

        // Clone content for seamless loop
        const content = marquee.innerHTML;
        marquee.innerHTML = content + content;
    }
}

// ============================================================
// NAVIGATION
// ============================================================
class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.mobileToggle = document.querySelector('.mobile-toggle');
        this.navLinks = document.querySelector('.nav-links');
        this.navItems = document.querySelectorAll('.nav-link');
    }

    init() {
        this.bindEvents();
        this.handleActiveState();
    }

    bindEvents() {
        // Mobile menu toggle
        if (this.mobileToggle) {
            this.mobileToggle.addEventListener('click', () => this.toggleMobile());
        }

        // Smooth scroll for nav links
        this.navItems.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });

        // Close mobile menu on resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.navLinks) {
                this.navLinks.classList.remove('active');
            }
        });
    }

    toggleMobile() {
        if (this.navLinks) {
            this.navLinks.classList.toggle('active');
        }
        if (this.mobileToggle) {
            this.mobileToggle.classList.toggle('active');
        }
    }

    handleNavClick(e) {
        const href = e.target.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offset = this.navbar ? this.navbar.offsetHeight : 0;
                const top = target.offsetTop - offset;

                window.scrollTo({
                    top: top,
                    behavior: 'smooth'
                });

                // Close mobile menu
                if (this.navLinks) {
                    this.navLinks.classList.remove('active');
                }
            }
        }
    }

    handleActiveState() {
        window.addEventListener('scroll', () => {
            let current = '';
            const sections = document.querySelectorAll('section[id]');

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                if (window.scrollY >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });

            this.navItems.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }
}

// ============================================================
// PORTFOLIO FILTER
// ============================================================
class PortfolioFilter {
    constructor() {
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.portfolioItems = document.querySelectorAll('.portfolio-item');
    }

    init() {
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => this.filter(btn));
        });
    }

    filter(btn) {
        // Update active state
        this.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-filter');

        this.portfolioItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');

            if (category === 'all' || itemCategory === category) {
                gsap.to(item, {
                    duration: 0.5,
                    scale: 1,
                    opacity: 1,
                    ease: 'power3.out'
                });
                item.style.display = 'block';
            } else {
                gsap.to(item, {
                    duration: 0.5,
                    scale: 0.8,
                    opacity: 0,
                    ease: 'power3.out',
                    onComplete: () => {
                        item.style.display = 'none';
                    }
                });
            }
        });
    }
}

// ============================================================
// CONTACT FORM
// ============================================================
class ContactForm {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.inputs = document.querySelectorAll('.form-group input, .form-group textarea');
    }

    init() {
        if (!this.form) return;

        // Floating labels
        this.inputs.forEach(input => {
            input.addEventListener('focus', () => this.handleFocus(input));
            input.addEventListener('blur', () => this.handleBlur(input));

            // Check initial state
            if (input.value) {
                input.parentElement.classList.add('focused');
            }
        });

        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    handleFocus(input) {
        input.parentElement.classList.add('focused');
    }

    handleBlur(input) {
        if (!input.value) {
            input.parentElement.classList.remove('focused');
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        // Show success animation
        const btn = this.form.querySelector('.submit-btn');
        const originalText = btn.innerHTML;

        btn.innerHTML = '<span class="btn-text">جاري الإرسال...</span>';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = '<span class="btn-text">تم الإرسال بنجاح! ✓</span>';
            btn.style.background = 'var(--neon-green)';

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                btn.style.background = '';
                this.form.reset();
                this.inputs.forEach(input => {
                    input.parentElement.classList.remove('focused');
                });
            }, 2000);
        }, 1500);
    }
}

// ============================================================
// NEON TEXT EFFECTS
// ============================================================
class NeonTextEffects {
    constructor() {
        this.neonTexts = document.querySelectorAll('.neon-text, .section-title, .hero-title');
    }

    init() {
        this.neonTexts.forEach(text => {
            this.addFlickerEffect(text);
        });
    }

    addFlickerEffect(element) {
        // Random subtle flicker
        setInterval(() => {
            if (Math.random() > 0.97) {
                element.style.opacity = '0.8';
                setTimeout(() => {
                    element.style.opacity = '1';
                }, 50);
            }
        }, 100);
    }
}

// ============================================================
// PARALLAX EFFECT
// ============================================================
class ParallaxEffect {
    constructor() {
        this.elements = document.querySelectorAll('[data-parallax]');
    }

    init() {
        if (this.elements.length === 0) return;

        window.addEventListener('scroll', () => this.update());
        window.addEventListener('resize', () => this.update());
    }

    update() {
        const scrollY = window.scrollY;

        this.elements.forEach(element => {
            const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
            const offset = scrollY * speed;
            element.style.transform = `translateY(${offset}px)`;
        });
    }
}

// ============================================================
// MAGNETIC BUTTONS
// ============================================================
class MagneticButtons {
    constructor() {
        this.buttons = document.querySelectorAll('.btn, .filter-btn');
    }

    init() {
        this.buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => this.handleMouseMove(e, btn));
            btn.addEventListener('mouseleave', (e) => this.handleMouseLeave(e, btn));
        });
    }

    handleMouseMove(e, btn) {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    }

    handleMouseLeave(e, btn) {
        btn.style.transform = 'translate(0, 0)';
    }
}

// ============================================================
// INITIALIZE
// ============================================================
function initMainAnimations() {
    new ScrollAnimations().init();
    new FloatingElements().init();
    new NeonTextEffects().init();
    new ParallaxEffect().init();
    new MagneticButtons().init();
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize preloader first
    const preloader = new Preloader();
    preloader.init();

    // Initialize cursor
    const cursor = new CustomCursor();
    cursor.init();

    // Initialize particle system
    const particles = new ParticleSystem();
    particles.init();

    // Initialize navigation
    const navigation = new Navigation();
    navigation.init();

    // Initialize portfolio filter
    const portfolio = new PortfolioFilter();
    portfolio.init();

    // Initialize contact form
    const contactForm = new ContactForm();
    contactForm.init();
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loaded class to body when everything is ready
window.addEventListener('load', () => {
    document.body.classList.add('fully-loaded');
});

console.log('⚡ VOLTAGE Ultimate - Premium Animation Engine Loaded');
