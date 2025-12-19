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
                    const target = parseInt(el.textContent) || 100;
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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new Preloader().init();
    new ParticleNetwork().init();
    new Navigation().init();
    new StatsCounter().init();
});

console.log('⚡ VOLTAGE Ultimate Loaded');
